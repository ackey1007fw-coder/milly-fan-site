import type { StreamRecap } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStill = {
  src: "/media/live/mily-b75-01-morning-still.jpg", width: 640, height: 360,
  alt: "2026年8月28日朝のラジオ配信に表示された、チュロスを手にしたみりぃの静止画",
  caption: "0:05:00 ラジオ配信に表示された静止画",
  downloadName: "2026-08-28-morning-01-r0733-t00h05m00s.jpg",
};

export const streamRecap20260828Asa: StreamRecap = {
  id: "2026-08-28-morning-showroom", date: "2026-08-28", dateLabel: "2026.08.28（金）",
  theme: "朝のラジオ・元気チャージ", broadcastLabel: "07:33頃〜 約50分", platformLabel: "SHOWROOM",
  summary: "急きょラジオ配信で始まった朝。初めて来た皆さんを迎え、会話を重ねながら元気を届けました。ラジオ番組の聴き方や自己紹介も交え、今日も一日頑張ろうと送り出した回です。",
  image: approvedStill, gallery: [approvedStill],
  galleryZip: { src: "/media/live/mily-b75-morning-stills.zip", filename: "みりぃ_20260828朝_1枚.zip", label: "1枚を保存" },
  highlights: [
    { timestamp: "0:01:40", title: "急きょラジオでおはよう", body: "アラームの設定を間違えたと説明し、ラジオ配信で皆さんに挨拶しました。音声が届いていることも確かめながら、朝の会話が始まりました。" },
    { timestamp: "0:11:49", title: "もう一度来てくれてありがとう", body: "二回目に来てくれた方へ、貴重な二回目だと感謝しました。次々に届くコメントを喜び、読み逃したらまた声をかけてほしいと伝えました。" },
    { timestamp: "0:29:16", title: "朝から元気を届けたい", body: "声を聞くと元気が出るというコメントに、皆さんへ元気を届けたくて朝も配信していると話しました。自分も皆さんと話して元気になったと伝えました。" },
    { timestamp: "0:32:43", title: "初めましての皆さんへ", body: "初めて来た方に向けて、ミスサークルコンテストへの出場とラジオパーソナリティの活動を自己紹介しました。配信を楽しんで、次にも会いに来てほしいと呼びかけました。" },
    { timestamp: "0:34:14", title: "ラジオはウェブでも", body: "湘南マジックウェイブの「湘南シーサイドサークル」を紹介し、ウェブでも聴けると案内。配信時点では次の日曜日のテーマが映画で、メッセージを送ってほしいと話しました。" },
    { timestamp: "0:47:49", title: "もう一つの挑戦への応援", body: "もう一つのコンテストで行われているPaton投票への協力を呼びかけました。詳しい案内は自身のSNSに載せていると伝え、応援に感謝しました。" },
    { timestamp: "0:49:01", title: "素敵な一日になりますように", body: "今日も一日頑張ろうと呼びかけ、元気をチャージできたかなと皆さんに尋ねました。素敵な一日になったら、次の配信で報告してほしいと送り出しました。" },
  ],
  goals: [{ item: "朝の配信", target: "元気を届ける", statusThen: "声と会話で応援" }],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:59", label: "声が届いているか確認" },
    { timestamp: "0:01:40", label: "ラジオ配信で始まった朝" },
    { timestamp: "0:08:03", label: "Paton投票への呼びかけ" },
    { timestamp: "0:11:49", label: "二回目の訪問への感謝" },
    { timestamp: "0:12:18", label: "たくさんのコメントに感謝" },
    { timestamp: "0:14:39", label: "次の配信でも会いたい" },
    { timestamp: "0:29:16", label: "朝から元気を届ける思い" },
    { timestamp: "0:32:43", label: "初めての皆さんへ自己紹介" },
    { timestamp: "0:34:14", label: "ラジオの聴き方と映画のテーマ" },
    { timestamp: "0:45:36", label: "ランキング読み上げ" },
    { timestamp: "0:47:23", label: "次の配信は20時の案内" },
    { timestamp: "0:47:49", label: "投票への協力とSNSの案内" },
    { timestamp: "0:49:01", label: "一日の始まりへのエール" },
  ],
  nextNote: "配信時点では、次の配信は当日20時と案内していました。ファンルームでも告知すると話していました。",
  sourceLabel: "2026年8月28日 SHOWROOM朝配信（オーナー提供録画の自動文字起こし）", verifiedAt: "2026-09-08",
  transcriptionNote: buildTranscriptionNote({ material: AUTO_TRANSCRIPT_MATERIAL_NOTE, stills: "静止画はラジオ配信に表示された写真を、当該録画の実フレームから1枚掲載しています。同じ写真で枚数を増やしていません。", extra: "録画の記録時刻を概数で表示しています。実際の配信開始時刻との一致は未確認です。" }),
};
