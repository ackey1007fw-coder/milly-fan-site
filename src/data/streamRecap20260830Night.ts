import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills = [
  {
    "src": "/media/live/mily-b72-01-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。カメラに向かって笑顔",
    "caption": "0:04:17 カメラに向かって笑顔",
    "downloadName": "2026-08-30-night-01-r2011-t00h04m17s.jpg"
  },
  {
    "src": "/media/live/mily-b72-02-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。両手を合わせて",
    "caption": "0:06:19 両手を合わせて",
    "downloadName": "2026-08-30-night-02-r2011-t00h06m19s.jpg"
  },
  {
    "src": "/media/live/mily-b72-03-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。髪に手を添えて笑顔",
    "caption": "0:12:21 髪に手を添えて笑顔",
    "downloadName": "2026-08-30-night-03-r2011-t00h12m21s.jpg"
  },
  {
    "src": "/media/live/mily-b72-04-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。「30日ありがとう」のボードを持って",
    "caption": "0:32:19 「30日ありがとう」のボードを持って",
    "downloadName": "2026-08-30-night-04-r2011-t00h32m19s.jpg"
  },
  {
    "src": "/media/live/mily-b72-05-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。片手を上げて笑顔",
    "caption": "0:38:21 片手を上げて笑顔",
    "downloadName": "2026-08-30-night-05-r2011-t00h38m21s.jpg"
  },
  {
    "src": "/media/live/mily-b72-06-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。両手を頭の後ろに添えて",
    "caption": "0:48:20 両手を頭の後ろに添えて",
    "downloadName": "2026-08-30-night-06-r2011-t00h48m20s.jpg"
  },
  {
    "src": "/media/live/mily-b72-07-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。手を振って",
    "caption": "0:52:20 手を振って",
    "downloadName": "2026-08-30-night-07-r2011-t00h52m20s.jpg"
  },
  {
    "src": "/media/live/mily-b72-08-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。両手でピース",
    "caption": "1:10:22 両手でピース",
    "downloadName": "2026-08-30-night-08-r2011-t01h10m22s.jpg"
  },
  {
    "src": "/media/live/mily-b72-09-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。首を傾けて笑顔",
    "caption": "1:14:20 首を傾けて笑顔",
    "downloadName": "2026-08-30-night-09-r2011-t01h14m20s.jpg"
  },
  {
    "src": "/media/live/mily-b72-10-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日夜配信のみりぃ。片手でピース",
    "caption": "1:24:20 片手でピース",
    "downloadName": "2026-08-30-night-10-r2011-t01h24m20s.jpg"
  }
];

export const streamRecap20260830Night: StreamRecap = {
  id: "2026-08-30-night-showroom",
  date: "2026-08-30",
  dateLabel: "2026.08.30（日）",
  theme: "夜の話・30日ありがとう",
  broadcastLabel: "20:11頃〜 約88分",
  platformLabel: "SHOWROOM",
  summary: "「30日ありがとう」のボードを手に、配信を続けてきた感謝を伝えました。ラジオで挑戦した即興の俳句や、初配信を再現するやりとりも。皆さんの言葉に自信をもらいながら、声や話し方をもっと磨きたいと話した夜です。",
  image: approvedStills[3],
  gallery: approvedStills,
  galleryZip: {"src": "/media/live/mily-b72-night-stills.zip", "filename": "みりぃ_20260830夜_10枚.zip", "label": "10枚まとめて保存"},
  highlights: [
    { timestamp: "0:14:36", title: "初心を忘れずに", body: "30日記念の配信で、慣れてきても初心は忘れたくないと話しました。皆さんとの冗談を交えながら、配信を続けてきた日々を振り返りました。" },
    { timestamp: "0:31:18", title: "30日ありがとうの一枚", body: "「30日ありがとう」と書いたボードを持ってスクショタイム。かわいい場面を撮ってほしいとお願いし、カメラに向けてポーズを取りました。" },
    { timestamp: "0:36:18", title: "3時間の生放送を振り返って", body: "ラジオでは時間と言葉の伝え方を考え続けていると話しました。生放送の難しさを感じながら、聴いてくれた皆さんへの感謝を伝えました。" },
    { timestamp: "0:40:15", title: "雨上がりを即興の俳句に", body: "ラジオでその場のお題から五七五を考えた話を紹介。雨上がりの静けさを思い浮かべたことを振り返り、もっと語彙を増やしたいと話しました。" },
    { timestamp: "0:51:00", title: "初配信をもう一度", body: "初めて配信した頃を再現するやりとりに。皆さんも初見役になって盛り上がり、最初は分からないことを教えてもらっていたと懐かしみました。" },
    { timestamp: "1:01:59", title: "言葉に自信をもらって", body: "自分に自信がなくなるときも、応援の言葉が力になっていると話しました。皆さんに支えてもらっていることへの感謝を伝えました。" },
    { timestamp: "1:07:17", title: "自分の声を好きになるために", body: "自分の声への思いを話し、好きだと言ってくれる皆さんに感謝。録音した声を聴く取り組みや滑舌の練習を紹介し、話し方を磨いていきたいと語りました。" },
    { timestamp: "1:25:09", title: "アバター権を目指して", body: "アバター権を取りたいと呼びかけました。終盤にはコンテストへの応援にも感謝し、皆さんと一緒に頑張りたいと伝えて締めました。" },
  ],
  goals: [
    { item: "アバター", target: "アバター権獲得", statusThen: "皆さんと一緒に挑戦" },
    { item: "話し方", target: "話術を磨く", statusThen: "さらに良くしたい" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:06:55", label: "30日記念への感謝" },
    { timestamp: "0:14:36", label: "初心を忘れずに" },
    { timestamp: "0:19:48", label: "この日のラジオと映画の話" },
    { timestamp: "0:31:18", label: "ボードを持ってスクショタイム" },
    { timestamp: "0:36:18", label: "3時間の生放送を振り返って" },
    { timestamp: "0:40:15", label: "即興の俳句と語彙の話" },
    { timestamp: "0:51:00", label: "初配信を再現するやりとり" },
    { timestamp: "1:01:59", label: "応援の言葉がくれる自信" },
    { timestamp: "1:07:17", label: "自分の声と滑舌の練習" },
    { timestamp: "1:16:03", label: "翌朝の配信について" },
    { timestamp: "1:22:24", label: "さらに話術を磨きたい" },
    { timestamp: "1:23:28", label: "ランキング読み上げ" },
    { timestamp: "1:25:09", label: "アバター権への呼びかけ" },
    { timestamp: "1:26:15", label: "コンテストへの応援に感謝" },
    { timestamp: "1:27:45", label: "おやすみの挨拶" },
  ],
  nextNote: "配信時点では、翌朝にも配信する見込みと話していました。開始時刻は未確定の案内でした。",
  sourceLabel: "2026年8月30日 SHOWROOM夜配信（オーナー提供録画の自動文字起こし）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は録画の実フレームから選んだ承認済み10枚を掲載しています。", extra: "録画の記録時刻を概数で表示しています。実際の配信開始時刻との一致は未確認です。短い口ずさみは確認が十分でないため、歌リストに含めていません。" }),
};
