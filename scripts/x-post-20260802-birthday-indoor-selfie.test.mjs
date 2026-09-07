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
  BIRTHDAY_INDOOR_SELFIE_X_URL,
  birthdayIndoorSelfieImage,
  birthdayIndoorSelfiePhoto,
} from "../src/data/birthdayIndoorSelfie.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import { createPortalFeed } from "./fixtures/portal-feed-before-b41.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";
import { findDriveIds } from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-02-21st-birthday";
const INSTAGRAM = "https://www.instagram.com/p/DbiY3PHk1c8/";
const SOURCE = BIRTHDAY_INDOOR_SELFIE_X_URL;
const PHOTO = "/media/news/mily-b29-01-birthday-indoor-selfie.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
const GALLERY_BASE = "/media/gallery/mily-b29-01-birthday-indoor-selfie";
const NEWS_SHA256 =
  "5b887b86187288035de8843eb83770b853d8b0e3578162389e071f8382563632";
const GALLERY_480_SHA256 =
  "d61ba3f34962289389a9b049500963f73c4c28a64644fe86f3d478489aafaf5a";
const GALLERY_960_SHA256 =
  "e5fc835a7600303bef4eeb66fbb35e92c2d92bd47bcc91040db177b74f342a49";
const DUPLICATE_SHA256_B06 =
  "1a0fec17a8da7872c206cd01b5184be29d6a66b50fcd8437fd160447daf7b06b";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

function publicFile(relative) {
  return path.join(root, "public", relative.replace(/^\//, ""));
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-08-02 21st birthday — attach unused X indoor selfie", () => {
  it("keeps the existing Instagram-sourced NEWS and does not add a second birthday item", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(
      news.filter((candidate) => candidate.date === "2026-08-02").length,
      1,
    );
    assert.equal(entry.date, "2026-08-02");
    assert.match(entry.title, /21歳/);
    assert.match(entry.body, /21歳の誕生日/);
    assert.match(entry.body, /考えていることを脳内に留めず行動に移す。/);
    assert.equal(entry.source, INSTAGRAM);
    assert.equal(entry.ctaLabel, "Instagramの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.deepEqual(entry.additionalSources, [
      { label: "Xの投稿を見る", url: SOURCE },
    ]);
    assert.equal(entry.media, birthdayIndoorSelfieImage);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.activityIds, undefined);
    assert.equal(news.length, 49);
    assert.deepEqual(verifyNews(news), []);
    assert.ok(sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night")).some((candidate) => candidate.id === NEWS_ID));
  });

  it("uses one local /media/news/ JPEG with Gallery srcset and never hotlinks SNS media", async () => {
    const photo = item().media;

    assert.equal(photo, birthdayIndoorSelfieImage);
    assert.equal(photo?.kind, "image");
    assert.equal(photo?.src, PHOTO);
    assert.match(photo.src, /^\/media\/news\//);
    assert.equal(
      birthdayIndoorSelfieImage.srcSet,
      `${GALLERY_BASE}-480.jpg 480w, ${GALLERY_BASE}-960.jpg 960w, ${GALLERY_BASE}-1600.jpg 1600w`,
    );
    assert.equal(
      birthdayIndoorSelfieImage.webpSrcSet,
      `${GALLERY_BASE}-480.webp 480w, ${GALLERY_BASE}-960.webp 960w, ${GALLERY_BASE}-1600.webp 1600w`,
    );
    assert.equal(birthdayIndoorSelfieImage.sizes, "(min-width: 640px) 24rem, 100vw");
    assert.equal(photo.width, 1536);
    assert.equal(photo.height, 2048);
    assert.equal(photo.provenance, "sns-post");
    assert.equal(photo.sourceUrl, SOURCE);
    assert.equal(photo.sourceDate, "2026-08-02");
    assert.match(photo.alt, /ピンストライプ/);
    assert.match(photo.alt, /クローゼット/);
    assert.doesNotMatch(photo.alt, /花束|ケーキ|落ち葉|ウインク|鏡/);
    assert.equal(birthdayIndoorSelfiePhoto.alt, photo.alt);
    assert.equal(existsSync(PHOTO_FILE), true);
    assert.equal((await stat(PHOTO_FILE)).size, 321_357);
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
      assert.equal(photo.srcSet?.includes(host), false, host);
      assert.equal(photo.webpSrcSet?.includes(host), false, host);
    }

    const metadata = await sharp(PHOTO_FILE).metadata();
    assert.equal(metadata.format, "jpeg");
    assert.equal(metadata.width, 1536);
    assert.equal(metadata.height, 2048);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  });

  it("publishes the same photo in media.ts without duplicating NEWS bytes", async () => {
    const visible = visibleMedia(media);
    const gallery = media.find((entry) => entry.id === "mily-b29-01");

    assert.equal(gallery, birthdayIndoorSelfiePhoto);
    assert.equal(visible[9], birthdayIndoorSelfiePhoto);
    assert.equal(gallery.kind, "photo");
    assert.equal(gallery.published, true);
    assert.equal(gallery.provenance, "sns-post");
    assert.equal(gallery.sourceUrl, SOURCE);
    assert.equal(gallery.sourceDate, "2026-08-02");
    assert.equal(gallery.credit, null);
    assert.deepEqual(gallery.widths, [480, 960, 1600]);
    assert.equal(gallery.width, 1536);
    assert.equal(gallery.height, 2048);
    assert.equal(gallery.aspect, "1536 / 2048");
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
    assert.equal(small.height, 640);
    assert.equal(mid.width, 960);
    assert.equal(mid.height, 1280);
    assert.equal(large.width, 1536);
    assert.equal(large.height, 2048);
    assert.equal(small.exif, undefined);
    assert.equal(mid.exif, undefined);
    assert.equal(large.exif, undefined);
  });

  it("is not a duplicate of b01 bouquet/cake, b05 leaf, b06 wink, or b08 mirror", async () => {
    const newsHash = await sha256(PHOTO_FILE);
    const comparisons = [
      ["b01-01 cake 1600", "public/media/gallery/mily-b01-01-birthday-cake-1600.jpg"],
      ["b01-02 bouquet 1600", "public/media/gallery/mily-b01-02-bouquet-standing-1600.jpg"],
      ["b01-03 smile 1600", "public/media/gallery/mily-b01-03-bouquet-smile-1600.jpg"],
      ["b01-04 pose 1600", "public/media/gallery/mily-b01-04-bouquet-pose-1600.jpg"],
      ["b01-05 closeup 1600", "public/media/gallery/mily-b01-05-bouquet-closeup-1600.jpg"],
      ["b01-06 necklace 1600", "public/media/gallery/mily-b01-06-necklace-gift-1600.jpg"],
      ["b05 leaf 1600", "public/media/gallery/mily-b05-01-autumn-leaf-1600.jpg"],
      ["b06 wink NEWS", "public/media/news/mily-b06-01-recovery-morning.jpg"],
      ["b08 mirror 1600", "public/media/gallery/mily-b08-01-do-what-you-can-morning-1600.jpg"],
    ];

    assert.equal(newsHash, NEWS_SHA256);
    for (const [label, relative] of comparisons) {
      const other = await sha256(path.join(root, relative));
      assert.notEqual(other, newsHash, label);
    }
    assert.notEqual(newsHash, DUPLICATE_SHA256_B06);
  });

  it("stays out of Gallery videos, Stories, highlights, and schedule rows", async () => {
    assert.equal(galleryVideos.some((entry) => String(entry.src).includes("b29")), false);
    assert.equal(stories.some((entry) => entry.slug.includes("birthday")), false);
    assert.equal(highlights.some((entry) => entry.id.includes("birthday")), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);

    const { events } = await import("../src/data/events.ts");
    const { streamSchedule } = await import("../src/data/streamSchedule.ts");
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes("b29")),
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
      assert.equal(source.includes("mily-b29"), false, relative);
      assert.equal(source.includes("birthday-indoor-selfie"), false, relative);
    }
  });

  it("records hashes and the X URL in MEDIA.md without Drive ids or Millie spelling", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const b29 = docs.split("## 素材台帳（batch b29")[1] ?? "";

    assert.match(docs, /batch b29/);
    assert.equal(docs.includes(NEWS_SHA256), true);
    assert.equal(docs.includes(GALLERY_480_SHA256), true);
    assert.equal(docs.includes(GALLERY_960_SHA256), true);
    assert.equal(docs.includes(SOURCE), true);
    assert.match(b29, /ピンストライプ/);
    assert.match(b29, /Instagram/);
    assert.match(b29, /新しい誕生日NEWSは作らない/);
    assert.match(b29, /`\/stories\/` 記事と highlights には追加しない/);
    assert.equal(findDriveIds(b29).length, 0);
    assert.doesNotMatch(b29, /Millie|millie/);
    assert.doesNotMatch(ops, /Millie|millie/);
    assert.match(ops, /48件/);
    assert.match(ops, /写真32枚/);
    assert.match(ops, /b29-01/);

    const { stdout: trackedOriginal } = await run(
      "git",
      ["ls-files", "--", "media/original/mily-b29-01-birthday-indoor-selfie.jpg"],
      { cwd: root },
    );
    assert.equal(trackedOriginal.trim(), "");
  });

  it("flows through Portal Feed with its self-hosted site-origin image", () => {
    const feed = createPortalFeed({
      now: new Date("2026-08-02T12:00:00+09:00"),
      newsItems: [item()],
      storyItems: [],
      eventItems: [],
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, [item()]);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-02T00:00:00+09:00");
    assert.equal(entry.sourceUrl, INSTAGRAM);
    assert.equal(entry.image, new URL(PHOTO, siteOrigin()).href);
    assert.equal(new URL(entry.image).origin, siteOrigin());
    assert.equal(entry.image.includes("twimg"), false);
  });
});
