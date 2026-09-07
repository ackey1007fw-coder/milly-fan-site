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
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
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

const NEWS_ID = "2026-09-06-stream-thanks-next-slots";
const RESULT_ID = "2026-09-06-campus-girls-prelim-final-result";
const NIGHT_SLOT_ID = "2026-09-06-night-slot-2230";
const SOURCE = "https://x.com/Mily_chan36/status/2096604917893095494";
const TWEET_ID = "2096604917893095494";
const TITLE = "配信ありがとう、明日は6:30と22:00";
const BODY =
  "みりぃがXで、配信へのお礼と、翌日の配信が6:30〜7:30と22:00〜23:00であることを伝えました。";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-06 X 配信お礼と翌日枠 — Latest entry", () => {
  it("adds exactly one source-backed text NEWS card at the 9/6 head", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(
      news.filter((candidate) => (candidate.source ?? "").includes(TWEET_ID)).length,
      1,
    );
    assert.equal(news[1], entry);
    assert.equal(ordered[0]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(ordered[1], entry);
    assert.equal(ordered[2]?.id, RESULT_ID);
    assert.equal(ordered[3]?.id, NIGHT_SLOT_ID);
    assert.equal(entry.date, "2026-09-06");
    assert.equal(entry.sameDayOrder, 40);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
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
    assert.equal(entry.message, undefined);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps a short fan NEWS body and does not add a makeup NEWS", () => {
    const entry = item();
    const makeupNews = news.filter((candidate) =>
      /メイク/.test(`${candidate.id}\n${candidate.title}\n${candidate.body}`) &&
      candidate.date === "2026-09-06" &&
      candidate.id !== "2026-09-06-campus-girls-prelim-final-result",
    );

    assert.ok(entry.body.length <= 80);
    assert.equal(
      news.some((candidate) => candidate.id.includes("makeup") && candidate.date >= "2026-09-06"),
      false,
    );
    assert.equal(makeupNews.length, 0);
  });

  it("does not add vote buttons, hurry copy, ranks, or 盛り上がり度", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.doesNotMatch(copy, /公式|公認|本人運営/);
    assert.doesNotMatch(copy, /JST|\blive\b|作業メモ/i);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り/);
    assert.doesNotMatch(copy, /票|pt|ポイント|順位|位|盛り上がり度/);
    assert.doesNotMatch(copy, /メイク/);
    assert.equal(copy.toLowerCase().includes("millie"), false);

    const now = Date.parse("2026-09-06T23:30:00+09:00");
    const resolved = resolveNewsLinks(entry, now);
    assert.equal(resolved.cta, undefined);
    assert.equal(resolved.additionalCtas, undefined);
    assert.equal(resolved.relatedUrl, undefined);
  });
});

describe("2026-09-06 X 配信お礼と翌日枠 — schedule", () => {
  it("confirms only the two 9/7 windows from the X post", () => {
    assert.deepEqual(
      streamSchedule.filter((slot) => slot.date === "2026-09-07"),
      [
        { date: "2026-09-07", time: "06:30", endTime: "07:30" },
        { date: "2026-09-07", time: "22:00", endTime: "23:00" },
      ],
    );
    assert.deepEqual(
      streamSchedule.filter((slot) => slot.date === "2026-09-06"),
      [
        { date: "2026-09-06", time: "05:30", endTime: "07:00" },
        { date: "2026-09-06", time: "21:30" },
      ],
    );
  });
});

describe("2026-09-06 X 配信お礼と翌日枠 — scope", () => {
  it("surfaces on the live-stream Activity only", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    assert.equal(liveNews[0]?.id, NEWS_ID);
    for (const activityId of ["miss-circle", "campus-girls", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("stays out of Gallery, Stories, highlights, and does not start 八月の思い出", async () => {
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
    assert.equal(
      news.some((candidate) => `${candidate.title}\n${candidate.body}`.includes("八月の思い出")),
      false,
    );

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
  });

  it("does not invent other people, sites, or SNS media URLs", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    for (const phrase of [
      "Millie",
      "millie",
      "公式サイト",
      "公認",
      "本人運営",
      "pbs.twimg.com",
      "video.twimg.com",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("does not scrape X image hosts in the NEWS or ops notes", async () => {
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

describe("2026-09-06 X 配信お礼と翌日枠 — Portal Feed", () => {
  it("flows through Portal Feed as text-only NEWS", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-06T23:30:00+09:00"),
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-06T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);
  });
});
