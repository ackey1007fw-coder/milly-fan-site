import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b82-01-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日朝配信のみりぃ。カメラに向かって笑顔",
    "caption": "0:30:59 カメラに向かって笑顔",
    "downloadName": "2026-08-25-morning-01-t00h30m59s.png"
  },
  {
    "src": "/media/live/mily-b82-02-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日朝配信のみりぃ。手を広げて",
    "caption": "0:31:02 手を広げて",
    "downloadName": "2026-08-25-morning-02-t00h31m02s.png"
  },
  {
    "src": "/media/live/mily-b82-03-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日朝配信のみりぃ。両手を上げて",
    "caption": "0:32:58 両手を上げて",
    "downloadName": "2026-08-25-morning-03-t00h32m58s.png"
  },
  {
    "src": "/media/live/mily-b82-04-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日朝配信のみりぃ。サングラスを頭にのせて笑顔",
    "caption": "0:45:00 サングラスを頭にのせて笑顔",
    "downloadName": "2026-08-25-morning-04-t00h45m00s.png"
  },
  {
    "src": "/media/live/mily-b82-05-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日朝配信のみりぃ。首をかしげて笑顔",
    "caption": "0:48:58 首をかしげて笑顔",
    "downloadName": "2026-08-25-morning-05-t00h48m58s.png"
  },
  {
    "src": "/media/live/mily-b82-06-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日朝配信のみりぃ。両手の親指を立てて",
    "caption": "0:58:57 両手の親指を立てて",
    "downloadName": "2026-08-25-morning-06-t00h58m57s.png"
  },
  {
    "src": "/media/live/mily-b82-07-morning-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日朝配信のみりぃ。耳元に手を添えて",
    "caption": "1:01:00 耳元に手を添えて",
    "downloadName": "2026-08-25-morning-07-t01h01m00s.png"
  }
];
export const streamRecap20260825Asa: StreamRecap = {
  "id": "2026-08-25-morning",
  "date": "2026-08-25",
  "dateLabel": "2026.08.25（火）",
  "theme": "朝の歌と成長を喜ぶ時間",
  "broadcastLabel": "11:40頃〜 約62分",
  "platformLabel": "SHOWROOM",
  "summary": "配信25日目の朝。フォロワー250人への目標や英語の練習を話し、「ロマンスの神様」を歌いました。皆さんと成長を喜び、最後はアバターと一緒にスクショを楽しんだ回です。",
  "songs": [
    {
      "title": "ロマンスの神様",
      "artist": "広瀬香美",
      "timestamp": "0:39:54",
      "youtubeUrl": "https://www.youtube.com/watch?v=l8-RA3B0YRc"
    }
  ],
  "highlights": [
    {
      "timestamp": "0:00:17",
      "title": "配信25日目の朝",
      "body": "配信を始めて25日目になり、もうすぐ1か月になると話しました。"
    },
    {
      "timestamp": "0:12:37",
      "title": "ラジオも聴いてね",
      "body": "FM85.6・湘南マジックウェイブの「湘南シーサイドサークル」を紹介し、聴いてほしいと呼びかけました。"
    },
    {
      "timestamp": "0:19:00",
      "title": "次は250人を目指して",
      "body": "フォロワーがもうすぐ240人になると喜び、次は250人を目指したいと話しました。"
    },
    {
      "timestamp": "0:28:29",
      "title": "アバターを作れたら",
      "body": "アバターの制作権を獲得できたら、皆さんと相談して考えたいと話しました。"
    },
    {
      "timestamp": "0:39:54",
      "title": "ロマンスの神様を歌唱",
      "body": "この日のオープニングナンバーとして歌いました。歌い終えてから、ハモりが好きだと話し、温かいコメントに感謝しました。"
    },
    {
      "timestamp": "0:47:28",
      "title": "英語の練習の話",
      "body": "英語が好きで、ChatGPTに言い方を教えてもらい、練習問題を出してもらうことがあると話しました。"
    },
    {
      "timestamp": "0:52:12",
      "title": "成長を一緒に喜んで",
      "body": "成長を一緒に喜んでもらえることへの嬉しさを伝えました。皆さんに成長させてもらっていると話しました。"
    },
    {
      "timestamp": "1:01:04",
      "title": "アバターとスクショタイム",
      "body": "トマトのアバターを探してくれた皆さんと、一緒にスクショを撮りたいと呼びかけました。"
    }
  ],
  "goals": [
    {
      "item": "フォロワー",
      "target": "250人",
      "statusThen": "もうすぐ240人"
    }
  ],
  "timeline": [
    {
      "timestamp": "0:00:17",
      "label": "配信25日目の朝"
    },
    {
      "timestamp": "0:12:37",
      "label": "ラジオも聴いてね"
    },
    {
      "timestamp": "0:19:00",
      "label": "次は250人を目指して"
    },
    {
      "timestamp": "0:28:29",
      "label": "アバターを作れたら"
    },
    {
      "timestamp": "0:39:54",
      "label": "ロマンスの神様を歌唱"
    },
    {
      "timestamp": "0:47:28",
      "label": "英語の練習の話"
    },
    {
      "timestamp": "0:52:12",
      "label": "成長を一緒に喜んで"
    },
    {
      "timestamp": "0:58:43",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:01:04",
      "label": "アバターとスクショタイム"
    },
    {
      "timestamp": "1:01:40",
      "label": "次は14:40からと案内"
    }
  ],
  "nextNote": "配信時点では、次は同日14:40から、メイクをした姿で配信し、歌も歌いたいと案内していました。",
  "sourceLabel": "2026年8月25日 朝配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b82-morning-stills.zip",
    "filename": "みりぃ_20260825朝_7枚.zip",
    "label": "7枚まとめて保存"
  }
,
image: approvedStills[0], gallery: approvedStills, ranking: [RANKING_NOTE],
transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画から選んだ承認済み7枚を掲載しています。", extra: "自動字幕全編と主要区間の音声認識結果を照合しました。全編手動聴取は未実施です。記録時刻と実際の配信開始時刻との一致は未確認です。" }),
};
