import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills = [
  {
    "src": "/media/live/mily-b79-01-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日夜配信のみりぃ。口元に両手を添えて",
    "caption": "0:05:00 口元に両手を添えて",
    "downloadName": "2026-08-26-night-01-r2125-t00h05m00s.jpg"
  },
  {
    "src": "/media/live/mily-b79-02-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日夜配信のみりぃ。カメラに近づいて笑顔",
    "caption": "0:11:00 カメラに近づいて笑顔",
    "downloadName": "2026-08-26-night-02-r2125-t00h11m00s.jpg"
  },
  {
    "src": "/media/live/mily-b79-03-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日夜配信のみりぃ。リップを手に笑顔",
    "caption": "0:22:59 リップを手に笑顔",
    "downloadName": "2026-08-26-night-03-r2125-t00h22m59s.jpg"
  },
  {
    "src": "/media/live/mily-b79-04-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日夜配信のみりぃ。両手でポーズ",
    "caption": "0:42:59 両手でポーズ",
    "downloadName": "2026-08-26-night-04-r2125-t00h42m59s.jpg"
  },
  {
    "src": "/media/live/mily-b79-05-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日夜配信のみりぃ。あごに手を添えて",
    "caption": "0:50:59 あごに手を添えて",
    "downloadName": "2026-08-26-night-05-r2125-t00h50m59s.jpg"
  },
  {
    "src": "/media/live/mily-b79-06-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日夜配信のみりぃ。顔の横に両手を添えて",
    "caption": "0:52:59 顔の横に両手を添えて",
    "downloadName": "2026-08-26-night-06-r2125-t00h52m59s.jpg"
  },
  {
    "src": "/media/live/mily-b79-07-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日夜配信のみりぃ。両手でピース",
    "caption": "0:54:59 両手でピース",
    "downloadName": "2026-08-26-night-07-r2125-t00h54m59s.jpg"
  },
  {
    "src": "/media/live/mily-b79-08-night-still.jpg",
    "width": 640,
    "height": 360,
    "alt": "2026年8月26日夜配信のみりぃ。両手でハート",
    "caption": "0:57:02 両手でハート",
    "downloadName": "2026-08-26-night-08-r2125-t00h57m02s.jpg"
  }
];

export const streamRecap20260826Night: StreamRecap = {
  id: "2026-08-26-night",
  date: "2026-08-26",
  dateLabel: "2026.08.26（水）",
  theme: "夜の歌と最終日の感謝",
  broadcastLabel: "21:25頃〜 約60分",
  platformLabel: "SHOWROOM",
  summary: "イベント最終日の緊張を語りながら、3曲を歌った夜です。集まってくれた皆さんへの感謝を重ね、この先も一緒に挑戦していきたいという思いを伝えました。",
  songs: [{
    title: "愛をこめて花束を",
    artist: "Superfly",
    timestamp: "0:11:52",
    youtubeUrl: "https://www.youtube.com/watch?v=gU5oN0KVofU",
  }, {
    title: "超最強",
    artist: "超ときめき♡宣伝部",
    timestamp: "0:30:28",
    youtubeUrl: "https://www.youtube.com/watch?v=PwlB-rXk1gM",
  }, {
    title: "好きすぎて滅！",
    artist: "M!LK",
    timestamp: "0:50:43",
    youtubeUrl: "https://www.youtube.com/watch?v=ZVUxJsPfoX8",
  }],
  image: approvedStills[7],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b79-night-stills.zip", filename: "みりぃ_20260826夜_8枚.zip", label: "8枚まとめて保存" },
  highlights: [
    { timestamp: "0:04:10", title: "最終日を迎えた緊張", body: "配信時点ではイベントが21時59分に終わると話し、最終日を迎えた緊張を伝えました。キラキラでの応援にも感謝しました。" },
    { timestamp: "0:09:53", title: "心を込めた歌の時間", body: "みんなへ心を込めて歌いたいと話し、「愛をこめて花束を」を歌いました。後半には「超最強」「好きすぎて滅！」も披露しました。" },
    { timestamp: "0:17:40", title: "応援の言葉が勇気に", body: "応援の言葉に勇気づけられ、期待に応えたいと思うようになったと話しました。早朝や夜遅くにも来てくれる皆さんが心強いと伝えました。" },
    { timestamp: "0:27:39", title: "ラジオでの活動を紹介", body: "FM湘南マジックウェイブでパーソナリティを務めていると紹介しました。そこで使っていた「みりぃ」という呼び名を、配信でも使っていると話しました。" },
    { timestamp: "0:37:41", title: "イベントを終えて感謝", body: "イベントの終わりを迎え、皆さんの応援へ感謝しました。初めて見た景色だったと振り返り、この時間を一緒に過ごせた喜びを伝えました。" },
    { timestamp: "0:40:26", title: "来てくれたことが嬉しい", body: "最終枠に来てもらえるか不安だったからこそ、皆さんが集まってくれたことが一番嬉しかったと話しました。続いてスクショのためにポーズを見せました。" },
    { timestamp: "0:43:40", title: "この先も一緒に挑戦", body: "これからの審査も一緒に歩んでくれる仲間と出会いたいと話し、翌日も配信すると伝えました。一つ一つの応援が力になったと振り返りました。" },
    { timestamp: "0:48:40", title: "Paton投票への呼びかけ", body: "配信時点ではPaton投票が始まったと案内し、投票方法をInstagramのストーリーへ載せたと話しました。両方のファイナルへ進み、恩返ししたいと伝えました。" },
  ],
  goals: [{ item: "コンテスト", target: "両方のファイナル", statusThen: "応援と恩返しの思い" }],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:34", label: "映像・音声とギフト表示の確認" },
    { timestamp: "0:04:10", label: "イベント最終日の緊張" },
    { timestamp: "0:11:52", label: "「愛をこめて花束を」を歌唱" },
    { timestamp: "0:17:40", label: "応援の言葉と期待に応えたい思い" },
    { timestamp: "0:27:39", label: "ラジオでの活動を紹介" },
    { timestamp: "0:30:28", label: "「超最強」を歌唱" },
    { timestamp: "0:37:41", label: "イベントを終えて感謝" },
    { timestamp: "0:40:26", label: "集まってくれたことへの喜び" },
    { timestamp: "0:42:01", label: "スクショのためのポーズ" },
    { timestamp: "0:43:40", label: "新しい仲間と今後の挑戦" },
    { timestamp: "0:48:40", label: "Paton投票の案内" },
    { timestamp: "0:50:43", label: "「好きすぎて滅！」を歌唱" },
    { timestamp: "0:54:49", label: "ランキング読み上げ" },
    { timestamp: "0:58:49", label: "翌日の配信とファンルームの案内" },
  ],
  nextNote: "配信時点では、翌朝に短く配信し、その後の配信についてはファンルームで案内すると話していました。",
  sourceLabel: "2026年8月26日 夜配信（オーナー提供録画の音声認識）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は当該録画の実フレームから選んだ承認済み8枚を掲載しています。",
    extra: "自動文字起こしと歌唱前後の音声認識を照合しています。全編の手動聴取ではありません。時刻は録画内の目安で、記録時刻と実際の配信開始時刻との一致は未確認です。",
  }),
};
