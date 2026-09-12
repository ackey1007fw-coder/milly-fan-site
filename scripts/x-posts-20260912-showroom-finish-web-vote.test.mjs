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
import { news } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { avatarAchievementStoryVideo } from "../src/data/avatarAchievementStoryVideo.ts";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import { findFeedItem, portalNewsId } from "./portal-feed-order.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const AVATAR_ID = "2026-09-12-avatar-achievement-story";
const REMOVED_IDS = [
  "2026-09-12-third-round-showroom-avatar",
  "2026-09-12-web-vote-through-0913",
];
const SHOWROOM_SOURCE = "https://x.com/Mily_chan36/status/2098778956535407065";
const VOTE_SOURCE = "https://x.com/Mily_chan36/status/2098779286245454075";
const SHOWROOM_TWEET = "2098778956535407065";
const VOTE_TWEET = "2098779286245454075";

function item(id) {
  return news.find((entry) => entry.id === id);
}

describe("2026-09-12 X 3次SHOWROOM完走・WEB投票 — additionalSources integration", () => {
  it("keeps one avatar Story NEWS and does not add duplicate same-day X cards", () => {
    const avatar = item(AVATAR_ID);

    assert.ok(avatar);
    assert.equal(news.filter((candidate) => candidate.id === AVATAR_ID).length, 1);
    for (const id of REMOVED_IDS) {
      assert.equal(news.some((candidate) => candidate.id === id), false, id);
    }
    assert.equal(news.filter((candidate) => candidate.source === SHOWROOM_SOURCE).length, 0);
    assert.equal(news.filter((candidate) => candidate.source === VOTE_SOURCE).length, 0);
    assert.deepEqual(avatar.additionalSources, [
      { label: "みりぃのX", url: SHOWROOM_SOURCE },
      { label: "みりぃのX", url: VOTE_SOURCE },
    ]);
    assert.equal(avatar.media, avatarAchievementStoryVideo);
    assert.equal(avatar.additionalMedia, undefined);
    assert.match(avatar.body, /Xでも、完走・アバ権とWEB投票期限（9\/13まで）を案内しています。/);
    assert.doesNotMatch(`${avatar.title}\n${avatar.body}`, /公式|公認|本人運営/);
    assert.doesNotMatch(avatar.body, /12:00|23:59|FAQ|規則/);
    assert.equal(avatar.body.toLowerCase().includes("millie"), false);
    assert.equal(SHOWROOM_SOURCE.includes("?"), false);
    assert.equal(VOTE_SOURCE.includes("?"), false);
    assert.deepEqual(verifyNews([avatar]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("does not put the two X permalinks on any other NEWS card", () => {
    for (const entry of news) {
      const urls = [
        entry.source,
        ...(entry.additionalSources ?? []).map((source) => source.url),
      ].filter(Boolean);
      if (entry.id === AVATAR_ID) continue;
      assert.equal(urls.includes(SHOWROOM_SOURCE), false, entry.id);
      assert.equal(urls.includes(VOTE_SOURCE), false, entry.id);
    }
  });
});

describe("2026-09-12 X 3次SHOWROOM完走・WEB投票 — scope", () => {
  it("stays out of Gallery, Stories, highlights, and does not invent media", async () => {
    for (const id of [AVATAR_ID, ...REMOVED_IDS]) {
      assert.equal(media.some((entry) => String(entry.id).includes(id)), false);
      assert.equal(
        galleryVideos.some((entry) => String(entry.id ?? "").includes(id)),
        false,
      );
      assert.equal(stories.some((entry) => JSON.stringify(entry).includes(id)), false);
      assert.equal(highlights.some((entry) => String(entry.id).includes(id)), false);
      assert.equal(existsSync(path.join(root, "stories", id)), false);
    }
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
      assert.equal(sourceText.includes(SHOWROOM_TWEET), false, relative);
      assert.equal(sourceText.includes(VOTE_TWEET), false, relative);
      for (const id of REMOVED_IDS) {
        assert.equal(sourceText.includes(id), false, relative);
      }
    }
  });

  it("does not scrape X image hosts or invent another person", async () => {
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

describe("2026-09-12 X 3次SHOWROOM完走・WEB投票 — Portal Feed", () => {
  it("keeps a single video NEWS item instead of extra text cards", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-12T22:30:00+09:00"),
    });
    const avatar = findFeedItem(feed, portalNewsId(AVATAR_ID));

    assert.equal(avatar.type, "news");
    assert.equal(avatar.publishedAt, "2026-09-12T00:00:00+09:00");
    assert.match(avatar.summary, /Xでも、完走・アバ権とWEB投票期限（9\/13まで）を案内しています。/);
    for (const id of REMOVED_IDS) {
      assert.equal(
        feed.items.some((entry) => entry.id === portalNewsId(id)),
        false,
        id,
      );
    }
  });
});
