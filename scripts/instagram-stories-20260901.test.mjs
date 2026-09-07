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
import {
  galleryVideos,
  oyasumilyStoryVideo,
  patonSecondStoryVideo,
  patonVoteFinalDayStoryVideo,
  patonVoteVoiceStoryVideo,
  septemberMilyStoryVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b58.ts";
import { highlights } from "../src/data/highlights.ts";
import { campusGirlsPatonVoteLink } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
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
const duringVote = Date.parse("2026-09-01T12:00:00+09:00");
const afterVote = Date.parse("2026-09-02T00:00:00+09:00");

const FINAL_DAY_NEWS_ID = "2026-09-01-paton-vote-final-day-story";
const SEPTEMBER_NEWS_ID = "2026-09-01-september-mily-story";

const fixtures = [
  {
    newsId: FINAL_DAY_NEWS_ID,
    item: patonVoteFinalDayStoryVideo,
    original: "mily-b46-01-paton-vote-final-day-story.mp4",
    publicVideo: "mily-b46-01-paton-vote-final-day-story.mp4",
    poster: "mily-b46-01-paton-vote-final-day-story-poster.jpg",
    originalBytes: 7_222_368,
    originalSha256:
      "3d3efbef8cc81f7056d8c6a137734be8e7d56544dd337a087c025b7df10d6432",
    publicBytes: 1_531_871,
    publicSha256:
      "ddac08f2be2f5787e38d2f36f2594826205625da2c2dc43d0c3780b697eca455",
    posterBytes: 68_288,
    posterSha256:
      "c15c9ce5928a75b6aff52ed45f7b50fc24369db406fac5dba198a2e5e0bf2dae",
    sourceDate: "2026-09-01",
    width: 720,
    height: 1280,
    avgFrameRate: "30/1",
    nbFrames: "167",
    duration: 5.567,
    activityIds: ["campus-girls"],
    posterSeconds: 2.0,
  },
  {
    newsId: SEPTEMBER_NEWS_ID,
    item: septemberMilyStoryVideo,
    original: "mily-b46-02-september-mily-story.mp4",
    publicVideo: "mily-b46-02-september-mily-story.mp4",
    poster: "mily-b46-02-september-mily-story-poster.jpg",
    originalBytes: 4_112_409,
    originalSha256:
      "0e9d3e95ba08e2426e02ffe063884c5483c4f5834e2a7e912b0a8b8203868d2b",
    publicBytes: 1_550_405,
    publicSha256:
      "d7ca9431c53ef2166333adcde051a2a33af411801d496fd55514e748e04621f4",
    posterBytes: 75_904,
    posterSha256:
      "f48a37896f24838ab850978312d2611ac19a86ee54de65c1bcd01d3ebc425105",
    sourceDate: "2026-09-01",
    width: 720,
    height: 1280,
    avgFrameRate: "30/1",
    nbFrames: "92",
    duration: 3.067,
    activityIds: undefined,
    posterSeconds: 1.0,
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
    "scripts/instagram-stories-20260901.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/patonVoteFinalDayStoryVideo.json",
    "src/data/patonVoteFinalDayStoryVideo.ts",
    "src/data/septemberMilyStoryVideo.json",
    "src/data/septemberMilyStoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b46");
      const end = text.indexOf("\n## ", start + 4);
      assert.notEqual(start, -1);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-09-01 Instagram Story — Latest / NEWS", () => {
  it("adds two records in confirmed editorial order at the front of Latest", () => {
    const ordered = sortNewsByDateDesc(news);
    const finalDay = newsItem(FINAL_DAY_NEWS_ID);
    const september = newsItem(SEPTEMBER_NEWS_ID);

    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.equal(ordered[4]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(ordered[5], newsItem("2026-09-01-ohayo-september-x"));
    assert.equal(ordered[6], finalDay);
    assert.equal(ordered[7], september);
    assert.equal(ordered[8], newsItem("2026-08-31-paton-vote-voice-story"));
    assert.equal(finalDay?.sameDayOrder, 2);
    assert.equal(september?.sameDayOrder, 1);
    assert.deepEqual(finalDay?.activityIds, ["campus-girls"]);
    assert.equal(september?.activityIds, undefined);
    assert.equal(news.filter(({ id }) => id === FINAL_DAY_NEWS_ID).length, 1);
    assert.equal(news.filter(({ id }) => id === SEPTEMBER_NEWS_ID).length, 1);
    assert.equal(news.length, 75);
    assert.deepEqual(verifyNews([finalDay, september]), []);
  });

  it("keeps Story attribution non-link and provides Instagram plus windowed Paton CTAs", () => {
    for (const newsId of [FINAL_DAY_NEWS_ID, SEPTEMBER_NEWS_ID]) {
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

  it("shares one manifest object per published Story with Gallery and Portal Feed", () => {
    assert.equal(visibleGalleryVideos()[0], oyasumilyStoryVideo);
    assert.equal(visibleGalleryVideos()[1], patonSecondStoryVideo);
    assert.equal(visibleGalleryVideos()[2], patonVoteFinalDayStoryVideo);
    assert.equal(visibleGalleryVideos()[3], septemberMilyStoryVideo);
    assert.equal(visibleGalleryVideos()[4], patonVoteVoiceStoryVideo);

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

  it("surfaces the final-day Story on CAMPUS GIRLS and keeps the greeting unscoped", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);

    assert.equal(campusNews[0]?.id, "2026-09-02-paton-second-story");
    assert.equal(campusNews[1]?.id, FINAL_DAY_NEWS_ID);
    assert.equal(campusNews[2]?.id, "2026-08-31-paton-vote-voice-story");
    assert.equal(selectActivityMedia("campus-girls")[1]?.id, "mily-b63-01-campus-girls-prelim-final-result");
    assert.equal(selectActivityMedia("campus-girls")[2], patonSecondStoryVideo);
    assert.equal(selectActivityMedia("campus-girls")[3], patonVoteFinalDayStoryVideo);
    assert.equal(selectActivityMedia("campus-girls")[4], patonVoteVoiceStoryVideo);
    assert.equal(campusNews.some((entry) => entry.id === SEPTEMBER_NEWS_ID), false);
    assert.equal(liveNews.some((entry) => entry.id === FINAL_DAY_NEWS_ID), false);
    assert.equal(liveNews.some((entry) => entry.id === SEPTEMBER_NEWS_ID), false);
    assert.equal(radioNews.some((entry) => entry.id === FINAL_DAY_NEWS_ID), false);
    assert.equal(radioNews.some((entry) => entry.id === SEPTEMBER_NEWS_ID), false);
    assert.equal(missNews.some((entry) => entry.id === FINAL_DAY_NEWS_ID), false);
    assert.equal(missNews.some((entry) => entry.id === SEPTEMBER_NEWS_ID), false);
    assert.equal(
      selectActivityMedia("campus-girls").some(
        (item) => item.id === septemberMilyStoryVideo.id,
      ),
      false,
    );
  });

  it("keeps the overlay text and does not invent a schedule", () => {
    const finalDay = newsItem(FINAL_DAY_NEWS_ID);
    const september = newsItem(SEPTEMBER_NEWS_ID);

    assert.match(finalDay.body, /最終日/);
    assert.match(finalDay.body, /投票をお願いしました/);
    assert.doesNotMatch(finalDay.body, /0:00|23:59|投稿時刻/);
    assert.equal(finalDay.body.includes("Mixch"), false);
    assert.match(finalDay.message.text, /おはよう〜🌞/);
    assert.match(finalDay.message.text, /今日はパトン投票最終日‼️/);
    assert.match(finalDay.message.text, /投票お願いします 🙌❣️/);

    assert.match(september.body, /9月もよろしくね/);
    assert.doesNotMatch(september.body, /最終日|投票|Paton|パトン/);
    assert.equal(september.body.includes("Mixch"), false);
    assert.match(september.message.text, /9月のみりぃもよろしくね♡/);
  });
});

describe("2026-09-01 Instagram Story — published media", () => {
  it("publishes exactly two shared MP4s and two real-frame posters", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b46-"))
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

  it("keeps geometry and frames, stays video-only, and uses faststart Baseline", async () => {
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
        assert.equal(sourceVideo.r_frame_rate, "30/1");
        assert.equal(sourceVideo.nb_frames, video.nb_frames);
        assert.equal(sourceAudio, undefined);
      }
    }
  });
});

describe("2026-09-01 Instagram Story — privacy and scope", () => {
  it("does not create articles, milestones, events, manual schedules, or photo records", () => {
    const ids = new Set([
      ...fixtures.map(({ item }) => item.id),
      FINAL_DAY_NEWS_ID,
      SEPTEMBER_NEWS_ID,
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
    assert.equal(contest.currentPhase.name.includes("最終日"), false);
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

  it("documents the video-only public derivatives and both CTA paths", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(docs, /batch b46/);
    assert.match(docs, /音声ストリームはない/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /167フレーム/);
    assert.match(docs, /92フレーム/);
    assert.match(ops, /独立動画26本/);
    assert.match(ops, /69件/);
    assert.match(ops, /Instagramプロフィールを見る/);
    assert.match(ops, /Patonでみりぃに投票する/);
    assert.match(ops, /sameDayOrder: 2/);
    assert.match(ops, /Activities には関連付けない/);
  });
});
