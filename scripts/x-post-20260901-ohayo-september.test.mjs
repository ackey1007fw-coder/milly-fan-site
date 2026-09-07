import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "./fixtures/gallery-videos-before-b58.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { isMixchMovie } from "../src/data/mixchMovies.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { ohayoSeptemberXVideo } from "../src/data/ohayoSeptemberXVideo.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { septemberMilyStoryVideo } from "../src/data/septemberMilyStoryVideo.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { contest } from "../src/data/contest.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-09-01-ohayo-september-x";
const SEPTEMBER_STORY_ID = "2026-09-01-september-mily-story";
const FINAL_DAY_STORY_ID = "2026-09-01-paton-vote-final-day-story";
const SOURCE = "https://x.com/Mily_chan36/status/2094579904587382930";
const TWEET_ID = "2094579904587382930";
const WAVE_DASH = "\u{301C}";
const SUN = "\u{1F31E}";
const PROLONGED = "\u{30FC}";
const FULLWIDTH_BANG = "\u{FF01}";
const MESSAGE = `おはよ${WAVE_DASH}${SUN}\n今日から9月${PROLONGED}${FULLWIDTH_BANG}${FULLWIDTH_BANG}`;

const FORBIDDEN_PEOPLE_SITES = [
  "Millie",
  "millie",
  "あっきー",
  "Ackey",
  "公式サイト",
  "公認",
  "本人運営",
  "tiktok.com",
  "instagram.com",
  "pbs.twimg.com",
  "video.twimg.com",
  "amplify_video",
  "_movie_mps",
];

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-01 X おはよ〜 今日から9月ー — Latest entry", () => {
  it("adds exactly one source-backed News item ahead of the 9/1 Instagram Stories", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(
      news.filter((candidate) => (candidate.source ?? "").includes(TWEET_ID)).length,
      1,
    );
    assert.equal(news.length, 75);
    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.equal(ordered[4]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(ordered[5]?.id, NEWS_ID);
    assert.equal(ordered[6]?.id, FINAL_DAY_STORY_ID);
    assert.equal(ordered[7]?.id, SEPTEMBER_STORY_ID);
    assert.equal(entry.date, "2026-09-01");
    assert.equal(entry.sameDayOrder, 3);
    assert.equal(news.find((candidate) => candidate.id === FINAL_DAY_STORY_ID)?.sameDayOrder, 2);
    assert.equal(news.find((candidate) => candidate.id === SEPTEMBER_STORY_ID)?.sameDayOrder, 1);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.media, ohayoSeptemberXVideo);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed greeting verbatim, including the line break and no hashtags", () => {
    const entry = item();

    assert.equal(entry.title, "おはよ〜 今日から9月ー");
    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 2);
    assert.equal(entry.message.text.includes("#"), false);
    assert.equal(entry.message.text.includes(WAVE_DASH), true);
    assert.equal(entry.message.text.includes(SUN), true);
    assert.equal(entry.message.text.includes(PROLONGED), true);
    assert.equal(entry.message.text.includes(FULLWIDTH_BANG), true);
    assert.equal(entry.message.text.includes("!"), false);
  });

  it("uses archive wording and stays a greeting-only NEWS card", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    assert.equal(
      entry.body,
      "9月1日朝、みりぃがXで「おはよ〜 今日から9月ー！！」とあいさつした。約3秒の動画付き。",
    );
    assert.match(entry.body, /9月1日朝/);
    assert.match(entry.body, /あいさつした/);
    assert.match(entry.body, /約3秒の動画付き/);

    for (const phrase of [
      "配信します",
      "現在予定されている配信",
      "ファイナル進出",
      "グランプリ",
      "現在順位",
      "得票",
      "Paton",
      "パトン",
      "CAMPUS GIRLS",
      "SHOWROOM",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("does not merge with the existing 9/1 Instagram Story greeting", () => {
    const story = news.find((entry) => entry.id === SEPTEMBER_STORY_ID);

    assert.ok(story);
    assert.equal(news.filter((entry) => entry.id === SEPTEMBER_STORY_ID).length, 1);
    assert.equal(story.media?.id, "mily-b46-02-september-mily-story");
    assert.equal(story.media, septemberMilyStoryVideo);
    assert.notEqual(item().id, story.id);
    assert.notEqual(item().source, story.source);
    assert.notEqual(item().media, story.media);
    assert.equal(item().media, ohayoSeptemberXVideo);
  });

  it("attaches a thin X wrapper that reuses the b46-02 public MP4 and poster", async () => {
    const entry = item();
    const clip = entry.media;

    assert.equal(clip, ohayoSeptemberXVideo);
    assert.notEqual(clip, septemberMilyStoryVideo);
    assert.equal(clip.id, "mily-b46-02-september-mily-x-post");
    assert.equal(clip.kind, "video");
    assert.equal(clip.provenance, "owner-provided");
    assert.equal(clip.sourceDate, "2026-09-01");
    assert.equal(clip.sourceLabel, "Xの投稿を見る");
    assert.equal(clip.sourceUrl, SOURCE);
    assert.equal(clip.published, true);
    assert.equal(clip.src, septemberMilyStoryVideo.src);
    assert.equal(clip.poster, septemberMilyStoryVideo.poster);
    assert.equal(clip.width, septemberMilyStoryVideo.width);
    assert.equal(clip.height, septemberMilyStoryVideo.height);
    assert.equal(clip.alt, septemberMilyStoryVideo.alt);
    assert.equal(clip.src, "/media/gallery/mily-b46-02-september-mily-story.mp4");
    assert.equal(
      clip.poster,
      "/media/gallery/mily-b46-02-september-mily-story-poster.jpg",
    );
    assert.equal(isMixchMovie(clip), false);
    assert.equal(clip.src.includes("twimg"), false);
    assert.equal(clip.poster.includes("twimg"), false);
    assert.equal(clip.src.includes("mixch"), false);
    assert.equal(clip.poster.includes("mixch"), false);
    assert.equal(clip.src.startsWith("/media/gallery/"), true);
    assert.equal(clip.poster.startsWith("/media/gallery/"), true);

    const galleryDirectory = path.join(root, "public/media/gallery");
    const publicFiles = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b46-02"))
      .sort();
    assert.deepEqual(publicFiles, [
      "mily-b46-02-september-mily-story-poster.jpg",
      "mily-b46-02-september-mily-story.mp4",
    ]);
    assert.equal(existsSync(path.join(galleryDirectory, publicFiles[0])), true);
    assert.equal(existsSync(path.join(galleryDirectory, publicFiles[1])), true);

    assert.equal(galleryVideos.length, 32);
    assert.equal(
      galleryVideos.some((video) => video.id === ohayoSeptemberXVideo.id),
      false,
    );
    assert.equal(
      galleryVideos.filter(
        (video) => "src" in video && video.src === septemberMilyStoryVideo.src,
      ).length,
      1,
    );
    assert.equal(
      galleryVideos.find((video) => video.id === septemberMilyStoryVideo.id),
      septemberMilyStoryVideo,
    );
  });
});

describe("2026-09-01 X おはよ〜 今日から9月ー — scope and identity", () => {
  it("is not classified onto Activity pages", () => {
    for (const activityId of ["live-stream", "radio", "miss-circle", "campus-girls"]) {
      const selected = selectActivityNews(activityId, news, news.length);
      assert.equal(
        selected.some((entry) => entry.id === NEWS_ID),
        false,
        activityId,
      );
      assert.equal(
        selectActivityMedia(activityId).some(
          (entry) => entry.id === ohayoSeptemberXVideo.id,
        ),
        false,
        activityId,
      );
    }
  });

  it("stays out of Gallery, Stories, highlights, profile, and schedule files", async () => {
    assert.equal(media.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(stories.some((entry) => JSON.stringify(entry).includes(NEWS_ID)), false);
    assert.equal(highlights.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );
    assert.equal(contest.currentPhase?.name, "3次審査");

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/data/contest.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes(TWEET_ID), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
    }

    for (const relative of [
      "src/data/news.ts",
      "src/data/ohayoSeptemberXVideo.ts",
      "src/data/ohayoSeptemberXVideo.json",
      "docs/CONTENT-OPS.md",
      "docs/MEDIA.md",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("pbs.twimg.com"), false, relative);
      assert.equal(source.includes("video.twimg.com"), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
      assert.equal(source.toLowerCase().includes("millie"), false, relative);
    }

    const copy = `${item().title}\n${item().body}\n${item().message?.text ?? ""}`;
    for (const phrase of FORBIDDEN_PEOPLE_SITES) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
    assert.equal(copy.toLowerCase().includes("millie"), false);
  });
});

describe("2026-09-01 X おはよ〜 今日から9月ー — Portal Feed and CONTENT-OPS", () => {
  it("flows through Portal Feed with the X source and shared poster", async () => {
    const feed = createPortalFeed({ newsItems: news, now: new Date("2026-09-01T09:20:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-01T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.ok(entry.image?.endsWith(ohayoSeptemberXVideo.poster));
    assert.equal(entry.image?.includes("twimg"), false);
    assert.equal(entry.image?.includes("mixch"), false);

    const portalSource = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes(TWEET_ID), false);
  });

  it("documents the b46-02 reuse wrapper and keeps Gallery at one tile", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("### 2026-09-01 本人X おはよ〜 今日から9月ー");
    const end = ops.indexOf("### 2026-09-01 Instagram Story パトン投票最終日");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);

    assert.match(ops, /70件/);
    assert.match(ops, /2094579904587382930/);
    assert.match(ops, /おはよ〜 今日から9月ー/);
    assert.match(section, /wrapper object/);
    assert.match(section, /mily-b46-02-september-mily-story/);
    assert.match(section, /2枚目の Gallery tile は作らない/);
    assert.match(section, /Latest は2カード、Gallery は1本/);
    assert.doesNotMatch(section, /テキストNEWS＋出典リンクのみ/);
    assert.doesNotMatch(section, /Drive本人カットは未指定/);
    assert.match(ops, /sameDayOrder: 3/);
    assert.match(ops, /2026-09-01-september-mily-story/);
    assert.equal(DRIVE_HOST_PATTERN.test(ops), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(ops), false);
  });
});
