import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import {
  galleryVideos,
  visibleGalleryVideos,
  webVoteDay2StoryVideo,
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
import { missCircleThirdRoundWebVote } from "../src/data/supportEvents.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { isFaststart } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import { findFeedItem, portalNewsId } from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const instagramProfile = "https://www.instagram.com/mily_chan36";

const NEWS_ID = "2026-09-04-third-round-vote-day2-story";
const MEDIA_ID = "mily-b59-01-third-round-vote-day2-story";
const PUBLIC_VIDEO = "mily-b59-01-third-round-vote-day2-story.mp4";
const PUBLIC_POSTER = "mily-b59-01-third-round-vote-day2-story-poster.jpg";
const PUBLIC_BYTES = 3_459_344;
const PUBLIC_SHA256 =
  "e6666874750b57d43c1573964340773c78fc130c604a972107c815d3a11da49e";
const POSTER_BYTES = 64_813;
const POSTER_SHA256 =
  "82a73892f10ac6e6ae562b1a46958747e2042290f0b05855787fd796c4640455";

const TITLE = "「2日目ポチッとな〜」投票の呼びかけ";
const BODY =
  "みりぃがInstagram Storyで、リンクスタンプに「2日目ポチッとな〜」と書いて投票を呼びかけました。あわせて「毎日連続投票者の特典ちゃんもあるよっ」と添えています。リンク先と特典の内容はStoryの表示だけでは確認できないため、ここには書きません。くま耳とキラキラのフィルターをつけて、手を振ったりピースをしたりしている短い動画です。";
const MESSAGE =
  "（毎日連続投票者の特典ちゃんもあるよっ\u{1FA75}ボソッ）\n" +
  "2日目ポチッとな〜\u{1F5F3}\u{FE0F}❣\u{FE0F}❣\u{FE0F}";

const duringVote = Date.parse("2026-09-04T09:00:00+09:00");
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
    "scripts/instagram-story-20260904-vote-day2.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/webVoteDay2StoryVideo.json",
    "src/data/webVoteDay2StoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b59");
      assert.notEqual(start, -1);
      const end = text.indexOf("\n## ", start + 4);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-09-04 Instagram Story 投票2日目 — Latest / NEWS", () => {
  it("keeps exactly one record in date-sorted Latest after newer main NEWS", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(ordered[0]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(ordered[1]?.id, "2026-09-06-stream-thanks-next-slots");
    assert.equal(ordered[2]?.id, "2026-09-06-campus-girls-prelim-final-result");
    assert.equal(ordered[3]?.id, "2026-09-06-night-slot-2230");
    assert.equal(ordered[4]?.id, "2026-09-05-morning-stream-thanks");
    assert.equal(ordered[5]?.id, "2026-09-05-tiktok-radio-portrait");
    assert.equal(ordered[6], entry);
    assert.equal(ordered[7]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(entry.date, "2026-09-04");
    assert.equal(entry.sameDayOrder, 10);
    assert.deepEqual(entry.activityIds, ["miss-circle"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.message.label, "みりぃのStory");
    assert.equal(entry.message.text, MESSAGE);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps Story attribution non-link and gates the WEB vote CTA to its window", () => {
    const entry = item();

    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, instagramProfile);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.deepEqual(entry.additionalCtas, [
      { label: "WEB投票する", url: missCircleWebVoteLink.url },
    ]);
    assert.equal(
      JSON.stringify(entry).includes(campusGirlsPatonVoteLink.url),
      false,
    );
    assert.equal(missCircleThirdRoundWebVote.ctaLinkId, missCircleWebVoteLink.id);

    assert.deepEqual(resolveNewsLinks(entry, duringVote), {
      relatedUrl: instagramProfile,
      cta: { label: "Instagramプロフィールを見る", url: instagramProfile },
      additionalCtas: [{ label: "WEB投票する", url: missCircleWebVoteLink.url }],
    });
    assert.deepEqual(resolveNewsLinks(entry, afterVote), {
      relatedUrl: instagramProfile,
      cta: { label: "Instagramプロフィールを見る", url: instagramProfile },
    });
  });

  it("shares one manifest object with Gallery, the Activity, and Portal Feed", () => {
    const entry = item();

    assert.equal(entry.media, webVoteDay2StoryVideo);
    assert.equal(entry.additionalMedia, undefined);
    assert.deepEqual(
      galleryVideos.filter(({ id }) => id === MEDIA_ID),
      [webVoteDay2StoryVideo],
    );
    assert.equal(
      visibleGalleryVideos().find(({ id }) => id === MEDIA_ID),
      webVoteDay2StoryVideo,
    );
    assert.equal(webVoteDay2StoryVideo.kind, "video");
    assert.equal(webVoteDay2StoryVideo.provenance, "owner-provided");
    assert.equal(webVoteDay2StoryVideo.sourceLabel, "Instagram Story");
    assert.equal(webVoteDay2StoryVideo.sourceDate, "2026-09-04");
    assert.equal("sourceUrl" in webVoteDay2StoryVideo, false);
    assert.equal(webVoteDay2StoryVideo.published, true);
    assert.equal(webVoteDay2StoryVideo.width, 720);
    assert.equal(webVoteDay2StoryVideo.height, 1280);
    assert.equal(webVoteDay2StoryVideo.src, `/media/gallery/${PUBLIC_VIDEO}`);
    assert.equal(webVoteDay2StoryVideo.poster, `/media/gallery/${PUBLIC_POSTER}`);

    assert.equal(selectActivityNews("miss-circle", news, news.length)[0]?.id, NEWS_ID);
    assert.equal(selectActivityMedia("miss-circle")[0], webVoteDay2StoryVideo);
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

    const feed = createPortalFeed({
      now: new Date("2026-09-04T12:00:00+09:00"),
      newsItems: [item()],
      storyItems: [],
      eventItems: [],
    });
    const feedItem = findFeedItem(feed, portalNewsId(NEWS_ID));
    assert.equal(feedItem.sourceUrl, undefined);
    assert.ok(feedItem.image?.endsWith(PUBLIC_POSTER));
  });

  it("does not restate the vote window or invent the sticker target and bonus", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    assert.doesNotMatch(copy, /9月13日|9\/13|23:59|12:00/);
    assert.doesNotMatch(copy, /1日1回/);
    assert.doesNotMatch(copy, /liff\.line\.me|misscircle\.jp|instagram\.com/);
    assert.doesNotMatch(copy, /特典は|特典の内容は[^SなをここS]*[0-9]/);
    assert.match(entry.body, /確認できないため、ここには書きません/);
  });
});

describe("2026-09-04 Instagram Story 投票2日目 — published media", () => {
  it("publishes exactly one shared MP4 and one real-frame poster", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b59-"))
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

  it("keeps geometry and frames, drops the audio track, and uses faststart", async () => {
    const mp4 = path.join(galleryDirectory, PUBLIC_VIDEO);
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.equal(video.profile, "Constrained Baseline");
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(video.nb_frames, "269");
    assert.equal(Number(video.has_b_frames), 0);
    assert.ok(Math.abs(Number(info.format.duration) - 8.967) < 0.001);
    assert.equal(audio, undefined);
    assert.equal(info.format.nb_streams, 1);
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(info.chapters, []);
    assert.equal(video.tags?.creation_time, undefined);
    assert.equal(info.format.tags?.creation_time, undefined);
  });
});

describe("2026-09-04 Instagram Story 投票2日目 — privacy and scope", () => {
  it("does not create articles, milestones, events, schedules, or photo records", () => {
    const ids = new Set([NEWS_ID, MEDIA_ID]);

    assert.equal(
      stories.some((entry) => ids.has(entry.slug) || ids.has(entry.id)),
      false,
    );
    assert.equal(highlights.some((entry) => ids.has(entry.id)), false);
    assert.equal(events.some((entry) => ids.has(entry.id)), false);
    assert.equal(streamSchedule.some((entry) => ids.has(entry.id)), false);
    assert.equal(media.some((entry) => ids.has(entry.id)), false);
    // 9/4 の配信枠は本人配布タイムテーブル由来の既存データ。このStoryは枠を足さない。
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes("b59")),
      false,
    );
  });

  it("keeps the original and handoff identifiers out of tracked text", async () => {
    const forbidden = [
      /(?:^|\/)upload\//i,
      /drive\.google\.com/i,
      /[0-9A-F]{8}(?:-[0-9A-F]{4}){3}-[0-9A-F]{12}\.mp4/i,
      new RegExp(["016f", "6de0"].join(""), "i"),
      new RegExp(["9F6B", "37DA"].join(""), "i"),
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
    const start = ops.indexOf("### 2026-09-04 Instagram Story 投票2日目の呼びかけ（batch b59）");
    const end = ops.indexOf("### 2026-09-05 SHOWROOM 三次3日目の朝配信メモ");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);

    assert.match(docs, /batch b59/);
    assert.match(docs, /video-only/);
    assert.match(docs, /720×1280/);
    assert.match(docs, new RegExp(PUBLIC_VIDEO.replace(/\./g, "\\.")));
    assert.match(docs, new RegExp(PUBLIC_SHA256));
    assert.match(docs, new RegExp(POSTER_SHA256));
    assert.match(docs, /8\.5秒地点の実フレーム/);
    // source date はオーナーの明示確認による投稿日。画面の「2日目」からの逆算ではない。
    assert.match(docs, /オーナーが明示確認した投稿日/);
    assert.match(section, /オーナーが「9\/4の投稿を直後に受け取った」と/);
    assert.match(ops, /81件/);
    assert.match(ops, /独立動画30本/);
    assert.match(section, /video-only/);
    assert.match(section, /特典の内容・条件・付与方法は補わない/);
    assert.match(section, /sameDayOrder: 10/);
    assert.doesNotMatch(docs, /drive\.google\.com/);
    assert.doesNotMatch(section, /drive\.google\.com/);
  });
});
