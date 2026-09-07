import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { contest } from "../src/data/contest.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-09-03-miss-circle-goals-support";
const THIRD_ROUND_ID = "2026-09-02-miss-circle-third-round";
const SOURCE = "https://x.com/Mily_chan36/status/2095397884107849991";
const TWEET_ID = "2095397884107849991";
const DAILY_WEB_VOTE_TWEET = "2095397941972537361";
const LIVE_NOW_TWEET = "2095386398979445200";
const TITLE = "三次審査、目標と応援方法";
const BODY =
  "みりぃがXに、三次審査の目標と応援方法を載せておきました、と投稿しました。";
const MESSAGE =
  "🔥ガチイベ🔥3次審査🩵\n" +
  "○みりぃの目標\n" +
  "○応援方法\n" +
  "載せておきました🙂‍↕️チェックして、応援のほどよろしくお願いします〜！頑張るｿﾞ✨";

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

describe("2026-09-03 X 三次審査の目標と応援方法 — Latest entry", () => {
  it("adds exactly one source-backed News item ahead of the 9/2 third-round card", () => {
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
    assert.equal(ordered[0], entry);
    assert.equal(ordered[1]?.id, THIRD_ROUND_ID);
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.equal(entry.date, "2026-09-03");
    assert.equal(entry.sameDayOrder, 10);
    assert.deepEqual(entry.activityIds, ["miss-circle"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "みりぃのX");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.ok(news.some((candidate) => candidate.id === THIRD_ROUND_ID));
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim and a short fan NEWS body", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 4);
    assert.match(entry.message.text, /^🔥ガチイベ🔥3次審査🩵\n/);
    assert.match(entry.message.text, /○みりぃの目標\n○応援方法\n/);
    assert.match(entry.message.text, /載せておきました/);
    assert.match(entry.message.text, /頑張るｿﾞ✨$/);
    assert.ok(entry.body.length <= 80);
  });

  it("does not restate vote windows, live copy, or numbers from photos", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    assert.doesNotMatch(copy, /公式|公認|本人運営/);
    assert.doesNotMatch(copy, /JST|\blive\b|作業メモ/i);
    assert.doesNotMatch(copy, /12:00|23:59|5:00|21:59/);
    assert.doesNotMatch(copy, /9月3日から|9\/3から9\/13|9\/13/);
    assert.doesNotMatch(copy, /配信中|毎日WEB投票|WEB投票は/);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り/);
    assert.doesNotMatch(copy, /票|pt|ポイント|順位/);
    assert.doesNotMatch(copy, /CanCam|AGESTOCK|横浜アリーナ/);
    assert.equal(copy.toLowerCase().includes("millie"), false);
  });

  it("does not turn the related daily-vote or live-now tweets into NEWS cards", () => {
    const serialized = JSON.stringify(news);

    assert.equal(serialized.includes(DAILY_WEB_VOTE_TWEET), false);
    assert.equal(serialized.includes(LIVE_NOW_TWEET), false);
    assert.equal(
      news.some((candidate) => (candidate.source ?? "").includes(DAILY_WEB_VOTE_TWEET)),
      false,
    );
    assert.equal(
      news.some((candidate) => (candidate.source ?? "").includes(LIVE_NOW_TWEET)),
      false,
    );
  });

  it("has no vote button and keeps organizer links on the existing 9/2 card", () => {
    const entry = item();
    const thirdRound = news.find((candidate) => candidate.id === THIRD_ROUND_ID);
    const now = Date.parse("2026-09-03T12:00:00+09:00");
    const resolved = resolveNewsLinks(entry, now);

    assert.equal(resolved.cta, undefined);
    assert.equal(resolved.additionalCtas, undefined);
    assert.equal(resolved.relatedUrl, undefined);
    assert.ok(thirdRound);
    assert.notEqual(entry, thirdRound);
    assert.equal(thirdRound.ctaLabel, "WEB投票する");
  });
});

describe("2026-09-03 X 三次審査の目標と応援方法 — scope", () => {
  it("surfaces on the miss-circle Activity only", () => {
    const missNews = selectActivityNews("miss-circle", news, news.length);
    assert.equal(missNews[0]?.id, NEWS_ID);
    assert.equal(missNews[1]?.id, THIRD_ROUND_ID);
    for (const activityId of ["live-stream", "campus-girls", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("stays out of Gallery, Stories, highlights, and schedule data", async () => {
    assert.equal(media.some((entry) => String(entry.id).includes(NEWS_ID)), false);
    assert.equal(
      galleryVideos.some((entry) => String(entry.id ?? "").includes(NEWS_ID)),
      false,
    );
    assert.equal(
      stories.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );
    assert.equal(
      highlights.some((entry) => String(entry.id).includes(NEWS_ID)),
      false,
    );
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    assert.deepEqual(events, []);
    assert.equal(contest.currentPhase?.name, "3次審査");

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
      "src/data/contest.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
    ]) {
      const sourceText = await readFile(path.join(root, relative), "utf8");
      assert.equal(sourceText.includes(NEWS_ID), false, relative);
      assert.equal(sourceText.includes(TWEET_ID), false, relative);
    }

    assert.equal(
      JSON.stringify(streamSchedule).includes(NEWS_ID),
      false,
    );
  });

  it("does not invent other people, sites, or SNS media URLs", async () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    for (const phrase of FORBIDDEN_PEOPLE_SITES) {
      assert.equal(copy.includes(phrase), false, phrase);
    }

    for (const relative of ["src/data/news.ts", "docs/CONTENT-OPS.md"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("pbs.twimg.com"), false, relative);
      assert.equal(source.includes("video.twimg.com"), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
      assert.equal(source.toLowerCase().includes("millie"), false, relative);
    }
  });
});

describe("2026-09-03 X 三次審査の目標と応援方法 — Portal Feed and CONTENT-OPS", () => {
  it("flows through Portal Feed as text-only NEWS", () => {
    const feed = createPortalFeed({ newsItems: news, now: new Date("2026-09-03T16:00:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-03T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);
  });

  it("documents the separate 9/3 card without images or vote buttons", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("### 2026-09-03 本人X 三次審査の目標と応援方法");
    const end = ops.indexOf("### 2026-09-02 ミスサー三次審査 NEWS と Calendar");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);

    assert.match(ops, /79件/);
    assert.match(section, /2095397884107849991/);
    assert.match(section, /sameDayOrder: 10/);
    assert.match(section, /テキストNEWS＋出典リンクのみ/);
    assert.match(section, /2026-09-02-miss-circle-third-round/);
    assert.match(section, /別カード/);
    assert.match(section, /2095397941972537361/);
    assert.match(section, /2095386398979445200/);
    assert.match(section, /ctaLabel.*は付けない/);
    assert.doesNotMatch(section, /WEB投票する/);
    assert.doesNotMatch(section, /Drive ID|attachment hash|sha256/);
    assert.equal(DRIVE_HOST_PATTERN.test(ops), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(ops), false);
  });
});
