import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

const nightStills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b60-01-bright-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。頬に手を添えてにっこり",
    "caption": "01:50 頬に手を添えてにっこり",
    "downloadName": "みりぃ_20260905夜_01.jpg"
  },
  {
    "src": "/media/live/mily-b60-02-sunglasses.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。サングラスでポーズ",
    "caption": "02:37 サングラスでポーズ",
    "downloadName": "みりぃ_20260905夜_02.jpg"
  },
  {
    "src": "/media/live/mily-b60-03-flute-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。篠笛を手に笑顔",
    "caption": "14:29 篠笛を手に笑顔",
    "downloadName": "みりぃ_20260905夜_03.jpg"
  },
  {
    "src": "/media/live/mily-b60-04-flute-wave.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。篠笛を持って手を振って",
    "caption": "22:49 篠笛を持って手を振って",
    "downloadName": "みりぃ_20260905夜_04.jpg"
  },
  {
    "src": "/media/live/mily-b60-05-flute-playing.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。篠笛を演奏中",
    "caption": "24:40 篠笛を演奏中",
    "downloadName": "みりぃ_20260905夜_05.jpg"
  },
  {
    "src": "/media/live/mily-b60-06-after-playing.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。演奏後の明るい笑顔",
    "caption": "25:51 演奏後の明るい笑顔",
    "downloadName": "みりぃ_20260905夜_06.jpg"
  },
  {
    "src": "/media/live/mily-b60-07-hand-cheek.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。口元に手を添えて",
    "caption": "36:51 口元に手を添えて",
    "downloadName": "みりぃ_20260905夜_07.jpg"
  },
  {
    "src": "/media/live/mily-b60-08-hair-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。サングラスに手を添えて",
    "caption": "41:00 サングラスに手を添えて",
    "downloadName": "みりぃ_20260905夜_08.jpg"
  },
  {
    "src": "/media/live/mily-b60-09-finger-pose.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。両手の指でポーズ",
    "caption": "42:20 両手の指でポーズ",
    "downloadName": "みりぃ_20260905夜_09.jpg"
  },
  {
    "src": "/media/live/mily-b60-10-close-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月5日の夜配信、三つ編み姿のみりぃ。カメラに向かってにっこり",
    "caption": "45:10 カメラに向かってにっこり",
    "downloadName": "みりぃ_20260905夜_10.jpg"
  }
];

/** オーナー提供録画の自動文字起こしを要約。実フレーム10枚は目視確認。 */
export const streamRecap20260905Night: StreamRecap = {
  songs: [
    { title: "メメント・モリ", artist: "大森元貴", timestamp: "0:40:45", youtubeUrl: "https://www.youtube.com/watch?v=Rlk3i0sEQR8", karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=dD5Djc_HoGU", channel: "EdKara" } },
  ],
  image: nightStills[9],
  gallery: nightStills,
  "id": "2026-09-05-night-gachi-showroom",
  "date": "2026-09-05",
  "dateLabel": "2026.09.05（土）",
  "theme": "夜の配信・三次3日目",
  "broadcastLabel": "21:01頃〜 約47分",
  "platformLabel": "SHOWROOM",
  "summary": "サングラスと三つ編み姿で、動画編集の裏側や応援への思いを話した夜配信。中盤には篠笛を披露し、お祭りで演奏する曲について教えてくれました。終盤は好きな歌を届ける時間へ。楽曲に出会い、みんなに披露できる喜びが伝わる回でした。",
  "galleryZip": {
    "src": "/media/live/mily-b60-night-stills.zip",
    "filename": "みりぃ_20260905夜_スクショ10枚.zip",
    "label": "10枚まとめて保存"
  },
  "highlights": [
    {
      "timestamp": "0:00:15",
      "title": "編集した動画に込めたひと工夫",
      "body": "動画の編集を頑張ってみたと話し、楽しく作れたと振り返りました。TikTokでは撮り直しを重ね、みんなに良いものを届けたいと思うほど時間がかかる、と制作の裏側も教えてくれました。"
    },
    {
      "timestamp": "0:02:25",
      "title": "サングラスで遊び心を",
      "body": "黒いサングラスを実際に掛けて見せる場面も。三つ編みとサングラスの組み合わせで、表情豊かにコメントとやりとりしていました。"
    },
    {
      "timestamp": "0:06:15",
      "title": "みんなで少しずつ、目標へ",
      "body": "WEB投票と100キラでの応援を呼びかけ、アバター制作権の獲得も目標として紹介。一人にたくさんではなく、ルームのみんなで力を合わせたい、応援したいと思ってもらえるよう頑張りたいと話していました。"
    },
    {
      "timestamp": "0:14:50",
      "title": "篠笛を手に、おしゃべり",
      "body": "篠笛を吹く姿を見たことがあるか、みんなに問いかけました。楽器をめぐる冗談も飛び交い、演奏前からにぎやかな時間になっていました。"
    },
    {
      "timestamp": "0:24:20",
      "title": "篠笛の音が響く時間",
      "body": "カメラの前で篠笛を披露しました。演奏後は拍手に感謝し、お祭りの山車の上で演奏する曲の話へ。今回はいろいろな部分を組み合わせたとも説明していました。"
    },
    {
      "timestamp": "0:39:10",
      "title": "好きな歌を届けたくて",
      "body": "好きな曲を歌おうと準備し、終盤は歌の時間に。歌い終えて、この曲に出会えたことも、みんなに披露できることも幸せだと話しました。"
    },
    {
      "timestamp": "0:45:10",
      "title": "今日の一曲、という楽しみも",
      "body": "配信ごとに一曲聴きたいという声に、今日の一曲という形でやっていこうかと応じました。最後は応援してくれた人たちへお礼を伝えていました。"
    }
  ],
  "goals": [
    {
      "item": "WEB投票",
      "target": "一人ひとりの応援",
      "statusThen": "夜も呼びかけ"
    },
    {
      "item": "100キラ",
      "target": "みんなで少しずつ",
      "statusThen": "みんなで力を合わせたい"
    },
    {
      "item": "アバター制作権",
      "target": "獲得を目指す",
      "statusThen": "まだ獲得したことがない"
    }
  ],
  "ranking": [],
  "timeline": [
    {
      "timestamp": "0:00:15",
      "label": "編集した動画に込めたひと工夫"
    },
    {
      "timestamp": "0:02:25",
      "label": "サングラスで遊び心を"
    },
    {
      "timestamp": "0:06:15",
      "label": "みんなで少しずつ、目標へ"
    },
    {
      "timestamp": "0:14:50",
      "label": "篠笛を手に、おしゃべり"
    },
    {
      "timestamp": "0:24:20",
      "label": "篠笛の音が響く時間"
    },
    {
      "timestamp": "0:39:10",
      "label": "好きな歌を届けたくて"
    },
    {
      "timestamp": "0:45:10",
      "label": "今日の一曲、という楽しみも"
    }
  ],
  "nextNote": "配信時点では、翌朝は5時半からの早い時間の配信と案内し、無理をせず休んでほしいとも話していました。浴衣については着る予定がないと発言しており、浴衣配信の確定告知としては扱っていません。現在の予定や実施結果を示すものではありません。",
  "sourceLabel": "2026年9月5日 SHOWROOM夜配信 録画から作成した配信レポート・自動文字起こし（オーナー提供素材）",
  "verifiedAt": "2026-09-05",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム10枚を掲載しています。10枚とも目視確認しています。",
    extra:
      "時刻は録画先頭からの目安で、開始時刻は素材名の記録時刻に基づく概数です。歌唱区間の自動認識と公式楽曲情報を照合し、曲名を追記しています。歌詞は掲載していません。",
  }),
};
