import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills = [
  {
    "src": "/media/live/mily-b90-01-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日夜配信のみりぃ。両手を顔の横に添えて笑顔",
    "caption": "0:09:22 両手を顔の横に添えて笑顔",
    "downloadName": "2026-08-21-night-01-t00h09m22s.png"
  },
  {
    "src": "/media/live/mily-b90-02-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日夜配信のみりぃ。首を傾けて笑顔",
    "caption": "0:36:20 首を傾けて笑顔",
    "downloadName": "2026-08-21-night-02-t00h36m20s.png"
  },
  {
    "src": "/media/live/mily-b90-03-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日夜配信のみりぃ。篠笛を持って",
    "caption": "0:48:20 篠笛を持って",
    "downloadName": "2026-08-21-night-03-t00h48m20s.png"
  },
  {
    "src": "/media/live/mily-b90-04-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日夜配信のみりぃ。カメラに向かって笑顔",
    "caption": "1:00:21 カメラに向かって笑顔",
    "downloadName": "2026-08-21-night-04-t01h00m21s.png"
  },
  {
    "src": "/media/live/mily-b90-05-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日夜配信のみりぃ。髪に手を添えて",
    "caption": "1:15:22 髪に手を添えて",
    "downloadName": "2026-08-21-night-05-t01h15m22s.png"
  },
  {
    "src": "/media/live/mily-b90-06-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日夜配信のみりぃ。親指と小指を立てて",
    "caption": "1:18:18 親指と小指を立てて",
    "downloadName": "2026-08-21-night-06-t01h18m18s.png"
  },
  {
    "src": "/media/live/mily-b90-07-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日夜配信のみりぃ。両手をあごの下に添えて笑顔",
    "caption": "2:00:19 両手をあごの下に添えて笑顔",
    "downloadName": "2026-08-21-night-07-t02h00m19s.png"
  },
  {
    "src": "/media/live/mily-b90-08-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日夜配信のみりぃ。両手の親指を立てて笑顔",
    "caption": "2:30:18 両手の親指を立てて笑顔",
    "downloadName": "2026-08-21-night-08-t02h30m18s.png"
  }
];

export const streamRecap20260821Night: StreamRecap = {
  "id": "2026-08-21-night",
  "date": "2026-08-21",
  "dateLabel": "2026.08.21（金）",
  "theme": "夜の三つ編みと温かいルーム",
  "broadcastLabel": "23:21頃〜 約159分",
  "platformLabel": "SHOWROOM",
  "summary": "三つ編みを作りながら、ランウェイでしてほしいことをみんなと相談した夜。ファンネームに込めた思いや、新しい人を迎える配信について語り、応援への感謝を伝えました。",
  "highlights": [
    {
      "timestamp": "0:06:42",
      "title": "三つ編みを公開",
      "body": "髪を編む手順を見せながら、三つ編みを作りました。完成した髪型を披露し、寄せられるコメントに応えています。"
    },
    {
      "timestamp": "0:15:18",
      "title": "ランウェイでしてほしいこと",
      "body": "ランウェイを歩けたらしてほしいことを募集すると、コメント欄は大喜利のような展開に。初めて訪れた人にも参加を呼びかけ、みんなのアイデアに反応しながら話しました。"
    },
    {
      "timestamp": "0:37:45",
      "title": "トマトの栄養素に込めた思い",
      "body": "ファンネームの由来を紹介し、みんなで一つのトマトをおいしく育てていこうという思いを説明しました。一緒に「トマトの栄養素」になろう、と呼びかけています。"
    },
    {
      "timestamp": "0:40:30",
      "title": "毎日少しずつ成長",
      "body": "日々少しずつ成長している自分を、また見に来てほしいと伝えました。翌日も、その先も配信に来てほしいという思いを、冗談を交えながら話しています。"
    },
    {
      "timestamp": "1:22:40",
      "title": "新しい挑戦を受け止めてくれて",
      "body": "早朝の配信で新しい人と出会いたいという話から、配信の進め方をみんなと相談しました。挑戦を応援するコメントに、リスナーに恵まれていると感謝を伝えています。"
    },
    {
      "timestamp": "1:33:50",
      "title": "初めての人にも温かいルーム",
      "body": "初めて訪れた人も話しやすい、温かいルームにしていこうと呼びかけました。いつも来る人も新しい人も、楽しく過ごせる配信を考えています。"
    },
    {
      "timestamp": "1:38:44",
      "title": "6位への上昇にありがとう",
      "body": "ランウェイ出演を目指すイベントで、配信中に6位への上昇を確認しました。まだ油断はできないとしながらも、応援してくれたみんなに感謝を伝えています。"
    },
    {
      "timestamp": "2:37:16",
      "title": "コメントは自分のペースで",
      "body": "ランキングを読み上げた後、コメントが苦手な人には拍手から始めてみようと呼びかけました。自分のペースで参加してほしいと伝え、遅い時間まで一緒に過ごしたみんなへ感謝して締めくくっています。"
    }
  ],
  "goals": [],
  "timeline": [
    {
      "timestamp": "0:06:42",
      "label": "三つ編みを公開"
    },
    {
      "timestamp": "0:15:18",
      "label": "ランウェイでしてほしいこと"
    },
    {
      "timestamp": "0:37:45",
      "label": "トマトの栄養素に込めた思い"
    },
    {
      "timestamp": "0:40:30",
      "label": "毎日少しずつ成長"
    },
    {
      "timestamp": "1:22:40",
      "label": "新しい挑戦を受け止めてくれて"
    },
    {
      "timestamp": "1:33:50",
      "label": "初めての人にも温かいルーム"
    },
    {
      "timestamp": "1:38:44",
      "label": "6位への上昇にありがとう"
    },
    {
      "timestamp": "2:37:16",
      "label": "コメントは自分のペースで"
    }
  ],
  "nextNote": "配信時点では、翌朝5時頃から新しい人との出会いを増やす配信をしたいと案内していました。途中で5時半などの案も出ていました。",
  "sourceLabel": "2026年8月21日 夜配信（オーナー提供録画・自動字幕）",
  "verifiedAt": "2026-09-08",
  image: approvedStills[0],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b90-night-stills.zip", filename: "みりぃ_20260821夜_8枚.zip", label: "8枚まとめて保存" },
  ranking: [RANKING_NOTE],
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当該録画から選んだ承認済み8枚を掲載しています。",
    extra: "録画全編の自動字幕を読み、主要区間の音声認識結果と照合しました。全編手動聴取は未実施です。記録時刻と実際の配信開始時刻との一致は未確認です。",
  }),
};
