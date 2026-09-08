import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b80-01-day-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日昼配信のみりぃ。片手を上げてポーズ",
    "caption": "0:43:01 片手を上げてポーズ",
    "downloadName": "2026-08-26-day-01-r1440-t00h43m01s.jpg"
  },
  {
    "src": "/media/live/mily-b80-02-day-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日昼配信のみりぃ。カメラに向かって笑顔",
    "caption": "0:50:03 カメラに向かって笑顔",
    "downloadName": "2026-08-26-day-02-r1440-t00h50m03s.jpg"
  },
  {
    "src": "/media/live/mily-b80-03-day-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日昼配信のみりぃ。あごに手を添えて",
    "caption": "0:55:01 あごに手を添えて",
    "downloadName": "2026-08-26-day-03-r1440-t00h55m01s.jpg"
  },
  {
    "src": "/media/live/mily-b80-04-day-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日昼配信のみりぃ。両手でポーズ",
    "caption": "0:56:08 両手でポーズ",
    "downloadName": "2026-08-26-day-04-r1440-t00h56m08s.jpg"
  },
  {
    "src": "/media/live/mily-b80-05-day-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日昼配信のみりぃ。頬に両手を添えて",
    "caption": "0:56:13 頬に両手を添えて",
    "downloadName": "2026-08-26-day-05-r1440-t00h56m13s.jpg"
  },
  {
    "src": "/media/live/mily-b80-06-day-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日昼配信のみりぃ。両手でピース",
    "caption": "0:56:34 両手でピース",
    "downloadName": "2026-08-26-day-06-r1440-t00h56m34s.jpg"
  },
  {
    "src": "/media/live/mily-b80-07-day-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日昼配信のみりぃ。両手を振って",
    "caption": "0:59:00 両手を振って",
    "downloadName": "2026-08-26-day-07-r1440-t00h59m00s.jpg"
  },
  {
    "src": "/media/live/mily-b80-08-day-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日昼配信のみりぃ。頬に手を添えて笑顔",
    "caption": "1:00:58 頬に手を添えて笑顔",
    "downloadName": "2026-08-26-day-08-r1440-t01h00m58s.jpg"
  }
];
export const streamRecap20260826Day: StreamRecap = {

  "id": "2026-08-26-day-showroom",
  "date": "2026-08-26",
  "dateLabel": "2026.08.26（水）",
  "theme": "昼のメイクと夜への応援",
  "broadcastLabel": "14:40頃〜 約68分",
  "platformLabel": "SHOWROOM",
  "summary": "外出前の準備をしながら、初めて来た方とも会話を重ねた昼配信です。キラキラでの応援を呼びかけ、メイク後にはスクショタイムも。イベント最終日の夜を一緒に盛り上げたいと伝えました。",
  "highlights": [
    {
      "timestamp": "0:00:04",
      "title": "急遽始まったメイク配信",
      "body": "配信後に外出するため、メイクをしながら話すことになったと説明しました。忙しい時間にも来てくれた皆さんへ感謝しました。"
    },
    {
      "timestamp": "0:13:30",
      "title": "いつもと違うメイク",
      "body": "手元にある道具でメイクを進め、いつもの茶色系とは違うグレー系も試しました。いつもと違う仕上がりを楽しみながら会話しました。"
    },
    {
      "timestamp": "0:15:25",
      "title": "キラキラでの応援に感謝",
      "body": "初めて来た方にも挨拶し、キラキラでの応援に感謝しました。午後の応援も呼びかけ、皆さんの力を借りながら最終日を進みました。"
    },
    {
      "timestamp": "0:28:51",
      "title": "夜に向けて歌を練習",
      "body": "夜の配信で歌おうと考え、「超最強」やリクエストされた「Mela!」の練習について話しました。この場での曲名の話題は、歌唱リストには含めていません。"
    },
    {
      "timestamp": "0:38:29",
      "title": "みりぃと呼んでね",
      "body": "初めて来た方へ自己紹介し、「みりぃ」と呼んでほしいと伝えました。三橋莉子という名前から取った呼び名だと説明しました。"
    },
    {
      "timestamp": "0:42:08",
      "title": "メイクが完成",
      "body": "メイクがちょうど終わったと報告しました。仕上がった姿で、初めて来た方や応援してくれた皆さんとの会話を続けました。"
    },
    {
      "timestamp": "0:56:04",
      "title": "スクショタイム",
      "body": "スクショタイムを呼びかけ、カメラに向かってポーズを見せました。来てくれた皆さんへ声をかけながら、写真を撮れたか確かめました。"
    },
    {
      "timestamp": "1:04:24",
      "title": "イベント最終枠へのお誘い",
      "body": "配信時点ではイベントが21時59分に終わると案内し、夜の最終枠にも来てほしいと呼びかけました。時間が前後する可能性もあると伝えました。"
    }
  ],
  "goals": [],
  "timeline": [
    {
      "timestamp": "0:00:04",
      "label": "急遽始まったメイク配信"
    },
    {
      "timestamp": "0:13:30",
      "label": "いつもと違うメイク"
    },
    {
      "timestamp": "0:15:25",
      "label": "キラキラでの応援に感謝"
    },
    {
      "timestamp": "0:28:51",
      "label": "夜に向けて歌を練習"
    },
    {
      "timestamp": "0:38:29",
      "label": "みりぃと呼んでね"
    },
    {
      "timestamp": "0:42:08",
      "label": "メイクが完成"
    },
    {
      "timestamp": "0:56:04",
      "label": "スクショタイム"
    },
    {
      "timestamp": "0:58:37",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:04:24",
      "label": "イベント最終枠へのお誘い"
    }
  ],
  "nextNote": "配信時点では、最終枠を21時20分から予定し、時間が前後する可能性もあると案内していました。",
  "sourceLabel": "2026年8月26日 昼配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b80-day-stills.zip",
    "filename": "みりぃ_20260826昼_8枚.zip",
    "label": "8枚まとめて保存"
  }
,
image: approvedStills[5], gallery: approvedStills, ranking: [RANKING_NOTE],
transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画はメイク完成後の当該録画から選んだ承認済み8枚を掲載しています。", extra: "自動字幕を照合しています。全編手動聴取は未実施です。歌唱か発話かを確定できない短いフレーズは曲リストへ含めていません。記録時刻と実際の配信開始時刻との一致は未確認です。"}),
};
