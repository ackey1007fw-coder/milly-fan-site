import type { StreamRecap, StreamRecapImage } from "./streamRecaps.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, buildTranscriptionNote, RANKING_NOTE } from "./streamRecapRules.ts";

const approvedStills: StreamRecapImage[] = [
  { src: "/media/live/mily-b94-01-morning-smile.jpg", width: 640, height: 360, alt: "9月9日の朝配信、グレーのトップス姿のみりぃ。朝の笑顔", caption: "朝の笑顔", downloadName: "みりぃ_20260909朝_01.jpg" },
  { src: "/media/live/mily-b94-02-centered-smile.jpg", width: 640, height: 360, alt: "9月9日の朝配信、グレーのトップス姿のみりぃ。正面を向いて笑顔", caption: "正面を向いて笑顔", downloadName: "みりぃ_20260909朝_02.jpg" },
  { src: "/media/live/mily-b94-03-peace-sign.jpg", width: 640, height: 360, alt: "9月9日の朝配信、グレーのトップス姿のみりぃ。ピースサイン", caption: "ピースサイン", downloadName: "みりぃ_20260909朝_03.jpg" },
  { src: "/media/live/mily-b94-04-blue-flower.jpg", width: 640, height: 360, alt: "9月9日の朝配信、青い花の飾りを手に持つみりぃ", caption: "青い花の飾りを紹介", downloadName: "みりぃ_20260909朝_04.jpg" },
  { src: "/media/live/mily-b94-05-cheerful-talk.jpg", width: 640, height: 360, alt: "9月9日の朝配信、カメラに向かって笑顔で話すみりぃ", caption: "笑顔でおしゃべり", downloadName: "みりぃ_20260909朝_05.jpg" },
  { src: "/media/live/mily-b94-06-open-hand.jpg", width: 640, height: 360, alt: "9月9日の朝配信、手のひらを見せるみりぃ", caption: "手のひらを見せて", downloadName: "みりぃ_20260909朝_06.jpg" },
  { src: "/media/live/mily-b94-07-closing-smile.jpg", width: 640, height: 360, alt: "9月9日の朝配信、配信終盤に笑顔を見せるみりぃ", caption: "配信終盤の笑顔", downloadName: "みりぃ_20260909朝_07.jpg" },
  { src: "/media/live/mily-b94-08-sleeve-pose.jpg", width: 640, height: 360, alt: "9月9日の朝配信、袖を寄せてポーズをするみりぃ", caption: "袖を寄せてポーズ", downloadName: "みりぃ_20260909朝_08.jpg" },
];

export const streamRecap20260909Asa: StreamRecap = {
  id: "2026-09-09-asa-showroom",
  date: "2026-09-09",
  dateLabel: "2026.09.09（水）",
  theme: "朝のあいさつと好きな青",
  broadcastLabel: "7:43頃〜 約22分",
  platformLabel: "SHOWROOM",
  summary: "朝から訪れた人へ感謝を伝え、前夜の楽しかった配信を振り返りました。WEB投票を呼びかけ、好きな青色や大切に飾っている花も紹介。最後は夜枠の案内と、一日の応援で締めくくりました。",
  image: approvedStills[3],
  gallery: approvedStills,
  galleryZip: { src: "/media/live/mily-b94-morning-stills.zip", filename: "みりぃ_20260909朝_スクショ8枚.zip", label: "8枚まとめて保存" },
  highlights: [
    {
      timestamp: "0:00:16",
      title: "朝のあいさつ",
      body: "起きたばかりの朝、訪れた人たちを迎えました。短い枠の中でも、キラキラや投票の報告に感謝を伝えました。",
    },
    {
      timestamp: "0:03:24",
      title: "前夜の楽しかった配信",
      body: "前の夜の配信がとても楽しかったと振り返りました。たくさんの人が来て、見てくれたことを喜んでいました。",
    },
    {
      timestamp: "0:09:02",
      title: "今日のWEB投票",
      body: "今日の投票は済んだかと呼びかけました。届いた投票の報告や、朝からのキラキラにも繰り返しお礼を伝えました。",
    },
    {
      timestamp: "0:11:44",
      title: "初めて来た方へ自己紹介",
      body: "初めて来た人へ名前を伝え、みりぃと呼んでほしいと自己紹介しました。MISS CIRCLE CONTESTへの挑戦にも触れ、フォローを喜んでいました。",
    },
    {
      timestamp: "0:15:50",
      title: "好きな青色の話",
      body: "どんな青が好きかという問いに、濃い青が好きだと答えました。水色のハートも、ガラスのようでかわいいと話していました。",
    },
    {
      timestamp: "0:16:40",
      title: "大切に飾っている花",
      body: "青色の話から、先輩にもらった花の飾りを見せました。今も飾っていると話し、贈り物への感謝を伝えました。",
    },
    {
      timestamp: "0:21:40",
      title: "素敵な一日になりますように",
      body: "短い朝枠に来てくれたことと、投票の報告に感謝しました。みんなの一日が素敵な日になるよう願い、朝の配信を締めくくりました。",
    },
  ],
  goals: [
    { item: "WEB投票", target: "毎日の応援", statusThen: "投票を呼びかけ" },
    { item: "キラキラ", target: "朝の応援", statusThen: "感謝と呼びかけ" },
  ],
  ranking: [RANKING_NOTE],
  timeline: [
    { timestamp: "0:00:16", label: "朝のあいさつ" },
    { timestamp: "0:00:40", label: "キラキラの呼びかけ" },
    { timestamp: "0:03:24", label: "前夜の配信の振り返り" },
    { timestamp: "0:09:02", label: "今日の投票の呼びかけ" },
    { timestamp: "0:11:44", label: "初めての方への自己紹介" },
    { timestamp: "0:13:13", label: "ハートのポーズ" },
    { timestamp: "0:15:50", label: "好きな青色" },
    { timestamp: "0:16:40", label: "花の飾りの紹介" },
    { timestamp: "0:18:36", label: "ランキングの読み上げ" },
    { timestamp: "0:21:04", label: "夜枠の案内と変更の可能性" },
    { timestamp: "0:21:40", label: "一日の応援と締めのあいさつ" },
  ],
  nextNote: "配信時点では、同日夜は21時半開始予定で、後ろ倒しになる可能性があり、分かり次第連絡すると案内していました。現在の配信予定を示すものではありません。",
  sourceLabel: "2026年9月9日 SHOWROOM朝配信（オーナー提供録画の自動文字起こしを照合）",
  verifiedAt: "2026-09-09",
  transcriptionNote: buildTranscriptionNote({
    material: AUTO_TRANSCRIPT_MATERIAL_NOTE,
    stills: "静止画は録画の実フレーム8枚を掲載しています。",
    extra: "開始表示は録画開始記録を丸めた目安で、実際の配信開始時刻とは区別しています。約22分は確認できた録画の長さで、各時刻は録画先頭からの目安です。自動文字起こし全編と主要区間の再認識結果、映像の実フレームを照合しました。曲名を確定できない短いフレーズは歌リストに含めていません。",
  }),
};
