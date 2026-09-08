import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b86-01-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月23日夜配信のみりぃ。カメラに向かって笑顔",
    "caption": "0:25:03 カメラに向かって笑顔",
    "downloadName": "2026-08-23-night-01-t00h25m03s.png"
  },
  {
    "src": "/media/live/mily-b86-02-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月23日夜配信のみりぃ。顔の横でハートのポーズ",
    "caption": "0:36:59 顔の横でハートのポーズ",
    "downloadName": "2026-08-23-night-02-t00h36m59s.png"
  },
  {
    "src": "/media/live/mily-b86-03-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月23日夜配信のみりぃ。横を向いて笑顔",
    "caption": "0:44:57 横を向いて笑顔",
    "downloadName": "2026-08-23-night-03-t00h44m57s.png"
  },
  {
    "src": "/media/live/mily-b86-04-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月23日夜配信のみりぃ。クッションを抱えて笑顔",
    "caption": "0:50:57 クッションを抱えて笑顔",
    "downloadName": "2026-08-23-night-04-t00h50m57s.png"
  },
  {
    "src": "/media/live/mily-b86-05-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月23日夜配信のみりぃ。両手を胸の前に添えて",
    "caption": "0:52:59 両手を胸の前に添えて",
    "downloadName": "2026-08-23-night-05-t00h52m59s.png"
  },
  {
    "src": "/media/live/mily-b86-06-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月23日夜配信のみりぃ。笑顔でカメラを見つめて",
    "caption": "1:01:00 笑顔でカメラを見つめて",
    "downloadName": "2026-08-23-night-06-t01h01m00s.png"
  },
  {
    "src": "/media/live/mily-b86-07-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月23日夜配信のみりぃ。両手でピース",
    "caption": "1:08:13 両手でピース",
    "downloadName": "2026-08-23-night-07-t01h08m13s.png"
  }
];
export const streamRecap20260823Night: StreamRecap = {
  "id": "2026-08-23-night-showroom",
  "date": "2026-08-23",
  "dateLabel": "2026.08.23（日）",
  "theme": "夜のラジオ振り返り",
  "broadcastLabel": "22:31頃〜 約69分",
  "platformLabel": "SHOWROOM",
  "summary": "ラジオ放送を終えた夜に、台本や選曲など番組づくりの舞台裏を紹介。準備が形になる楽しさや、聴いた人に新しい発見を届けたい気持ちを話し、一日の応援に感謝しました。",
  "highlights": [
    {
      "timestamp": "0:06:10",
      "title": "配信23日目のありがとう",
      "body": "配信を始めて23日目。ファンレベル10の人が45人、フォロワーが232人になったことを喜び、毎日の応援に感謝しました。"
    },
    {
      "timestamp": "0:14:55",
      "title": "準備から形になる楽しさ",
      "body": "会議を重ねた企画が形になっていくことに、準備段階からわくわくしていたと振り返りました。"
    },
    {
      "timestamp": "0:20:04",
      "title": "ラジオで新しい出会いを",
      "body": "番組を聴いた人に新しい発見や出会いがあればうれしいと話し、もっとよい放送にするため感想も呼びかけました。"
    },
    {
      "timestamp": "0:27:37",
      "title": "台本も選曲も自分たちで",
      "body": "台本や原稿、キューシートを作り、流す曲も自分たちで選んでいると紹介。番組を一から準備する舞台裏を話しました。"
    },
    {
      "timestamp": "0:37:50",
      "title": "外郎売の一節を披露",
      "body": "コメントをきっかけに、覚えている外郎売の一節を披露しました。言葉を届ける練習の話題でも盛り上がりました。"
    },
    {
      "timestamp": "1:02:44",
      "title": "次のラジオは映画の話",
      "body": "配信時点では、翌週のラジオのテーマは映画と案内。好きな映画などのメッセージを呼びかけていました。"
    },
    {
      "timestamp": "1:06:20",
      "title": "一日を通した応援に感謝",
      "body": "ラジオを聴いた人、朝や夜の配信に来た人へありがとうを伝え、最後にはスクショ用のポーズも見せました。"
    }
  ],
  "goals": [],
  "timeline": [
    {
      "timestamp": "0:06:10",
      "label": "配信23日目のありがとう"
    },
    {
      "timestamp": "0:14:55",
      "label": "準備から形になる楽しさ"
    },
    {
      "timestamp": "0:20:04",
      "label": "ラジオで新しい出会いを"
    },
    {
      "timestamp": "0:27:37",
      "label": "台本も選曲も自分たちで"
    },
    {
      "timestamp": "0:37:50",
      "label": "外郎売の一節を披露"
    },
    {
      "timestamp": "1:02:44",
      "label": "次のラジオは映画の話"
    },
    {
      "timestamp": "1:04:29",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:06:20",
      "label": "一日を通した応援に感謝"
    },
    {
      "timestamp": "1:08:03",
      "label": "翌朝の時刻は改めて案内"
    }
  ],
  "nextNote": "配信時点では、翌朝の配信時刻を再確認し、ファンルームで知らせると案内していました。確定時刻は確認できていません。",
  "sourceLabel": "2026年8月23日 夜配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b86-night-stills.zip",
    "filename": "みりぃ_20260823夜_7枚.zip",
    "label": "7枚まとめて保存"
  }
,
image: approvedStills[6], gallery: approvedStills, ranking: [RANKING_NOTE],
transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画から選んだ承認済み7枚を掲載しています。", extra: "自動字幕全編と主要区間の音声認識結果を照合しました。全編手動聴取は未実施です。記録時刻と実際の配信開始時刻との一致は未確認です。" }),
};
