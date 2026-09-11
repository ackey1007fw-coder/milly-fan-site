import type { StreamRecap } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  RANKING_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

export const streamRecap20260911Asa: StreamRecap = {
  id: "2026-09-11-asa-showroom",
  date: "2026-09-11",
  dateLabel: "2026.09.11（金）",
  theme: "朝5時のラジオと感謝",
  broadcastLabel: "5:11頃〜 約85分",
  platformLabel: "SHOWROOM",
  summary: "前夜の配信を待っていた人へお詫びと感謝を伝える、早朝のラジオ配信でした。アバター権への思い、あいさつや応援が力になること、自分らしさを大切にしながら全力で続けたい気持ちを語りました。",
  highlights: [
    {
      timestamp: "0:03:17",
      title: "ラジオ配信で朝の再会",
      body: "この朝はラジオ配信だと伝え、早い時間から訪れた人たちに何度も感謝を届けました。",
    },
    {
      timestamp: "0:06:58",
      title: "アバター権への思い",
      body: "前夜に配信できなかったことにも触れながら、今回の期間でアバター権を獲得したい気持ちを改めて話しました。",
    },
    {
      timestamp: "0:19:49",
      title: "三次審査中の呼びかけ",
      body: "三次審査中であることを紹介し、アバター権獲得への応援を呼びかけました。",
    },
    {
      timestamp: "0:40:30",
      title: "応援へ恩返ししたい",
      body: "支えてもらっていることへの感謝と、その気持ちにもっと応え、恩返ししていきたいという思いを語りました。",
    },
    {
      timestamp: "0:45:53",
      title: "おはようの一言も力に",
      body: "あいさつやコメント、ギフトを受け取る瞬間がとても嬉しいと話し、日々の交流への感謝を伝えました。",
    },
    {
      timestamp: "0:51:04",
      title: "自分らしさを見つめ直す",
      body: "うまくできないと感じる部分も見方を変えれば自分だけの魅力になる、という言葉を受け止め、前へ進みたいと話しました。",
    },
    {
      timestamp: "1:22:37",
      title: "自分なりに全力で",
      body: "不完全なところもあると振り返りながら、それでも自分にできることを全力で続けていきたいと伝えました。",
    },
  ],
  goals: [
    { item: "アバター権", target: "獲得", statusThen: "獲得したいと説明" },
    { item: "WEB投票", target: "投票の継続", statusThen: "朝も呼びかけ" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:38", label: "前夜に配信できなかったことを謝る" },
    { timestamp: "0:03:17", label: "ラジオ配信で朝のあいさつ" },
    { timestamp: "0:03:37", label: "投票へのお礼と呼びかけ" },
    { timestamp: "0:06:58", label: "アバター権獲得への思い" },
    { timestamp: "0:19:49", label: "三次審査とアバター権への応援" },
    { timestamp: "0:25:57", label: "支えてくれる人への感謝" },
    { timestamp: "0:40:30", label: "恩返ししたい気持ち" },
    { timestamp: "0:45:53", label: "あいさつやコメントが嬉しいと話す" },
    { timestamp: "0:51:04", label: "自分らしさと魅力について" },
    { timestamp: "1:20:18", label: "13位から1位までランキングを読み上げ" },
    { timestamp: "1:22:37", label: "自分なりに全力で続けたいと伝える" },
    { timestamp: "1:23:33", label: "同日夜の配信予定を案内" },
  ],
  nextNote: "配信時点では、同日夜は早くて21時頃からで、短い枠になる可能性があり、詳しい時間は後で案内すると話していました。現在の配信予定を示すものではありません。",
  sourceLabel: "2026年9月11日 SHOWROOM朝配信（オーナー提供録画の自動文字起こしを照合）",
  verifiedAt: "2026-09-11",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は掲載していません。確認した6場面は同じ目を閉じたラジオ用の写真で、掲載用として選定できる別の場面はありませんでした。",
    extra: "開始表示は録画開始記録05:11:19を丸めた目安で、実際の配信開始・終了時刻を確定するものではありません。約85分はメディアの実測85分12秒を丸めた長さで、録画処理の開始から保存完了までの経過時間とは区別しています。全1821区間の自動文字起こしと主要4区間の再認識を照合しました。全編手動聴取は未実施です。各時刻は録画先頭からの目安です。ラジオ形式、13位から1位までのランキング読み上げ、次枠案内は発言を確認した範囲で記録しています。",
  }),
};
