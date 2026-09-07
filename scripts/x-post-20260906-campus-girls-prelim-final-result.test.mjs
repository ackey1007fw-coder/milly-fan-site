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
import { activities } from "../src/data/activities.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media, visibleMedia } from "../src/data/media.ts";
import {
  CAMPUS_GIRLS_PRELIM_FINAL_RESULT_X_URL,
  campusGirlsPrelimFinalResultImage,
  campusGirlsPrelimFinalResultPhoto,
} from "../src/data/campusGirlsPrelimFinalResultImage.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { contest } from "../src/data/contest.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { campusGirlsFinalsExGuideImage } from "../src/data/campusGirlsFinalsExImages.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-09-06-campus-girls-prelim-final-result";
const NEXT_SLOTS_ID = "2026-09-06-stream-thanks-next-slots";
const NIGHT_SLOT_ID = "2026-09-06-night-slot-2230";
const HIGHLIGHT_ID = "campus-girls-2027-prelim-final-result";
const SOURCE = CAMPUS_GIRLS_PRELIM_FINAL_RESULT_X_URL;
const TWEET_ID = "2096422147476627841";
const PHOTO = "/media/news/mily-b63-01-campus-girls-prelim-final-result.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
const GALLERY_BASE = "/media/gallery/mily-b63-01-campus-girls-prelim-final-result";
const NEWS_SHA256 =
  "59679e7a880fbdf8659d10fcb5f88fe7928c232e1dfb418490ba8104e9ccb10f";
const GALLERY_480_SHA256 =
  "ba88c3806920965806a9c4297cb4589a9209281ba8c00f2883da038a2b0555ae";
const GALLERY_960_SHA256 =
  "84368c3dd9488bb4a4828efe3864056d84f5f9b1e98c429f97788a8398aedff8";
const TITLE = "CAMPUS GIRLS 2027 予選final、本戦進出決定✨";
const BODY =
  "9月6日、みりぃがCAMPUS GIRLS 2027 予選ファイナルの結果を報告しました。総合は審査員賞、面接審査は1位、Paton投票審査は2位で、本戦進出が決まりました。";
const MESSAGE =
  "【キャンガル2027 予選final 結果報告✨】\n" +
  "総合：審査員賞\n" +
  "面接審査：1位 🥇\n" +
  "Paton投票審査：2位 🥈\n" +
  "\n" +
  "よって、本戦進出決定‼️\n" +
  "\n" +
  "皆様の応援のおかげです🥺🫶🏻💙\n" +
  "本当にありがとーーう！\n" +
  "これからもみんなの前で喜怒哀楽を楽しみながら頑張らせてね♪";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

function publicFile(relative) {
  return path.join(root, "public", relative.replace(/^\//, ""));
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-09-06 CAMPUS GIRLS 予選final 結果報告 — Latest entry", () => {
  it("adds exactly one source-backed NEWS card ahead of the same-day night-slot change", () => {
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
    assert.equal(ordered[2], entry);
    assert.equal(ordered[3]?.id, NIGHT_SLOT_ID);
    assert.equal(entry.date, "2026-09-06");
    assert.equal(entry.sameDayOrder, 30);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "みりぃのX");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.media, campusGirlsPrelimFinalResultImage);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the overlay text verbatim and a short fan NEWS body", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.message.text, /^【キャンガル2027 予選final 結果報告✨】\n/);
    assert.match(entry.message.text, /本戦進出決定‼️/);
    assert.match(entry.body, /審査員賞/);
    assert.match(entry.body, /面接審査は1位/);
    assert.match(entry.body, /Paton投票審査は2位/);
    assert.match(entry.body, /本戦進出/);
  });

  it("does not add vote buttons, invented dates, or official-site wording", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    assert.doesNotMatch(copy, /公式サイト|公認|本人運営/);
    assert.doesNotMatch(copy, /JST|\blive\b|作業メモ/i);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り/);
    assert.doesNotMatch(copy, /CanCam|AGESTOCK|横浜アリーナ/);
    assert.doesNotMatch(copy, /本戦は|本戦の日程|本戦日程/);
    assert.equal(copy.toLowerCase().includes("millie"), false);

    const now = Date.parse("2026-09-06T12:00:00+09:00");
    const resolved = resolveNewsLinks(entry, now);
    assert.equal(resolved.cta, undefined);
    assert.equal(resolved.additionalCtas, undefined);
    assert.equal(resolved.relatedUrl, undefined);
  });
});

describe("2026-09-06 CAMPUS GIRLS 予選final 結果報告 — media", () => {
  it("uses one local /media/news/ JPEG with Gallery srcset and never hotlinks SNS media", async () => {
    const photo = item().media;

    assert.equal(photo, campusGirlsPrelimFinalResultImage);
    assert.equal(photo?.kind, "image");
    assert.equal(photo?.src, PHOTO);
    assert.match(photo.src, /^\/media\/news\//);
    assert.equal(
      campusGirlsPrelimFinalResultImage.srcSet,
      `${GALLERY_BASE}-480.jpg 480w, ${GALLERY_BASE}-960.jpg 960w, ${GALLERY_BASE}-1600.jpg 1600w`,
    );
    assert.equal(
      campusGirlsPrelimFinalResultImage.webpSrcSet,
      `${GALLERY_BASE}-480.webp 480w, ${GALLERY_BASE}-960.webp 960w, ${GALLERY_BASE}-1600.webp 1600w`,
    );
    assert.equal(
      campusGirlsPrelimFinalResultImage.sizes,
      "(min-width: 640px) 24rem, 100vw",
    );
    assert.equal(photo.width, 1500);
    assert.equal(photo.height, 2667);
    assert.equal(photo.provenance, "sns-post");
    assert.equal(photo.sourceUrl, SOURCE);
    assert.equal(photo.sourceDate, "2026-09-06");
    assert.match(photo.alt, /みりぃ/);
    assert.match(photo.alt, /キャンガル2027予選finalの結果報告/);
    assert.equal(campusGirlsPrelimFinalResultPhoto.alt, photo.alt);
    assert.equal(existsSync(PHOTO_FILE), true);
    assert.equal((await stat(PHOTO_FILE)).size, 353_094);
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
    assert.equal(metadata.width, 1500);
    assert.equal(metadata.height, 2667);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  });

  it("publishes the same photo in media.ts without duplicating NEWS bytes", async () => {
    const visible = visibleMedia(media);
    const gallery = media.find((entry) => entry.id === "mily-b63-01");

    assert.equal(gallery, campusGirlsPrelimFinalResultPhoto);
    assert.equal(visible[0], campusGirlsPrelimFinalResultPhoto);
    assert.equal(gallery.published, true);
    assert.equal(gallery.kind, "photo");
    assert.equal(gallery.provenance, "sns-post");
    assert.equal(gallery.sourceUrl, SOURCE);
    assert.equal(gallery.sourceDate, "2026-09-06");
    assert.equal(gallery.aspect, "1500 / 2667");
    assert.deepEqual(verifyMedia(media), []);

    const newsBytes = await readFile(PHOTO_FILE);
    const gallery1600 = await readFile(publicFile(`${GALLERY_BASE}-1600.jpg`));
    assert.notEqual(
      createHash("sha256").update(newsBytes).digest("hex"),
      createHash("sha256").update(gallery1600).digest("hex"),
    );

    assert.equal(await sha256(publicFile(`${GALLERY_BASE}-480.jpg`)), GALLERY_480_SHA256);
    assert.equal(await sha256(publicFile(`${GALLERY_BASE}-960.jpg`)), GALLERY_960_SHA256);

    for (const suffix of ["480.jpg", "480.webp", "960.jpg", "960.webp", "1600.jpg", "1600.webp"]) {
      const file = publicFile(`${GALLERY_BASE}-${suffix}`);
      assert.equal(existsSync(file), true, suffix);
      const metadata = await sharp(file).metadata();
      assert.equal(metadata.exif, undefined, suffix);
      assert.equal(metadata.iptc, undefined, suffix);
      assert.equal(metadata.xmp, undefined, suffix);
      assert.equal(metadata.icc, undefined, suffix);
    }
  });

  it("keeps the original out of git and does not scrape X hosts in tracked files", async () => {
    const { stdout } = await run("git", ["ls-files", "--", "media/original"], {
      cwd: root,
    });
    assert.equal(stdout.trim(), "media/original/README.md");

    for (const relative of [
      "src/data/news.ts",
      "src/data/media.ts",
      "src/data/campusGirlsPrelimFinalResultImage.ts",
      "docs/CONTENT-OPS.md",
      "docs/MEDIA.md",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("pbs.twimg.com"), false, relative);
      assert.equal(source.includes("video.twimg.com"), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
      assert.equal(source.toLowerCase().includes("millie"), false, relative);
    }
  });
});

describe("2026-09-06 CAMPUS GIRLS 予選final 結果報告 — scope", () => {
  it("surfaces on the campus-girls Activity only", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    assert.equal(campusNews[0]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(campusNews[1]?.id, NEWS_ID);
    assert.equal(selectActivityMedia("campus-girls")[0], campusGirlsFinalsExGuideImage);
    assert.equal(selectActivityMedia("campus-girls")[1], campusGirlsPrelimFinalResultImage);
    for (const activityId of ["miss-circle", "live-stream", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("adds the confirmed highlight and keeps stories, events, and contest unchanged", () => {
    const highlight = highlights.find((entry) => entry.id === HIGHLIGHT_ID);
    assert.ok(highlight);
    assert.equal(highlight.dateLabel, "2026年9月6日");
    assert.match(highlight.title, /本戦進出/);
    assert.equal(highlight.source, SOURCE);
    assert.equal(
      activities.find((activity) => activity.id === "campus-girls")?.relatedHighlightIds[0],
      HIGHLIGHT_ID,
    );

    assert.equal(
      stories.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    assert.deepEqual(events, []);
    assert.equal(contest.contestName, "MISS CIRCLE CONTEST 2026");
    assert.equal(
      galleryVideos.some((entry) => String(entry.id ?? "").includes(NEWS_ID)),
      false,
    );
    assert.equal(
      streamSchedule.some(
        (slot) => slot.date === "2026-09-06" && `${slot.time}${slot.endTime ?? ""}`.includes("final"),
      ),
      false,
    );
  });
});

describe("2026-09-06 CAMPUS GIRLS 予選final 結果報告 — Portal Feed", () => {
  it("flows through Portal Feed as image NEWS", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-06T12:00:00+09:00"),
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-06T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.ok(entry.image?.endsWith(PHOTO) || entry.image?.includes("mily-b63-01"));
  });
});
