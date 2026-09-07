import { useEffect, useState } from "react";
import {
  isValidSlot,
  streamSchedule,
  upcomingSlots,
  type StreamSlot,
} from "../data/streamSchedule.ts";
import { useShowroomLive } from "./useMilyRealtimeStatus.ts";
import { withShowroomNext } from "./showroomSchedule.ts";
import type { ScheduleAvailability } from "./supportCalendar.ts";

/**
 * /api/mily-schedule の取得を1か所に集約するフック。
 * - モジュールスコープで共有し、複数コンポーネントで使っても取得は1回
 * - 成功結果は 5 分 TTL でキャッシュ。**失敗はキャッシュしない**ので、
 *   初回失敗のあとも次の利用時に再試行できる
 * - roomUrl は SHOWROOM ドメインのURLだけを通す
 * - 表示中は1分ごと・タブ復帰時に確認し、5分TTL経過後に再取得する
 */

/**
 * `/api/mily-schedule` のresponse contract。
 * room解決や上流取得に失敗しても endpoint は HTTP 200 のまま
 * `{ ok: false, slots: [] }` を返す仕様なので、payloadの `ok` を契約に含める。
 */
type ScheduleResponse = {
  ok?: boolean;
  slots?: StreamSlot[];
  source?: { roomUrl?: string | null };
};

export type StreamScheduleSnapshot = {
  slots: StreamSlot[];
  roomUrl: string | null;
  availability: ScheduleAvailability;
};

type ScheduleFetchResponse = {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
};

type ScheduleFetcher = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<ScheduleFetchResponse>;

type ScheduleTimers = {
  setTimeout: (handler: () => void, ms: number) => number;
  clearTimeout: (id: number) => void;
};

type FetchedSchedule = Omit<StreamScheduleSnapshot, "availability">;

const EMPTY: FetchedSchedule = { slots: [], roomUrl: null };
export const INITIAL_STREAM_SCHEDULE_STATE: StreamScheduleSnapshot = {
  ...EMPTY,
  availability: "loading",
};
const SCHEDULE_TTL_MS = 5 * 60 * 1000;
/** `useMilyRealtimeStatus` と同じclient-side API timeout。 */
export const STREAM_SCHEDULE_TIMEOUT_MS = 8000;

const defaultTimers: ScheduleTimers = {
  setTimeout: (handler, ms) =>
    globalThis.setTimeout(handler, ms) as unknown as number,
  clearTimeout: (id) => globalThis.clearTimeout(id),
};

function verifiedRoomUrl(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const response = data as ScheduleResponse;
  const value = response.source?.roomUrl;
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    return url.origin === "https://www.showroom-live.com" &&
      url.username === "" &&
      url.password === ""
      ? value
      : null;
  } catch {
    return null;
  }
}

function parseScheduleResponse(data: unknown): {
  value: FetchedSchedule;
  success: boolean;
} {
  const roomUrl = verifiedRoomUrl(data);
  if (typeof data !== "object" || data === null) {
    return { value: { slots: [], roomUrl }, success: false };
  }
  const response = data as ScheduleResponse;
  // HTTP 200 でも ok:true 以外は失敗。成功として扱わずキャッシュもしない。
  if (response.ok !== true) {
    return { value: { slots: [], roomUrl }, success: false };
  }
  // 1件でもcontract違反ならresponse全体を利用不能にする。
  // invalid entryを静かに捨てて「成功0件」へ変換しない。
  if (
    !Array.isArray(response.slots) ||
    !response.slots.every((slot) => isValidSlot(slot))
  ) {
    return { value: { slots: [], roomUrl }, success: false };
  }
  return {
    value: { slots: response.slots, roomUrl },
    success: true,
  };
}

export function createStreamScheduleLoader(options?: {
  fetcher?: ScheduleFetcher;
  now?: () => number;
  timeoutMs?: number;
  timers?: ScheduleTimers;
}): () => Promise<StreamScheduleSnapshot> {
  const fetcher = options?.fetcher ?? fetch;
  const now = options?.now ?? Date.now;
  const timeoutMs = options?.timeoutMs ?? STREAM_SCHEDULE_TIMEOUT_MS;
  const timers = options?.timers ?? defaultTimers;
  let cached: { at: number; value: FetchedSchedule } | null = null;
  let inFlight: Promise<StreamScheduleSnapshot> | null = null;

  return function loadSchedule(): Promise<StreamScheduleSnapshot> {
    if (cached && now() - cached.at < SCHEDULE_TTL_MS) {
      return Promise.resolve({ ...cached.value, availability: "ok" });
    }
    if (inFlight) return inFlight;

    const controller = new AbortController();
    const timeoutId = timers.setTimeout(() => controller.abort(), timeoutMs);

    inFlight = Promise.resolve()
      .then(() =>
        fetcher("/api/mily-schedule", { signal: controller.signal }),
      )
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // body読了までtimeoutの対象にする。
        const parsed = parseScheduleResponse(await res.json());
        if (!parsed.success) {
          return { ...parsed.value, availability: "unavailable" as const };
        }
        // 成功だけキャッシュする。
        cached = { at: now(), value: parsed.value };
        return { ...parsed.value, availability: "ok" as const };
      })
      .catch(() => ({ ...EMPTY, availability: "unavailable" as const }))
      .finally(() => {
        timers.clearTimeout(timeoutId);
        inFlight = null;
      });

    return inFlight;
  };
}

const loadStreamSchedule = createStreamScheduleLoader();

export type StreamScheduleView = {
  /** 取得成功時は公式枠のみ。取得失敗時だけ手入力fallback。 */
  slots: StreamSlot[];
  /**
   * `src/data/streamSchedule.ts` の確認済み手入力fallbackだけ。
   * API取得の成否と無関係に確認済みなので、失敗時も表示側で残せる。
   */
  manualSlots: StreamSlot[];
  roomUrl: string | null;
  availability: ScheduleAvailability;
};

/** API結果と確認済み手入力fallbackを既存caller向けshapeへまとめる。 */
export function toStreamScheduleView(
  fetched: StreamScheduleSnapshot,
  manual: StreamSlot[],
  now: number,
): StreamScheduleView {
  return {
    slots: fetched.availability === "ok"
      ? upcomingSlots([], fetched.slots, now)
      : upcomingSlots(manual, [], now),
    manualSlots: upcomingSlots(manual, [], now),
    roomUrl: fetched.roomUrl,
    availability: fetched.availability,
  };
}

export function useStreamSchedule(): StreamScheduleView {
  const live = useShowroomLive();
  const [fetched, setFetched] = useState<StreamScheduleSnapshot>(
    INITIAL_STREAM_SCHEDULE_STATE,
  );

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (document.visibilityState === "hidden") return;
      void loadStreamSchedule().then((result) => {
        if (active) setFetched(result);
      });
    };
    refresh();
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const now = Date.now();
  return withShowroomNext(toStreamScheduleView(fetched, streamSchedule, now), live, now);
}

const dateFmt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  month: "numeric",
  day: "numeric",
  weekday: "short",
});

export function slotStart(slot: StreamSlot): Date {
  return new Date(`${slot.date}T${slot.time}:00+09:00`);
}

export function formatSlotDate(slot: StreamSlot): string {
  return dateFmt.format(slotStart(slot));
}

/** JSTの今日（YYYY-MM-DD） */
export function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(
    new Date(),
  );
}

/**
 * 配信枠の状態。実際のライブ状態は取得していないため、
 * 予定由来の状態なので「開始時刻を過ぎています」という表現に留める。
 * 実ライブ（ただいまSHOWROOMで配信中）は /api/mily-live のみが根拠。
 */
export type SlotStatus = "past-start" | "today" | "upcoming";

export function slotStatus(slot: StreamSlot, now: number = Date.now()): SlotStatus {
  if (slotStart(slot).getTime() <= now) return "past-start";
  if (slot.date === todayKey()) return "today";
  return "upcoming";
}
