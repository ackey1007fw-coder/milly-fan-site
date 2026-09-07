import type { StreamRecap } from "./streamRecaps.ts";
import {
  buildTranscriptionNote,
  RANKING_NOTE_WITHOUT_RANGE,
  REPORT_MATERIAL_NOTE,
} from "./streamRecapRules.ts";

/**
 * オーナー提供の配信レポート・文字起こし抜粋をもとにした公開用要約。
 * 原音声・映像を再確認した記録ではない。タイムスタンプは提供メモの目安。
 * この夜枠の確認済み画像がないため、他の回の画像は流用しない。
 * LIVE STREAM専用。原記録、個人ランキング、私生活の詳細は公開しない。
 */
export const streamRecap20260904Night: StreamRecap = {
  id: "2026-09-04-night-gachi-showroom",
  date: "2026-09-04",
  dateLabel: "2026.09.04（金）",
  theme: "夜の配信・三次2日目",
  broadcastLabel: "22:32頃〜 約67分",
  platformLabel: "SHOWROOM",
  summary:
    "MISS CIRCLE CONTEST 三次審査2日目の夜枠。リスナーに励まされていることや、一緒に過ごす時間への感謝を伝えました。終盤には、人生のモットー「喜怒哀楽を楽しむ」を紹介。WEB投票とキラキラを呼びかけ、「おつみり」「おやすみ」で約67分の配信を締めくくりました。",
  highlights: [
    {
      timestamp: "0:02:00",
      title: "配信で受け取る元気",
      body: "みんなに勇気づけられているから配信に来た、と話しました。来てくれた人たちとの時間を大切にする言葉が聞かれました。",
      quote: "配信してた方が自分元気だから、みんなに勇気付けられてるから、来てみたよ",
    },
    {
      timestamp: "0:37:00",
      title: "WEB投票とキラキラ",
      body: "この夜枠でも、WEB投票とキラキラでの応援を呼びかけていました。",
    },
    {
      timestamp: "0:48:00",
      title: "一緒に過ごす時間",
      body: "明るく配信することだけが大切なのではない、とリスナーとのやり取りを通して話しました。",
    },
    {
      timestamp: "0:58:00",
      title: "人生のモットーを紹介",
      body: "終盤には「息のあいだを楽しむ」「喜怒哀楽を楽しむ」という人生のモットーを紹介しました。",
      quote: "私の人生のモットーは、息のあいだを楽しむ。喜怒哀楽を楽しむ",
    },
    {
      timestamp: "1:05:00",
      title: "みんなへ、ありがとう",
      body: "みんなの愛を感じたと感謝を伝え、「おつみり」「おやすみ」でお別れ。翌日も頑張ると話し、夜枠を締めくくりました。",
    },
  ],
  goals: [
    { item: "WEB投票", target: "応援のお願い", statusThen: "配信内で呼びかけ" },
    { item: "キラキラ", target: "応援のお願い", statusThen: "配信内で呼びかけ" },
  ],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:00:00", label: "来てくれたみんなへお礼" },
    { timestamp: "0:02:00", label: "配信で勇気づけられていること" },
    { timestamp: "0:37:00", label: "WEB投票の呼びかけ" },
    { timestamp: "0:48:00", label: "一緒に過ごす時間について" },
    { timestamp: "0:58:00", label: "終盤、人生のモットーの話へ" },
    { timestamp: "1:03:00", label: "ランキングと応援へのお礼" },
    { timestamp: "1:05:00", label: "感謝と翌日の案内。おつみり、おやすみ" },
  ],
  nextNote:
    "配信時点では、翌9月5日の配信予定はファンルームで案内すると話していました。このメモでは次枠の時刻を確定情報として掲載していません。",
  sourceLabel: "2026年9月4日 SHOWROOM夜配信 配信レポート・文字起こし抜粋（オーナー提供）",
  verifiedAt: "2026-09-05",
  transcriptionNote: buildTranscriptionNote({
    material: REPORT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。",
    extra: "タイムスタンプは話題の位置を示す目安です。",
  }),
};
