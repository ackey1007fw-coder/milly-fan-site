export * from "../../src/data/galleryVideos.ts";
import { galleryVideos as current, type GalleryVideoItem } from "../../src/data/galleryVideos.ts";

/** Preserve the gallery snapshot used by the pre-b58 content regressions. */
export const galleryVideos = current.filter(
  ({ id }) =>
    id !== "mily-b79-01-miripochi-waiting-story" &&
    id !== "mily-b66-01-stream-thanks-morning-slot-story" &&
    id !== "mily-b65-02-morning-thanks-vote-day5-story" &&
    id !== "mily-b65-01-web-vote-day5-soon-story" &&
    id !== "mily-b58-01-tiktok-radio-portrait" &&
    id !== "mily-b59-01-third-round-vote-day2-story",
);
export function visibleGalleryVideos(items: GalleryVideoItem[] = galleryVideos): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
