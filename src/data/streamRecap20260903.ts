import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  buildTranscriptionNote,
  RANKING_NOTE,
  VIDEO_MATERIAL_NOTE,
} from "./streamRecapRules.ts";

const GACHI_STILL_W = 400;
const GACHI_STILL_H = 228;

const gachiMorningStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b52-01-peace-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが右手でピースをしている",
    caption: "ベストショット。ピース",
    downloadName: "みりぃ_三次初日朝_01_ベスト_ピース.jpg",
  },
  {
    src: "/media/live/mily-b52-02-peace.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが右手を開いて振っている",
    caption: "手を振る",
    downloadName: "みりぃ_三次初日朝_02_手を振る.jpg",
  },
  {
    src: "/media/live/mily-b52-03-peace-talk.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ベージュのトップスのみりぃが顔を上げて話している",
    caption: "顔を上げて話す",
    downloadName: "みりぃ_三次初日朝_03_顔を上げて.jpg",
  },
  {
    src: "/media/live/mily-b52-04-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、口元をゆるめて微笑んでいるみりぃ",
    caption: "微笑み",
    downloadName: "みりぃ_三次初日朝_04_微笑み.jpg",
  },
  {
    src: "/media/live/mily-b52-05-talk-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、少し笑って話しているみりぃ",
    caption: "話す笑顔",
    downloadName: "みりぃ_三次初日朝_05_話す笑顔.jpg",
  },
  {
    src: "/media/live/mily-b52-06-talk.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、こちらを見て話しているみりぃ",
    caption: "話す",
    downloadName: "みりぃ_三次初日朝_06_話す.jpg",
  },
  {
    src: "/media/live/mily-b52-07-look.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、まっすぐこちらを見て話しているみりぃ",
    caption: "こちらを見て話す",
    downloadName: "みりぃ_三次初日朝_07_見つめて.jpg",
  },
  {
    src: "/media/live/mily-b52-08-soft-smile.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、やわらかく笑っているみりぃ",
    caption: "やわらかい笑顔",
    downloadName: "みりぃ_三次初日朝_08_やわらか笑顔.jpg",
  },
  {
    src: "/media/live/mily-b52-09-later.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信の中盤、話しているみりぃ",
    caption: "配信の中盤",
    downloadName: "みりぃ_三次初日朝_09_中盤.jpg",
  },
  {
    src: "/media/live/mily-b52-10-board.jpg",
    width: GACHI_STILL_W,
    height: GACHI_STILL_H,
    alt: "三次初日の朝配信で、ホワイトボードの話をしているみりぃ",
    caption: "ホワイトボードの話のころ",
    downloadName: "みりぃ_三次初日朝_10_ボード.jpg",
  },
];

/**
 * 2026年9月3日のSHOWROOM朝配信を、オーナー提供の動画で確認した配信メモ。
 * 録音音声・全文文字起こし・画面録画は公開しない。
 * かわいい実フレームを10枚掲載する。コメント・視聴者表示・他出場者は写らないよう切り出している。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない。
 */
export const streamRecap20260903: StreamRecap = {
  id: "2026-09-03-morning-gachi-showroom",
  date: "2026-09-03",
  dateLabel: "2026.09.03（木）",
  theme: "朝の配信・三次初日",
  broadcastLabel: "7:30頃〜 約30分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 三次審査1日目の最初の朝配信。すっぴんで起きて、キラキラと12時からのWEB投票をお願いした回です。ファンネーム「トマトの栄養素」の由来や、昼枠はメイクして会うことも話しました。",
  image: gachiMorningStills[0],
  gallery: gachiMorningStills,
  galleryZip: {
    src: "/media/live/mily-b52-gachi-morning-stills.zip",
    filename: "みりぃ_三次初日朝_かわいいスクショ10枚.zip",
    label: "10枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:13",
      title: "キラキラが超大事",
      body: "三次初日の朝、来てくれた人へお礼を言いながら、キラキラが超大事だとくり返しお願いしました。",
      quote: "キラキラ超大事です",
    },
    {
      timestamp: "0:00:58",
      title: "WEB投票は12時から",
      body: "投票は当日12時から始まると案内しました。期間前に押すと時間外になるので、12時を過ぎてからお願いします、と伝えました。",
    },
    {
      timestamp: "0:05:21",
      title: "トマトの栄養素が3人に",
      body: "ファンネーム「トマトの栄養素」が、この朝の時点で3人になったと喜びました。9月は70人を目指すとも話しています。",
    },
    {
      timestamp: "0:09:43",
      title: "すっぴんの朝、昼はメイクして会う",
      body: "朝早くの枠はすっぴんで配信。14:40からの枠ではメイクをした状態で会う、と予告しました。",
      quote: "14時40分からは確実にメイクをしています",
    },
    {
      timestamp: "0:13:51",
      title: "莉子からリコピン、トマトの栄養素",
      body: "名前の莉子からリコピン、トマトの栄養素へつながるファンネームの由来を説明しました。キラキラとトマトで応援してほしい、という話です。",
    },
    {
      timestamp: "0:26:16",
      title: "着実に通過する。アバター権も",
      body: "目標はまず着実に三次を通過すること。キラキラと投票を忘れないでほしい、と締めくくりました。アバター権も獲得したいと話しています。",
      quote: "私の目標は、まずちゃんと着実に通過することです",
    },
  ],
  goals: [
    { item: "三次通過", target: "着実に", statusThen: "最優先" },
    { item: "WEB投票", target: "12時から毎日", statusThen: "開始前の案内" },
    { item: "キラキラ", target: "大事", statusThen: "朝から呼びかけ" },
    { item: "トマトの栄養素", target: "70人", statusThen: "この朝で3人" },
    { item: "アバター権", target: "獲得", statusThen: "未獲得" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "三次初日の朝。キラキラのお願い" },
    { timestamp: "0:00:58", label: "WEB投票は12時から" },
    { timestamp: "0:05:21", label: "トマトの栄養素が3人に" },
    { timestamp: "0:07:32", label: "すっぴんの朝配信" },
    { timestamp: "0:09:43", label: "14:40からはメイクして会う" },
    { timestamp: "0:12:12", label: "ピースと笑顔" },
    { timestamp: "0:12:24", label: "トマトの栄養素70人目標" },
    { timestamp: "0:13:51", label: "莉子からリコピンのファンネーム" },
    { timestamp: "0:16:45", label: "ホワイトボードのペン" },
    { timestamp: "0:26:16", label: "着実に通過することが目標" },
    { timestamp: "0:27:01", label: "ランキング読み上げ" },
    { timestamp: "0:29:01", label: "アバター権を取りたい" },
  ],
  nextNote:
    "配信時点では、同日9月3日 14:40〜 はメイクして会うと案内していました。夜枠でも待っていると話し、WEB投票は同日12時からと案内していました。",
  sourceLabel: "2026年9月3日 SHOWROOM朝配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-04",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills:
      "静止画は録画の実フレームを10枚掲載しています。コメント・視聴者の表示名・他の出場者は写らないよう切り出しています。",
  }),
};
