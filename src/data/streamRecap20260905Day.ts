import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

const dayStills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b57-01-wave-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。笑顔で手を振って",
    "caption": "01:11 笑顔で手を振って",
    "downloadName": "みりぃ_20260905昼_01.jpg"
  },
  {
    "src": "/media/live/mily-b57-02-yogurt-ice.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。ヨーグルトアイスを紹介",
    "caption": "02:09 ヨーグルトアイスを紹介",
    "downloadName": "みりぃ_20260905昼_02.jpg"
  },
  {
    "src": "/media/live/mily-b57-03-spoon.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。スプーンでひとくち",
    "caption": "05:30 スプーンでひとくち",
    "downloadName": "みりぃ_20260905昼_03.jpg"
  },
  {
    "src": "/media/live/mily-b57-04-cheek.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。頬に指を添えて",
    "caption": "11:49 頬に指を添えて",
    "downloadName": "みりぃ_20260905昼_04.jpg"
  },
  {
    "src": "/media/live/mily-b57-05-bright-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。ぱっと明るい笑顔",
    "caption": "21:49 ぱっと明るい笑顔",
    "downloadName": "みりぃ_20260905昼_05.jpg"
  },
  {
    "src": "/media/live/mily-b57-06-soft-tilt.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。そっと首を傾けて",
    "caption": "28:49 そっと首を傾けて",
    "downloadName": "みりぃ_20260905昼_06.jpg"
  },
  {
    "src": "/media/live/mily-b57-07-finger.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。人差し指を立てて",
    "caption": "31:09 人差し指を立てて",
    "downloadName": "みりぃ_20260905昼_07.jpg"
  },
  {
    "src": "/media/live/mily-b57-08-hair-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。髪に手を添えてにっこり",
    "caption": "37:29 髪に手を添えてにっこり",
    "downloadName": "みりぃ_20260905昼_08.jpg"
  },
  {
    "src": "/media/live/mily-b57-09-flower-pose.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。手のひらを広げて",
    "caption": "44:09 手のひらを広げて",
    "downloadName": "みりぃ_20260905昼_09.jpg"
  },
  {
    "src": "/media/live/mily-b57-10-sleep-pose.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の昼配信、茶色のTシャツ姿のみりぃ。おやすみのポーズ",
    "caption": "44:29 おやすみのポーズ",
    "downloadName": "みりぃ_20260905昼_10.jpg"
  }
];

/** オーナー提供録画の自動文字起こしを要約。掲載する実フレーム10枚は目視確認。 */
export const streamRecap20260905Day: StreamRecap = {
  "id": "2026-09-05-day-gachi-showroom",
  "date": "2026-09-05",
  "dateLabel": "2026.09.05（土）",
  "theme": "昼の配信・三次3日目",
  "broadcastLabel": "14:31頃〜 約47分",
  "platformLabel": "SHOWROOM",
  "summary": "ヨーグルトアイスを食べながら、コメントと笑顔を交わした昼配信。ライブ会場の周りに広がるわくわく感や、朝に披露した歌を振り返りました。後半はラジオのパーソナリティとしての話へ。配信を通じて出会ったみんなから知ることがたくさんある、と感謝も伝えていました。",
  "image": dayStills[4],
  "galleryZip": {
    "src": "/media/live/mily-b57-day-stills.zip",
    "filename": "みりぃ_20260905昼_スクショ10枚.zip",
    "label": "10枚まとめて保存"
  },
  "highlights": [
    {
      "timestamp": "0:00:45",
      "title": "来てくれたみんなにありがとう",
      "body": "昼の時間に訪れた人たちへお礼を伝え、投票とキラキラでの応援を呼びかけていました。"
    },
    {
      "timestamp": "0:02:20",
      "title": "ヨーグルトアイスを紹介",
      "body": "カメラにアイスを見せ、上に乗ったチョコのサクサクした食感を紹介。後には、ミルクのような味わいからヨーグルトのさっぱりした後味に変わる、と感想を話していました。"
    },
    {
      "timestamp": "0:18:00",
      "title": "いろいろなことに挑戦中",
      "body": "今はいろいろなことに挑戦する時期だと語り、充実していると話していました。まだ詳しく話せないこともあるとしながら、応援の言葉に感謝していました。"
    },
    {
      "timestamp": "0:20:20",
      "title": "会場の外にも広がるわくわく",
      "body": "ライブのTシャツを着た人たちが会場周辺に集まる雰囲気が好きだという話へ。これから楽しんでくるという気持ちが周りにも伝わり、自分も一緒に行くような気分になると話していました。"
    },
    {
      "timestamp": "0:22:40",
      "title": "朝の歌を振り返って",
      "body": "朝配信で歌ったことを振り返り、聴いてくれた人へお礼を伝えました。あれは練習だったので、また完成版を披露したいという思いも話していました。"
    },
    {
      "timestamp": "0:28:45",
      "title": "ラジオで届く声",
      "body": "ラジオを聴いた人の感想を喜び、パーソナリティを務め始めた頃の不安にも触れました。交通情報をもっと頑張りたいと話し、番組を支える学生たちの仕事も紹介していました。"
    },
    {
      "timestamp": "0:34:30",
      "title": "配信で出会えたみんなから",
      "body": "配信を始めたことで出会えた人たちや、その人たちが来てくれるからこそ知れることがたくさんある、と話しました。さまざまな役割を担う人への感謝を交わす時間になっていました。"
    },
    {
      "timestamp": "0:43:35",
      "title": "おやつの時間に集まってくれて",
      "body": "終盤は応援してくれた人たちを読み上げながらお礼を伝えました。おやつの時間を一緒に過ごしてくれたみんなへの感謝を伝え、夜の配信での再会を呼びかけていました。"
    }
  ],
  "goals": [
    {
      "item": "WEB投票",
      "target": "応援のお願い",
      "statusThen": "昼も呼びかけ"
    },
    {
      "item": "キラキラ",
      "target": "応援のお願い",
      "statusThen": "切り替え時にも案内"
    },
    {
      "item": "歌の練習",
      "target": "また披露したい",
      "statusThen": "朝の歌を振り返り"
    }
  ],
  "ranking": [],
  "timeline": [
    {
      "timestamp": "0:00:45",
      "label": "来てくれたみんなにありがとう"
    },
    {
      "timestamp": "0:02:20",
      "label": "ヨーグルトアイスを紹介"
    },
    {
      "timestamp": "0:18:00",
      "label": "いろいろなことに挑戦中"
    },
    {
      "timestamp": "0:20:20",
      "label": "会場の外にも広がるわくわく"
    },
    {
      "timestamp": "0:22:40",
      "label": "朝の歌を振り返って"
    },
    {
      "timestamp": "0:28:45",
      "label": "ラジオで届く声"
    },
    {
      "timestamp": "0:34:30",
      "label": "配信で出会えたみんなから"
    },
    {
      "timestamp": "0:43:35",
      "label": "応援へのお礼"
    },
    {
      "timestamp": "0:45:15",
      "label": "夜枠は21時と案内"
    }
  ],
  "nextNote": "配信時点では、終盤に表示した予定表で、同日9月5日の夜枠を21:00〜21:50と案内していました。実施結果や現在の配信予定を示すものではありません。",
  "sourceLabel": "2026年9月5日 SHOWROOM昼配信 録画から作成した配信レポート・自動文字起こし（オーナー提供）",
  "verifiedAt": "2026-09-05",
  "transcriptionNote": buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。実フレーム10枚は目視確認しています。",
    extra: "時刻は録画先頭からの目安です。開始時刻は素材名の記録時刻に基づく概数です。",
  }),
  "gallery": dayStills
};
