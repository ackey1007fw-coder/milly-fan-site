import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { events } from "../src/data/events.ts";
import {
  galleryVideos,
  mixchExPeriodDay1Movie,
  mixchFinalDayMovie,
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-07-mixch-ex-period-day1";
const MIXCH_URL = "https://mixch.tv/m/Tfb8i9dy";
const X_SOURCE = "https://x.com/Mily_chan36/status/2096935241034399948";
const TITLE =
  "「キャンガル2027Aブロック本選進出決定\u{203C}\u{FE0F}」——少し違う角度から授賞式登壇してみせる";
const BODY =
  "9月7日、みりぃがMixchに動画を公開しました。キャンガル2027 Aブロック本選進出を伝え、他のコンテストとキャンガルを両立していること、両立の条件としてミクチャでは配信は行えないこと、ムービーや各SNS、Instagramのライブ配信は投稿・発信していけることを話しています。少し違う角度から、配信している方々と引けを取らず授賞式登壇してみせると呼びかけています。CAMPUS GIRLS関連のハッシュタグが添えられています。";
const MESSAGE =
  "キャンガル2027 EX期間初日\u{203C}\u{FE0F}\n" +
  "ミクチャ投稿したよ〜\u{2728}皆様、応援よろしくお願いいたします\u{1F647}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}\u{1FA75}\n" +
  "\u{2B07}\u{FE0F}\u{2B07}\u{FE0F}\u{2B07}\u{FE0F}\n" +
  MIXCH_URL;

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-07 Mixch 本選EX初日 NEWS", () => {
  it("adds one JST-dated NEWS item with X source, Mixch CTA, and shared outbound media", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === X_SOURCE).length, 1);
    assert.equal(news[1], entry);
    assert.equal(ordered[0]?.id, "2026-09-08-stream-thanks-morning-slot-story");
    assert.equal(ordered[1], entry);
    assert.equal(ordered[2]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(ordered[3]?.id, "2026-09-07-morning-thanks-vote-day5-story");
    assert.equal(entry.date, "2026-09-07");
    assert.equal(entry.sameDayOrder, 20);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, X_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, MIXCH_URL);
    assert.equal(entry.ctaLabel, "Mixchで見る");
    assert.equal(entry.media, mixchExPeriodDay1Movie);
    assert.equal(entry.media.kind, "mixch");
    assert.equal(entry.media.mixchUrl, MIXCH_URL);
    assert.equal(entry.media.accountUrl, "https://mixch.tv/u/10114673");
    assert.equal(typeof entry.media.src, "undefined");
    assert.equal(entry.source.includes("?s="), false);
    assert.equal(entry.source.includes("?t="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("summarizes the Mixch caption without inventing a ranking, vote URL, or schedule slot", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /キャンガル2027Aブロック本選進出決定/);
    assert.match(entry.title, /少し違う角度から授賞式登壇してみせる/);
    assert.match(entry.body, /9月7日/);
    assert.match(entry.body, /Mixch/);
    assert.match(entry.body, /Aブロック本選進出/);
    assert.match(entry.body, /ミクチャでは配信は行えない/);
    assert.match(entry.body, /ムービーや各SNS、Instagramのライブ配信/);
    assert.match(entry.body, /授賞式登壇してみせる/);
    assert.match(entry.body, /CAMPUS GIRLS/);

    for (const phrase of [
      "優勝",
      "1位",
      "順位",
      "Paton",
      "SHOWROOM",
      "行った",
      "行ってきた",
      "急いで",
      "今すぐ投票",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
    assert.doesNotMatch(copy, /公式サイト|公認|本人運営/);
    assert.equal(copy.toLowerCase().includes("millie"), false);
  });

  it("keeps the X announcement verbatim with Mixch-page emoji", async () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 4);
    assert.match(entry.message.text, /^キャンガル2027 EX期間初日/u);
    assert.match(entry.message.text, /ミクチャ投稿したよ〜/u);
    assert.equal(entry.message.text.includes("\u{203C}\u{FE0F}"), true);
    assert.equal(entry.message.text.includes("\u{1F647}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}"), true);
    assert.equal(entry.message.text.includes("\u{1FA75}"), true);
    assert.equal(entry.message.text.includes(MIXCH_URL), true);

    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    assert.match(newsSource, /\\u\{203C\}\\u\{FE0F\}/);
    assert.match(newsSource, /\\u\{1F647\}\\u\{1F3FB\}\\u\{200D\}\\u\{2640\}\\u\{FE0F\}\\u\{1FA75\}/);
    assert.match(newsSource, /\\u\{2B07\}\\u\{FE0F\}\\u\{2B07\}\\u\{FE0F\}\\u\{2B07\}\\u\{FE0F\}/);
  });

  it("appears on CAMPUS GIRLS and is derived into the Portal Feed without a local image", () => {
    const selected = selectActivityNews("campus-girls", news, news.length);
    const feed = createPortalFeed({ newsItems: news });
    const feedItem = findFeedItem(feed, portalNewsId(NEWS_ID));

    assert.equal(selected[0]?.id, NEWS_ID);
    assert.equal(selected[1]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(selected[2]?.id, "2026-09-06-campus-girls-prelim-final-result");
    assertPortalNewsFollowsSort(feed, news);
    assert.ok(feedItem);
    assert.equal(feedItem.publishedAt, "2026-09-07T00:00:00+09:00");
    assert.equal(feedItem.sourceUrl, X_SOURCE);
    assert.equal(feedItem.image, undefined);

    for (const activityId of ["miss-circle", "live-stream", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("shares one object between NEWS and Gallery and stays off Activity media", () => {
    const gallery = selectGalleryEntries().filter((entry) => entry.kind === "mixch");

    assert.equal(item().media, mixchExPeriodDay1Movie);
    assert.equal(gallery[0]?.item, mixchExPeriodDay1Movie);
    assert.equal(gallery[1]?.item, mixchFinalDayMovie);
    assert.equal(gallery[2]?.item, mixchExpressiveMovie);
    assert.equal(gallery[3]?.item, mixch15xDayMovie);
    assert.equal(gallery[4]?.item, mixchConfidenceMessageMovie);
    assert.equal(galleryVideos.filter((entry) => entry.kind === "mixch").length, 5);

    const activityMedia = selectActivityMedia("campus-girls");
    assert.equal(activityMedia.includes(mixchExPeriodDay1Movie), false);
    assert.equal(
      activityMedia.some((media) => media.kind === "mixch"),
      false,
    );
    assert.equal(newsDisplayMedia(item()).includes(mixchExPeriodDay1Movie), true);
    assert.equal(visibleGalleryVideos().includes(mixchExPeriodDay1Movie), true);
  });

  it("does not add Mixch movies to events or streamSchedule or copy files", async () => {
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );
    assert.equal(JSON.stringify(events).includes("Tfb8i9dy"), false);
    assert.equal(JSON.stringify(streamSchedule).includes("Tfb8i9dy"), false);

    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true })).map(
      (file) => String(file).replaceAll("\\", "/"),
    );
    const originalFiles = (
      await readdir(path.join(root, "media/original"), { recursive: true }).catch(() => [])
    ).map((file) => String(file).replaceAll("\\", "/"));

    for (const file of [...publicFiles, ...originalFiles]) {
      assert.equal(file.includes("_movie_mps"), false, file);
      assert.equal(file.includes("Tfb8i9dy"), false, file);
      assert.equal(file.includes("mixch-ex-period"), false, file);
    }

    assert.equal(mixchExPeriodDay1Movie.poster.startsWith("/media/"), false);
    assert.match(mixchExPeriodDay1Movie.poster, /thumb_normal/);
    assert.equal(mixchExPeriodDay1Movie.width, 480);
    assert.equal(mixchExPeriodDay1Movie.height, 853);
    assert.equal(mixchExPeriodDay1Movie.poster.includes("_movie_mps"), false);
  });
});
