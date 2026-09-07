import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260821Day: StreamRecap = {
  id: "2026-08-21-day",
  date: "2026-08-21",
  dateLabel: "2026.08.21（金）",
  theme: "昼の歌唱メモ",
  broadcastLabel: "14:22頃〜 約157分",
  platformLabel: "SHOWROOM",
  summary: "「愛をこめて花束を」を歌った回。確認できた歌唱区間を記録しています。",
  songs: [{
    title: "愛をこめて花束を",
    artist: "Superfly",
    timestamp: "1:32:03",
    youtubeUrl: "https://www.youtube.com/watch?v=gU5oN0KVofU",
  }],
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [{ timestamp: "1:32:03", label: "「愛をこめて花束を」を歌唱" }],
  nextNote: "",
  sourceLabel: "2026年8月21日 昼配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "歌声の区間検出と歌唱前後の音声認識を照合した歌唱メモです。開始時刻は録画内の目安です。",
  }),
};
