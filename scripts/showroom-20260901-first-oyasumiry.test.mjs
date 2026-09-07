import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import {
  firstSeptemberAckeyCheekImage,
  firstSeptemberAckeyHeadpointImage,
  firstSeptemberAckeyPointImage,
  firstSeptemberAckeyPreposeImage,
  firstSeptemberFanmarkBoardImage,
  firstSeptemberShowroomAdditionalMedia,
  firstSeptemberTomatoBoardImage,
} from "../src/data/firstSeptemberShowroomImages.ts";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { contest } from "../src/data/contest.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-09-01-first-showroom-oyasumiry";
const ROOM = "https://www.showroom-live.com/r/circle2026_0734";
const TITLE = "9月初配信、おやすみりー";
const BODY =
  "9月1日22:31から翌0:19頃まで、約1時間48分。9月はじめての配信。すっぴんで、帽子で前髪が潰れた、うるうるカラコンで目が乾いた、と話していた。今月の目標は「ミリィの栄養素」70人。ボードの1人目はあっきーさん、2人目はやすぴさん。パトン投票はその夜が最終日で、当時2位。最後はおやすみなさい、おやすみりー、おみりー。山を一歩ずつ登って、肩を組んで這い上がろう、という話もあった。";
const LEAD = "/media/news/mily-b48-01-tomato-nutrient-ackey.jpg";
const YASUPI = "/media/news/mily-b48-06-fanmark-yasupi.jpg";
const STILL_SRCS = [
  LEAD,
  "/media/news/mily-b48-02-ackey-point.jpg",
  "/media/news/mily-b48-03-ackey-prepose.jpg",
  "/media/news/mily-b48-04-ackey-cheek.jpg",
  "/media/news/mily-b48-05-ackey-headpoint.jpg",
  YASUPI,
];
const STILL_FILES = STILL_SRCS.map((src) => path.join(root, "public", src.slice(1)));
const STILL_ORIGINALS = [
  "media/original/mily-b48-01-tomato-nutrient-ackey.jpg",
  "media/original/mily-b48-02-ackey-point.jpg",
  "media/original/mily-b48-03-ackey-prepose.jpg",
  "media/original/mily-b48-04-ackey-cheek.jpg",
  "media/original/mily-b48-05-ackey-headpoint.jpg",
  "media/original/mily-b48-06-fanmark-yasupi.jpg",
];
const ACKEY_ADDITIONS = [
  firstSeptemberAckeyPointImage,
  firstSeptemberAckeyPreposeImage,
  firstSeptemberAckeyCheekImage,
  firstSeptemberAckeyHeadpointImage,
];

const FORBIDDEN = [
  "ミスサークル",
  "ミスサー",
  "作業メモ",
  "公式",
  "公認",
  "トマト＝栄養素＝ファンマーク",
  "Patonでみりぃに投票する",
];

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

function copyText(entry) {
  const extraAlts = (entry.additionalMedia ?? [])
    .map((mediaItem) => mediaItem.alt ?? "")
    .join("\n");
  return `${entry.title}\n${entry.body}\n${entry.media?.alt ?? ""}\n${extraAlts}`;
}

describe("2026-09-01 first SHOWROOM おやすみりー — NEWS", () => {
  it("adds one 9/1 item above the other same-day cards with the exact copy", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.length, 75);
    assert.equal(entry.date, "2026-09-01");
    assert.equal(entry.sameDayOrder, 20);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.equal(ordered[4], entry);
    assert.equal(ordered[5]?.id, "2026-09-01-ohayo-september-x");
    assert.equal(ordered[6]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(ordered[7]?.id, "2026-09-01-september-mily-story");
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("uses a non-link SHOWROOM label and one room CTA without a replay permalink", () => {
    const entry = item();

    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "SHOWROOM");
    assert.equal(entry.relatedUrl, ROOM);
    assert.equal(entry.ctaLabel, "SHOWROOM");
    assert.equal(entry.url, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.relatedUrl.includes("?t="), false);
    assert.deepEqual(resolveNewsLinks(entry, Date.parse("2026-09-01T23:00:00+09:00")), {
      relatedUrl: ROOM,
      cta: { label: "SHOWROOM", url: ROOM },
    });
    assert.deepEqual(resolveNewsLinks(entry, Date.parse("2026-09-02T12:00:00+09:00")), {
      relatedUrl: ROOM,
      cta: { label: "SHOWROOM", url: ROOM },
    });
  });

  it("keeps the body and alts free of forbidden wording", () => {
    const entry = item();
    const copy = copyText(entry);

    for (const phrase of FORBIDDEN) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
    assert.doesNotMatch(`${entry.title}\n${entry.body}`, /\blive\b/i);
    assert.match(entry.body, /ミリィの栄養素/);
    assert.match(entry.body, /1人目はあっきーさん/);
    assert.match(entry.body, /2人目はやすぴさん/);
    assert.equal(entry.body.includes("トマトの栄養素"), false);
    assert.equal(entry.body.includes("ファンマーク"), false);
  });
});

describe("2026-09-01 first SHOWROOM おやすみりー — self-hosted boards", () => {
  it("uses six NEWS-only JPEGs with あっきー as lead and やすぴ last", async () => {
    const entry = item();
    const displayed = newsDisplayMedia(entry);

    assert.equal(entry.media, firstSeptemberTomatoBoardImage);
    assert.notEqual(entry.media, firstSeptemberFanmarkBoardImage);
    assert.deepEqual(
      [...(entry.additionalMedia ?? [])],
      [...firstSeptemberShowroomAdditionalMedia],
    );
    assert.deepEqual([...ACKEY_ADDITIONS, firstSeptemberFanmarkBoardImage], [
      ...firstSeptemberShowroomAdditionalMedia,
    ]);
    assert.equal(displayed[0], firstSeptemberTomatoBoardImage);
    assert.deepEqual(displayed, [
      firstSeptemberTomatoBoardImage,
      ...ACKEY_ADDITIONS,
      firstSeptemberFanmarkBoardImage,
    ]);
    assert.equal(displayed.at(-1), firstSeptemberFanmarkBoardImage);
    assert.equal(firstSeptemberTomatoBoardImage.published, true);
    assert.equal(firstSeptemberTomatoBoardImage.provenance, "owner-provided");
    assert.equal(firstSeptemberTomatoBoardImage.sourceDate, "2026-09-01");
    assert.equal(firstSeptemberTomatoBoardImage.sourceUrl, null);
    assert.equal(firstSeptemberFanmarkBoardImage.published, true);
    assert.equal(firstSeptemberFanmarkBoardImage.src, YASUPI);
    assert.equal(firstSeptemberTomatoBoardImage.src, LEAD);
    for (const still of [
      firstSeptemberTomatoBoardImage,
      ...ACKEY_ADDITIONS,
      firstSeptemberFanmarkBoardImage,
    ]) {
      assert.equal(still.width, 640);
      assert.equal(still.height, 360);
      assert.equal(still.published, true);
      assert.equal(still.provenance, "owner-provided");
      assert.equal(still.sourceUrl, null);
    }
    for (const file of STILL_FILES) {
      assert.equal(existsSync(file), true, file);
    }

    for (const host of ["pbs.twimg.com", "twimg", "cdninstagram", "http://"]) {
      assert.equal(firstSeptemberTomatoBoardImage.src.includes(host), false, host);
      assert.equal(firstSeptemberFanmarkBoardImage.src.includes(host), false, host);
    }

    const newsFiles = (await readdir(path.join(root, "public/media/news")))
      .filter((file) => file.includes("mily-b48"))
      .sort();
    assert.deepEqual(newsFiles, [
      "mily-b48-01-tomato-nutrient-ackey.jpg",
      "mily-b48-02-ackey-point.jpg",
      "mily-b48-03-ackey-prepose.jpg",
      "mily-b48-04-ackey-cheek.jpg",
      "mily-b48-05-ackey-headpoint.jpg",
      "mily-b48-06-fanmark-yasupi.jpg",
    ]);
  });

  it("strips metadata and keeps the 640x360 composition", async () => {
    for (const file of STILL_FILES) {
      const metadata = await sharp(file).metadata();
      assert.equal(metadata.format, "jpeg");
      assert.equal(metadata.width, 640);
      assert.equal(metadata.height, 360);
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.iptc, undefined);
      assert.equal(metadata.xmp, undefined);
      assert.equal(metadata.icc, undefined);
      assert.ok((await stat(file)).size > 0);
    }
  });

  it("keeps owner-provided originals ignored and out of git", async () => {
    for (const relative of STILL_ORIGINALS) {
      const { stdout: ignored } = await run(
        "git",
        ["check-ignore", "-v", "--", relative],
        { cwd: root },
      );
      const { stdout: tracked } = await run("git", ["ls-files", "--", relative], {
        cwd: root,
      });
      assert.match(ignored, /media\/original\/\*/);
      assert.equal(tracked.trim(), "");
    }
  });
});

describe("2026-09-01 first SHOWROOM おやすみりー — scope", () => {
  it("surfaces on LIVE STREAM only and stays out of Gallery", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    assert.equal(liveNews[1]?.id, NEWS_ID);
    assert.equal(selectActivityMedia("live-stream")[1], firstSeptemberTomatoBoardImage);
    for (const activityId of ["miss-circle", "campus-girls", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (entry) => entry.id === NEWS_ID,
        ),
        false,
        activityId,
      );
    }
    assert.equal(media.some((entry) => entry.id.includes("b48")), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes("b48")), false);
    assert.equal(stories.some((entry) => JSON.stringify(entry).includes(NEWS_ID)), false);
    assert.equal(highlights.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );
    assert.equal(contest.currentPhase?.name, "3次審査");
  });

  it("keeps Portal Feed aligned with NEWS order and the lead still", () => {
    const feed = createPortalFeed({ newsItems: news });
    const feedItem = findFeedItem(feed, portalNewsId(NEWS_ID));
    assert.equal(feedItem.title, TITLE);
    assert.ok(feedItem.image?.endsWith(LEAD));
    assertPortalNewsFollowsSort(feed, news);
  });

  it("documents the addition without Drive IDs or attachment hashes", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const mediaGuide = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const start = ops.indexOf("### 2026-09-01 初配信 おやすみりー");
    const end = ops.indexOf("### 2026-09-01 本人X おはよ〜 今日から9月ー");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);
    assert.match(ops, /74件/);
    assert.match(section, /sameDayOrder: 20/);
    assert.match(section, /live-stream/);
    assert.match(section, /Paton投票CTAは付けない/);
    assert.match(section, /代表 `media` はあっきーさんボード/);
    assert.match(section, /やすぴさんボードを末尾に置く/);
    assert.match(mediaGuide, /## 素材台帳（batch b48/);
    assert.match(mediaGuide, /mily-b48-01-tomato-nutrient-ackey/);
    assert.match(mediaGuide, /mily-b48-02-ackey-point/);
    assert.match(mediaGuide, /mily-b48-06-fanmark-yasupi/);
    assert.doesNotMatch(mediaGuide, /mily-b48-02-fanmark-yasupi/);
    assert.doesNotMatch(section, /Drive ID|attachment hash|sha256/);
    assert.equal(DRIVE_HOST_PATTERN.test(ops), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(ops), false);
    assert.equal(DRIVE_HOST_PATTERN.test(mediaGuide), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(mediaGuide), false);
  });
});
