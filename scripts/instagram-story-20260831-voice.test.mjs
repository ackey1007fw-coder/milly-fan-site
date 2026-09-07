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
  patonVoteFirstPlaceStoryVideo,
  patonVoteVoiceStoryVideo,
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
const duringVote = Date.parse("2026-08-31T12:00:00+09:00");
const afterVote = Date.parse("2026-09-02T00:00:00+09:00");

const NEWS_ID = "2026-08-31-paton-vote-voice-story";

const fixture = {
  newsId: NEWS_ID,
  item: patonVoteVoiceStoryVideo,
  original: "mily-b45-01-paton-vote-voice-story.mp4",
  publicVideo: "mily-b45-01-paton-vote-voice-story.mp4",
  poster: "mily-b45-01-paton-vote-voice-story-poster.jpg",
  originalBytes: 40_314_111,
  originalSha256:
    "9fc67b064ea03b7fd4d3007d3be2a71ced0f1741586a404ceee4872bf714187c",
  publicBytes: 7_936_073,
  publicSha256:
    "c3d407c8be9e05cc0b28bbea86441fbd5795eaa79edd0747473a7ab3a25f0fd1",
  posterBytes: 46_458,
  posterSha256:
    "59bfdef3ebab3fea1bfbf82cebae62fb8baa52255f6c632ab332b22529232572",
  sourceDate: "2026-08-31",
  width: 720,
  height: 1280,
  avgFrameRate: "30/1",
  nbFrames: "972",
  duration: 32.4,
  originalAudioRate: "44100",
  activityIds: ["campus-girls"],
};

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
    "scripts/instagram-story-20260831-voice.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/patonVoteVoiceStoryVideo.json",
    "src/data/patonVoteVoiceStoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b45");
      const end = text.indexOf("\n## ", start + 4);
      assert.notEqual(start, -1);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-08-31 Instagram Story voice vote call — Latest / NEWS", () => {
  it("adds one talking-head Story at the front of 8/31", () => {
    const ordered = sortNewsByDateDesc(news);
    const entry = newsItem(NEWS_ID);

    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.equal(ordered[4]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(ordered[5]?.id, "2026-09-01-ohayo-september-x");
    assert.equal(ordered[6]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(ordered[7]?.id, "2026-09-01-september-mily-story");
    assert.equal(ordered[8], entry);
    assert.equal(ordered[9], newsItem("2026-08-31-paton-first-place-story"));
    assert.equal(entry?.sameDayOrder, 7);
    assert.deepEqual(entry?.activityIds, ["campus-girls"]);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(news.length, 75);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("keeps Story attribution non-link and provides Instagram plus windowed Paton CTAs", () => {
    const entry = newsItem(NEWS_ID);
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
  });

  it("shares one manifest object with Gallery and Portal Feed", () => {
    const entry = newsItem(NEWS_ID);
    assert.equal(visibleGalleryVideos()[0]?.id, "mily-b47-01-oyasumily-story");
    assert.equal(visibleGalleryVideos()[1]?.id, "mily-b47-02-paton-second-story");
    assert.equal(visibleGalleryVideos()[2]?.id, "mily-b46-01-paton-vote-final-day-story");
    assert.equal(visibleGalleryVideos()[3]?.id, "mily-b46-02-september-mily-story");
    assert.equal(visibleGalleryVideos()[4], patonVoteVoiceStoryVideo);
    assert.equal(visibleGalleryVideos()[5], patonVoteFirstPlaceStoryVideo);
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
  });

  it("surfaces the Story on CAMPUS GIRLS only", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);

    assert.equal(campusNews[0]?.id, "2026-09-02-paton-second-story");
    assert.equal(campusNews[1]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(campusNews[2]?.id, NEWS_ID);
    assert.equal(campusNews[3]?.id, "2026-08-31-paton-first-place-story");
    assert.equal(selectActivityMedia("campus-girls")[1]?.id, "mily-b63-01-campus-girls-prelim-final-result");
    assert.equal(selectActivityMedia("campus-girls")[2]?.id, "mily-b47-02-paton-second-story");
    assert.equal(selectActivityMedia("campus-girls")[3]?.id, "mily-b46-01-paton-vote-final-day-story");
    assert.equal(selectActivityMedia("campus-girls")[4], patonVoteVoiceStoryVideo);
    assert.equal(selectActivityMedia("campus-girls")[5], patonVoteFirstPlaceStoryVideo);
    assert.equal(liveNews.some((entry) => entry.id === NEWS_ID), false);
    assert.equal(radioNews.some((entry) => entry.id === NEWS_ID), false);
    assert.equal(missNews.some((entry) => entry.id === NEWS_ID), false);
  });

  it("keeps the spoken vote call and does not invent a schedule", () => {
    const entry = newsItem(NEWS_ID);
    assert.match(entry.body, /9月1日まで/);
    assert.match(entry.body, /1\.5倍/);
    assert.match(entry.body, /肉声/);
    assert.match(entry.body, /投票はこちらから/);
    assert.match(entry.body, /31日の投票枠/);
    assert.doesNotMatch(entry.body, /0:00|23:59|投稿時刻/);
    assert.equal(entry.body.includes("Mixch"), false);
    assert.match(entry.message.text, /キャンパスガールズ2027に出場中です/);
    assert.match(entry.message.text, /パトン投票は明日の9月1日まで/);
    assert.match(entry.message.text, /1\.5倍になって私に届きます/);
    assert.match(entry.message.text, /あと一時間ぐらいかな/);
    assert.match(entry.message.text, /頑張るぞ！/);
  });
});

describe("2026-08-31 Instagram Story voice vote call — published media", () => {
  it("publishes exactly one shared MP4 and one real-frame poster", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b45-"))
      .sort();
    assert.deepEqual(assets, [fixture.poster, fixture.publicVideo].sort());

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
  });

  it("keeps geometry, frames, and the owner-requested spoken audio", async () => {
    const mp4 = path.join(galleryDirectory, fixture.publicVideo);
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.ok(audio);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, fixture.width);
    assert.equal(video.height, fixture.height);
    assert.equal(video.avg_frame_rate, fixture.avgFrameRate);
    assert.equal(video.nb_frames, fixture.nbFrames);
    assert.ok(Math.abs(Number(info.format.duration) - fixture.duration) < 0.001);
    assert.equal(audio.codec_name, "aac");
    assert.equal(audio.sample_rate, "44100");
    assert.equal(audio.channels, 2);
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(info.chapters, []);
    assert.equal("creation_time" in (info.format.tags ?? {}), false);
    assert.notEqual(video.tags?.handler_name, "Core Media Video");
    assert.notEqual(audio.tags?.handler_name, "Core Media Audio");

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
      assert.equal(sourceAudio.codec_name, "aac");
      assert.equal(sourceAudio.profile, "HE-AAC");
      assert.equal(sourceAudio.sample_rate, fixture.originalAudioRate);
      assert.equal(sourceAudio.channels, 2);
    }
  });
});

describe("2026-08-31 Instagram Story voice vote call — privacy and scope", () => {
  it("does not create articles, milestones, events, manual schedules, or photo records", () => {
    const ids = new Set([fixture.item.id, NEWS_ID]);
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

  it("documents the kept-audio exception and both CTA paths", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(docs, /batch b45/);
    assert.match(docs, /本人肉声の保持を明示依頼/);
    assert.match(docs, /AAC 音声を残す/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /972 frames/);
    assert.match(ops, /独立動画24本/);
    assert.match(ops, /67件/);
    assert.match(ops, /Instagramプロフィールを見る/);
    assert.match(ops, /Patonでみりぃに投票する/);
    assert.match(ops, /sameDayOrder: 7/);
  });
});
