import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  galleryVideos,
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  patonVoteCollageStoryVideo,
  patonVoteMirrorStoryVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b41.ts";
import { highlights } from "../src/data/highlights.ts";
import { media, visibleMedia } from "../src/data/media.ts";
import { followers400StoryVideo } from "../src/data/followers400StoryVideo.ts";
import { morningStreamThanksInstagramStoryImage } from "../src/data/morningStreamThanksInstagramStoryImage.ts";
import {
  patonVoteCollageStillImage,
  patonVoteCollageStillPhoto,
  patonVoteMirrorStillImage,
  patonVoteMirrorStillPhoto,
} from "../src/data/patonVoteStoryStills.ts";
import { contest } from "../src/data/contest.ts";
import { campusGirlsPatonPortraitImage } from "../src/data/campusGirlsPatonImages.ts";
import { events } from "../src/data/events.ts";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import { createPortalFeed } from "./fixtures/portal-feed-before-b41.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityNews } from "./fixtures/activity-content-before-b41.ts";
import { selectActivityMedia } from "./fixtures/activity-media-before-b41.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");

const VOTE_NEWS_ID = "2026-08-26-paton-vote-stories";
const FOLLOWERS_NEWS_ID = "2026-08-26-instagram-followers-400";
const THANKS_NEWS_ID = "2026-08-26-morning-stream-thanks";
const STREAM_NEWS_ID = "2026-08-26-stream-1000";
const PATON_NEWS_ID = "2026-08-24-campus-girls-final-stage-guide";
const INSTAGRAM_PROFILE = "https://www.instagram.com/mily_chan36";
const PATON_URL = "https://paton.jp/event/entrant/11380";
const PATON_CTA = "Patonでみりぃに投票する";

const COLLAGE_MP4 = "/media/gallery/mily-b27-01-paton-vote-collage.mp4";
const COLLAGE_POSTER = "/media/gallery/mily-b27-01-paton-vote-collage-poster.jpg";
const MIRROR_MP4 = "/media/gallery/mily-b27-02-paton-vote-mirror.mp4";
const MIRROR_POSTER = "/media/gallery/mily-b27-02-paton-vote-mirror-poster.jpg";
const THANKS_JPG = "/media/news/mily-b27-03-morning-stream-thanks.jpg";
const THANKS_DISPLAY_JPG = "/media/news/mily-b27-03-morning-stream-thanks-1600.jpg";
const FOLLOWERS_MP4 = "/media/news/mily-b27-04-instagram-followers-400.mp4";
const FOLLOWERS_POSTER = "/media/news/mily-b27-04-instagram-followers-400-poster.jpg";
const COLLAGE_STILL_BASE = "/media/gallery/mily-b27-06-paton-vote-collage-still";
const MIRROR_STILL_BASE = "/media/gallery/mily-b27-07-paton-vote-mirror-still";
const COLLAGE_STILL_JPG = `${COLLAGE_STILL_BASE}-1600.jpg`;
const MIRROR_STILL_JPG = `${MIRROR_STILL_BASE}-1600.jpg`;

const COLLAGE_MP4_SHA256 =
  "2a7bacbb3efa14cc5c6d56caea9afa2bfb64753125dae8bcf132721824751109";
const COLLAGE_POSTER_SHA256 =
  "c3fde8d9419c52330e6d3dfdaac4035c9f8ee78b66d13698a7488ee08c30f5eb";
const MIRROR_MP4_SHA256 =
  "484f06618bd30535ffdd6ca5e7c429446cce4374efd4da6899b0dd93a04997bc";
const MIRROR_POSTER_SHA256 =
  "c861d6487ee07a19390cf50bf0a1db316ddf05fdb81d8c79b2b049b8b665a740";
const THANKS_SHA256 =
  "884428f7b233b753b216501097c56ce533f45aa713e49cf04536e042ba17d059";
const THANKS_480_JPG_SHA256 =
  "618954c90b839ca562d7b07397f2a88edb7e00a0006e3e2ced0d143377b4c6df";
const THANKS_960_JPG_SHA256 =
  "158bd5ac83b72497d35c984ca44ca2fbba7ed92f250ef7d7026833a9116e7838";
const THANKS_1600_JPG_SHA256 =
  "cdb1f169f298688e628659878bcc6d2f757d47b6b972e11ffa5d0e967b56a90e";
const THANKS_480_WEBP_SHA256 =
  "02cb8d80a48d93d8a94ed589753bca5d21a5213b5308a23a4289eb2620723d1b";
const THANKS_960_WEBP_SHA256 =
  "4cc66b0d8f2169f80c93c869aef12cf400e5443c31b32c1e500c55ee83eb84f8";
const THANKS_1600_WEBP_SHA256 =
  "df38a10e0ae92576f8e1168ae2ac305fe705850b95077dfbebec6250bf3c7952";
const FOLLOWERS_MP4_SHA256 =
  "f8093200f0705ad347b3bbb768b8fe95d9d7c84e5b568c9b68c394dd1d123082";
const FOLLOWERS_POSTER_SHA256 =
  "ff1b5d2f45863d08cf1ad1bdfe81f0d807dc3e37ee8aa8f8df94010eabecd4a8";
const COLLAGE_STILL_480_SHA256 =
  "478594610776b628a6eee4f1517c2c43a3a2fb6c25f92c092e709c2157b144c8";
const COLLAGE_STILL_960_SHA256 =
  "cff520e6afa06c3aeb97edbdf07dbe12011e16f27faf071b299c7298f1855b00";
const MIRROR_STILL_480_SHA256 =
  "4dcf3f04deeeae5319d1930e6803dab82b877eb35f33e387a38c3f772258c606";
const MIRROR_STILL_960_SHA256 =
  "2581df60447825cb9cb7f016957e7020cec79f8abb5f90e7f9006623ea239795";

const VOTE_MESSAGE =
  "絶対みんなと本戦行くんだ〜！！！\n\n皆さん、やり方わかりますか？？大丈夫？？";
const FOLLOWERS_MESSAGE = [
  `フォロワー様400人\u{203C}\u{FE0F}ありがとうございます\u{1F972}\u{270A}\u{1F3FB}\u{2764}\u{FE0F}\u{200D}\u{1F525}`,
  "",
  "変動もあるかとは思いますが、これからも楽しくInstagramができればいいなぁと！",
  "",
  `これからもいろーーんなこと発信していくね\u{1F4AB}`,
].join("\n");
const THANKS_MESSAGE = [
  `今日も来てくれてありがとう〜\u{1F972}\u{1F64F}\u{2728}`,
  "いやぁ、環境や周りの方々に恵まれているなぁと、心から感じます。",
  `なんだか明日からもまた、前向きに頑張れそう\u{1F60C}`,
  "応援してくださる皆様に日々感謝です。",
  `そして、皆様の応援、絶対に無駄にしないよ\u{203C}\u{FE0F}`,
].join("\n");

const FORBIDDEN = [
  "公式",
  "公認",
  "本人運営",
  "みつぃ",
  "1万",
  "あっきー",
  "ackey",
  "Millie",
  "millie",
];
const SCREENSHOTS = ["IMG_7435", "IMG_7437"];
const OMITTED = ["mily-b27-05", "paton-app"];
const ORIGINALS = [
  "media/original/mily-b27-01-paton-vote-collage.mp4",
  "media/original/mily-b27-02-paton-vote-mirror.mp4",
  "media/original/mily-b27-03-morning-stream-thanks.jpg",
  "media/original/mily-b27-04-instagram-followers-400.mp4",
  "media/original/mily-b27-06-paton-vote-collage-still.jpg",
  "media/original/mily-b27-07-paton-vote-mirror-still.jpg",
];

function voteItem() {
  return news.find((entry) => entry.id === VOTE_NEWS_ID);
}
function followersItem() {
  return news.find((entry) => entry.id === FOLLOWERS_NEWS_ID);
}
function thanksItem() {
  return news.find((entry) => entry.id === THANKS_NEWS_ID);
}
function patonItem() {
  return news.find((entry) => entry.id === PATON_NEWS_ID);
}
function streamItem() {
  return news.find((entry) => entry.id === STREAM_NEWS_ID);
}
function publicFile(src) {
  return path.join(root, "public", src.slice(1));
}
async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}
async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}
async function probe(file) {
  const ffprobe = await ffprobeExe();
  const { stdout } = await run(ffprobe, [
    "-hide_banner",
    "-v",
    "error",
    "-show_format",
    "-show_streams",
    "-print_format",
    "json",
    file,
  ]);
  return JSON.parse(stdout);
}

describe("2026-08-26 Instagram Stories — NEWS trio", () => {
  it("prepends three 8/26 Story items without replacing the existing Paton or stream cards", () => {
    const vote = voteItem();
    const followers = followersItem();
    const thanks = thanksItem();
    const paton = patonItem();
    const stream = streamItem();

    assert.ok(vote);
    assert.ok(followers);
    assert.ok(thanks);
    assert.ok(paton);
    assert.ok(stream);
    assert.equal(news.filter((entry) => entry.id === VOTE_NEWS_ID).length, 1);
    assert.equal(news.filter((entry) => entry.id === FOLLOWERS_NEWS_ID).length, 1);
    assert.equal(news.filter((entry) => entry.id === THANKS_NEWS_ID).length, 1);
    assert.equal(news.length, 49);
    assert.equal(news.filter((entry) => entry.date === "2026-08-26").length, 7);
    assert.equal(vote.date, "2026-08-26");
    assert.equal(vote.sameDayOrder, 3);
    assert.deepEqual(vote.activityIds, ["campus-girls"]);
    assert.equal(followers.date, "2026-08-26");
    assert.equal(followers.sameDayOrder, 2);
    assert.equal(followers.activityIds, undefined);
    assert.equal(thanks.date, "2026-08-26");
    assert.equal(thanks.sameDayOrder, 1);
    assert.deepEqual(thanks.activityIds, ["live-stream"]);
    assert.equal(stream.sameDayOrder, undefined);
    assert.equal(stream.media, undefined);
    assert.deepEqual(verifyNews([vote, followers, thanks]), []);
  });

  it("keeps Story source as a non-link label and uses the Instagram profile CTA, not Paton", () => {
    for (const entry of [voteItem(), followersItem(), thanksItem()]) {
      assert.equal(entry.source, undefined);
      assert.equal(entry.sourceLabel, "Instagram Story");
      assert.equal(entry.url, INSTAGRAM_PROFILE);
      assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
      assert.notEqual(entry.ctaLabel, PATON_CTA);
      assert.notEqual(entry.url, PATON_URL);
      assert.doesNotMatch(JSON.stringify(entry), /paton\.jp/);
    }

    const paton = patonItem();
    assert.equal(paton.ctaLabel, PATON_CTA);
    assert.equal(paton.url, PATON_URL);
    assert.equal(paton.source, "https://x.com/mily_chan36/status/2091669951946121636");
    assert.deepEqual(paton.additionalSources, [
      {
        label: "8月26日のX投稿を見る",
        url: "https://x.com/mily_chan36/status/2092456392343138339",
      },
    ]);
  });

  it("keeps reply comments and overlay text verbatim, with pinned emoji code points", () => {
    const vote = voteItem();
    const followers = followersItem();
    const thanks = thanksItem();

    assert.equal(vote.message?.label, "みりぃのStory");
    assert.equal(vote.message?.text, VOTE_MESSAGE);
    assert.match(vote.message.text, /^絶対みんなと本戦行くんだ〜！！！\n\n/u);
    assert.match(vote.message.text, /皆さん、やり方わかりますか？？大丈夫？？$/u);

    assert.equal(followers.message?.label, "みりぃのStory");
    assert.equal(followers.message?.text, FOLLOWERS_MESSAGE);
    assert.match(followers.message.text, /\u{1F972}/u);
    assert.match(followers.message.text, /\u{270A}\u{1F3FB}/u);
    assert.match(followers.message.text, /\u{2764}\u{FE0F}\u{200D}\u{1F525}/u);
    assert.match(followers.message.text, /\u{1F4AB}/u);
    assert.doesNotMatch(followers.message.text, /\u{1F44A}/u);
    assert.doesNotMatch(followers.message.text, /\u{1F62E}/u);
    assert.doesNotMatch(followers.message.text, /\u{1F924}/u);

    assert.equal(thanks.message?.label, "みりぃのStory");
    assert.equal(thanks.message?.text, THANKS_MESSAGE);
    assert.match(thanks.message.text, /\u{1F60C}/u);
    assert.doesNotMatch(thanks.message.text, /\u{1F606}/u);
    assert.doesNotMatch(thanks.message.text, /10:00/);
  });

  it("keeps archive copy concise and source-faithful", () => {
    const vote = voteItem();
    const followers = followersItem();
    const thanks = thanksItem();

    assert.match(vote.title, /本戦|投票/);
    assert.doesNotMatch(vote.title, /Paton|paton/);
    assert.match(vote.body, /予選ファイナルの毎日投票/);
    assert.match(vote.body, /8月26日18:00/);
    assert.match(vote.body, /9月1日23:59/);
    assert.match(vote.body, /絶対みんなと本戦行くんだ〜！！！/);
    assert.match(vote.body, /皆さん、やり方わかりますか？？大丈夫？？/);
    assert.match(vote.body, /Patonから毎日応援/);
    assert.doesNotMatch(vote.body, /コラージュ|リンクステッカー|鏡のStory/);
    assert.doesNotMatch(vote.body, /順位|他の出場|あっきー/);

    assert.match(followers.body, /みりぃ/);
    assert.match(followers.body, /400人/);
    assert.match(followers.body, /Instagramを楽しみながら/);
    assert.doesNotMatch(
      followers.body,
      /三橋莉子（みりぃ）のフォロワー|変動もあるかもしれないとしつつ/,
    );
    assert.doesNotMatch(followers.body, /みつぃ|1万/);

    assert.match(thanks.body, /感謝/);
    assert.match(thanks.body, /前向きに頑張れそう/);
    assert.match(thanks.body, /無駄にしない/);
    assert.doesNotMatch(thanks.body, /10:00|11:00|配信予定/);

    for (const entry of [vote, followers, thanks]) {
      const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;
      for (const phrase of FORBIDDEN) {
        assert.equal(copy.includes(phrase), false, `${entry.id}: ${phrase}`);
      }
    }
  });

  it("orders the 8/26 items with the GirlsAward X post first", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night")).map((entry) => entry.id);
    assert.deepEqual(ordered.slice(0, 9), [
      "2026-08-26-girlsaward-showroom-6th",
      VOTE_NEWS_ID,
      FOLLOWERS_NEWS_ID,
      THANKS_NEWS_ID,
      "2026-08-26-girl-award-event-fanroom",
      "2026-08-26-mixch-15x-day",
      STREAM_NEWS_ID,
      "2026-08-25-mixch-confidence-message",
      "2026-08-25-motivation",
    ]);
    assert.ok(ordered.includes(PATON_NEWS_ID));
  });
});

describe("2026-08-26 Instagram Stories — shared collage and mirror Gallery videos", () => {
  it("shares one Gallery object each with Latest, newest-first, both published", () => {
    const vote = voteItem();
    const visible = visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5");

    assert.equal(vote.media, patonVoteMirrorStillImage);
    assert.deepEqual(vote.additionalMedia, [
      patonVoteCollageStillImage,
      patonVoteMirrorStoryVideo,
      patonVoteCollageStoryVideo,
    ]);
    assert.deepEqual(newsDisplayMedia(vote), [
      patonVoteMirrorStillImage,
      patonVoteCollageStillImage,
      patonVoteMirrorStoryVideo,
      patonVoteCollageStoryVideo,
    ]);
    assert.equal(galleryVideos[2], patonVoteMirrorStoryVideo);
    assert.equal(galleryVideos[3], patonVoteCollageStoryVideo);
    assert.equal(galleryVideos[17], mixchExpressiveMovie);
    assert.equal(galleryVideos[18], mixch15xDayMovie);
    assert.equal(galleryVideos[19], mixchConfidenceMessageMovie);
    assert.equal(visible[0], patonVoteMirrorStoryVideo);
    assert.equal(visible[1], patonVoteCollageStoryVideo);
    assert.equal(visible[15], mixch15xDayMovie);
    assert.equal(visible[16], mixchConfidenceMessageMovie);
    assert.equal(galleryVideos.length, 20);
    assert.equal(visible.length, 17);

    for (const video of [patonVoteMirrorStoryVideo, patonVoteCollageStoryVideo]) {
      assert.equal(video.kind, "video");
      assert.equal(video.published, true);
      assert.equal(video.provenance, "owner-provided");
      assert.equal(video.sourceLabel, "Instagram Story");
      assert.equal(video.sourceDate, "2026-08-26");
      assert.equal(video.width, 720);
      assert.equal(video.height, 1280);
      assert.equal("sourceUrl" in video, false);
      assert.match(video.src, /^\/media\/gallery\//);
      assert.match(video.poster, /^\/media\/gallery\//);
    }
    assert.equal(patonVoteMirrorStoryVideo.src, MIRROR_MP4);
    assert.equal(patonVoteMirrorStoryVideo.poster, MIRROR_POSTER);
    assert.equal(patonVoteCollageStoryVideo.src, COLLAGE_MP4);
    assert.equal(patonVoteCollageStoryVideo.poster, COLLAGE_POSTER);
  });

  it("keeps the public collage and mirror files at the committed hashes and duration", async () => {
    const collageFile = publicFile(COLLAGE_MP4);
    const collagePoster = publicFile(COLLAGE_POSTER);
    const mirrorFile = publicFile(MIRROR_MP4);
    const mirrorPoster = publicFile(MIRROR_POSTER);

    assert.equal(existsSync(collageFile), true);
    assert.equal(existsSync(collagePoster), true);
    assert.equal(existsSync(mirrorFile), true);
    assert.equal(existsSync(mirrorPoster), true);
    assert.equal(await sha256(collageFile), COLLAGE_MP4_SHA256);
    assert.equal(await sha256(collagePoster), COLLAGE_POSTER_SHA256);
    assert.equal(await sha256(mirrorFile), MIRROR_MP4_SHA256);
    assert.equal(await sha256(mirrorPoster), MIRROR_POSTER_SHA256);
    assert.equal(await isFaststart(collageFile), true);
    assert.equal(await isFaststart(mirrorFile), true);
    await validateVideoDerivatives(patonVoteCollageStoryVideo, galleryDirectory);
    await validateVideoDerivatives(patonVoteMirrorStoryVideo, galleryDirectory);

    const collage = await probe(collageFile);
    const mirror = await probe(mirrorFile);
    assert.equal(collage.format.duration, "20.000000");
    assert.equal(collage.streams[0].width, 720);
    assert.equal(collage.streams[0].height, 1280);
    assert.equal(collage.streams.some((stream) => stream.codec_type === "audio"), false);
    assert.equal(mirror.format.duration, "5.000000");
    assert.equal(mirror.streams[0].width, 720);
    assert.equal(mirror.streams[0].height, 1280);
    assert.equal(mirror.streams.some((stream) => stream.codec_type === "audio"), false);

    for (const poster of [collagePoster, mirrorPoster]) {
      const metadata = await sharp(poster).metadata();
      assert.equal(metadata.width, 720);
      assert.equal(metadata.height, 1280);
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.iptc, undefined);
      assert.equal(metadata.xmp, undefined);
      assert.equal(metadata.icc, undefined);
    }
  });
});

describe("2026-08-26 Instagram Stories — Gallery still photos", () => {
  it("publishes the mirror and collage stills in media.ts without cropping portraits", () => {
    const visible = visibleMedia(media);

    assert.equal(media.filter((entry) => entry.id === "mily-b27-07").length, 1);
    assert.equal(media.filter((entry) => entry.id === "mily-b27-06").length, 1);
    assert.equal(visible[11], patonVoteMirrorStillPhoto);
    assert.equal(visible[12], patonVoteCollageStillPhoto);
    assert.equal(media.filter((entry) => entry.kind === "photo").length, 33);

    for (const photo of [patonVoteMirrorStillPhoto, patonVoteCollageStillPhoto]) {
      assert.equal(photo.kind, "photo");
      assert.equal(photo.published, true);
      assert.equal(photo.provenance, "owner-provided");
      assert.equal(photo.sourceUrl, null);
      assert.equal(photo.sourceDate, "2026-08-26");
      assert.equal(photo.credit, null);
      assert.deepEqual(photo.widths, [480, 960, 1600]);
      assert.equal(photo.width, 720);
      assert.equal(photo.height, 1280);
      assert.equal(photo.aspect, "720 / 1280");
      assert.notEqual(photo.featured, true);
    }
    assert.equal(patonVoteMirrorStillPhoto.basePath, MIRROR_STILL_BASE);
    assert.equal(patonVoteCollageStillPhoto.basePath, COLLAGE_STILL_BASE);
    assert.equal(patonVoteMirrorStillImage.src, MIRROR_STILL_JPG);
    assert.equal(patonVoteCollageStillImage.src, COLLAGE_STILL_JPG);
    assert.equal(patonVoteMirrorStillImage.kind, "image");
    assert.equal(patonVoteCollageStillImage.kind, "image");
  });

  it("keeps the committed still derivatives and matches sha256 for 480 and 960 jpg", async () => {
    for (const [base, w480, w960] of [
      [COLLAGE_STILL_BASE, COLLAGE_STILL_480_SHA256, COLLAGE_STILL_960_SHA256],
      [MIRROR_STILL_BASE, MIRROR_STILL_480_SHA256, MIRROR_STILL_960_SHA256],
    ]) {
      const jpg480 = publicFile(`${base}-480.jpg`);
      const jpg960 = publicFile(`${base}-960.jpg`);
      const jpg1600 = publicFile(`${base}-1600.jpg`);
      const webp960 = publicFile(`${base}-960.webp`);
      const webp1600 = publicFile(`${base}-1600.webp`);

      assert.equal(existsSync(jpg480), true, jpg480);
      assert.equal(existsSync(jpg960), true, jpg960);
      assert.equal(existsSync(jpg1600), true, jpg1600);
      assert.equal(await sha256(jpg480), w480);
      assert.equal(await sha256(jpg960), w960);
      assert.equal(await sha256(jpg1600), w960);
      assert.equal(await sha256(webp960), await sha256(webp1600));

      const small = await sharp(jpg480).metadata();
      const large = await sharp(jpg960).metadata();
      assert.equal(small.width, 480);
      assert.equal(small.height, 853);
      assert.equal(large.width, 720);
      assert.equal(large.height, 1280);
      assert.equal(large.exif, undefined);
      assert.equal(large.iptc, undefined);
      assert.equal(large.xmp, undefined);
      assert.equal(large.icc, undefined);
    }
  });

  it("keeps thanks and followers out of Gallery, media.ts, stories, and highlights", () => {
    assert.equal(thanksItem().media, morningStreamThanksInstagramStoryImage);
    assert.equal(followersItem().media, followers400StoryVideo);
    assert.equal(thanksItem().additionalMedia, undefined);
    assert.equal(followersItem().additionalMedia, undefined);

    assert.equal(morningStreamThanksInstagramStoryImage.kind, "image");
    assert.equal(morningStreamThanksInstagramStoryImage.src, THANKS_DISPLAY_JPG);
    assert.equal(morningStreamThanksInstagramStoryImage.width, 1600);
    assert.equal(morningStreamThanksInstagramStoryImage.height, 2844);
    assert.equal(
      morningStreamThanksInstagramStoryImage.srcSet,
      "/media/news/mily-b27-03-morning-stream-thanks-480.jpg 480w, /media/news/mily-b27-03-morning-stream-thanks-960.jpg 960w, /media/news/mily-b27-03-morning-stream-thanks-1600.jpg 1600w",
    );
    assert.equal(
      morningStreamThanksInstagramStoryImage.webpSrcSet,
      "/media/news/mily-b27-03-morning-stream-thanks-480.webp 480w, /media/news/mily-b27-03-morning-stream-thanks-960.webp 960w, /media/news/mily-b27-03-morning-stream-thanks-1600.webp 1600w",
    );
    assert.equal("sourceUrl" in morningStreamThanksInstagramStoryImage, false);

    assert.equal(followers400StoryVideo.kind, "video");
    assert.equal(followers400StoryVideo.src, FOLLOWERS_MP4);
    assert.equal(followers400StoryVideo.poster, FOLLOWERS_POSTER);
    assert.equal(followers400StoryVideo.published, true);
    assert.equal(followers400StoryVideo.provenance, "owner-provided");
    assert.equal(followers400StoryVideo.sourceLabel, "Instagram Story");
    assert.equal(followers400StoryVideo.sourceDate, "2026-08-26");
    assert.equal("sourceUrl" in followers400StoryVideo, false);
    assert.match(followers400StoryVideo.src, /^\/media\/news\//);

    for (const id of [
      "mily-b27-03",
      "mily-b27-04",
      THANKS_NEWS_ID,
      FOLLOWERS_NEWS_ID,
    ]) {
      assert.equal(galleryVideos.some((entry) => entry.id.includes(id)), false, id);
      assert.equal(media.some((entry) => entry.id.includes(id)), false, id);
      assert.equal(highlights.some((entry) => entry.id.includes(id)), false, id);
    }
    assert.equal(
      stories.some((story) =>
        ["paton-vote", "followers-400", "morning-stream-thanks", "b27"].some((part) =>
          story.slug.includes(part),
        ),
      ),
      false,
    );
  });

  it("hashes the NEWS-only public files and excludes screenshots and b27-05", async () => {
    const thanksFile = publicFile(THANKS_JPG);
    const followersFile = publicFile(FOLLOWERS_MP4);
    const followersPoster = publicFile(FOLLOWERS_POSTER);

    assert.equal(existsSync(thanksFile), true);
    assert.equal(existsSync(followersFile), true);
    assert.equal(existsSync(followersPoster), true);
    assert.equal((await stat(thanksFile)).size, 872631);
    assert.equal(await sha256(thanksFile), THANKS_SHA256);
    assert.equal(await sha256(followersFile), FOLLOWERS_MP4_SHA256);
    assert.equal(await sha256(followersPoster), FOLLOWERS_POSTER_SHA256);
    assert.equal(await isFaststart(followersFile), true);

    const thanksMeta = await sharp(thanksFile).metadata();
    assert.equal(thanksMeta.width, 3870);
    assert.equal(thanksMeta.height, 6879);
    assert.equal(thanksMeta.exif, undefined);
    assert.equal(thanksMeta.iptc, undefined);
    assert.equal(thanksMeta.xmp, undefined);
    assert.equal(thanksMeta.icc, undefined);
    assert.equal(thanksMeta.chromaSubsampling, "4:4:4");
    assert.equal(thanksMeta.isProgressive, true);

    for (const [relative, width, height, digest] of [
      ["mily-b27-03-morning-stream-thanks-480.jpg", 480, 853, THANKS_480_JPG_SHA256],
      ["mily-b27-03-morning-stream-thanks-960.jpg", 960, 1706, THANKS_960_JPG_SHA256],
      ["mily-b27-03-morning-stream-thanks-1600.jpg", 1600, 2844, THANKS_1600_JPG_SHA256],
      ["mily-b27-03-morning-stream-thanks-480.webp", 480, 853, THANKS_480_WEBP_SHA256],
      ["mily-b27-03-morning-stream-thanks-960.webp", 960, 1706, THANKS_960_WEBP_SHA256],
      ["mily-b27-03-morning-stream-thanks-1600.webp", 1600, 2844, THANKS_1600_WEBP_SHA256],
    ]) {
      const file = path.join(root, "public/media/news", relative);
      const meta = await sharp(file).metadata();
      assert.equal(existsSync(file), true, relative);
      assert.equal(meta.width, width, relative);
      assert.equal(meta.height, height, relative);
      assert.equal(meta.exif, undefined, relative);
      assert.equal(await sha256(file), digest, relative);
    }

    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const newsImage = await readFile(path.join(root, "src/components/NewsImage.tsx"), "utf8");
    assert.match(latest, /NewsImage/);
    assert.match(newsImage, /webpSrcSet/);
    assert.match(newsImage, /srcSet=\{media\.srcSet\}/);

    const followersInfo = await probe(followersFile);
    assert.equal(followersInfo.format.duration, "5.000000");
    assert.equal(followersInfo.streams[0].width, 720);
    assert.equal(followersInfo.streams[0].height, 1280);
    assert.equal(
      followersInfo.streams.some((stream) => stream.codec_type === "audio"),
      false,
    );

    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));
    for (const marker of [...SCREENSHOTS, ...OMITTED]) {
      assert.equal(
        publicFiles.some((file) => file.includes(marker)),
        false,
        marker,
      );
      assert.equal(
        galleryVideos.some((entry) => JSON.stringify(entry).includes(marker)),
        false,
        marker,
      );
      assert.equal(
        media.some((entry) => JSON.stringify(entry).includes(marker)),
        false,
        marker,
      );
    }
  });
});

describe("2026-08-26 Instagram Stories — scope, gitignore, and docs", () => {
  it("keeps originals ignored and out of git", async () => {
    for (const relative of ORIGINALS) {
      const { stdout: ignored } = await run(
        "git",
        ["check-ignore", "-v", "--", relative],
        { cwd: root },
      );
      const { stdout: tracked } = await run("git", ["ls-files", "--", relative], {
        cwd: root,
      });
      assert.match(ignored, /media\/original\/\*/);
      assert.equal(tracked.trim(), "");
    }
  });

  it("does not add schedule rows, /stories/ articles, Mixch, or Drive ids", async () => {
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );
    assert.equal(JSON.stringify(contest).includes("b27"), false);
    assert.equal(existsSync(path.join(root, "stories", VOTE_NEWS_ID)), false);
    assert.equal(existsSync(path.join(root, "stories", FOLLOWERS_NEWS_ID)), false);
    assert.equal(existsSync(path.join(root, "stories", THANKS_NEWS_ID)), false);

    const scoped = [
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "src/data/media.ts",
      "src/data/patonVoteCollageStoryVideo.json",
      "src/data/patonVoteMirrorStoryVideo.json",
      "src/data/followers400StoryVideo.json",
      "src/data/morningStreamThanksInstagramStoryImage.ts",
      "src/data/patonVoteStoryStills.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];
    for (const relative of scoped) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(findDriveIds(source).length, 0, relative);
      assert.doesNotMatch(source, DRIVE_HOST_PATTERN);
      assert.doesNotMatch(source, /docs\.google\.com/i);
      for (const marker of [...SCREENSHOTS, ...OMITTED]) {
        if (relative === "docs/MEDIA.md") continue;
        assert.equal(source.includes(marker), false, `${relative}: ${marker}`);
      }
    }

    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(docs, /batch b27/);
    assert.equal(docs.includes(COLLAGE_MP4_SHA256), true);
    assert.equal(docs.includes(MIRROR_MP4_SHA256), true);
    assert.equal(docs.includes(THANKS_SHA256), true);
    assert.equal(docs.includes(THANKS_1600_JPG_SHA256), true);
    assert.equal(docs.includes(FOLLOWERS_MP4_SHA256), true);
    assert.equal(docs.includes(COLLAGE_STILL_960_SHA256), true);
    assert.equal(docs.includes(MIRROR_STILL_960_SHA256), true);
    assert.equal(docs.includes(COLLAGE_STILL_480_SHA256), true);
    assert.equal(docs.includes(MIRROR_STILL_480_SHA256), true);
    assert.match(docs, /b27-06/);
    assert.match(docs, /b27-07/);
    assert.match(docs, /IMG_7435 \/ IMG_7437/);
    assert.match(docs, /b27-05/);
    assert.match(docs, /他出場者・順位/);
    assert.match(docs, /あっきー/);
    assert.match(docs, /投票CTA/);
    assert.match(ops, /48件/);
    assert.match(ops, /独立動画21本/);
    assert.doesNotMatch(ops, /独立動画12本/);
  });

  it("appears on CAMPUS GIRLS and LIVE STREAM through explicit activityIds", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const campusMedia = selectActivityMedia("campus-girls");
    const liveMedia = selectActivityMedia("live-stream");

    assert.equal(campusNews[0]?.id, "2026-08-28-paton-vote-day-3");
    assert.equal(campusNews[1]?.id, "2026-08-27-paton-vote-how-to");
    assert.equal(campusNews[2]?.id, "2026-08-27-mixch-expressive");
    assert.equal(campusNews[3]?.id, VOTE_NEWS_ID);
    assert.equal(liveNews[0]?.id, "2026-08-28-stream-thanks");
    assert.equal(liveNews[1]?.id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(liveNews[2]?.id, THANKS_NEWS_ID);
    assert.equal(liveNews[3]?.id, "2026-08-26-girl-award-event-fanroom");
    assert.ok(liveNews.some((entry) => entry.id === STREAM_NEWS_ID));
    assert.equal(campusNews.some((entry) => entry.id === FOLLOWERS_NEWS_ID), false);
    assert.equal(campusMedia[0], campusGirlsPatonPortraitImage);
    assert.equal(campusMedia[1], patonVoteMirrorStillImage);
    assert.equal(
      liveMedia[0]?.src,
      "/media/news/mily-b28-01-girlsaward-showroom-6th.jpg",
    );
    assert.equal(liveMedia[1], morningStreamThanksInstagramStoryImage);
    assert.equal(
      liveMedia.some((entry) => String(entry.src).includes("b27-04")),
      false,
    );
  });

  it("feeds Portal from the mirror poster and thanks image without inventing Story URLs", () => {
    const feed = createPortalFeed();
    const voteFeed = findFeedItem(feed, portalNewsId(VOTE_NEWS_ID));
    const thanksFeed = findFeedItem(feed, portalNewsId(THANKS_NEWS_ID));
    const followersFeed = findFeedItem(feed, portalNewsId(FOLLOWERS_NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(voteFeed.sourceUrl, INSTAGRAM_PROFILE);
    assert.equal(
      voteFeed.image,
      new URL(MIRROR_STILL_JPG, siteOrigin()).href,
    );
    assert.equal(
      thanksFeed.image,
      new URL(THANKS_DISPLAY_JPG, siteOrigin()).href,
    );
    assert.equal(
      followersFeed.image,
      new URL(FOLLOWERS_POSTER, siteOrigin()).href,
    );
  });
});
