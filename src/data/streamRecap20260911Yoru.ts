import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b98-01-opening-smile.jpg", width: 640, height: 360, alt: "9月11日の夜配信、両手を顔の近くに添えて笑顔を見せるみりぃ", caption: "両手を添えて笑顔", downloadName: "みりぃ_20260911夜_01.jpg" },
  { src: "/media/live/mily-b98-02-hands-together-smile.jpg", width: 640, height: 360, alt: "9月11日の夜配信、手を合わせながら笑うみりぃ", caption: "手を合わせてにっこり", downloadName: "みりぃ_20260911夜_02.jpg" },
  { src: "/media/live/mily-b98-03-hair-talk.jpg", width: 640, height: 360, alt: "9月11日の夜配信、髪に手を添えながら話すみりぃ", caption: "髪に手を添えて", downloadName: "みりぃ_20260911夜_03.jpg" },
  { src: "/media/live/mily-b98-04-wide-eye-smile.jpg", width: 640, height: 360, alt: "9月11日の夜配信、目を大きく開いて笑顔を見せるみりぃ", caption: "目を大きく開いて笑顔", downloadName: "みりぃ_20260911夜_04.jpg" },
  { src: "/media/live/mily-b98-05-cheek-laugh.jpg", width: 640, height: 360, alt: "9月11日の夜配信、頬に手を添えて楽しそうに笑うみりぃ", caption: "頬に手を添えて笑顔", downloadName: "みりぃ_20260911夜_05.jpg" },
  { src: "/media/live/mily-b98-06-bright-smile.jpg", width: 640, height: 360, alt: "9月11日の夜配信、カメラに近づいて明るく笑うみりぃ", caption: "カメラに向かって明るい笑顔", downloadName: "みりぃ_20260911夜_06.jpg" },
  { src: "/media/live/mily-b98-07-playful-hands.jpg", width: 640, height: 360, alt: "9月11日の夜配信、両手を顔の横に広げてポーズをするみりぃ", caption: "両手を広げたポーズ", downloadName: "みりぃ_20260911夜_07.jpg" },
  { src: "/media/live/mily-b98-08-soft-smile.jpg", width: 640, height: 360, alt: "9月11日の夜配信、正面を向いてやわらかく笑うみりぃ", caption: "終盤のやわらかな笑顔", downloadName: "みりぃ_20260911夜_08.jpg" },
];

export const streamRecap20260911Yoru: StreamRecap = {
  id: "2026-09-11-yoru-showroom",
  date: "2026-09-11",
  dateLabel: "2026.09.11（金）",
  theme: "夜の再会と明日への一曲",
  broadcastLabel: "22:32頃〜 約34分",
  platformLabel: "SHOWROOM",
  summary: "前夜に予定していた配信ができなかったことをあらためて詫び、集まった人たちとの会話を楽しみました。SHOWROOM審査の最終日を翌日に控え、SHISHAMO「明日も」を歌い、応援への感謝と最後まで駆け抜ける思いを伝えました。",
  image: approvedStills[5],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b98-night-stills.zip", filename: "みりぃ_20260911夜_スクショ8枚.zip", label: "8枚まとめて保存" },
  songs: [
    {
      title: "明日も",
      artist: "SHISHAMO",
      timestamp: "0:26:19",
      youtubeUrl: "https://www.youtube.com/watch?v=zhCtzmDWsN0",
      clip: {
        src: "/media/live-clips/mily-b102-01-ashitamo.mp4",
        poster: "/media/live-clips/mily-b102-01-ashitamo-poster.jpg",
        width: 640, height: 360, durationSeconds: 24, sourceTimestamp: "0:27:26",
      },
    },
  ],
  highlights: [
    {
      timestamp: "0:02:19",
      title: "前夜の枠をあらためて謝罪",
      body: "前夜に予定していた配信ができなかったことを詫び、待ってくれた人たちへ何度も感謝を伝えました。",
    },
    {
      timestamp: "0:07:48",
      title: "次のラジオの話題",
      body: "次のラジオでは、一人で過ごすときの話をしてみたいと話しました。一人で行動するのも好きだと紹介しました。",
    },
    {
      timestamp: "0:12:04",
      title: "会話を大切にしたい気持ち",
      body: "配信ではみんなと会話をしたいと伝えました。コメントを受けながら、いろいろな話題で軽快なやり取りが続きました。",
    },
    {
      timestamp: "0:18:00",
      title: "優しさを次の力に",
      body: "集まった人たちの優しさへ感謝し、その気持ちを受けて、もっと配信していきたいと思ったと話しました。",
    },
    {
      timestamp: "0:20:44",
      title: "三次審査と最終日の案内",
      body: "MISS CIRCLE CONTESTの三次審査中で、SHOWROOM審査は翌日が最終日になると説明しました。",
    },
    {
      timestamp: "0:26:19",
      title: "明日に向けた「明日も」",
      body: "翌日の最終日に向けて、SHISHAMO「明日も」を選んで歌いました。三次審査突破への決意も言葉にしました。",
    },
    {
      timestamp: "0:31:59",
      title: "応援が頑張る力に",
      body: "うまくいかないことがあっても自分なりに頑張ろうと思えたのは、みんなの応援のおかげだと感謝を伝えました。",
    },
  ],
  goals: [
    { item: "三次審査", target: "突破", statusThen: "突破への決意" },
    { item: "配信審査", target: "最終日完走", statusThen: "翌日が最終日と案内" },
    { item: "WEB投票", target: "13日まで", statusThen: "13日までと案内" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:02", label: "夜枠のスタートと再会のあいさつ" },
    { timestamp: "0:02:19", label: "前夜の配信について謝罪" },
    { timestamp: "0:07:48", label: "次のラジオで話したいこと" },
    { timestamp: "0:12:04", label: "会話を大切にしたい気持ち" },
    { timestamp: "0:14:23", label: "コミュニティFMの活動紹介" },
    { timestamp: "0:18:00", label: "優しさへの感謝と次への力" },
    { timestamp: "0:20:44", label: "三次審査とSHOWROOM審査最終日の案内" },
    { timestamp: "0:22:24", label: "初期アバターとアバター権の話" },
    { timestamp: "0:24:26", label: "歌いたい曲を選ぶ時間" },
    { timestamp: "0:26:19", label: "SHISHAMO「明日も」の歌唱" },
    { timestamp: "0:31:42", label: "最終日に向けた決意" },
    { timestamp: "0:31:59", label: "応援への感謝" },
    { timestamp: "0:32:09", label: "13位から1位のランキング読み上げ" },
    { timestamp: "0:33:02", label: "WEB投票と配信審査の期間を説明" },
    { timestamp: "0:33:20", label: "翌朝8時の次枠を案内" },
    { timestamp: "0:33:39", label: "締めのあいさつ" },
  ],
  nextNote: "配信時点では、翌9月12日朝8時から次枠を始めると案内し、SHOWROOM審査の最終日を駆け抜けたいと話していました。現在の配信予定を示すものではありません。",
  sourceLabel: "2026年9月11日 SHOWROOM夜配信（オーナー提供録画の自動文字起こしと実フレームを照合）",
  verifiedAt: "2026-09-12",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム8枚を掲載しています。",
    extra: "開始表示は録画開始22:32:10を丸めた目安で、約34分はメディア実測33分45.674秒を丸めた長さです。録画の全編収録は確認できていないため、実際の配信全体の開始・終了・尺とは区別しています。各時刻は録画先頭からの目安です。自動文字起こし全1,142区間を読み、三次審査・歌唱前・終盤案内の3区間だけ局所再認識して照合しました。録画全体の実フレームを概観し、第三者やコメント欄が写らない8枚を選定しています。",
  }),
};
