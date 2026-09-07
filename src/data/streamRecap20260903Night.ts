import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  buildTranscriptionNote,
  RANKING_NOTE,
  VIDEO_MATERIAL_NOTE,
} from "./streamRecapRules.ts";

const STILL_W = 400;
const STILL_H = 228;

const nightStills: StreamRecapImage[] = [
  {
    src: "/media/live/mily-b53-01-surprise-choker.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次初日の夜配信で、黒いドット柄のトップスと大きなリボンのみりぃが口を開けて驚いている",
    caption: "ベストショット。びっくり",
    downloadName: "みりぃ_三次初日夜_01_ベスト_びっくり.jpg",
  },
  {
    src: "/media/live/mily-b53-02-whiteboard.jpg",
    width: STILL_W,
    height: STILL_H,
    alt: "三次初日の夜配信で、ホワイトボードとペンを持って驚いているみりぃ",
    caption: "ホワイトボード",
    downloadName: "みりぃ_三次初日夜_02_ホワイトボード.jpg",
  },
];

/**
 * 2026年9月3日のSHOWROOM夜配信を、オーナー提供の動画で確認した配信メモ。
 * 録音音声・全文文字起こし・画面録画は公開しない。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない。
 */
export const streamRecap20260903Night: StreamRecap = {
  id: "2026-09-03-night-gachi-showroom",
  date: "2026-09-03",
  dateLabel: "2026.09.03（木）",
  theme: "夜の配信・三次初日",
  broadcastLabel: "23:01頃〜 約49分",
  platformLabel: "SHOWROOM",
  summary:
    "三次審査1日目の夜枠。告知の21時より遅く始まり、フルメイクで約49分話しました。投票とキラキラ100が最優先で、ブロック1位は狙わず、アバター権と仲間を集めてから上を目指す、という方針の回です。",
  image: nightStills[0],
  gallery: nightStills,
  galleryZip: {
    src: "/media/live/mily-b53-gachi-night-stills.zip",
    filename: "みりぃ_三次初日夜_スクショ2枚.zip",
    label: "2枚まとめて保存",
  },
  highlights: [
    {
      timestamp: "0:00:15",
      title: "遅れて開始。応援ボードを出す",
      body: "21時枠より遅く始まり、お詫びからスタート。ホワイトボードで投票・キラキラ・指定ギフトのお願いを見せました。",
    },
    {
      timestamp: "0:08:00",
      title: "投票は1日1回。キラキラ100",
      body: "WEB投票を忘れないでほしいことと、キラキラ星100個をあらためてお願いしました。無料ギフトでも、投げたい気持ちがうれしいと話しています。",
    },
    {
      timestamp: "0:21:20",
      title: "1位は狙わない。今の順位帯",
      body: "キャンペーン1位は狙わず、まずは仲間を集めてから上を目指したいと話しました。この時点の目安はキラキラ23位、指ハート20位、祝い花17位、本体21位前後です。",
    },
    {
      timestamp: "0:24:00",
      title: "アバター権は絶対取りたい",
      body: "目標ボードを見せ、三次通過とアバター権をあらためて掲げました。まだ取ったことがない、とも話しています。",
    },
    {
      timestamp: "0:32:00",
      title: "チョーカーは巻いているだけ",
      body: "今日の服とメイクを褒められ、チョーカーの巻き方を実演。強く引くと首が締まるので危ない、と笑っていました。",
    },
    {
      timestamp: "0:47:00",
      title: "明朝は7時から約30分",
      body: "ランキングを読んで、翌朝7時から約30分と案内して締めました。",
    },
  ],
  goals: [
    { item: "三次通過", target: "着実に", statusThen: "最優先" },
    { item: "WEB投票", target: "1日1回", statusThen: "最優先のお願い" },
    { item: "キラキラ100", target: "大事", statusThen: "夜も呼びかけ" },
    { item: "アバター権", target: "獲得", statusThen: "未獲得・絶対取りたい" },
    { item: "ブロック1位", target: "狙わない", statusThen: "仲間を集めてから" },
    { item: "トマトの栄養素", target: "70人", statusThen: "この夜で4人目" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "遅れての開始。ギフトのお礼" },
    { timestamp: "0:00:15", label: "ホワイトボードで応援方法" },
    { timestamp: "0:05:00", label: "ギフトごとに順位が出る話" },
    { timestamp: "0:08:00", label: "1日1回の投票とキラキラ100" },
    { timestamp: "0:13:00", label: "呼び名のみりぃとリコ" },
    { timestamp: "0:21:20", label: "1位は狙わない。いまの順位帯" },
    { timestamp: "0:24:00", label: "アバター権と仲間集め" },
    { timestamp: "0:32:00", label: "今日の服とチョーカー" },
    { timestamp: "0:35:00", label: "メイクしてきた。面接の中身は言わない" },
    { timestamp: "0:44:00", label: "就寝の人を送り出す" },
    { timestamp: "0:47:00", label: "ランキング読み上げ" },
    { timestamp: "0:48:20", label: "明朝7時〜。おつみりん" },
  ],
  nextNote:
    "配信時点では、翌9月4日 7:00〜 約30分と案内していました。WEB投票は1日1回、キラキラ100も継続して呼びかけていました。",
  sourceLabel: "2026年9月3日 SHOWROOM夜配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-04",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills:
      "静止画は録画の実フレームを2枚掲載しています。コメント・視聴者の表示名・他の出場者は写らないよう切り出しています。",
  }),
};
