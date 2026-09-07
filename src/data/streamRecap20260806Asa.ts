import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260806Asa: StreamRecap = {
  id: "2026-08-06-asa",
  date: "2026-08-06",
  dateLabel: "2026.08.06（木）",
  theme: "朝の歌唱メモ",
  broadcastLabel: "10:02頃〜 約180分",
  platformLabel: "SHOWROOM",
  summary: "「かわいいだけじゃだめですか？」を歌った回。確認できた歌唱区間を記録しています。",
  songs: [{
    title: "かわいいだけじゃだめですか？",
    artist: "CUTIE STREET",
    timestamp: "2:22:56",
    youtubeUrl: "https://www.youtube.com/watch?v=d0rOHgzCe6s",
  }],
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [{ timestamp: "2:22:56", label: "「かわいいだけじゃだめですか？」を歌唱" }],
  nextNote: "",
  sourceLabel: "2026年8月6日 朝配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "歌声の区間検出と歌唱前後の音声認識を照合した歌唱メモです。開始時刻は録画内の目安です。",
  }),
};
