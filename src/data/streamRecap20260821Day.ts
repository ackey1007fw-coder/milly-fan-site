import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills = [
  {
    "src": "/media/live/mily-b89-01-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日昼配信のみりぃ。髪に手を添えて笑顔",
    "caption": "0:00:20 髪に手を添えて笑顔",
    "downloadName": "2026-08-21-day-01-t00h00m20s.png"
  },
  {
    "src": "/media/live/mily-b89-02-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日昼配信のみりぃ。人差し指を立てて",
    "caption": "0:30:18 人差し指を立てて",
    "downloadName": "2026-08-21-day-02-t00h30m18s.png"
  },
  {
    "src": "/media/live/mily-b89-03-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日昼配信のみりぃ。あごに手を添えて",
    "caption": "1:06:17 あごに手を添えて",
    "downloadName": "2026-08-21-day-03-t01h06m17s.png"
  },
  {
    "src": "/media/live/mily-b89-04-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日昼配信のみりぃ。カメラに向かって笑顔",
    "caption": "1:09:21 カメラに向かって笑顔",
    "downloadName": "2026-08-21-day-04-t01h09m21s.png"
  },
  {
    "src": "/media/live/mily-b89-05-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日昼配信のみりぃ。腕を広げて歌唱中",
    "caption": "1:36:20 腕を広げて歌唱中",
    "downloadName": "2026-08-21-day-05-t01h36m20s.png"
  },
  {
    "src": "/media/live/mily-b89-06-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日昼配信のみりぃ。両手をあごの下に添えて",
    "caption": "2:09:20 両手をあごの下に添えて",
    "downloadName": "2026-08-21-day-06-t02h09m20s.png"
  },
  {
    "src": "/media/live/mily-b89-07-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日昼配信のみりぃ。指を交差させて笑顔",
    "caption": "2:15:19 指を交差させて笑顔",
    "downloadName": "2026-08-21-day-07-t02h15m19s.png"
  },
  {
    "src": "/media/live/mily-b89-08-day-still.png",
    "width": 640,
    "height": 360,
    "alt": "2026年8月21日昼配信のみりぃ。手を伸ばして笑顔",
    "caption": "2:30:18 手を伸ばして笑顔",
    "downloadName": "2026-08-21-day-08-t02h30m18s.png"
  }
];

export const streamRecap20260821Day: StreamRecap = {
  id: "2026-08-21-day",
  date: "2026-08-21",
  dateLabel: "2026.08.21（金）",
  theme: "昼のおつまみと挑戦への思い",
  broadcastLabel: "14:22頃〜 約157分",
  platformLabel: "SHOWROOM",
  summary: "好きなおつまみを食べながら、初めての人も迎えておしゃべりした昼。「愛をこめて花束を」を歌い、挑戦をためらう人の背中を押したいという、配信を始めた思いを語りました。",
  songs: [{
    title: "愛をこめて花束を",
    artist: "Superfly",
    timestamp: "1:32:03",
    youtubeUrl: "https://www.youtube.com/watch?v=gU5oN0KVofU",
    karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=_8TmGHhPjAw", channel: "生音風カラオケ屋" },
  }],
  image: approvedStills[0],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b89-day-stills.zip", filename: "みりぃ_20260821昼_8枚.zip", label: "8枚まとめて保存" },
  highlights: [
    { timestamp: "0:08:28", title: "おつまみを紹介", body: "コーラやわさびの柿の種、カリカリ梅など、買ってきたおつまみを紹介しました。画面の向こうのみんなと乾杯し、好きなおつまみを聞きながら話しています。" },
    { timestamp: "0:26:21", title: "挑戦で恩返しを", body: "ランウェイ出演につながるイベントへの挑戦を紹介しました。応援してくれるみんなに恩返しができたら、という思いを語っています。" },
    { timestamp: "0:36:01", title: "配信21日目のありがとう", body: "初配信から21日目を迎え、毎日配信できていることへの感謝を伝えました。再び訪れてくれた人にも、うれしい気持ちを話しています。" },
    { timestamp: "0:58:49", title: "等身大のみりぃ", body: "好きなおつまみを食べながら、等身大の自分を見せたいと話しました。気取らないおしゃべりの中で、初めての人にも自己紹介をしています。" },
    { timestamp: "1:01:54", title: "ミュージカルの話", body: "次のラジオのトークテーマに触れ、ミュージカルを観に行ったことがあるか尋ねました。好きな舞台を観たときの感動について話しています。" },
    { timestamp: "1:38:44", title: "楽しんでもらえる歌を", body: "「愛をこめて花束を」を歌った後、みんなが楽しんでくれることを一番に考えたいと話しました。歌えるときには歌っていこうという思いを伝えています。" },
    { timestamp: "1:41:27", title: "一歩を踏み出すきっかけに", body: "挑戦をためらう人の背中を押したいと、配信を始めた思いを語りました。自分も勇気を出した経験を振り返り、みんなと励まし合える関係になれたら、と伝えています。" },
    { timestamp: "2:36:17", title: "長い時間を一緒にありがとう", body: "ランキングを読み上げ、長い時間付き合ってくれたみんなへ感謝を伝えました。次の夜配信にも、無理のない範囲で来てほしいと呼びかけて締めくくっています。" },
  ],
  goals: [],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:08:28", label: "おつまみの紹介" },
    { timestamp: "0:12:22", label: "みんなで乾杯" },
    { timestamp: "0:26:21", label: "ランウェイへの挑戦" },
    { timestamp: "0:36:01", label: "配信21日目の感謝" },
    { timestamp: "0:58:49", label: "等身大の自分" },
    { timestamp: "1:01:54", label: "ミュージカルの話" },
    { timestamp: "1:32:03", label: "「愛をこめて花束を」を歌唱" },
    { timestamp: "1:38:44", label: "歌を届ける思い" },
    { timestamp: "1:41:27", label: "挑戦する勇気" },
    { timestamp: "2:35:04", label: "ランキング読み上げ" },
    { timestamp: "2:36:17", label: "感謝と次枠案内" },
  ],
  nextNote: "配信時点では、次の配信は23時頃を基本とし、予定が押した場合は時刻を変更する可能性があると案内していました。",
  sourceLabel: "2026年8月21日 昼配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当該録画から選んだ承認済み8枚を掲載しています。",
    extra: "録画全編の自動文字起こしを読み、歌唱前後の音声認識結果と既存の歌唱メモを照合しました。全編手動聴取は未実施です。記録時刻と実際の配信開始時刻との一致は未確認です。",
  }),
};
