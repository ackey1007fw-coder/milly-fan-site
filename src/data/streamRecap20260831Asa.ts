import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

export const streamRecap20260831Asa: StreamRecap = {
  id: "2026-08-31-morning-showroom",
  date: "2026-08-31",
  dateLabel: "2026.08.31（月）",
  theme: "朝のラジオ・元気をもらって",
  broadcastLabel: "06:46頃〜 約31分",
  platformLabel: "SHOWROOM",
  summary: "予定を前倒しして始めた朝のラジオ配信。眠い朝に皆さんと話すうち、元気と勇気をもらったと感謝しました。応援の言葉が自信につながったことを振り返り、お互いに今日も頑張ろうと送り出した回です。",
  highlights: [
    { timestamp: "0:02:42", title: "前倒しの朝ラジオ", body: "眠気が抜けず、皆さんと話して目を覚まそうと予定を前倒し。準備に入る前のおしゃべりになりました。" },
    { timestamp: "0:07:21", title: "Paton投票を呼びかけ", body: "もう一つのコンテストの投票について、この日は1.5倍の日で、配信時点では1位と話しました。投票してくれた皆さんへ感謝を伝えました。" },
    { timestamp: "0:10:40", title: "早起きの皆さんを応援", body: "早い時間から活動している皆さんに感心し、自分も一緒に今日を頑張ろうと話しました。" },
    { timestamp: "0:15:06", title: "動画への応援に感謝", body: "二つのコンテストを両立する中、ムービーで取り組んだ配信審査を7位で終えたと報告し、応援への感謝を伝えました。" },
    { timestamp: "0:20:36", title: "褒めてもらうと頑張れる", body: "応援の言葉が力になり、皆さんのおかげでここまで来られたと話しました。" },
    { timestamp: "0:24:37", title: "目標を言える自信に", body: "初めはファイナルまで行くと言い切れなかったことを振り返り、皆さんのおかげで自信がついたと話しました。" },
    { timestamp: "0:28:20", title: "朝に2人増えて58人", body: "トマトの栄養素がこの朝に2人増え、58人になったと喜びました。" },
    { timestamp: "0:29:03", title: "元気をもらって出発へ", body: "目が覚め、皆さんから勇気をもらったと感謝。自分も勇気を届けられる人でありたいと話して締めました。" },
  ],
  goals: [
    { item: "コンテスト", target: "ファイナル", statusThen: "目標を言える自信に" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:09", label: "朝の挨拶と眠気の話" },
    { timestamp: "0:02:42", label: "予定を前倒しして配信" },
    { timestamp: "0:05:05", label: "この後の準備と収録の話題" },
    { timestamp: "0:07:21", label: "Paton投票の呼びかけ" },
    { timestamp: "0:10:40", label: "早い時間から活動する皆さんを応援" },
    { timestamp: "0:15:06", label: "ムービーへの応援と7位の報告" },
    { timestamp: "0:20:36", label: "応援の言葉が力になる" },
    { timestamp: "0:24:37", label: "目標を言えるようになった自信" },
    { timestamp: "0:27:21", label: "ランキング読み上げ" },
    { timestamp: "0:28:20", label: "トマトの栄養素が58人に" },
    { timestamp: "0:29:57", label: "次枠はファンルームで連絡と案内" },
    { timestamp: "0:30:38", label: "お互いに頑張ろうと挨拶" },
  ],
  nextNote: "配信時点では、次枠は夜になる見込みで、ファンルームで改めて連絡すると案内していました。開始時刻は確定していません。",
  sourceLabel: "2026年8月31日 SHOWROOM朝配信（オーナー提供録画の自動文字起こし）",
  verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画は掲載していません。", extra: "ラジオ配信です。時刻は録画先頭からの目安です。" }),
};
