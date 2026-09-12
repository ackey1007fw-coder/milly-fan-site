import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  RANKING_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b111-01-makeup-start.jpg", width: 640, height: 360, alt: "9月13日の朝配信、メイクを始めながら笑顔でカメラを見るみりぃ", caption: "メイク配信の始まりに笑顔", downloadName: "みりぃ_20260913朝_01.jpg" },
  { src: "/media/live/mily-b111-02-makeup-talk.jpg", width: 640, height: 360, alt: "9月13日の朝配信、メイクを進めながらカメラへ話しかけるみりぃ", caption: "朝のトークをしながら", downloadName: "みりぃ_20260913朝_02.jpg" },
  { src: "/media/live/mily-b111-03-eye-tool-smile.jpg", width: 640, height: 360, alt: "9月13日の朝配信、目元のメイク道具を手に笑うみりぃ", caption: "目元メイクの途中でにっこり", downloadName: "みりぃ_20260913朝_03.jpg" },
  { src: "/media/live/mily-b111-04-eye-makeup.jpg", width: 640, height: 360, alt: "9月13日の朝配信、鏡を見ながら目元を丁寧にメイクするみりぃ", caption: "鏡を見ながら目元を仕上げて", downloadName: "みりぃ_20260913朝_04.jpg" },
  { src: "/media/live/mily-b111-05-makeup-finished-smile.jpg", width: 640, height: 360, alt: "9月13日の朝配信、メイクが進み笑顔で両手を振るみりぃ", caption: "笑顔で手を振って", downloadName: "みりぃ_20260913朝_05.jpg" },
  { src: "/media/live/mily-b111-06-bright-close-smile.jpg", width: 640, height: 360, alt: "9月13日の朝配信、髪も整えてカメラの近くで明るく笑うみりぃ", caption: "支度が進んで明るい笑顔", downloadName: "みりぃ_20260913朝_06.jpg" },
  { src: "/media/live/mily-b111-07-ready-for-radio.jpg", width: 640, height: 360, alt: "9月13日の朝配信、ラジオへ向かう支度を整えて笑顔を見せるみりぃ", caption: "ラジオへ向かう準備が整って", downloadName: "みりぃ_20260913朝_07.jpg" },
  { src: "/media/live/mily-b111-08-double-peace.jpg", width: 640, height: 360, alt: "9月13日の朝配信、仕上がった姿で両手のピースを見せるみりぃ", caption: "最後は両手でピース", downloadName: "みりぃ_20260913朝_08.jpg" },
];

export const streamRecap20260913Asa: StreamRecap = {
  id: "2026-09-13-asa-showroom",
  date: "2026-09-13",
  dateLabel: "2026.09.13（日）",
  theme: "朝のメイクとラジオ支度",
  broadcastLabel: "6:00頃〜 約41分",
  platformLabel: "SHOWROOM",
  summary: "ラジオ本番へ向かう前、メイクをしながら朝のトーク。三次審査のWEB投票最終日を案内し、アバター権への祝福にはみんなのおかげと感謝。最後はランキングを読み上げ、元気にラジオへ向かいました。",
  image: approvedStills[6],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b111-morning-stills.zip", filename: "みりぃ_20260913朝_スクショ8枚.zip", label: "8枚まとめて保存" },
  highlights: [
    {
      timestamp: "0:00:19",
      title: "投票最終日の朝",
      body: "三次審査のWEB投票が最終日を迎え、朝早くから来てくれたみんなと最後の一日をスタートしました。",
    },
    {
      timestamp: "0:02:27",
      title: "ラジオ前のメイク配信",
      body: "このあとラジオのスタジオへ向かうため、支度をしながらメイク配信をすると案内しました。",
    },
    {
      timestamp: "0:04:15",
      title: "ラジオと今日のテーマ",
      body: "湘南シーサイドサークルのパーソナリティを務めることに触れ、この日のトークテーマ「ひとり○○」を紹介しました。",
    },
    {
      timestamp: "0:34:36",
      title: "アバター権へのありがとう",
      body: "アバター権への祝福を受け、みんなのおかげと感謝を伝えました。",
    },
    {
      timestamp: "0:35:34",
      title: "WEB投票は今日がラスト",
      body: "三次審査のWEB投票最終日だと改めて案内し、プロフィールやバナーから進む投票方法を説明しました。",
    },
    {
      timestamp: "0:36:35",
      title: "夜枠はまだ未定",
      body: "この日は夜にも配信できる可能性があるものの、状況を見て決めたいと話しました。",
    },
    {
      timestamp: "0:37:30",
      title: "このあとラジオへ",
      body: "配信後はラジオへ向かい、3時間話してくると元気に伝えました。",
    },
    {
      timestamp: "0:37:46",
      title: "ランキングと朝への感謝",
      body: "13位から1位までランキングを読み上げ、日曜の早朝に集まったみんなへ感謝を伝えました。",
    },
  ],
  goals: [
    { item: "WEB投票", target: "最終日", statusThen: "投票を呼びかけ" },
    { item: "アバター権", target: "獲得", statusThen: "祝福に感謝" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:19", label: "投票最終日の朝をスタート" },
    { timestamp: "0:02:27", label: "メイク配信を案内" },
    { timestamp: "0:04:15", label: "ラジオ番組と担当を紹介" },
    { timestamp: "0:04:48", label: "この日のトークテーマを紹介" },
    { timestamp: "0:15:28", label: "スタジオへ向かう前の支度" },
    { timestamp: "0:34:36", label: "アバター権への祝福に感謝" },
    { timestamp: "0:35:34", label: "三次審査WEB投票最終日を案内" },
    { timestamp: "0:36:35", label: "夜配信の可能性は未定と説明" },
    { timestamp: "0:37:30", label: "このあとラジオへ向かうと案内" },
    { timestamp: "0:37:46", label: "13位から1位のランキング読み上げ" },
    { timestamp: "0:40:15", label: "ラジオへ行ってきますで締め" },
  ],
  nextNote: "配信時点では、同日夜にも配信できる可能性はあるものの、状況を見て決めたいと話していました。",
  sourceLabel: "2026年9月13日 SHOWROOM朝配信（オーナー提供録画の自動文字起こしと実フレームを照合）",
  verifiedAt: "2026-09-13",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム8枚を掲載しています。",
    extra: "開始表示は録画開始06:00:28を分単位の目安として示し、約41分はメディア実測40分44.502秒を丸めた長さです。各時刻は録画先頭からの目安です。自動文字起こし全1,139区間を読み、メイク配信、ラジオの案内、WEB投票最終日、アバター権への感謝、終盤のランキングと次枠案内を確認しました。全編手動聴取は実施していません。細かな数字や固有名詞は認識揺れがあるため、確認できた範囲だけ本文に残しています。録画全体を概観し、第三者やコメント欄が写らない実フレーム8枚を選定しました。",
  }),
};
