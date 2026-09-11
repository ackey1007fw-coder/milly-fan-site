import type { StreamRecap } from "../../data/streamRecaps.ts";
import { buildStreamSongCatalog, selectCatalogSongs } from "../streamSongCatalog.ts";
import type { ReadOnlyTool, ToolResult } from "./registry.ts";

export type ScheduleInput = { kind: "all" | "showroom" | "radio"; limit: number };
export type ToolDependencies = {
  loadRecaps: () => Promise<readonly StreamRecap[]>;
  loadSchedule: (input: ScheduleInput, signal?: AbortSignal) => Promise<unknown>;
};
const LIVE_PATH = "/activities/live/";
const MAX_OUTPUT_CHARS = 12_000;
const pageProperties = {
  limit: { type: "integer", minimum: 1, maximum: 5, default: 3, description: "返す件数。1〜5件。" },
  offset: { type: "integer", minimum: 0, maximum: 10_000, default: 0, description: "検索結果の開始位置。nextOffsetで続きを取得できます。" },
};
const dateProperty = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "日本時間の配信日（YYYY-MM-DD）。" };
const queryProperty = { type: "string", maxLength: 120, description: "公開済み記録を検索する語句。空欄はすべて。" };
const annotations = { readOnlyHint: true, untrustedContentHint: true, consequentialHint: false } as const;
const recordNotice = "非公式ファンサイトの公開済み記録のみ。全配信を網羅した記録ではありません。";
const recapUrl = (id: string) => `${LIVE_PATH}#recap-${encodeURIComponent(id)}`;
const normalize = (value: string) => value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("ja");

class InputError extends Error {}
function inputObject(value: unknown, allowed: readonly string[]): Record<string, unknown> {
  if (value === undefined) return {};
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InputError("引数はオブジェクトで指定してください。");
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some(key => !allowed.includes(key))) throw new InputError("未対応の引数があります。");
  return input;
}
function text(input: Record<string, unknown>, key: string, max = 120): string {
  if (input[key] === undefined) return "";
  if (typeof input[key] !== "string" || input[key].length > max) throw new InputError(`${key} の文字数・型が不正です。`);
  return input[key];
}
function integer(input: Record<string, unknown>, key: string, fallback: number, min: number, max: number): number {
  const value = input[key] === undefined ? fallback : input[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) throw new InputError(`${key} の範囲・型が不正です。`);
  return value;
}
function choice<T extends string>(input: Record<string, unknown>, key: string, choices: readonly T[], fallback: T): T {
  const value = input[key] === undefined ? fallback : input[key];
  if (typeof value !== "string" || !choices.includes(value as T)) throw new InputError(`${key} の値が不正です。`);
  return value as T;
}
function date(input: Record<string, unknown>): string {
  const value = text(input, "date", 10);
  if (input.date === undefined) return "";
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new InputError("実在する配信日をYYYY-MM-DDで指定してください。");
  return value;
}
function page<T>(items: readonly T[], input: Record<string, unknown>) {
  const offset = integer(input, "offset", 0, 0, 10_000);
  const limit = integer(input, "limit", 3, 1, 5);
  return { items: items.slice(offset, offset + limit), total: items.length, offset, nextOffset: offset + limit < items.length ? offset + limit : null };
}
function validatePage(input: Record<string, unknown>) {
  integer(input, "offset", 0, 0, 10_000); integer(input, "limit", 3, 1, 5);
}
function brief(recap: StreamRecap) {
  return { id: recap.id, date: recap.date, theme: recap.theme, broadcastLabel: recap.broadcastLabel, platform: recap.platformLabel, summary: recap.summary, verifiedAt: recap.verifiedAt, sourceUrl: recapUrl(recap.id) };
}
function result(payload: unknown, isError = false): ToolResult {
  const json = JSON.stringify(payload);
  if (json.length > MAX_OUTPUT_CHARS) return result({ error: "OUTPUT_LIMIT", message: "結果が大きすぎます。limitを減らすかsectionを指定してください。", sourceUrl: LIVE_PATH }, true);
  return { content: [{ type: "text", text: json }], ...(isError ? { isError: true as const } : {}) };
}
function checkAbort(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
}
/** Cancellation stops delivery even when a shared read or module import is still settling. */
async function cancellable<T>(work: () => Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return work();
  checkAbort(signal);
  let abort: () => void = () => {};
  const cancelled = new Promise<never>((_, reject) => {
    abort = () => reject(new DOMException("Cancelled", "AbortError"));
    signal.addEventListener("abort", abort, { once: true });
  });
  try { return await Promise.race([Promise.resolve().then(() => { checkAbort(signal); return work(); }), cancelled]); }
  finally { signal.removeEventListener("abort", abort); }
}

export function createReadOnlyTools(deps: ToolDependencies): ReadOnlyTool[] {
  function tool(name: string, description: string, properties: Record<string, unknown>, required: string[], run: (input: Record<string, unknown>, signal?: AbortSignal) => Promise<unknown>): ReadOnlyTool {
    return {
      name, description, annotations,
      inputSchema: { type: "object", properties, required, additionalProperties: false },
      async execute(raw, options) {
        const signal = options?.signal;
        try {
          checkAbort(signal);
          const input = inputObject(raw, Object.keys(properties));
          const payload = await cancellable(() => run(input, signal), signal);
          checkAbort(signal);
          return result(payload);
        } catch (error) {
          if (signal?.aborted || (error instanceof Error && error.name === "AbortError")) return result({ error: "CANCELLED", message: "読み取りを中止しました。" }, true);
          if (error instanceof InputError) return result({ error: "INVALID_ARGUMENT", message: error.message }, true);
          return result({ error: "UNAVAILABLE", message: "現在この記録を取得できません。通常ページを確認してください。", sourceUrl: LIVE_PATH }, true);
        }
      },
    };
  }
  return [
    tool("get_latest_schedule", "みりぃの現在・今後のSHOWROOM予定とラジオ番組の通常枠を読み取ります。予定は実際の配信中・本人出演の確定ではありません。取得失敗時の手入力fallbackを区別します。", {
      kind: { type: "string", enum: ["all", "showroom", "radio"], default: "all" }, limit: pageProperties.limit,
    }, [], async (input, signal) => {
      const kind = choice(input, "kind", ["all", "showroom", "radio"], "all");
      const limit = integer(input, "limit", 3, 1, 5);
      return deps.loadSchedule({ kind, limit }, signal);
    }),
    tool("search_live_archives", "公開済み配信メモを日付・語句・配信サービスで検索します。録画ファイルや全文文字起こしの検索ではありません。sourceUrlから通常の配信メモへ移動できます。", {
      query: queryProperty, date: dateProperty, platform: { type: "string", enum: ["all", "SHOWROOM", "MixChannel"], default: "all" }, ...pageProperties,
    }, [], async input => {
      validatePage(input);
      const terms = normalize(text(input, "query")).split(" ").filter(Boolean);
      const day = date(input);
      const platform = choice(input, "platform", ["all", "SHOWROOM", "MixChannel"], "all");
      const recaps = await deps.loadRecaps();
      const matches = recaps.filter(r => (!day || r.date === day) && (platform === "all" || r.platformLabel === platform) && terms.every(term => normalize(`${r.theme} ${r.summary} ${r.highlights.map(h => `${h.title} ${h.body}`).join(" ")}`).includes(term)));
      return { notice: recordNotice, ...page(matches.map(brief), input) };
    }),
    tool("find_song", "公開メモのsongsに明記された歌唱記録を曲名・歌手・配信日で検索します。リンクは原曲や参考伴奏で、みりぃの歌唱映像ではありません。歌の話題だけでは歌唱とみなしません。", {
      query: queryProperty, artist: { ...queryProperty, description: "歌手名の完全一致。省略時は全歌手。" }, date: dateProperty, ...pageProperties,
    }, [], async input => {
      validatePage(input);
      const query = text(input, "query"); const artist = text(input, "artist"); const day = date(input);
      const recaps = await deps.loadRecaps();
      const catalog = buildStreamSongCatalog(recaps.filter(r => !day || r.date === day));
      const matches = selectCatalogSongs(catalog, query, artist).flatMap(song => song.performances.map(p => ({
        title: song.title, artist: song.artist, recapId: p.id, date: p.date, broadcastLabel: p.broadcastLabel, timestamp: p.timestamp,
        originalSongUrl: song.youtubeUrl,
        ...(song.youtubeVersionNote ? { originalVersionNote: song.youtubeVersionNote } : {}),
        ...(song.karaoke ? { karaokeReference: { youtubeUrl: song.karaoke.youtubeUrl, channel: song.karaoke.channel } } : {}),
        sourceUrl: recapUrl(p.id),
      })));
      matches.sort((a, b) => b.date.localeCompare(a.date) || b.broadcastLabel.localeCompare(a.broadcastLabel, "ja", { numeric: true }) || a.title.localeCompare(b.title, "ja") || a.timestamp.localeCompare(b.timestamp, "en", { numeric: true }));
      return { notice: `${recordNotice} 原曲・参考伴奏へのリンクです。配信での使用音源は未確認。timestampは録画先頭からの目安です。`, ...page(matches, input) };
    }),
    tool("get_live_recap", "search_live_archivesで得たidの公開配信メモを読み取ります。概要・見どころ・歌・タイムラインをsectionで選択できます。過去の次枠案内は現在の予定ではありません。", {
      id: { type: "string", maxLength: 80, pattern: "^\\d{4}-\\d{2}-\\d{2}-[a-z0-9-]+$", description: "検索で得た配信メモid。日付だけでは同日の複数枠を区別できません。" },
      section: { type: "string", enum: ["overview", "highlights", "songs", "timeline"], default: "overview" }, ...pageProperties,
    }, ["id"], async input => {
      validatePage(input);
      const id = text(input, "id", 80);
      if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(id)) throw new InputError("検索結果の配信メモidを指定してください。");
      const section = choice(input, "section", ["overview", "highlights", "songs", "timeline"], "overview");
      const recap = (await deps.loadRecaps()).find(r => r.id === id);
      if (!recap) return { found: false, notice: "該当する公開済み配信メモはありません。", sourceUrl: LIVE_PATH };
      const base = { found: true, notice: recordNotice, ...brief(recap), sourceLabel: recap.sourceLabel, section };
      if (section === "highlights") return { ...base, ...page(recap.highlights.map(h => ({ timestamp: h.timestamp, title: h.title, body: h.body })), input) };
      if (section === "timeline") return { ...base, ...page(recap.timeline.map(t => ({ timestamp: t.timestamp, label: t.label })), input) };
      if (section === "songs") return { ...base, songLinkNotice: "原曲・参考伴奏へのリンクであり、みりぃの歌唱映像ではありません。配信での使用音源は未確認。", ...page((recap.songs ?? []).map(s => ({ title: s.title, artist: s.artist, timestamp: s.timestamp, originalSongUrl: s.youtubeUrl, ...(s.youtubeVersionNote ? { originalVersionNote: s.youtubeVersionNote } : {}), ...(s.karaoke ? { karaokeReference: { youtubeUrl: s.karaoke.youtubeUrl, channel: s.karaoke.channel } } : {}) })), input) };
      return { ...base, transcriptionNote: recap.transcriptionNote, historicalNextNote: recap.nextNote, nextNoteNotice: "配信時点の案内です。現在の予定にはget_latest_scheduleを使ってください。", availableSections: ["overview", "highlights", "songs", "timeline"] };
    }),
  ];
}
