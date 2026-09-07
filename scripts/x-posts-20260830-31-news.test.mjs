import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { campusGirlsPatonPortraitImage } from "../src/data/campusGirlsPatonImages.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { campusGirlsPatonVoteLink } from "../src/data/links.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { createPortalFeed, PORTAL_FEED_LIMIT } from "../src/data/portalFeed.ts";
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

const THANKS_ID = "2026-08-31-morning-stream-thanks";
const PATON_15X_ID = "2026-08-31-paton-15x-day";
const WAKE_ID = "2026-08-31-showroom-wake-me";
const CONSEC_ID = "2026-08-30-consecutive-stream-30";
const RANK3_ID = "2026-08-30-paton-rank-3";
const NEW_IDS = [THANKS_ID, PATON_15X_ID, WAKE_ID, CONSEC_ID, RANK3_ID];

const THANKS_SOURCE = "https://x.com/Mily_chan36/status/2094192106105659650";
const PATON_15X_SOURCE = "https://x.com/Mily_chan36/status/2094102196447334713";
const PATON_15X_FOLLOWUP = "https://x.com/Mily_chan36/status/2094191581951906187";
const WAKE_SOURCE = "https://x.com/Mily_chan36/status/2094179970960744615";
const CONSEC_SOURCE = "https://x.com/Mily_chan36/status/2094023746751463582";
const RANK3_SOURCE = "https://x.com/Mily_chan36/status/2093802981921849728";
const SHOWROOM = "https://www.showroom-live.com/r/circle2026_0734";
const PATON = "https://paton.jp/event/entrant/11380";
const START = Date.parse("2026-08-26T18:00:00+09:00");
const END = Date.parse("2026-09-01T23:59:00+09:00");

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

function item(id) {
  return news.find((entry) => entry.id === id);
}

describe("2026-08-30〜31 X posts — Latest entries", () => {
  it("adds five source-backed News items with confirmed JST dates", () => {
    const ordered = sortNewsByDateDesc(news);
    const thanks = item(THANKS_ID);
    const paton15x = item(PATON_15X_ID);
    const wake = item(WAKE_ID);
    const consec = item(CONSEC_ID);
    const rank3 = item(RANK3_ID);

    assert.ok(thanks);
    assert.ok(paton15x);
    assert.ok(wake);
    assert.ok(consec);
    assert.ok(rank3);
    for (const id of NEW_IDS) {
      assert.equal(news.filter((entry) => entry.id === id).length, 1);
    }
    assert.equal(news.length, 75);
    assert.equal(thanks.date, "2026-08-31");
    assert.equal(paton15x.date, "2026-08-31");
    assert.equal(wake.date, "2026-08-31");
    assert.equal(consec.date, "2026-08-30");
    assert.equal(rank3.date, "2026-08-30");
    assert.equal(thanks.sameDayOrder, 3);
    assert.equal(paton15x.sameDayOrder, 2);
    assert.equal(wake.sameDayOrder, 1);
    assert.equal(consec.sameDayOrder, 4);
    assert.equal(rank3.sameDayOrder, undefined);
    assert.deepEqual(verifyNews(NEW_IDS.map(item)), []);
    assert.deepEqual(verifyNews(news), []);
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
    assert.equal(ordered[12]?.id, THANKS_ID);
    assert.equal(ordered[13]?.id, PATON_15X_ID);
    assert.equal(ordered[14]?.id, WAKE_ID);
    assert.equal(ordered[15]?.id, CONSEC_ID);
    assert.equal(ordered[16]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(ordered[17]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(ordered[18]?.id, "2026-08-30-mixch-final-day");
    assert.equal(ordered[19]?.id, "2026-08-30-showroom-30-day-story");
    assert.equal(ordered[20]?.id, RANK3_ID);
  });

  it("adds the 8/31 morning thanks as text-only NEWS", () => {
    const entry = item(THANKS_ID);

    assert.equal(entry.source, THANKS_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, SHOWROOM);
    assert.equal(entry.ctaLabel, "SHOWROOMを見る");
    assert.equal(entry.url.includes("?t="), false);
    assert.equal(entry.source.includes("?t="), false);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.match(entry.body, /朝から起こしに来てくれたみんな/);
    assert.match(entry.body, /勇気ももらえて/);
    assert.match(entry.body, /朝から配信した甲斐があった/);
    assert.match(entry.body, /頑張る糧/);
    assert.match(entry.message.text, /朝から私を起こしに来てくれたみんな、ありがとう/);
    assert.equal(entry.body.includes("1位"), false);
    assert.equal(entry.body.includes("3位"), false);
  });

  it("combines the 8/31 Paton 1.5x posts and reuses the confirmed portrait CTA", () => {
    const entry = item(PATON_15X_ID);

    assert.equal(entry.source, PATON_15X_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.deepEqual(entry.additionalSources, [
      {
        label: "朝の無料拍手のX投稿を見る",
        url: PATON_15X_FOLLOWUP,
      },
    ]);
    assert.equal(entry.url, campusGirlsPatonVoteLink.url);
    assert.equal(entry.ctaLabel, campusGirlsPatonVoteLink.label);
    assert.equal(entry.url, PATON);
    assert.equal(entry.media, campusGirlsPatonPortraitImage);
    assert.equal(entry.additionalMedia, undefined);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.match(entry.body, /投稿時点で1位/);
    assert.match(entry.body, /0:00〜23:59/);
    assert.match(entry.body, /無料拍手/);
    assert.match(entry.body, /1\.5倍/);
    assert.match(entry.message.text, /緊急告知/);
    assert.match(entry.message.text, /現在1位/);
    assert.equal(entry.source.includes("?s="), false);
    assert.equal(entry.additionalSources[0].url.includes("?s="), false);
  });

  it("keeps SHOWROOM CTAs without expired t= tracking", () => {
    const wake = item(WAKE_ID);
    const consec = item(CONSEC_ID);

    assert.equal(wake.source, WAKE_SOURCE);
    assert.equal(consec.source, CONSEC_SOURCE);
    assert.equal(wake.url, SHOWROOM);
    assert.equal(consec.url, SHOWROOM);
    assert.equal(wake.ctaLabel, "SHOWROOMを見る");
    assert.equal(consec.ctaLabel, "SHOWROOMを見る");
    assert.equal(wake.url.includes("?t="), false);
    assert.equal(consec.url.includes("?t="), false);
    assert.equal(wake.source.includes("?t="), false);
    assert.equal(consec.source.includes("?t="), false);
    assert.match(wake.message.text, /\?t=1788126356/);
    assert.match(consec.message.text, /\?t=1788089115/);
    assert.match(wake.body, /配信中だった記録/);
    assert.match(consec.body, /30日連続配信記念日/);
    assert.deepEqual(wake.activityIds, ["live-stream"]);
    assert.deepEqual(consec.activityIds, ["live-stream"]);
    assert.equal(wake.media, undefined);
    assert.equal(consec.media, undefined);
  });

  it("keeps the 8/30 Paton rank card as a morning snapshot only", () => {
    const entry = item(RANK3_ID);
    const during = resolveNewsLinks(entry, START);
    const after = resolveNewsLinks(entry, END + 1);

    assert.equal(entry.source, RANK3_SOURCE);
    assert.equal(entry.url, campusGirlsPatonVoteLink.url);
    assert.equal(entry.ctaLabel, campusGirlsPatonVoteLink.label);
    assert.equal(entry.media, campusGirlsPatonPortraitImage);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.match(entry.body, /投稿時点で3位/);
    assert.match(entry.body, /2位に上がりたい/);
    assert.equal(entry.body.includes("1位"), false);
    assert.equal(during.cta?.url, PATON);
    assert.equal(after.cta, undefined);
  });
});

describe("2026-08-30〜31 X posts — activity and identity", () => {
  it("does not attach the wrong Activities or invent other people and sites", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);

    assert.equal(campusNews[0]?.id, "2026-09-02-paton-second-story");
    assert.equal(campusNews[1]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(campusNews[2]?.id, "2026-08-31-paton-vote-voice-story");
    assert.equal(campusNews[3]?.id, "2026-08-31-paton-first-place-story");
    assert.equal(campusNews[4]?.id, "2026-08-31-paton-15x-day-story");
    assert.equal(campusNews[5]?.id, "2026-08-31-paton-vote-how-to-story");
    assert.equal(campusNews[6]?.id, PATON_15X_ID);
    assert.equal(campusNews[7]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(campusNews[8]?.id, "2026-08-30-mixch-final-day");
    assert.equal(campusNews[9]?.id, RANK3_ID);
    assert.equal(liveNews[0]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(liveNews[1]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(liveNews[2]?.id, THANKS_ID);
    assert.equal(liveNews[3]?.id, WAKE_ID);
    assert.equal(liveNews[4]?.id, CONSEC_ID);
    assert.equal(liveNews[5]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(liveNews[6]?.id, "2026-08-30-showroom-30-day-story");

    for (const id of [PATON_15X_ID, RANK3_ID]) {
      assert.equal(liveNews.some((entry) => entry.id === id), false);
      assert.equal(missNews.some((entry) => entry.id === id), false);
      assert.equal(radioNews.some((entry) => entry.id === id), false);
    }
    for (const id of [THANKS_ID, WAKE_ID, CONSEC_ID]) {
      assert.equal(campusNews.some((entry) => entry.id === id), false);
      assert.equal(missNews.some((entry) => entry.id === id), false);
      assert.equal(radioNews.some((entry) => entry.id === id), false);
    }

    for (const id of NEW_IDS) {
      const entry = item(id);
      const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}\n${entry.media?.alt ?? ""}`;
      for (const phrase of FORBIDDEN_PEOPLE_SITES) {
        assert.equal(copy.includes(phrase), false, `${id}: ${phrase}`);
      }
      assert.equal(copy.toLowerCase().includes("millie"), false, id);
    }
  });

  it("keeps the viewer-identifying SHOWROOM screenshot unpublished", async () => {
    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    assert.equal(newsSource.includes("pbs.twimg.com"), false);
    assert.equal(newsSource.includes("video.twimg.com"), false);
    assert.equal(DRIVE_HOST_PATTERN.test(newsSource), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(newsSource), false);
    assert.equal(item(THANKS_ID).media, undefined);
    assert.equal(
      existsSync(path.join(root, "public/media/news/mily-b44-01-morning-stream-thanks.jpg")),
      false,
    );
    for (const width of [480, 960, 1600]) {
      for (const ext of ["jpg", "webp"]) {
        assert.equal(
          existsSync(
            path.join(
              root,
              `public/media/gallery/mily-b44-01-morning-stream-thanks-${width}.${ext}`,
            ),
          ),
          false,
        );
      }
    }

    for (const id of NEW_IDS) {
      assert.equal(galleryVideos.some((entry) => entry.id.includes(id)), false);
      assert.equal(stories.some((entry) => JSON.stringify(entry).includes(id)), false);
      assert.equal(highlights.some((entry) => entry.id.includes(id)), false);
      assert.equal(existsSync(path.join(root, "stories", id)), false);
    }

    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );
    assert.equal(contest.currentPhase?.name, "3次審査");
  });

  it("stays out of profile, media, stories, and schedule files", async () => {
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
      for (const id of NEW_IDS) {
        assert.equal(source.includes(id), false, `${relative} ${id}`);
      }
      assert.equal(source.includes("2094102196447334713"), false, relative);
      assert.equal(source.includes("2094191581951906187"), false, relative);
      assert.equal(source.includes("2094179970960744615"), false, relative);
      assert.equal(source.includes("2094023746751463582"), false, relative);
      assert.equal(source.includes("2093802981921849728"), false, relative);
      assert.equal(source.includes("2094192106105659650"), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
    }
  });
});

describe("2026-08-30〜31 X posts — Portal Feed and CONTENT-OPS", () => {
  it("flows through Portal Feed without hardcoded news ids", async () => {
    const feed = createPortalFeed({ newsItems: news,
      now: new Date("2026-08-31T08:00:00+09:00"),
      limit: PORTAL_FEED_LIMIT + 1,
    });
    assertPortalNewsFollowsSort(feed, news);

    const thanks = findFeedItem(feed, portalNewsId(THANKS_ID));
    const paton15x = findFeedItem(feed, portalNewsId(PATON_15X_ID));
    const wake = findFeedItem(feed, portalNewsId(WAKE_ID));
    const consec = findFeedItem(feed, portalNewsId(CONSEC_ID));
    const rank3 = findFeedItem(feed, portalNewsId(RANK3_ID));

    assert.equal(thanks.type, "news");
    assert.equal(paton15x.type, "news");
    assert.equal(wake.type, "news");
    assert.equal(consec.type, "news");
    assert.equal(rank3.type, "news");
    assert.equal(thanks.publishedAt, "2026-08-31T00:00:00+09:00");
    assert.equal(paton15x.publishedAt, "2026-08-31T00:00:00+09:00");
    assert.equal(wake.publishedAt, "2026-08-31T00:00:00+09:00");
    assert.equal(consec.publishedAt, "2026-08-30T00:00:00+09:00");
    assert.equal(rank3.publishedAt, "2026-08-30T00:00:00+09:00");
    assert.equal(thanks.sourceUrl, THANKS_SOURCE);
    assert.equal(paton15x.sourceUrl, PATON_15X_SOURCE);
    assert.equal(wake.sourceUrl, WAKE_SOURCE);
    assert.equal(thanks.image, undefined);
    assert.equal(wake.image, undefined);
    assert.equal(consec.image, undefined);

    const portalSource = await readFile(
      path.join(root, "src/data/portalFeed.ts"),
      "utf8",
    );
    for (const id of NEW_IDS) {
      assert.equal(portalSource.includes(id), false);
    }
  });

  it("documents the five NEWS items and the unpublished b44-01 screenshot", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const mediaGuide = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    assert.match(ops, /66件/);
    assert.match(ops, /写真32枚/);
    assert.match(ops, /2094102196447334713/);
    assert.match(ops, /2094191581951906187/);
    assert.match(ops, /2094179970960744615/);
    assert.match(ops, /2094023746751463582/);
    assert.match(ops, /2093802981921849728/);
    assert.match(ops, /2094192106105659650/);
    assert.match(ops, /無料拍手/);
    assert.match(ops, /投稿時点で1位/);
    assert.match(ops, /投稿時点で3位/);
    assert.match(ops, /30日連続配信記念/);
    assert.match(ops, /配信中だった記録/);
    assert.match(ops, /朝から起こしに来てくれたみんな、ありがとう/);
    assert.match(ops, /テキストNEWS＋出典リンクのみ/);
    assert.match(mediaGuide, /batch b44 \/ source date 2026-08-31/);
    assert.match(mediaGuide, /公開面では使わない/);
    assert.match(mediaGuide, /公開ファイルは置かない/);
    assert.equal(DRIVE_HOST_PATTERN.test(ops), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(ops), false);
    assert.equal(DRIVE_HOST_PATTERN.test(mediaGuide), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(mediaGuide), false);
  });

  it("does not reconstruct Drive host or file id in the dedicated test", async () => {
    const source = await readFile(new URL("./x-posts-20260830-31-news.test.mjs", import.meta.url), "utf8");
    assert.equal(DRIVE_HOST_PATTERN.test(source), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(source), false);
  });
});
