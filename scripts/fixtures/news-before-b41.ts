export * from "../../src/data/news.ts";
import { news as currentNews } from "../../src/data/news.ts";

const laterNewsIds = new Set([
  "2026-09-07-campus-girls-finals-ex-vol1",
  "2026-09-06-stream-thanks-next-slots",
  "2026-09-06-campus-girls-prelim-final-result",
  "2026-09-06-night-slot-2230",
  "2026-09-05-morning-stream-thanks",
  "2026-09-05-tiktok-radio-portrait",
  "2026-09-04-third-round-vote-day2-story",
  "2026-09-03-miss-circle-goals-support",
  "2026-09-02-miss-circle-third-round",
  "2026-09-02-oyasumily-sr-story",
  "2026-09-02-paton-second-story",
  "2026-09-01-first-showroom-oyasumiry",
  "2026-09-01-ohayo-september-x",
  "2026-09-01-paton-vote-final-day-story",
  "2026-09-01-september-mily-story",
  "2026-08-31-paton-vote-voice-story",
  "2026-08-31-paton-first-place-story",
  "2026-08-31-paton-15x-day-story",
  "2026-08-31-paton-vote-how-to-story",
  "2026-08-31-morning-stream-thanks",
  "2026-08-31-paton-15x-day",
  "2026-08-31-showroom-wake-me",
  "2026-08-30-showroom-30-day-story",
  "2026-08-30-consecutive-stream-30",
  "2026-08-30-paton-rank-3",
  "2026-08-30-campus-girls-hold-second-story",
  "2026-08-30-morning-showroom-0600",
  "2026-08-30-mixch-final-day",
  "2026-08-29-paton-vote-day-5-story",
  "2026-08-28-night-showroom-story",
  "2026-08-29-paton-vote-day-4-story",
  "2026-08-29-showroom-live-third-round",
  "2026-08-29-showroom-radio-1440",
]);

/** Historical view used by pre-b41 / pre-8/29 SHOWROOM regression tests. */
export const news = currentNews.filter(({ id }) => !laterNewsIds.has(id));
