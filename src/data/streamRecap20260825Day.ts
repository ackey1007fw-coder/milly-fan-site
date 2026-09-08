import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";
const approvedStills = [
  {
    "src": "/media/live/mily-b83-01-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日昼配信のみりぃ。両手でピース",
    "caption": "0:58:07 両手でピース",
    "downloadName": "2026-08-25-day-01-t00h58m07s.png"
  },
  {
    "src": "/media/live/mily-b83-02-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日昼配信のみりぃ。上を見て両手でピース",
    "caption": "0:58:17 上を見て両手でピース",
    "downloadName": "2026-08-25-day-02-t00h58m17s.png"
  },
  {
    "src": "/media/live/mily-b83-03-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日昼配信のみりぃ。顔の下で両手を広げて笑顔",
    "caption": "0:58:49 顔の下で両手を広げて笑顔",
    "downloadName": "2026-08-25-day-03-t00h58m49s.png"
  },
  {
    "src": "/media/live/mily-b83-04-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日昼配信のみりぃ。あごに手を添えて笑顔",
    "caption": "0:58:51 あごに手を添えて笑顔",
    "downloadName": "2026-08-25-day-04-t00h58m51s.png"
  },
  {
    "src": "/media/live/mily-b83-05-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日昼配信のみりぃ。片手を上げて",
    "caption": "0:59:59 片手を上げて",
    "downloadName": "2026-08-25-day-05-t00h59m59s.png"
  },
  {
    "src": "/media/live/mily-b83-06-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月25日昼配信のみりぃ。人差し指を立てて",
    "caption": "1:03:00 人差し指を立てて",
    "downloadName": "2026-08-25-day-06-t01h03m00s.png"
  }
];
export const streamRecap20260825Day: StreamRecap = {
  "id": "2026-08-25-day-showroom",
  "date": "2026-08-25",
  "dateLabel": "2026.08.25（火）",
  "theme": "昼のメイクと応援への感謝",
  "broadcastLabel": "14:41頃〜 約64分",
  "platformLabel": "SHOWROOM",
  "summary": "配信25日目の昼は、時間をかけて仕上げるメイク配信。涙袋やまつ毛のメイクを説明しながら、コメントや応援への感謝を伝えました。完成後はスクショタイムを楽しみました。",
  "highlights": [
    {
      "timestamp": "0:01:05",
      "title": "ゆっくりメイクの昼配信",
      "body": "今回は1時間あり、ゆっくりメイクできると話しました。"
    },
    {
      "timestamp": "0:26:18",
      "title": "涙袋のメイク",
      "body": "きれいに描くための工夫と難しさを話し、メイクは面白いと伝えました。"
    },
    {
      "timestamp": "0:31:32",
      "title": "いいところを見つける",
      "body": "人のいいところを見つけられるのは素敵だと話しました。"
    },
    {
      "timestamp": "0:32:24",
      "title": "応援を一つずつ大切に",
      "body": "皆さんからの応援を一つ一つ見逃したくないという思いを伝えました。"
    },
    {
      "timestamp": "0:40:25",
      "title": "初めての方もコメントを",
      "body": "定型文からでも気軽に声をかけて、一緒に仲良くなりたいと呼びかけました。"
    },
    {
      "timestamp": "0:45:17",
      "title": "まつ毛の下地とマスカラ",
      "body": "まつ毛を上げた状態に保つ下地の役割を説明し、その後マスカラを重ねました。"
    },
    {
      "timestamp": "0:57:11",
      "title": "メイク完成とスクショ",
      "body": "仕上げのハイライトをのせて完成。皆さんにスクショを呼びかけました。"
    },
    {
      "timestamp": "1:03:23",
      "title": "時間をくれた皆さんへ",
      "body": "忙しい中、配信を見るために時間を割いてくれた皆さんへ感謝を伝えました。"
    }
  ],
  "goals": [],
  "timeline": [
    {
      "timestamp": "0:01:05",
      "label": "ゆっくりメイクの昼配信"
    },
    {
      "timestamp": "0:26:18",
      "label": "涙袋のメイク"
    },
    {
      "timestamp": "0:31:32",
      "label": "いいところを見つける"
    },
    {
      "timestamp": "0:32:24",
      "label": "応援を一つずつ大切に"
    },
    {
      "timestamp": "0:40:25",
      "label": "初めての方もコメントを"
    },
    {
      "timestamp": "0:45:17",
      "label": "まつ毛の下地とマスカラ"
    },
    {
      "timestamp": "0:57:11",
      "label": "メイク完成とスクショ"
    },
    {
      "timestamp": "1:00:02",
      "label": "次は22:30からと案内"
    },
    {
      "timestamp": "1:01:55",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "1:03:23",
      "label": "時間をくれた皆さんへ"
    }
  ],
  "nextNote": "配信時点では、次は同日22:30からと案内し、初めての方も一緒に楽しもうと呼びかけていました。",
  "sourceLabel": "2026年8月25日 昼配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "galleryZip": {
    "src": "/media/live/mily-b83-day-stills.zip",
    "filename": "みりぃ_20260825昼_6枚.zip",
    "label": "6枚まとめて保存"
  }
,
image: approvedStills[3], gallery: approvedStills, ranking: [RANKING_NOTE],
transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は当該録画から選んだ承認済み6枚を掲載しています。", extra: "自動字幕全編と主要区間の音声認識結果を照合しました。全編手動聴取は未実施です。短い歌唱候補は確認中のため曲リストに含めていません。記録時刻と実際の配信開始時刻との一致は未確認です。" }),
};
