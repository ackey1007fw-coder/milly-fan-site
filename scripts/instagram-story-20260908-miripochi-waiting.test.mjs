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
  miripochiWaitingStoryVideo,
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
const voteCta = { label: "WEB投票する", url: missCircleWebVoteLink.url };

const NEWS_ID = "2026-09-08-miripochi-waiting-vote-story";
const MEDIA_ID = "mily-b79-01-miripochi-waiting-story";
const PUBLIC_VIDEO = "mily-b79-01-miripochi-waiting-story.mp4";
const PUBLIC_POSTER = "mily-b79-01-miripochi-waiting-story-poster.jpg";
const PUBLIC_BYTES = 585_726;
const PUBLIC_SHA256 =
  "819779689509ee2e32d2ef5500ba4c285cf46c745d81b8d622c16181ac653d62";
const POSTER_BYTES = 68_651;
const POSTER_SHA256 =
  "43346f678515886202b3610966cd5921d5d45d4dcb906f0dce3c62cde314b7f5";

const TITLE = "「みりぽち待ってます」投票を呼びかけ";
const BODY =
  "9月8日、みりぃがInstagram Storyで、リンクスタンプに「みりぽち待ってます」と書いて投票を呼びかけました。リンク先はStoryの表示だけでは確認できないため、ここには書きません。くま耳とキラキラのフィルターをつけて、ヘッドホンを着けたままマイクの前に座っている短い動画です。";
const MESSAGE = "みりぽち待ってます\u{1FA75}\u{1FA75}\u{1FA75}";

const duringVote = Date.parse("2026-09-08T15:00:00+09:00");
const afterVote = Date.parse("2026-09-14T00:00:01+09:00");

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
    "scripts/instagram-story-20260908-miripochi-waiting.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/miripochiWaitingStoryVideo.json",
    "src/data/miripochiWaitingStoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b79");
      assert.notEqual(start, -1);
      const end = text.indexOf("\n## ", start + 4);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-09-08 Instagram Story 「みりぽち待ってます」 — Latest / NEWS", () => {
  it("leads Latest ahead of the same-day stream-thanks Story", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(news[0], entry);
    assert.equal(ordered[0], entry);
    assert.equal(ordered[1]?.id, "2026-09-08-stream-thanks-morning-slot-story");
    assert.equal(ordered[2]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(entry.date, "2026-09-08");
    assert.equal(entry.sameDayOrder, 20);
    assert.deepEqual(entry.activityIds, ["miss-circle"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.message?.label, "みりぃのStory");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps Story attribution non-link with the confirmed WEB vote CTA only", () => {
    const entry = item();

    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, instagramProfile);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.deepEqual(entry.additionalCtas, [voteCta]);
    const serialized = JSON.stringify(entry);
    assert.equal(serialized.includes(campusGirlsPatonVoteLink.url), false);
    assert.equal(serialized.includes("showroom-live.com"), false);
    assert.deepEqual(resolveNewsLinks(entry, duringVote), {
      relatedUrl: instagramProfile,
      cta: { label: "Instagramプロフィールを見る", url: instagramProfile },
      additionalCtas: [voteCta],
    });
    // WEB投票 SupportEvent の期間終了後は投票CTAだけが自動で消える。
    assert.deepEqual(resolveNewsLinks(entry, afterVote), {
      relatedUrl: instagramProfile,
      cta: { label: "Instagramプロフィールを見る", url: instagramProfile },
    });
  });

  it("shares one manifest object with Gallery, MISS CIRCLE, and Portal Feed", () => {
    const entry = item();

    assert.equal(entry.media, miripochiWaitingStoryVideo);
    assert.equal(galleryVideos[0], miripochiWaitingStoryVideo);
    assert.equal(galleryVideos[1], streamThanksMorningSlotStoryVideo);
    assert.deepEqual(
      galleryVideos.filter(({ id }) => id === MEDIA_ID),
      [miripochiWaitingStoryVideo],
    );
    assert.equal(
      visibleGalleryVideos().find(({ id }) => id === MEDIA_ID),
      miripochiWaitingStoryVideo,
    );
    assert.equal(miripochiWaitingStoryVideo.kind, "video");
    assert.equal(miripochiWaitingStoryVideo.provenance, "owner-provided");
    assert.equal(miripochiWaitingStoryVideo.sourceLabel, "Instagram Story");
    assert.equal(miripochiWaitingStoryVideo.sourceDate, "2026-09-08");
    assert.equal("sourceUrl" in miripochiWaitingStoryVideo, false);
    assert.equal(miripochiWaitingStoryVideo.published, true);
    assert.equal(miripochiWaitingStoryVideo.width, 720);
    assert.equal(miripochiWaitingStoryVideo.height, 1280);
    assert.equal(miripochiWaitingStoryVideo.src, `/media/gallery/${PUBLIC_VIDEO}`);
    assert.equal(miripochiWaitingStoryVideo.poster, `/media/gallery/${PUBLIC_POSTER}`);

    const entries = selectGalleryEntries().filter(({ key }) => key === MEDIA_ID);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].kind, "video");
    assert.equal(entries[0].item.video.controls, true);
    assert.equal(entries[0].item.video.playsInline, true);
    assert.equal(entries[0].item.video.preload, "none");

    assert.equal(selectActivityNews("miss-circle", news, news.length)[0]?.id, NEWS_ID);
    assert.equal(selectActivityMedia("miss-circle")[0], miripochiWaitingStoryVideo);
    // 場所・番組・配信との関係は未確認のため、RADIO / LIVE STREAM には関連付けない。
    for (const activityId of ["live-stream", "campus-girls", "radio"]) {
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
    assert.equal(selectActivityMedia("live-stream")[0], streamThanksMorningSlotStoryVideo);

    const feed = createPortalFeed({
      now: new Date("2026-09-08T15:00:00+09:00"),
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

  it("does not invent a time of day, a link target, a place, or a vote-day count", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    assert.doesNotMatch(copy, /未明|朝|昼|夕方|夜|\d+時|\d{1,2}:\d{2}/);
    assert.doesNotMatch(copy, /ラジオ|スタジオ|収録|配信中|番組/);
    assert.doesNotMatch(copy, /\d+日目/);
    assert.doesNotMatch(copy, /liff\.line\.me|misscircle\.jp|instagram\.com|showroom-live\.com/);
    assert.match(entry.body, /リンク先はStoryの表示だけでは確認できないため、ここには書きません/);
    // 9/8 の枠は既存データのまま。Story から転記しない。
    assert.deepEqual(
      streamSchedule.filter((slot) => slot.date === "2026-09-08"),
      [{ date: "2026-09-08", time: "07:00", endTime: "08:00" }],
    );
  });
});

describe("2026-09-08 Instagram Story 「みりぽち待ってます」 — published media", () => {
  it("publishes exactly one shared MP4 and one real-frame poster", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b79-"))
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

describe("2026-09-08 Instagram Story 「みりぽち待ってます」 — privacy and scope", () => {
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
      streamSchedule.some((entry) => JSON.stringify(entry).includes("b79")),
      false,
    );
  });

  it("keeps the original and handoff identifiers out of tracked text", async () => {
    const forbidden = [
      /(?:^|\/)upload\//i,
      /uploads\//i,
      /drive\.google\.com/i,
      /[0-9A-F]{8}(?:-[0-9A-F]{4}){3}-[0-9A-F]{12}\.mp4/i,
      /[0-9a-f]{8}-[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\.mp4/i,
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
    const start = ops.indexOf("### 2026-09-08 Instagram Story 「みりぽち待ってます」（batch b79）");
    assert.notEqual(start, -1);
    const section = ops.slice(start, ops.indexOf("\n## ", start));

    assert.match(docs, /batch b79/);
    assert.match(docs, /video-only/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /-c:v copy/);
    assert.match(docs, new RegExp(PUBLIC_VIDEO.replace(/\./g, "\\.")));
    assert.match(docs, new RegExp(PUBLIC_SHA256));
    assert.match(docs, new RegExp(POSTER_SHA256));
    assert.match(docs, /4\.0秒地点の実フレーム/);
    assert.match(docs, /音声の扱い — 削除した/);
    assert.match(ops, /85件/);
    assert.match(ops, /独立動画34本/);
    assert.match(section, /video-only/);
    assert.match(section, /sameDayOrder: 20/);
    assert.match(section, /2026-09-13 23:59 JST|期間終了後は自動で消える/);
    assert.match(section, /RADIO \/\s*LIVE STREAM Activity には関連付けず/);
    assert.doesNotMatch(docs, /drive\.google\.com/);
    assert.doesNotMatch(section, /drive\.google\.com/);
  });
});
