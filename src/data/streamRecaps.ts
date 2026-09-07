import { streamRecap20260906Asa } from "./streamRecap20260906Asa.ts";
import { streamRecap20260905Night } from "./streamRecap20260905Night.ts";
import { streamRecap20260905Day } from "./streamRecap20260905Day.ts";
import { streamRecap20260905Asa } from "./streamRecap20260905Asa.ts";
import { streamRecap20260904Night } from "./streamRecap20260904Night.ts";
import { streamRecap20260904Day } from "./streamRecap20260904Day.ts";
import { streamRecap20260904Asa } from "./streamRecap20260904Asa.ts";
import { streamRecap20260903Night } from "./streamRecap20260903Night.ts";
import { streamRecap20260903Lunch } from "./streamRecap20260903Lunch.ts";
import { streamRecap20260903 } from "./streamRecap20260903.ts";
import { streamRecap20260902 } from "./streamRecap20260902.ts";
import { streamRecap20260902Night } from "./streamRecap20260902Night.ts";

export {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  buildTranscriptionNote,
  RANKING_NOTE,
  RANKING_NOTE_WITHOUT_RANGE,
  RECAP_FIGURES_NOTE,
  RECAP_WITHHOLD_NOTE,
  REPORT_MATERIAL_NOTE,
  SINGLE_STILL_NOTE,
  TRANSCRIPT_MATERIAL_NOTE,
  VIDEO_MATERIAL_NOTE,
  streamRecapRadioStill,
} from "./streamRecapRules.ts";

export type StreamRecapHighlight = {
  timestamp: string;
  title: string;
  body: string;
  quote?: string;
};

export type StreamRecapGoal = {
  item: string;
  /** 目指す値・状態。「この回」の状態は statusThen へ。 */
  target: string;
  /** その回でどうだったか。状態だけでなく、本人の呼びかけも含む。 */
  statusThen: string;
};

export type StreamRecapTimelineItem = {
  timestamp: string;
  label: string;
};

export type StreamRecapImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  downloadName?: string;
};

export type StreamRecapGalleryZip = {
  src: string;
  filename: string;
  label: string;
};

export type StreamRecapSong = {
  title: string;
  artist: string;
  /** 録画先頭からの歌唱開始位置の目安。 */
  timestamp: string;
  /** 原曲へのリンク。みりぃの歌唱映像ではない。 */
  youtubeUrl: string;
  /** 練習用の参考伴奏。配信での使用音源とは限らない。 */
  karaoke?: { youtubeUrl: string; channel: string };
};

export type StreamRecap = {
  id: string;
  date: string;
  dateLabel: string;
  theme: string;
  broadcastLabel: string;
  platformLabel: string;
  summary: string;
  image?: StreamRecapImage;
  gallery?: StreamRecapImage[];
  galleryZip?: StreamRecapGalleryZip;
  songs?: StreamRecapSong[];
  highlights: StreamRecapHighlight[];
  goals: StreamRecapGoal[];
  ranking: string[];
  timeline: StreamRecapTimelineItem[];
  nextNote: string;
  sourceLabel: string;
  verifiedAt: string;
  transcriptionNote: string;
};

export {
  streamRecap20260906Asa,
  streamRecap20260905Night,
  streamRecap20260905Day,
  streamRecap20260905Asa,
  streamRecap20260904Night,
  streamRecap20260904Day,
  streamRecap20260904Asa,
  streamRecap20260903Night,
  streamRecap20260903Lunch,
  streamRecap20260903,
  streamRecap20260902Night,
  streamRecap20260902,
};

/** 新しい配信メモを先頭へ。 */
export const streamRecaps: StreamRecap[] = [
  streamRecap20260906Asa,
  streamRecap20260905Night,
  streamRecap20260905Day,
  streamRecap20260905Asa,
  streamRecap20260904Night,
  streamRecap20260904Day,
  streamRecap20260904Asa,
  streamRecap20260903Night,
  streamRecap20260903Lunch,
  streamRecap20260903,
  streamRecap20260902Night,
  streamRecap20260902,
];
