// shared/radio-program.js の型定義。
// 実体は同名の .js（フロントと Vercel Function の単一 source of truth）。

export declare const RADIO_TIMEZONE: "Asia/Tokyo";

export declare const radioProgram: {
  programName: string;
  /** サイト共有文で番組が最優先のときに使う、確認済みの番組タグ。 */
  shareHashtags: string[];
  /** JS weekday: 0 = Sunday */
  weekday: number;
  scheduledStart: string;
  scheduledEnd: string;
  listenUrl: string;
  nowOnAirSourceUrl: string;
  programUrl: string;
  staffUrl: string;
  timetableUrl: string;
  lastVerifiedAt: string;
};

export type TokyoClock = {
  weekday: number;
  hour: number;
  minute: number;
};

export declare function tokyoClock(now?: Date | number): TokyoClock;
export declare function tokyoDate(now?: Date | number): string;
export declare function minutesFromMidnight(clock: {
  hour: number;
  minute: number;
}): number;
export declare function parseHm(value: string): number;
export declare function isBroadcastDay(now?: Date | number): boolean;
export declare function isInScheduledWindow(now?: Date | number): boolean;
/** 放送日の中での位置。放送日でなければ "idle"。 */
export type SchedulePhase = "upcoming" | "window" | "ended" | "idle";

export declare function schedulePhase(now?: Date | number): SchedulePhase;
export declare function nextStartAtIso(now?: Date | number): string | null;
export declare function msUntilNextPhaseChange(now?: Date | number): number;
export declare const ONAIR_STALE_MS: number;
export declare function isOnAirObservationStale(
  updatedAt: string | null | undefined,
  now?: Date | number,
  staleMs?: number,
): boolean;
export declare function programNameMatches(raw: string | null | undefined): boolean;
export declare function scheduledFlags(now?: Date | number): {
  todayScheduled: boolean;
  inScheduledWindow: boolean;
};
