import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

export const streamRecap20260907Asa: StreamRecap = {
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
    stills: "静止画は掲載していません。",
    extra: "開始時刻は素材名の記録時刻に基づく概数で、時刻は録画先頭からの目安です。短い口ずさみとみられる箇所は曲名を確定できず、歌リストには含めていません。"
  }),
};
