// shared/radio-program.js
//
// FM湘南マジックウェイブ「湘南シーサイドサークル」の確認済み事実と時間判定の
// **単一 source of truth**。
//
// フロント（src/data/radio.ts）と Vercel Function（api/mily-radio-status.js）の
// 両方がここを読む。番組名・曜日・時刻・URL をこのファイル以外に書かない
// （片方だけ更新されて古くなる事故を防ぐ）。
//
// 事実の出所:
//   - 番組名・担当としての Mily（ミリー）の記載: FM湘南マジックウェイブの
//     スタッフページ / 番組ページ（PR #11 で確認）
//   - 放送枠 日曜 10:00–13:00: 同上
//   - lastVerifiedAt: NOW ON AIR の取得・解析が実ネットワークで通ることを
//     2026-08-16 (JST) の probe で確認した日付。
//     放送枠そのものが変わった可能性がある場合は timetableUrl を見て更新する。
//
// 「毎週必ず本人が3時間出演している」とは断定しない。
// 時間帯だけを根拠に本人出演中とは判定しない。

export const RADIO_TIMEZONE = "Asia/Tokyo";

export const radioProgram = {
  programName: "湘南シーサイドサークル",
  /** サイト共有文で番組が最優先のときに使う、確認済みの番組タグ。 */
  shareHashtags: ["#湘南シーサイドサークル", "#ssc"],
  /** JS weekday: 0 = Sunday */
  weekday: 0,
  scheduledStart: "10:00",
  scheduledEnd: "13:00",
  listenUrl: "https://fm-smw.jp/radio",
  nowOnAirSourceUrl: "https://fm-smw.jp/",
  programUrl:
    "https://fm-smw.jp/program/%E3%80%8E-%E6%B9%98%E5%8D%97%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB-%E3%80%8F%E3%80%80%EF%BC%83ssc",
  staffUrl: "https://fm-smw.jp/staff",
  timetableUrl: "https://fm-smw.jp/time-table",
  lastVerifiedAt: "2026-08-16",
};

const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const tokyoClockFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: RADIO_TIMEZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const tokyoDateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: RADIO_TIMEZONE,
});

function partValue(parts, type) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

/** Asia/Tokyo の曜日（0=日）と時分。 */
export function tokyoClock(now = Date.now()) {
  const parts = tokyoClockFmt.formatToParts(new Date(now));
  const weekday = WEEKDAY_INDEX[partValue(parts, "weekday")];
  const hour = Number(partValue(parts, "hour"));
  const minute = Number(partValue(parts, "minute"));
  if (
    weekday === undefined ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute)
  ) {
    throw new Error("failed to read Asia/Tokyo clock");
  }
  return { weekday, hour, minute };
}

/** JST の日付（YYYY-MM-DD）。 */
export function tokyoDate(now = Date.now()) {
  return tokyoDateFmt.format(new Date(now));
}

export function minutesFromMidnight(clock) {
  return clock.hour * 60 + clock.minute;
}

export function parseHm(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) throw new Error(`invalid HH:mm: ${value}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

/** 今日が番組の放送日か（日曜）。出演確定ではない。 */
export function isBroadcastDay(now = Date.now()) {
  return tokyoClock(now).weekday === radioProgram.weekday;
}

/** 今日の放送時間帯か。[start, end) — 10:00 を含み 13:00 は含まない。 */
export function isInScheduledWindow(now = Date.now()) {
  const clock = tokyoClock(now);
  if (clock.weekday !== radioProgram.weekday) return false;
  const current = minutesFromMidnight(clock);
  return (
    current >= parseHm(radioProgram.scheduledStart) &&
    current < parseHm(radioProgram.scheduledEnd)
  );
}

/**
 * 放送日の中での位置。
 *   09:59 → "upcoming" / 10:00 → "window" / 12:59 → "window" / 13:00 → "ended"
 * 放送日でなければ "idle"。
 */
export function schedulePhase(now = Date.now()) {
  const clock = tokyoClock(now);
  if (clock.weekday !== radioProgram.weekday) return "idle";
  const current = minutesFromMidnight(clock);
  if (current < parseHm(radioProgram.scheduledStart)) return "upcoming";
  if (current < parseHm(radioProgram.scheduledEnd)) return "window";
  return "ended";
}

/**
 * 次に schedulePhase が変わるまでのミリ秒。
 *
 * 10:00 / 13:00 の境界で、外部 API の成否と無関係に再評価を発火させるために使う。
 * JST は UTC から分単位のオフセットなので、分未満の端数は `now % 60000` で出せる
 * （tokyoClock を秒まで拡張しなくてよい）。
 */
export function msUntilNextPhaseChange(now = Date.now()) {
  const at = typeof now === "number" ? now : new Date(now).getTime();
  const clock = tokyoClock(at);
  const start = parseHm(radioProgram.scheduledStart);
  const end = parseHm(radioProgram.scheduledEnd);
  const current = minutesFromMidnight(clock);

  let minutesAhead;
  if (clock.weekday === radioProgram.weekday && current < start) {
    minutesAhead = start - current;
  } else if (clock.weekday === radioProgram.weekday && current < end) {
    minutesAhead = end - current;
  } else {
    // 次の放送日の開始まで（今日が放送日で 13:00 を過ぎていれば7日後）
    const daysAhead = (radioProgram.weekday - clock.weekday + 7) % 7 || 7;
    minutesAhead = daysAhead * 24 * 60 - current + start;
  }

  const msIntoMinute = ((at % 60000) + 60000) % 60000;
  const delay = minutesAhead * 60000 - msIntoMinute;
  return delay > 0 ? delay : delay + 60000;
}

/** 今日これから始まる場合の開始時刻（ISO）。それ以外は null。 */
export function nextStartAtIso(now = Date.now()) {
  if (schedulePhase(now) !== "upcoming") return null;
  const iso = `${tokyoDate(now)}T${radioProgram.scheduledStart}:00+09:00`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * NOW ON AIR の確認結果をどれだけ信用するか（ミリ秒）。
 * クライアントの poll 間隔(180秒)の約2回分。
 */
export const ONAIR_STALE_MS = 360_000;

/**
 * NOW ON AIR 確認結果が古すぎないか。
 *
 * 放送枠そのものは時刻から再導出できるが、「いま何が流れているか」は
 * 外部ページの取得結果なので鮮度が要る。API 障害中に昔の「放送中！」を
 * 残さないため、古い・未来・読めない updatedAt はすべて stale とする。
 */
export function isOnAirObservationStale(
  updatedAt,
  now = Date.now(),
  staleMs = ONAIR_STALE_MS,
) {
  if (typeof updatedAt !== "string") return true;
  const parsed = Date.parse(updatedAt);
  if (Number.isNaN(parsed)) return true;
  const at = typeof now === "number" ? now : new Date(now).getTime();
  if (parsed > at) return true;
  return at - parsed >= staleMs;
}

/** 装飾・空白・＃SSC を除いて番組名が明確に一致するか。 */
export function programNameMatches(raw) {
  if (typeof raw !== "string") return false;
  const compact = raw
    .normalize("NFKC")
    .replace(/[『』「」【】[\]]/g, "")
    .replace(/[#＃]\s*SSC\b/gi, "")
    .replace(/\s+/g, "");
  return compact === radioProgram.programName;
}

export function scheduledFlags(now = Date.now()) {
  return {
    todayScheduled: isBroadcastDay(now),
    inScheduledWindow: isInScheduledWindow(now),
  };
}
