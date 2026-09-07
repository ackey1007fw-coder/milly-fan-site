import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { galleryVideos } from "./fixtures/gallery-videos-before-b41.ts";
import { highlights } from "../src/data/highlights.ts";
import {
  featuredPhoto,
  media,
  visibleMedia,
} from "../src/data/media.ts";
import {
  GIRLSAWARD_SHOWROOM_6TH_X_URL,
  girlsawardShowroomSixthImage,
  girlsawardShowroomSixthPhoto,
} from "../src/data/girlsawardShowroom6th.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import { createPortalFeed } from "./fixtures/portal-feed-before-b41.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";
import { selectActivityNews } from "./fixtures/activity-content-before-b41.ts";
import { selectActivityMedia } from "./fixtures/activity-media-before-b41.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";
import { findDriveIds } from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-26-girlsaward-showroom-6th";
const SOURCE = GIRLSAWARD_SHOWROOM_6TH_X_URL;
const EVENT_PAGE =
  "https://www.showroom-live.com/event/girlsaward2026aw_fm";
const SHOWROOM_ROOM =
  "https://www.showroom-live.com/r/circle2026_0734";
const PHOTO = "/media/news/mily-b28-01-girlsaward-showroom-6th.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
const GALLERY_BASE = "/media/gallery/mily-b28-01-girlsaward-showroom-6th";
const NEWS_SHA256 =
  "f5bb01a9dc8c9384fd8d9e7c40fb769b5bf6f8bc48e74b1a7612ae2a07f9cd26";
const GALLERY_480_SHA256 =
  "40ca278f866bda2964df8c48a5188d5ebb02ec537cab931091bb6b0aba4403d7";
const GALLERY_960_SHA256 =
  "acda33e4f404e6c0b903c547dfe9d94092fe3c329c923f4ff0e535324b45e4bb";
const PATON_CTA = "Patonでみりぃに投票する";
const PATON_URL = "https://paton.jp/event/entrant/11380";
const GIRLSAWARD_OFFICIAL = "https://girls-award.com";

// Live fxtwitter (created_at Wed Aug 26 14:34:43 +0000 2026).
// First-line face is U+1F979 🥹 FACE HOLDING BACK TEARS — not U+1F972 🥲
// (SMILING FACE WITH TEAR, a lookalike) and not U+1F62D 😭.
const MESSAGE = [
  "はぁぁぁぁぁ、皆さんのおかげでとーーーっても楽しかった\u{1F979}\u{2764}\u{FE0F}\u{200D}\u{1F525}",
  "ガルアワイベ、初めは挑戦するのも怖かったけど、勇気出して一歩踏み出せて、みんなに出逢えて、応援していただけてよかった。幸せじゃっ\u{2B50}\u{FE0F}",
  "これからもどうぞよろしくお願いします\u{1F345}\u{2728}",
  "#ミスサー #ミスサークル #ミスサークルコンテスト",
].join("\n");

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

function publicFile(relative) {
  return path.join(root, "public", relative.replace(/^\//, ""));
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-08-26 GirlsAward SHOWROOM 6th-place X post — Latest entry", () => {
  it("adds exactly one source-backed News item with the confirmed JST date", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(entry.date, "2026-08-26");
    assert.equal(entry.sameDayOrder, 4);
    assert.deepEqual(entry.activityIds, ["miss-circle", "live-stream"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, SHOWROOM_ROOM);
    assert.equal(entry.ctaLabel, "SHOWROOMを見る");
    assert.notEqual(entry.ctaLabel, PATON_CTA);
    assert.notEqual(entry.url, PATON_URL);
    assert.notEqual(entry.source, GIRLSAWARD_OFFICIAL);
    assert.notEqual(entry.url, GIRLSAWARD_OFFICIAL);
    assert.deepEqual(entry.additionalSources, [
      {
        label: "SHOWROOMイベントページを見る",
        url: EVENT_PAGE,
      },
    ]);
    assert.equal(entry.media, girlsawardShowroomSixthImage);
    assert.equal(entry.additionalMedia, undefined);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including pinned emoji code points", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.message.text, /^はぁぁぁぁぁ、皆さんのおかげで/u);
    assert.equal([...entry.message.text.matchAll(/ぁ/gu)].length, 5);
    assert.match(entry.message.text, /\u{1F979}/u);
    assert.doesNotMatch(entry.message.text, /\u{1F972}/u);
    assert.doesNotMatch(entry.message.text, /\u{1F62D}/u);
    assert.match(entry.message.text, /\u{2764}\u{FE0F}\u{200D}\u{1F525}/u);
    assert.match(entry.message.text, /\u{1F345}/u);
    assert.match(entry.message.text, /\u{2B50}\u{FE0F}/u);
    assert.doesNotMatch(entry.message.text, /t\.co/);
    assert.doesNotMatch(entry.message.text, /pic\.twitter/);
    assert.doesNotMatch(entry.message.text, /https:\/\//);
  });

  it("keeps the archive summary concise without claiming a runway slot", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    assert.match(entry.title, /6位/);
    assert.doesNotMatch(entry.title, /ランウェイ決定/);
    assert.match(entry.body, /8月20日から26日まで/);
    assert.match(entry.body, /Rakuten GirlsAward 2026 A\/W/);
    assert.match(entry.body, /SHOWROOMイベント/);
    assert.match(entry.body, /6位でフィニッシュ/);
    assert.match(entry.body, /とーーーっても楽しかった/);
    assert.match(entry.body, /一歩踏み出せた/);
    assert.match(entry.body, /幸せじゃっ/);
    assert.match(entry.body, /これからもどうぞよろしくお願いします/);
    assert.doesNotMatch(
      entry.body,
      /【フレ\/ミス枠】|ミスサー／フレキャン出場者限定|ガルアワイベ最終日 応援に駆けつけて|幕張メッセ、2026年9月26日|6位だったためランウェイ出演にはなっていません/,
    );

    for (const phrase of [
      "ランウェイ決定",
      "ランウェイ出演が決まった",
      "ランウェイに出演します",
      "オープニングアクトに出演",
      "GirlsAwardに歩く",
      "本戦のランウェイ",
      PATON_CTA,
      "Patonでみりぃに投票する",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
    assert.equal(copy.includes(GIRLSAWARD_OFFICIAL), false);
    assert.equal(copy.includes("campus-girls"), false);
  });

  it("does not attach a Paton CTA or campus-girls Activity", () => {
    const entry = item();
    const serialized = JSON.stringify(entry);

    assert.equal(entry.activityIds?.includes("campus-girls"), false);
    assert.equal(entry.ctaLabel?.includes("Paton"), false);
    assert.doesNotMatch(serialized, /paton\.jp/);
    assert.doesNotMatch(serialized, /girls-award\.com/);
  });
});

describe("2026-08-26 GirlsAward SHOWROOM 6th-place X post — self-hosted photo", () => {
  it("uses one local /media/news/ JPEG and never hotlinks SNS media", async () => {
    const photo = item().media;

    assert.equal(photo, girlsawardShowroomSixthImage);
    assert.equal(photo?.kind, "image");
    assert.equal(photo?.src, PHOTO);
    assert.match(photo.src, /^\/media\/news\//);
    assert.equal(
      girlsawardShowroomSixthImage.srcSet,
      `${GALLERY_BASE}-480.jpg 480w, ${GALLERY_BASE}-960.jpg 960w, ${GALLERY_BASE}-1600.jpg 1600w`,
    );
    assert.equal(
      girlsawardShowroomSixthImage.webpSrcSet,
      `${GALLERY_BASE}-480.webp 480w, ${GALLERY_BASE}-960.webp 960w, ${GALLERY_BASE}-1600.webp 1600w`,
    );
    assert.equal(girlsawardShowroomSixthImage.sizes, "(min-width: 640px) 24rem, 100vw");
    assert.equal(photo.width, 1156);
    assert.equal(photo.height, 2048);
    assert.equal(photo.provenance, "sns-post");
    assert.equal(photo.sourceUrl, SOURCE);
    assert.match(photo.alt, /紺（ネイビー）のポロ/);
    assert.match(photo.alt, /黄白ストライプのリボン／シュシュ/);
    assert.doesNotMatch(photo.alt, /紫/);
    assert.equal(girlsawardShowroomSixthPhoto.alt, photo.alt);
    assert.equal(existsSync(PHOTO_FILE), true);
    assert.equal((await stat(PHOTO_FILE)).size, 397_362);
    assert.equal(await sha256(PHOTO_FILE), NEWS_SHA256);

    for (const host of [
      "pbs.twimg.com",
      "twimg",
      "twitter.com",
      "cdninstagram",
      "instagram.com",
      "http://",
    ]) {
      assert.equal(photo.src.includes(host), false, host);
    }

    const metadata = await sharp(PHOTO_FILE).metadata();
    assert.equal(metadata.format, "jpeg");
    assert.equal(metadata.width, 1156);
    assert.equal(metadata.height, 2048);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  });

  it("publishes the same photo in media.ts without duplicating NEWS bytes", async () => {
    const visible = visibleMedia(media);
    const gallery = media.find((entry) => entry.id === "mily-b28-01");

    assert.equal(gallery, girlsawardShowroomSixthPhoto);
    assert.equal(visible[10], girlsawardShowroomSixthPhoto);
    assert.equal(gallery.kind, "photo");
    assert.equal(gallery.published, true);
    assert.equal(gallery.provenance, "sns-post");
    assert.equal(gallery.sourceUrl, SOURCE);
    assert.equal(gallery.sourceDate, "2026-08-26");
    assert.equal(gallery.credit, null);
    assert.deepEqual(gallery.widths, [480, 960, 1600]);
    assert.equal(gallery.width, 1156);
    assert.equal(gallery.height, 2048);
    assert.equal(gallery.aspect, "1156 / 2048");
    assert.notEqual(gallery.featured, true);
    assert.equal(featuredPhoto(media)?.id, "mily-b01-03");
    assert.equal(media.filter((entry) => entry.kind === "photo").length, 33);
    assert.deepEqual(verifyMedia(media), []);

    const jpg480 = publicFile(`${GALLERY_BASE}-480.jpg`);
    const jpg960 = publicFile(`${GALLERY_BASE}-960.jpg`);
    const jpg1600 = publicFile(`${GALLERY_BASE}-1600.jpg`);
    assert.equal(await sha256(jpg480), GALLERY_480_SHA256);
    assert.equal(await sha256(jpg960), GALLERY_960_SHA256);
    assert.notEqual(await sha256(jpg1600), NEWS_SHA256);
    assert.notEqual(await sha256(PHOTO_FILE), await sha256(jpg1600));

    const small = await sharp(jpg480).metadata();
    const mid = await sharp(jpg960).metadata();
    const large = await sharp(jpg1600).metadata();
    assert.equal(small.width, 480);
    assert.equal(small.height, 850);
    assert.equal(mid.width, 960);
    assert.equal(mid.height, 1701);
    assert.equal(large.width, 1156);
    assert.equal(large.height, 2048);
  });
});

describe("2026-08-26 GirlsAward SHOWROOM 6th-place X post — scope and ordering", () => {
  it("stays out of Gallery videos, Stories, highlights, and schedule rows", async () => {
    assert.equal(galleryVideos.some((entry) => String(entry.src).includes("b28")), false);
    assert.equal(stories.some((entry) => entry.slug.includes("girlsaward")), false);
    assert.equal(highlights.some((entry) => entry.id.includes("girlsaward")), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);

    const { events } = await import("../src/data/events.ts");
    const { streamSchedule } = await import("../src/data/streamSchedule.ts");
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes("girlsaward")),
      false,
    );

    for (const relative of [
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("mily-b28"), false, relative);
      assert.equal(source.includes(NEWS_ID), false, relative);
    }
  });

  it("leads Latest ahead of the 8/26 Story cards and keeps stream-1000", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night")).map((entry) => entry.id);

    assert.equal(ordered[0], NEWS_ID);
    assert.equal(ordered[1], "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2], "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3], "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4], "2026-08-26-girl-award-event-fanroom");
    assert.equal(ordered[5], "2026-08-26-mixch-15x-day");
    assert.equal(ordered[6], "2026-08-26-stream-1000");
    assert.equal(news.length, 49);
    assert.equal(news.filter((entry) => entry.date === "2026-08-26").length, 7);
    assert.ok(news.some((entry) => entry.id === "2026-08-26-stream-1000"));
  });

  it("appears on MISS CIRCLE and LIVE STREAM, not CAMPUS GIRLS", () => {
    const missNews = selectActivityNews("miss-circle", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const liveMedia = selectActivityMedia("live-stream");

    assert.equal(missNews[0]?.id, NEWS_ID);
    assert.equal(liveNews[0]?.id, "2026-08-28-stream-thanks");
    assert.equal(liveNews[1]?.id, NEWS_ID);
    assert.equal(liveNews[2]?.id, "2026-08-26-morning-stream-thanks");
    assert.equal(liveNews[3]?.id, "2026-08-26-girl-award-event-fanroom");
    assert.equal(liveNews[4]?.id, "2026-08-26-stream-1000");
    assert.equal(campusNews.some((entry) => entry.id === NEWS_ID), false);
    assert.equal(campusNews[0]?.id, "2026-08-28-paton-vote-day-3");
    assert.equal(campusNews[1]?.id, "2026-08-27-paton-vote-how-to");
    assert.equal(campusNews[2]?.id, "2026-08-27-mixch-expressive");
    assert.equal(campusNews[3]?.id, "2026-08-26-paton-vote-stories");
    assert.equal(liveMedia[0], girlsawardShowroomSixthImage);
  });

  it("records hashes and the X URL in MEDIA.md without Drive ids or /stories/", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const b28 = docs.split("## 素材台帳（batch b28")[1] ?? "";

    assert.match(docs, /batch b28/);
    assert.equal(docs.includes(NEWS_SHA256), true);
    assert.equal(docs.includes(GALLERY_480_SHA256), true);
    assert.equal(docs.includes(GALLERY_960_SHA256), true);
    assert.equal(docs.includes(SOURCE), true);
    assert.match(b28, /6位/);
    assert.match(b28, /ランウェイ出演にはなっていない/);
    assert.match(b28, /紺（ネイビー）のポロ/);
    assert.match(b28, /黄白ストライプのリボン／シュシュ/);
    assert.equal(b28.includes("紫ポロ"), false);
    assert.match(b28, /`\/stories\/` 記事と highlights には追加しない/);
    assert.equal(findDriveIds(b28).length, 0);
    assert.match(ops, /48件/);
    assert.match(ops, /写真32枚/);

    const { stdout: trackedOriginal } = await run(
      "git",
      ["ls-files", "--", "media/original/mily-b28-01-girlsaward-showroom-6th.jpg"],
      { cwd: root },
    );
    assert.equal(trackedOriginal.trim(), "");
  });
});

describe("2026-08-26 GirlsAward SHOWROOM 6th-place X post — Portal Feed", () => {
  it("flows through Portal Feed with its self-hosted site-origin image", async () => {
    const feed = createPortalFeed({ now: new Date("2026-08-26T23:40:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-26T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, new URL(PHOTO, siteOrigin()).href);
    assert.equal(new URL(entry.image).origin, siteOrigin());
    assert.equal(entry.image.includes("twimg"), false);

    const portalSource = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("mily-b28"), false);
  });
});
