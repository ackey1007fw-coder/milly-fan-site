import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  buildTranscriptionNote,
  RANKING_NOTE,
  VIDEO_MATERIAL_NOTE,
} from "./streamRecapRules.ts";

const LUNCH_STILL_W = 1280;
const LUNCH_STILL_H = 720;

const lunchStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b54-01-close-smile.jpg",
    width: LUNCH_STILL_W,
    height: LUNCH_STILL_H,
    alt: "三次初日の昼配信で、黒のドット柄トップスとベージュのシュシュのみりぃが画面に寄って笑っている",
    caption: "エンディング近くの笑顔",
    downloadName: "みりぃ_三次初日昼_01_寄りの笑顔.jpg",
  },
  {
    src: "/media/live/mily-b54-02-ouen-board.jpg",
    width: LUNCH_STILL_W,
    height: LUNCH_STILL_H,
    alt: "三次初日の昼配信で、応援方法の紙を持って笑っているみりぃ。紙には1日1回のWEB投票、キラキラ星100個、指定ギフトと書かれている",
    caption: "応援方法の紙",
    downloadName: "みりぃ_三次初日昼_02_応援ボード.jpg",
  },
];

/**
 * 2026年9月3日のSHOWROOM昼配信を、オーナー提供の動画で確認した配信メモ。
 * サムネイルと応援方法の紙は録画の実フレーム2枚。表示用にLanczosで拡大しているが、
 * 顔の生成・補正はしていない。LIVE STREAM の配信カード専用で、
 * Gallery の media.ts / galleryVideos.ts には載せない。
 */
export const streamRecap20260903Lunch: StreamRecap = {
  id: "2026-09-03-lunch-gachi-showroom",
  date: "2026-09-03",
  dateLabel: "2026.09.03（木）",
  theme: "昼の配信・三次初日",
  broadcastLabel: "14:40頃〜 約40分",
  platformLabel: "SHOWROOM",
  summary:
    "三次審査1日目の昼枠。朝のあと外出して、メイクした状態で戻ってきた回です。応援方法の紙を見せながら、1日1回のWEB投票とキラキラ星100個をいちばんお願いしたい、と話しました。目標は三次通過とアバター権。",
  image: lunchStills[0],
  gallery: lunchStills,
  highlights: [
    {
      timestamp: "0:01:20",
      title: "メイクして戻ってきた昼枠",
      body: "朝枠のあと外に出て、戻ってからメイクをした状態で配信しました。外出の中身は言わないでね、と念を押しています。メイクのときは盛れる、という話にもなりました。",
    },
    {
      timestamp: "0:03:20",
      title: "応援方法の紙",
      body: "印刷した紙を見せました。1日1回のWEB投票、キラキラ星100個、指ハートや祝い花などの指定ギフト、という順です。夜枠では画面が変わるかも、とも話しています。",
    },
    {
      timestamp: "0:08:30",
      title: "通過とアバター権",
      body: "今の目標は三次審査を通過すること、そしてアバター権を獲得すること。ブロック1位は今回狙わないが、油断はしないので配信は多めにする、と説明しました。",
      quote: "私の今の目標としては三次審査を通過することです",
    },
    {
      timestamp: "0:19:20",
      title: "15時の100キラ",
      body: "枠の途中で15時になり、キラキラ星100個をお願いしました。15時以降でも夜でも投げられる、と伝えています。数が集まるとうれしい、とも話しました。",
    },
    {
      timestamp: "0:32:20",
      title: "トマトの栄養素",
      body: "ファンネームはトマトが好きだからではなく、あだ名のリコからリコピンへつながっている、と改めて話しました。9月は70人を目指しています。",
    },
  ],
  goals: [
    { item: "三次通過", target: "最優先", statusThen: "三次1日目" },
    { item: "WEB投票", target: "毎日1回", statusThen: "紙で案内" },
    { item: "キラキラ星", target: "100個", statusThen: "15時に呼びかけ" },
    { item: "アバター権", target: "獲得", statusThen: "未獲得" },
    { item: "トマトの栄養素", target: "70人", statusThen: "呼びかけ継続" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "暑い、お腹空いた。メイクして帰宅" },
    { timestamp: "0:01:20", label: "外出から戻った話。中身は言わない" },
    { timestamp: "0:03:20", label: "応援方法の紙。投票と100キラ" },
    { timestamp: "0:08:30", label: "三次通過とアバター権" },
    { timestamp: "0:16:10", label: "15時の100キラ予告" },
    { timestamp: "0:19:20", label: "15時。キラキラ星100個のお願い" },
    { timestamp: "0:29:30", label: "パーソナルカラーはブルベ夏" },
    { timestamp: "0:32:20", label: "トマトの栄養素の由来" },
    { timestamp: "0:35:30", label: "長い枠もどこかでやりたい" },
    { timestamp: "0:37:40", label: "ランキング読み上げ" },
    { timestamp: "0:38:50", label: "夜は21:00〜21:50。投票はバナーから" },
  ],
  nextNote:
    "配信時点では、同日 21:00〜21:50 を夜枠として案内していました。長く話したいので枠を組み替えるかもしれない、とも話しています。WEB投票はバナーから。",
  sourceLabel: "2026年9月3日 SHOWROOM昼配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-04",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills:
      "静止画は録画の実フレームを2枚掲載しています。表示用にLanczosで拡大していますが、顔の生成・補正はしていません。",
  }),
};
