import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b68-01-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。ダブルピース",
    "caption": "38:15 ダブルピース",
    "downloadName": "みりぃ_20260907朝_01.jpg"
  },
  {
    "src": "/media/live/mily-b68-02-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。ハートのポーズ",
    "caption": "38:24 ハートのポーズ",
    "downloadName": "みりぃ_20260907朝_02.jpg"
  },
  {
    "src": "/media/live/mily-b68-03-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。顔のそばでピース",
    "caption": "38:34 顔のそばでピース",
    "downloadName": "みりぃ_20260907朝_03.jpg"
  },
  {
    "src": "/media/live/mily-b68-04-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。メイク後の笑顔",
    "caption": "40:55 メイク後の笑顔",
    "downloadName": "みりぃ_20260907朝_04.jpg"
  },
  {
    "src": "/media/live/mily-b68-05-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。指を添えたポーズ",
    "caption": "41:16 指を添えたポーズ",
    "downloadName": "みりぃ_20260907朝_05.jpg"
  },
  {
    "src": "/media/live/mily-b68-06-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。笑顔で手を上げて",
    "caption": "41:26 笑顔で手を上げて",
    "downloadName": "みりぃ_20260907朝_06.jpg"
  },
  {
    "src": "/media/live/mily-b68-07-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。目線を上げたポーズ",
    "caption": "41:54 目線を上げたポーズ",
    "downloadName": "みりぃ_20260907朝_07.jpg"
  },
  {
    "src": "/media/live/mily-b68-08-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。あごの下で手を組んで",
    "caption": "43:26 あごの下で手を組んで",
    "downloadName": "みりぃ_20260907朝_08.jpg"
  },
  {
    "src": "/media/live/mily-b68-09-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。腕を伸ばしてにっこり",
    "caption": "44:34 腕を伸ばしてにっこり",
    "downloadName": "みりぃ_20260907朝_09.jpg"
  },
  {
    "src": "/media/live/mily-b68-10-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年9月7日朝配信のみりぃ。笑顔でバイバイ",
    "caption": "44:35 笑顔でバイバイ",
    "downloadName": "みりぃ_20260907朝_10.jpg"
  }
];

export const streamRecap20260907Asa: StreamRecap = {
  image: approvedStills[1],
  gallery: approvedStills,
  galleryZip: {"src": "/media/live/mily-b68-morning-stills.zip", "filename": "みりぃ_20260907朝_厳選10枚.zip", "label": "10枚まとめて保存"},
  "id": "2026-09-07-morning-showroom",
  "date": "2026-09-07",
  "dateLabel": "2026.09.07（月）",
  "theme": "朝のメイクとおしゃべり",
  "broadcastLabel": "06:33頃〜 約45分",
  "platformLabel": "SHOWROOM",
  "summary": "身支度を進めながらコメントを交わした朝のメイク配信。目元へのこだわりや、配信を始めるまでの迷いを話しました。投票やキラキラへの感謝を伝え、忙しい朝に来てくれた人たちを送り出す回です。",
  "highlights": [
    {
      "timestamp": "0:03:20",
      "title": "忙しい朝の来訪に感謝",
      "body": "朝の挨拶とともに、忙しい中でも来てくれるみんなへ感謝。WEB投票とキラキラを大切にしていると伝え、応援を呼びかけました。"
    },
    {
      "timestamp": "0:05:30",
      "title": "コメントを読みながらメイク",
      "body": "短時間でメイクを進めながら、おしゃべりも楽しむ朝枠。コメントを見ながら身支度できるようになってきたと、配信での慣れも振り返りました。"
    },
    {
      "timestamp": "0:08:10",
      "title": "お知らせの届け方を試行錯誤",
      "body": "Xでのお知らせの出し方をめぐる話題に。大切な情報が埋もれないように、投稿や共有の仕方を試していると話しました。"
    },
    {
      "timestamp": "0:13:10",
      "title": "目元を明るく見せたい",
      "body": "涙袋や目元のメイクを進め、目を合わせて話すからこそ目元を大切にしたいと説明。変化していくメイクの楽しさを伝えました。"
    },
    {
      "timestamp": "0:16:15",
      "title": "最初の配信ボタンを押すまで",
      "body": "8月1日の初配信まで、配信するかどうか迷っていたことを振り返りました。明るく話す今の姿につながる、最初の一歩についての話でした。"
    },
    {
      "timestamp": "0:21:15",
      "title": "細かな仕上げは集中して",
      "body": "アイラインなどの細かな作業では、少しおしゃべりを止めて集中。合間には来てくれた人へ挨拶しながら、メイクを仕上げていきました。"
    },
    {
      "timestamp": "0:33:25",
      "title": "引き算メイクの考え方",
      "body": "すべてを濃く足すのではなく、薄い色を使う部分も考えてメリハリを付けると説明。自分も研究中だと話しながら、メイクの工夫を紹介しました。"
    },
    {
      "timestamp": "0:40:45",
      "title": "月曜の朝に集まったみんなへ",
      "body": "完成後はランキングを読み上げ、一人ひとりの応援に感謝。月曜の朝に来てくれたみんなをねぎらい、安全に気をつけて過ごそうと呼びかけました。"
    }
  ],
  "goals": [
    {
      "item": "WEB投票",
      "target": "毎日の応援",
      "statusThen": "最優先で呼びかけ"
    },
    {
      "item": "キラキラ",
      "target": "応援を集める",
      "statusThen": "届けてくれた人へ感謝"
    }
  ],
  "ranking": [
    RANKING_NOTE
  ],
  "timeline": [
    {
      "timestamp": "0:03:20",
      "label": "忙しい朝の来訪に感謝"
    },
    {
      "timestamp": "0:05:30",
      "label": "コメントを読みながらメイク"
    },
    {
      "timestamp": "0:08:10",
      "label": "お知らせの届け方を試行錯誤"
    },
    {
      "timestamp": "0:13:10",
      "label": "目元を明るく見せたい"
    },
    {
      "timestamp": "0:16:15",
      "label": "最初の配信ボタンを押すまで"
    },
    {
      "timestamp": "0:21:15",
      "label": "細かな仕上げは集中して"
    },
    {
      "timestamp": "0:33:25",
      "label": "引き算メイクの考え方"
    },
    {
      "timestamp": "0:40:45",
      "label": "月曜の朝に集まったみんなへ"
    },
    {
      "timestamp": "0:43:35",
      "label": "夜枠の案内といってらっしゃい"
    }
  ],
  "nextNote": "配信時点では、同日夜は22時から始めたいと案内していました。現在の配信予定を示すものではありません。",
  "sourceLabel": "2026年9月7日 SHOWROOM朝配信（オーナー提供録画の自動文字起こしを照合）",
  "verifiedAt": "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。全画像を目視確認し、オーナーの掲載承認を得ています。",
    extra: "開始時刻は素材名の記録時刻に基づく概数で、時刻は録画先頭からの目安です。短い口ずさみとみられる箇所は曲名を確定できず、歌リストには含めていません。"
  }),
};
