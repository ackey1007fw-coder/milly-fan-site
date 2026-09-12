import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  RANKING_NOTE,
  buildTranscriptionNote,
} from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b99-01-board-smile.jpg", width: 640, height: 360, alt: "9月12日の朝配信、手書きの目標ボードを持って笑うみりぃ", caption: "目標ボードと笑顔", downloadName: "みりぃ_20260912朝_01.jpg" },
  { src: "/media/live/mily-b99-02-cheek-smile.jpg", width: 640, height: 360, alt: "9月12日の朝配信、頬に両手を添えて笑うみりぃ", caption: "頬に手を添えて", downloadName: "みりぃ_20260912朝_02.jpg" },
  { src: "/media/live/mily-b99-03-forehead-hands.jpg", width: 640, height: 360, alt: "9月12日の朝配信、額の近くに両手を添えて話すみりぃ", caption: "額に手を添えて", downloadName: "みりぃ_20260912朝_03.jpg" },
  { src: "/media/live/mily-b99-04-bright-smile.jpg", width: 640, height: 360, alt: "9月12日の朝配信、カメラに向かって明るく笑うみりぃ", caption: "正面の明るい笑顔", downloadName: "みりぃ_20260912朝_04.jpg" },
  { src: "/media/live/mily-b99-05-close-smile.jpg", width: 640, height: 360, alt: "9月12日の朝配信、カメラに近づいてやわらかく笑うみりぃ", caption: "近くでやわらかな笑顔", downloadName: "みりぃ_20260912朝_05.jpg" },
  { src: "/media/live/mily-b99-06-double-fist-pose.jpg", width: 640, height: 360, alt: "9月12日の朝配信、両手を軽く握ってポーズをするみりぃ", caption: "両手で元気なポーズ", downloadName: "みりぃ_20260912朝_06.jpg" },
  { src: "/media/live/mily-b99-07-wave-smile.jpg", width: 640, height: 360, alt: "9月12日の朝配信、笑顔で手を振るみりぃ", caption: "笑顔で手を振って", downloadName: "みりぃ_20260912朝_07.jpg" },
  { src: "/media/live/mily-b99-08-gentle-smile.jpg", width: 640, height: 360, alt: "9月12日の朝配信、正面を向いて穏やかに笑うみりぃ", caption: "終盤の穏やかな笑顔", downloadName: "みりぃ_20260912朝_08.jpg" },
];

export const streamRecap20260912Asa: StreamRecap = {
  id: "2026-09-12-asa-showroom",
  date: "2026-09-12",
  dateLabel: "2026.09.12（土）",
  theme: "朝の最終日と3曲のエール",
  broadcastLabel: "8:00頃〜 約40分",
  platformLabel: "SHOWROOM",
  summary: "三次審査のSHOWROOM最終日を迎え、三次通過とアバター権獲得を目標に応援を呼びかけました。朝から3曲を歌い、夜の最終枠へ向けてみんなと気持ちを一つにしました。",
  image: approvedStills[3],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b99-morning-stills.zip", filename: "みりぃ_20260912朝_スクショ8枚.zip", label: "8枚まとめて保存" },
  songs: [
    {
      title: "拝啓、少年よ", artist: "Hump Back", timestamp: "0:15:38", youtubeUrl: "https://www.youtube.com/watch?v=d6i4AtCxrDo",
      clip: { src: "/media/live-clips/mily-b100-01-haikei-shounenyo.mp4", poster: "/media/live-clips/mily-b100-01-haikei-shounenyo-poster.jpg", width: 640, height: 360, durationSeconds: 24, sourceTimestamp: "0:17:35" },
    },
    {
      title: "好きすぎて滅！", artist: "M!LK", timestamp: "0:23:13", youtubeUrl: "https://www.youtube.com/watch?v=ZVUxJsPfoX8",
      clip: { src: "/media/live-clips/mily-b100-02-sukisugite-metsu.mp4", poster: "/media/live-clips/mily-b100-02-sukisugite-metsu-poster.jpg", width: 640, height: 360, durationSeconds: 24, sourceTimestamp: "0:23:55" },
    },
    {
      title: "Lovers", artist: "sumika", timestamp: "0:33:21", youtubeUrl: "https://www.youtube.com/watch?v=FFITBgsyVr4",
      clip: { src: "/media/live-clips/mily-b100-03-lovers.mp4", poster: "/media/live-clips/mily-b100-03-lovers-poster.jpg", width: 640, height: 360, durationSeconds: 24, sourceTimestamp: "0:35:38" },
    },
  ],
  highlights: [
    {
      timestamp: "0:01:03",
      title: "最終日の目標ボード",
      body: "三次審査の最終日を迎え、三次通過とアバター権獲得を目標として掲げました。",
    },
    {
      timestamp: "0:10:30",
      title: "投票への呼びかけ",
      body: "朝から投票への感謝を伝え、応援を続けてもらえたら嬉しいと呼びかけました。",
    },
    {
      timestamp: "0:13:58",
      title: "アバター権へもう一歩",
      body: "アバター権獲得を目指し、一人ひとりの応援が大切になると話しました。",
    },
    {
      timestamp: "0:15:38",
      title: "朝を動かす「拝啓、少年よ」",
      body: "朝から元気を届けたいとHump Back「拝啓、少年よ」を歌いました。歌詞を重視して曲を覚えるとも話しました。",
    },
    {
      timestamp: "0:23:13",
      title: "好きな曲でもっと元気に",
      body: "気持ちが高まったところでM!LK「好きすぎて滅！」を歌い、朝の枠をさらに盛り上げました。",
    },
    {
      timestamp: "0:28:55",
      title: "最終日に向けた二つの目標",
      body: "三次通過を第一の目標としながら、アバター権も獲得したいと改めて伝えました。",
    },
    {
      timestamp: "0:33:21",
      title: "みんなへ届ける「Lovers」",
      body: "応援してくれる人たちへ気持ちを届けるように、sumika「Lovers」を朝枠の最後に歌いました。",
    },
    {
      timestamp: "0:39:03",
      title: "みんなの力を一つに",
      body: "ランキングの読み上げを終え、みんなの力が一つになったように感じたと話し、夜の最終枠へ気持ちをつなぎました。",
    },
  ],
  goals: [
    { item: "三次審査", target: "通過", statusThen: "第一の目標と説明" },
    { item: "アバター権", target: "獲得", statusThen: "獲得へ応援を希望" },
    { item: "WEB投票", target: "投票の継続", statusThen: "朝も呼びかけ" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:01:03", label: "手書きの目標ボードを紹介" },
    { timestamp: "0:10:30", label: "投票への感謝と呼びかけ" },
    { timestamp: "0:13:58", label: "アバター権獲得への応援をお願い" },
    { timestamp: "0:15:15", label: "朝の一曲目を紹介" },
    { timestamp: "0:15:38", label: "「拝啓、少年よ」を歌唱" },
    { timestamp: "0:18:43", label: "歌詞を大切にする話" },
    { timestamp: "0:22:51", label: "好きな曲を歌うと予告" },
    { timestamp: "0:23:13", label: "「好きすぎて滅！」を歌唱" },
    { timestamp: "0:28:55", label: "三次審査最終日と二つの目標" },
    { timestamp: "0:30:08", label: "WEB投票を忘れずにと呼びかけ" },
    { timestamp: "0:32:12", label: "朝枠のラストナンバーを紹介" },
    { timestamp: "0:33:21", label: "「Lovers」を歌唱" },
    { timestamp: "0:37:05", label: "朝に3曲歌えた喜びと第一目標" },
    { timestamp: "0:37:49", label: "13位から1位のランキング読み上げ" },
    { timestamp: "0:39:21", label: "みんなの力が一つになったと感謝" },
    { timestamp: "0:39:28", label: "夜の最終枠を案内して締め" },
  ],
  nextNote: "配信時点では、同日夜に22時までの約1時間20分の最終枠を行うと案内していました。開始時刻は明瞭に確認できていません。",
  sourceLabel: "2026年9月12日 SHOWROOM朝配信（オーナー提供録画の自動文字起こしと実フレームを照合）",
  verifiedAt: "2026-09-12",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム8枚を掲載しています。",
    extra: "開始表示は録画開始08:00:34を分単位の目安として示し、約40分はメディア実測40分28.838秒を丸めた長さです。各時刻は録画先頭からの目安です。自動文字起こし全988区間を読み、目標・3曲の歌唱・終盤案内を含む5区間を局所再認識して照合しました。全編手動聴取は実施していません。アバター権までの残りポイントは配信中に変化しており、認識結果にも揺れがあるため本文では固定値を掲載していません。録画全体を概観し、第三者やコメント欄が写らない実フレーム8枚を選定しました。夜の最終枠は22時まで・約1時間20分と確認できましたが、開始時刻の時の部分は明瞭に確認できないため記載していません。",
  }),
};
