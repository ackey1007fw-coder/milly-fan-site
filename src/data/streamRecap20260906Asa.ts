import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildTranscriptionNote,
  RANKING_NOTE_WITHOUT_RANGE,
} from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  {
    "src": "/media/live/mily-b62-01-front-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月6日朝配信、大きなリボンを付けたみりぃ。正面の笑顔",
    "caption": "08:59 正面の笑顔",
    "downloadName": "みりぃ_20260906朝_厳選_01.jpg"
  },
  {
    "src": "/media/live/mily-b62-02-tilted-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月6日朝配信、大きなリボンを付けたみりぃ。首をかしげた笑顔",
    "caption": "48:01 首をかしげた笑顔",
    "downloadName": "みりぃ_20260906朝_厳選_02.jpg"
  },
  {
    "src": "/media/live/mily-b62-03-gentle-smile.jpg",
    "width": 640,
    "height": 360,
    "alt": "9月6日朝配信、大きなリボンを付けたみりぃ。やわらかい笑顔",
    "caption": "68:02 やわらかい笑顔",
    "downloadName": "みりぃ_20260906朝_厳選_03.jpg"
  }
];

/** オーナーが画像を確認し掲載を承認した3枚。 */
export const streamRecap20260906Asa: StreamRecap = {
  songs: [
    { title: "生まれてはじめて", artist: "神田沙也加・松たか子", timestamp: "0:50:15", youtubeUrl: "https://www.youtube.com/watch?v=MDZSdjLqiGA", karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=O3xpEoW_uao", channel: "生音風カラオケ屋" } },
    { title: "愛をこめて花束を", artist: "Superfly", timestamp: "1:16:40", youtubeUrl: "https://www.youtube.com/watch?v=gU5oN0KVofU", karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=_8TmGHhPjAw", channel: "生音風カラオケ屋" } },
  ],
  image: approvedStills[1],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b62-asa-stills.zip", filename: "みりぃ_20260906朝_厳選3枚.zip", label: "3枚まとめて保存" },
  "id": "2026-09-06-asa-gachi-showroom",
  "date": "2026-09-06",
  "dateLabel": "2026.09.06（日）",
  "theme": "朝の出会いと、歓迎の歌",
  "broadcastLabel": "05:32頃〜 約88分",
  "platformLabel": "SHOWROOM",
  "summary": "日曜の早朝、初めて来た人も再び訪れた人も歓迎した、にぎやかな朝配信。呼び名の由来やラジオ、アナウンスの授業について話し、たくさんの出会いへの感謝を歌でも届けました。コメントに応じる笑顔と、大きなリボンも印象に残る回です。",
  "highlights": [
    {
      "timestamp": "0:00:15",
      "title": "日曜の朝、初めましての出会い",
      "body": "早朝にもかかわらず集まった人たちへ、明るく挨拶。初めて来た人にも、もう一度来てくれた人にも喜びを伝え、コメントでのおしゃべりを歓迎していました。"
    },
    {
      "timestamp": "0:10:40",
      "title": "みんなと話せる時間を大切に",
      "body": "昼の配信を義務のように考えるより、朝と夜にしっかり時間を取って話す形もよいのでは、と相談。実際に配信を重ねる中で、時間の使い方を考え直していました。"
    },
    {
      "timestamp": "0:12:54",
      "title": "名前の由来とラジオの話",
      "body": "三橋莉子という名前から、みりぃという呼び名が生まれたことを紹介。コミュニティFMでの活動に触れ、おしゃべりが大好きだと話しました。この日は自身のラジオ出演はないとも説明しています。"
    },
    {
      "timestamp": "0:32:11",
      "title": "聞き取りやすい話し方へ",
      "body": "話し方へのコメントを受け、アナウンスの授業について紹介。聞き取りづらいときには教えてほしいと呼びかけ、挨拶だけのコメントでも嬉しいと伝えていました。"
    },
    {
      "timestamp": "0:36:25",
      "title": "一人ひとりの応援を積み重ねて",
      "body": "三次審査では投票とキラキラを着実に集めたいと説明。一人ひとりの力が大切だと話し、初めて出会った人にもWEB投票での応援をお願いしていました。"
    },
    {
      "timestamp": "0:46:35",
      "title": "歓迎の気持ちを歌に込めて",
      "body": "たくさんの人に出会えたことへの感謝を込めて、好きな歌を届ける時間へ。身振りを交えた歌の後は、寄せられた感想やコメントを読み返していました。"
    },
    {
      "timestamp": "1:15:34",
      "title": "最後の一曲も、好きな歌で",
      "body": "初めて聴く人にも届けたいと、よく歌う好きな曲を披露。歌い終えて、朝から聴いてもらえた喜びを伝え、応援してくれた人たちへお礼を述べていました。"
    },
    {
      "timestamp": "1:25:53",
      "title": "夜の案内と、一日のご挨拶",
      "body": "夜の配信予定に変更の可能性があることを伝え、改めて連絡すると案内。日曜の朝に集まってくれた人たちに感謝し、手を振って締めくくりました。"
    }
  ],
  "goals": [
    {
      "item": "WEB投票",
      "target": "一人ひとりの積み重ね",
      "statusThen": "初めての人にもお願い"
    },
    {
      "item": "キラキラ",
      "target": "着実に集める",
      "statusThen": "三次審査へ向けて呼びかけ"
    },
    {
      "item": "アバター制作権",
      "target": "獲得を目指す",
      "statusThen": "配信中に希望を紹介"
    }
  ],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  "timeline": [
    {
      "timestamp": "0:00:15",
      "label": "日曜の朝、初めましての出会い"
    },
    {
      "timestamp": "0:10:40",
      "label": "みんなと話せる時間を大切に"
    },
    {
      "timestamp": "0:12:54",
      "label": "名前の由来とラジオの話"
    },
    {
      "timestamp": "0:32:11",
      "label": "聞き取りやすい話し方へ"
    },
    {
      "timestamp": "0:36:25",
      "label": "一人ひとりの応援を積み重ねて"
    },
    {
      "timestamp": "0:46:35",
      "label": "歓迎の気持ちを歌に込めて"
    },
    {
      "timestamp": "1:15:34",
      "label": "最後の一曲も、好きな歌で"
    },
    {
      "timestamp": "1:25:53",
      "label": "夜の案内と、一日のご挨拶"
    }
  ],
  "nextNote": "配信時点では、当日夜は21時半を予定しつつ、開始が遅れる可能性があり改めて連絡すると案内していました。確定時刻や現在の予定・実施結果を示すものではありません。",
  "sourceLabel": "2026年9月6日 SHOWROOM朝配信 録画から作成した配信レポート・自動文字起こし（オーナー提供素材）",
  "verifiedAt": "2026-09-06",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム3枚を掲載しています。3枚とも目視確認し、オーナーの掲載承認を得ています。",
    extra:
      "時刻は録画先頭からの目安で、開始時刻は素材名の記録時刻に基づく概数です。歌唱区間の自動認識と公式楽曲情報を照合し、曲名を追記しています。歌詞は掲載していません。",
  }),
};
