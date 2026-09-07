import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { galleryVideos } from "./fixtures/gallery-videos-before-b41.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import { createPortalFeed } from "./fixtures/portal-feed-before-b41.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";
import { verifyNews } from "./content-invariants.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-21-after-afternoon-ganda";
const SOURCE = "https://x.com/mily_chan36/status/2090722156162478273";
const PHOTO = "/media/news/mily-b14-01-ganda-before-night-stream.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
const ORIGINAL = path.join(
  root,
  "media/original/mily-b14-01-ganda-before-night-stream.jpg",
);
const ORIGINAL_SIZE = 130_379;
const ORIGINAL_SHA256 =
  "c41bb38ed42cbdf1133583f904c78475c1d683cef6ac3d1727327fde080c9a3e";
const PUBLIC_SIZE = 92_816;
const PUBLIC_SHA256 =
  "3d821f2bdee3b1c0d46ed834d31a168c03199285012d87bb53f308ff0cbcb5dc";
const MESSAGE = [
  "昼枠配信見てくれた方には通じる写真。",
  "",
  "急遽なガンダで絶望してるみりぃ。笑笑笑",
  "",
  "どういうこと？？",
  "という方は23:00〜の配信でお待ちしております🛜",
  "この時の心境お話ししますね🤭笑",
  "",
  "#ミスサー #ミスサークルコンテスト2026 #ミスサークル #ミスサークル2026 #ミスサー2026 #ミスコン",
].join("\n");

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-08-21 ganda X post — Latest entry", () => {
  it("adds exactly one source-backed News item with the confirmed date", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-21");
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including blank lines", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 9);
    assert.match(entry.message.text, /^昼枠配信見てくれた方には通じる写真。\n\n/);
    assert.match(entry.message.text, /絶望してるみりぃ。笑笑笑\n\n/);
    assert.match(entry.message.text, /23:00〜の配信でお待ちしております🛜/);
    assert.match(entry.message.text, /#ミスコン$/);
  });

  it("uses archive wording and adds no cause or event not stated in the post", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.media?.alt ?? ""}`;

    assert.match(entry.body, /昼枠配信を見ていた方には通じる/);
    assert.match(entry.body, /「急遽なガンダで絶望している」/);
    assert.match(entry.body, /投稿では23:00〜の配信でこの時の心境を話すと案内しました/);
    assert.doesNotMatch(entry.body, /23:00〜配信があります|23:00〜配信します/);

    for (const phrase of [
      "急な用事が発生",
      "急用",
      "移動のため",
      "全力疾走",
      "昼配信中にトラブル",
      "トラブルが起き",
      "目的地",
      "遅刻",
      "事故",
      "体調不良",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("contains no rankings, engagement metrics, or unrelated contest facts", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}\n${entry.media.alt}`;

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
      "26日までガチイベ中",
      "CAMPUS GIRLS",
      "三次審査",
      "ランウェイを目指して",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-21 ganda X post — self-hosted photo", () => {
  it("uses one local /media/news/ JPEG and never hotlinks SNS media", async () => {
    const photo = item().media;

    assert.equal(photo?.kind, "image");
    assert.equal(photo?.src, PHOTO);
    assert.match(photo.src, /^\/media\/news\//);
    assert.match(photo.srcSet ?? "", /mily-b14-01-ganda-before-night-stream-480\.jpg/);
    assert.equal(existsSync(PHOTO_FILE), true);

    for (const host of [
      "pbs.twimg.com",
      "twimg",
      "twitter.com",
      "cdninstagram",
      "instagram.com",
      "http://",
      "https://",
    ]) {
      assert.equal(photo.src.includes(host), false, host);
    }

    const b14Files = (await readdir(path.join(root, "public/media/news")))
      .filter((file) => file.includes("mily-b14"));
    assert.deepEqual(b14Files, [path.basename(PHOTO_FILE)]);
  });

  it("records the measured 720x1280 dimensions and sanitized public bytes", async () => {
    const photo = item().media;
    const metadata = await sharp(PHOTO_FILE).metadata();

    assert.equal(metadata.format, "jpeg");
    assert.equal(photo.width, metadata.width);
    assert.equal(photo.height, metadata.height);
    assert.equal(metadata.width, 720);
    assert.equal(metadata.height, 1280);
    assert.equal((await stat(PHOTO_FILE)).size, PUBLIC_SIZE);
    assert.equal(await sha256(PHOTO_FILE), PUBLIC_SHA256);

    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(metadata.orientation, undefined);
    assert.equal(metadata.comments, undefined);
  });

  it("keeps the original dimensions and pixels aligned without crop or scale", async () => {
    if (!existsSync(ORIGINAL)) return;

    assert.equal((await stat(ORIGINAL)).size, ORIGINAL_SIZE);
    assert.equal(await sha256(ORIGINAL), ORIGINAL_SHA256);
    const originalMetadata = await sharp(ORIGINAL).metadata();
    assert.equal(originalMetadata.width, 720);
    assert.equal(originalMetadata.height, 1280);
    assert.ok(originalMetadata.exif);
    assert.ok(originalMetadata.iptc);

    const original = await sharp(ORIGINAL).removeAlpha().raw().toBuffer();
    const published = await sharp(PHOTO_FILE).removeAlpha().raw().toBuffer();
    assert.equal(published.length, original.length);

    let totalDifference = 0;
    for (let index = 0; index < original.length; index += 1) {
      totalDifference += Math.abs(original[index] - published[index]);
    }
    assert.ok(totalDifference / original.length < 2);
  });

  it("keeps the owner-provided original ignored and out of git", async () => {
    const relative = "media/original/mily-b14-01-ganda-before-night-stream.jpg";
    const { stdout: ignored } = await run("git", ["check-ignore", "-v", "--", relative], {
      cwd: root,
    });
    const { stdout: tracked } = await run("git", ["ls-files", "--", relative], {
      cwd: root,
    });

    assert.match(ignored, /media\/original\/\*/);
    assert.equal(tracked.trim(), "");
  });
});

describe("2026-08-21 ganda X post — scope and ordering", () => {
  it("publishes the cap+mask photo in Gallery without duplicating the NEWS JPEG", async () => {
    assert.equal(media.some((entry) => entry.id === "mily-b14-01"), true);
    assert.equal(galleryVideos.some((entry) => entry.id.includes("b14")), false);
    assert.equal(galleryVideos.some((entry) => "src" in entry && entry.src.includes("ganda")), false);
    assert.equal(stories.some((entry) => entry.slug.includes("ganda")), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);

    const mediaSource = await readFile(path.join(root, "src/data/media.ts"), "utf8");
    assert.equal(mediaSource.includes("gandaBeforeNightStreamPhoto"), true);
    for (const relative of ["src/data/galleryVideos.ts", "src/data/stories.ts"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("mily-b14"), false, relative);
      assert.equal(source.includes(NEWS_ID), false, relative);
    }
  });

  it("does not hand-enter the 23:00 notice into schedule data", async () => {
    const eventsSource = await readFile(path.join(root, "src/data/events.ts"), "utf8");
    assert.equal(eventsSource.includes("23:00"), false, "src/data/events.ts");
    assert.equal(eventsSource.includes(NEWS_ID), false, "src/data/events.ts");
    assert.equal(eventsSource.includes("mily-b14"), false, "src/data/events.ts");

    const scheduleSource = await readFile(
      path.join(root, "src/data/streamSchedule.ts"),
      "utf8",
    );
    assert.equal(scheduleSource.includes(NEWS_ID), false, "src/data/streamSchedule.ts");
    assert.equal(scheduleSource.includes("mily-b14"), false, "src/data/streamSchedule.ts");
    assert.equal(scheduleSource.includes("2026-08-21"), false, "src/data/streamSchedule.ts");
    assert.doesNotMatch(
      scheduleSource,
      /date:\s*"2026-08-21"[\s\S]{0,80}23:00/,
    );
  });

  it("keeps every existing 8/21 item behind the newer TikTok entry", () => {
    const existing = [
      "2026-08-21-afternoon-showroom-fanroom",
      "2026-08-21-event-story-next-slot",
      "2026-08-21-morning-ohayo-story",
      "2026-08-21-morning-showroom-runway",
    ];
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night")).map((entry) => entry.id);
    assert.deepEqual(ordered.slice(0, 24), [
      "2026-08-26-girlsaward-showroom-6th",
      "2026-08-26-paton-vote-stories",
      "2026-08-26-instagram-followers-400",
      "2026-08-26-morning-stream-thanks",
      "2026-08-26-girl-award-event-fanroom",
      "2026-08-26-mixch-15x-day",
      "2026-08-26-stream-1000",
      "2026-08-25-mixch-confidence-message",
      "2026-08-25-motivation",
      "2026-08-24-seasidecircle-yes-tokyo",
      "2026-08-24-campus-girls-final-stage-guide",
      "2026-08-24-makeup-stream",
      "2026-08-24-night-thanks-morning-stream",
      "2026-08-23-dragon-cloud",
      "2026-08-23-seaside-circle-musical-special",
      "2026-08-23-morning-showroom-fanroom",
      "2026-08-23-early-showroom-fanroom",
      "2026-08-23-earthquake-showroom-fanroom",
      "2026-08-22-night-showroom-thanks",
      "2026-08-22-night-showroom-fanroom",
      "2026-08-22-evening-showroom-fanroom",
      "2026-08-22-campus-girls-second-stage-jury-award",
      "2026-08-21-tiktok-radio-misscircle",
      NEWS_ID,
    ]);
    assert.ok(
      news.some((entry) => entry.id === "2026-08-21-tiktok-radio-misscircle"),
    );
    for (const id of existing) assert.ok(news.some((entry) => entry.id === id), id);
    assert.equal(news.length, 49);
  });
});

describe("2026-08-21 ganda X post — Portal Feed and responsive contract", () => {
  it("flows through Portal Feed with its self-hosted site-origin image", async () => {
    const scopedNews = news.filter((entry) => entry.date <= "2026-08-21");
    const feed = createPortalFeed({
      now: new Date("2026-08-21T18:00:00+09:00"),
      newsItems: scopedNews,
      storyItems: [],
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, scopedNews);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-21T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, new URL(PHOTO, siteOrigin()).href);
    assert.equal(new URL(entry.image).origin, siteOrigin());
    assert.equal(entry.image.includes("twimg"), false);

    const portalSource = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("mily-b14"), false);
  });

  it("uses the existing uncropped, overflow-safe Latest rendering", async () => {
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const newsImage = await readFile(
      path.join(root, "src/components/NewsImage.tsx"),
      "utf8",
    );
    const image = newsImage.match(/<img[\s\S]*?\/>/);
    const call = latest.match(/<NewsImage[\s\S]*?\/>/);

    assert.ok(image);
    assert.ok(call);
    assert.match(image[0], /className=\{className\}/);
    assert.doesNotMatch(image[0], /object-cover/);
    assert.match(call[0], /object-contain/);
    assert.doesNotMatch(call[0], /object-cover/);
    assert.match(call[0], /\bw-full\b/);
    assert.match(call[0], /\bh-auto\b/);
    assert.match(call[0], /max-w-sm/);
    assert.match(latest, /whitespace-pre-line break-words/);
    assert.doesNotMatch(call[0], /className="[^"]*\bw-\[\d+px\]/);
  });
});
