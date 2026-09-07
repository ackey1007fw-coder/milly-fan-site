import type { StreamRecap } from "./streamRecaps.ts";
import {
  buildTranscriptionNote,
  RANKING_NOTE,
  SINGLE_STILL_NOTE,
  streamRecapRadioStill,
  VIDEO_MATERIAL_NOTE,
} from "./streamRecapRules.ts";

/**
 * 2026年9月2日のSHOWROOM朝配信を、オーナー提供の動画で確認した配信メモ。
 * 録音音声・全文文字起こし・画面録画は公開しない。
 * 配信中の静止画は録画の実フレームを1枚だけ掲載する。朝と夜で同じ1枚を共有する。
 * LIVE STREAM の配信カード専用で、Gallery の media.ts には載せない。
 */
export const streamRecap20260902: StreamRecap = {
  id: "2026-09-02-morning-showroom",
  date: "2026-09-02",
  dateLabel: "2026.09.02（水）",
  theme: "朝のラジオ配信",
  broadcastLabel: "9:02頃〜 約62分",
  platformLabel: "SHOWROOM",
  summary:
    "三次審査を翌日に控えた朝のラジオ配信。初見向けに三橋莉子（みりぃ）として自己紹介し、配信を始めた理由や「みんなの太陽になりたい」という思いを語りました。花束、通学、将来のことなど身近な話題を交えながら、三次審査に向けて無理をしすぎず、自分の本音と向き合う時間を届けた回です。",
  image: streamRecapRadioStill,
  highlights: [
    {
      timestamp: "0:06:41",
      title: "花束とドライフラワー",
      body:
        "7月後半にもらった花束を部屋に飾っていたものの、枯らしてしまったと話しました。花をもらうことは別格にうれしい一方、贈るならドライフラワーにしてほしいと上欄を交えました。",
      quote: "私にお花を渡したい時は全部ドライフラワーにしてから私にください",
    },
    {
      timestamp: "0:16:57",
      title: "初見向け自己紹介と「みんなの太陽」",
      body:
        "MISS CIRCLE CONTEST出場中の三橋莉子と自己紹介。みりぃと呼んでもらっていることや、翌日から三次審査が始まることを案内し、自信を届けられる存在になりたいと語りました。",
      quote: "みんなの太陽になりたい",
    },
    {
      timestamp: "0:27:09",
      title: "9月の目標",
      body:
        "アバター権の獲得、フォロワー300人、ファンマーク5人などを目標に設定。ファンマークを付けていなくても応援してくれる人がいることを分かっているので、無理に求めたくないという気持ちも話しました。",
    },
    {
      timestamp: "0:30:59",
      title: "無理をしすぎず、体調と相談",
      body:
        "三次審査に向けて気合を入れつつも、無理が過ぎると上手くいかなくなるので、体調と相談して調整したいと話しました。通学に約2時間かかることや、電車で動画編集・読書・英単語の勉強をすることも紹介しました。",
    },
    {
      timestamp: "0:43:38",
      title: "将来と本音を見つめ直す",
      body:
        "アナウンサーの勉強をしながら、将来について一度立ち止まり、本当にやりたいことや覚悟を見つめ直していると語りました。配信は自分の本心を探る時間でもあると話しました。",
    },
    {
      timestamp: "0:50:18",
      title: "未完成の作品として",
      body:
        "自分の人生の歩みを一緒に追いかけてほしい、まだ未完成でこれから作り上がっていく作品として見てほしいと呼びかけました。",
      quote: "一つの作品として私を見てほしい",
    },
    {
      timestamp: "0:52:20",
      title: "みんなと見に行きたい景色",
      body:
        "三次審査では楽しめる配信にし、もっと自分を知ってもらいたいと話した上で、みんなと一緒にいい景色を見に行きたいと語りました。",
      quote: "みんなと一緒にいい景色を見に行きます。絶景を。みんなが涙する景色を見に行きます",
    },
    {
      timestamp: "1:00:05",
      title: "初見リスナーを歓迎",
      body:
        "終盤に訪れた初見リスナーを歓迎。うれしさで泣きそうと話し、次回は顔出し配信でも会いたいと案内しました。",
      quote: "なんか今ね、うれしくて本当に泣きそう",
    },
  ],
  goals: [
    { item: "アバター権", target: "獲得", statusThen: "未獲得" },
    { item: "フォロワー", target: "300人", statusThen: "251人" },
    { item: "ファンマーク", target: "5人", statusThen: "2人" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:00", label: "朝のラジオ配信。寝具や花束の話からスタート" },
    { timestamp: "0:06:41", label: "花束を枯らしてしまった話。ドライフラワー希望" },
    { timestamp: "0:16:57", label: "初見向け自己紹介。三次審査と自信の話" },
    { timestamp: "0:18:55", label: "みんなの太陽になりたいという思い" },
    { timestamp: "0:27:09", label: "9月の目標と応援への考え方" },
    { timestamp: "0:30:59", label: "体調と相談しながら三次審査へ" },
    { timestamp: "0:33:22", label: "通学時間と電車での過ごし方" },
    { timestamp: "0:41:30", label: "毎日配信を始めて33日目" },
    { timestamp: "0:43:38", label: "将来と自分の本音を見つめ直す話" },
    { timestamp: "0:50:18", label: "未完成の作品として見てほしいという思い" },
    { timestamp: "0:52:20", label: "みんなと一緒に見に行きたい景色" },
    { timestamp: "0:57:26", label: "ランキング読み上げと次回配信の案内" },
    { timestamp: "1:00:05", label: "初見リスナーを歓迎。顔出し配信も案内" },
    { timestamp: "1:02:01", label: "今日も一日頑張ろうと締めくくり" },
  ],
  nextNote:
    "配信時点では、同日9月2日 14:40〜の短め枠（お昼またぎ・投げ逃げ歓迎）と、夜枠もやるつもり、と案内していました。夜枠の時刻は、この配信では未確定でした。",
  sourceLabel: "2026年9月2日 SHOWROOM朝配信（動画確認・オーナー提供）",
  verifiedAt: "2026-09-03",
  transcriptionNote: buildTranscriptionNote({
    material: VIDEO_MATERIAL_NOTE,
    stills: SINGLE_STILL_NOTE,
    extra: "固有名詞・コメント名・一部の目標数値は聞き取りが不明瞭なため掲載していません。",
  }),
};
