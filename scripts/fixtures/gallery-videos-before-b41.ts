export * from "../../src/data/galleryVideos.ts";
import {
  galleryVideos as currentGalleryVideos,
  type GalleryVideoItem,
} from "../../src/data/galleryVideos.ts";

const laterVideoIds = new Set([
  "mily-b58-01-tiktok-radio-portrait",
  "mily-b59-01-third-round-vote-day2-story",
  "mily-b47-01-oyasumily-story",
  "mily-b47-02-paton-second-story",
  "mily-b46-01-paton-vote-final-day-story",
  "mily-b46-02-september-mily-story",
  "mily-b45-01-paton-vote-voice-story",
  "mily-b44-02-paton-vote-first-place-story",
  "mily-b44-01-paton-vote-15x-emergency-story",
  "mily-b44-04-showroom-30-day-anniversary-story",
  "mily-b43-02-campus-girls-hold-second-story",
  "mily-b43-01-paton-vote-day5-story",
  "mily-b41-01-night-showroom-story",
  "mily-b41-02-paton-vote-day4-story",
  "mixch-m-UBHJplv4",
]);

/** Historical view used by pre-b41 regression tests. */
export const galleryVideos: GalleryVideoItem[] = currentGalleryVideos.filter(
  ({ id }) => !laterVideoIds.has(id),
);

export function visibleGalleryVideos(
  items: GalleryVideoItem[] = galleryVideos,
): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
