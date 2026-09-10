import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStill = {
  "src": "/media/live/mily-b74-01-day-still.jpg",
  "width": 640,
  "height": 360,
  "alt": "2026年8月29日昼のラジオ配信に表示された、花束を持つみりぃの静止画",
  "caption": "0:05:00 ラジオ配信に表示された静止画",
  "downloadName": "2026-08-29-day-01-r1443-t00h05m00s.jpg"
};

export const streamRecap20260829Day: StreamRecap = {
  "id": "2026-08-29-day-showroom",
  "date": "2026-08-29",
  "dateLabel": "2026.08.29（土）",
  "theme": "昼のラジオ・声への自信",
  "broadcastLabel": "14:43頃〜 約59分",
  "platformLabel": "SHOWROOM",
  "summary": "花束の写真を表示したラジオ配信で、初めて来た皆さんも歓迎した土曜の午後。二つのコンテストでファイナルを目指す思いや、声を好きになるための取り組みを話しました。皆さんとの会話の合間には、2曲を短く口ずさんだ回です。",
  "songs": [
    {
      "title": "ドライフラワー",
      "artist": "優里",
      "timestamp": "0:51:20",
      "youtubeUrl": "https://www.youtube.com/watch?v=kzZ6KXDM1RI",
      "karaoke": {
        "youtubeUrl": "https://www.youtube.com/watch?v=vtJEXV-ZZBw",
        "channel": "カラオケ歌っちゃ王"
      }
    },
    {
      "title": "とくべチュ、して",
      "artist": "＝LOVE",
      "timestamp": "0:54:50",
      "youtubeUrl": "https://www.youtube.com/watch?v=F3P8vcZkIh4",
      karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=r6dpqf5CRjA", channel: "カラオケ歌っちゃ王" },
    }
  ],
  image: approvedStill,
  gallery: [approvedStill],
  "galleryZip": {
    "src": "/media/live/mily-b74-day-stills.zip",
    "filename": "みりぃ_20260829昼_1枚.zip",
    "label": "1枚を保存"
  },
  "highlights": [
    {
      "timestamp": "0:05:35",
      "title": "翌日のFMラジオを紹介",
      "body": "湘南マジックウェイブの「湘南シーサイドサークル」を紹介しました。配信時点では翌朝10時から13時の生放送で、映画がテーマと案内していました。"
    },
    {
      "timestamp": "0:15:15",
      "title": "ファイナルへ進みたい",
      "body": "二つのコンテストについて、ファイナルまで進みたいという思いを言葉にしました。応援しているという皆さんの声を聞けることが心強いと話しました。"
    },
    {
      "timestamp": "0:17:38",
      "title": "毎日配信29日目",
      "body": "毎日配信が29日目になったことに感謝しました。顔出しのないラジオ配信でも、皆さんを楽しませたいという気持ちで話していると伝えました。"
    },
    {
      "timestamp": "0:27:24",
      "title": "自分のアバターを作りたい",
      "body": "皆さんのアバターを見ながら、自分のアバターも作りたいと話しました。楽器の話題も交え、どんなモチーフにするか会話が広がりました。"
    },
    {
      "timestamp": "0:30:19",
      "title": "一人ひとりの応援を力に",
      "body": "Paton投票は2位にいると話し、順位を保ちたいと呼びかけました。一人ひとりの応援が大切で、少しの応援でも力になっていると感謝しました。"
    },
    {
      "timestamp": "0:44:10",
      "title": "原稿に自分で読み仮名を",
      "body": "ラジオの原稿を下読みするとき、読み方が気になった言葉には自分で読み仮名を振ると話しました。声で伝えるための準備を紹介した場面です。"
    },
    {
      "timestamp": "0:51:20",
      "title": "会話の合間に短い歌唱",
      "body": "花の話から「ドライフラワー」の一部を歌いました。終盤には「とくべチュ、して」も短く口ずさみました。どちらも曲全体の歌唱ではありません。"
    },
    {
      "timestamp": "0:53:37",
      "title": "自分の声を好きになるために",
      "body": "以前、自分の声を録音して聴く取り組みを続けたことを紹介。声や話し方を褒めてもらい、そう言ってもらえると自信になると喜びました。"
    }
  ],
  "goals": [
    {
      "item": "コンテスト",
      "target": "ファイナル進出",
      "statusThen": "二つの挑戦への意欲"
    },
    {
      "item": "Paton投票",
      "target": "2位をキープ",
      "statusThen": "一人ひとりの応援に感謝"
    },
    {
      "item": "アバター",
      "target": "自分のものを作る",
      "statusThen": "皆さんとモチーフを相談"
    }
  ],
  "ranking": [
    RANKING_NOTE
  ],
  "timeline": [
    {
      "timestamp": "0:05:35",
      "label": "翌日のFMラジオを紹介"
    },
    {
      "timestamp": "0:15:15",
      "label": "ファイナルへ進みたい"
    },
    {
      "timestamp": "0:17:38",
      "label": "毎日配信29日目"
    },
    {
      "timestamp": "0:27:24",
      "label": "自分のアバターを作りたい"
    },
    {
      "timestamp": "0:30:19",
      "label": "一人ひとりの応援を力に"
    },
    {
      "timestamp": "0:39:24",
      "label": "ラジオ配信でも話す楽しさ"
    },
    {
      "timestamp": "0:44:10",
      "label": "原稿の下読みと読み仮名"
    },
    {
      "timestamp": "0:51:20",
      "label": "「ドライフラワー」の短い歌唱"
    },
    {
      "timestamp": "0:53:37",
      "label": "声を録音して聴いた取り組み"
    },
    {
      "timestamp": "0:54:50",
      "label": "「とくべチュ、して」の短い歌唱"
    },
    {
      "timestamp": "0:56:00",
      "label": "ランキング読み上げ"
    },
    {
      "timestamp": "0:57:34",
      "label": "夜枠は未定、ファンルームで連絡"
    },
    {
      "timestamp": "0:59:01",
      "label": "投票への呼びかけと挨拶"
    }
  ],
  "nextNote": "配信時点では、当日夜の配信は未定で、ファンルームを中心に連絡すると案内。翌朝は6時からメイク配信をする予定と話していました。",
  "sourceLabel": "2026年8月29日 SHOWROOM昼配信（オーナー提供録画の自動文字起こし）",
  "verifiedAt": "2026-09-08",
  "transcriptionNote": buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画はラジオ配信に表示された写真を、当該録画の実フレームから1枚掲載しています。同じ写真で枚数を増やしていません。", extra: "録画の記録時刻を概数で表示しています。実際の配信開始時刻との一致は未確認です。曲名未確定の短い旋律は歌リストに含めていません。" })
};
