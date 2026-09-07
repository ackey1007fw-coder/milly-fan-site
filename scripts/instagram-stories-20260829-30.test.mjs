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
  campusGirlsHoldSecondStoryVideo,
  galleryVideos,
  patonVoteDay4StoryVideo,
  patonVoteDay5StoryVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b58.ts";
import { highlights } from "../src/data/highlights.ts";
import { campusGirlsPatonPortraitImage } from "../src/data/campusGirlsPatonImages.ts";
import { campusGirlsPatonVoteLink } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { campusGirlsFinalStageRankingStoryVideos } from "../src/data/campusGirlsFinalStageStorySeries.ts";
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
const duringVote = Date.parse("2026-08-30T12:00:00+09:00");
const afterVote = Date.parse("2026-09-02T00:00:00+09:00");

const fixtures = [
  {
    newsId: "2026-08-30-campus-girls-hold-second-story",
    item: campusGirlsHoldSecondStoryVideo,
    original: "mily-b43-02-campus-girls-hold-second-story.mp4",
    publicVideo: "mily-b43-02-campus-girls-hold-second-story.mp4",
    poster: "mily-b43-02-campus-girls-hold-second-story-poster.jpg",
    originalBytes: 9_441_731,
    originalSha256:
      "cfac3ee5b68b130e45997eb826c3784ccf7245371040d9525f7f08daaff744a5",
    publicBytes: 798_016,
    publicSha256:
      "81699137c90a914d798500dd55bc581f1490f51767a49c856fdf3dda8bac3406",
    posterBytes: 87_690,
    posterSha256:
      "2c9413f1ddbca35565f348377d67dd22e22a81fa8c82454db955b8f6cd079b0e",
    sourceDate: "2026-08-30",
    width: 720,
    height: 1280,
    avgFrameRate: "30/1",
    nbFrames: "600",
    duration: 20.0,
  },
  {
    newsId: "2026-08-29-paton-vote-day-5-story",
    item: patonVoteDay5StoryVideo,
    original: "mily-b43-01-paton-vote-day5-story.mp4",
    publicVideo: "mily-b43-01-paton-vote-day5-story.mp4",
    poster: "mily-b43-01-paton-vote-day5-story-poster.jpg",
    originalBytes: 961_498,
    originalSha256:
      "23f7d40ffdf30f6930cf0aa26087846da6f401840bd362666cb78900ed0bc194",
    publicBytes: 634_313,
    publicSha256:
      "09d5fbe72c42beb66af32d6376ef01e95cb1ad9a8ba22593c25c845996993a81",
    posterBytes: 120_290,
    posterSha256:
      "65da2070ab0b25d54ce01e8cd4ed337a6a7fe0edc822849505811f27503bff0f",
    sourceDate: "2026-08-29",
    width: 720,
    height: 1280,
    avgFrameRate: "1/1",
    nbFrames: "20",
    duration: 20.0,
    originalAudioRate: "44100",
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
    "scripts/fixtures/activity-content-before-b41.ts",
    "scripts/fixtures/activity-media-before-b41.ts",
    "scripts/fixtures/gallery-items-before-b41.ts",
    "scripts/fixtures/gallery-videos-before-b41.ts",
    "scripts/fixtures/news-before-b41.ts",
    "scripts/fixtures/portal-feed-before-b41.ts",
    "scripts/instagram-stories-20260829-30.test.mjs",
    "src/data/campusGirlsHoldSecondStoryVideo.json",
    "src/data/campusGirlsHoldSecondStoryVideo.ts",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/patonVoteDay5StoryVideo.json",
    "src/data/patonVoteDay5StoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b43");
      const end = text.indexOf("\n## ", start + 4);
      assert.notEqual(start, -1);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-08-29〜30 Instagram Story動画 — Latest / NEWS", () => {
  it("adds two separately dated Story records in confirmed editorial order", () => {
    const ordered = sortNewsByDateDesc(news);
    const holdSecond = newsItem(fixtures[0].newsId);
    const day5 = newsItem(fixtures[1].newsId);

    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.equal(ordered[4]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(ordered[5]?.id, "2026-09-01-ohayo-september-x");
    assert.equal(ordered[6]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(ordered[7]?.id, "2026-09-01-september-mily-story");
    assert.equal(ordered[8]?.id, "2026-08-31-paton-vote-voice-story");
    assert.equal(ordered[9]?.id, "2026-08-31-paton-first-place-story");
    assert.equal(ordered[10]?.id, "2026-08-31-paton-15x-day-story");
    assert.equal(ordered[11]?.id, "2026-08-31-paton-vote-how-to-story");
    assert.equal(ordered[12]?.id, "2026-08-31-morning-stream-thanks");
    assert.equal(ordered[13]?.id, "2026-08-31-paton-15x-day");
    assert.equal(ordered[14]?.id, "2026-08-31-showroom-wake-me");
    assert.equal(ordered[15]?.id, "2026-08-30-consecutive-stream-30");
    assert.equal(ordered[16], holdSecond);
    assert.equal(ordered[17]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(ordered[18]?.id, "2026-08-30-mixch-final-day");
    assert.equal(ordered[19]?.id, "2026-08-30-showroom-30-day-story");
    assert.equal(ordered[20]?.id, "2026-08-30-paton-rank-3");
    assert.equal(ordered[21], day5);
    assert.equal(ordered[22]?.id, "2026-08-29-showroom-live-third-round");
    assert.equal(ordered[23]?.id, "2026-08-29-showroom-radio-1440");
    assert.equal(ordered[24]?.id, "2026-08-29-paton-vote-day-4-story");
    assert.equal(holdSecond?.sameDayOrder, 3);
    assert.equal(day5?.sameDayOrder, 4);
    assert.deepEqual(holdSecond?.activityIds, ["campus-girls"]);
    assert.deepEqual(day5?.activityIds, ["campus-girls"]);
    assert.equal(news.filter(({ id }) => id === holdSecond?.id).length, 1);
    assert.equal(news.filter(({ id }) => id === day5?.id).length, 1);
    assert.equal(news.length, 75);
    assert.deepEqual(verifyNews([holdSecond, day5]), []);
  });

  it("keeps Story attribution non-link and provides Instagram plus active Paton CTAs", () => {
    for (const fixture of fixtures) {
      const entry = newsItem(fixture.newsId);
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

  it("shares one manifest object per Story with Gallery and Portal Feed", () => {
    assert.equal(visibleGalleryVideos()[0]?.id, "mily-b47-01-oyasumily-story");
    assert.equal(visibleGalleryVideos()[1]?.id, "mily-b47-02-paton-second-story");
    assert.equal(visibleGalleryVideos()[2]?.id, "mily-b46-01-paton-vote-final-day-story");
    assert.equal(visibleGalleryVideos()[3]?.id, "mily-b46-02-september-mily-story");
    assert.equal(visibleGalleryVideos()[4]?.id, "mily-b45-01-paton-vote-voice-story");
    assert.equal(visibleGalleryVideos()[5]?.id, "mily-b44-02-paton-vote-first-place-story");
    assert.equal(visibleGalleryVideos()[6]?.id, "mily-b44-01-paton-vote-15x-emergency-story");
    assert.equal(visibleGalleryVideos()[7], campusGirlsHoldSecondStoryVideo);
    assert.equal(visibleGalleryVideos()[8], patonVoteDay5StoryVideo);
    assert.equal(visibleGalleryVideos()[9], patonVoteDay4StoryVideo);

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

  it("surfaces the new records and canonical videos on CAMPUS GIRLS only", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);

    assert.equal(campusNews[0]?.id, "2026-09-02-paton-second-story");
    assert.equal(campusNews[1]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(campusNews[2]?.id, "2026-08-31-paton-vote-voice-story");
    assert.equal(campusNews[3]?.id, "2026-08-31-paton-first-place-story");
    assert.equal(campusNews[4]?.id, "2026-08-31-paton-15x-day-story");
    assert.equal(campusNews[5]?.id, "2026-08-31-paton-vote-how-to-story");
    assert.equal(campusNews[6]?.id, "2026-08-31-paton-15x-day");
    assert.equal(campusNews[7]?.id, fixtures[0].newsId);
    assert.equal(campusNews[8]?.id, "2026-08-30-mixch-final-day");
    assert.equal(campusNews[9]?.id, "2026-08-30-paton-rank-3");
    assert.equal(campusNews[10]?.id, fixtures[1].newsId);
    assert.equal(campusNews[11]?.id, "2026-08-29-paton-vote-day-4-story");
    assert.equal(selectActivityMedia("campus-girls")[1]?.id, "mily-b63-01-campus-girls-prelim-final-result");
    assert.equal(selectActivityMedia("campus-girls")[2]?.id, "mily-b47-02-paton-second-story");
    assert.equal(selectActivityMedia("campus-girls")[3]?.id, "mily-b46-01-paton-vote-final-day-story");
    assert.equal(selectActivityMedia("campus-girls")[4]?.id, "mily-b45-01-paton-vote-voice-story");
    assert.equal(selectActivityMedia("campus-girls")[5]?.id, "mily-b44-02-paton-vote-first-place-story");
    assert.equal(selectActivityMedia("campus-girls")[6]?.id, "mily-b44-01-paton-vote-15x-emergency-story");
    assert.equal(selectActivityMedia("campus-girls")[7], campusGirlsPatonPortraitImage);
    assert.equal(selectActivityMedia("campus-girls")[8], campusGirlsHoldSecondStoryVideo);
    assert.equal(selectActivityMedia("campus-girls")[9], patonVoteDay5StoryVideo);
    assert.equal(selectActivityMedia("campus-girls")[10], patonVoteDay4StoryVideo);

    for (const fixture of fixtures) {
      assert.equal(
        liveNews.some((entry) => entry.id === fixture.newsId),
        false,
      );
      assert.equal(
        radioNews.some((entry) => entry.id === fixture.newsId),
        false,
      );
      assert.equal(
        missNews.some((entry) => entry.id === fixture.newsId),
        false,
      );
    }
  });

  it("keeps the overlay ranking as a point-in-time record and omits Mixch or Tap chrome", () => {
    const holdSecond = newsItem(fixtures[0].newsId);
    const day5 = newsItem(fixtures[1].newsId);

    assert.match(holdSecond.body, /投稿時点の記録/);
    assert.match(holdSecond.body, /2位/);
    assert.match(holdSecond.message.text, /2位を守り抜きたい/);
    assert.match(holdSecond.message.text, /パトン投票：9\/1（火）23:59まで/);
    assert.match(holdSecond.message.text, /ムービーへの応援：本日30日（日）23:59まで/);
    assert.equal(holdSecond.message.text.includes("Tap"), false);
    assert.equal(holdSecond.body.includes("Mixch"), false);
    assert.equal(holdSecond.url, undefined);

    assert.match(day5.message.text, /変面さんとの2ショット/);
    assert.match(day5.message.text, /5日目お願いします/);
    assert.equal(day5.message.text.includes("Tap"), false);
    assert.equal(day5.body.includes("Mixch"), false);
  });
});

describe("2026-08-29〜30 Instagram Story動画 — published media", () => {
  it("publishes exactly two shared MP4s and two real-frame posters", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b43-"))
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

describe("2026-08-29〜30 Instagram Story動画 — privacy and scope", () => {
  it("does not create articles, milestones, events, manual schedules, or photo records", () => {
    const ids = new Set(fixtures.map(({ item }) => item.id));
    assert.equal(stories.some((entry) => ids.has(entry.slug)), false);
    assert.equal(highlights.some((entry) => ids.has(entry.id)), false);
    assert.equal(events.some((entry) => ids.has(entry.id)), false);
    assert.equal(streamSchedule.some((entry) => ids.has(entry.id)), false);
    assert.equal(media.some((entry) => ids.has(entry.id)), false);
    assert.equal(
      campusGirlsFinalStageRankingStoryVideos.some((entry) => ids.has(entry.id)),
      false,
    );
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

  it("documents the video-only policy, shared manifests, and both CTA paths", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(docs, /batch b43/);
    assert.match(docs, /公開派生では削除/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /1fps/);
    assert.match(ops, /独立動画21本/);
    assert.match(ops, /57件/);
    assert.match(ops, /Instagramプロフィールを見る/);
    assert.match(ops, /Patonでみりぃに投票する/);
    assert.match(ops, /投稿時点の記録/);
    assert.match(ops, /PatonVoteGuide/);
  });
});
