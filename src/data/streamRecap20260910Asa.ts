import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE_WITHOUT_RANGE } from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b95-01-cheek-smile.jpg", width: 640, height: 360, alt: "9月10日の朝配信、黒いトップス姿で頬に指を添えて笑うみりぃ", caption: "頬に指を添えて笑顔", downloadName: "みりぃ_20260910朝_01.jpg" },
  { src: "/media/live/mily-b95-02-gentle-talk.jpg", width: 640, height: 360, alt: "9月10日の朝配信、頬に手を添えて話すみりぃ", caption: "頬に手を添えて", downloadName: "みりぃ_20260910朝_02.jpg" },
  { src: "/media/live/mily-b95-03-bright-smile.jpg", width: 640, height: 360, alt: "9月10日の朝配信、正面を向いて笑顔を見せるみりぃ", caption: "正面の笑顔", downloadName: "みりぃ_20260910朝_03.jpg" },
  { src: "/media/live/mily-b95-04-three-fingers.jpg", width: 640, height: 360, alt: "9月10日の朝配信、指を三本立ててポーズをするみりぃ", caption: "指を三本立てて", downloadName: "みりぃ_20260910朝_04.jpg" },
  { src: "/media/live/mily-b95-05-wave-smile.jpg", width: 640, height: 360, alt: "9月10日の朝配信、笑顔で手を振るみりぃ", caption: "笑顔で手を振って", downloadName: "みりぃ_20260910朝_05.jpg" },
  { src: "/media/live/mily-b95-06-double-point.jpg", width: 640, height: 360, alt: "9月10日の朝配信、両手の人差し指を立てるみりぃ", caption: "両手の人差し指を立てて", downloadName: "みりぃ_20260910朝_06.jpg" },
  { src: "/media/live/mily-b95-07-hand-curve.jpg", width: 640, height: 360, alt: "9月10日の朝配信、頬の横で手を丸く添えるみりぃ", caption: "頬の横で手を丸く", downloadName: "みりぃ_20260910朝_07.jpg" },
  { src: "/media/live/mily-b95-08-hair-smile.jpg", width: 640, height: 360, alt: "9月10日の朝配信、髪に手を添えながら笑うみりぃ", caption: "髪に手を添えて笑顔", downloadName: "みりぃ_20260910朝_08.jpg" },
];

export const streamRecap20260910Asa: StreamRecap = {
  id: "2026-09-10-asa-showroom",
  date: "2026-09-10",
  dateLabel: "2026.09.10（木）",
  theme: "朝の歌と支え合う気持ち",
  broadcastLabel: "7:09頃〜 約60分",
  platformLabel: "SHOWROOM",
  summary: "朝から歌を届け、ラジオ制作や日常の話題で交流しました。三次審査への応援を呼びかけながら、コメントを通じて気持ちを伝え合い、支え合っていきたいという思いを話しました。",
  image: approvedStills[4],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b95-morning-stills.zip", filename: "みりぃ_20260910朝_スクショ8枚.zip", label: "8枚まとめて保存" },
  songs: [
    { title: "ケセラセラ", artist: "Mrs. GREEN APPLE", timestamp: "0:08:02", youtubeUrl: "https://www.youtube.com/watch?v=Jy-QS27q7lA" },
    { title: "かわいいだけじゃだめですか？", artist: "CUTIE STREET", timestamp: "0:20:15", youtubeUrl: "https://www.youtube.com/watch?v=jZqTz1G8G04" },
  ],
  highlights: [
    {
      timestamp: "0:05:00",
      title: "相手に届く言葉選び",
      body: "言葉を相手がどう受け取るかを考えることの大切さを話しました。初めて接する相手とのやり取りにも触れました。",
    },
    {
      timestamp: "0:08:02",
      title: "朝に届ける歌",
      body: "「ケセラセラ」を歌い、続いて「かわいいだけじゃだめですか？」も披露しました。歌唱後には、朝から元気になれたかと呼びかけました。",
    },
    {
      timestamp: "0:26:49",
      title: "自分のペースで元気に",
      body: "元気を届けたいと話す一方で、無理に元気になる必要はないとも伝えました。それぞれのペースを大切にする言葉を届けました。",
    },
    {
      timestamp: "0:27:56",
      title: "学生でつくるラジオ",
      body: "学生が運営するラジオ番組での活動を紹介しました。届いたメールをどう読み、どう答えるかを考える楽しさを話しました。",
    },
    {
      timestamp: "0:31:29",
      title: "朝ごはんの話",
      body: "何を食べようかという話から、シチューとご飯を一緒に食べるかという話題へ。食べ方の違いについてやり取りしました。",
    },
    {
      timestamp: "0:36:34",
      title: "三次通過を第一の目標に",
      body: "アバター権を目指しつつ、三次審査の通過が一番の目標だと話しました。無理を求めず、少しずつの応援が力になることを伝えました。",
    },
    {
      timestamp: "0:51:52",
      title: "会話を通じて支え合う",
      body: "一人だけに頑張ってもらうのではなく、いろいろな人と話したいと伝えました。お互いの気持ちを共有し、支え合っていきたいと話しました。",
    },
  ],
  goals: [
    { item: "三次審査", target: "通過", statusThen: "第一の目標と説明" },
    { item: "アバター権", target: "獲得", statusThen: "無理のない応援を希望" },
    { item: "WEB投票", target: "毎日の応援", statusThen: "投票方法を案内" },
  ],
  ranking: [RANKING_NOTE_WITHOUT_RANGE],
  timeline: [
    { timestamp: "0:05:00", label: "言葉選びと相手への伝わり方" },
    { timestamp: "0:08:02", label: "ケセラセラの歌唱" },
    { timestamp: "0:15:25", label: "洋服と朝の涼しさ" },
    { timestamp: "0:20:15", label: "かわいいだけじゃだめですか？の歌唱" },
    { timestamp: "0:26:49", label: "無理せず自分のペースで" },
    { timestamp: "0:27:56", label: "ラジオの制作とメールの楽しさ" },
    { timestamp: "0:31:29", label: "朝ごはんとシチューの話" },
    { timestamp: "0:34:12", label: "WEB投票の呼びかけ" },
    { timestamp: "0:35:02", label: "夜枠の予定と変更の可能性" },
    { timestamp: "0:36:34", label: "三次通過とアバター権への思い" },
    { timestamp: "0:42:16", label: "滑舌練習の話" },
    { timestamp: "0:49:47", label: "ランキングの読み上げ" },
    { timestamp: "0:51:52", label: "コメントと支え合う気持ち" },
    { timestamp: "0:59:01", label: "夜枠の再案内と締めのあいさつ" },
  ],
  nextNote: "配信時点では、同日夜は23時開始予定で、変更の可能性があるため改めて案内すると伝えていました。現在の配信予定を示すものではありません。",
  sourceLabel: "2026年9月10日 SHOWROOM朝配信（オーナー提供録画の自動文字起こしを照合）",
  verifiedAt: "2026-09-10",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム8枚を掲載しています。",
    extra: "開始表示は録画開始07:09:16を丸めた目安で、実際の配信開始とは区別しています。約60分は録画約59分30秒を丸めた長さです。7時頃の配信検知記録との差から、冒頭約9分が含まれない可能性があります。未収録部分は推測していません。各時刻は録画先頭からの目安です。完了済みの自動文字起こし全814区間を読み、曖昧な7区間だけ局所再認識し、本文作成時は実フレーム4場面を照合し、掲載用スクショは別途録画全体を概観して選定しました。歌唱時刻には数秒程度の認識揺れがあります。短い口ずさみは曲名を確定せず、歌リストに含めていません。ランキングは数字に認識揺れがあるため、読み上げの事実だけを記録しています。",
  }),
};
