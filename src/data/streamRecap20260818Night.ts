import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

/** 歌唱区間に絞った記録。配信全体の要約ではない。 */
export const streamRecap20260818Night: StreamRecap = {
  id: "2026-08-18-night",
  date: "2026-08-18",
  dateLabel: "2026.08.18（火）",
  theme: "夜の歌唱メモ",
  broadcastLabel: "22:10頃〜 約54分",
  platformLabel: "SHOWROOM",
  summary: "「ぼよよん行進曲」を歌った回。確認できた歌唱区間を記録しています。",
  songs: [{
    title: "ぼよよん行進曲",
    artist: "今井ゆうぞう・はいだしょうこ",
    timestamp: "0:38:07",
    youtubeUrl: "https://www.youtube.com/watch?v=nAjJluQCSGE",
    youtubeVersionNote: "原曲歌手も参加する「よしお兄さんとあそぼう!」の企画動画です。原盤音源とは異なります。",
    karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=8s8GcvwlhR8", channel: "カラオケ歌っちゃ王" },
  }],
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [{ timestamp: "0:38:07", label: "「ぼよよん行進曲」を歌唱" }],
  nextNote: "",
  sourceLabel: "2026年8月18日 夜配信（オーナー提供録画の自動字幕）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "歌唱前後の案内と自動字幕を照合した歌唱メモです。開始時刻は録画内の目安です。",
  }),
};
