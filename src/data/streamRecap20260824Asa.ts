import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b85-01-asa-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日朝配信のみりぃ。髪をまとめながら笑顔",
    "caption": "0:22:07 髪をまとめながら笑顔",
    "downloadName": "2026-08-24-asa-01-t00h22m07s.png"
  },
  {
    "src": "/media/live/mily-b85-02-asa-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日朝配信のみりぃ。カメラに向かって笑顔",
    "caption": "0:22:10 カメラに向かって笑顔",
    "downloadName": "2026-08-24-asa-02-t00h22m10s.png"
  },
  {
    "src": "/media/live/mily-b85-03-asa-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日朝配信のみりぃ。顔の横に手を添えて",
    "caption": "0:22:20 顔の横に手を添えて",
    "downloadName": "2026-08-24-asa-03-t00h22m20s.png"
  },
  {
    "src": "/media/live/mily-b85-04-asa-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日朝配信のみりぃ。両手を広げて",
    "caption": "0:22:50 両手を広げて",
    "downloadName": "2026-08-24-asa-04-t00h22m50s.png"
  },
  {
    "src": "/media/live/mily-b85-05-asa-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日朝配信のみりぃ。両手の人差し指を立てて",
    "caption": "0:23:00 両手の人差し指を立てて",
    "downloadName": "2026-08-24-asa-05-t00h23m00s.png"
  },
  {
    "src": "/media/live/mily-b85-06-asa-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日朝配信のみりぃ。ピースと笑顔",
    "caption": "0:23:02 ピースと笑顔",
    "downloadName": "2026-08-24-asa-06-t00h23m02s.png"
  },
  {
    "src": "/media/live/mily-b85-07-asa-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月24日朝配信のみりぃ。両手を顔の横に添えて",
    "caption": "0:23:03 両手を顔の横に添えて",
    "downloadName": "2026-08-24-asa-07-t00h23m03s.png"
  }
];
export const streamRecap20260824Asa: StreamRecap = {
  "id": "2026-08-24-asa-showroom",
  "date": "2026-08-24",
  "dateLabel": "2026.08.24（月）",
  "theme": "朝のメイクと笑顔の話",
  "broadcastLabel": "6:27頃〜 約24分",
  "platformLabel": "SHOWROOM",
  "summary": "配信24日目の朝は、出かける準備をしながら初めてのメイク配信。忙しい朝でもみんなと話したい気持ちや、頑張る人から受ける刺激、自分の笑顔を好きになることについて話しました。",
  "highlights": [
    {
      "timestamp": "0:01:43",
      "title": "配信24日目の朝",
      "body": "初めて来た方にも挨拶し、配信を始めて24日目と紹介。メイクを進めながら応援への感謝を伝えました。"
    },
    {
      "timestamp": "0:03:16",
      "title": "忙しい朝にも話したくて",
      "body": "出かける準備で急いでいる中でも、みんなと話したいから配信していると話しました。"
    },
    {
      "timestamp": "0:08:05",
      "title": "見つけてくれたみんなへ",
      "body": "8月1日から配信を始めたことを紹介し、今見つけてくれた方も早くから応援する仲間になれると呼びかけました。"
    },
    {
      "timestamp": "0:15:20",
      "title": "頑張る人からもらう刺激",
      "body": "身近で頑張る人を見ると自分も頑張ろうと思えると話し、誰かの力になれることには取り組みたいと語りました。"
    },
    {
      "timestamp": "0:16:58",
      "title": "笑顔を自分の武器に",
      "body": "笑顔を褒めてもらって喜び、自分の武器にしたいと話しました。自分の笑顔を好きになることも大切だと続けました。"
    },
    {
      "timestamp": "0:17:57",
      "title": "初めてのメイク配信",
      "body": "最初は綺麗な状態で配信に出るつもりだったと振り返り、24日目にメイク配信をしている変化を笑って話しました。"
    },
    {
      "timestamp": "0:22:04",
      "title": "メイクが完成",
      "body": "メイクが終わったと報告し、来てくれたみんなに感謝。フォローを呼びかけ、ランキングを読み上げました。"
    }
  ],
  "goals": [],
  "timeline": [
    {
      "timestamp": "0:01:43",
      "label": "配信24日目の朝"
    },
    {
      "timestamp": "0:03:16",
      "label": "忙しい朝にも話したくて"
    },
    {
      "timestamp": "0:08:05",
      "label": "見つけてくれたみんなへ"
    },
    {
      "timestamp": "0:15:20",
      "label": "頑張る人からもらう刺激"
    },
    {
      "timestamp": "0:16:58",
      "label": "笑顔を自分の武器に"
    },
    {
      "timestamp": "0:17:57",
      "label": "初めてのメイク配信"
    },
    {
      "timestamp": "0:21:46",
      "label": "次は同日夜を予定と案内"
    },
    {
      "timestamp": "0:22:04",
      "label": "メイクが完成"
    },
    {
      "timestamp": "0:22:10",
      "label": "ランキング読み上げ"
    }
  ],
  "nextNote": "配信時点では、次は同日夜を予定し、ファンルームで改めて連絡すると案内していました。時刻は未定でした。",
  "sourceLabel": "2026年8月24日 朝配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b85-asa-stills.zip",
    "filename": "みりぃ_20260824朝_7枚.zip",
    "label": "7枚まとめて保存"
  }
,
image: approvedStills[5], gallery: approvedStills, ranking: [RANKING_NOTE],
transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画から選んだ承認済み7枚を掲載しています。", extra: "自動字幕全編と主要区間の音声認識結果を照合しました。全編手動聴取は未実施です。記録時刻と実際の配信開始時刻との一致は未確認です。" }),
};
