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
  morningThanksVoteStoryVideo,
  visibleGalleryVideos,
  voteDayFiveSoonStoryVideo,
  webVoteDay2StoryVideo,
} from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import {
  campusGirlsPatonVoteLink,
  missCircleWebVoteLink,
} from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-20260909.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { missCircleThirdRoundWebVote } from "../src/data/supportEvents.ts";
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

const duringVote = Date.parse("2026-09-07T09:00:00+09:00");
const afterVote = Date.parse("2026-09-14T00:00:01+09:00");

/** b65-01: 9/6 夜「30分後5日目の投票できるよ」 / b65-02: 9/7 朝「5日目ポチッはこちらから」 */
const fixtures = [
  {
    newsId: "2026-09-06-third-round-vote-day5-soon-story",
    mediaId: "mily-b65-01-web-vote-day5-soon-story",
    item: voteDayFiveSoonStoryVideo,
    publicVideo: "mily-b65-01-web-vote-day5-soon-story.mp4",
    poster: "mily-b65-01-web-vote-day5-soon-story-poster.jpg",
    publicBytes: 556_992,
    publicSha256:
      "0704aa7e49426a5e676c408a544759349ef1e36472a22cd7427c1df8e9d5462d",
    posterBytes: 73_165,
    posterSha256:
      "87c45d3bcf3cd087a87985ad7deb93c2b51009a00bb81edbb880ea2cb5f1c07c",
    date: "2026-09-06",
    sameDayOrder: 50,
    activityIds: ["miss-circle"],
    title: "「30分後5日目の投票できるよ」4日目の投票も呼びかけ",
    body:
      "9月6日の夜、みりぃがInstagram Storyで、リンクスタンプに「30分後5日目の投票できるよ」と書いて投票を呼びかけました。あわせて「4日目まだの方はダッシュで上のリンクに飛んで投票お願いします〜」と添えています。リンク先はStoryの表示だけでは確認できないため、ここには書きません。くま耳とキラキラのフィルターをつけて、ピースサインをしている短い動画です。",
    message:
      "30分後5日目の投票できるよ\u{1F633}\u{1FA75}\n" +
      "4日目まだの方は\n" +
      "ダッシュで上のリンクに飛んで\n" +
      "投票お願いします〜\u{1F3C3}‍♀\u{FE0F}\u{1F4A8}\u{1F4A8}\u{1F4A8}",
    additionalCtas: [{ label: "WEB投票する", url: missCircleWebVoteLink.url }],
    activeCtas: [{ label: "WEB投票する", url: missCircleWebVoteLink.url }],
    expiredCtas: undefined,
  },
  {
    newsId: "2026-09-07-morning-thanks-vote-day5-story",
    mediaId: "mily-b65-02-morning-thanks-vote-day5-story",
    item: morningThanksVoteStoryVideo,
    publicVideo: "mily-b65-02-morning-thanks-vote-day5-story.mp4",
    poster: "mily-b65-02-morning-thanks-vote-day5-story-poster.jpg",
    publicBytes: 438_189,
    publicSha256:
      "f7b1147ea4dbfc9fd0599879d0bee22a123eb8ad050c23e8249dc03c7c34c211",
    posterBytes: 50_299,
    posterSha256:
      "96bc0b56a3362d1b0e84d5a5b708de8bebab713bcec0d03dea015e4dba08ab44",
    date: "2026-09-07",
    sameDayOrder: 5,
    activityIds: ["live-stream", "miss-circle"],
    title: "朝配信ありがとう、次枠は22:00〜。「5日目ポチッはこちらから」",
    body:
      "9月7日の朝、みりぃがInstagram Storyで、朝配信へのお礼と、次枠が22:00からであることを伝えました。あわせて、リンクスタンプに「5日目ポチッはこちらから」と書いて投票を呼びかけています。リンク先はStoryの表示だけでは確認できないため、ここには書きません。黒いトップスで、片目をつぶってピースサインをしている短い動画です。",
    message:
      "朝配信来てくれたみんなありがとう〜\u{1F484}✨\n" +
      "次枠は22:00〜\n" +
      "5日目ポチッはこちらから\u{1FA75}✨",
    additionalCtas: [
      { label: "WEB投票する", url: missCircleWebVoteLink.url },
      { label: "SHOWROOM", url: showroomRoom },
    ],
    activeCtas: [
      { label: "WEB投票する", url: missCircleWebVoteLink.url },
      { label: "SHOWROOM", url: showroomRoom },
    ],
    expiredCtas: [{ label: "SHOWROOM", url: showroomRoom }],
  },
];

function newsItem(id) {
  return news.find((entry) => entry.id === id);
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
    "scripts/instagram-stories-20260906-07-vote-day5.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/voteDayFiveSoonStoryVideo.json",
    "src/data/voteDayFiveSoonStoryVideo.ts",
    "src/data/morningThanksVoteStoryVideo.json",
    "src/data/morningThanksVoteStoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b65");
      assert.notEqual(start, -1);
      const end = text.indexOf("\n## ", start + 4);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-09-06〜07 Instagram Story 投票5日目 — Latest / NEWS", () => {
  it("adds two separately dated Story records in confirmed editorial order", () => {
    const ordered = sortNewsByDateDesc(news);
    const [night, morning] = fixtures;

    assert.equal(ordered[0]?.id, "2026-09-08-stream-thanks-morning-slot-story");
    assert.equal(ordered[1]?.id, "2026-09-07-mixch-ex-period-day1");
    assert.equal(ordered[2]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
    assert.equal(ordered[3]?.id, morning.newsId);
    assert.equal(ordered[4]?.id, night.newsId);
    assert.equal(ordered[5]?.id, "2026-09-06-stream-thanks-next-slots");
    assert.equal(ordered[6]?.id, "2026-09-06-campus-girls-prelim-final-result");
    assert.equal(ordered[7]?.id, "2026-09-06-night-slot-2230");
    // 本人X Mixch（9/7 21:14 JST）より後、本人X 本選EX案内（9/7 09:15 JST）より後、9/6の本人X配信お礼（23:22 JST）より後。
    assert.equal(news[3]?.id, morning.newsId);
    assert.equal(news[4]?.id, night.newsId);

    for (const fixture of fixtures) {
      const entry = newsItem(fixture.newsId);
      assert.ok(entry, fixture.newsId);
      assert.equal(news.filter(({ id }) => id === fixture.newsId).length, 1);
      assert.equal(entry.date, fixture.date);
      assert.equal(entry.sameDayOrder, fixture.sameDayOrder);
      assert.deepEqual(entry.activityIds, fixture.activityIds);
      assert.equal(entry.title, fixture.title);
      assert.equal(entry.body, fixture.body);
      assert.equal(entry.message?.label, "みりぃのStory");
      assert.equal(entry.message?.text, fixture.message);
      assert.equal(entry.additionalMedia, undefined);
      assert.equal(entry.additionalSources, undefined);
      assert.deepEqual(verifyNews([entry]), []);
    }
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps Story attribution non-link and gates the WEB vote CTA to its window", () => {
    assert.equal(missCircleThirdRoundWebVote.ctaLinkId, missCircleWebVoteLink.id);

    for (const fixture of fixtures) {
      const entry = newsItem(fixture.newsId);

      assert.equal(entry.source, undefined);
      assert.equal(entry.sourceLabel, "Instagram Story");
      assert.equal(entry.url, undefined);
      assert.equal(entry.relatedUrl, instagramProfile);
      assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
      assert.deepEqual(entry.additionalCtas, fixture.additionalCtas);
      assert.equal(
        JSON.stringify(entry).includes(campusGirlsPatonVoteLink.url),
        false,
      );

      assert.deepEqual(resolveNewsLinks(entry, duringVote), {
        relatedUrl: instagramProfile,
        cta: { label: "Instagramプロフィールを見る", url: instagramProfile },
        additionalCtas: fixture.activeCtas,
      });
      assert.deepEqual(resolveNewsLinks(entry, afterVote), {
        relatedUrl: instagramProfile,
        cta: { label: "Instagramプロフィールを見る", url: instagramProfile },
        ...(fixture.expiredCtas ? { additionalCtas: fixture.expiredCtas } : {}),
      });
    }
  });

  it("shares one manifest object per Story with Gallery, Activities, and Portal Feed", () => {
    const [night, morning] = fixtures;

    // 9/8 の b66 Story が先頭。b65 は 2〜3番目。
    assert.equal(galleryVideos[1], morning.item);
    assert.equal(galleryVideos[2], night.item);

    for (const fixture of fixtures) {
      const entry = newsItem(fixture.newsId);

      assert.equal(entry.media, fixture.item);
      assert.deepEqual(
        galleryVideos.filter(({ id }) => id === fixture.mediaId),
        [fixture.item],
      );
      assert.equal(
        visibleGalleryVideos().find(({ id }) => id === fixture.mediaId),
        fixture.item,
      );
      assert.equal(fixture.item.id, fixture.mediaId);
      assert.equal(fixture.item.kind, "video");
      assert.equal(fixture.item.provenance, "owner-provided");
      assert.equal(fixture.item.sourceLabel, "Instagram Story");
      assert.equal(fixture.item.sourceDate, fixture.date);
      assert.equal("sourceUrl" in fixture.item, false);
      assert.equal(fixture.item.published, true);
      assert.equal(fixture.item.width, 720);
      assert.equal(fixture.item.height, 1280);
      assert.equal(fixture.item.src, `/media/gallery/${fixture.publicVideo}`);
      assert.equal(fixture.item.poster, `/media/gallery/${fixture.poster}`);
      assert.match(fixture.item.alt, /縦型動画/);

      const entries = selectGalleryEntries().filter(({ key }) => key === fixture.mediaId);
      assert.equal(entries.length, 1);
      assert.equal(entries[0].kind, "video");
      assert.equal(entries[0].item.video.controls, true);
      assert.equal(entries[0].item.video.playsInline, true);
      assert.equal(entries[0].item.video.preload, "none");
    }

    const missNews = selectActivityNews("miss-circle", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    assert.equal(missNews[0]?.id, morning.newsId);
    assert.equal(missNews[1]?.id, night.newsId);
    assert.equal(missNews[2]?.id, "2026-09-04-third-round-vote-day2-story");
    assert.equal(liveNews[0]?.id, "2026-09-08-stream-thanks-morning-slot-story");
    assert.equal(liveNews[1]?.id, morning.newsId);
    assert.equal(liveNews[2]?.id, "2026-09-06-stream-thanks-next-slots");
    assert.equal(liveNews.some((entry) => entry.id === night.newsId), false);
    assert.equal(selectActivityMedia("miss-circle")[0], morning.item);
    assert.equal(selectActivityMedia("miss-circle")[1], night.item);
    assert.equal(selectActivityMedia("miss-circle")[2], webVoteDay2StoryVideo);
    assert.equal(selectActivityMedia("live-stream")[1], morning.item);
    assert.equal(
      selectActivityMedia("live-stream").some((candidate) => candidate.id === night.mediaId),
      false,
    );
    for (const activityId of ["campus-girls", "radio"]) {
      for (const fixture of fixtures) {
        assert.equal(
          selectActivityNews(activityId, news, news.length).some(
            (candidate) => candidate.id === fixture.newsId,
          ),
          false,
        );
        assert.equal(
          selectActivityMedia(activityId).some(
            (candidate) => candidate.id === fixture.mediaId,
          ),
          false,
        );
      }
    }

    const feed = createPortalFeed({
      now: new Date("2026-09-07T12:00:00+09:00"),
      newsItems: news,
      storyItems: [],
      eventItems: [],
    });
    assertPortalNewsFollowsSort(feed, news);
    for (const fixture of fixtures) {
      const feedItem = findFeedItem(feed, portalNewsId(fixture.newsId));
      assert.equal(feedItem.sourceUrl, undefined);
      assert.equal(feedItem.title, fixture.title);
      assert.ok(feedItem.image?.endsWith(fixture.poster));
    }
  });

  it("does not restate the vote window or invent the sticker target", () => {
    for (const fixture of fixtures) {
      const entry = newsItem(fixture.newsId);
      const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

      assert.doesNotMatch(copy, /9月13日|9\/13|23:59|12:00/);
      assert.doesNotMatch(copy, /1日1回/);
      assert.doesNotMatch(copy, /liff\.line\.me|misscircle\.jp|instagram\.com|showroom-live\.com/);
      assert.match(entry.body, /確認できないため、ここには書きません/);
    }
  });
});

describe("2026-09-06〜07 Instagram Story 投票5日目 — published media", () => {
  it("publishes exactly two shared MP4s and two real-frame posters", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b65-"))
      .sort();
    assert.deepEqual(
      assets,
      fixtures.flatMap(({ publicVideo, poster }) => [publicVideo, poster]).sort(),
    );

    for (const fixture of fixtures) {
      const mp4 = path.join(galleryDirectory, fixture.publicVideo);
      const poster = path.join(galleryDirectory, fixture.poster);
      assert.equal((await stat(mp4)).size, fixture.publicBytes);
      assert.equal(await sha256(mp4), fixture.publicSha256);
      assert.equal((await stat(poster)).size, fixture.posterBytes);
      assert.equal(await sha256(poster), fixture.posterSha256);

      const metadata = await sharp(poster).metadata();
      assert.equal(metadata.width, 720);
      assert.equal(metadata.height, 1280);
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.iptc, undefined);
      assert.equal(metadata.xmp, undefined);
      assert.equal(metadata.icc, undefined);
    }
  });

  it("remuxes the 1fps H.264 stream unchanged, drops the audio track, and uses faststart", async () => {
    for (const fixture of fixtures) {
      const mp4 = path.join(galleryDirectory, fixture.publicVideo);
      const info = await probe(mp4);
      const video = info.streams.find((stream) => stream.codec_type === "video");
      const audio = info.streams.find((stream) => stream.codec_type === "audio");

      assert.ok(video, fixture.publicVideo);
      assert.equal(video.codec_name, "h264");
      // `-c:v copy` のため元素材の High profile / 1fps / 20 frames をそのまま保持する。
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
    }
  });
});

describe("2026-09-06〜07 Instagram Story 投票5日目 — privacy and scope", () => {
  it("does not create articles, milestones, events, schedules, or photo records", () => {
    const ids = new Set(fixtures.flatMap(({ newsId, mediaId }) => [newsId, mediaId]));

    assert.equal(
      stories.some((entry) => ids.has(entry.slug) || ids.has(entry.id)),
      false,
    );
    assert.equal(highlights.some((entry) => ids.has(entry.id)), false);
    assert.equal(events.some((entry) => ids.has(entry.id)), false);
    assert.equal(media.some((entry) => ids.has(entry.id)), false);
    for (const { newsId } of fixtures) {
      assert.equal(existsSync(path.join(root, "stories", newsId)), false);
    }
    // 9/7 の 06:30 / 22:00 枠は本人X（9/6）由来の既存データ。Story は枠を足さない。
    assert.deepEqual(
      streamSchedule.filter((slot) => slot.date === "2026-09-07"),
      [
        { date: "2026-09-07", time: "06:30", endTime: "07:30" },
        { date: "2026-09-07", time: "22:00", endTime: "23:00" },
      ],
    );
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes("b65")),
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
    const start = ops.indexOf("### 2026-09-06〜07 Instagram Story 投票5日目の呼びかけ2本（batch b65）");
    assert.notEqual(start, -1);
    const section = ops.slice(start);

    assert.match(docs, /batch b65/);
    assert.match(docs, /video-only/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /-c:v copy/);
    for (const fixture of fixtures) {
      assert.match(docs, new RegExp(fixture.publicVideo.replace(/\./g, "\\.")));
      assert.match(docs, new RegExp(fixture.publicSha256));
      assert.match(docs, new RegExp(fixture.posterSha256));
    }
    assert.match(docs, /4\.0秒地点の実フレーム/);
    // source date は画面表示と元動画の container creation_time からの判断。オーナー確認待ちを明記する。
    assert.match(docs, /オーナーの明示確認/);
    assert.match(section, /オーナーの明示確認/);
    assert.match(ops, /85件/);
    assert.match(ops, /独立動画33本/);
    assert.match(section, /video-only/);
    assert.match(section, /sameDayOrder: 50/);
    assert.match(section, /sameDayOrder: 5/);
    assert.match(section, /2026-09-13 23:59 JST/);
    assert.doesNotMatch(docs, /drive\.google\.com/);
    assert.doesNotMatch(section, /drive\.google\.com/);
  });
});
