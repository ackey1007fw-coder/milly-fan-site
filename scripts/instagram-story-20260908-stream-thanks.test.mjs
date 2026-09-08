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
import { events } from "../src/data/events.ts";
import {
  galleryVideos,
  streamThanksMorningSlotStoryVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import {
  campusGirlsPatonVoteLink,
  missCircleWebVoteLink,
} from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { isFaststart } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const instagramProfile = "https://www.instagram.com/mily_chan36";
const showroomRoom = "https://www.showroom-live.com/r/circle2026_0734";

const NEWS_ID = "2026-09-08-stream-thanks-morning-slot-story";
const MEDIA_ID = "mily-b66-01-stream-thanks-morning-slot-story";
const PUBLIC_VIDEO = "mily-b66-01-stream-thanks-morning-slot-story.mp4";
const PUBLIC_POSTER = "mily-b66-01-stream-thanks-morning-slot-story-poster.jpg";
const PUBLIC_BYTES = 698_475;
const PUBLIC_SHA256 =
  "dc922357bb1eca90447dca156a3dbc8cc730efc889fe17c846adda961078a486";
const POSTER_BYTES = 95_887;
const POSTER_SHA256 =
  "5ba627ce46eba9a0b204ff90742dbf724af2604034b0a1c14a3f06f1e11827f0";

const TITLE = "配信ありがとう、「明日の朝枠は7:30〜8:20」";
const BODY =
  "9月8日未明、みりぃがInstagram Storyで、配信へのお礼と「明日の朝枠は7:30〜8:20」を伝えました。配信中は「目がぁぁ乾くぅぅ見えないぃぃ」と言っていたけれど、配信を切った瞬間に平気になった、とも添えています。くま耳とキラキラのフィルターをつけて、白いふわふわの毛布のそばでカメラを見ている短い動画です。";
const MESSAGE =
  "配信ありがとう\u{1F4AB}\n" +
  "配信中あんなに\n" +
  "「目がぁぁ乾くぅぅ見えないぃぃ」\n" +
  "とか言ってたけど、\n" +
  "配信切った瞬間平気になった、、、( ˈ‿ˈ )\n" +
  "明日の朝枠は7:30〜8:20‼\u{FE0F}";

const now = Date.parse("2026-09-08T09:00:00+09:00");

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function probe(file) {
  const { stdout } = await run(await ffprobeExe(), [
    "-hide_banner",
    "-v",
    "error",
    "-show_format",
    "-show_streams",
    "-show_chapters",
    "-print_format",
    "json",
    file,
  ]);
  return JSON.parse(stdout);
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function changedText() {
  const files = [
    "docs/CONTENT-OPS.md",
    "docs/MEDIA.md",
    "scripts/fixtures/gallery-videos-before-b41.ts",
    "scripts/fixtures/gallery-videos-before-b58.ts",
    "scripts/fixtures/news-before-b41.ts",
    "scripts/fixtures/news-before-b58.ts",
    "scripts/instagram-story-20260908-stream-thanks.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/streamThanksMorningSlotStoryVideo.json",
    "src/data/streamThanksMorningSlotStoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b66");
      assert.notEqual(start, -1);
      const end = text.indexOf("\n## ", start + 4);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-09-08 Instagram Story 配信お礼・翌朝枠 — Latest / NEWS", () => {
  it("follows the same-day みりぽち Story as the second 9/8 record", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(news[0]?.id, "2026-09-08-miripochi-waiting-vote-story");
    assert.equal(news[1], entry);
    assert.equal(ordered[0]?.id, "2026-09-08-miripochi-waiting-vote-story");
    assert.equal(ordered[1], entry);
    assert.equal(ordered[2]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(ordered[3]?.id, "2026-09-07-morning-thanks-vote-day5-story");
    assert.equal(entry.date, "2026-09-08");
    assert.equal(entry.sameDayOrder, 10);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.message?.label, "みりぃのStory");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps Story attribution non-link with Instagram and SHOWROOM links only", () => {
    const entry = item();

    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, instagramProfile);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.deepEqual(entry.additionalCtas, [{ label: "SHOWROOM", url: showroomRoom }]);
    const serialized = JSON.stringify(entry);
    assert.equal(serialized.includes(campusGirlsPatonVoteLink.url), false);
    assert.equal(serialized.includes(missCircleWebVoteLink.url), false);
    assert.deepEqual(resolveNewsLinks(entry, now), {
      relatedUrl: instagramProfile,
      cta: { label: "Instagramプロフィールを見る", url: instagramProfile },
      additionalCtas: [{ label: "SHOWROOM", url: showroomRoom }],
    });
  });

  it("shares one manifest object with Gallery, LIVE STREAM, and Portal Feed", () => {
    const entry = item();

    assert.equal(entry.media, streamThanksMorningSlotStoryVideo);
    assert.equal(galleryVideos[0]?.id, "mily-b79-01-miripochi-waiting-story");
    assert.equal(galleryVideos[1], streamThanksMorningSlotStoryVideo);
    assert.deepEqual(
      galleryVideos.filter(({ id }) => id === MEDIA_ID),
      [streamThanksMorningSlotStoryVideo],
    );
    assert.equal(
      visibleGalleryVideos().find(({ id }) => id === MEDIA_ID),
      streamThanksMorningSlotStoryVideo,
    );
    assert.equal(streamThanksMorningSlotStoryVideo.kind, "video");
    assert.equal(streamThanksMorningSlotStoryVideo.provenance, "owner-provided");
    assert.equal(streamThanksMorningSlotStoryVideo.sourceLabel, "Instagram Story");
    assert.equal(streamThanksMorningSlotStoryVideo.sourceDate, "2026-09-08");
    assert.equal("sourceUrl" in streamThanksMorningSlotStoryVideo, false);
    assert.equal(streamThanksMorningSlotStoryVideo.published, true);
    assert.equal(streamThanksMorningSlotStoryVideo.width, 720);
    assert.equal(streamThanksMorningSlotStoryVideo.height, 1280);
    assert.equal(streamThanksMorningSlotStoryVideo.src, `/media/gallery/${PUBLIC_VIDEO}`);
    assert.equal(streamThanksMorningSlotStoryVideo.poster, `/media/gallery/${PUBLIC_POSTER}`);

    const entries = selectGalleryEntries().filter(({ key }) => key === MEDIA_ID);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].kind, "video");
    assert.equal(entries[0].item.video.controls, true);
    assert.equal(entries[0].item.video.playsInline, true);
    assert.equal(entries[0].item.video.preload, "none");

    assert.equal(selectActivityNews("live-stream", news, news.length)[0]?.id, NEWS_ID);
    assert.equal(selectActivityMedia("live-stream")[0], streamThanksMorningSlotStoryVideo);
    for (const activityId of ["miss-circle", "campus-girls", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
      assert.equal(
        selectActivityMedia(activityId).some((candidate) => candidate.id === MEDIA_ID),
        false,
      );
    }

    const feed = createPortalFeed({
      now: new Date("2026-09-08T09:00:00+09:00"),
      newsItems: news,
      storyItems: [],
      eventItems: [],
    });
    assertPortalNewsFollowsSort(feed, news);
    const feedItem = findFeedItem(feed, portalNewsId(NEWS_ID));
    assert.equal(feedItem.sourceUrl, undefined);
    assert.equal(feedItem.title, TITLE);
    assert.ok(feedItem.image?.endsWith(PUBLIC_POSTER));
  });

  it("quotes the morning slot without rewriting the schedule or inventing a date", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    assert.doesNotMatch(copy, /9月9日|9\/9|9月8日の朝|9\/8の朝/);
    assert.doesNotMatch(copy, /liff\.line\.me|misscircle\.jp|instagram\.com|showroom-live\.com/);
    assert.match(entry.body, /「明日の朝枠は7:30〜8:20」/);
    // 9/8 の枠は本人配布タイムテーブル由来の既存データのまま。Story から転記しない。
    assert.deepEqual(
      streamSchedule.filter((slot) => slot.date === "2026-09-08"),
      [{ date: "2026-09-08", time: "07:00", endTime: "08:00" }],
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date >= "2026-09-08" && slot.time === "07:30"),
      false,
    );
  });
});

describe("2026-09-08 Instagram Story 配信お礼・翌朝枠 — published media", () => {
  it("publishes exactly one shared MP4 and one real-frame poster", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b66-"))
      .sort();
    assert.deepEqual(assets, [PUBLIC_POSTER, PUBLIC_VIDEO].sort());

    const mp4 = path.join(galleryDirectory, PUBLIC_VIDEO);
    const poster = path.join(galleryDirectory, PUBLIC_POSTER);
    assert.equal((await stat(mp4)).size, PUBLIC_BYTES);
    assert.equal(await sha256(mp4), PUBLIC_SHA256);
    assert.equal((await stat(poster)).size, POSTER_BYTES);
    assert.equal(await sha256(poster), POSTER_SHA256);

    const metadata = await sharp(poster).metadata();
    assert.equal(metadata.width, 720);
    assert.equal(metadata.height, 1280);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  });

  it("remuxes the 1fps H.264 stream unchanged, video-only, with faststart", async () => {
    const mp4 = path.join(galleryDirectory, PUBLIC_VIDEO);
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.equal(video.profile, "High");
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "1/1");
    assert.equal(video.nb_frames, "20");
    assert.equal(Number(info.format.duration), 20);
    assert.equal(audio, undefined);
    assert.equal(info.format.nb_streams, 1);
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(info.chapters, []);
    assert.equal(video.tags?.creation_time, undefined);
    assert.equal(info.format.tags?.creation_time, undefined);
    assert.equal(JSON.stringify(info).includes("Core Media"), false);
  });
});

describe("2026-09-08 Instagram Story 配信お礼・翌朝枠 — privacy and scope", () => {
  it("does not create articles, milestones, events, schedules, or photo records", () => {
    const ids = new Set([NEWS_ID, MEDIA_ID]);

    assert.equal(
      stories.some((entry) => ids.has(entry.slug) || ids.has(entry.id)),
      false,
    );
    assert.equal(highlights.some((entry) => ids.has(entry.id)), false);
    assert.equal(events.some((entry) => ids.has(entry.id)), false);
    assert.equal(media.some((entry) => ids.has(entry.id)), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes("b66")),
      false,
    );
  });

  it("keeps the original and handoff identifiers out of tracked text", async () => {
    const forbidden = [
      /(?:^|\/)upload\//i,
      /uploads\//i,
      /drive\.google\.com/i,
      /[0-9A-F]{8}(?:-[0-9A-F]{4}){3}-[0-9A-F]{12}\.mp4/i,
      /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i,
      /\/root\/|\/mnt\/|\/tmp\//,
    ];

    for (const { file, text } of await changedText()) {
      for (const pattern of forbidden) {
        assert.doesNotMatch(text, pattern, file);
      }
      assert.equal(DRIVE_HOST_PATTERN.test(text), false, file);
      assert.equal(DRIVE_FOLDER_PATTERN.test(text), false, file);
    }

    const { stdout } = await run("git", ["ls-files", "media/original"], {
      cwd: root,
    });
    assert.equal(stdout.trim(), "media/original/README.md");
  });

  it("documents the batch ledger and the operational notes", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("### 2026-09-08 Instagram Story 配信お礼・「明日の朝枠は7:30〜8:20」（batch b66）");
    assert.notEqual(start, -1);
    const section = ops.slice(start);

    assert.match(docs, /batch b66/);
    assert.match(docs, /video-only/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /-c:v copy/);
    assert.match(docs, new RegExp(PUBLIC_VIDEO.replace(/\./g, "\\.")));
    assert.match(docs, new RegExp(PUBLIC_SHA256));
    assert.match(docs, new RegExp(POSTER_SHA256));
    assert.match(docs, /4\.0秒地点の実フレーム/);
    assert.match(docs, /再投稿表示/);
    assert.match(ops, /85件/);
    assert.match(ops, /独立動画34本/);
    assert.match(section, /video-only/);
    assert.match(section, /sameDayOrder: 10/);
    assert.match(section, /streamSchedule \/ events へ転記しない/);
    assert.doesNotMatch(docs, /drive\.google\.com/);
    assert.doesNotMatch(section, /drive\.google\.com/);
  });
});
