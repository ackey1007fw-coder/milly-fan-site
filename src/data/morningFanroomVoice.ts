/**
 * 2026-09-11 06:41 JST: owner-requested public SHOWROOM Fan Room voice.
 * Latest / NEWS only. Original audio is preserved outside the public repository.
 * AAC packets are copied without re-encoding; source timestamps are removed.
 * Reuse NewsAudioCard. Do not hotlink the SHOWROOM CDN or embed the Fan Room.
 */
export const morningFanroomVoice = {
  id: "mily-b93-01-fanroom-morning-voice",
  kind: "audio" as const,
  src: "/media/news/mily-b93-01-fanroom-morning-voice.m4a",
  mimeType: "audio/mp4" as const,
  alt: "9月11日朝、みりぃがファンルームに投稿した音声メッセージ",
  label: "みりぃからの音声メッセージ · 06:41 · 約1分11秒",
  provenance: "owner-requested" as const,
  sourceDate: "2026-09-11",
  sourcePublishedAt: "2026-09-11T06:41:34+09:00",
} as const;
