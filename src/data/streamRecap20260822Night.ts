import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE_WITHOUT_RANGE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b87-01-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日夜配信のみりぃ。カメラに向かって笑顔",
    "caption": "0:07:30 カメラに向かって笑顔",
    "downloadName": "2026-08-22-night-01-t00h07m30s.png"
  },
  {
    "src": "/media/live/mily-b87-02-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日夜配信のみりぃ。顔を近づけて笑顔",
    "caption": "0:52:31 顔を近づけて笑顔",
    "downloadName": "2026-08-22-night-02-t00h52m31s.png"
  },
  {
    "src": "/media/live/mily-b87-03-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日夜配信のみりぃ。口元に指を添えて笑顔",
    "caption": "0:58:30 口元に指を添えて笑顔",
    "downloadName": "2026-08-22-night-03-t00h58m30s.png"
  },
  {
    "src": "/media/live/mily-b87-04-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日夜配信のみりぃ。髪に手を添えて笑顔",
    "caption": "1:10:30 髪に手を添えて笑顔",
    "downloadName": "2026-08-22-night-04-t01h10m30s.png"
  },
  {
    "src": "/media/live/mily-b87-05-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日夜配信のみりぃ。両手を上げて拍手",
    "caption": "1:28:32 両手を上げて拍手",
    "downloadName": "2026-08-22-night-05-t01h28m32s.png"
  },
  {
    "src": "/media/live/mily-b87-06-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日夜配信のみりぃ。クッションを抱えて笑顔",
    "caption": "1:43:30 クッションを抱えて笑顔",
    "downloadName": "2026-08-22-night-06-t01h43m30s.png"
  },
  {
    "src": "/media/live/mily-b87-07-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日夜配信のみりぃ。髪をかき上げて笑顔",
    "caption": "1:52:30 髪をかき上げて笑顔",
    "downloadName": "2026-08-22-night-07-t01h52m30s.png"
  },
  {
    "src": "/media/live/mily-b87-08-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日夜配信のみりぃ。両手でピース",
    "caption": "2:16:32 両手でピース",
    "downloadName": "2026-08-22-night-08-t02h16m32s.png"
  }
];
export const streamRecap20260822Night: StreamRecap = {
  "id": "2026-08-22-night-showroom",
  "date": "2026-08-22",
  "dateLabel": "2026.08.22（土）",
  "theme": "夜の等身大トークと読書",
  "broadcastLabel": "20:31頃〜 約139分",
  "platformLabel": "SHOWROOM",
  "summary": "リスナーと一緒に明るいルームをつくりたいという思いから、配信を楽しみ続けること、挑戦や読書の話へ。等身大で話し、みんなとの時間を楽しむ夜の配信です。",
  "highlights": [
    {
      "timestamp": "0:01:53",
      "title": "等身大で話したい",
      "body": "かしこまらず、リスナーとは等身大で話していきたいと語りました。自然体でやり取りする夜のスタートです。"
    },
    {
      "timestamp": "0:29:31",
      "title": "みんなで明るいルームに",
      "body": "自分だけが明るいのではなく、リスナーも一緒に楽しく過ごせるルームにしたいと話しました。"
    },
    {
      "timestamp": "1:16:24",
      "title": "楽しい気持ちを大切に",
      "body": "配信を続けるうえで、自分が楽しいと思う気持ちを大事にしたいと話しました。みんなにも楽しんでもらえる場所を目指します。"
    },
    {
      "timestamp": "1:17:04",
      "title": "リアルタイムの反応",
      "body": "リスナーの反応をその場で受け取れることを、配信のよさとして挙げました。温かな言葉への感謝も伝えています。"
    },
    {
      "timestamp": "1:59:05",
      "title": "行動した先にあるもの",
      "body": "やってみなければ分からないことがあり、行動したからこそ結果があるという考えを話しました。"
    },
    {
      "timestamp": "1:59:33",
      "title": "本から得られる学び",
      "body": "本を読むようになった経験を振り返り、そこから得られる情報に価値を感じたと語りました。本が多くの工程を経て作られることにも触れています。"
    },
    {
      "timestamp": "2:15:44",
      "title": "みんなと話す時間",
      "body": "リスナーと話すことが幸せだと伝え、楽しい時間への感謝を込めて締めくくりました。"
    }
  ],
  "goals": [],
  "timeline": [
    {
      "timestamp": "0:01:53",
      "label": "等身大で話したい"
    },
    {
      "timestamp": "0:29:31",
      "label": "みんなで明るいルームに"
    },
    {
      "timestamp": "1:16:24",
      "label": "楽しい気持ちを大切に"
    },
    {
      "timestamp": "1:17:04",
      "label": "リアルタイムの反応"
    },
    {
      "timestamp": "1:59:05",
      "label": "行動した先にあるもの"
    },
    {
      "timestamp": "1:59:33",
      "label": "本から得られる学び"
    },
    {
      "timestamp": "2:15:44",
      "label": "みんなと話す時間"
    },
    {
      "timestamp": "2:16:19",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "2:17:50",
      "label": "翌朝と夜の配信案内"
    }
  ],
  "nextNote": "配信時点では、翌朝5:40からと、その後は22:30からの配信を案内していました。",
  "sourceLabel": "2026年8月22日 夜配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b87-night-stills.zip",
    "filename": "みりぃ_20260822夜_8枚.zip",
    "label": "8枚まとめて保存"
  }
,
image: approvedStills[5], gallery: approvedStills, ranking: [RANKING_NOTE_WITHOUT_RANGE],
transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画から選んだ承認済み8枚を掲載しています。", extra: "自動字幕全編と主要区間の音声認識結果を照合しました。全編手動聴取は未実施です。記録時刻と実際の配信開始時刻との一致は未確認です。" }),
};
