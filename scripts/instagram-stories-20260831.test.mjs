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
import { events } from "../src/data/events.ts";
import { campusGirlsPatonPortraitImage } from "../src/data/campusGirlsPatonImages.ts";
import {
  campusGirlsHoldSecondStoryVideo,
  galleryVideos,
  patonVoteFifteenXStoryVideo,
  patonVoteFirstPlaceStoryVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b58.ts";
import { highlights } from "../src/data/highlights.ts";
import { campusGirlsPatonVoteLink } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import {
  PATON_VOTE_HOW_TO_CTA_LABEL,
  PATON_VOTE_HOW_TO_CTA_URL,
  patonVoteHowToSpokenMessage,
} from "../src/data/patonVoteHowTo.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { campusGirlsFinalStageRankingStoryVideos } from "../src/data/campusGirlsFinalStageStorySeries.ts";
import { contest } from "../src/data/contest.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { isFaststart } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { findFeedItem, portalNewsId } from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const instagramProfile = "https://www.instagram.com/mily_chan36";
const showroom = "https://www.showroom-live.com/r/circle2026_0734";
const duringVote = Date.parse("2026-08-31T12:00:00+09:00");
const afterVote = Date.parse("2026-09-02T00:00:00+09:00");

const FIRST_PLACE_NEWS_ID = "2026-08-31-paton-first-place-story";
const FIFTEEN_X_NEWS_ID = "2026-08-31-paton-15x-day-story";
const HOW_TO_NEWS_ID = "2026-08-31-paton-vote-how-to-story";
const THIRTY_DAY_NEWS_ID = "2026-08-30-showroom-30-day-story";

const fixtures = [
  {
    newsId: FIRST_PLACE_NEWS_ID,
    item: patonVoteFirstPlaceStoryVideo,
    original: "mily-b44-02-paton-vote-first-place-story.mp4",
    publicVideo: "mily-b44-02-paton-vote-first-place-story.mp4",
    poster: "mily-b44-02-paton-vote-first-place-story-poster.jpg",
    originalBytes: 4_162_416,
    originalSha256:
      "bd11cc6f148c20bd4b44657e4cd821ca0dba2e7a7667471ee7d38cb0b7da3a38",
    publicBytes: 371_605,
    publicSha256:
      "a59d8adec43f01139fdb6b11293eb2369f68776daf90af82b269618ab1777629",
    posterBytes: 67_048,
    posterSha256:
      "398b653bdaada3949ef3ca01c1f0a6a099a5f8eb74d6f2553945a5bbc86ac403",
    sourceDate: "2026-08-31",
    width: 720,
    height: 1280,
    avgFrameRate: "30/1",
    nbFrames: "600",
    duration: 20.0,
    originalAudioRate: "44100",
    activityIds: ["campus-girls"],
  },
  {
    newsId: FIFTEEN_X_NEWS_ID,
    item: patonVoteFifteenXStoryVideo,
    original: "mily-b44-01-paton-vote-15x-emergency-story.mp4",
    publicVideo: "mily-b44-01-paton-vote-15x-emergency-story.mp4",
    poster: "mily-b44-01-paton-vote-15x-emergency-story-poster.jpg",
    originalBytes: 853_891,
    originalSha256:
      "4039c74c2dcaa3c8218ef74fbb9381d84bcfcd7ba76264a4f1bf19c5a77150b7",
    publicBytes: 102_549,
    publicSha256:
      "661cc821dcbe94dd76703648fa812101375c18941d0a062f0f767865a07efab9",
    posterBytes: 54_762,
    posterSha256:
      "769fed399973b8bd8ef915d88d47254ccd792a9bf1c7c72628e1fad8e569c77b",
    sourceDate: "2026-08-31",
    width: 720,
    height: 1280,
    avgFrameRate: "30/1",
    nbFrames: "150",
    duration: 5.0,
    activityIds: ["campus-girls"],
  },
];

function newsItem(id) {
  return news.find((entry) => entry.id === id);
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function probe(file) {
  const { stdout } = await run(await ffprobeExe(), [
    "-hide_banner",
    "-v",
    "error",
    "-show_format",
    "-show_streams",
    "-show_chapters",
    "-print_format",
    "json",
    file,
  ]);
  return JSON.parse(stdout);
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function changedText() {
  const files = [
    "docs/CONTENT-OPS.md",
    "docs/MEDIA.md",
    "scripts/fixtures/README.md",
    "scripts/instagram-stories-20260831.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/patonVoteFifteenXStoryVideo.json",
    "src/data/patonVoteFifteenXStoryVideo.ts",
    "src/data/patonVoteFirstPlaceStoryVideo.json",
    "src/data/patonVoteFirstPlaceStoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b44");
      const end = text.indexOf("\n## ", start + 4);
      assert.notEqual(start, -1);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-08-30〜31 Instagram Story — Latest / NEWS", () => {
  it("adds four records in confirmed editorial order and skips the duplicate hold-second Story", () => {
    const ordered = sortNewsByDateDesc(news);
    const firstPlace = newsItem(FIRST_PLACE_NEWS_ID);
    const fifteenX = newsItem(FIFTEEN_X_NEWS_ID);
    const howTo = newsItem(HOW_TO_NEWS_ID);
    const thirtyDay = newsItem(THIRTY_DAY_NEWS_ID);

    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.equal(ordered[4]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(ordered[5]?.id, "2026-09-01-ohayo-september-x");
    assert.equal(ordered[6]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(ordered[7]?.id, "2026-09-01-september-mily-story");
    assert.equal(ordered[8]?.id, "2026-08-31-paton-vote-voice-story");
    assert.equal(ordered[9], firstPlace);
    assert.equal(ordered[10], fifteenX);
    assert.equal(ordered[11], howTo);
    assert.equal(ordered[12]?.id, "2026-08-31-morning-stream-thanks");
    assert.equal(ordered[13]?.id, "2026-08-31-paton-15x-day");
    assert.equal(ordered[14]?.id, "2026-08-31-showroom-wake-me");
    assert.equal(ordered[15]?.id, "2026-08-30-consecutive-stream-30");
    assert.equal(ordered[16]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(ordered[17]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(ordered[18]?.id, "2026-08-30-mixch-final-day");
    assert.equal(ordered[19], thirtyDay);
    assert.equal(ordered[20]?.id, "2026-08-30-paton-rank-3");
    assert.equal(ordered[21]?.id, "2026-08-29-paton-vote-day-5-story");
    assert.equal(firstPlace?.sameDayOrder, 6);
    assert.equal(fifteenX?.sameDayOrder, 5);
    assert.equal(howTo?.sameDayOrder, 4);
    assert.equal(thirtyDay?.sameDayOrder, undefined);
    assert.deepEqual(firstPlace?.activityIds, ["campus-girls"]);
    assert.deepEqual(fifteenX?.activityIds, ["campus-girls"]);
    assert.deepEqual(howTo?.activityIds, ["campus-girls"]);
    assert.deepEqual(thirtyDay?.activityIds, ["live-stream"]);
    assert.equal(news.filter(({ id }) => id === FIRST_PLACE_NEWS_ID).length, 1);
    assert.equal(news.filter(({ id }) => id === FIFTEEN_X_NEWS_ID).length, 1);
    assert.equal(news.filter(({ id }) => id === HOW_TO_NEWS_ID).length, 1);
    assert.equal(news.filter(({ id }) => id === THIRTY_DAY_NEWS_ID).length, 1);
    assert.equal(news.length, 75);
    assert.deepEqual(verifyNews([firstPlace, fifteenX, howTo, thirtyDay]), []);
  });

  it("keeps Story attribution non-link and provides Instagram plus windowed Paton CTAs", () => {
    for (const newsId of [FIRST_PLACE_NEWS_ID, FIFTEEN_X_NEWS_ID, HOW_TO_NEWS_ID]) {
      const entry = newsItem(newsId);
      assert.ok(entry);
      assert.equal(entry.source, undefined);
      assert.equal(entry.sourceLabel, "Instagram Story");
      assert.equal(entry.url, undefined);
      assert.equal(entry.relatedUrl, instagramProfile);
      assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
      assert.deepEqual(entry.additionalCtas, [
        {
          label: campusGirlsPatonVoteLink.label,
          url: campusGirlsPatonVoteLink.url,
        },
      ]);
      assert.deepEqual(resolveNewsLinks(entry, duringVote), {
        relatedUrl: instagramProfile,
        cta: {
          label: "Instagramプロフィールを見る",
          url: instagramProfile,
        },
        additionalCtas: [
          {
            label: campusGirlsPatonVoteLink.label,
            url: campusGirlsPatonVoteLink.url,
          },
        ],
      });
      assert.deepEqual(resolveNewsLinks(entry, afterVote), {
        relatedUrl: instagramProfile,
        cta: {
          label: "Instagramプロフィールを見る",
          url: instagramProfile,
        },
      });
    }
  });

  it("keeps the 30-day anniversary on LIVE STREAM with SHOWROOM CTA and no Paton", () => {
    const entry = newsItem(THIRTY_DAY_NEWS_ID);
    assert.ok(entry);
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, instagramProfile);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.deepEqual(entry.additionalCtas, [
      { label: "SHOWROOMを見る", url: showroom },
    ]);
    assert.deepEqual(resolveNewsLinks(entry, duringVote), {
      relatedUrl: instagramProfile,
      cta: {
        label: "Instagramプロフィールを見る",
        url: instagramProfile,
      },
      additionalCtas: [{ label: "SHOWROOMを見る", url: showroom }],
    });
    assert.equal(entry.url?.includes("?t="), undefined);
    assert.equal(showroom.includes("?t="), false);
  });

  it("shares one manifest object per published Story with Gallery and Portal Feed", () => {
    assert.equal(visibleGalleryVideos()[0]?.id, "mily-b47-01-oyasumily-story");
    assert.equal(visibleGalleryVideos()[1]?.id, "mily-b47-02-paton-second-story");
    assert.equal(visibleGalleryVideos()[2]?.id, "mily-b46-01-paton-vote-final-day-story");
    assert.equal(visibleGalleryVideos()[3]?.id, "mily-b46-02-september-mily-story");
    assert.equal(visibleGalleryVideos()[4]?.id, "mily-b45-01-paton-vote-voice-story");
    assert.equal(visibleGalleryVideos()[5], patonVoteFirstPlaceStoryVideo);
    assert.equal(visibleGalleryVideos()[6], patonVoteFifteenXStoryVideo);
    assert.equal(visibleGalleryVideos()[7], campusGirlsHoldSecondStoryVideo);

    for (const fixture of fixtures) {
      const entry = newsItem(fixture.newsId);
      assert.equal(entry?.media, fixture.item);
      assert.equal(
        galleryVideos.find(({ id }) => id === fixture.item.id),
        fixture.item,
      );
      assert.equal(fixture.item.sourceLabel, "Instagram Story");
      assert.equal(fixture.item.sourceDate, fixture.sourceDate);
      assert.equal("sourceUrl" in fixture.item, false);
      assert.equal(fixture.item.published, true);

      const feed = createPortalFeed({
        now: new Date(`${fixture.sourceDate}T12:00:00+09:00`),
        newsItems: [entry],
        storyItems: [],
        eventItems: [],
      });
      const feedItem = findFeedItem(feed, portalNewsId(fixture.newsId));
      assert.equal(feedItem.sourceUrl, undefined);
      assert.ok(feedItem.image?.endsWith(fixture.item.poster));
    }
  });

  it("does not self-host the how-to Story and reuses the confirmed portrait", () => {
    const entry = newsItem(HOW_TO_NEWS_ID);
    assert.equal(entry?.media, campusGirlsPatonPortraitImage);
    assert.equal(entry?.message?.text, patonVoteHowToSpokenMessage);
    assert.equal(
      galleryVideos.some((item) => item.id.includes("how-to")),
      false,
    );
    assert.equal(
      existsSync(
        path.join(galleryDirectory, "mily-b44-03-paton-vote-how-to-story.mp4"),
      ),
      false,
    );
    assert.doesNotMatch(entry.body, /900\s*pt|5位|TOP個人サポーター/);
    assert.equal(entry.additionalCtas[0].label, PATON_VOTE_HOW_TO_CTA_LABEL);
    assert.equal(entry.additionalCtas[0].url, PATON_VOTE_HOW_TO_CTA_URL);
  });

  it("does not self-host the 30-day anniversary Story because viewer identities are visible", () => {
    const entry = newsItem(THIRTY_DAY_NEWS_ID);
    assert.equal(entry?.media, undefined);
    assert.equal(
      galleryVideos.some((item) => item.id.includes("30-day")),
      false,
    );
    assert.equal(
      existsSync(
        path.join(
          galleryDirectory,
          "mily-b44-04-showroom-30-day-anniversary-story.mp4",
        ),
      ),
      false,
    );
    assert.equal(
      existsSync(
        path.join(
          galleryDirectory,
          "mily-b44-04-showroom-30-day-anniversary-story-poster.jpg",
        ),
      ),
      false,
    );
  });

  it("surfaces campus Stories on CAMPUS GIRLS and the anniversary on LIVE STREAM only", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);

    assert.equal(campusNews[0]?.id, "2026-09-02-paton-second-story");
    assert.equal(campusNews[1]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(campusNews[2]?.id, "2026-08-31-paton-vote-voice-story");
    assert.equal(campusNews[3]?.id, FIRST_PLACE_NEWS_ID);
    assert.equal(campusNews[4]?.id, FIFTEEN_X_NEWS_ID);
    assert.equal(campusNews[5]?.id, HOW_TO_NEWS_ID);
    assert.equal(campusNews[6]?.id, "2026-08-31-paton-15x-day");
    assert.equal(campusNews[7]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(liveNews[0]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(liveNews[1]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(liveNews[2]?.id, "2026-08-31-morning-stream-thanks");
    assert.equal(liveNews[3]?.id, "2026-08-31-showroom-wake-me");
    assert.equal(liveNews[4]?.id, "2026-08-30-consecutive-stream-30");
    assert.equal(liveNews[5]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(liveNews[6]?.id, THIRTY_DAY_NEWS_ID);
    assert.equal(selectActivityMedia("campus-girls")[1]?.id, "mily-b63-01-campus-girls-prelim-final-result");
    assert.equal(selectActivityMedia("campus-girls")[2]?.id, "mily-b47-02-paton-second-story");
    assert.equal(selectActivityMedia("campus-girls")[3]?.id, "mily-b46-01-paton-vote-final-day-story");
    assert.equal(selectActivityMedia("campus-girls")[4]?.id, "mily-b45-01-paton-vote-voice-story");
    assert.equal(selectActivityMedia("campus-girls")[5], patonVoteFirstPlaceStoryVideo);
    assert.equal(selectActivityMedia("campus-girls")[6], patonVoteFifteenXStoryVideo);
    assert.equal(selectActivityMedia("campus-girls")[7], campusGirlsPatonPortraitImage);
    assert.equal(selectActivityMedia("campus-girls")[8], campusGirlsHoldSecondStoryVideo);
    assert.notEqual(
      selectActivityMedia("live-stream")[0]?.id,
      "mily-b44-04-showroom-30-day-anniversary-story",
    );
    assert.equal(
      selectActivityMedia("live-stream").some((item) =>
        item.id?.includes("30-day"),
      ),
      false,
    );

    for (const newsId of [FIRST_PLACE_NEWS_ID, FIFTEEN_X_NEWS_ID, HOW_TO_NEWS_ID]) {
      assert.equal(liveNews.some((entry) => entry.id === newsId), false);
      assert.equal(radioNews.some((entry) => entry.id === newsId), false);
      assert.equal(missNews.some((entry) => entry.id === newsId), false);
    }
    assert.equal(campusNews.some((entry) => entry.id === THIRTY_DAY_NEWS_ID), false);
    assert.equal(radioNews.some((entry) => entry.id === THIRTY_DAY_NEWS_ID), false);
    assert.equal(missNews.some((entry) => entry.id === THIRTY_DAY_NEWS_ID), false);
  });

  it("keeps the rank overlay as a point-in-time record and omits Mixch chrome", () => {
    const firstPlace = newsItem(FIRST_PLACE_NEWS_ID);
    const fifteenX = newsItem(FIFTEEN_X_NEWS_ID);
    const thirtyDay = newsItem(THIRTY_DAY_NEWS_ID);

    assert.match(firstPlace.body, /投稿時点の記録/);
    assert.match(firstPlace.body, /1位/);
    assert.match(firstPlace.body, /102,700pt/);
    assert.match(firstPlace.body, /現在の順位を示すものではありません/);
    assert.match(firstPlace.message.text, /待ってー！現在1位だ/);
    assert.match(firstPlace.message.text, /31日は1.5倍DAY/);
    assert.equal(firstPlace.body.includes("Mixch"), false);

    assert.match(fifteenX.body, /1\.5倍/);
    assert.match(fifteenX.body, /緊急案内/);
    assert.doesNotMatch(fifteenX.body, /0:00|23:59|なるよーん/);
    assert.match(fifteenX.message.text, /緊急告知/);
    assert.match(fifteenX.message.text, /明日はpaton投票が/);
    assert.match(fifteenX.message.text, /《1\.5倍》になります/);
    assert.match(fifteenX.message.text, /ぜひ投票お願いします/);
    assert.match(fifteenX.message.text, /#CAMPUSBOYS2027/);
    assert.match(fifteenX.message.text, /#CAMPUSGIRLS2027/);
    assert.match(fifteenX.message.text, /#予選AFinal/);
    assert.doesNotMatch(fifteenX.message.text, /なるよーん|00:00|23:59|#キャンパスガールズ2027/);
    assert.doesNotMatch(patonVoteFifteenXStoryVideo.alt, /0:00|23:59/);
    assert.equal(fifteenX.body.includes("Mixch"), false);

    assert.match(thirtyDay.body, /30日連続配信記念日/);
    assert.match(thirtyDay.body, /7:30/);
    assert.match(thirtyDay.body, /配信前の記録/);
    assert.equal(thirtyDay.body.includes("Paton"), false);
    assert.doesNotMatch(thirtyDay.message.text, /#ミスサー/);
    assert.match(thirtyDay.message.text, /【8\/30（日）】/);
    assert.match(thirtyDay.message.text, /現在3:30。朝7:30配信予定$/);
    assert.equal(thirtyDay.media, undefined);
  });
});

describe("2026-08-30〜31 Instagram Story — published media", () => {
  it("publishes exactly two shared MP4s and two real-frame posters", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b44-"))
      .sort();
    assert.deepEqual(
      assets,
      fixtures.flatMap(({ poster, publicVideo }) => [poster, publicVideo]).sort(),
    );

    for (const fixture of fixtures) {
      const mp4 = path.join(galleryDirectory, fixture.publicVideo);
      const poster = path.join(galleryDirectory, fixture.poster);
      assert.equal((await stat(mp4)).size, fixture.publicBytes);
      assert.equal(await sha256(mp4), fixture.publicSha256);
      assert.equal((await stat(poster)).size, fixture.posterBytes);
      assert.equal(await sha256(poster), fixture.posterSha256);

      const metadata = await sharp(poster).metadata();
      assert.equal(metadata.width, fixture.width);
      assert.equal(metadata.height, fixture.height);
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.iptc, undefined);
      assert.equal(metadata.xmp, undefined);
      assert.equal(metadata.icc, undefined);
    }
  });

  it("keeps geometry and frames, strips unconfirmed audio, and uses faststart Baseline", async () => {
    for (const fixture of fixtures) {
      const mp4 = path.join(galleryDirectory, fixture.publicVideo);
      const info = await probe(mp4);
      const video = info.streams.find((stream) => stream.codec_type === "video");
      const audio = info.streams.find((stream) => stream.codec_type === "audio");

      assert.ok(video);
      assert.equal(video.codec_name, "h264");
      assert.match(video.profile, /Baseline/);
      assert.equal(video.has_b_frames, 0);
      assert.equal(video.pix_fmt, "yuv420p");
      assert.equal(video.width, fixture.width);
      assert.equal(video.height, fixture.height);
      assert.equal(video.avg_frame_rate, fixture.avgFrameRate);
      assert.equal(video.nb_frames, fixture.nbFrames);
      assert.ok(Math.abs(Number(info.format.duration) - fixture.duration) < 0.001);
      assert.equal(audio, undefined);
      assert.equal(await isFaststart(mp4), true);
      assert.deepEqual(info.chapters, []);
      assert.equal("creation_time" in (info.format.tags ?? {}), false);
      assert.notEqual(video.tags?.handler_name, "Core Media Video");

      const original = path.join(root, "media/original", fixture.original);
      if (existsSync(original)) {
        const source = await probe(original);
        const sourceVideo = source.streams.find(
          (stream) => stream.codec_type === "video",
        );
        const sourceAudio = source.streams.find(
          (stream) => stream.codec_type === "audio",
        );
        assert.equal((await stat(original)).size, fixture.originalBytes);
        assert.equal(await sha256(original), fixture.originalSha256);
        assert.equal(sourceVideo.width, video.width);
        assert.equal(sourceVideo.height, video.height);
        assert.equal(sourceVideo.avg_frame_rate, video.avg_frame_rate);
        assert.equal(sourceVideo.nb_frames, video.nb_frames);
        if (fixture.originalAudioRate) {
          assert.equal(sourceAudio.codec_name, "aac");
          assert.equal(sourceAudio.profile, "HE-AAC");
          assert.equal(sourceAudio.sample_rate, fixture.originalAudioRate);
          assert.equal(sourceAudio.channels, 2);
        } else {
          assert.equal(sourceAudio, undefined);
        }
      }
    }
  });
});

describe("2026-08-30〜31 Instagram Story — privacy and scope", () => {
  it("does not create articles, milestones, events, manual schedules, or photo records", () => {
    const ids = new Set([
      ...fixtures.map(({ item }) => item.id),
      FIRST_PLACE_NEWS_ID,
      FIFTEEN_X_NEWS_ID,
      HOW_TO_NEWS_ID,
      THIRTY_DAY_NEWS_ID,
    ]);
    assert.equal(stories.some((entry) => ids.has(entry.slug) || ids.has(entry.id)), false);
    assert.equal(highlights.some((entry) => ids.has(entry.id)), false);
    assert.equal(events.some((entry) => ids.has(entry.id)), false);
    assert.equal(streamSchedule.some((entry) => ids.has(entry.id)), false);
    assert.equal(media.some((entry) => ids.has(entry.id)), false);
    assert.equal(
      campusGirlsFinalStageRankingStoryVideos.some((entry) => ids.has(entry.id)),
      false,
    );
    assert.equal(contest.currentPhase.name.includes("1位"), false);
  });

  it("keeps handoff identifiers and raw originals out of tracked text", async () => {
    const files = await changedText();
    const forbidden = [
      /(?:^|\/)upload\//i,
      new RegExp(["lib", "file", "_"].join(""), "i"),
      /[0-9A-F]{8}(?:-[0-9A-F]{4}){3}-[0-9A-F]{12}\.mp4/i,
    ];

    for (const { file, text } of files) {
      for (const pattern of forbidden) {
        assert.doesNotMatch(text, pattern, file);
      }
    }

    const { stdout } = await run("git", ["ls-files", "media/original"], {
      cwd: root,
    });
    assert.equal(stdout.trim(), "media/original/README.md");
  });

  it("documents the video-only policy, unpublished how-to, and both CTA paths", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(docs, /batch b44/);
    assert.match(docs, /公開派生では削除/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /非掲載/);
    assert.match(ops, /独立動画23本/);
    assert.match(ops, /66件/);
    assert.match(ops, /Instagramプロフィールを見る/);
    assert.match(ops, /Patonでみりぃに投票する/);
    assert.match(ops, /投稿時点の記録/);
    assert.match(ops, /自己ホストしない/);
    assert.match(ops, /視聴者の表示名/);
    assert.match(ops, /^\| `contest\.ts` \|/m);
    assert.doesNotMatch(ops, /\|\| `contest\.ts`/);
  });
});
