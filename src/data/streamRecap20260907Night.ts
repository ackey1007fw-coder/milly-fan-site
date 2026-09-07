import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote } from "./streamRecapRules.ts";

export const streamRecap20260907Night: StreamRecap = {
  id: "2026-09-07-night-showroom",
  date: "2026-09-07",
  dateLabel: "2026.09.07（月）",
  theme: "夜のおしゃべりと一曲",
  broadcastLabel: "22:03頃〜 約73分",
  platformLabel: "SHOWROOM",
  summary:
    "CAMPUS GIRLSの本選EX期間の意味と、三次審査の毎日投票・キラキラを説明した夜配信。二つのコンテストへ勢いで挑戦した思いも話しました。終盤はHYの「366日」を披露し、翌朝7時半の案内で締めくくった約73分です。",
  songs: [
    {
      title: "366日",
      artist: "HY",
      timestamp: "0:44:00",
      youtubeUrl: "https://www.youtube.com/watch?v=glsH4Mgxz-g",
      karaoke: {
        youtubeUrl: "https://www.youtube.com/watch?v=OwV-IccMBZs",
        channel: "EdKara",
      },
    },
  ],
  highlights: [
    {
      timestamp: "0:00:20",
      title: "本選EX期間の意味",
      body: "本選までの間が長いこと、その期間に知ってもらい継続して応援してもらう準備だと説明しました。",
    },
    {
      timestamp: "0:02:20",
      title: "別アプリの無料ギフト",
      body: "もう一つの配信アプリでは、コメント欄から無料のコインやギフトを届けられると紹介し、協力できる人へお願いしました。",
    },
    {
      timestamp: "0:04:30",
      title: "毎日投票とキラキラ",
      body: "三次審査の毎日のWEB投票を最優先にしつつ、キラキラも時間をかけて集めてほしいと呼びかけました。",
    },
    {
      timestamp: "0:07:50",
      title: "勢いで踏み出した挑戦",
      body: "去年は一歩踏み出せなかった二つのコンテストに、やるなら今だと勢いでエントリーしたと振り返りました。可能性を信じたい、とも話しています。",
    },
    {
      timestamp: "0:09:40",
      title: "Milyという名前",
      body: "みつはしりこが英語のMilyになった経緯を紹介。海外進出を意識した国際的な要素だと説明し、表記が統一されていないことにも触れました。",
    },
    {
      timestamp: "0:24:50",
      title: "内面を褒めてもらえること",
      body: "外見だけでなく、内面を褒めてもらえることがうれしいと話しました。来てくれる人との掛け合いを楽しむ夜になりました。",
    },
    {
      timestamp: "0:44:00",
      title: "しっとりした一曲",
      body: "これまでパワフルな曲を中心に歌ってきたと前置きし、この配信ではHYの「366日」を披露しました。日によって声の調子が違うことにも触れています。",
    },
    {
      timestamp: "1:11:28",
      title: "ファンルームで報告",
      body: "約1時間15分になったことに触れ、本日のランキングは時間がないためファンルームで報告すると案内しました。",
    },
  ],
  goals: [
    {
      item: "WEB投票",
      target: "毎日の応援",
      statusThen: "夜も呼びかけ",
    },
    {
      item: "キラキラ",
      target: "時間をかけて",
      statusThen: "集めてほしいと案内",
    },
  ],
  ranking: [],
  timeline: [
    { timestamp: "0:00:20", label: "本選EX期間の意味" },
    { timestamp: "0:02:20", label: "別アプリの無料ギフト" },
    { timestamp: "0:04:30", label: "毎日投票とキラキラ" },
    { timestamp: "0:07:50", label: "二つのコンテストへ" },
    { timestamp: "0:09:40", label: "活動名の由来" },
    { timestamp: "0:20:20", label: "翌朝のメイク配信の話" },
    { timestamp: "0:24:50", label: "内面を褒めてもらえること" },
    { timestamp: "0:44:00", label: "「366日」" },
    { timestamp: "1:05:40", label: "XとInstagramの案内" },
    { timestamp: "1:11:28", label: "ランキングはファンルームへ" },
    { timestamp: "1:12:16", label: "翌朝7時半の案内" },
  ],
  nextNote:
    "配信時点では、翌朝は7時半からと案内していました。現在の配信予定を示すものではありません。",
  sourceLabel: "2026年9月7日 SHOWROOM夜配信（オーナー提供録画の自動文字起こしを照合）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra:
      "開始時刻は素材名の記録時刻に基づく概数で、時刻は録画先頭からの目安です。終盤の歌唱は自動文字起こしと公開歌詞を照合し、曲名を確定しています。歌詞は掲載していません。短い引用とみられる箇所は曲名を確定できず、歌リストには含めていません。",
  }),
};
