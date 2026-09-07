import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  buildTranscriptionNote,
  RANKING_NOTE,
  VIDEO_MATERIAL_NOTE,
} from "./streamRecapRules.ts";

const STILL_W = 400;
const STILL_H = 228;

const morningStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b55-01-smile.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の朝配信で、灰色パーカーのみりぃが微笑んでいる。ヘアピンを着けている",
    caption: "ベストショット。笑顔",
    downloadName: "みりぃ_三次2日目朝_01_ベスト_笑顔.jpg",
  },
  {
    src: "/media/live/mily-b55-02-talk.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の朝配信で、灰色パーカーのみりぃが話している",
    caption: "話す",
    downloadName: "みりぃ_三次2日目朝_02_話す.jpg",
  },
  {
    src: "/media/live/mily-b55-03-look.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の朝配信で、みりぃがカメラを見ている",
    caption: "見つめて",
    downloadName: "みりぃ_三次2日目朝_03_見つめて.jpg",
  },
  {
    src: "/media/live/mily-b55-04-board.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の朝配信で、みりぃがホワイトボードに書いている",
    caption: "ボードに書く",
    downloadName: "みりぃ_三次2日目朝_04_ボード.jpg",
  },
  {
    src: "/media/live/mily-b55-05-hoodie.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の朝配信で、灰色パーカーのみりぃがこちらを見ている",
    caption: "灰色パーカー",
    downloadName: "みりぃ_三次2日目朝_05_パーカー.jpg",
  },
];

/**
 * 2026年9月4日のSHOWROOM朝配信を、オーナー提供の動画で確認した配信メモ。
 * 録音音声・全文文字起こし・画面録画は公開しない。
 * 実フレームを5枚掲載する。コメント・視聴者表示・他出場者は写らない。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない。
 */
export const streamRecap20260904Asa: StreamRecap = {
  id: "2026-09-04-morning-gachi-showroom",
  date: "2026-09-04",
  dateLabel: "2026.09.04（金）",
  theme: "朝の配信・三次2日目",
  broadcastLabel: "07:12頃〜 約31分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 三次審査2日目の朝枠。寝坊で開始が遅れ、灰色パーカーで約31分でした。謝罪とホワイトボード用のペン買いは夜へ回すと話しています。夜はスーツで、22:30〜23:40。WEB投票とキラキラをお願いし、昼枠は少し短く夜枠を伸ばすと案内しました。",
  image: morningStills[0],
  gallery: morningStills,
  galleryZip: {
    src: "/media/live/mily-b55-gachi-morning-stills.zip",
    filename: "みりぃ_三次2日目朝_スクショ5枚.zip",
    label: "5枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:03",
      title: "謝罪は夜に",
      body: "朝は時間がなくて、謝罪は夜に回したいと話しました。夜の方が来やすい、この朝は用事がある、と説明しています。",
      quote: "夜、謝罪会見してもいい？",
    },
    {
      timestamp: "0:01:06",
      title: "夜はスーツ",
      body: "夜はスーツで配信すると案内しました。久しぶりだから、昼だと来られない時間もある、とも話しています。",
      quote: "夜スーツ、そう",
    },
    {
      timestamp: "0:04:39",
      title: "ペンは夜に買う",
      body: "ホワイトボード用のペンを買いたいから夜にしたい、と話しました。トマトの栄養素の名前は夜に書く、と続けています。",
    },
    {
      timestamp: "0:13:12",
      title: "WEB投票とキラキラ",
      body: "今日やってほしいことは2つ、とボードなしで案内しました。ウェブ投票とキラキラです。",
      quote: "1、ウェブ投票。2、キラキラ。この二つ。",
    },
    {
      timestamp: "0:21:05",
      title: "夜は22:30〜23:40",
      body: "朝は予定どおり7:40で終え、足りない分は夜を10分伸ばすと決めました。ボードには夜・スーツ配信・22:30〜23:40と書いています。夜はメイクする予定。",
      quote: "22時半から23時40分までやろうかな",
    },
    {
      timestamp: "0:28:53",
      title: "おつみり。昼短く夜長く",
      body: "ランキングを読んで朝を締めました。お昼は少し短く、夜は長く伸ばしましょう、夜会おうね、と話しています。",
      quote: "夜会おうね",
    },
  ],
  goals: [
    { item: "三次通過", target: "着実に", statusThen: "継続" },
    { item: "WEB投票", target: "毎日1回", statusThen: "朝も呼びかけ" },
    { item: "キラキラ", target: "大事", statusThen: "朝も呼びかけ" },
    { item: "夜枠", target: "夜スーツ", statusThen: "案内済み" },
    { item: "トマトの栄養素", target: "名前書き", statusThen: "夜に書く" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:03", label: "おはよう。謝罪は夜に" },
    { timestamp: "0:01:06", label: "夜スーツ" },
    { timestamp: "0:04:39", label: "ペンは夜に買う" },
    { timestamp: "0:08:08", label: "朝の枠は7:40まで" },
    { timestamp: "0:13:12", label: "WEB投票とキラキラ" },
    { timestamp: "0:15:35", label: "夜は22:30〜。スーツ" },
    { timestamp: "0:17:02", label: "二度寝で寝坊" },
    { timestamp: "0:21:05", label: "昼短く夜長く。22:30〜23:40" },
    { timestamp: "0:24:00", label: "ボードに夜スーツ配信を書く" },
    { timestamp: "0:28:53", label: "ランキング読み上げ" },
    { timestamp: "0:29:57", label: "おつみり。夜会おうね" },
  ],
  nextNote:
    "配信時点では、同日 22:30〜23:40 のスーツ配信を案内していました。夜はメイク予定で、昼枠は少し短くすると話しています。WEB投票とキラキラも継続して呼びかけていました。",
  sourceLabel: "2026年9月4日 SHOWROOM朝配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-05",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills:
      "静止画は録画の実フレームを5枚掲載しています。コメント・視聴者の表示名・他の出場者は写らないよう切り出しています。",
  }),
};
