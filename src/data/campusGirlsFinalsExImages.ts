/**
 * 2026-09-07 本人X投稿の CAMPUS GIRLS 2027 本選EX vol.1 案内グラフィック
 * （batch b64）。実写ポートレートではない。NEWS 専用。
 * Gallery・`/stories/`・highlights には出さない。
 *
 * b64-01: 本選EX vol.1の審査・特典案内（オーナー提供の2枚目相当。IG枠なし）
 * b64-02: みりぃのメッセージと本選EX vol.1〜6の日程表。
 *         オーナー提供スクリーンショットから、下部のInstagram再投稿バーと
 *         空の余白だけを除いた公開派生。
 */
export const CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL =
  "https://x.com/mily_chan36/status/2096754197362622971";

export const campusGirlsFinalsExGuideImage = {
  id: "mily-b64-01-campus-girls-finals-ex-vol1",
  kind: "image" as const,
  src: "/media/news/mily-b64-01-campus-girls-finals-ex-vol1.jpg",
  width: 1500,
  height: 2250,
  alt: "CAMPUS GIRLS 2027 本選EX vol.1の配信審査、SNS審査、Paton投票審査と特典を案内するグラフィック",
  caption: "2026年9月7日の本人X投稿に添えられた 本選EX vol.1 案内画像。",
  provenance: "sns-post" as const,
  sourceUrl: CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL,
  sourceDate: "2026-09-07",
} as const;

export const campusGirlsFinalsExScheduleImage = {
  id: "mily-b64-02-campus-girls-finals-ex-schedule",
  kind: "image" as const,
  src: "/media/news/mily-b64-02-campus-girls-finals-ex-schedule.jpg",
  width: 1500,
  height: 1700,
  alt: "みりぃの本選EXへの意気込みと、CAMPUS GIRLS 2027 本選EX vol.1からvol.6までの日程表",
  caption: "2026年9月7日の本人X投稿に添えられた 本選EX期間のスケジュール表。",
  provenance: "sns-post" as const,
  sourceUrl: CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL,
  sourceDate: "2026-09-07",
} as const;
