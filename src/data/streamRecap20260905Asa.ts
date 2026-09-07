import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

const morningStills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b56-01-chin-pose.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿であごの下に両手を添えて微笑むみりぃ",
    "caption": "00:30 あごの下に手を添えて",
    "downloadName": "みりぃ_20260905朝_01.jpg"
  },
  {
    "src": "/media/live/mily-b56-02-soft-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿で首を少し傾けて微笑むみりぃ",
    "caption": "04:05 ふんわり笑顔",
    "downloadName": "みりぃ_20260905朝_02.jpg"
  },
  {
    "src": "/media/live/mily-b56-03-bright-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿で歯を見せて笑うみりぃ",
    "caption": "06:53 にっこり",
    "downloadName": "みりぃ_20260905朝_03.jpg"
  },
  {
    "src": "/media/live/mily-b56-04-cheek-pose.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿で頬に指を添えて笑うみりぃ",
    "caption": "07:53 ほっぺに指を添えて",
    "downloadName": "みりぃ_20260905朝_04.jpg"
  },
  {
    "src": "/media/live/mily-b56-05-singing-point.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿でカメラへ指を向けながら歌うみりぃ",
    "caption": "09:30 歌いながら指さし",
    "downloadName": "みりぃ_20260905朝_05.jpg"
  },
  {
    "src": "/media/live/mily-b56-06-calling-pose.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿で口元に両手を添えるみりぃ",
    "caption": "13:30 呼びかけのポーズ",
    "downloadName": "みりぃ_20260905朝_06.jpg"
  },
  {
    "src": "/media/live/mily-b56-07-big-laugh.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿で耳の近くに手を上げて笑うみりぃ",
    "caption": "15:18 大きな笑顔",
    "downloadName": "みりぃ_20260905朝_07.jpg"
  },
  {
    "src": "/media/live/mily-b56-08-playful-glasses.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿で指でめがねの形を作るみりぃ",
    "caption": "20:17 指でめがねのポーズ",
    "downloadName": "みりぃ_20260905朝_08.jpg"
  },
  {
    "src": "/media/live/mily-b56-09-double-peace.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿で額の近くで両手のピースサインをするみりぃ",
    "caption": "21:05 ダブルピース",
    "downloadName": "みりぃ_20260905朝_09.jpg"
  },
  {
    "src": "/media/live/mily-b56-10-goodbye-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の朝配信で、茶色のTシャツ姿で手を振って笑うみりぃ",
    "caption": "23:18 笑顔でバイバイ",
    "downloadName": "みりぃ_20260905朝_10.jpg"
  }
];

/** オーナー提供録画の自動文字起こしを要約。掲載する実フレーム10枚は目視確認。 */
export const streamRecap20260905Asa: StreamRecap = {
  id: "2026-09-05-morning-gachi-showroom",
  date: "2026-09-05",
  dateLabel: "2026.09.05（土）",
  theme: "朝の配信・三次3日目",
  broadcastLabel: "09:01頃〜 約23分",
  platformLabel: "SHOWROOM",
  summary:
    "来てくれたみんなへの感謝から始まった朝配信。もらった元気を歌で届けたいと、練習中の「Mela!」を披露しました。歌のあとは、人と比べすぎず自分のペースを大切にしたいという思いを語り、笑顔で一日を送り出しました。",
  image: morningStills[2],
  gallery: morningStills,
  galleryZip: {
    src: "/media/live/mily-b56-morning-stills.zip",
    filename: "みりぃ_20260905朝_スクショ10枚.zip",
    label: "10枚まとめて保存",
  },
  songs: [
    { title: "Mela!", artist: "緑黄色社会", timestamp: "0:09:20", youtubeUrl: "https://www.youtube.com/watch?v=aRDURmIYBZ4", karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=W5ykal8c4rY", channel: "カラオケ歌っちゃ王" } },
  ],
  highlights: [
    {
      timestamp: "0:02:00",
      title: "みんなからもらった元気",
      body: "前夜に来てくれた人たちへ感謝を伝え、この朝も会えたことを喜んでいました。WEB投票とキラキラの呼びかけもありました。",
    },
    {
      timestamp: "0:07:10",
      title: "歌で元気を届けたい",
      body: "「ケセラセラ」と「Mela!」を候補に選曲。リスナーにも自分にも元気を届けたいと話し、練習中の「Mela!」を披露しました。",
    },
    {
      timestamp: "0:13:25",
      title: "また練習して歌いたい",
      body: "歌唱後には、みんなからもらった元気を今度は自分が返したかった、と選曲への思いを説明。さらに練習して、また歌いたいと話していました。",
    },
    {
      timestamp: "0:16:15",
      title: "自分のペースを大切に",
      body: "人との違いを個性として捉え、自分のペースで進みたいという考えを語りました。前に進むことと、必要なときには立ち止まることの両方に触れていました。",
    },
    {
      timestamp: "0:21:13",
      title: "次の枠も笑顔で",
      body: "終盤はポーズを交えた軽い会話と来訪へのお礼。次の枠は14:30からと案内し、笑顔で朝配信を締めくくりました。",
    },
  ],
  goals: [
    { item: "WEB投票", target: "応援のお願い", statusThen: "朝も呼びかけ" },
    { item: "キラキラ", target: "応援のお願い", statusThen: "朝も呼びかけ" },
    { item: "歌の練習", target: "また披露したい", statusThen: "Mela!を歌唱" },
  ],
  ranking: [],
  timeline: [
    { timestamp: "0:00:00", label: "朝のあいさつと応援のお願い" },
    { timestamp: "0:02:00", label: "来てくれたみんなへの感謝" },
    { timestamp: "0:07:10", label: "歌の選曲" },
    { timestamp: "0:09:20", label: "Mela!を歌唱" },
    { timestamp: "0:13:25", label: "歌に込めた思い" },
    { timestamp: "0:16:15", label: "自分のペースと個性について" },
    { timestamp: "0:21:13", label: "次の枠は14:30と案内" },
    { timestamp: "0:23:00", label: "お礼と朝の締めくくり" },
  ],
  nextNote:
    "配信時点では、同日9月5日の次の枠は14:30からと案内していました。実施結果や現在の配信予定を示すものではありません。",
  sourceLabel: "2026年9月5日 SHOWROOM朝配信 録画から作成した配信レポート・自動文字起こし（オーナー提供）",
  verifiedAt: "2026-09-05",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。実フレーム10枚は目視確認しています。",
    extra: "時刻は録画先頭からの目安です。歌詞は掲載していません。",
  }),
};
