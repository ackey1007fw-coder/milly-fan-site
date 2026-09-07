import { isObservationStale, type LiveView } from "./realtimeStore.ts";
import type { StreamScheduleView } from "./useStreamSchedule.ts";
import type { StreamSlot } from "../data/streamSchedule.ts";

const checkedFmt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo", month: "numeric", day: "numeric",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

/** 次回1枠をJSTに変換。期限切れ・過去時刻・不正なURLは優先しない。 */
export function showroomNextSlot(live: LiveView, now: number): StreamSlot | null {
  if (isObservationStale(live.observedAt, now) || live.next.state !== "scheduled") return null;
  const at = typeof live.next.at === "string" ? Date.parse(live.next.at) : NaN;
  if (!Number.isFinite(at) || at <= now) return null;
  try {
    const url = new URL(live.roomUrl ?? "");
    if (url.origin !== "https://www.showroom-live.com" || url.username || url.password) return null;
  } catch { return null; }
  // UTC+09:00は通年固定。ブラウザーのタイムゾーンには依存しない。
  const jst = new Date(at + 9 * 60 * 60 * 1000).toISOString();
  return {
    date: jst.slice(0, 10),
    time: jst.slice(11, 16),
    note: `SHOWROOM登録予定（${checkedFmt.format(new Date(live.observedAt!))} 確認）`,
  };
}

/** SHOWROOMは次回1枠のみ。競合日を混ぜず翌日以降だけ公式で補完する。 */
export function withShowroomNext(
  view: StreamScheduleView,
  live: LiveView,
  now: number,
): StreamScheduleView {
  const next = showroomNextSlot(live, now);
  const source = view.availability === "ok"
    ? "ミスサークル公式の配信予定"
    : view.availability === "loading"
      ? "確認済みの手入力予定（最新情報を取得中）"
      : "確認済みの手入力予定（自動取得できていません）";
  const annotate = (slot: StreamSlot): StreamSlot => ({
    ...slot, note: [slot.note, source].filter(Boolean).join(" / "),
  });
  if (!next) return { ...view, slots: view.slots.map(annotate) };
  return {
    ...view,
    // SHOWROOMが成功したとき、手入力の旧枠は混ぜない。
    slots: [next, ...(view.availability === "ok"
      ? view.slots.filter(slot => slot.date > next.date).map(annotate)
      : [])],
    roomUrl: live.roomUrl,
    availability: "ok",
  };
}
