import { streamSchedule, type StreamSlot } from "../../data/streamSchedule.ts";
import { RADIO_TIMEZONE, radioProgram, schedulePhase } from "../../data/radio.ts";
import { createStreamScheduleLoader, toStreamScheduleView } from "../useStreamSchedule.ts";
import { showroomNextSlot, withShowroomNext } from "../showroomSchedule.ts";
import { toLiveView, type LivePayload } from "../realtimeStore.ts";
import type { ScheduleInput } from "./tools.ts";

const TIMEOUT_MS = 8000;
const MAX_JSON_BYTES = 65_536;
const ALLOWED_ENDPOINTS = new Set(["/api/mily-schedule", "/api/mily-live"]);

async function boundedJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json") || !response.body) throw new Error("Invalid response");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_JSON_BYTES) { await reader.cancel(); throw new Error("Response limit"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

function livePayload(value: unknown): LivePayload | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (data.ok !== true || !data.live || typeof data.live !== "object") return null;
  const live = data.live as Record<string, unknown>;
  if (!["live", "offline", "unknown"].includes(String(live.state))) return null;
  const next = data.next && typeof data.next === "object" ? data.next as Record<string, unknown> : {};
  const nextState = next.state === "scheduled" || next.state === "none" ? next.state : "unknown";
  return {
    ok: true,
    roomUrl: typeof data.roomUrl === "string" ? data.roomUrl : null,
    live: { state: live.state as "live" | "offline" | "unknown", observedAt: typeof live.observedAt === "string" ? live.observedAt : null },
    next: { state: nextState, at: typeof next.at === "string" ? next.at : null },
  };
}

/** Reuses the site's existing parsing, TTL, expiry and SHOWROOM-next precedence rules. */
export function createPublicScheduleReader(options: {
  fetcher?: typeof fetch;
  now?: () => number;
  manualSlots?: StreamSlot[];
} = {}) {
  const fetcher = options.fetcher ?? fetch;
  const now = options.now ?? Date.now;
  const manual = options.manualSlots ?? streamSchedule;
  const read = (url: string, signal?: AbortSignal) => {
    if (!ALLOWED_ENDPOINTS.has(url)) throw new Error("Endpoint not allowed");
    return fetcher(url, { method: "GET", credentials: "omit", redirect: "error", headers: { Accept: "application/json" }, signal });
  };
  const loadSchedule = createStreamScheduleLoader({
    now,
    fetcher: async (url, init) => {
      const response = await read(url, init?.signal);
      return { ok: response.ok, status: response.status, json: () => boundedJson(response) };
    },
  });
  const loadLive = async (signal?: AbortSignal): Promise<LivePayload | null> => {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    if (signal?.aborted) cancel();
    signal?.addEventListener("abort", cancel, { once: true });
    const timer = globalThis.setTimeout(cancel, TIMEOUT_MS);
    try {
      const response = await read("/api/mily-live", controller.signal);
      if (!response.ok) return null;
      return livePayload(await boundedJson(response));
    } catch { return null; }
    finally { globalThis.clearTimeout(timer); signal?.removeEventListener("abort", cancel); }
  };
  return async (input: ScheduleInput, signal?: AbortSignal) => {
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    const fetched = input.kind === "radio" ? null : await Promise.all([loadSchedule(), loadLive(signal)]);
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    const at = now();
    const radio = input.kind === "showroom" ? undefined : {
      programName: radioProgram.programName, weekday: radioProgram.weekday,
      scheduledStart: radioProgram.scheduledStart, scheduledEnd: radioProgram.scheduledEnd,
      schedulePhase: schedulePhase(at), sourceUrl: radioProgram.programUrl,
      lastVerifiedAt: radioProgram.lastVerifiedAt, milyAppearanceConfirmed: null,
      notice: "曜日は0=日曜。番組の通常放送枠です。実際の放送・みりぃの出演を確認した情報ではありません。",
    };
    let showroom;
    if (fetched) {
      const [snapshot, payload] = fetched;
      const live = toLiveView(payload, at);
      const next = showroomNextSlot(live, at);
      const view = withShowroomNext(toStreamScheduleView(snapshot, manual, at), live, at);
      showroom = {
        availability: view.availability,
        contestAvailability: snapshot.availability,
        sourceMode: next ? "showroom-next" : snapshot.availability === "ok" ? "contest-official" : "manual-fallback",
        roomUrl: view.roomUrl,
        nextObservedAt: next ? live.observedAt : null,
        slots: view.slots.slice(0, input.limit).map(slot => ({ date: slot.date, time: slot.time, ...(slot.endTime ? { endTime: slot.endTime } : {}), ...(slot.note ? { note: slot.note } : {}) })),
        total: view.slots.length,
        notice: "予定であり配信中の確定情報ではありません。ミスサークル公式予定の成功キャッシュは最大5分。generatedAtは回答生成時刻で、再確認時刻ではありません。",
      };
    }
    return {
      siteType: "unofficial-fan-site", timeZone: RADIO_TIMEZONE,
      generatedAt: new Date(at).toISOString(), sourceUrl: "/support/",
      ...(showroom ? { showroom } : {}), ...(radio ? { radio } : {}),
    };
  };
}

export const loadPublicSchedule = createPublicScheduleReader();
