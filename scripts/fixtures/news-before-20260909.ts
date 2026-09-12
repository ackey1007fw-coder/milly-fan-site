export * from "../../src/data/news.ts";
import { news as currentNews } from "../../src/data/news.ts";

/** Historical NEWS snapshot before the 2026-09-09 night-stream X announcement. */
export const news = currentNews.filter(
  ({ id }) =>
    id !== "2026-09-12-avatar-achievement-story" &&
    id !== "2026-09-12-ohayo-panda-selfie" &&
    id !== "2026-09-11-miripochi-story" &&
    id !== "2026-09-11-night-stream-thanks-final-day-story" &&
    id !== "2026-09-11-night-fanroom-final-day" &&
    id !== "2026-09-11-morning-fanroom-voice" &&
    id !== "2026-09-09-morning-thanks-night-stream",
);