/**
 * 配信予定（手入力の fallback）。
 *
 * - 決まった予定をここに追記するだけで表示されます。未確認の予定は書かない。
 *   配信時刻を推測・捏造しない。空なら配信予定セクションは非表示になります。
 * - 三次審査の本人配布タイムテーブル（9/3–9/12）は確認済み枠だけを書く。
 *   9/7 06:30〜07:30 と 22:00〜23:00 は本人X（2026-09-06）で確認。
 *   開始 06:30 は SHOWROOM next_live とも一致。ほかの 9/7 枠は書かない。
 *   9/10・9/8昼は未定／なしなので入れない。9/8夜の本人表記 24:00-25:00 は
 *   実時刻の 9/9 0:00 として入れる（`time` は 00:00–23:59 のみ）。
 * - 自動取得（/api/mily-schedule）が成功した場合、表示は公式の予定だけを使います。
 *   手入力は取得失敗時のfallbackです。公式の変更・削除枠を復活させません。
 * - 9/6の残り枠はENTRY 734の配信予定（9/6確認）に合わせ21:30開始へ更新。
 *   公式に終了時刻がないため旧予定の終了時刻は引き継ぎません。
 * - 日付・時刻は JST。確認済み終了時刻がある枠は終了時に非表示にし、
 *   終了時刻が未確認の枠だけ開始から約3時間を表示上限にします。
 */
export type StreamSlot = {
  /** JSTの日付 "2026-08-16" */
  date: string;
  /** 24時間表記 "22:30" */
  time: string;
  /** 確認済みの終了時刻。日をまたぐ場合は開始時刻以下になる */
  endTime?: string;
  /** 任意の補足（例:「特別配信」） */
  note?: string;
};

export const streamSchedule: StreamSlot[] = [
  { date: "2026-09-03", time: "07:30", endTime: "08:00" },
  { date: "2026-09-03", time: "14:40", endTime: "15:20" },
  { date: "2026-09-03", time: "21:00", endTime: "21:50" },
  { date: "2026-09-04", time: "07:00", endTime: "07:40" },
  { date: "2026-09-04", time: "14:50", endTime: "15:10" },
  { date: "2026-09-04", time: "22:30", endTime: "23:30" },
  { date: "2026-09-05", time: "09:00", endTime: "09:20" },
  { date: "2026-09-05", time: "14:30", endTime: "15:20" },
  { date: "2026-09-05", time: "21:00", endTime: "21:50" },
  { date: "2026-09-06", time: "05:30", endTime: "07:00" },
  { date: "2026-09-06", time: "21:30" },
  { date: "2026-09-07", time: "06:30", endTime: "07:30" },
  { date: "2026-09-07", time: "22:00", endTime: "23:00" },
  { date: "2026-09-08", time: "07:00", endTime: "08:00" },
  {
    date: "2026-09-09",
    time: "00:00",
    endTime: "01:00",
    note: "本人表記 24:00-25:00（9/9 0:00-1:00）",
  },
  { date: "2026-09-09", time: "10:00", endTime: "11:00" },
  { date: "2026-09-09", time: "14:40", endTime: "15:20" },
  { date: "2026-09-09", time: "21:30", endTime: "21:50" },
  { date: "2026-09-11", time: "10:00", endTime: "10:30" },
  { date: "2026-09-11", time: "14:50", endTime: "15:20" },
  { date: "2026-09-11", time: "21:00", endTime: "22:00" },
  { date: "2026-09-12", time: "08:00", endTime: "08:30" },
  { date: "2026-09-12", time: "14:40", endTime: "15:10" },
  { date: "2026-09-12", time: "21:00", endTime: "22:00" },
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** 開始からこの時間だけは「配信中」として表示に残す。 */
export const VISIBLE_AFTER_START_MS = 3 * 60 * 60 * 1000;

function isRealCalendarDate(value: string): boolean {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

export function isValidSlot(slot: unknown): slot is StreamSlot {
  if (typeof slot !== "object" || slot === null) return false;
  const candidate = slot as Record<string, unknown>;
  if (typeof candidate.date !== "string" || !DATE_RE.test(candidate.date)) {
    return false;
  }
  if (!isRealCalendarDate(candidate.date)) return false;
  if (typeof candidate.time !== "string" || !TIME_RE.test(candidate.time)) {
    return false;
  }
  return (
    (candidate.endTime === undefined ||
      (typeof candidate.endTime === "string" && TIME_RE.test(candidate.endTime))) &&
    (candidate.note === undefined || typeof candidate.note === "string")
  );
}

export function slotStartMs(slot: StreamSlot): number {
  return new Date(`${slot.date}T${slot.time}:00+09:00`).getTime();
}

/** 確認済み終了時刻。開始時刻以下なら翌日として扱う。 */
export function slotEndMs(slot: StreamSlot): number | null {
  if (!slot.endTime) return null;
  const start = slotStartMs(slot);
  const sameDayEnd = new Date(`${slot.date}T${slot.endTime}:00+09:00`).getTime();
  return sameDayEnd <= start ? sameDayEnd + 24 * 60 * 60 * 1000 : sameDayEnd;
}

/**
 * 手入力→自動取得の順でマージし、重複(date+time)は先勝ち（手入力優先）。
 * 不正な値は除外し、確認済み終了時刻（未確認なら開始から約3時間）を
 * 過ぎた予定は落とし、日時順に並べる。
 */
export function upcomingSlots(
  manual: StreamSlot[],
  auto: unknown[],
  now: number = Date.now(),
): StreamSlot[] {
  const merged = new Map<string, StreamSlot>();
  for (const slot of [...manual, ...auto]) {
    if (!isValidSlot(slot)) continue;
    const key = `${slot.date}T${slot.time}`;
    if (!merged.has(key)) merged.set(key, slot);
  }
  return [...merged.values()]
    .filter(
      (slot) =>
        (slotEndMs(slot) ?? slotStartMs(slot) + VISIBLE_AFTER_START_MS) > now,
    )
    .sort((a, b) => slotStartMs(a) - slotStartMs(b))
    // 三次審査の本人枠は25件。12件だと後半がカレンダーから落ちる。
    .slice(0, 32);
}
