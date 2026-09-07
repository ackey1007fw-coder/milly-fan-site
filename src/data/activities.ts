import type { ProfileSourceId } from "./profile.ts";

export type ActivityId =
  | "miss-circle"
  | "radio"
  | "live-stream"
  | "campus-girls";

export type ActivityRoute =
  | "/activities/miss-circle/"
  | "/activities/radio/"
  | "/activities/live/"
  | "/activities/campus-girls/";

/**
 * Stable activity identity and navigation metadata.
 * Current phases, ranks, schedules, and other time-dependent state belong to
 * their existing domain sources and must not be added here.
 */
export type Activity = {
  id: ActivityId;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  route: ActivityRoute;
  sourceIds: ProfileSourceId[];
  relatedSocialIds: string[];
  relatedLinkIds: string[];
  relatedHighlightIds: string[];
  relatedStorySlugs: string[];
};

export const activities: Activity[] = [
  {
    id: "miss-circle",
    label: "MISS CIRCLE",
    eyebrow: "CONTEST",
    title: "コンテストでの挑戦",
    summary: "確認済みの歩みと関連する記録をまとめます。",
    route: "/activities/miss-circle/",
    sourceIds: ["missCircle"],
    relatedSocialIds: ["showroom-circle2026-0734"],
    relatedLinkIds: ["miss-circle-2026-734"],
    relatedHighlightIds: [
      "miss-circle-2026-entry-734",
      "miss-circle-2026-third-round",
    ],
    relatedStorySlugs: [
      "2026-08-25-motivation",
      "second-round-2026",
      "second-round-result-2026",
    ],
  },
  {
    id: "radio",
    label: "RADIO",
    eyebrow: "RADIO",
    title: "ラジオで届ける声",
    summary: "ラジオでの活動と関連する記録をまとめます。",
    route: "/activities/radio/",
    sourceIds: ["fmProfile", "fmProgram", "fmProgramInstagram"],
    relatedSocialIds: [],
    relatedLinkIds: [
      "fm-smw-staff",
      "fm-smw-mily-profile",
      "fm-smw-ssc-program",
      "fm-smw-ssc-message-form",
      "fm-smw-ssc-instagram",
      "fm-smw-ssc-tiktok",
    ],
    relatedHighlightIds: [],
    relatedStorySlugs: ["2026-08-23-musical-special", "2026-08-18-radio"],
  },
  {
    id: "live-stream",
    label: "LIVE STREAM",
    eyebrow: "LIVE STREAM",
    title: "ライブ配信",
    summary: "ライブ配信での活動と関連する記録をまとめます。",
    route: "/activities/live/",
    sourceIds: ["showroom", "mixchannelProfile"],
    relatedSocialIds: ["showroom-circle2026-0734", "mixchannel-mily"],
    relatedLinkIds: [],
    relatedHighlightIds: ["showroom-first-stream-2026-08-01"],
    relatedStorySlugs: [
      "2026-08-25-motivation",
      "second-round-2026",
      "2026-08-18-radio",
    ],
  },
  {
    id: "campus-girls",
    label: "CAMPUS GIRLS",
    eyebrow: "CAMPUS GIRLS",
    title: "CAMPUS GIRLSでの挑戦",
    summary: "確認済みの歩みをまとめます。",
    route: "/activities/campus-girls/",
    sourceIds: ["campusGirlsAward", "campusGirlsSecond"],
    relatedSocialIds: [],
    relatedLinkIds: [],
    relatedHighlightIds: [
      "campus-girls-2027-prelim-final-result",
      "campus-girls-2027-second-stage-jury-award",
      "campus-girls-2027-jury-award",
    ],
    relatedStorySlugs: ["campus-girls-2027-second-stage-jury-award"],
  },
];
