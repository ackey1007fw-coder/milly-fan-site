import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260815Day: StreamRecap = {
  id: "2026-08-15-day",
  date: "2026-08-15",
  dateLabel: "2026.08.15（土）",
  theme: "昼の歌唱メモ",
  broadcastLabel: "11:30頃〜 約59分",
  platformLabel: "SHOWROOM",
  summary: "「SWEET MEMORIES」を歌った回。確認できた歌唱区間を記録しています。",
  songs: [{
    title: "SWEET MEMORIES",
    artist: "松田聖子",
    timestamp: "0:47:57",
    youtubeUrl: "https://www.youtube.com/watch?v=2LVVH_D-mR4",
    karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=QPZcivqqiXQ", channel: "カラオケ歌っちゃ王" },
  }],
  highlights: [],
  goals: [],
  ranking: [],
  timeline: [{ timestamp: "0:47:57", label: "「SWEET MEMORIES」を歌唱" }],
  nextNote: "",
  sourceLabel: "2026年8月15日 昼配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "歌声の区間検出と歌唱前後の音声認識を照合した歌唱メモです。開始時刻は録画内の目安です。",
  }),
};
