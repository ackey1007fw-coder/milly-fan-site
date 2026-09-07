/**
 * 2026-09-06 本人X投稿のCAMPUS GIRLS 2027 予選ファイナル結果報告（batch b63-01）。
 * 確認済みの公開X投稿。オーナーが本タスクで画像を直接提供し、掲載を明示依頼した。
 * Gallery（media.ts）と新しい NEWS `2026-09-06-campus-girls-prelim-final-result` の両方に載せる。
 * NEWS 代表は `/media/news/` の自己ホスト JPEG。Gallery 派生は
 * `pnpm media:build` 済みの `/media/gallery/`。バイトは共有しない。
 */
export const CAMPUS_GIRLS_PRELIM_FINAL_RESULT_X_URL =
  "https://x.com/mily_chan36/status/2096422147476627841";

export const campusGirlsPrelimFinalResultPhoto = {
  id: "mily-b63-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b63-01-campus-girls-prelim-final-result",
  widths: [480, 960, 1600] as const,
  // 元素材が 1500px 幅のため、`-1600` の派生は拡大せず 1500x2667 のまま。
  width: 1500,
  height: 2667,
  alt: "白い壁の前で腕を組み、グレーのトップスにラベンダーのフリルワンピースを着たみりぃ。キャンガル2027予選finalの結果報告が重ねられている",
  caption:
    "2026年9月6日の本人X投稿。CAMPUS GIRLS 2027 予選ファイナルの結果報告。",
  provenance: "sns-post" as const,
  sourceUrl: CAMPUS_GIRLS_PRELIM_FINAL_RESULT_X_URL,
  sourceDate: "2026-09-06",
  credit: null,
  aspect: "1500 / 2667",
  published: true,
};

function gallerySrcSet(format: "jpg" | "webp"): string {
  return campusGirlsPrelimFinalResultPhoto.widths
    .map(
      (width) =>
        `${campusGirlsPrelimFinalResultPhoto.basePath}-${width}.${format} ${width}w`,
    )
    .join(", ");
}

/** Latest / NEWS 代表。Gallery 派生とは別ファイル（再エンコードしない）。 */
export const campusGirlsPrelimFinalResultImage = {
  id: "mily-b63-01-campus-girls-prelim-final-result",
  kind: "image" as const,
  src: "/media/news/mily-b63-01-campus-girls-prelim-final-result.jpg",
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1500,
  height: 2667,
  alt: campusGirlsPrelimFinalResultPhoto.alt,
  caption: campusGirlsPrelimFinalResultPhoto.caption,
  provenance: "sns-post" as const,
  sourceUrl: CAMPUS_GIRLS_PRELIM_FINAL_RESULT_X_URL,
  sourceDate: "2026-09-06",
} as const;
