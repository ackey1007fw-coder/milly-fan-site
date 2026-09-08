import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b84-01-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日夜配信のみりぃ。ボードを持って笑顔",
    "caption": "0:03:02 ボードを持って笑顔",
    "downloadName": "2026-08-24-night-01-t00h03m02s.png"
  },
  {
    "src": "/media/live/mily-b84-02-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日夜配信のみりぃ。ボードの横で笑顔",
    "caption": "0:29:00 ボードの横で笑顔",
    "downloadName": "2026-08-24-night-02-t00h29m00s.png"
  },
  {
    "src": "/media/live/mily-b84-03-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日夜配信のみりぃ。人差し指を立てて",
    "caption": "0:35:00 人差し指を立てて",
    "downloadName": "2026-08-24-night-03-t00h35m00s.png"
  },
  {
    "src": "/media/live/mily-b84-04-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日夜配信のみりぃ。ボードを指して",
    "caption": "0:39:02 ボードを指して",
    "downloadName": "2026-08-24-night-04-t00h39m02s.png"
  },
  {
    "src": "/media/live/mily-b84-05-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日夜配信のみりぃ。花丸を描いたボードと笑顔",
    "caption": "0:49:00 花丸を描いたボードと笑顔",
    "downloadName": "2026-08-24-night-05-t00h49m00s.png"
  },
  {
    "src": "/media/live/mily-b84-06-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日夜配信のみりぃ。ボードを持って首をかしげて",
    "caption": "0:59:01 ボードを持って首をかしげて",
    "downloadName": "2026-08-24-night-06-t00h59m01s.png"
  },
  {
    "src": "/media/live/mily-b84-07-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日夜配信のみりぃ。終盤の笑顔",
    "caption": "1:09:00 終盤の笑顔",
    "downloadName": "2026-08-24-night-07-t01h09m00s.png"
  },
  {
    "src": "/media/live/mily-b84-08-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日夜配信のみりぃ。カメラに顔を近づけて笑顔",
    "caption": "1:10:58 カメラに顔を近づけて笑顔",
    "downloadName": "2026-08-24-night-08-t01h10m58s.png"
  }
];
export const streamRecap20260824Night: StreamRecap = {
  "id": "2026-08-24-night-showroom",
  "date": "2026-08-24",
  "dateLabel": "2026.08.24（月）",
  "theme": "夜の一歩と出会いへの感謝",
  "broadcastLabel": "22:01頃〜 約72分",
  "platformLabel": "SHOWROOM",
  "summary": "配信を始めるまでの勇気と、出会ったみんなへの感謝を語った夜。SHOWROOMのフォロワー240人達成を喜び、自分のよいところを見つける変化や、肩の力を抜いて配信する思いを話しました。",
  "highlights": [
    {
      "timestamp": "0:01:06",
      "title": "ボードに書いた目標",
      "body": "SHOWROOM240人、Instagram400人を目標に、ホワイトボードを見せてフォローを呼びかけました。"
    },
    {
      "timestamp": "0:02:17",
      "title": "勇気を振り絞った一歩",
      "body": "配信を始めることは大きな一歩だったと振り返り、自分の行動が誰かの自信や前進のきっかけになればと話しました。"
    },
    {
      "timestamp": "0:06:51",
      "title": "挑戦のハードルが下がった",
      "body": "配信を通して知らなかった自分や新しい挑戦に出会い、みんなのおかげで挑戦しやすくなったと感謝しました。"
    },
    {
      "timestamp": "0:38:59",
      "title": "240人達成をみんなと喜ぶ",
      "body": "SHOWROOMのフォロワー240人達成を喜び、応援に感謝。ホワイトボードには達成の花丸を描きました。"
    },
    {
      "timestamp": "0:55:49",
      "title": "温かい言葉に支えられて",
      "body": "配信を決断した一歩を認めてもらえたことや、優しい人たちに出会えた嬉しさを振り返りました。"
    },
    {
      "timestamp": "0:59:07",
      "title": "自分のよいところを見つける",
      "body": "配信を始めて少しずつ考え方が変わり、自分のよいところを見つけるのが上手になってきた気がすると話しました。"
    },
    {
      "timestamp": "1:01:31",
      "title": "肩の力を抜く配信へ",
      "body": "いつも完璧な姿で配信しようとしていた思いを振り返り、みんなと話す時間や自分の時間も大切にしたいと話しました。"
    },
    {
      "timestamp": "1:07:20",
      "title": "理想の自分を目指して",
      "body": "自分が理想とする人になれたら、応援してくれるみんなにも喜んでもらえるのではと話しました。"
    }
  ],
  "goals": [
    {
      "item": "SHOWROOM",
      "target": "240人",
      "statusThen": "達成を報告"
    },
    {
      "item": "インスタ",
      "target": "400人",
      "statusThen": "フォロー呼びかけ"
    }
  ],
  "timeline": [
    {
      "timestamp": "0:01:06",
      "label": "ボードに書いた目標"
    },
    {
      "timestamp": "0:02:17",
      "label": "勇気を振り絞った一歩"
    },
    {
      "timestamp": "0:06:51",
      "label": "挑戦のハードルが下がった"
    },
    {
      "timestamp": "0:38:59",
      "label": "240人達成をみんなと喜ぶ"
    },
    {
      "timestamp": "0:55:49",
      "label": "温かい言葉に支えられて"
    },
    {
      "timestamp": "0:59:07",
      "label": "自分のよいところを見つける"
    },
    {
      "timestamp": "1:01:31",
      "label": "肩の力を抜く配信へ"
    },
    {
      "timestamp": "1:07:20",
      "label": "理想の自分を目指して"
    },
    {
      "timestamp": "1:08:32",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:10:26",
      "label": "翌朝と翌夜の予定を案内"
    }
  ],
  "nextNote": "配信時点では、翌朝は10時から、翌夜は22:30からを予定していると案内していました。",
  "sourceLabel": "2026年8月24日 夜配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b84-night-stills.zip",
    "filename": "みりぃ_20260824夜_8枚.zip",
    "label": "8枚まとめて保存"
  }
,
image: approvedStills[4], gallery: approvedStills, ranking: [RANKING_NOTE],
transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画から選んだ承認済み8枚を掲載しています。", extra: "自動字幕全編と主要区間の音声認識結果を照合しました。全編手動聴取は未実施です。短い歌唱候補は確認中のため曲リストに含めていません。記録時刻と実際の配信開始時刻との一致は未確認です。" }),
};
