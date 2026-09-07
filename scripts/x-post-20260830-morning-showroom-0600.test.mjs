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
import { verifyNews } from "./content-invariants.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-30-morning-showroom-0600";
const SOURCE = "https://x.com/Mily_chan36/status/2093802690598064521";
const SHOWROOM = "https://www.showroom-live.com/r/circle2026_0734";
const FIST = "\u{270A}\u{1F3FB}";
const HEART_ON_FIRE = "\u{2764}\u{FE0F}\u{200D}\u{1F525}";
const WAVE_DASH = "\u{301C}";
const EIGHTH_NOTE = "\u{266A}";
const MESSAGE =
  "おはよーーう！！！\n" +
  `今日もみんなと乗り越えていく${FIST}${HEART_ON_FIRE}\n` +
  "\n" +
  `SR 6:00${WAVE_DASH}6:30で配信するよん${EIGHTH_NOTE}\n` +
  "\n" +
  "#ミスサー #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークル #ミスサークルコンテスト2026";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-30 morning SHOWROOM 6:00 X post — Latest entry", () => {
  it("adds one source-backed News item in confirmed editorial order", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(news.length, 75);
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
    assert.equal(ordered[16]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(ordered[17]?.id, NEWS_ID);
    assert.equal(ordered[18]?.id, "2026-08-30-mixch-final-day");
    assert.equal(ordered[19]?.id, "2026-08-30-showroom-30-day-story");
    assert.equal(ordered[20]?.id, "2026-08-30-paton-rank-3");
    assert.equal(ordered[21]?.id, "2026-08-29-paton-vote-day-5-story");
    assert.equal(entry.date, "2026-08-30");
    assert.equal(entry.sameDayOrder, 2);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, SHOWROOM);
    assert.equal(entry.ctaLabel, "SHOWROOMを見る");
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.source.includes("?s="), false);
    assert.equal(entry.url.includes("?t="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including blank lines and emoji", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 6);
    assert.match(entry.message.text, /^おはよーーう！！！\n/);
    assert.match(entry.message.text, /今日もみんなと乗り越えていく/);
    assert.equal(entry.message.text.includes(FIST), true);
    assert.equal(entry.message.text.includes(HEART_ON_FIRE), true);
    assert.equal(entry.message.text.includes(WAVE_DASH), true);
    assert.equal(entry.message.text.includes(EIGHTH_NOTE), true);
    assert.match(entry.message.text, /SR 6:00/);
    assert.match(entry.message.text, /6:30で配信するよん/);
    assert.match(
      entry.message.text,
      /#ミスサー #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークル #ミスサークルコンテスト2026$/,
    );
  });

  it("uses archive wording and does not invent a slot or contest-phase change", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.body, /8月30日朝/);
    assert.match(entry.body, /おはよう/);
    assert.match(entry.body, /今日もみんなと乗り越えていく/);
    assert.match(entry.body, /6:00〜6:30のSHOWROOM配信案内/);
    assert.match(entry.body, /配信前の記録/);
    assert.equal(contest.currentPhase?.name, "3次審査");

    for (const phrase of [
      "配信します",
      "現在予定されている配信",
      "ファイナル進出",
      "グランプリ",
      "現在順位",
      "得票",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("contains no rankings, engagement metrics, or unrelated contest facts", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    for (const phrase of [
      "現在順位",
      "順位",
      "得票",
      "SHOWROOMポイント",
      "いいね",
      "リポスト",
      "RP数",
      "閲覧数",
      "フォロワー数",
      "CAMPUS GIRLS",
      "Paton",
      "パトン",
      "審査員賞",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-30 morning SHOWROOM 6:00 X post — scope", () => {
  it("stays out of Gallery, Gallery videos, Stories, and highlights", async () => {
    assert.equal(media.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(
      galleryVideos.some((entry) => entry.id.includes(NEWS_ID)),
      false,
    );
    assert.equal(
      stories.some((entry) => entry.slug.includes("morning-showroom-0600")),
      false,
    );
    assert.equal(
      highlights.some((entry) => entry.id.includes("morning-showroom-0600")),
      false,
    );
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
      "src/data/contest.ts",
    ]) {
      const sourceText = await readFile(path.join(root, relative), "utf8");
      assert.equal(sourceText.includes(NEWS_ID), false, relative);
      assert.equal(sourceText.includes("2093802690598064521"), false, relative);
    }
  });

  it("does not hand-enter a new slot into schedule data", async () => {
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );

    for (const relative of ["src/data/events.ts", "src/data/streamSchedule.ts"]) {
      const sourceText = await readFile(path.join(root, relative), "utf8");
      assert.equal(sourceText.includes(NEWS_ID), false, relative);
      assert.equal(sourceText.includes("2093802690598064521"), false, relative);
    }
  });

  it("leads LIVE STREAM without joining CAMPUS GIRLS, MISS CIRCLE, or radio", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);

    assert.equal(liveNews[0]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(liveNews[1]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(liveNews[2]?.id, "2026-08-31-morning-stream-thanks");
    assert.equal(liveNews[3]?.id, "2026-08-31-showroom-wake-me");
    assert.equal(liveNews[4]?.id, "2026-08-30-consecutive-stream-30");
    assert.equal(liveNews[5]?.id, NEWS_ID);
    assert.equal(liveNews[6]?.id, "2026-08-30-showroom-30-day-story");
    assert.equal(missNews[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(missNews[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(missNews[2]?.id, "2026-08-29-showroom-live-third-round");
    assert.equal(campusNews[0]?.id, "2026-09-02-paton-second-story");
    assert.equal(campusNews[1]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(campusNews[2]?.id, "2026-08-31-paton-vote-voice-story");
    assert.equal(
      campusNews.some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(
      missNews.some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(
      radioNews.some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.ok(liveNews.every(({ activityIds }) => activityIds?.includes("live-stream")));
  });
});

describe("2026-08-30 morning SHOWROOM 6:00 X post — Portal Feed", () => {
  it("flows through Portal Feed without a hardcoded news id or image", async () => {
    const feed = createPortalFeed({ newsItems: news, now: new Date("2026-08-30T06:10:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-30T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);

    const portalSource = await readFile(
      path.join(root, "src/data/portalFeed.ts"),
      "utf8",
    );
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("2093802690598064521"), false);
  });

  it("documents the 8/30 morning SHOWROOM X post in CONTENT-OPS", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(ops, /55件/);
    assert.match(ops, /2093802690598064521/);
    assert.match(ops, /SR 6:00〜6:30/);
    assert.match(ops, /sameDayOrder: 2/);
    assert.match(ops, /streamSchedule \/ contest\.ts には追加しない/);
  });
});
