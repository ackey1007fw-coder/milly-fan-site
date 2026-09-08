import { streamRecap20260823Asa } from "./streamRecap20260823Asa.ts";
import { streamRecap20260823Night } from "./streamRecap20260823Night.ts";
import { streamRecap20260824Asa } from "./streamRecap20260824Asa.ts";
import { streamRecap20260824Night } from "./streamRecap20260824Night.ts";
import { streamRecap20260825Day } from "./streamRecap20260825Day.ts";
import { streamRecap20260827Night } from "./streamRecap20260827Night.ts";
import { streamRecap20260827Day } from "./streamRecap20260827Day.ts";
import { streamRecap20260828Night } from "./streamRecap20260828Night.ts";
import { streamRecap20260907Night } from "./streamRecap20260907Night.ts";
import { streamRecap20260907Asa } from "./streamRecap20260907Asa.ts";
import { streamRecap20260906Night } from "./streamRecap20260906Night.ts";
import { streamRecap20260906Asa } from "./streamRecap20260906Asa.ts";
import { streamRecap20260825Asa } from "./streamRecap20260825Asa.ts";
import { streamRecap20260818Night } from "./streamRecap20260818Night.ts";
import { streamRecap20260819Day } from "./streamRecap20260819Day.ts";
import { streamRecap20260826Night } from "./streamRecap20260826Night.ts";
import { streamRecap20260826Day } from "./streamRecap20260826Day.ts";
import { streamRecap20260825Night } from "./streamRecap20260825Night.ts";
import { streamRecap20260826Asa } from "./streamRecap20260826Asa.ts";
import { streamRecap20260807Day } from "./streamRecap20260807Day.ts";
import { streamRecap20260821Day } from "./streamRecap20260821Day.ts";
import { streamRecap20260815Day } from "./streamRecap20260815Day.ts";
import { streamRecap20260821Asa } from "./streamRecap20260821Asa.ts";
import { streamRecap20260806Asa } from "./streamRecap20260806Asa.ts";
import { streamRecap20260814Day } from "./streamRecap20260814Day.ts";
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
import { streamRecap20260901Night } from "./streamRecap20260901Night.ts";
import { streamRecap20260831Night } from "./streamRecap20260831Night.ts";
import { streamRecap20260831Asa } from "./streamRecap20260831Asa.ts";
import { streamRecap20260830Night } from "./streamRecap20260830Night.ts";
import { streamRecap20260828Asa } from "./streamRecap20260828Asa.ts";
import { streamRecap20260829Day } from "./streamRecap20260829Day.ts";
import { streamRecap20260830Asa } from "./streamRecap20260830Asa.ts";

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
  /** 原盤以外の歌唱動画を案内する場合、その版を明示する。 */
  youtubeVersionNote?: string;
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
  streamRecap20260907Night,
  streamRecap20260907Asa,
  streamRecap20260906Night,
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
  streamRecap20260901Night,
};

/** 新しい配信メモを先頭へ。 */
export const streamRecaps: StreamRecap[] = [
  streamRecap20260907Night,
  streamRecap20260907Asa,
  streamRecap20260906Night,
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
  streamRecap20260901Night,
  streamRecap20260831Night,
  streamRecap20260831Asa,
  streamRecap20260830Night,
  streamRecap20260830Asa,
  streamRecap20260829Day,
  streamRecap20260828Night,
  streamRecap20260828Asa,
  streamRecap20260827Night,
  streamRecap20260827Day,
  streamRecap20260826Night,
  streamRecap20260826Day,
  streamRecap20260826Asa,
  streamRecap20260825Night,
  streamRecap20260825Day,
  streamRecap20260825Asa,
  streamRecap20260824Night,
  streamRecap20260824Asa,
  streamRecap20260823Night,
  streamRecap20260823Asa,
  streamRecap20260821Day,
  streamRecap20260821Asa,
  streamRecap20260819Day,
  streamRecap20260818Night,
  streamRecap20260815Day,
  streamRecap20260814Day,
  streamRecap20260807Day,
  streamRecap20260806Asa,
];
