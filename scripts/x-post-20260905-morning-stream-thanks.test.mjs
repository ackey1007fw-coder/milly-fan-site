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

const NEWS_ID = "2026-09-05-morning-stream-thanks";
const NEXT_SLOTS_ID = "2026-09-06-stream-thanks-next-slots";
const NIGHT_SLOT_ID = "2026-09-06-night-slot-2230";
const RESULT_ID = "2026-09-06-campus-girls-prelim-final-result";
const TIKTOK_ID = "2026-09-05-tiktok-radio-portrait";
const SOURCE = "https://x.com/Mily_chan36/status/2096037739833737354";
const TWEET_ID = "2096037739833737354";
const TITLE = "朝配信ありがとう";
const BODY =
  "みりぃがXで、朝配信へのお礼を伝えました。次は14:30〜、ともあります。";
const MESSAGE =
  "朝配信来てくれてありがとう✊🏻❤️‍🔥\n" +
  "みんなにも元気届けられたかなー？少しづつ前向いてくよ🙂‍↕️\n" +
  "次は14:30〜ね！投票も忘れずにっ‼️";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-05 X 朝配信お礼 — Latest entry", () => {
  it("adds exactly one source-backed text NEWS card ahead of the same-day TikTok", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(
      news.filter((candidate) => (candidate.source ?? "").includes(TWEET_ID)).length,
      1,
    );
    assert.equal(ordered[0]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(ordered[1]?.id, NEXT_SLOTS_ID);
    assert.equal(ordered[2]?.id, RESULT_ID);
    assert.equal(ordered[3]?.id, NIGHT_SLOT_ID);
    assert.equal(ordered[4], entry);
    assert.equal(ordered[5]?.id, TIKTOK_ID);
    assert.equal(entry.date, "2026-09-05");
    assert.equal(entry.sameDayOrder, 20);
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
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim and a short fan NEWS body", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 3);
    assert.match(entry.message.text, /^朝配信来てくれてありがとう✊🏻❤️‍🔥\n/);
    assert.match(entry.message.text, /次は14:30〜ね！投票も忘れずにっ‼️$/);
    assert.ok(entry.body.length <= 80);
  });

  it("does not add vote buttons, hurry copy, or invented ranks", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.doesNotMatch(copy, /公式|公認|本人運営/);
    assert.doesNotMatch(copy, /JST|\blive\b|作業メモ/i);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り/);
    assert.doesNotMatch(copy, /票|pt|ポイント|順位|位/);
    assert.doesNotMatch(copy, /CanCam|AGESTOCK|横浜アリーナ/);
    assert.equal(copy.toLowerCase().includes("millie"), false);

    const now = Date.parse("2026-09-05T12:00:00+09:00");
    const resolved = resolveNewsLinks(entry, now);
    assert.equal(resolved.cta, undefined);
    assert.equal(resolved.additionalCtas, undefined);
    assert.equal(resolved.relatedUrl, undefined);
  });

  it("keeps the 9/5 thanks card separate from the 9/6 night-slot change", () => {
    assert.equal(
      news.filter((candidate) => candidate.id === NEWS_ID).length,
      1,
    );
    assert.equal(
      news.filter((candidate) => candidate.date === "2026-09-05").length,
      2,
    );
    assert.equal(
      news.filter((candidate) => candidate.id === NIGHT_SLOT_ID).length,
      1,
    );
    assert.notEqual(
      news.find((candidate) => candidate.id === NIGHT_SLOT_ID)?.source,
      SOURCE,
    );
  });
});

describe("2026-09-05 X 朝配信お礼 — scope", () => {
  it("surfaces on the live-stream Activity only", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    assert.equal(liveNews[0]?.id, NEXT_SLOTS_ID);
    assert.equal(liveNews[1]?.id, NIGHT_SLOT_ID);
    assert.equal(liveNews[2]?.id, NEWS_ID);
    for (const activityId of ["miss-circle", "campus-girls", "radio"]) {
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

    const night = streamSchedule.find(
      (slot) => slot.date === "2026-09-06" && slot.time === "21:30",
    );
    assert.deepEqual(night, {
      date: "2026-09-06",
      time: "21:30",
    });
    assert.equal(
      streamSchedule.some(
        (slot) =>
          slot.date === "2026-09-06" &&
          (slot.time === "22:30" || slot.endTime === "22:00" || slot.endTime === "22:50"),
      ),
      false,
    );
    assert.deepEqual(
      streamSchedule.filter((slot) => slot.date === "2026-09-06"),
      [
        { date: "2026-09-06", time: "05:30", endTime: "07:00" },
        { date: "2026-09-06", time: "21:30" },
      ],
    );
  });

  it("does not invent other people, sites, or SNS media URLs", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

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

describe("2026-09-05 X 朝配信お礼 — Portal Feed", () => {
  it("flows through Portal Feed as text-only NEWS", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-05T16:00:00+09:00"),
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-05T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);
  });
});
