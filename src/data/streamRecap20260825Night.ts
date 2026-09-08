import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b81-01-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日夜配信のみりぃ。両手で指のポーズ",
    "caption": "0:09:00 両手で指のポーズ",
    "downloadName": "2026-08-25-night-01-t00h09m00s.png"
  },
  {
    "src": "/media/live/mily-b81-02-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日夜配信のみりぃ。両頬に指を添えて笑顔",
    "caption": "0:15:00 両頬に指を添えて笑顔",
    "downloadName": "2026-08-25-night-02-t00h15m00s.png"
  },
  {
    "src": "/media/live/mily-b81-03-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日夜配信のみりぃ。あごに手を添えて",
    "caption": "0:39:01 あごに手を添えて",
    "downloadName": "2026-08-25-night-03-t00h39m01s.png"
  },
  {
    "src": "/media/live/mily-b81-04-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日夜配信のみりぃ。首をかしげて笑顔",
    "caption": "1:07:00 首をかしげて笑顔",
    "downloadName": "2026-08-25-night-04-t01h07m00s.png"
  },
  {
    "src": "/media/live/mily-b81-05-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日夜配信のみりぃ。カメラに向かって笑顔",
    "caption": "1:21:02 カメラに向かって笑顔",
    "downloadName": "2026-08-25-night-05-t01h21m02s.png"
  },
  {
    "src": "/media/live/mily-b81-06-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日夜配信のみりぃ。少し離れて笑顔",
    "caption": "1:30:58 少し離れて笑顔",
    "downloadName": "2026-08-25-night-06-t01h30m58s.png"
  },
  {
    "src": "/media/live/mily-b81-07-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日夜配信のみりぃ。人差し指を立てて",
    "caption": "1:46:57 人差し指を立てて",
    "downloadName": "2026-08-25-night-07-t01h46m57s.png"
  },
  {
    "src": "/media/live/mily-b81-08-night-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日夜配信のみりぃ。片手でピース",
    "caption": "1:55:00 片手でピース",
    "downloadName": "2026-08-25-night-08-t01h55m00s.png"
  }
];
export const streamRecap20260825Night: StreamRecap = {

  "id": "2026-08-25-night-showroom",
  "date": "2026-08-25",
  "dateLabel": "2026.08.25（火）",
  "theme": "夜の応援とこれからの自分",
  "broadcastLabel": "22:43頃〜 約117分",
  "platformLabel": "SHOWROOM",
  "summary": "笑顔でコメントに応じる夜配信です。ファンが増えた喜びを分かち合い、イベントで出会えた人たちへの感謝を伝えました。後半は、将来に向き合い、コンテストを自信につなげたい思いを語りました。",
  "highlights": [
    {
      "timestamp": "0:01:10",
      "title": "昼のスクショを喜んで",
      "body": "昼のメイク配信で撮ってもらったスクショを喜び、感謝を伝えました。"
    },
    {
      "timestamp": "0:38:31",
      "title": "ファンの輪が広がる喜び",
      "body": "ファンが48人になったことを喜びました。アバターを獲得できたら、皆さんと使ってルームを楽しみたいと話しました。"
    },
    {
      "timestamp": "0:41:12",
      "title": "最初の配信で感じた温かさ",
      "body": "試し配信で多くの人に来てもらえたことを振り返りました。温かく迎えられ、配信を続けられそうだと感じたと話しました。"
    },
    {
      "timestamp": "1:07:07",
      "title": "一緒にいい景色を",
      "body": "皆さんにも無理をしないよう呼びかけ、いい景色を見せたいという思いを伝えました。"
    },
    {
      "timestamp": "1:08:41",
      "title": "挑戦で生まれた出会い",
      "body": "イベントへの参加を後押ししてもらえたことと、新しい出会いに感謝しました。皆さんと一緒に配信を盛り上げる大切さを話しました。"
    },
    {
      "timestamp": "1:10:54",
      "title": "50人まであと一歩",
      "body": "ファンが49人になり、50人が近づいたことを喜びました。朝も夜も来てくれる皆さんへの感謝を伝えました。"
    },
    {
      "timestamp": "1:34:23",
      "title": "自分に正直に進みたい",
      "body": "アナウンサーを目指すことについて考えていると話しました。コンテストを通じて自分を知り、自信をつけたいという思いを伝えました。"
    },
    {
      "timestamp": "1:52:18",
      "title": "成長を見守ってほしい",
      "body": "まだうまくできないところもあると話しながら、これからの成長を見てほしいと呼びかけました。最後は皆さんへ拍手を送りました。"
    }
  ],
  "goals": [],
  "timeline": [
    {
      "timestamp": "0:01:10",
      "label": "昼のスクショを喜んで"
    },
    {
      "timestamp": "0:38:31",
      "label": "ファンの輪が広がる喜び"
    },
    {
      "timestamp": "0:41:12",
      "label": "最初の配信で感じた温かさ"
    },
    {
      "timestamp": "1:07:07",
      "label": "一緒にいい景色を"
    },
    {
      "timestamp": "1:08:41",
      "label": "挑戦で生まれた出会い"
    },
    {
      "timestamp": "1:10:54",
      "label": "50人まであと一歩"
    },
    {
      "timestamp": "1:34:23",
      "label": "自分に正直に進みたい"
    },
    {
      "timestamp": "1:52:18",
      "label": "成長を見守ってほしい"
    },
    {
      "timestamp": "1:54:07",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:56:29",
      "label": "翌朝の時間はファンルームで案内"
    }
  ],
  "nextNote": "配信時点では、翌朝も配信し、具体的な時間はファンルームで案内すると伝えていました。",
  "sourceLabel": "2026年8月25日 夜配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b81-night-stills.zip",
    "filename": "みりぃ_20260825夜_8枚.zip",
    "label": "8枚まとめて保存"
  }
,
image: approvedStills[1], gallery: approvedStills, ranking: [RANKING_NOTE],
transcriptionNote: buildTranscriptionNote({material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画から選んだ承認済み8枚を掲載しています。", extra: "自動字幕全編を確認しています。全編手動聴取は未実施です。歌唱か発話か未確定の短いフレーズは曲リストへ含めていません。記録時刻と実際の配信開始時刻との一致は未確認です。"}),
};
