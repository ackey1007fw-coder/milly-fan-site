import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills = [
  {
    "src": "/media/live/mily-b77-01-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。三つ編みで笑顔",
    "caption": "0:01:29 三つ編みで笑顔",
    "downloadName": "2026-08-27-night-01-r2301-t00h01m29s.jpg"
  },
  {
    "src": "/media/live/mily-b77-02-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。頬に手を添えて",
    "caption": "0:07:31 頬に手を添えて",
    "downloadName": "2026-08-27-night-02-r2301-t00h07m31s.jpg"
  },
  {
    "src": "/media/live/mily-b77-03-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。カメラに近づいて笑顔",
    "caption": "0:34:31 カメラに近づいて笑顔",
    "downloadName": "2026-08-27-night-03-r2301-t00h34m31s.jpg"
  },
  {
    "src": "/media/live/mily-b77-04-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。ボードを手に笑顔",
    "caption": "0:43:29 ボードを手に笑顔",
    "downloadName": "2026-08-27-night-04-r2301-t00h43m29s.jpg"
  },
  {
    "src": "/media/live/mily-b77-05-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。腕を伸ばして笑顔",
    "caption": "0:55:29 腕を伸ばして笑顔",
    "downloadName": "2026-08-27-night-05-r2301-t00h55m29s.jpg"
  },
  {
    "src": "/media/live/mily-b77-06-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。笑顔で話す場面",
    "caption": "1:10:30 笑顔で話す場面",
    "downloadName": "2026-08-27-night-06-r2301-t01h10m30s.jpg"
  },
  {
    "src": "/media/live/mily-b77-07-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。三つ編みに手を添えて",
    "caption": "1:22:31 三つ編みに手を添えて",
    "downloadName": "2026-08-27-night-07-r2301-t01h22m31s.jpg"
  },
  {
    "src": "/media/live/mily-b77-08-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。頬を指さして",
    "caption": "1:28:30 頬を指さして",
    "downloadName": "2026-08-27-night-08-r2301-t01h28m30s.jpg"
  },
  {
    "src": "/media/live/mily-b77-09-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。首をかしげて",
    "caption": "1:43:30 首をかしげて",
    "downloadName": "2026-08-27-night-09-r2301-t01h43m30s.jpg"
  },
  {
    "src": "/media/live/mily-b77-10-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月27日夜配信のみりぃ。終盤のピース",
    "caption": "1:52:30 終盤のピース",
    "downloadName": "2026-08-27-night-10-r2301-t01h52m30s.jpg"
  }
];

export const streamRecap20260827Night: StreamRecap = {
  "id": "2026-08-27-night-showroom",
  "date": "2026-08-27",
  "dateLabel": "2026.08.27（木）",
  "theme": "夜の雑談・夢と自信",
  "broadcastLabel": "23:01頃〜 約114分",
  "platformLabel": "SHOWROOM",
  "summary": "三つ編み姿で、ごはんの相談から夢や挑戦の話まで語った夜。コンテストの先も活動を続けたいという思いと、自信をつけてきた変化を共有し、練習中の曲を短く口ずさみました。",
  "songs": [
    {
      "title": "完璧主義で☆",
      "artist": "FRUITS ZIPPER",
      "timestamp": "1:39:56",
      "youtubeUrl": "https://www.youtube.com/watch?v=fyrMcSH9ax0",
      "youtubeVersionNote": "Dance Practice版（FRUITS ZIPPER投稿）"
    }
  ],
  "highlights": [
    {
      "timestamp": "0:03:39",
      "title": "明日のごはんを相談",
      "body": "翌日に作るごはんの案を募集しました。料理に慣れていないので簡単なものをと相談し、後半にはパスタの話をしながら提案をボードへ書き留めました。"
    },
    {
      "timestamp": "0:21:54",
      "title": "アバターと二つの挑戦",
      "body": "アバター権の獲得に向けて、デザインを考えていると話しました。二つのコンテストでファイナルへ進み、挑戦する意味を示したいと気持ちを伝えました。"
    },
    {
      "timestamp": "0:57:31",
      "title": "また会いに来てくれる喜び",
      "body": "一度だけでなく、もう一度配信に来てくれることが嬉しいと話しました。三度、四度と会いに来てもらえるような配信を続けたいと伝えました。"
    },
    {
      "timestamp": "1:18:58",
      "title": "コンテストの先も見据えて",
      "body": "コンテストを大切にしつつ、そこがゴールではないと話しました。この先も活動する姿を見てもらい、応援してくれる皆さんへ恩返しをしたいと伝えました。"
    },
    {
      "timestamp": "1:20:09",
      "title": "配信で感じる前向きな変化",
      "body": "将来への不安があったなか、皆さんと配信することで今を生きている感覚があると話しました。楽しみながら将来へ進もうとしている自分を肯定しました。"
    },
    {
      "timestamp": "1:39:37",
      "title": "三次審査へ向けて練習中",
      "body": "FRUITS ZIPPERの「完璧主義で☆」を紹介し、短く口ずさみました。まだ全曲は覚えておらず、三次審査で歌いたいので練習していると話しました。"
    },
    {
      "timestamp": "1:43:45",
      "title": "一緒に自信をつけたい",
      "body": "自信を持てる人になることを目標に、コンテストへ参加したと話しました。少しずつ自信がついてきたことを伝え、皆さんにも一緒に自信をつけていこうと呼びかけました。"
    },
    {
      "timestamp": "1:50:20",
      "title": "応援への感謝と翌朝の案内",
      "body": "Paton投票や投稿への応援に感謝し、両方のファイナルへ進みたいと改めて伝えました。締めくくりには、翌朝7時半の配信を案内しました。"
    }
  ],
  "goals": [
    {
      "item": "コンテスト",
      "target": "両方のファイナル",
      "statusThen": "挑戦への思いを共有"
    },
    {
      "item": "アバター権",
      "target": "獲得したい",
      "statusThen": "デザインを検討"
    },
    {
      "item": "フォロワー",
      "target": "300人",
      "statusThen": "251人と報告"
    },
    {
      "item": "自信",
      "target": "一緒につけたい",
      "statusThen": "少しずつ変化を実感"
    }
  ],
  "timeline": [
    {
      "timestamp": "0:00:15",
      "label": "三つ編みでスタート"
    },
    {
      "timestamp": "0:03:39",
      "label": "翌日のごはんの相談"
    },
    {
      "timestamp": "0:18:11",
      "label": "二つのコンテストと応援"
    },
    {
      "timestamp": "0:21:54",
      "label": "アバターのデザイン"
    },
    {
      "timestamp": "0:46:43",
      "label": "パスタの話と料理メモ"
    },
    {
      "timestamp": "0:57:31",
      "label": "繰り返し来てくれる喜び"
    },
    {
      "timestamp": "1:18:58",
      "label": "コンテストの先の活動"
    },
    {
      "timestamp": "1:20:09",
      "label": "配信による心境の変化"
    },
    {
      "timestamp": "1:27:29",
      "label": "フォロワー300人を目指す"
    },
    {
      "timestamp": "1:30:01",
      "label": "毎日配信を続けること"
    },
    {
      "timestamp": "1:39:56",
      "label": "完璧主義で☆の短い歌唱"
    },
    {
      "timestamp": "1:43:45",
      "label": "自信をつけるという目標"
    },
    {
      "timestamp": "1:49:04",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:50:20",
      "label": "Paton投票への呼びかけ"
    },
    {
      "timestamp": "1:52:58",
      "label": "翌朝7時半の案内"
    }
  ],
  "nextNote": "配信時点では、翌朝7時半から配信し、ファンルームでも時間を案内すると話していました。",
  "sourceLabel": "2026年8月27日 SHOWROOM夜配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08"
,
  image: approvedStills[9], gallery: approvedStills,
  galleryZip: {src: "/media/live/mily-b77-night-stills.zip", filename: "みりぃ_20260827夜_10枚.zip", label: "10枚まとめて保存"},
  ranking: [RANKING_NOTE],
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画の実フレームから選んだ承認済み10枚を掲載しています。", extra: "歌は会話中の短い部分歌唱です。録画の記録時刻を概数で表示し、実際の配信開始時刻との一致は未確認です。"}),
};
