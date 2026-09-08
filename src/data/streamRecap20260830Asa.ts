import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills = [
  {
    "src": "/media/live/mily-b73-01-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。両手を顎に添えて",
    "caption": "0:36:13 両手を顎に添えて",
    "downloadName": "2026-08-30-morning-01-r0604-t00h36m13s.jpg"
  },
  {
    "src": "/media/live/mily-b73-02-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。両手で輪を作って",
    "caption": "0:36:16 両手で輪を作って",
    "downloadName": "2026-08-30-morning-02-r0604-t00h36m16s.jpg"
  },
  {
    "src": "/media/live/mily-b73-03-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。両手を頭に添えて笑顔",
    "caption": "0:36:21 両手を頭に添えて笑顔",
    "downloadName": "2026-08-30-morning-03-r0604-t00h36m21s.jpg"
  },
  {
    "src": "/media/live/mily-b73-04-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。顎に手を添えて笑顔",
    "caption": "0:36:50 顎に手を添えて笑顔",
    "downloadName": "2026-08-30-morning-04-r0604-t00h36m50s.jpg"
  },
  {
    "src": "/media/live/mily-b73-05-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。指でハートを作って",
    "caption": "0:37:24 指でハートを作って",
    "downloadName": "2026-08-30-morning-05-r0604-t00h37m24s.jpg"
  },
  {
    "src": "/media/live/mily-b73-06-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。首を傾けて手を振る場面",
    "caption": "0:37:33 首を傾けて手を振る場面",
    "downloadName": "2026-08-30-morning-06-r0604-t00h37m33s.jpg"
  },
  {
    "src": "/media/live/mily-b73-07-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。髪に手を添えて笑顔",
    "caption": "0:37:51 髪に手を添えて笑顔",
    "downloadName": "2026-08-30-morning-07-r0604-t00h37m51s.jpg"
  },
  {
    "src": "/media/live/mily-b73-08-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。首を傾けて両手でピース",
    "caption": "0:37:53 首を傾けて両手でピース",
    "downloadName": "2026-08-30-morning-08-r0604-t00h37m53s.jpg"
  },
  {
    "src": "/media/live/mily-b73-09-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。首を傾けた場面",
    "caption": "0:38:57 首を傾けた場面",
    "downloadName": "2026-08-30-morning-09-r0604-t00h38m57s.jpg"
  },
  {
    "src": "/media/live/mily-b73-10-morning-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月30日朝配信のみりぃ。両手を振って笑顔",
    "caption": "0:39:11 両手を振って笑顔",
    "downloadName": "2026-08-30-morning-10-r0604-t00h39m11s.jpg"
  }
];

export const streamRecap20260830Asa: StreamRecap = {
  id: "2026-08-30-morning-showroom",
  date: "2026-08-30",
  dateLabel: "2026.08.30（日）",
  theme: "朝のメイク・30日記念",
  broadcastLabel: "06:04頃〜 約39分",
  platformLabel: "SHOWROOM",
  summary: "ラジオの生放送へ向かう前、皆さんと話しながらメイクをした朝。30日記念のお祝いを喜び、配信が楽しくなったことへの感謝を伝えました。初めて来た方との挨拶も大切にし、準備を終えて元気に出発した回です。",
  songs: [{ title: "超最強", artist: "超ときめき♡宣伝部", timestamp: "0:24:15", youtubeUrl: "https://www.youtube.com/watch?v=PwlB-rXk1gM", karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=Wuyx1pDlDvg", channel: "カラオケ歌っちゃ王" } }],
  image: approvedStills[7],
  gallery: approvedStills,
  galleryZip: {"src": "/media/live/mily-b73-morning-stills.zip", "filename": "みりぃ_20260830朝_10枚.zip", "label": "10枚まとめて保存"},
  highlights: [
    { timestamp: "0:00:04", title: "30日記念にびっくり", body: "30日記念のお祝いギフトに気づいて喜びました。早朝から会いに来てくれた皆さんに感謝し、賑やかにメイクを始めました。" },
    { timestamp: "0:04:24", title: "一日の始まりに元気を", body: "朝から皆さんに会えると気持ちが上がり、一日が楽しくなると話しました。一緒に素敵な日にしていこうと呼びかけました。" },
    { timestamp: "0:10:12", title: "配信を楽しくしてくれて", body: "始める前は配信が怖かったことを振り返り、今は楽しいと思わせてもらっていると感謝。これからも毎日続けていきたいと話しました。" },
    { timestamp: "0:14:13", title: "二つのコンテストへの挑戦", body: "二つのコンテストに参加していることを紹介。配信時点で行われていたPaton投票への協力を呼びかけ、SNSのお知らせも案内しました。" },
    { timestamp: "0:18:55", title: "初めましてを大切に", body: "メイク中にコメントを見逃したら、もう一度送ってほしいとお願いしました。初めて来てくれた方との挨拶を大事にしたいと話しました。" },
    { timestamp: "0:24:15", title: "超最強を短く口ずさんで", body: "コメントとのやりとりから「超最強」の一部を口ずさみました。曲全体の歌唱ではなく、メイクの合間の短いフレーズです。" },
    { timestamp: "0:31:48", title: "この日のラジオを案内", body: "湘南シーサイドサークルの番組名を紹介し、この日は10時からの生放送と案内。ウェブで聴けることや、番組へのメッセージの送り方を話しました。" },
    { timestamp: "0:36:15", title: "メイク完成、行ってきます", body: "メイクが完成して皆さんに披露。ランキングを読み上げてお礼を伝え、今日も一日頑張ろうと呼びかけてラジオへ出発しました。" },
  ],
  goals: [{ item: "毎日配信", target: "毎日続ける", statusThen: "30日記念の朝" }],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:04", label: "30日記念のお祝いに感謝" },
    { timestamp: "0:04:24", label: "朝の配信がくれる元気" },
    { timestamp: "0:10:12", label: "配信が楽しくなったこと" },
    { timestamp: "0:11:26", label: "ラジオ生放送前のメイク" },
    { timestamp: "0:14:13", label: "二つのコンテストとPaton投票" },
    { timestamp: "0:18:55", label: "初めての挨拶を大切に" },
    { timestamp: "0:24:15", label: "「超最強」の短い歌唱" },
    { timestamp: "0:25:25", label: "アイスのコーンとカップの話" },
    { timestamp: "0:27:46", label: "初めて来た皆さんを歓迎" },
    { timestamp: "0:31:48", label: "この日のラジオと聴き方" },
    { timestamp: "0:36:15", label: "メイク完成を披露" },
    { timestamp: "0:36:48", label: "ランキング読み上げ" },
    { timestamp: "0:38:10", label: "ラジオへ出発" },
    { timestamp: "0:38:53", label: "次の配信は夜の見込み" },
    { timestamp: "0:39:03", label: "今日も一日頑張ろう" },
  ],
  nextNote: "配信時点では、次の配信は夜になる見込みと案内していました。時刻は確定せず、ファンルームで告知すると話していました。",
  sourceLabel: "2026年8月30日 SHOWROOM朝配信（オーナー提供録画の自動文字起こし）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は録画の実フレームから選んだ承認済み10枚を掲載しています。", extra: "録画の記録時刻を概数で表示しています。実際の配信開始時刻との一致は未確認です。" }),
};
