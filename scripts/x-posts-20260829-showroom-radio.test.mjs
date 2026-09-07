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
import { createPortalFeed, PORTAL_FEED_LIMIT } from "../src/data/portalFeed.ts";
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

const LIVE_ID = "2026-08-29-showroom-live-third-round";
const RADIO_ID = "2026-08-29-showroom-radio-1440";
const LIVE_SOURCE = "https://x.com/Mily_chan36/status/2093575115913224580";
const RADIO_SOURCE = "https://x.com/Mily_chan36/status/2093572006457557333";
const SHOWROOM = "https://www.showroom-live.com/r/circle2026_0734";
const LIVE_MESSAGE =
  "🔥2次審査🩵三橋莉子🍅 #ミスサークル2026 配信中‼︎\n" +
  "📌9/3〜3次審査‼️\n" +
  "素敵な景色を皆さんと一緒に見に行きたい😤✊🏻✨\n" +
  "https://www.showroom-live.com/r/circle2026_0734?t=1787982168";
const RADIO_MESSAGE =
  "SR配信（ラジオ📻🗣️）\n" +
  "14:40〜始めるね⭐️\n" +
  "\n" +
  "#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサークルコンテスト2026";

function item(id) {
  return news.find((entry) => entry.id === id);
}

describe("2026-08-29 SHOWROOM radio / third-round X posts — Latest entry", () => {
  it("adds two source-backed News items in confirmed editorial order", () => {
    const live = item(LIVE_ID);
    const radio = item(RADIO_ID);
    const ordered = sortNewsByDateDesc(news);

    assert.ok(live);
    assert.ok(radio);
    assert.equal(news.filter((entry) => entry.id === LIVE_ID).length, 1);
    assert.equal(news.filter((entry) => entry.id === RADIO_ID).length, 1);
    assert.equal(news.filter((entry) => entry.source === LIVE_SOURCE).length, 1);
    assert.equal(news.filter((entry) => entry.source === RADIO_SOURCE).length, 1);
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
    assert.equal(ordered[17]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(ordered[18]?.id, "2026-08-30-mixch-final-day");
    assert.equal(ordered[19]?.id, "2026-08-30-showroom-30-day-story");
    assert.equal(ordered[20]?.id, "2026-08-30-paton-rank-3");
    assert.equal(ordered[21]?.id, "2026-08-29-paton-vote-day-5-story");
    assert.equal(ordered[22]?.id, LIVE_ID);
    assert.equal(ordered[23]?.id, RADIO_ID);
    assert.equal(ordered[24]?.id, "2026-08-29-paton-vote-day-4-story");
    assert.equal(live.date, "2026-08-29");
    assert.equal(radio.date, "2026-08-29");
    assert.equal(live.sameDayOrder, 3);
    assert.equal(radio.sameDayOrder, 2);
    assert.deepEqual(live.activityIds, ["miss-circle", "live-stream"]);
    assert.deepEqual(radio.activityIds, ["live-stream"]);
    assert.equal(live.source, LIVE_SOURCE);
    assert.equal(radio.source, RADIO_SOURCE);
    assert.equal(live.sourceLabel, "Xの投稿を見る");
    assert.equal(radio.sourceLabel, "Xの投稿を見る");
    assert.equal(live.url, SHOWROOM);
    assert.equal(radio.url, SHOWROOM);
    assert.equal(live.ctaLabel, "SHOWROOMを見る");
    assert.equal(radio.ctaLabel, "SHOWROOMを見る");
    assert.equal(live.media, undefined);
    assert.equal(radio.media, undefined);
    assert.equal(live.additionalMedia, undefined);
    assert.equal(radio.additionalMedia, undefined);
    assert.equal(live.additionalCtas, undefined);
    assert.equal(radio.additionalCtas, undefined);
    assert.equal(live.source.includes("?s="), false);
    assert.equal(radio.source.includes("?s="), false);
    assert.equal(live.url.includes("?t="), false);
    assert.deepEqual(verifyNews([live, radio]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim", () => {
    const live = item(LIVE_ID);
    const radio = item(RADIO_ID);

    assert.equal(live.message?.label, "みりぃの投稿");
    assert.equal(radio.message?.label, "みりぃの投稿");
    assert.equal(live.message?.text, LIVE_MESSAGE);
    assert.equal(radio.message?.text, RADIO_MESSAGE);
    assert.match(live.message.text, /配信中‼︎/);
    assert.match(live.message.text, /9\/3〜3次審査/);
    assert.match(live.message.text, /素敵な景色を皆さんと一緒に見に行きたい/);
    assert.match(radio.message.text, /^SR配信（ラジオ📻🗣️）\n/);
    assert.match(radio.message.text, /14:40〜始めるね⭐️\n\n/);
  });

  it("uses archive wording and does not invent a slot or contest-phase change", () => {
    const live = item(LIVE_ID);
    const radio = item(RADIO_ID);
    const copy = `${live.title}\n${live.body}\n${radio.title}\n${radio.body}`;

    assert.match(live.body, /8月29日/);
    assert.match(live.body, /SHOWROOM配信中/);
    assert.match(live.body, /9月3日から3次審査/);
    assert.match(live.body, /素敵な景色を皆さんと一緒に見に行きたい/);
    assert.match(radio.body, /8月29日/);
    assert.match(radio.body, /14:40からのSHOWROOMラジオ配信を案内/);
    assert.match(radio.body, /配信前の記録/);
    assert.equal(contest.currentPhase?.name, "3次審査");
    assert.equal(contest.currentPhase?.start, "2026-09-03");
    assert.equal(contest.currentPhase?.end, "2026-09-13");

    for (const phrase of [
      "配信します",
      "現在予定されている配信",
      "2次審査進出",
      "ファイナル進出",
      "グランプリ",
      "現在順位",
      "得票",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("contains no rankings, engagement metrics, or unrelated contest facts", () => {
    const live = item(LIVE_ID);
    const radio = item(RADIO_ID);
    const copy = `${live.title}\n${live.body}\n${live.message.text}\n${radio.title}\n${radio.body}\n${radio.message.text}`;

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

describe("2026-08-29 SHOWROOM radio / third-round X posts — scope", () => {
  it("stays out of Gallery, Gallery videos, Stories, and highlights", async () => {
    for (const id of [LIVE_ID, RADIO_ID]) {
      assert.equal(media.some((entry) => entry.id.includes(id)), false);
      assert.equal(
        galleryVideos.some((entry) => entry.id.includes(id)),
        false,
      );
      assert.equal(
        stories.some((entry) => entry.slug.includes(id)),
        false,
      );
      assert.equal(
        highlights.some((entry) => entry.id.includes(id)),
        false,
      );
      assert.equal(existsSync(path.join(root, "stories", id)), false);
    }

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
      "src/data/contest.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(LIVE_ID), false, relative);
      assert.equal(source.includes(RADIO_ID), false, relative);
      assert.equal(source.includes("2093575115913224580"), false, relative);
      assert.equal(source.includes("2093572006457557333"), false, relative);
    }
  });

  it("does not hand-enter a new slot into schedule data", async () => {
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );

    for (const relative of ["src/data/events.ts", "src/data/streamSchedule.ts"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(LIVE_ID), false, relative);
      assert.equal(source.includes(RADIO_ID), false, relative);
      assert.equal(source.includes("2093575115913224580"), false, relative);
      assert.equal(source.includes("2093572006457557333"), false, relative);
    }
  });

  it("leads Latest and the matching Activities without joining CAMPUS GIRLS or radio", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);

    assert.equal(liveNews[0]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(liveNews[1]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(liveNews[2]?.id, "2026-08-31-morning-stream-thanks");
    assert.equal(liveNews[3]?.id, "2026-08-31-showroom-wake-me");
    assert.equal(liveNews[4]?.id, "2026-08-30-consecutive-stream-30");
    assert.equal(liveNews[5]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(liveNews[6]?.id, "2026-08-30-showroom-30-day-story");
    assert.equal(liveNews[7]?.id, LIVE_ID);
    assert.equal(liveNews[8]?.id, RADIO_ID);
    assert.equal(missNews[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(missNews[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(missNews[2]?.id, LIVE_ID);
    assert.equal(
      campusNews.some((entry) => entry.id === LIVE_ID || entry.id === RADIO_ID),
      false,
    );
    assert.equal(
      radioNews.some((entry) => entry.id === LIVE_ID || entry.id === RADIO_ID),
      false,
    );
    assert.ok(liveNews.every(({ activityIds }) => activityIds?.includes("live-stream")));
  });
});

describe("2026-08-29 SHOWROOM radio / third-round X posts — Portal Feed", () => {
  it("flows through Portal Feed without a hardcoded news id or image", async () => {
    const feed = createPortalFeed({ newsItems: news,
      now: new Date("2026-08-29T16:00:00+09:00"),
      limit: PORTAL_FEED_LIMIT + 4,
    });
    const liveEntry = findFeedItem(feed, portalNewsId(LIVE_ID));
    const radioEntry = findFeedItem(feed, portalNewsId(RADIO_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(liveEntry.type, "news");
    assert.equal(radioEntry.type, "news");
    assert.equal(liveEntry.publishedAt, "2026-08-29T00:00:00+09:00");
    assert.equal(radioEntry.publishedAt, "2026-08-29T00:00:00+09:00");
    assert.equal(liveEntry.sourceUrl, LIVE_SOURCE);
    assert.equal(radioEntry.sourceUrl, RADIO_SOURCE);
    assert.equal(liveEntry.image, undefined);
    assert.equal(radioEntry.image, undefined);

    const portalSource = await readFile(
      path.join(root, "src/data/portalFeed.ts"),
      "utf8",
    );
    assert.equal(portalSource.includes(LIVE_ID), false);
    assert.equal(portalSource.includes(RADIO_ID), false);
    assert.equal(portalSource.includes("2093575115913224580"), false);
    assert.equal(portalSource.includes("2093572006457557333"), false);
  });

  it("documents the 8/29 SHOWROOM X posts in CONTENT-OPS", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(ops, /53件/);
    assert.match(ops, /2093572006457557333/);
    assert.match(ops, /2093575115913224580/);
    assert.match(ops, /14:40〜ラジオ配信案内/);
    assert.match(ops, /9\/3〜3次審査/);
    assert.match(ops, /streamSchedule \/ contest\.ts には追加しない/);
  });
});
