import { tiktokPortraitVideo } from "./tiktokPortraitVideo.ts";
/**
 * Latest updates. Keep this empty rather than filling unverified items.
 * The UI sorts a copy by date, then optional sameDayOrder. Unranked same-day
 * items keep their source-array order without inventing publication times.
 * How to add an item: docs/CONTENT-OPS.md
 *
 * - source: optional confirmed 出典 URL（「出典を見る」）
 * - sourceLabel: optional label. Without source, it renders as non-link text.
 * - additionalSources: optional extra confirmed source links for the same NEWS item
 * - url: optional. Only when it differs from source（「関連リンク」）
 * - media: optional self-hosted still/video/audio, or Mixch outbound player card
 * - additionalMedia: optional extra stills/videos on the same card. Lead stays `media`.
 * - ctaLabel: optional. href is url ?? source
 */
import type { ActivityId } from "./activities.ts";
import {
  campusGirlsPatonVoteLink,
  missCircleWebVoteLink,
} from "./links.ts";
import {
  eventStory20260821,
  morningOhayo20260821,
  morningStoryVideo,
  morningStory20260820,
} from "./morningStoryVideo.ts";
import { morningShowroomRunwayVideo } from "./morningShowroomRunwayVideo.ts";
import { morningMissCircleShowroomStoryVideo } from "./morningMissCircleShowroomStoryVideo.ts";
import { nightStoryB41Video } from "./nightStoryB41Video.ts";
import { patonVoteDay4StoryVideo } from "./patonVoteDay4StoryVideo.ts";
import { patonVoteDay5StoryVideo } from "./patonVoteDay5StoryVideo.ts";
import { campusGirlsHoldSecondStoryVideo } from "./campusGirlsHoldSecondStoryVideo.ts";
import { patonVoteFifteenXStoryVideo } from "./patonVoteFifteenXStoryVideo.ts";
import { patonVoteFirstPlaceStoryVideo } from "./patonVoteFirstPlaceStoryVideo.ts";
import { patonVoteVoiceStoryVideo } from "./patonVoteVoiceStoryVideo.ts";
import { patonVoteFinalDayStoryVideo } from "./patonVoteFinalDayStoryVideo.ts";
import { septemberMilyStoryVideo } from "./septemberMilyStoryVideo.ts";
import { oyasumilyStoryVideo } from "./oyasumilyStoryVideo.ts";
import { patonSecondStoryVideo } from "./patonSecondStoryVideo.ts";
import { ohayoSeptemberXVideo } from "./ohayoSeptemberXVideo.ts";
import { tiktokRadioVideo } from "./tiktokRadioVideo.ts";
import { tiktokSayonaraIchigoVideo } from "./tiktokSayonaraIchigoVideo.ts";
import { campusGirlsSecondStageResultImage } from "./campusGirlsSecondStageResultImage.ts";
import { campusGirlsPrelimFinalResultImage } from "./campusGirlsPrelimFinalResultImage.ts";
import { earthquakeSafetyStoryVideo } from "./earthquakeSafetyStoryVideo.ts";
import { nightThanksMorningStreamStoryVideo } from "./nightThanksMorningStreamStoryVideo.ts";
import { seasideCircleMusicalSpecialThanksVideo } from "./seasideCircleMusicalSpecialThanksVideo.ts";
import { seasideCircleYesTokyoVideo } from "./seasideCircleYesTokyoVideo.ts";
import { seasideCircleMovieThemeStoryVideo } from "./seasideCircleMovieThemeStoryVideo.ts";
import { morningMakeupShowroomImage } from "./morningMakeupShowroomImage.ts";
import { morningMakeupInstagramStoryImage } from "./morningMakeupInstagramStoryImage.ts";
import {
  mixchFinalDayMovie,
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  type MixchMovie,
} from "./mixchMovies.ts";
import {
  campusGirlsPatonPageImage,
  campusGirlsPatonPortraitImage,
} from "./campusGirlsPatonImages.ts";
import { patonVoteCollageStoryVideo } from "./patonVoteCollageStoryVideo.ts";
import { patonVoteMirrorStoryVideo } from "./patonVoteMirrorStoryVideo.ts";
import {
  patonVoteCollageStillImage,
  patonVoteMirrorStillImage,
} from "./patonVoteStoryStills.ts";
import { followers400StoryVideo } from "./followers400StoryVideo.ts";
import { morningStreamThanksInstagramStoryImage } from "./morningStreamThanksInstagramStoryImage.ts";
import { girlsawardShowroomSixthImage } from "./girlsawardShowroom6th.ts";
import {
  BIRTHDAY_INDOOR_SELFIE_X_URL,
  birthdayIndoorSelfieImage,
} from "./birthdayIndoorSelfie.ts";
import { girlAwardEventVoice } from "./girlAwardEventVoice.ts";
import {
  OHAYO_WHITE_POLO_X_URL,
  ohayoWhitePoloPeaceImage,
} from "./ohayoWhitePoloPeace.ts";
import { pandaPastPicImage } from "./pandaPastPic.ts";
import { eveningRadioShowroomImage } from "./eveningRadioShowroom.ts";
import { campusGirlsFinalStageFlyerImage } from "./campusGirlsFinalStageFlyer.ts";
import {
  campusGirlsFinalsExScheduleImage,
  campusGirlsFinalsExGuideImage,
} from "./campusGirlsFinalsExImages.ts";
import { secondRoundTimetableImage } from "./secondRoundTimetable.ts";
import { gandaBeforeNightStreamImage } from "./gandaBeforeNightStream.ts";
import { autumnLeafNewsImage } from "./autumnLeafNewsImage.ts";
import {
  firstSeptemberShowroomAdditionalMedia,
  firstSeptemberTomatoBoardImage,
} from "./firstSeptemberShowroomImages.ts";
import { thirdRoundTimetableImage } from "./thirdRoundTimetableImage.ts";
import { thirdRoundStoryAdditionalMedia } from "./thirdRoundStoryMedia.ts";
import { webVoteDay2StoryVideo } from "./webVoteDay2StoryVideo.ts";
import {
  PATON_VOTE_HOW_TO_CTA_LABEL,
  PATON_VOTE_HOW_TO_CTA_URL,
  PATON_VOTE_HOW_TO_NEWS_ID,
  PATON_VOTE_HOW_TO_SOURCE_LABEL,
  PATON_VOTE_HOW_TO_TITLE,
  PATON_VOTE_HOW_TO_X_URL,
  patonVoteHowToSpokenMessage,
} from "./patonVoteHowTo.ts";
import {
  MOVIE_NIGHT_INSTAGRAM_PROFILE_URL,
  MOVIE_NIGHT_INSTAGRAM_URL,
  movieNightNewsImages,
} from "./movieNightPhotos.ts";

export type NewsVideoMedia = {
  kind: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
};

/** Self-hosted still image that belongs to the post itself, not the Gallery. */
export type NewsImageMedia = {
  kind: "image";
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Optional Gallery-style srcset. Absent images keep a single `src`. */
  srcSet?: string;
  webpSrcSet?: string;
  sizes?: string;
};

/** Mixch outbound player. Distinct from self-hosted `kind: "video"` which has an mp4 `src`. */
export type NewsMixchMedia = MixchMovie;

/** Self-hosted Fan Room voice memo. Latest / NEWS only — not Gallery. */
export type NewsAudioMedia = {
  kind: "audio";
  src: string;
  mimeType: "audio/mp4";
  alt: string;
  label?: string;
};

export type NewsMedia =
  | NewsVideoMedia
  | NewsImageMedia
  | NewsMixchMedia
  | NewsAudioMedia;

export function isNewsAudio(media: NewsMedia): media is NewsAudioMedia {
  return media.kind === "audio";
}

export function newsMediaKey(media: NewsMedia): string {
  return media.kind === "mixch" ? `${media.kind}:${media.id}` : `${media.kind}:${media.src}`;
}

export type NewsMessage = {
  label?: string;
  text: string;
};

export type NewsSourceLink = {
  label: string;
  url: string;
};

export type NewsItem = {
  id: string;
  /** Display date, ISO `YYYY-MM-DD`. */
  date: string;
  /** Explicit editorial order within the same date. Higher values appear first. */
  sameDayOrder?: number;
  /** Explicit Activity relations only. Absence means deliberately unclassified. */
  activityIds?: ActivityId[];
  title: string;
  body: string;
  source?: string;
  sourceLabel?: string;
  additionalSources?: NewsSourceLink[];
  /** Related destination or CTA that is not evidence for this NEWS record. */
  relatedUrl?: string;
  url?: string;
  ctaLabel?: string;
  /** Extra action buttons. Support-event URLs are shown only in their confirmed window. */
  additionalCtas?: NewsSourceLink[];
  media?: NewsMedia;
  /** Extra stills/videos on the same NEWS card. Lead image stays `media`. */
  additionalMedia?: NewsMedia[];
  message?: NewsMessage;
};

export function newsDisplayMedia(item: NewsItem): NewsMedia[] {
  if (!item.media) return [];
  return [item.media, ...(item.additionalMedia ?? [])].filter(
    (media) => media.kind !== "mixch" || media.published,
  );
}

export const news: NewsItem[] = [
  {
    id: "2026-09-07-campus-girls-finals-ex-vol1",
    date: "2026-09-07",
    sameDayOrder: 10,
    activityIds: ["campus-girls"],
    title: "CAMPUS GIRLS 2027 本選EX期間のお知らせ",
    body:
      "9月7日、みりぃがCAMPUS GIRLS 2027 本選EX期間の案内をXに投稿しました。本選EX vol.1は9月7日から9月20日です。SNS審査は9月7日12:00〜9月20日12:00、Paton投票審査は9月16日18:00〜9月22日23:59です。みりぃはキャンガルでの配信は行わないと伝えています。",
    source: campusGirlsFinalsExGuideImage.sourceUrl,
    sourceLabel: "みりぃのX",
    media: campusGirlsFinalsExGuideImage,
    additionalMedia: [campusGirlsFinalsExScheduleImage],
    message: {
      label: "みりぃのX",
      text:
        "【キャンガル2027 本選EX期間】\n" +
        "本選まで長いので、是非目を通しておいてくださると嬉しいです😳🙏🏻🩵✨\n" +
        "個人的解釈ですが、この期間は、『私を知ってもらって、本選でも応援してくださる方々に出逢うための期間』。\n" +
        "キャンガルでの配信は行いませんが、私らしく授賞式登壇するぞ〜✊🏻❤️‍🔥",
    },
  },
  {
    id: "2026-09-06-stream-thanks-next-slots",
    date: "2026-09-06",
    sameDayOrder: 40,
    activityIds: ["live-stream"],
    title: "配信ありがとう、明日は6:30と22:00",
    body: "みりぃがXで、配信へのお礼と、翌日の配信が6:30〜7:30と22:00〜23:00であることを伝えました。",
    source: "https://x.com/Mily_chan36/status/2096604917893095494",
    sourceLabel: "みりぃのX",
  },
  {
    id: "2026-09-06-campus-girls-prelim-final-result",
    date: "2026-09-06",
    sameDayOrder: 30,
    activityIds: ["campus-girls"],
    title: "CAMPUS GIRLS 2027 予選final、本戦進出決定✨",
    body: "9月6日、みりぃがCAMPUS GIRLS 2027 予選ファイナルの結果を報告しました。総合は審査員賞、面接審査は1位、Paton投票審査は2位で、本戦進出が決まりました。",
    source: campusGirlsPrelimFinalResultImage.sourceUrl,
    sourceLabel: "みりぃのX",
    media: campusGirlsPrelimFinalResultImage,
    message: {
      label: "みりぃのX",
      text:
        "【キャンガル2027 予選final 結果報告✨】\n" +
        "総合：審査員賞\n" +
        "面接審査：1位 🥇\n" +
        "Paton投票審査：2位 🥈\n" +
        "\n" +
        "よって、本戦進出決定‼️\n" +
        "\n" +
        "皆様の応援のおかげです🥺🫶🏻💙\n" +
        "本当にありがとーーう！\n" +
        "これからもみんなの前で喜怒哀楽を楽しみながら頑張らせてね♪",
    },
  },
  {
    id: "2026-09-06-night-slot-2230",
    date: "2026-09-06",
    sameDayOrder: 20,
    activityIds: ["live-stream"],
    title: "今夜の配信、22:30から",
    body: "みりぃがXで、今夜の配信を22:30〜23:00に変更すると案内しました。",
    source: "https://x.com/Mily_chan36/status/2096366715181691270",
    sourceLabel: "みりぃのX",
    message: {
      label: "みりぃのX",
      text: "⚠️夜の配信 22:30〜23:00 に変更⚠️",
    },
  },
  {
    id: "2026-09-05-morning-stream-thanks",
    date: "2026-09-05",
    sameDayOrder: 20,
    activityIds: ["live-stream"],
    title: "朝配信ありがとう",
    body: "みりぃがXで、朝配信へのお礼を伝えました。次は14:30〜、ともあります。",
    source: "https://x.com/Mily_chan36/status/2096037739833737354",
    sourceLabel: "みりぃのX",
    message: {
      label: "みりぃのX",
      text:
        "朝配信来てくれてありがとう✊🏻❤️‍🔥\n" +
        "みんなにも元気届けられたかなー？少しづつ前向いてくよ🙂‍↕️\n" +
        "次は14:30〜ね！投票も忘れずにっ‼️",
    },
  },
  {
    id: "2026-09-05-tiktok-radio-portrait",
    date: "2026-09-05",
    title: "「覚えて帰ってね〜」ラジオDJみりぃのTikTok",
    body: "9月5日、みりぃのTikTok動画が投稿されました。手で作ったフレームの中に、さまざまな表情や装いの写真が次々に登場。投稿文では、3時間の生放送でおしゃべりするラジオDJとして自己紹介し、ミスサークルコンテスト2026への出場にも触れています。",
    source: tiktokPortraitVideo.sourceUrl,
    sourceLabel: "TikTokの投稿を見る",
    media: tiktokPortraitVideo,
  },
  {
    id: "2026-09-04-third-round-vote-day2-story",
    date: "2026-09-04",
    sameDayOrder: 10,
    activityIds: ["miss-circle"],
    title: "「2日目ポチッとな〜」投票の呼びかけ",
    body:
      "みりぃがInstagram Storyで、リンクスタンプに「2日目ポチッとな〜」と書いて投票を呼びかけました。あわせて「毎日連続投票者の特典ちゃんもあるよっ」と添えています。リンク先と特典の内容はStoryの表示だけでは確認できないため、ここには書きません。くま耳とキラキラのフィルターをつけて、手を振ったりピースをしたりしている短い動画です。",
    sourceLabel: webVoteDay2StoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: missCircleWebVoteLink.label,
        url: missCircleWebVoteLink.url,
      },
    ],
    media: webVoteDay2StoryVideo,
    message: {
      label: "みりぃのStory",
      text:
        "（毎日連続投票者の特典ちゃんもあるよっ\u{1FA75}\u30DC\u30BD\u30C3）\n" +
        "2日目ポチッとな〜\u{1F5F3}\u{FE0F}\u2763\u{FE0F}\u2763\u{FE0F}",
    },
  },
  {
    id: "2026-09-03-miss-circle-goals-support",
    date: "2026-09-03",
    sameDayOrder: 10,
    activityIds: ["miss-circle"],
    title: "三次審査、目標と応援方法",
    body: "みりぃがXに、三次審査の目標と応援方法を載せておきました、と投稿しました。",
    source: "https://x.com/Mily_chan36/status/2095397884107849991",
    sourceLabel: "みりぃのX",
    message: {
      label: "みりぃのX",
      text:
        "🔥ガチイベ🔥3次審査🩵\n" +
        "○みりぃの目標\n" +
        "○応援方法\n" +
        "載せておきました🙂‍↕️チェックして、応援のほどよろしくお願いします〜！頑張るｿﾞ✨",
    },
  },
  {
    id: "2026-09-02-miss-circle-third-round",
    date: "2026-09-02",
    sameDayOrder: 10,
    activityIds: ["miss-circle"],
    title: "ミスサー三次審査、9/3から9/13",
    body: `MISS CIRCLE CONTEST 2026の三次審査が、9月3日から始まります。みりぃはENTRY 734、Bブロックです。

WEB投票は9月3日12:00〜9月13日23:59、SHOWROOMの無料ギフト審査・イベント審査は9月3日5:00〜9月12日21:59です。配信予定は、本人配布のタイムテーブル画像と「応援・予定」で確認できます。予定は変更になる場合があります。`,
    source: "https://www.misscircle.jp/",
    sourceLabel: "MISS CIRCLE CONTEST 2026",
    additionalSources: [
      {
        label: "ENTRY 734",
        url: "https://2026.misscircle.jp/entry/734",
      },
      {
        label: "SHOWROOMイベント",
        url: "https://www.showroom-live.com/event/circle2026_3rd",
      },
    ],
    relatedUrl:
      "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734",
    ctaLabel: "WEB投票する",
    additionalCtas: [
      {
        label: "ENTRY 734",
        url: "https://2026.misscircle.jp/entry/734",
      },
      {
        label: "SHOWROOMイベント",
        url: "https://www.showroom-live.com/event/circle2026_3rd",
      },
      {
        label: "SHOWROOM",
        url: "https://www.showroom-live.com/r/circle2026_0734",
      },
    ],
    media: thirdRoundTimetableImage,
    additionalMedia: [...thirdRoundStoryAdditionalMedia],
  },
  {
    id: "2026-09-02-oyasumily-sr-story",
    date: "2026-09-02",
    sameDayOrder: 2,
    activityIds: ["live-stream"],
    title: "「おやすみりぃ」翌日9:00からSHOWROOM配信",
    body:
      "9月2日未明、みりぃがInstagram Storyで、おやすみのあいさつとともに翌日9:00からのSHOWROOM配信を案内しました。「私にしては珍しい時間」と添えています。",
    sourceLabel: oyasumilyStoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: "SHOWROOM",
        url: "https://www.showroom-live.com/r/circle2026_0734",
      },
    ],
    media: oyasumilyStoryVideo,
    message: {
      label: "みりぃのStory",
      text:
        "明日は\n" +
        "9:00～SR配信‼️\n" +
        "(私にしては珍しい時間🫣💭)\n" +
        "待ってるね～♪\n" +
        "おやすみりぃ",
    },
  },
  {
    id: "2026-09-02-paton-second-story",
    date: "2026-09-02",
    sameDayOrder: 1,
    activityIds: ["campus-girls"],
    title: "パトン投票を2位で終え、応援に感謝",
    body:
      "みりぃがInstagram Storyで、Paton投票を2位で終えたことを報告し、応援への感謝を伝えました。投稿時点の表示は144,550pt。あわせて、面接に向けた意気込みもつづっています。",
    sourceLabel: patonSecondStoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: patonSecondStoryVideo,
    message: {
      label: "みりぃのStory",
      text:
        "パトン投票 🗳️\n" +
        "皆さんが協力して下さったおかげで2位🥈で締めることができました！\n" +
        "ありがとうございます😭🙏❣️\n" +
        "面接頑張ってくるねっ^_^",
    },
  },
  {
    id: "2026-09-01-first-showroom-oyasumiry",
    date: "2026-09-01",
    sameDayOrder: 20,
    activityIds: ["live-stream"],
    title: "9月初配信、おやすみりー",
    body: "9月1日22:31から翌0:19頃まで、約1時間48分。9月はじめての配信。すっぴんで、帽子で前髪が潰れた、うるうるカラコンで目が乾いた、と話していた。今月の目標は「ミリィの栄養素」70人。ボードの1人目はあっきーさん、2人目はやすぴさん。パトン投票はその夜が最終日で、当時2位。最後はおやすみなさい、おやすみりー、おみりー。山を一歩ずつ登って、肩を組んで這い上がろう、という話もあった。",
    sourceLabel: "SHOWROOM",
    relatedUrl: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOM",
    media: firstSeptemberTomatoBoardImage,
    additionalMedia: [...firstSeptemberShowroomAdditionalMedia],
  },
  {
    id: "2026-09-01-ohayo-september-x",
    date: "2026-09-01",
    sameDayOrder: 3,
    title: "おはよ〜 今日から9月ー",
    body: "9月1日朝、みりぃがXで「おはよ〜 今日から9月ー！！」とあいさつした。約3秒の動画付き。",
    source: "https://x.com/Mily_chan36/status/2094579904587382930",
    sourceLabel: "Xの投稿を見る",
    media: ohayoSeptemberXVideo,
    message: {
      label: "みりぃの投稿",
      text:
        "おはよ\u{301C}\u{1F31E}\n" +
        "今日から9月\u{30FC}\u{FF01}\u{FF01}",
    },
  },
  {
    id: "2026-09-01-paton-vote-final-day-story",
    date: "2026-09-01",
    sameDayOrder: 2,
    activityIds: ["campus-girls"],
    title: "おはよう。今日はパトン投票最終日",
    body: "9月1日、みりぃがInstagram Storyで、CAMPUS GIRLS 2027のPaton投票が最終日であることを伝え、投票をお願いしました。画面上の「投票お願いします」はPaton本人ページへの導線です。",
    sourceLabel: patonVoteFinalDayStoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: patonVoteFinalDayStoryVideo,
    message: {
      label: "みりぃのStory",
      text:
        "おはよう〜🌞\n" +
        "今日はパトン投票最終日‼️\n" +
        "投票お願いします 🙌❣️",
    },
  },
  {
    id: "2026-09-01-september-mily-story",
    date: "2026-09-01",
    sameDayOrder: 1,
    title: "9月のみりぃもよろしくね",
    body: "9月1日、みりぃがInstagram Storyで、9月もよろしくねとあいさつしました。",
    sourceLabel: septemberMilyStoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: septemberMilyStoryVideo,
    message: {
      label: "みりぃのStory",
      text: "9月のみりぃもよろしくね♡",
    },
  },
  {
    id: "2026-08-31-paton-vote-voice-story",
    date: "2026-08-31",
    sameDayOrder: 7,
    activityIds: ["campus-girls"],
    title: "キャンパスガールズ2027に出場中です。投票は9月1日まで",
    body: "8月31日、みりぃがInstagram Storyで、CAMPUS GIRLS 2027のPaton投票が9月1日までであることと、31日は応援の気持ちが1.5倍になって届くことを肉声で呼びかけました。画面上の「投票はこちらから」はPaton本人ページへの導線です。1.5倍は31日の投票枠の案内です。",
    sourceLabel: patonVoteVoiceStoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: patonVoteVoiceStoryVideo,
    message: {
      label: "みりぃのStory",
      text:
        "キャンパスガールズ2027に出場中です\n" +
        "パトン投票は明日の9月1日まで\n" +
        "ぜひぜひ明日まで投票してね\n" +
        "本日31日はなんと1.5倍で\n" +
        "みんなの応援をする気持ちが1.5倍になって私に届きます\n" +
        "ぜひぜひ本日中に、あと一時間ぐらいかな\n" +
        "絶対に投票を済ませておいてね\n" +
        "そして明日まで投票をお願いします\n" +
        "頑張るぞ！",
    },
  },
  {
    id: "2026-08-31-paton-first-place-story",
    date: "2026-08-31",
    sameDayOrder: 6,
    activityIds: ["campus-girls"],
    title: "待ってー！現在1位だ。31日は1.5倍DAY",
    body: "8月31日、みりぃがInstagram Storyで、Paton投票の投稿時点1位（102,700pt）を伝え、「31日は1.5倍DAYだからねっ！！」と呼びかけました。1位と得点は投稿時点の記録であり、現在の順位を示すものではありません。",
    sourceLabel: patonVoteFirstPlaceStoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: patonVoteFirstPlaceStoryVideo,
    message: {
      label: "みりぃのStory",
      text:
        "待ってー！現在1位だ\n" +
        "31日は1.5倍DAYだからねっ！！",
    },
  },
  {
    id: "2026-08-31-paton-15x-day-story",
    date: "2026-08-31",
    sameDayOrder: 5,
    activityIds: ["campus-girls"],
    title: "緊急告知：8/31はPaton投票1.5倍デー",
    body: "8月31日、みりぃがInstagram Storyで、CAMPUS GIRLS公式が告知したPaton投票1.5倍デーを緊急案内しました。画面には、明日はPaton投票が1.5倍になることと、投票のお願いが書かれています。",
    sourceLabel: patonVoteFifteenXStoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: patonVoteFifteenXStoryVideo,
    message: {
      label: "Storyに写っていた公式告知",
      text:
        "緊急告知\n" +
        "明日はpaton投票が\n" +
        "《1.5倍》になります\n" +
        "ぜひ投票お願いします\n" +
        "#CAMPUSBOYS2027 #CAMPUSGIRLS2027 #予選AFinal",
    },
  },
  {
    id: "2026-08-31-paton-vote-how-to-story",
    date: "2026-08-31",
    sameDayOrder: 4,
    activityIds: ["campus-girls"],
    title: "Instagram Storyでもパトン投票のやり方を案内",
    body: "8月31日、みりぃがInstagram StoryでCAMPUS GIRLS 2027のPaton投票方法を案内しました。Patonでキャンパスガールズ2027を選び、三橋莉子（みりぃ）のページからギフトを開いて1日1回無料拍手を送ると投票できます。応援コメントも募集しています。投票は9月1日までです。",
    sourceLabel: "Instagram Story",
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: PATON_VOTE_HOW_TO_CTA_LABEL,
        url: PATON_VOTE_HOW_TO_CTA_URL,
      },
    ],
    media: campusGirlsPatonPortraitImage,
    message: {
      label: "みりぃの案内",
      text: patonVoteHowToSpokenMessage,
    },
  },
  {
    id: "2026-08-31-morning-stream-thanks",
    date: "2026-08-31",
    sameDayOrder: 3,
    activityIds: ["live-stream"],
    title: "朝から起こしに来てくれたみんな、ありがとう",
    body: "8月31日朝、みりぃがXで、朝から起こしに来てくれたみんなへのお礼を伝えました。なんだか勇気ももらえて、朝から配信した甲斐があったこと、これからの頑張る糧になると綴っています。",
    source: "https://x.com/Mily_chan36/status/2094192106105659650",
    sourceLabel: "Xの投稿を見る",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMを見る",
    message: {
      label: "みりぃの投稿",
      text:
        "朝から私を起こしに来てくれたみんな、ありがとう\u{1F979}\u{1F64F}\u{1F3FB}\u{2728}なんだか勇気ももらえて、朝から配信した甲斐があったなぁぁぁ\u{301C}\n" +
        "これからの頑張る糧になるね、確実に\u{1F926}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}\u{2763}\u{FE0F}\n" +
        "#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークルコンテスト2026",
    },
  },
  {
    id: "2026-08-31-paton-15x-day",
    date: "2026-08-31",
    sameDayOrder: 2,
    activityIds: ["campus-girls"],
    title: "本日はパトン1.5倍DAY、投稿時点で1位",
    body: "8月31日未明、みりぃがXでPaton投票の緊急告知を投稿しました。本日（31日 0:00〜23:59）は1.5倍であることと、投稿時点で1位であること、この順位を一緒に維持したいという呼びかけが書かれています。同日朝の投稿では、1.5倍DAYであることと『無料拍手』からの応援も案内しています。",
    source: "https://x.com/Mily_chan36/status/2094102196447334713",
    sourceLabel: "Xの投稿を見る",
    additionalSources: [
      {
        label: "朝の無料拍手のX投稿を見る",
        url: "https://x.com/Mily_chan36/status/2094191581951906187",
      },
    ],
    url: campusGirlsPatonVoteLink.url,
    ctaLabel: campusGirlsPatonVoteLink.label,
    media: campusGirlsPatonPortraitImage,
    message: {
      label: "みりぃの投稿",
      text:
        "【緊急告知\u{2764}\u{FE0F}\u{200D}\u{1F525}\u{2764}\u{FE0F}\u{200D}\u{1F525}】\n" +
        "本日（31日\u{3000}0:00\u{301C}23:59）1.5倍\u{203C}\u{FE0F}\n" +
        "\n" +
        "現在1位\u{1F947}この順位、一緒に維持しませんか？！？！投票お願いします\u{1F979}\u{270A}\u{1F3FB}\u{2728}\n" +
        "https://paton.jp/event/entrant/11380",
    },
  },
  {
    id: "2026-08-31-showroom-wake-me",
    date: "2026-08-31",
    sameDayOrder: 1,
    activityIds: ["live-stream"],
    title: "配信中！眠いから私を起こして〜",
    body: "8月31日朝、みりぃがXでSHOWROOM配信中であることを伝えました。「眠いから私を起こして〜」という言葉が残されています。配信中だった記録です。",
    source: "https://x.com/Mily_chan36/status/2094179970960744615",
    sourceLabel: "Xの投稿を見る",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMを見る",
    message: {
      label: "みりぃの投稿",
      text:
        "\u{1F525}2次審査\u{1FA75}三橋莉子\u{1F345} #ミスサークル2026 配信中\u{203C}\u{FE0E}\n" +
        "眠いから私を起こして\u{301C}\u{203C}\u{FE0F}\n" +
        "https://www.showroom-live.com/r/circle2026_0734?t=1788126356",
    },
  },
  {
    id: "2026-08-30-consecutive-stream-30",
    date: "2026-08-30",
    sameDayOrder: 4,
    activityIds: ["live-stream"],
    title: "30日連続配信記念日、素敵な景色を一緒に見に行きたい",
    body: "8月30日、みりぃがXでSHOWROOM配信中であることと、30日連続配信記念日であることを伝えました。「素敵な景色を皆さんと一緒に見に行きたい」という言葉も残されています。",
    source: "https://x.com/Mily_chan36/status/2094023746751463582",
    sourceLabel: "Xの投稿を見る",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMを見る",
    message: {
      label: "みりぃの投稿",
      text:
        "\u{1F525}2次審査\u{1FA75}三橋莉子\u{1F345} #ミスサークル2026 配信中\u{203C}\u{FE0E}\n" +
        "30日連続配信記念日\u{2728}\u{2728}\u{2728}\u{2728}\u{2728}\n" +
        "素敵な景色を皆さんと一緒に見に行きたい\u{1F624}\u{270A}\u{1F3FB}\u{2728}\n" +
        "https://www.showroom-live.com/r/circle2026_0734?t=1788089115",
    },
  },
  {
    id: "2026-08-30-campus-girls-hold-second-story",
    date: "2026-08-30",
    sameDayOrder: 3,
    activityIds: ["campus-girls"],
    title: "パトン投票は9/1まで、2位を守り抜きたい",
    body: "8月30日、みりぃがInstagram Storyでキャンパスガールズ2027の情報を案内しました。Paton投票は9月1日（火）23:59まで、ムービーへの応援は当日30日（日）23:59までと伝え、「投票、2位を守り抜きたい」と呼びかけています。2位は投稿時点の記録です。",
    sourceLabel: campusGirlsHoldSecondStoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: campusGirlsHoldSecondStoryVideo,
    message: {
      label: "みりぃのStory",
      text:
        "【キャンパスガールズ2027 情報ℹ️】\n" +
        "パトン投票：9/1（火）23:59まで\n" +
        "ムービーへの応援：本日30日（日）23:59まで\n" +
        "投票、2位を守り抜きたい🥺✊🏻❤️‍🔥",
    },
  },
  {
    id: "2026-08-30-morning-showroom-0600",
    date: "2026-08-30",
    sameDayOrder: 2,
    activityIds: ["live-stream"],
    title: "おはよーーう！！！今日もみんなと乗り越えていく",
    body: "8月30日朝、みりぃがXでおはようのあいさつを伝えました。今日もみんなと乗り越えていくという言葉と、6:00〜6:30のSHOWROOM配信案内が書かれています。配信前の記録です。",
    source: "https://x.com/Mily_chan36/status/2093802690598064521",
    sourceLabel: "Xの投稿を見る",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMを見る",
    message: {
      label: "みりぃの投稿",
      text:
        "おはよーーう！！！\n" +
        "今日もみんなと乗り越えていく\u{270A}\u{1F3FB}\u{2764}\u{FE0F}\u{200D}\u{1F525}\n" +
        "\n" +
        "SR 6:00\u{301C}6:30で配信するよん\u{266A}\n" +
        "\n" +
        "#ミスサー #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークル #ミスサークルコンテスト2026",
    },
  },
  {
    id: "2026-08-30-mixch-final-day",
    date: "2026-08-30",
    activityIds: ["campus-girls"],
    title: "「配信＆ムービーは今日が最終日」——絶対に本戦行くんだ",
    body: "8月30日、みりぃがMixchに動画を公開しました。配信＆ムービーは今日が最終日と伝え、絶対に本戦行くんだ、皆様の力を貸してくださいと呼びかけています。CAMPUS GIRLS関連のハッシュタグが添えられています。",
    source: "https://x.com/Mily_chan36/status/2093799709219704887",
    sourceLabel: "Xの投稿を見る",
    url: "https://mixch.tv/m/UBHJplv4",
    ctaLabel: "Mixchで見る",
    media: mixchFinalDayMovie,
    message: {
      label: "みりぃのX投稿",
      text:
        "#ミクチャ で動画を投稿したよ！見に来てね！\n" +
        "『配信＆ムービーは今日が最終日\u{270A}\u{1F3FB}\u{2763}\u{FE0F}絶対に本戦行くんだ\u{FF01}\u{FF01}\u{FF01}\u{FF01}\u{FF01}\u{FF01}皆様の力を貸してください\u{1F979}\u{1F64F}\u{1F3FB}\u{2728}』\u{3000}https://mixch.tv/m/UBHJplv4",
    },
  },
  {
    id: "2026-08-30-showroom-30-day-story",
    date: "2026-08-30",
    activityIds: ["live-stream"],
    title: "SHOWROOM 30日連続配信記念日",
    body: "8月30日、みりぃがInstagram StoryでSHOWROOM 30日連続配信記念日を案内しました。投稿時点では午前3:30で、朝7:30の配信予定が書かれています。配信前の記録です。",
    sourceLabel: "Instagram Story",
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: "SHOWROOMを見る",
        url: "https://www.showroom-live.com/r/circle2026_0734",
      },
    ],
    message: {
      label: "みりぃのStory",
      text:
        "【8/30（日）】\n" +
        "SHOWROOM\n" +
        "30日連続配信記念日\n" +
        "現在3:30。朝7:30配信予定",
    },
  },
  {
    id: "2026-08-30-paton-rank-3",
    date: "2026-08-30",
    activityIds: ["campus-girls"],
    title: "今日のパトン投票もお忘れなく、投稿時点で3位",
    body: "8月30日朝、みりぃがXでPaton投票を案内しました。投稿時点で3位であることと、2位に上がりたいという呼びかけが書かれています。",
    source: "https://x.com/Mily_chan36/status/2093802981921849728",
    sourceLabel: "Xの投稿を見る",
    url: campusGirlsPatonVoteLink.url,
    ctaLabel: campusGirlsPatonVoteLink.label,
    media: campusGirlsPatonPortraitImage,
    message: {
      label: "みりぃの投稿",
      text:
        "【今日のパトン投票もお忘れなく\u{2763}\u{FE0F}\u{2763}\u{FE0F}\n" +
        "現時点で3位\u{1F949}。また2位\u{1F948}に上がりたいね\u{1FAEA}\u{1F64C}\u{1F3FB}皆さんの1票が力になります\u{203C}\u{FE0E}\n" +
        "https://paton.jp/event/entrant/11380",
    },
  },
  {
    id: "2026-08-29-paton-vote-day-5-story",
    date: "2026-08-29",
    sameDayOrder: 4,
    activityIds: ["campus-girls"],
    title: "日付が変わる前に、5日目のPaton投票もお願いします",
    body: "8月29日、みりぃがInstagram Storyで、日付が変わる前に5日目のPaton投票をお願いする案内を投稿しました。変面さんとの2ショットとともに、「日付が変わって30日になったら皆様お願いします」と呼びかけています。",
    sourceLabel: patonVoteDay5StoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: patonVoteDay5StoryVideo,
    message: {
      label: "みりぃのStory",
      text:
        "日付が変わる前に寝ますね💤\n" +
        "だから、少し早いですがパトンのお願い投稿しておく🙏🏻\n" +
        "日付が変わって30日になったら皆様お願いします‼️\n" +
        "5日目お願いします🥹🙏🏻❤️‍🔥\n" +
        "変面さんとの2ショット✌️",
    },
  },
  {
    id: "2026-08-29-showroom-live-third-round",
    date: "2026-08-29",
    sameDayOrder: 3,
    activityIds: ["miss-circle", "live-stream"],
    title: "配信中！9/3〜3次審査、素敵な景色を一緒に見に行きたい",
    body: "8月29日、みりぃがXでSHOWROOM配信中であることを伝えました。9月3日から3次審査が始まることと、「素敵な景色を皆さんと一緒に見に行きたい」という言葉も残されています。",
    source: "https://x.com/Mily_chan36/status/2093575115913224580",
    sourceLabel: "Xの投稿を見る",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMを見る",
    message: {
      label: "みりぃの投稿",
      text: "🔥2次審査🩵三橋莉子🍅 #ミスサークル2026 配信中‼︎\n📌9/3〜3次審査‼️\n素敵な景色を皆さんと一緒に見に行きたい😤✊🏻✨\nhttps://www.showroom-live.com/r/circle2026_0734?t=1787982168",
    },
  },
  {
    id: "2026-08-29-showroom-radio-1440",
    date: "2026-08-29",
    sameDayOrder: 2,
    activityIds: ["live-stream"],
    title: "SR配信（ラジオ）14:40〜始めるね⭐️",
    body: "8月29日、みりぃがXで14:40からのSHOWROOMラジオ配信を案内しました。配信前の記録です。",
    source: "https://x.com/Mily_chan36/status/2093572006457557333",
    sourceLabel: "Xの投稿を見る",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMを見る",
    message: {
      label: "みりぃの投稿",
      text: "SR配信（ラジオ📻🗣️）\n14:40〜始めるね⭐️\n\n#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサークルコンテスト2026",
    },
  },
  {
    id: "2026-08-29-paton-vote-day-4-story",
    date: "2026-08-29",
    activityIds: ["campus-girls"],
    title: "日付変わりました！4日目のPaton投票もお願いします🗳️🍅",
    body: "8月29日、みりぃがInstagram Storyで、CAMPUS GIRLS 2027予選ファイナルのPaton投票4日目を案内しました。「私もみんなと一緒に頑張るよ」と伝え、応援を呼びかけています。",
    sourceLabel: patonVoteDay4StoryVideo.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: patonVoteDay4StoryVideo,
    message: {
      label: "みりぃのStory",
      text: "日付変わりました!!\n4日目のパトンもお願いします🥹✊🏻✨\n私もみんなと一緒に頑張るよ",
    },
  },
  {
    id: "2026-08-28-stream-thanks",
    date: "2026-08-28",
    sameDayOrder: 2,
    activityIds: ["live-stream"],
    title: "今日の配信ありがとう！おつみりぃ💤",
    body: "8月28日夜、みりぃがXでその日の配信へのお礼を伝えました。パトン投票もとても助かっていること、翌日の配信時間はまだ確定していないのでまた連絡することを案内し、「おつみりぃ」と締めくくっています。",
    source: "https://x.com/Mily_chan36/status/2093347548388110372",
    sourceLabel: "Xの投稿を見る",
    message: {
      label: "みりぃの投稿",
      text: `みんなー！今日の配信も来てくれてありがとうね😊🫶🏻❤️‍🔥
パトン投票もとても助かっております🗳️✨

明日の配信時間はまだ確定していないので、また連絡するねー！
おつみりぃ💤💤💤
#ミスサークル #ミスサー #ミスサークルコンテスト #ミスサークルコンテスト2026`,
    },
  },
  {
    id: "2026-08-28-night-showroom-story",
    date: "2026-08-28",
    sameDayOrder: 1,
    activityIds: ["live-stream"],
    title: "8/28 22:00〜SHOWROOM配信！夜枠も待ってるね💘",
    body: "8月28日のInstagram Storyで、みりぃが22:00からのSHOWROOM配信を案内しました。「夜枠も楽しもう〜 待ってるぞ〜」と呼びかけた、配信前の記録です。",
    sourceLabel: nightStoryB41Video.sourceLabel,
    relatedUrl: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    additionalCtas: [
      {
        label: campusGirlsPatonVoteLink.label,
        url: campusGirlsPatonVoteLink.url,
      },
    ],
    media: nightStoryB41Video,
    message: {
      label: "みりぃのStory",
      text: "夜枠も楽しもう〜\n待ってるぞ〜💘✨\n\n【8/28（金）】\nSR配信\n22:00〜",
    },
  },
  {
    id: "2026-08-28-paton-vote-day-3",
    date: "2026-08-28",
    activityIds: ["campus-girls"],
    title: "予選A FinalSTAGE 3日目、応援よろしく🍅✨",
    body: "8月28日、みりぃがXでCAMPUS GIRLS 2027 予選A FinalSTAGEの3日目を伝え、Patonで応援するよう呼びかけました。",
    source: "https://x.com/Mily_chan36/status/2093262992289026404",
    sourceLabel: "Xの投稿を見る",
    url: campusGirlsPatonVoteLink.url,
    ctaLabel: campusGirlsPatonVoteLink.label,
    media: campusGirlsPatonPortraitImage,
    message: {
      label: "みりぃの投稿",
      text: `CAMPUS GIRLS 2027 予選A FinalSTAGEに三橋莉子（みりぃ）🍅✨さんが出場中！

【3日目！！！！】

みんなで三橋莉子（みりぃ）🍅✨さんを応援しよう✨
応援はこちらから👇
https://paton.jp/event/entrant/11380
#CAMPUS GIRLS 2027 予選A FinalSTAGE #paton`,
    },
  },
  {
    id: "2026-08-27-movie-night",
    date: "2026-08-27",
    sameDayOrder: 3,
    title: "『あの星が降る丘で、君とまた出会いたい。』を鑑賞🎞️❣️",
    body: "8月27日、みりぃが『あの花が咲く丘で、君とまた出会えたら。』の続編『あの星が降る丘で、君とまた出会いたい。』を観たことをInstagramで紹介しました。開始5分からエンドロールまで泣いたこと、涙を流せる映画が好きなことを綴り、現代と絡めながら戦争の知識を伝えてくれる素敵な映画だと紹介。皆さんのおすすめ映画も募集しています。",
    source: MOVIE_NIGHT_INSTAGRAM_URL,
    sourceLabel: "Instagramの投稿を見る",
    url: MOVIE_NIGHT_INSTAGRAM_PROFILE_URL,
    ctaLabel: "みりぃのInstagramを見る",
    media: movieNightNewsImages[0],
    additionalMedia: movieNightNewsImages.slice(1),
    message: {
      label: "みりぃの投稿",
      text: `映画見てきたよん🎞️❣️

『あの花が咲く丘で、君とまた出会えたら。』の続編、
『あの星が降る丘で、君とまた出会いたい。』を見てきたんだけどさ、開始5分からエンドロールまで号泣して、泣き疲れた‼️笑
涙流せる映画好きなんだよなぁ🥹🥹🥹

現代と絡めながら戦争の知識を教えてくれる、素敵な映画です🙂‍↕️❤️‍🔥

皆さんのおすすめの映画教えてっ😳👂🏻

#映画 #あの花が咲く丘で君とまた出会えたら #あの星が降る丘で君とまた出会いたい #ミスサークルコンテスト #キャンパスガールズ`,
    },
  },
  {
    id: PATON_VOTE_HOW_TO_NEWS_ID,
    date: "2026-08-27",
    sameDayOrder: 2,
    activityIds: ["campus-girls"],
    title: PATON_VOTE_HOW_TO_TITLE,
    body: "8月27日、みりぃがXでCAMPUS GIRLS 2027のPaton投票方法を案内しました。Patonでキャンパスガールズ2027を選び、三橋莉子（みりぃ）のページからギフトを開いて1日1回無料拍手を送ると投票できます。応援コメントも募集しています。投票は9月1日までです。",
    source: PATON_VOTE_HOW_TO_X_URL,
    sourceLabel: PATON_VOTE_HOW_TO_SOURCE_LABEL,
    url: PATON_VOTE_HOW_TO_CTA_URL,
    ctaLabel: PATON_VOTE_HOW_TO_CTA_LABEL,
    media: campusGirlsPatonPortraitImage,
    message: {
      label: "みりぃの案内",
      text: patonVoteHowToSpokenMessage,
    },
  },
  {
    id: "2026-08-27-x-followers-100",
    date: "2026-08-27",
    sameDayOrder: 1,
    title: "Xフォロワー100人！ありがとうございます\u{1F972}",
    body: "8月27日、みりぃがXのフォロワー100人を報告しました。X初心者で上手く使いこなせないなかでの節目だと伝え、「ありがとうございます」と感謝を綴っています。変動はあるとしつつ、これからも楽しく発信していくこと、「これからもよろしくです」という言葉も残されています。",
    source: "https://x.com/Mily_chan36/status/2092884427605266708",
    sourceLabel: "Xの投稿を見る",
    message: {
      label: "みりぃの投稿",
      text:
        "X初心者\u{1F530}で上手く使いこなせない中、なんとフォロワー様100人になりました〜\u{1F979}\u{1F44F}\u{1F3FB}\u{2764}\u{FE0F}\u{200D}\u{1F525}\n" +
        "ありがとうございます\u{1F972}\u{2728}\n" +
        "変動はあるだろうけど、これからも楽しく発信していきますね\u{266A}\n" +
        "これからもよろしくです\u{FF01}\u{FF01}\n" +
        "#ミスサー #キャンガル #ミスサー2026 #キャンガル2027 #ミスコン",
    },
  },
  {
    id: "2026-08-27-mixch-expressive",
    date: "2026-08-27",
    activityIds: ["campus-girls"],
    title: "「表情豊かなみりぃと魅力的でしょう？？？？」——絶対に本戦に行こう",
    body: "8月27日、みりぃがMixchに動画を公開しました。表情豊かなみりぃと魅力的でしょう？と呼びかけ、絶対に本戦に行こう、勝ち進もうと伝えています。CAMPUS GIRLS関連のハッシュタグが添えられています。",
    source: "https://x.com/mily_chan36/status/2092838411602407646",
    sourceLabel: "Xの投稿を見る",
    url: "https://mixch.tv/m/VDojsMY5",
    ctaLabel: "Mixchで見る",
    media: mixchExpressiveMovie,
    message: {
      label: "みりぃのX投稿",
      text:
        "#ミクチャ で動画を投稿したよ！見に来てね！\n" +
        "表情豊かなみりぃと魅力的でしょう？？？？(^з^)-☆ 絶対に本戦に行こう\u{203C}\u{FE0F}勝ち進もう\u{203C}\u{FE0F}#キャンガル #キャンパスガールズ2027 #キャンパスガールズ #キャ https://mixch.tv/m/VDojsMY5",
    },
  },
  {
    id: "2026-08-27-seaside-circle-movie-theme-story",
    date: "2026-08-27",
    activityIds: ["radio"],
    title: "8/30のラジオは「映画」がトークテーマ🎬",
    body: "8月27日、みりぃがInstagram Storyで、湘南シーサイドサークルの8月30日（日）10:00〜13:00生放送の案内をシェアしました。トークテーマは「映画」で、メッセージを募集しています。",
    sourceLabel: seasideCircleMovieThemeStoryVideo.sourceLabel,
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: seasideCircleMovieThemeStoryVideo,
    message: {
      label: "みりぃがシェアした番組案内",
      text: "湘南シーサイドサークル\n8月30日（日）10:00〜13:00生放送！\nトークテーマは【映画】\nメッセージ募集中💌",
    },
  },
  {
    id: "2026-08-27-miss-circle-showroom-story",
    date: "2026-08-27",
    title: "おはよう☀️ 8/27は14:00〜ミスサーSR配信",
    body: "8月27日、みりぃがInstagram Storyで、14:00からのミスサーSHOWROOM配信を案内しました。「おはよう」のメッセージを添えた短い動画です。",
    sourceLabel: morningMissCircleShowroomStoryVideo.sourceLabel,
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: morningMissCircleShowroomStoryVideo,
    message: {
      label: "みりぃのStory",
      text: "おはよう\n\n【8/27（木）】\nミスサーSR配信📶\n14:00〜",
    },
  },
  {
    id: "2026-08-26-girlsaward-showroom-6th",
    date: "2026-08-26",
    sameDayOrder: 4,
    activityIds: ["miss-circle", "live-stream"],
    title: "ガルアワイベ6位でフィニッシュ！「とーーーっても楽しかった」",
    body: "8月20日から26日まで挑戦した、Rakuten GirlsAward 2026 A/Wのランウェイ出演をかけたSHOWROOMイベントが終了。みりぃは6位でフィニッシュしました。終了後のXでは「皆さんのおかげでとーーーっても楽しかった」と感謝を伝え、挑戦する怖さを越えて一歩踏み出せたこと、みんなに出逢い応援してもらえたことを「幸せじゃっ」と振り返っています。そして「これからもどうぞよろしくお願いします」と締めくくっています。",
    source: "https://x.com/Mily_chan36/status/2092621770406896106",
    sourceLabel: "Xの投稿を見る",
    additionalSources: [
      {
        label: "SHOWROOMイベントページを見る",
        url: "https://www.showroom-live.com/event/girlsaward2026aw_fm",
      },
    ],
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMを見る",
    media: girlsawardShowroomSixthImage,
    message: {
      label: "みりぃの投稿",
      text: "はぁぁぁぁぁ、皆さんのおかげでとーーーっても楽しかった\u{1F979}\u{2764}\u{FE0F}\u{200D}\u{1F525}\nガルアワイベ、初めは挑戦するのも怖かったけど、勇気出して一歩踏み出せて、みんなに出逢えて、応援していただけてよかった。幸せじゃっ\u{2B50}\u{FE0F}\nこれからもどうぞよろしくお願いします\u{1F345}\u{2728}\n#ミスサー #ミスサークル #ミスサークルコンテスト",
    },
  },
  {
    id: "2026-08-26-paton-vote-stories",
    date: "2026-08-26",
    sameDayOrder: 3,
    activityIds: ["campus-girls"],
    title: "「絶対みんなと本戦行くんだ〜」予選ファイナル投票スタート✨",
    body: "CAMPUS GIRLS 2027 予選ファイナルの毎日投票が、8月26日18:00にスタートしました。投票期間は9月1日23:59まで。みりぃもInstagram Storyで「絶対みんなと本戦行くんだ〜！！！」と気合い十分に呼びかけ、「皆さん、やり方わかりますか？？大丈夫？？」と投票方法も気にかけながら案内しています。期間中はPatonから毎日応援できます。",
    sourceLabel: "Instagram Story",
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: patonVoteMirrorStillImage,
    additionalMedia: [
      patonVoteCollageStillImage,
      patonVoteMirrorStoryVideo,
      patonVoteCollageStoryVideo,
    ],
    message: {
      label: "みりぃのStory",
      text: "絶対みんなと本戦行くんだ〜！！！\n\n皆さん、やり方わかりますか？？大丈夫？？",
    },
  },
  {
    id: "2026-08-26-instagram-followers-400",
    date: "2026-08-26",
    sameDayOrder: 2,
    title: "Instagramフォロワー400人！ありがとうございます\u{1F972}",
    body: "8月26日、みりぃがInstagramのフォロワー400人をStoryで報告しました🎉 「ありがとうございます」と感謝を伝え、数字の変動もありつつ、これからもInstagramを楽しみながら、いろいろなことを発信していきたいと綴っています。400人という節目に、改めてフォロワーへ感謝を届けたStoryです。",
    sourceLabel: "Instagram Story",
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: followers400StoryVideo,
    message: {
      label: "みりぃのStory",
      text: "フォロワー様400人\u{203C}\u{FE0F}ありがとうございます\u{1F972}\u{270A}\u{1F3FB}\u{2764}\u{FE0F}\u{200D}\u{1F525}\n\n変動もあるかとは思いますが、これからも楽しくInstagramができればいいなぁと！\n\nこれからもいろーーんなこと発信していくね\u{1F4AB}",
    },
  },
  {
    id: "2026-08-26-morning-stream-thanks",
    date: "2026-08-26",
    sameDayOrder: 1,
    activityIds: ["live-stream"],
    title: "今日も来てくれてありがとう〜\u{1F972}",
    body: "8月26日、みりぃがInstagram Storyで、その日の配信に来てくれたことへの感謝を届けました。環境や周りの方々に恵まれていると伝え、明日からも前向きに頑張れそうという言葉と、応援を絶対に無駄にしないという思いも残しています。",
    sourceLabel: "Instagram Story",
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: morningStreamThanksInstagramStoryImage,
    message: {
      label: "みりぃのStory",
      text: "今日も来てくれてありがとう〜\u{1F972}\u{1F64F}\u{2728}\nいやぁ、環境や周りの方々に恵まれているなぁと、心から感じます。\nなんだか明日からもまた、前向きに頑張れそう\u{1F60C}\n応援してくださる皆様に日々感謝です。\nそして、皆様の応援、絶対に無駄にしないよ\u{203C}\u{FE0F}",
    },
  },
  {
    id: "2026-08-26-girl-award-event-fanroom",
    date: "2026-08-26",
    sameDayOrder: 1,
    activityIds: ["live-stream"],
    title: "ガルアワイベ最終日、【6位】で走り切れました",
    body: "8月26日のSHOWROOMファンルームで、みりぃがガルアワイベ最終日を【6位】で終われたこと、最後の逆転、みんなの応援の賜物であることへの感謝を伝えました。一緒に走り切ってくれたことへのお礼と、これからも不器用なみりぃをよろしく、という言葉も残されています。同じ夜、ファンルームに音声メッセージも届いています。",
    sourceLabel: "SHOWROOMファンルーム",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMで応援する",
    media: girlAwardEventVoice,
    message: {
      label: "みりぃからの連絡💌 · 22:32",
      text:
        "ガルアワイベ最終日、\n" +
        "なんと【6位】で終わることができました😭\n" +
        "🙏❤️✨\n" +
        "\n" +
        "まさか最後に逆転できるとは〜！！！！！\n" +
        "これもみんなの応援の賜物すぎるよ😱❤️‍🔥\n" +
        "\n" +
        "一緒に走り切ってくれたみんな、本当にありがとう。\n" +
        "心から感謝です🥺💙\n" +
        "\n" +
        "とってもとっても楽しかった！！\n" +
        "\n" +
        "これからもどうぞ、\n" +
        "不器用なみりぃをよろしくお願いいたします‼️",
    },
  },
  {
    id: "2026-08-26-mixch-15x-day",
    date: "2026-08-26",
    activityIds: ["campus-girls"],
    title: "「今日は1.5倍デーだってよ？！」——みんなと絶景を見に行くよ",
    body: "8月26日、みりぃがMixchに動画を公開しました。今日は1.5倍デーだと伝え、みんなと絶景を見に行くと話しています。CAMPUS GIRLS関連のハッシュタグが添えられています。",
    source: "https://x.com/mily_chan36/status/2092481552475460058",
    sourceLabel: "Xの投稿を見る",
    url: "https://mixch.tv/m/nxqYblH8",
    ctaLabel: "Mixchで見る",
    media: mixch15xDayMovie,
    message: {
      label: "みりぃのX投稿",
      text:
        "おすすめの動画を見つけたよ！ #ミクチャ\n" +
        "今日は1.5倍デーだってよ？！\u{1F633}\u{1FAF6}\u{1F3FB}\u{2763}\u{FE0F}私はみんなと絶景見に行くよ。絶対にね。#キャンガル #キャンガル2027 #キャンパスガールズ #キャンパスガールズ2027 https://mixch.tv/m/nxqYblH8",
    },
  },
  {
    id: "2026-08-26-stream-1000",
    date: "2026-08-26",
    activityIds: ["live-stream"],
    title: "おやすみなさい💤 26日の配信は10:00〜11:00",
    body: "8月26日未明、みりぃがXに「皆さん今日もお疲れ様」と投稿し、26日の配信は10:00〜11:00と伝えました。夜できるといいなぁという言葉と「おやすみなさい」も残されています。",
    source: "https://x.com/Mily_chan36/status/2092303118142939171",
    sourceLabel: "Xの投稿を見る",
    message: {
      label: "みりぃの投稿",
      text: "皆さん今日もお疲れ様\u{1F642}\u200D\u2195\uFE0F\u{1F340}\n\n26日の配信は10:00\u301C11:00\u270A\u{1F3FB}\u2728\n\n夜できるといいなぁ\u{1F972}\nおやすみなさい\u{1F4A4}\n\n#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサークルコンテスト2026",
    },
  },
  {
    id: "2026-08-25-mixch-confidence-message",
    date: "2026-08-25",
    sameDayOrder: 1,
    activityIds: ["campus-girls"],
    title: "「自信のないあなたへ」——みりぃがMixchで届けた大切なメッセージ",
    body: "8月25日の朝、みりぃがMixchに「自信のないあなたへ」を公開しました。自分よりも周りの人の良いところが目に入り、自分自身については足りないところを見つけてしまう——そんな「自信のなさ」に寄り添いながら、これまで歩いてきた道には一つひとつ足跡が残っていると語りかける動画です。みりぃ自身も、自分に自信がなく不安だからこそ、みんなと頑張りたいと伝えています。公開後のXのリプライでは、「キャンガルでも絶対に発信したいと思っていたこの大切な動画」と改めて紹介。CAMPUS GIRLSで届けたいと本人が語った思いと、応援してくれる皆さんと一緒に頑張りたいという言葉を残しています。",
    source: "https://x.com/mily_chan36/status/2092031986810728533",
    sourceLabel: "Xの投稿を見る",
    url: "https://mixch.tv/m/ZY4hSt3K",
    ctaLabel: "Mixchで「自信のないあなたへ」を見る",
    media: mixchConfidenceMessageMovie,
    message: {
      label: "みりぃのX投稿",
      text: `#ミクチャ で動画を投稿したよ！見に来てね！
【自信のないあなたへ】
https://mixch.tv/m/ZY4hSt3K`,
    },
  },
  {
    id: "2026-08-25-motivation",
    date: "2026-08-25",
    activityIds: ["miss-circle", "live-stream"],
    title: "「やる気、元気、勇気でたぞ」——8月25日の朝",
    body: "久しぶりに長く眠れた朝、みりぃが「やる気、元気、勇気でたぞ」と伝えました。当日の配信予定と、のちに1発目を11:40〜へ変更した追記、残り2日のイベントについての言葉、応援への感謝も残されています。",
    source: "https://x.com/Mily_chan36/status/2092030938306039904",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/2026-08-25-motivation/",
    ctaLabel: "朝の言葉の記録を読む",
  },
  {
    id: "2026-08-24-seasidecircle-yes-tokyo",
    date: "2026-08-24",
    sameDayOrder: 4,
    activityIds: ["radio"],
    title: "「Yes!東京」踊ってみた💃",
    body: "8月24日、湘南シーサイドサークルのInstagramに、みりぃの「Yes!東京」踊ってみた動画が投稿されました。ハッシュタグではダンス・ミスコン・ラジオが添えられています。",
    sourceLabel: "湘南シーサイドサークル Instagram",
    url: "https://www.instagram.com/seasidecircle",
    ctaLabel: "湘南シーサイドサークル Instagramを見る",
    media: seasideCircleYesTokyoVideo,
    message: {
      label: "湘南シーサイドサークルの投稿",
      text: `Yes!東京
#踊ってみた #ダンス #ミスコン #ラジオ`,
    },
  },
  {
    id: "2026-08-24-campus-girls-final-stage-guide",
    date: "2026-08-24",
    sameDayOrder: 3,
    activityIds: ["campus-girls"],
    title: "CAMPUS GIRLS 2027 予選A Final STAGEへ📣✨",
    body: "8月24日、みりぃがCAMPUS GIRLS 2027 予選A Final STAGEの応援方法を案内しました。SNS審査は8月24日12:00〜8月30日12:00、Paton投票審査は8月26日18:00〜9月1日23:59。8月24日時点では投票先の詳細は追って案内としており、8月26日にPatonの三橋莉子（みりぃ）ページの公開を確認しました。同日、みりぃ自身もXでこの応援ページを直接案内しています。投票にはPatonへのログインが必要です。また、CAMPUS GIRLSでは配信を行わないことも伝えています。画像ではFinal STAGE期間を8月24日12:00〜8月30日23:59と案内しています。",
    source: "https://x.com/mily_chan36/status/2091669951946121636",
    sourceLabel: "8月24日のX投稿を見る",
    additionalSources: [
      {
        label: "8月26日のX投稿を見る",
        url: "https://x.com/mily_chan36/status/2092456392343138339",
      },
    ],
    url: "https://paton.jp/event/entrant/11380",
    ctaLabel: "Patonでみりぃに投票する",
    media: campusGirlsPatonPortraitImage,
    additionalMedia: [campusGirlsPatonPageImage, campusGirlsFinalStageFlyerImage],
  },
  {
    id: "2026-08-24-makeup-stream",
    date: "2026-08-24",
    sameDayOrder: 2,
    activityIds: ["live-stream"],
    title: "初メイク配信！朝からの応援ありがとう💄",
    body: "8月24日の朝、みりぃがSHOWROOMでメイク配信を行いました。Instagram Storyでは自身で「初メイク配信」と紹介しています。これまでは「完璧な状態でみんなの前に出たい」と思っていたものの、それでは皆と過ごせる時間が限られてしまい、皆の言う「無理する」ことにつながるのも嫌だったので断念し、今回の配信に至ったと伝えています。配信後のXでは、朝早くから来てくれた皆さんへの感謝とともに、コメントやキラ星、ギフトなどさまざまな形の応援を感じて「楽しかったよ〜」と振り返りました。次回は夜配信になる可能性があり、詳細は改めて案内するとのことです。",
    source: "https://x.com/mily_chan36/status/2091668215919444138",
    sourceLabel: "Xの投稿を見る",
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: morningMakeupShowroomImage,
    additionalMedia: [morningMakeupInstagramStoryImage],
    message: {
      label: "みりぃの投稿",
      text: `おはよう！朝配信ありがとう🥹✊🏻✨
ついにメイク配信してしまったｾﾞ🤦🏻‍♀️
朝早くだったのに来てもらえて、コメント、キラ星、ギフトいろんな形で応援してくれているのを感じて楽しかったよ〜🫶🏻❣️
次の配信は夜になるかと！また連絡しますねん♪
今日も暑い。溶けないように水分補給だね🫠
#ミスサー`,
    },
  },
  {
    id: "2026-08-24-night-thanks-morning-stream",
    date: "2026-08-24",
    sameDayOrder: 1,
    activityIds: ["live-stream", "radio"],
    title: "夜枠＆ラジオありがとう！朝は6:20〜☀️",
    body: "8月24日未明、みりぃがSHOWROOMファンルームとInstagram Storyで、夜枠へのお礼とラジオをたくさんの方に聴いてもらえたことへの感謝を届けました。みんなと話すことが楽しいこと、誰でも参加しやすいルームにしていきたいという思いも伝えています。8月24日の朝枠は6:20〜6:50で、最近の1日のスケジュールについて話す予定です。夜については改めて連絡すると案内しています。",
    source: "https://x.com/mily_chan36/status/2091561616307585262",
    sourceLabel: "Xの投稿を見る",
    media: nightThanksMorningStreamStoryVideo,
    message: {
      label: "みりぃからの連絡💌 · 00:57",
      text: `今日もありがとうございました😌🙏🏻✨

ラジオのことも知ってくれて、聴いてもらえて、嬉しいねぇ、愛されているねぇ、幸せだねぇ🥺🩵

明日は6:20〜6:50で配信します！
早く寝ないと私起きれないよ〜😭😭😭笑
起きるの頑張ります🤭

おやすみりぃ`,
    },
  },
  {
    id: "2026-08-23-dragon-cloud",
    date: "2026-08-23",
    sameDayOrder: 5,
    title: "龍みたいな雲に出会った日🐉",
    body: "友達と将来について語っていたとき、みりぃが空に龍のように見える雲を見つけて撮影しました。龍の形をした雲には「次のステージに進む準備が整った」「運気が大きく上がる」といった意味があるらしいと紹介。普段はこうしたことをあまり気にしないものの、悩むことも多かったタイミングで見られたことを嬉しく感じ、「いいことはちょっと信じてみる」と投稿しています。",
    source: "https://www.instagram.com/p/DcYbkvOk4Te/",
    sourceLabel: "Instagramの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b20-02-dragon-cloud-close.jpg",
      width: 1600,
      height: 1200,
      alt: "青空に龍のようにも見える白い雲が広がる様子",
    },
  },
  {
    id: "2026-08-23-seaside-circle-musical-special",
    date: "2026-08-23",
    sameDayOrder: 4,
    activityIds: ["radio"],
    title: "真夏のミュージカル特集🎭 清水美依紗さんを迎えた生放送",
    body: "8月23日の「湘南シーサイドサークル」は真夏のミュージカル特集。前半約2時間には清水美依紗さんをゲストに迎え、ミュージカルとの出会い、『レ・ミゼラブル』『ミス・サイゴン』、表現や夢への向き合い方までじっくりトークしました。12時台には、みりぃ自身が高校時代に『グレイテスト・ショーマン』と「This Is Me」から勇気をもらった思い出も語りました。放送後、番組公式Instagram Storyでは、リスナーへのお礼と清水美依紗さんへの出演への感謝も届けられました。",
    source: "https://x.com/fm_smw856/status/2091499993102524714",
    sourceLabel: "FM湘南マジックウェイブの放送後投稿を見る",
    url: "/stories/2026-08-23-musical-special/",
    ctaLabel: "真夏のミュージカル特集の放送記録を読む",
    media: seasideCircleMusicalSpecialThanksVideo,
  },
  {
    id: "2026-08-23-morning-showroom-fanroom",
    date: "2026-08-23",
    sameDayOrder: 3,
    activityIds: ["live-stream", "radio"],
    title: "朝枠ありがとう！次枠は22:30〜💄",
    body: "8月23日のSHOWROOMファンルームで、みりぃが朝配信へのお礼と新規フォロワーへの感謝を伝え、改めて自己紹介しました。次枠22:30〜を案内し、次はメイクした姿で配信すると伝えています。FMラジオへ向かう直前の投稿です。",
    sourceLabel: "SHOWROOMファンルーム",
    message: {
      label: "みりぃからの連絡💌 · 06:25",
      text: "朝配信遅れてごめんなさいー！！！\n\nきてくれたみんなありがとう😌🙏🏻✨\nそして、フォローしてくださった皆様もありがとう🤭✨\n\n改めて、みりぃです！\n\nまた次も来てくれたら嬉しいよ〜♪\n\n次は22:30〜ねー！絶対にメイクしてます😊いつもきてくれている方からすると久しぶりのメイクみりぃ💄だね！\n\n始めてくる方も大歓迎〜！\n\nでは、ラジオ行ってきますー！",
    },
  },
  {
    id: "2026-08-23-early-showroom-fanroom",
    date: "2026-08-23",
    sameDayOrder: 2,
    activityIds: ["live-stream", "radio"],
    title: "FMラジオ前のFan Room投稿📻",
    body: "8月23日のSHOWROOMファンルームで、みりぃがFMラジオ前にラジオ配信をしてから行こうかと、ファンルームで問いかけました。",
    sourceLabel: "SHOWROOMファンルーム",
    message: {
      label: "みりぃからの連絡💌 · 05:53",
      text: "FMラジオ前にラジオ配信して行っていいかしらね？笑",
    },
  },
  {
    id: "2026-08-23-earthquake-showroom-fanroom",
    date: "2026-08-23",
    sameDayOrder: 1,
    title: "地震直後、みんなの安全を気遣うみりぃ💌",
    body: "8月23日未明の地震直後、SHOWROOMファンルームでみりぃが「まずは身の安全を確保」と呼びかけました。その後も「皆さん無事かな？？」とファンを気遣い、自身も無事だと報告しています。Instagram Storyでも関東圏の皆さんの無事を気遣い、「まずは落ち着いて」「自分の身の安全の確保‼」と呼びかけています。",
    sourceLabel: "SHOWROOMファンルーム / Instagram Story",
    media: earthquakeSafetyStoryVideo,
    message: {
      label: "みりぃからの連絡💌 · 02:02〜02:19",
      text: `みりぃ · 02:02
地震だね、落ち着いて！！まずは身の安全を確保✊🏻😌

みりぃ · 02:18
皆さん無事かな？？

みりぃ · 02:19
みりぃは無事です、ありがとう🙌🏻🙌🏻`,
    },
  },
  {
    id: "2026-08-22-night-showroom-thanks",
    date: "2026-08-22",
    sameDayOrder: 3,
    activityIds: ["live-stream"],
    title: "夜枠ありがとう！8/23の配信予定もお知らせ📡✨",
    body: "8月22日の夜、みりぃがSHOWROOM配信へのお礼をXに投稿しました。あわせて、投稿時点で翌23日は朝5:40〜と夜22:30〜の2枠を予定していることを案内し、「おやすみりぃ」と締めくくっています。",
    source: "https://x.com/mily_chan36/status/2091166455224299641",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b17-01-night-showroom-fireworks.jpg",
      width: 1206,
      height: 555,
      alt: "花火大会仕様のSHOWROOM配信画面で、中央にみりぃが映り、画面下部に視聴者のアバターが並んでいる様子",
    },
    message: {
      label: "みりぃの投稿",
      text: `夜枠ありがとうございました！！

明日は
朝☀️5:40〜
夜🌙22:30〜
の予定だよ🙇🏻‍♀️🙇🏻‍♀️🙇🏻‍♀️

おやすみりぃ

#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサークルコンテスト2026`,
    },
  },
  {
    id: "2026-08-22-night-showroom-fanroom",
    date: "2026-08-22",
    sameDayOrder: 2,
    activityIds: ["live-stream"],
    title: "夜枠ありがとう！明日は朝5:40〜・夜22:30〜🌙",
    body: "8月22日のSHOWROOMファンルームで、みりぃが夜枠配信へのお礼を伝え、ルームの温かい空間への感謝と、これからも一緒にいろんな景色を見ていきたいという言葉を届けました。翌日の配信予定として朝5:40〜と夜22:30〜を案内しています。",
    sourceLabel: "SHOWROOMファンルーム",
    message: {
      label: "みりぃからの連絡💌 · 22:57",
      text: "夜枠ありがとうございました！！\n\n等身大の自分でいることができるのは、ルームにいる皆様全員が暖かく、リラックスできる空間を作ってくれているからです😭✨\n\nこれからもみんなと一緒にいろんな景色を見ていきたいよ🥺✊🏻🩵\n\n明日⬇️\n朝☀️5:40〜\n夜🌙22:30〜\n\nよろしくお願いします！",
    },
  },
  {
    id: "2026-08-22-evening-showroom-fanroom",
    date: "2026-08-22",
    sameDayOrder: 1,
    activityIds: ["live-stream"],
    title: "帰宅報告！20:30〜を目標に夜配信☔",
    body: "8月22日のSHOWROOMファンルームで、みりぃが帰宅報告とゲリラ豪雨への気遣いを伝え、食事とお風呂のあと、20:30〜に配信できるよう頑張りたいと伝えました。翌朝が早いため早めに休む予定も伝えています。",
    sourceLabel: "SHOWROOMファンルーム",
    message: {
      label: "みりぃからの連絡💌 · 18:17",
      text: "ただいま〜✨\n皆さんゲリラ豪雨大丈夫？？私はポツポツ降ってきたなぁぁぁくらいで家に着いてギリギリセーフだったよ🏠帰宅時間の皆さんお気をつけて〜😭🙌🏻\n\n今からご飯作って食べて、お風呂に入ってその後配信したいからぁ、、、🤔💭\n\n20:30〜\nできるように頑張ろうかなっ！\n\n明日の朝はめちゃくちゃ早いから、流石に早めに寝るように努める🥱",
    },
  },
  {
    id: "2026-08-22-campus-girls-second-stage-jury-award",
    date: "2026-08-22",
    activityIds: ["campus-girls"],
    title: "CAMPUS GIRLS 2027 審査員賞！予選ファイナル進出✨",
    body: "8月22日、みりぃがCAMPUS GIRLS 2027 予選A 2nd STAGEで審査員賞を受賞し、予選ファイナルへ進出することを報告しました。コンテストとの両立に難しさを感じながらも、チャンスへの感謝と「可能性を信じて、自分のできることを」という思いを届けています。",
    source: "https://x.com/mily_chan36/status/2090988000813654232",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/campus-girls-2027-second-stage-jury-award/",
    ctaLabel: "審査員賞・予選ファイナル進出の記録を読む",
    media: campusGirlsSecondStageResultImage,
  },
  {
    id: "2026-08-21-tiktok-radio-misscircle",
    date: "2026-08-21",
    sameDayOrder: 1,
    activityIds: ["radio", "miss-circle"],
    title: "湘南シーサイドサークルのTikTokにみりぃが登場📻✨",
    body: "8月21日、湘南シーサイドサークルのTikTokに、みりぃの動画が投稿されました。番組TikTokに登場したみりぃが、ラジオDJとミスコンの両方を頑張る気持ちを伝えています。",
    source: tiktokRadioVideo.sourceUrl,
    sourceLabel: "湘南シーサイドサークルのTikTok投稿を見る",
    media: tiktokRadioVideo,
    message: {
      label: "湘南シーサイドサークルの投稿",
      text: "ラジオDJもミスコンも頑張らせていただくよ✌みりぃです^^",
    },
  },
  {
    id: "2026-08-21-after-afternoon-ganda",
    date: "2026-08-21",
    activityIds: ["live-stream"],
    title: "急遽のガンダで絶望！？23:00〜配信で心境トーク🤭",
    body: "8月21日のXで、みりぃが昼枠配信を見ていた方には通じるという写真を投稿。「急遽なガンダで絶望している」と笑いまじりに伝え、投稿では23:00〜の配信でこの時の心境を話すと案内しました。",
    source: "https://x.com/mily_chan36/status/2090722156162478273",
    sourceLabel: "Xの投稿を見る",
    media: gandaBeforeNightStreamImage,
    message: {
      label: "みりぃの投稿",
      text: "昼枠配信見てくれた方には通じる写真。\n\n急遽なガンダで絶望してるみりぃ。笑笑笑\n\nどういうこと？？\nという方は23:00〜の配信でお待ちしております🛜\nこの時の心境お話ししますね🤭笑\n\n#ミスサー #ミスサークルコンテスト2026 #ミスサークル #ミスサークル2026 #ミスサー2026 #ミスコン",
    },
  },
  {
    id: "2026-08-21-afternoon-showroom-fanroom",
    date: "2026-08-21",
    activityIds: ["live-stream"],
    title: "朝枠ありがとう！次枠は14:00〜📡✨",
    body: "8月21日のSHOWROOMファンルームで、みりぃが朝の配信へのお礼と次枠14:00〜を案内しました。初めて来てくれた方やフォローしてくれた方への感謝とともに、これからもいろいろな一面を見つけてほしいと呼びかけています。",
    sourceLabel: "SHOWROOMファンルーム",
    media: {
      kind: "image",
      src: "/media/news/mily-b13-01-fanroom-next-slot.jpg",
      width: 443,
      height: 313,
      alt: "SHOWROOMファンルームで朝枠へのお礼と次枠14:00を案内した、みりぃからの連絡",
    },
    message: {
      label: "みりぃからの連絡💌",
      text: "みなさーん！朝枠ありがとう😭❣️\n【次枠】\n14:00〜\n跨ぎ配信するぜーっ！\n皆様、一緒に楽しもう？！✨",
    },
  },
  {
    id: "2026-08-21-event-story-next-slot",
    date: "2026-08-21",
    activityIds: ["live-stream"],
    title: "寝起き配信ありがとう！次枠14:00〜❤️‍🔥",
    body: "8月21日のInstagram Storyで、みりぃが寝起き配信へのお礼を伝え、次枠14:00〜を案内しました。Story投稿時点では「現在5位」と報告し、ランウェイをかけたイベントに挑戦する理由についても伝えています。",
    sourceLabel: eventStory20260821.sourceLabel,
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: eventStory20260821,
    message: {
      label: "みりぃのメッセージ",
      text: "寝起き配信ありがとうございました〜❣️\nまさかの現在5位🥹💙\n【次枠】\n14:00〜",
    },
  },
  {
    id: "2026-08-21-morning-ohayo-story",
    date: "2026-08-21",
    title: "OHAYO! 👓 8/21朝のInstagram Story",
    body: "8月21日の朝、みりぃから「OHAYO!」のひとコマが届きました。メガネのフェイスフィルターとともに届けられた、朝の短い動画です。",
    sourceLabel: morningOhayo20260821.sourceLabel,
    url: "https://www.instagram.com/mily_chan36",
    ctaLabel: "Instagramプロフィールを見る",
    media: morningOhayo20260821,
    message: {
      label: "みりぃのメッセージ",
      text: "OHAYO!",
    },
  },
  {
    id: "2026-08-21-morning-showroom-runway",
    date: "2026-08-21",
    activityIds: ["live-stream"],
    title: "朝7:00からSHOWROOM配信📡❤️‍🔥",
    body: "8月21日の朝、みりぃが7:00からのSHOWROOM配信を案内しました。投稿では、26日までランウェイをかけたイベントに参加していることを伝え、応援を呼びかけています。",
    source: morningShowroomRunwayVideo.sourceUrl,
    sourceLabel: "Xの投稿を見る",
    media: morningShowroomRunwayVideo,
    message: {
      label: "みりぃの投稿",
      text: "おはよ〜🔅\n今日も一緒に頑張ろうねん\n\n7:00〜SHOWROOMにて配信しますよっ！\n26日までガチイベ中で、ランウェイかけて配信しております🛜❤️‍🔥\n待ってる〜！\n\n応援よろしくお願いいたします🥺\n\n⬇️昨日の動画🎥\n#ミスサー #ミスサークルコンテスト2026 #ミスサークル #ミスサークルコンテスト",
    },
  },
  {
    id: "2026-08-20-mango-kakigori",
    date: "2026-08-20",
    title: "今年初のマンゴーかき氷🍧🥭",
    body: "今年初のかき氷を楽しんだことを、みりぃがInstagramで紹介しました。マンゴーのかき氷にヨーグルトとはちみつがかかり、コムハニーもトッピングされています。",
    source: "https://www.instagram.com/p/DcQqmIwk1_l/",
    sourceLabel: "Instagramの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b10-05-mango-kakigori-front.jpg",
      width: 960,
      height: 1280,
      alt: "マンゴーかき氷を前にスプーンを持ってカメラを見るみりぃ",
    },
  },
  {
    id: "2026-08-20-morning-message",
    date: "2026-08-20",
    title: "おはよう‼︎🌞 無理せず、今日も一緒に",
    body: "8月20日の朝、みりぃがXに投稿しました。「今日も自分のできることを無理せず」と伝え、「私もみんなと一緒に頑張るね」という言葉を届けています。",
    source: "https://x.com/mily_chan36/status/2090242507586322892",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b08-01-do-what-you-can-morning.jpg",
      width: 1538,
      height: 2048,
      alt: "室内の鏡の前でスマートフォンを持って撮影するみりぃ",
    },
    message: {
      label: "みりぃの投稿",
      text: "おはよう‼︎🌞\n今日も自分のできることを無理せず。\n私もみんなと一緒に頑張るね🙂‍↕️\n#ミスサー #ミスサークルコンテスト #ミスサー2026 #ミスサークルコンテスト2026 #ミスサークル2026",
    },
  },
  {
    id: "2026-08-20-morning-story",
    date: "2026-08-20",
    title: "おはよう☀️ 今日も自分ができることを〜♪",
    body: "8月20日の朝、みりぃからInstagram Storyが届きました。「今日も自分ができることを〜♪」という言葉とともに、「おはよう」のひとコマです。",
    sourceLabel: morningStory20260820.sourceLabel,
    media: morningStory20260820,
    message: {
      label: "みりぃのメッセージ",
      text: "8/20 (木) 今日も自分ができることを〜♪",
    },
  },
  {
    id: "2026-08-19-second-round-result",
    date: "2026-08-19",
    activityIds: ["miss-circle"],
    title: "MISS CIRCLE CONTEST 2026 2次審査通過！三次審査進出へ✨",
    body: "みりぃが「MISS CIRCLE CONTEST 2026」の2次審査通過と、三次審査への進出を報告しました。毎日の投票やSHOWROOMでの応援への感謝とともに、「一緒に絶景観に行きましょう」とこれからの挑戦への言葉を届けています。",
    source: "https://x.com/Mily_chan36/status/2089996508691390948",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/second-round-result-2026/",
    ctaLabel: "2次審査通過の記録を読む",
    media: autumnLeafNewsImage,
  },
  {
    id: "2026-08-19-well-rested-morning",
    date: "2026-08-19",
    title: "体調回復❤️‍🩹 元気に朝のごあいさつ☀️",
    body: "しっかり眠れて体調が回復したことを、みりぃが朝のX投稿で報告しました。心配してくれたみんなへのお礼と、「今日もみんなと一緒に頑張るぞぃ〜〜🍀」という言葉が届いています。",
    source: "https://x.com/Mily_chan36/status/2089841199280742669",
    sourceLabel: "Xの投稿を見る",
    media: {
      kind: "image",
      src: "/media/news/mily-b06-01-recovery-morning.jpg",
      width: 1162,
      height: 2048,
      alt: "ウインクしてピースするみりぃの自撮り。動物フィルターと朝のあいさつ文字入り",
    },
    message: {
      label: "みりぃの投稿",
      text: "おはよう〜☀️\n体調回復❤️‍🩹\nしっかり寝ました！！！\n\nみんな心配ありがとう🥹❣️\n今日もみんなと一緒に頑張るぞぃ〜〜🍀\n\n#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークルコンテスト2026 #ミスコン",
    },
  },
  {
    id: "2026-08-18-evening-radio",
    date: "2026-08-18",
    activityIds: ["radio", "live-stream"],
    title: "ラジオ配信ありがとうございました",
    body: "体は本調子ではないなかでもラジオ配信を届けてくれたみりぃから、見に来てくれた人へのお礼が届きました。翌日の配信は夜になる予定で、時間は当日改めて伝えるとのこと。",
    source: "https://x.com/Mily_chan36/status/2089721650522820667",
    sourceLabel: "Xの投稿を見る",
    url: "/stories/2026-08-18-radio/",
    ctaLabel: "配信の記録を読む",
    media: eveningRadioShowroomImage,
    message: {
      label: "みりぃの投稿",
      text: `大元は元気なのに、体だけが追いつかない状況下のラジオ配信ありがとうございました🥲🙌🏻🩵

体調管理はね？自分でしていかないと。

明日の配信時間はまた明日伝えるよ〜！
ちなみに夜になると思う🥺
元気なみりぃに会いにきてね~‼︎

#ミスサー #ミスサークルコンテスト2026 #ミスサークル2026`,
    },
  },
  {
    id: "2026-08-18-morning-update",
    date: "2026-08-18",
    activityIds: ["live-stream"],
    title: "おはよう〜☀️ 10:50〜11:30配信予定",
    body: "「リビングで寝なかったよ😳（成長を感じるね）」から始まった朝の投稿。今日は大学の友達との予定の前に、10:50〜11:30まで配信予定。ビギナーイベントにも参加中です。",
    sourceLabel: "みりぃからの連絡💌",
    url: "https://www.showroom-live.com/r/circle2026_0734",
    ctaLabel: "SHOWROOMで応援する",
    media: {
      kind: "video",
      src: "/media/gallery/mily-b04-01-morning-showroom-ios.mp4",
      poster: "/media/gallery/mily-b04-01-morning-showroom-poster.jpg",
      width: 160,
      height: 284,
      alt: "朝の配信画面でピースをしながらウインクするみりぃの動画",
    },
    message: {
      label: "みりぃのメッセージ",
      text: "昨日は高校の友達。今日は大学の友達と予定があるから、【10:50〜11:30】まで配信しようかと思ってるよ〜‼️ ビギナーイベントも参加してみたの！！！ 気軽に遊びに来てね🍀✨ ぜひキラ星から応援お願いいたします🥺🙌🏻",
    },
  },
  {
    id: "2026-08-17-morning-story",
    date: "2026-08-17",
    title: "おはよう☀️ 朝のストーリー",
    body: "猫耳フィルターで「OHAYO!!」。みりぃから届いた朝のひとコマ。",
    sourceLabel: morningStoryVideo.sourceLabel,
    media: morningStoryVideo,
    message: {
      label: "みりぃのメッセージ",
      text: "8/17（月）今日からお仕事が始まる皆さん応援して…",
    },
  },
  {
    id: "2026-08-08-second-round-timetable",
    date: "2026-08-08",
    activityIds: ["miss-circle"],
    title: "2次審査期間の配信スケジュール📣",
    body: "8月8日、みりぃがXで「私は皆と絶景見に行くよ」と伝え、MISS CIRCLE CONTEST 2026の2次審査期間の配信スケジュールを画像で案内しました。配信時刻は画像の案内であり、このサイトの配信予定一覧へは転記していません。",
    source: "https://x.com/Mily_chan36/status/2086092518719140028",
    sourceLabel: "Xの投稿を見る",
    media: secondRoundTimetableImage,
    message: {
      label: "みりぃの投稿",
      text: "私は皆と絶景見に行くよ🙂‍↕️🩷\n#ミスサークルコンテスト2026 #ミスサー2026 #ミスサー #ミスコン #SHOWROOM",
    },
  },
  {
    id: "2026-08-06-ohayo-morning-stream",
    date: "2026-08-06",
    activityIds: ["live-stream"],
    title: "おはよ🔅 今日AM 10:00〜",
    body: "8月6日の朝、みりぃがXで「おはよ」とあいさつし、当日AM 10:00〜の配信への応援を呼びかけました。添えた写真は白いポロシャツでピースをした自撮りに、星のステッカーと「OHAYO」の文字が重ねられています。",
    source: OHAYO_WHITE_POLO_X_URL,
    sourceLabel: "Xの投稿を見る",
    media: ohayoWhitePoloPeaceImage,
    message: {
      label: "みりぃの投稿",
      text: "おはよ🔅\n今日AM 10:00〜\nよろしくお願いします😽🙌🏻❤️‍🔥",
    },
  },
  {
    id: "2026-08-05-panda-past-pic",
    date: "2026-08-05",
    activityIds: ["live-stream"],
    title: "おはよう（過去pic）12:30〜と14:30〜の配信案内",
    body: "8月5日の朝、みりぃがXで当日12:30〜13:30と14:30〜15:30に1時間ずつの配信を案内しました。添えた写真には「おはよう」「※過去pic」とあり、投稿時点の新しい撮影ではなく過去の写真であることを示しています。パンダ耳と鼻のフィルター、顔のグリッターが入った自撮りです。",
    source: "https://x.com/Mily_chan36/status/2084752452373680152",
    sourceLabel: "Xの投稿を見る",
    media: pandaPastPicImage,
    message: {
      label: "みりぃの投稿",
      text: "今日は\n12:30〜13:30\n14:30〜15:30\n1時間ずつ配信よろしくね🫣❤️‍🔥",
    },
  },
  {
    id: "2026-08-02-21st-birthday",
    date: "2026-08-02",
    title: "21歳の誕生日を迎えました",
    body: "21歳の誕生日。お祝いしてくれたみなさんへの感謝と、「考えていることを脳内に留めず行動に移す。」という21歳の抱負。",
    source: "https://www.instagram.com/p/DbiY3PHk1c8/",
    additionalSources: [
      {
        label: "Xの投稿を見る",
        url: BIRTHDAY_INDOOR_SELFIE_X_URL,
      },
    ],
    ctaLabel: "Instagramの投稿を見る",
    media: birthdayIndoorSelfieImage,
  },
  {
    id: "2026-04-23-tiktok-sayonara-ichigo",
    date: "2026-04-23",
    title: "「さよならいちごちゃん」で踊ってみた🍓",
    body: "4月23日、湘南シーサイドサークルのTikTokに、みりぃが「さよならいちごちゃん」に合わせて踊る動画が投稿されました。フルで聴くと考えさせられることが多く、好きな曲だと綴っています。",
    source: tiktokSayonaraIchigoVideo.sourceUrl,
    sourceLabel: "湘南シーサイドサークルのTikTok投稿を見る",
    media: tiktokSayonaraIchigoVideo,
    message: {
      label: "湘南シーサイドサークルの投稿",
      text:
        "この曲のフル、考えさせられること多くて\n" +
        "好きなんだよね^_^\n" +
        "『君の頭がいちごでできてるってこと🍓』\n" +
        "💞♬ #さよならいちごちゃん #fyp #踊ってみた",
    },
  },
];

export function sortNewsByDateDesc(items: NewsItem[]): NewsItem[] {
  return items
    .map((item, sourceIndex) => ({ item, sourceIndex }))
    .sort((a, b) => {
      const byDate = b.item.date.localeCompare(a.item.date);
      if (byDate !== 0) return byDate;

      const bySameDayOrder =
        (b.item.sameDayOrder ?? 0) - (a.item.sameDayOrder ?? 0);
      if (bySameDayOrder !== 0) return bySameDayOrder;

      return a.sourceIndex - b.sourceIndex;
    })
    .map(({ item }) => item);
}
