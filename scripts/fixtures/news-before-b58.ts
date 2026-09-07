export * from "../../src/data/news.ts";
import { news as currentNews } from "../../src/data/news.ts";

/** Historical NEWS snapshot before the owner-dated b58 TikTok addition. */
export const news = currentNews.filter(
  ({ id }) =>
    id !== "2026-09-07-campus-girls-finals-ex-vol1" &&
    id !== "2026-09-06-stream-thanks-next-slots" &&
    id !== "2026-09-06-campus-girls-prelim-final-result" &&
    id !== "2026-09-05-tiktok-radio-portrait" &&
    id !== "2026-09-05-morning-stream-thanks" &&
    id !== "2026-09-06-night-slot-2230" &&
    id !== "2026-09-04-third-round-vote-day2-story",
);
