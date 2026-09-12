/**
 * 2026-09-12 本人X投稿の「おはよう♡」セルフィー。
 * オーナー提供画像を正本とし、公開Xの同一メディアとSHA-256一致を確認。
 * 通常SNS投稿のためGalleryへ自動昇格せず、Latest / NEWS専用で自己ホストする。
 */
export const OHAYO_PANDA_SELFIE_X_URL =
  "https://x.com/Mily_chan36/status/2098566313593680195";

export const ohayoPandaSelfieImage = {
  id: "mily-b101-01-ohayo-panda-selfie",
  kind: "image" as const,
  src: "/media/news/mily-b101-01-ohayo-panda-selfie.jpg",
  width: 1152,
  height: 2048,
  alt: "パンダ風の耳と鼻、きらめくフィルターが重なり、頬に手を添えてカメラを見るみりぃの縦長セルフィー。上部に「おはよう♡」の文字",
} as const;
