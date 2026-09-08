import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills = [
  {
    "src": "/media/live/mily-b76-01-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。笑顔で話す場面",
    "caption": "0:10:30 笑顔で話す場面",
    "downloadName": "2026-08-28-night-01-r2201-t00h10m30s.jpg"
  },
  {
    "src": "/media/live/mily-b76-02-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。カメラに近づいて笑顔",
    "caption": "0:19:32 カメラに近づいて笑顔",
    "downloadName": "2026-08-28-night-02-r2201-t00h19m32s.jpg"
  },
  {
    "src": "/media/live/mily-b76-03-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。髪に手を添えて",
    "caption": "0:25:32 髪に手を添えて",
    "downloadName": "2026-08-28-night-03-r2201-t00h25m32s.jpg"
  },
  {
    "src": "/media/live/mily-b76-04-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。グラスを手にして",
    "caption": "0:34:33 グラスを手にして",
    "downloadName": "2026-08-28-night-04-r2201-t00h34m33s.jpg"
  },
  {
    "src": "/media/live/mily-b76-05-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。首をかしげて",
    "caption": "0:43:30 首をかしげて",
    "downloadName": "2026-08-28-night-05-r2201-t00h43m30s.jpg"
  },
  {
    "src": "/media/live/mily-b76-06-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。両手でピース",
    "caption": "0:55:33 両手でピース",
    "downloadName": "2026-08-28-night-06-r2201-t00h55m33s.jpg"
  },
  {
    "src": "/media/live/mily-b76-07-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。髪を後ろに流して笑顔",
    "caption": "1:04:31 髪を後ろに流して笑顔",
    "downloadName": "2026-08-28-night-07-r2201-t01h04m31s.jpg"
  },
  {
    "src": "/media/live/mily-b76-08-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。指を上げて笑顔",
    "caption": "1:10:31 指を上げて笑顔",
    "downloadName": "2026-08-28-night-08-r2201-t01h10m31s.jpg"
  },
  {
    "src": "/media/live/mily-b76-09-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。穏やかな表情",
    "caption": "1:16:28 穏やかな表情",
    "downloadName": "2026-08-28-night-09-r2201-t01h16m28s.jpg"
  },
  {
    "src": "/media/live/mily-b76-10-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月28日夜配信のみりぃ。指を下に向けて話す場面",
    "caption": "1:19:30 指を下に向けて話す場面",
    "downloadName": "2026-08-28-night-10-r2201-t01h19m30s.jpg"
  }
];

export const streamRecap20260828Night: StreamRecap = {
  "id": "2026-08-28-night-showroom",
  "date": "2026-08-28",
  "dateLabel": "2026.08.28（金）",
  "theme": "夜の雑談・挑戦と感謝",
  "broadcastLabel": "22:01頃〜 約92分",
  "platformLabel": "SHOWROOM",
  "summary": "二つのファイナルへの思い、フォロワー300人とアバター権の目標を語った夜。MCを担当した撮影や配信を始めた頃も振り返り、何度も会いに来てくれる皆さんへ感謝を伝えました。",
  "songs": [
    {
      "title": "ロコローション",
      "artist": "ORANGE RANGE",
      "timestamp": "0:08:42",
      "youtubeUrl": "https://www.youtube.com/watch?v=3-kV0xU5aNc"
    }
  ],
  "highlights": [
    {
      "timestamp": "0:13:49",
      "title": "フォロワー300人を目指して",
      "body": "フォロワーが256人になったと報告し、300人とアバター権を目指したいと呼びかけました。後半には、三次審査が始まる前に300人を迎えたいと話しました。"
    },
    {
      "timestamp": "0:21:55",
      "title": "頑張ればできると示したい",
      "body": "二つのコンテストでファイナルへ進みたいと話しました。自分のためだけでなく、応援する皆さんに、頑張ればできることを示したいと気持ちを伝えました。"
    },
    {
      "timestamp": "0:38:05",
      "title": "発信の積み重ね",
      "body": "Instagramのストーリーズなどで応援を呼びかけるため、発信を頑張っていると話しました。その努力を受け止める言葉にも感謝しました。"
    },
    {
      "timestamp": "0:39:28",
      "title": "好きな英語をもっと",
      "body": "英語をもっと流暢に話せるようになりたいと話しました。英語が好きだと伝えながら、好きという気持ちの強さに触れました。"
    },
    {
      "timestamp": "0:58:02",
      "title": "MCを担当した撮影の話",
      "body": "音楽番組のような企画の撮影でMCを担当したことを振り返りました。歌やピアノなどの才能に出会い、楽しい現場だったと話しました。"
    },
    {
      "timestamp": "1:19:13",
      "title": "一歩踏み出したときの涙",
      "body": "配信を始めた頃、配信ができたこと、一歩踏み出せたことへの安堵で涙が出たと振り返りました。当時を覚えている皆さんの言葉も受け止めました。"
    },
    {
      "timestamp": "1:25:41",
      "title": "何度も会いに来てくれる喜び",
      "body": "何度も配信へ来てくれることが心から嬉しいと、皆さんへ感謝しました。活動が広がっても、応援してくれる人を思い続けたいと話しました。"
    },
    {
      "timestamp": "1:30:26",
      "title": "これからも楽しく話したい",
      "body": "これからも皆さんと楽しく話したいと伝えました。翌朝の配信時間はまだ決まっておらず、後ほどファンルームで案内すると話して締めくくりました。"
    }
  ],
  "goals": [
    {
      "item": "フォロワー",
      "target": "300人",
      "statusThen": "256人と報告"
    },
    {
      "item": "アバター権",
      "target": "獲得したい",
      "statusThen": "協力を呼びかけ"
    },
    {
      "item": "コンテスト",
      "target": "両方のファイナル",
      "statusThen": "挑戦への思いを共有"
    }
  ],
  "timeline": [
    {
      "timestamp": "0:06:17",
      "label": "投票と動画の応援への感謝"
    },
    {
      "timestamp": "0:08:42",
      "label": "ロコローションの短い歌唱"
    },
    {
      "timestamp": "0:13:49",
      "label": "フォロワーとアバターの目標"
    },
    {
      "timestamp": "0:21:55",
      "label": "二つのファイナルへの思い"
    },
    {
      "timestamp": "0:28:25",
      "label": "自分を大切にすること"
    },
    {
      "timestamp": "0:38:05",
      "label": "SNSでの発信"
    },
    {
      "timestamp": "0:39:28",
      "label": "英語への思い"
    },
    {
      "timestamp": "0:44:09",
      "label": "三次審査前に300人を目指す"
    },
    {
      "timestamp": "0:58:02",
      "label": "MCを担当した撮影"
    },
    {
      "timestamp": "1:19:13",
      "label": "配信初期の涙の振り返り"
    },
    {
      "timestamp": "1:25:41",
      "label": "繰り返し訪れる皆さんへの感謝"
    },
    {
      "timestamp": "1:28:52",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:30:35",
      "label": "翌朝の時刻は後ほど案内"
    }
  ],
  "nextNote": "配信時点では、翌朝の配信時間は未定で、後ほどファンルームで案内すると話していました。",
  "sourceLabel": "2026年8月28日 SHOWROOM夜配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08"
,
  image: approvedStills[5], gallery: approvedStills,
  galleryZip: {src: "/media/live/mily-b76-night-stills.zip", filename: "みりぃ_20260828夜_10枚.zip", label: "10枚まとめて保存"},
  ranking: [RANKING_NOTE],
  transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画の実フレームから選んだ承認済み10枚を掲載しています。", extra: "歌は会話の合間の短い部分歌唱です。曲名や歌唱を確定できない短いフレーズは曲リストに含めていません。録画の記録時刻を概数で表示し、実際の配信開始時刻との一致は未確認です。"}),
};
