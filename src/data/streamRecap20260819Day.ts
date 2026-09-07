import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260819Day: StreamRecap = {
  id: "2026-08-19-day",
  date: "2026-08-19",
  dateLabel: "2026.08.19（水）",
  theme: "昼の歌唱メモ",
  broadcastLabel: "12:56頃〜 約108分",
  platformLabel: "SHOWROOM",
  summary: "「アイドル」を歌った回。確認できた歌唱区間を記録しています。",
  songs: [{
    title: "アイドル",
    artist: "YOASOBI",
    timestamp: "1:36:25",
    youtubeUrl: "https://www.youtube.com/watch?v=ZRtdQ81jPUQ",
  }],
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [{ timestamp: "1:36:25", label: "「アイドル」を歌唱" }],
  nextNote: "",
  sourceLabel: "2026年8月19日 昼配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "歌声の区間検出と歌唱前後の音声認識を照合した歌唱メモです。開始時刻は録画内の目安です。",
  }),
};
