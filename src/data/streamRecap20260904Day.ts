import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  buildTranscriptionNote,
  RANKING_NOTE,
  VIDEO_MATERIAL_NOTE,
} from "./streamRecapRules.ts";

const STILL_W = 400;
const STILL_H = 228;

const dayStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b54-01-hoodie-look.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の昼配信で、灰色パーカーのみりぃがカメラを見ている。ヘアピンを着けている",
    caption: "ベストショット。灰色パーカー",
    downloadName: "みりぃ_三次2日目昼_01_ベスト_パーカー.jpg",
  },
  {
    src: "/media/live/mily-b54-02-talk.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の昼配信で、灰色パーカーのみりぃが話している",
    caption: "話す",
    downloadName: "みりぃ_三次2日目昼_02_話す.jpg",
  },
  {
    src: "/media/live/mily-b54-03-cover-face.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の昼配信で、みりぃが両手で目元を覆っている",
    caption: "目元を両手で覆う",
    downloadName: "みりぃ_三次2日目昼_03_目元を覆う.jpg",
  },
  {
    src: "/media/live/mily-b54-04-wipe-tears.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の昼配信で、みりぃが涙を拭いながらカメラを見ている",
    caption: "涙を拭く",
    downloadName: "みりぃ_三次2日目昼_04_涙を拭く.jpg",
  },
  {
    src: "/media/live/mily-b54-05-wave.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次2日目の昼配信の終わりに、みりぃが右手を振っている",
    caption: "バイバイ",
    downloadName: "みりぃ_三次2日目昼_05_バイバイ.jpg",
  },
];

/**
 * 2026年9月4日のSHOWROOM昼配信を、オーナー提供の動画で確認した配信メモ。
 * 録音音声・全文文字起こし・画面録画は公開しない。
 * 実フレームを5枚掲載する。コメント・視聴者表示・他出場者は写らない。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない。
 */
export const streamRecap20260904Day: StreamRecap = {
  id: "2026-09-04-day-gachi-showroom",
  date: "2026-09-04",
  dateLabel: "2026.09.04（金）",
  theme: "昼の配信・三次2日目",
  broadcastLabel: "14:50頃〜 約20分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 三次審査2日目の昼枠。朝と同じ灰色パーカーで、約20分の短枠でした。夜は22:30からスーツ配信、メイクする予定。この枠ではメイク配信にはしませんでした。来てくれることへの感謝を伝え、WEB投票とキラキラをお願いしています。",
  image: dayStills[0],
  gallery: dayStills,
  galleryZip: {
    src: "/media/live/mily-b54-gachi-day-stills.zip",
    filename: "みりぃ_三次2日目昼_スクショ5枚.zip",
    label: "5枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:00",
      title: "夜はスーツ。22:30〜",
      body: "来てくれた人へお礼を言いながら、今夜はスーツで配信すると案内しました。22:30開始の予定で、その前にバイトがあるので遅れる可能性あり。遅れたら連絡する、と話しています。",
      quote: "夜の配信、スーツでやろうと思ってる",
    },
    {
      timestamp: "0:00:30",
      title: "キラキラから応援を",
      body: "キラキラのお礼を言い、キラキラから応援してほしいとお願いしました。投票は済ませましたか、とも聞いています。",
    },
    {
      timestamp: "0:01:45",
      title: "朝の謝罪は夜に。メイクはこの枠ではしない",
      body: "朝は謝罪の時間が足りず、夜に回すと話しました。この20分枠でメイク配信にする案は、真っ白い顔で終わるのが嫌だから見送り。夜はメイクする予定です。",
    },
    {
      timestamp: "0:05:00",
      title: "来てくれることが幸せ",
      body: "配信に来てくれることへの感謝を伝え、来てくれることが幸せだと話しました。",
      quote: "来てくれる事がすごく幸せだよ",
    },
    {
      timestamp: "0:12:40",
      title: "トマトの栄養素のペンは後で書く",
      body: "ファンネームを書くペンを買いに行けていない、と継続して話しました。水につけるのはだめ。後で絶対書く、と約束しています。",
    },
    {
      timestamp: "0:19:40",
      title: "お昼終わり。夜はスーツ",
      body: "ランキングを読んで、お昼終わります、夜はスーツ着ますのでよろしくね、と締めました。",
      quote: "夜はスーツ着ますのでよろしくね",
    },
  ],
  goals: [
    { item: "三次通過", target: "着実に", statusThen: "継続" },
    { item: "WEB投票", target: "毎日1回", statusThen: "昼も呼びかけ" },
    { item: "キラキラ", target: "大事", statusThen: "昼も呼びかけ" },
    { item: "夜枠", target: "22:30〜 スーツ", statusThen: "案内済み・遅れるかも" },
    { item: "トマトの栄養素", target: "名前書き", statusThen: "ペン入手後に書く" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "ありがとう。夜スーツは22:30〜" },
    { timestamp: "0:00:30", label: "キラキラのお願い" },
    { timestamp: "0:01:45", label: "朝の謝罪は夜。メイク配信は見送り" },
    { timestamp: "0:03:30", label: "投票した？" },
    { timestamp: "0:05:00", label: "来てくれることが幸せ" },
    { timestamp: "0:07:50", label: "無理をしすぎない" },
    { timestamp: "0:12:40", label: "トマトの栄養素のペンは後で書く" },
    { timestamp: "0:14:20", label: "泣ける時に泣いた方がいい" },
    { timestamp: "0:18:30", label: "ランキング読み上げ" },
    { timestamp: "0:19:40", label: "お昼終わり。夜はスーツ。バイバイ" },
  ],
  nextNote:
    "配信時点では、同日 22:30〜 のスーツ配信を案内していました。夜はメイク予定で、バイトのため遅れる可能性があり、遅れた場合は連絡すると話しています。WEB投票とキラキラも継続して呼びかけていました。",
  sourceLabel: "2026年9月4日 SHOWROOM昼配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-04",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills:
      "静止画は録画の実フレームを5枚掲載しています。コメント・視聴者の表示名・他の出場者は写らないよう切り出しています。",
  }),
};
