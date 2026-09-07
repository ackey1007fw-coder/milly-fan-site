import { isValidDateOnly, isValidDateTime } from "./events.ts";
import { activities, type ActivityId } from "./activities.ts";
import { CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL } from "./campusGirlsFinalsExImages.ts";
import {
  links,
  missCircleShowroomEventLink,
  missCircleWebVoteLink,
} from "./links.ts";

export type SupportEventKind =
  | "vote"
  | "deadline"
  | "stream-event"
  | "support-campaign"
  | "result";

export type SupportEventSchedule =
  | {
      state: "confirmed-period";
      start: string;
      end: string;
      allDay: boolean;
      timezone: "Asia/Tokyo";
    }
  | {
      state: "confirmed-instant";
      at: string;
      allDay: boolean;
      timezone: "Asia/Tokyo";
    }
  | {
      state: "date-pending";
    };

export type SupportEvent = {
  id: string;
  activityId: ActivityId;
  kind: SupportEventKind;
  title: string;
  note?: string;
  /** 期間中のサイト共有文へ載せる、確認済みの短い呼びかけ。 */
  shareText?: string;
  /** 共有文で、この企画が最優先の間だけ人物タグと並べるハッシュタグ。 */
  shareHashtag?: string;
  schedule: SupportEventSchedule;
  ctaLinkId?: string;
  source: string;
  verifiedAt: string;
  priority?: number;
};

const supportEventKinds = new Set<SupportEventKind>([
  "vote",
  "deadline",
  "stream-event",
  "support-campaign",
  "result",
]);

const activityIds = new Set<ActivityId>(activities.map(({ id }) => id));
const linkIds = new Set(links.map(({ id }) => id));

function hasOnlyKeys(candidate: Record<string, unknown>, allowed: string[]): boolean {
  const allowedKeys = new Set(allowed);
  return Object.keys(candidate).every((key) => allowedKeys.has(key));
}

function validScheduledValue(value: unknown, allDay: boolean): value is string {
  if (typeof value !== "string") return false;
  return allDay ? isValidDateOnly(value) : isValidDateTime(value);
}

function scheduledValueMs(value: string, allDay: boolean): number {
  return Date.parse(allDay ? `${value}T00:00:00+09:00` : value);
}

export function isValidSupportEventSchedule(
  schedule: unknown,
): schedule is SupportEventSchedule {
  if (typeof schedule !== "object" || schedule === null) return false;
  const candidate = schedule as Record<string, unknown>;

  if (candidate.state === "date-pending") {
    return hasOnlyKeys(candidate, ["state"]);
  }

  if (
    typeof candidate.allDay !== "boolean" ||
    candidate.timezone !== "Asia/Tokyo"
  ) {
    return false;
  }

  if (candidate.state === "confirmed-period") {
    if (!hasOnlyKeys(candidate, ["state", "start", "end", "allDay", "timezone"])) {
      return false;
    }
    if (
      !validScheduledValue(candidate.start, candidate.allDay) ||
      !validScheduledValue(candidate.end, candidate.allDay)
    ) {
      return false;
    }
    return (
      scheduledValueMs(candidate.end, candidate.allDay) >=
      scheduledValueMs(candidate.start, candidate.allDay)
    );
  }

  if (candidate.state === "confirmed-instant") {
    return (
      hasOnlyKeys(candidate, ["state", "at", "allDay", "timezone"]) &&
      validScheduledValue(candidate.at, candidate.allDay)
    );
  }

  return false;
}

export function isValidSupportEvent(event: unknown): event is SupportEvent {
  if (typeof event !== "object" || event === null) return false;
  const candidate = event as Record<string, unknown>;
  if (
    !hasOnlyKeys(candidate, [
      "id",
      "activityId",
      "kind",
      "title",
      "note",
      "shareText",
      "shareHashtag",
      "schedule",
      "ctaLinkId",
      "source",
      "verifiedAt",
      "priority",
    ])
  ) {
    return false;
  }

  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.activityId === "string" &&
    activityIds.has(candidate.activityId as ActivityId) &&
    typeof candidate.kind === "string" &&
    supportEventKinds.has(candidate.kind as SupportEventKind) &&
    typeof candidate.title === "string" &&
    candidate.title.length > 0 &&
    (candidate.note === undefined || typeof candidate.note === "string") &&
    (candidate.shareText === undefined ||
      (typeof candidate.shareText === "string" && candidate.shareText.length > 0)) &&
    (candidate.shareHashtag === undefined ||
      (typeof candidate.shareHashtag === "string" &&
        /^#[^\s#]+$/u.test(candidate.shareHashtag))) &&
    isValidSupportEventSchedule(candidate.schedule) &&
    (candidate.ctaLinkId === undefined ||
      (typeof candidate.ctaLinkId === "string" && linkIds.has(candidate.ctaLinkId))) &&
    typeof candidate.source === "string" &&
    /^https?:\/\//.test(candidate.source) &&
    typeof candidate.verifiedAt === "string" &&
    isValidDateOnly(candidate.verifiedAt) &&
    (candidate.priority === undefined || Number.isFinite(candidate.priority))
  );
}

export const missCircleThirdRoundWebVote: SupportEvent = {
  id: "miss-circle-2026-3rd-web-vote",
  activityId: "miss-circle",
  kind: "vote",
  title: "WEB投票",
  shareText:
    "MISS CIRCLE CONTEST 2026 3次審査のWEB投票をお願いします🗳️",
  shareHashtag: "#ミスサークル2026",
  schedule: {
    state: "confirmed-period",
    start: "2026-09-03T12:00:00+09:00",
    // 公式の「23:59まで」を秒単位の終了境界へ正規化する。
    end: "2026-09-13T23:59:59+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  ctaLinkId: missCircleWebVoteLink.id,
  source: "https://www.misscircle.jp/",
  verifiedAt: "2026-09-02",
  priority: 90,
};

export const missCircleThirdRoundShowroomReview: SupportEvent = {
  id: "miss-circle-2026-3rd-showroom-review",
  activityId: "miss-circle",
  kind: "stream-event",
  title: "SHOWROOM無料ギフト審査・イベント審査",
  schedule: {
    state: "confirmed-period",
    start: "2026-09-03T05:00:00+09:00",
    // 公式の「21:59まで」を秒単位の終了境界へ正規化する。
    end: "2026-09-12T21:59:59+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  ctaLinkId: missCircleShowroomEventLink.id,
  source: "https://www.showroom-live.com/event/circle2026_3rd",
  verifiedAt: "2026-09-02",
  priority: 80,
};

export const campusGirlsFinalsExSnsReview: SupportEvent = {
  id: "campus-girls-finals-ex-sns-vol1-2026",
  activityId: "campus-girls",
  kind: "support-campaign",
  title: "CAMPUS GIRLS 2027 本選EX vol.1 SNS審査",
  note:
    "本人Xで案内された本選EX vol.1のSNS審査期間です。みりぃはキャンガルでの配信は行わないと伝えています。",
  shareText:
    "CAMPUS GIRLS 2027 本選EX vol.1のSNS審査期間です。みりぃの投稿を応援してください",
  shareHashtag: "#キャンガル",
  schedule: {
    state: "confirmed-period",
    start: "2026-09-07T12:00:00+09:00",
    end: "2026-09-20T12:00:00+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  source: CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL,
  verifiedAt: "2026-09-07",
  priority: 70,
};

export const campusGirlsFinalsExPatonReview: SupportEvent = {
  id: "campus-girls-finals-ex-paton-vol1-2026",
  activityId: "campus-girls",
  kind: "support-campaign",
  title: "CAMPUS GIRLS 2027 本選EX vol.1 Paton投票審査",
  note:
    "本人Xの案内グラフィックに書かれた期間です。投票先URLは未確認のため、ここでは期間のみ載せています。",
  schedule: {
    state: "confirmed-period",
    start: "2026-09-16T18:00:00+09:00",
    end: "2026-09-22T23:59:00+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  source: CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL,
  verifiedAt: "2026-09-07",
};

const FINALS_EX_LATER_NOTE =
  "本人Xの本選EX日程表で案内された期間です。この回のSNS審査・Paton投票の内訳は未確認です。";

function campusGirlsFinalsExVolume(options: {
  id: string;
  title: string;
  start: string;
  end: string;
}): SupportEvent {
  return {
    id: options.id,
    activityId: "campus-girls",
    kind: "support-campaign",
    title: options.title,
    note: FINALS_EX_LATER_NOTE,
    schedule: {
      state: "confirmed-period",
      start: options.start,
      end: options.end,
      allDay: false,
      timezone: "Asia/Tokyo",
    },
    source: CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL,
    verifiedAt: "2026-09-07",
  };
}

export const campusGirlsFinalsExTwo = campusGirlsFinalsExVolume({
  id: "campus-girls-finals-ex-vol-2-2026",
  title: "CAMPUS GIRLS 2027 本選EX vol.2",
  start: "2026-09-28T12:00:00+09:00",
  end: "2026-10-11T12:00:00+09:00",
});

export const campusGirlsFinalsExThree = campusGirlsFinalsExVolume({
  id: "campus-girls-finals-ex-vol-3-2026",
  title: "CAMPUS GIRLS 2027 本選EX vol.3",
  start: "2026-10-19T12:00:00+09:00",
  end: "2026-11-01T12:00:00+09:00",
});

export const campusGirlsFinalsExFour = campusGirlsFinalsExVolume({
  id: "campus-girls-finals-ex-vol-4-2026",
  title: "CAMPUS GIRLS 2027 本選EX vol.4",
  start: "2026-11-09T12:00:00+09:00",
  end: "2026-11-22T12:00:00+09:00",
});

export const campusGirlsFinalsExFive = campusGirlsFinalsExVolume({
  id: "campus-girls-finals-ex-vol-5-2026",
  title: "CAMPUS GIRLS 2027 本選EX vol.5",
  start: "2026-11-30T12:00:00+09:00",
  end: "2026-12-13T12:00:00+09:00",
});

export const campusGirlsFinalsExSix = campusGirlsFinalsExVolume({
  id: "campus-girls-finals-ex-vol-6-2026",
  title: "CAMPUS GIRLS 2027 本選EX vol.6",
  start: "2026-12-21T12:00:00+09:00",
  end: "2027-01-03T12:00:00+09:00",
});

export const campusGirlsFinalStagePatonVote: SupportEvent = {
  id: "campus-girls-final-stage-paton-2026",
  activityId: "campus-girls",
  kind: "vote",
  title: "CAMPUS GIRLS 2027 予選A FinalSTAGE Paton投票",
  note:
    "Patonの三橋莉子（みりぃ）ページから応援できます。投票にはPatonへのログインが必要です。",
  shareText: "CAMPUS GIRLS 2027のPaton投票をお願いします🗳️",
  shareHashtag: "#キャンガル2027",
  schedule: {
    state: "confirmed-period",
    start: "2026-08-26T18:00:00+09:00",
    end: "2026-09-01T23:59:00+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  },
  ctaLinkId: "campus-girls-paton-11380",
  source: "https://paton.jp/event/detail/499",
  verifiedAt: "2026-08-26",
  priority: 100,
};

export const supportEvents: SupportEvent[] = [
  campusGirlsFinalStagePatonVote,
  missCircleThirdRoundWebVote,
  missCircleThirdRoundShowroomReview,
  campusGirlsFinalsExSnsReview,
  campusGirlsFinalsExPatonReview,
  campusGirlsFinalsExTwo,
  campusGirlsFinalsExThree,
  campusGirlsFinalsExFour,
  campusGirlsFinalsExFive,
  campusGirlsFinalsExSix,
];
