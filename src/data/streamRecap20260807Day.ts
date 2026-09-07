import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260807Day: StreamRecap = {
  id: "2026-08-07-day",
  date: "2026-08-07",
  dateLabel: "2026.08.07（金）",
  theme: "昼の歌唱メモ",
  broadcastLabel: "13:34頃〜 約151分",
  platformLabel: "SHOWROOM",
  summary: "「可愛くてごめん」「生まれてはじめて」を歌った回。確認できた歌唱区間を記録しています。",
  songs: [
    {
      title: "可愛くてごめん",
      artist: "HoneyWorks",
      timestamp: "0:46:45",
      youtubeUrl: "https://www.youtube.com/watch?v=K4xLi8IF1FM",
      youtubeVersionNote: "ちゅーたん（CV：早見沙織）歌唱版です。配信で使用した音源の特定ではありません。",
    },
    {
      title: "生まれてはじめて",
      artist: "神田沙也加・松たか子",
      timestamp: "1:08:46",
      youtubeUrl: "https://www.youtube.com/watch?v=MDZSdjLqiGA",
    },
  ],
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [
    { timestamp: "0:46:45", label: "「可愛くてごめん」を歌唱" },
    { timestamp: "1:08:46", label: "「生まれてはじめて」を歌唱" },
  ],
  nextNote: "",
  sourceLabel: "2026年8月7日 昼配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "歌声の区間検出と歌唱前後の音声認識を照合した歌唱メモです。開始時刻は録画内の目安です。",
  }),
};
