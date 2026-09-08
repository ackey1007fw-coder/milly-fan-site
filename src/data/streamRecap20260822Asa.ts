import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b88-01-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日朝配信のみりぃ。カメラに向かって笑顔",
    "caption": "0:01:30 カメラに向かって笑顔",
    "downloadName": "2026-08-22-asa-01-t00h01m30s.png"
  },
  {
    "src": "/media/live/mily-b88-02-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日朝配信のみりぃ。顔の横に手を添えて笑顔",
    "caption": "0:22:30 顔の横に手を添えて笑顔",
    "downloadName": "2026-08-22-asa-02-t00h22m30s.png"
  },
  {
    "src": "/media/live/mily-b88-03-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日朝配信のみりぃ。両手を口元に添えて笑顔",
    "caption": "0:37:32 両手を口元に添えて笑顔",
    "downloadName": "2026-08-22-asa-03-t00h37m32s.png"
  },
  {
    "src": "/media/live/mily-b88-04-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日朝配信のみりぃ。髪に手を添えて笑顔",
    "caption": "1:04:30 髪に手を添えて笑顔",
    "downloadName": "2026-08-22-asa-04-t01h04m30s.png"
  },
  {
    "src": "/media/live/mily-b88-05-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日朝配信のみりぃ。親指を立てて笑顔",
    "caption": "1:10:33 親指を立てて笑顔",
    "downloadName": "2026-08-22-asa-05-t01h10m33s.png"
  },
  {
    "src": "/media/live/mily-b88-06-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日朝配信のみりぃ。両手を顔の横に添えて",
    "caption": "1:19:30 両手を顔の横に添えて",
    "downloadName": "2026-08-22-asa-06-t01h19m30s.png"
  },
  {
    "src": "/media/live/mily-b88-07-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日朝配信のみりぃ。横を向いてお話し中",
    "caption": "1:28:30 横を向いてお話し中",
    "downloadName": "2026-08-22-asa-07-t01h28m30s.png"
  },
  {
    "src": "/media/live/mily-b88-08-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月22日朝配信のみりぃ。胸元に手を添えて",
    "caption": "1:46:31 胸元に手を添えて",
    "downloadName": "2026-08-22-asa-08-t01h46m31s.png"
  }
];
export const streamRecap20260822Asa: StreamRecap = {
  "id": "2026-08-22-asa-showroom",
  "date": "2026-08-22",
  "dateLabel": "2026.08.22（土）",
  "theme": "朝の出会いと自己紹介",
  "broadcastLabel": "6:55頃〜 約107分",
  "platformLabel": "SHOWROOM",
  "summary": "初めて来た人を迎え、自己紹介や名前の由来を話した朝。何歳でも青春できるという思い、好きな色、ランウェイへの挑戦、ラジオと配信の相乗効果を語りました。",
  "highlights": [
    {
      "timestamp": "0:03:03",
      "title": "朝の新しい出会い",
      "body": "いつもと違う朝の時間に配信し、初めての人と出会いたかったと話しました。訪れた人へ感謝を伝えています。"
    },
    {
      "timestamp": "0:18:36",
      "title": "みりぃと呼んでね",
      "body": "初めて来た人へ自己紹介し、みりぃという呼び名の由来を説明しました。気軽にコメントしてほしいと呼びかけています。"
    },
    {
      "timestamp": "0:44:43",
      "title": "みんなのことを覚えたい",
      "body": "名前を覚えるのは得意ではないと話しながらも、リスナーのことをもっと覚えたいという思いを伝えました。"
    },
    {
      "timestamp": "1:03:57",
      "title": "何歳でも青春",
      "body": "自分は今が青春だと話し、年齢に関係なく青春できると語りました。一緒に夢を見ていこうと呼びかけています。"
    },
    {
      "timestamp": "1:31:21",
      "title": "好きな色の話",
      "body": "イメージカラーの話から、小さい頃からオレンジが好きだと紹介しました。配信画面のオレンジ色の文字にも触れています。"
    },
    {
      "timestamp": "1:39:53",
      "title": "ランウェイで恩返し",
      "body": "ランウェイへの挑戦を、応援への恩返しや自信につなげたいと話しました。リスナーの力を借りながら頑張りたいという思いを伝えています。"
    },
    {
      "timestamp": "1:42:27",
      "title": "ラジオと配信の相乗効果",
      "body": "配信がラジオに、ラジオが配信によい影響を与えていると話しました。どちらでも人と話す楽しさを感じているそうです。"
    },
    {
      "timestamp": "1:45:57",
      "title": "あっという間と思える配信へ",
      "body": "自己紹介を終え、あっという間だったと思ってもらえる配信を目指したいと話しました。また来てほしいという願いで締めくくっています。"
    }
  ],
  "goals": [],
  "timeline": [
    {
      "timestamp": "0:03:03",
      "label": "朝の新しい出会い"
    },
    {
      "timestamp": "0:18:36",
      "label": "みりぃと呼んでね"
    },
    {
      "timestamp": "0:44:43",
      "label": "みんなのことを覚えたい"
    },
    {
      "timestamp": "1:03:57",
      "label": "何歳でも青春"
    },
    {
      "timestamp": "1:31:21",
      "label": "好きな色の話"
    },
    {
      "timestamp": "1:35:43",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:39:53",
      "label": "ランウェイで恩返し"
    },
    {
      "timestamp": "1:42:27",
      "label": "ラジオと配信の相乗効果"
    },
    {
      "timestamp": "1:45:57",
      "label": "あっという間と思える配信へ"
    },
    {
      "timestamp": "1:46:32",
      "label": "次の配信は夕方から夜に"
    }
  ],
  "nextNote": "配信時点では、夕方から夜の配信を予定し、時刻はファンルームで改めて知らせると案内していました。確定時刻は確認できていません。",
  "sourceLabel": "2026年8月22日 朝配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b88-morning-stills.zip",
    "filename": "みりぃ_20260822朝_8枚.zip",
    "label": "8枚まとめて保存"
  }
,
image: approvedStills[0], gallery: approvedStills, ranking: [RANKING_NOTE],
transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画から選んだ承認済み8枚を掲載しています。", extra: "自動字幕全編と主要区間の音声認識結果を照合しました。全編手動聴取は未実施です。記録時刻と実際の配信開始時刻との一致は未確認です。" }),
};
