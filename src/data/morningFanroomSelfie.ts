import type { MediaItem } from "./media.ts";

export const morningFanroomSelfiePhoto = {
  id: "mily-b110-01",
  kind: "photo",
  basePath: "/media/gallery/mily-b110-01-blue-hoodie-peace",
  widths: [480, 960, 1600],
  width: 1206,
  height: 2119,
  alt: "青いパーカーを着て、顔の横でピースをするみりぃの縦長セルフィー",
  caption: "朝配信のお礼とラジオへ向かう連絡に添えられた、みりぃのセルフィー。",
  provenance: "owner-provided",
  sourceUrl: null,
  sourceDate: "2026-09-13",
  credit: null,
  aspect: "1206 / 2119",
  published: true,
} satisfies MediaItem;

export const morningFanroomSelfieImage = {
  kind: "image" as const,
  src: `${morningFanroomSelfiePhoto.basePath}-1600.jpg`,
  srcSet: morningFanroomSelfiePhoto.widths.map(w => `${morningFanroomSelfiePhoto.basePath}-${w}.jpg ${w}w`).join(", "),
  webpSrcSet: morningFanroomSelfiePhoto.widths.map(w => `${morningFanroomSelfiePhoto.basePath}-${w}.webp ${w}w`).join(", "),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: morningFanroomSelfiePhoto.width,
  height: morningFanroomSelfiePhoto.height,
  alt: morningFanroomSelfiePhoto.alt,
};
