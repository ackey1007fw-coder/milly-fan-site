import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

/** 歌唱区間に絞った記録。配信全体の要約ではない。 */
export const streamRecap20260825Asa: StreamRecap = {
  id: "2026-08-25-morning",
  date: "2026-08-25",
  dateLabel: "2026.08.25（火）",
  theme: "朝の歌唱メモ",
  broadcastLabel: "11:40頃〜 約62分",
  platformLabel: "SHOWROOM",
  summary: "オープニングナンバーとして「ロマンスの神様」を歌った回。確認できた歌唱区間を記録しています。",
  songs: [{
    title: "ロマンスの神様",
    artist: "広瀬香美",
    timestamp: "0:39:54",
    youtubeUrl: "https://www.youtube.com/watch?v=l8-RA3B0YRc",
  }],
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [{ timestamp: "0:39:54", label: "「ロマンスの神様」を歌唱" }],
  nextNote: "",
  sourceLabel: "2026年8月25日 朝配信（オーナー提供録画の自動字幕）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "歌唱前後の案内と自動字幕を照合した歌唱メモです。開始時刻は録画内の目安です。",
  }),
};
