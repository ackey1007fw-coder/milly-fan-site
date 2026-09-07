import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260821Asa: StreamRecap = {
  id: "2026-08-21-asa",
  date: "2026-08-21",
  dateLabel: "2026.08.21（金）",
  theme: "朝の歌唱メモ",
  broadcastLabel: "7:02頃〜 約130分",
  platformLabel: "SHOWROOM",
  summary: "「元彼女のみなさまへ」を歌った回。確認できた歌唱区間を記録しています。",
  songs: [{
    title: "元彼女のみなさまへ",
    artist: "コレサワ",
    timestamp: "1:47:20",
    youtubeUrl: "https://www.youtube.com/watch?v=UykGAa6AfbA",
  }],
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [{ timestamp: "1:47:20", label: "「元彼女のみなさまへ」を歌唱" }],
  nextNote: "",
  sourceLabel: "2026年8月21日 朝配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "歌声の区間検出と歌唱前後の音声認識を照合した歌唱メモです。開始時刻は20秒単位の区間検出による目安です。",
  }),
};
