import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
  RANKING_NOTE,
} from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b69-01-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。両手を髪に添えて笑顔",
    "caption": "0:01:03 両手を髪に添えて笑顔",
    "downloadName": "2026-09-01-night-01-t00h01m03s400.jpg"
  },
  {
    "src": "/media/live/mily-b69-02-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。首を傾けて笑顔",
    "caption": "0:06:01 首を傾けて笑顔",
    "downloadName": "2026-09-01-night-02-t00h06m01s.jpg"
  },
  {
    "src": "/media/live/mily-b69-03-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。手を合わせて",
    "caption": "0:10:58 手を合わせて",
    "downloadName": "2026-09-01-night-03-t00h10m58s.jpg"
  },
  {
    "src": "/media/live/mily-b69-04-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。口元に指を添えて",
    "caption": "0:28:31 口元に指を添えて",
    "downloadName": "2026-09-01-night-04-t00h28m31s200.jpg"
  },
  {
    "src": "/media/live/mily-b69-05-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。頬に手を添えて",
    "caption": "0:41:02 頬に手を添えて",
    "downloadName": "2026-09-01-night-05-t00h41m02s.jpg"
  },
  {
    "src": "/media/live/mily-b69-06-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。髪に手を添えて笑顔",
    "caption": "1:03:30 髪に手を添えて笑顔",
    "downloadName": "2026-09-01-night-06-t01h03m30s600.jpg"
  },
  {
    "src": "/media/live/mily-b69-07-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。両頬に指を添えたポーズ",
    "caption": "1:11:00 両頬に指を添えたポーズ",
    "downloadName": "2026-09-01-night-07-t01h11m00s400.jpg"
  },
  {
    "src": "/media/live/mily-b69-08-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。カメラへ笑顔",
    "caption": "1:23:30 カメラへ笑顔",
    "downloadName": "2026-09-01-night-08-t01h23m30s.jpg"
  },
  {
    "src": "/media/live/mily-b69-09-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。手を組んで笑顔",
    "caption": "1:47:56 手を組んで笑顔",
    "downloadName": "2026-09-01-night-09-t01h47m56s400.jpg"
  },
  {
    "src": "/media/live/mily-b69-10-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月1日夜配信のみりぃ。両手を広げたポーズ",
    "caption": "1:48:07 両手を広げたポーズ",
    "downloadName": "2026-09-01-night-10-t01h48m07s800.jpg"
  }
];

/** 自動字幕の全文と、取得音声の要点区間の自動文字起こしを照合。 */
export const streamRecap20260901Night: StreamRecap = {
  image: approvedStills[6],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b69-night-stills.zip", filename: "みりぃ_20260901夜_厳選10枚.zip", label: "10枚まとめて保存" },
  id: "2026-09-01-night-showroom",
  date: "2026-09-01",
  dateLabel: "2026.09.01（火）",
  theme: "夜の語り・9月の一歩",
  broadcastLabel: "22:31頃〜 約108分",
  platformLabel: "SHOWROOM",
  summary:
    "9月最初の夜配信。言葉を届ける難しさや、挑戦を通じて誰かの一歩を後押ししたいという思いを話しました。Paton投票の締め切りを迎え、2位で終えたことへの感謝と、三次審査への意気込みを伝えた回です。",
  highlights: [
    {
      timestamp: "0:00:29",
      title: "9月最初の配信",
      body: "夜に集まった皆さんへ感謝を伝え、今月も一緒に過ごしていこうと呼びかけました。",
    },
    {
      timestamp: "0:29:24",
      title: "その場で言葉を交わせる良さ",
      body: "意図したことが違う形で伝わる難しさに触れ、その場で説明し直せることを生配信の良さとして話しました。",
    },
    {
      timestamp: "0:31:58",
      title: "言葉をもっと磨きたい",
      body: "語彙や表現を磨きたいという思いと、日々の配信で言葉が出てくるようになった手応えを話しました。",
    },
    {
      timestamp: "0:47:04",
      title: "ファンマークへの喜び",
      body: "ファンマークを付けてもらえたことを喜び、お礼のボードを準備。今月は5人を目標にしていると話しました。",
    },
    {
      timestamp: "1:15:13",
      title: "二つの挑戦に向き合う",
      body: "ミスサークルとキャンパスガールズのどちらもおろそかにしたくないと話し、自分で決めた挑戦を最後までやり切る思いを伝えました。",
    },
    {
      timestamp: "1:18:17",
      title: "誰かが一歩踏み出す勇気に",
      body: "自分が挑戦する姿を見せることで、誰かの一歩を後押しできたらと話しました。自分を誇れるように頑張りたいという思いも。",
    },
    {
      timestamp: "1:29:27",
      title: "Paton投票2位を報告",
      body: "締め切り後に投票画面を確認し、2位で終わったと報告。最後まで投票してくれた皆さんへ感謝を伝えました。",
    },
    {
      timestamp: "1:40:10",
      title: "三次審査へ、一緒に進む",
      body: "9月3日からの三次審査に向けて、本気で挑戦していることを伝えました。締めには、皆さんと一歩ずつ進んでいこうと呼びかけました。",
    },
  ],
  goals: [
    { item: "トマトの栄養素", target: "今月70人", statusThen: "参加を呼びかけ" },
    { item: "ファンマーク", target: "今月5人", statusThen: "2人目を喜ぶ" },
    { item: "Paton投票", target: "1位を目指す", statusThen: "締め切り後2位と報告" },
    { item: "ミスサークル", target: "ファイナル", statusThen: "応援を呼びかけ" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:29", label: "9月最初の挨拶" },
    { timestamp: "0:02:21", label: "今月の目標とPaton最終日の呼びかけ" },
    { timestamp: "0:10:14", label: "二次審査の投票へのお礼を準備中" },
    { timestamp: "0:16:32", label: "ラジオ番組の話題" },
    { timestamp: "0:29:24", label: "言葉の伝わり方と生配信の良さ" },
    { timestamp: "0:31:58", label: "言葉を磨きたいという思い" },
    { timestamp: "0:47:04", label: "ファンマークへの感謝とボード" },
    { timestamp: "0:54:31", label: "逆境もチャンスにしたい" },
    { timestamp: "1:15:13", label: "二つのコンテストへの挑戦" },
    { timestamp: "1:18:17", label: "誰かの一歩を後押ししたい" },
    { timestamp: "1:29:27", label: "Paton投票2位を報告" },
    { timestamp: "1:40:10", label: "三次審査への意気込み" },
    { timestamp: "1:43:20", label: "次の朝枠を9時と案内" },
    { timestamp: "1:43:43", label: "ランキング読み上げ" },
    { timestamp: "1:47:25", label: "一歩ずつ進もうと呼びかけ、おやすみ" },
  ],
  nextNote:
    "配信時点では、次の朝枠を9月2日9時からと案内していました。9月3日からミスサークルの三次審査が始まるという案内もありました。",
  sourceLabel: "2026年9月1日 SHOWROOM夜配信（オーナー提供録画の自動文字起こし）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレームから選んだ承認済み10枚を掲載しています。",
    extra: "自動字幕の全文を読み、要点区間は取得音声からの自動文字起こしとも照合しています。時刻は録画先頭からの目安です。",
  }),
};
