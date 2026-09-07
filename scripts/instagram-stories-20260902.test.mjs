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
  oyasumilyStoryVideo,
  patonSecondStoryVideo,
  patonVoteFinalDayStoryVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b58.ts";
import { highlights } from "../src/data/highlights.ts";
import { campusGirlsPatonVoteLink } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { campusGirlsFinalStageRankingStoryVideos } from "../src/data/campusGirlsFinalStageStorySeries.ts";
import { contest } from "../src/data/contest.ts";
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
const showroomRoom = "https://www.showroom-live.com/r/circle2026_0734";
const afterVote = Date.parse("2026-09-02T00:30:00+09:00");

const OYASUMILY_NEWS_ID = "2026-09-02-oyasumily-sr-story";
const PATON_SECOND_NEWS_ID = "2026-09-02-paton-second-story";

const OYASUMILY_MESSAGE =
  "明日は\n" +
  "9:00～SR配信‼️\n" +
  "(私にしては珍しい時間🫣💭)\n" +
  "待ってるね～♪\n" +
  "おやすみりぃ";

const PATON_SECOND_MESSAGE =
  "パトン投票 🗳️\n" +
  "皆さんが協力して下さったおかげで2位🥈で締めることができました！\n" +
  "ありがとうございます😭🙏❣️\n" +
  "面接頑張ってくるねっ^_^";

const fixtures = [
  {
    newsId: OYASUMILY_NEWS_ID,
    item: oyasumilyStoryVideo,
    publicVideo: "mily-b47-01-oyasumily.mp4",
    poster: "mily-b47-01-oyasumily-poster.jpg",
    publicBytes: 6_394_851,
    publicSha256:
      "3650d5e6f11e7343e61478aa69c5ce015dd05301e1f5f4870c837e5570b1b059",
    posterBytes: 65_079,
    posterSha256:
      "f9c928a81261acd479f4ebd19d7b244b8bad8eb83bf8338e6631f90e859128b0",
    sourceDate: "2026-09-02",
    width: 720,
    height: 1280,
    avgFrameRate: "20/1",
    nbFrames: "120",
    duration: 6,
    activityIds: ["live-stream"],
  },
  {
    newsId: PATON_SECOND_NEWS_ID,
    item: patonSecondStoryVideo,
    publicVideo: "mily-b47-02-paton-second.mp4",
    poster: "mily-b47-02-paton-second-poster.jpg",
    publicBytes: 9_573_726,
    publicSha256:
      "492198f87ff18a8d35d5aa006f5cde13d67d73064477f3de6cd0f1e086e2ac8c",
    posterBytes: 96_954,
    posterSha256:
      "4d366982e976c7a321413255a127d6d59dcea8d42e0b8f8644a665afcfcd6810",
    sourceDate: "2026-09-02",
    width: 720,
    height: 1280,
    avgFrameRate: "30/1",
    nbFrames: "600",
    duration: 20,
    activityIds: ["campus-girls"],
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
    "scripts/fixtures/news-before-b41.ts",
    "scripts/instagram-stories-20260902.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/oyasumilyStoryVideo.json",
    "src/data/oyasumilyStoryVideo.ts",
    "src/data/patonSecondStoryVideo.json",
    "src/data/patonSecondStoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b47");
      const end = text.indexOf("\n## ", start + 4);
      assert.notEqual(start, -1);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-09-02 Instagram Story — Latest / NEWS", () => {
  it("adds two records in confirmed editorial order at the front of Latest", () => {
    const ordered = sortNewsByDateDesc(news);
    const oyasumily = newsItem(OYASUMILY_NEWS_ID);
    const patonSecond = newsItem(PATON_SECOND_NEWS_ID);

    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(ordered[2], oyasumily);
    assert.equal(ordered[3], patonSecond);
    assert.equal(ordered[4]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(ordered[5], newsItem("2026-09-01-ohayo-september-x"));
    assert.equal(oyasumily?.sameDayOrder, 2);
    assert.equal(patonSecond?.sameDayOrder, 1);
    assert.deepEqual(oyasumily?.activityIds, ["live-stream"]);
    assert.deepEqual(patonSecond?.activityIds, ["campus-girls"]);
    assert.equal(news.filter(({ id }) => id === OYASUMILY_NEWS_ID).length, 1);
    assert.equal(news.filter(({ id }) => id === PATON_SECOND_NEWS_ID).length, 1);
    assert.equal(news.length, 75);
    assert.deepEqual(verifyNews([oyasumily, patonSecond]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps Story attribution non-link, SHOWROOM extra CTA, and no Paton vote button", () => {
    const oyasumily = newsItem(OYASUMILY_NEWS_ID);
    const patonSecond = newsItem(PATON_SECOND_NEWS_ID);

    for (const entry of [oyasumily, patonSecond]) {
      assert.ok(entry);
      assert.equal(entry.source, undefined);
      assert.equal(entry.sourceLabel, "Instagram Story");
      assert.equal(entry.url, undefined);
      assert.equal(entry.relatedUrl, instagramProfile);
      assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
      assert.equal(JSON.stringify(entry).includes(campusGirlsPatonVoteLink.url), false);
    }

    assert.deepEqual(oyasumily.additionalCtas, [
      { label: "SHOWROOM", url: showroomRoom },
    ]);
    assert.equal(oyasumily.additionalCtas[0].url.includes("?t="), false);
    assert.equal(patonSecond.additionalCtas, undefined);

    assert.deepEqual(resolveNewsLinks(oyasumily, afterVote), {
      relatedUrl: instagramProfile,
      cta: {
        label: "Instagramプロフィールを見る",
        url: instagramProfile,
      },
      additionalCtas: [{ label: "SHOWROOM", url: showroomRoom }],
    });
    assert.deepEqual(resolveNewsLinks(patonSecond, afterVote), {
      relatedUrl: instagramProfile,
      cta: {
        label: "Instagramプロフィールを見る",
        url: instagramProfile,
      },
    });
  });

  it("shares one manifest object per published Story with Gallery and Portal Feed", () => {
    assert.equal(visibleGalleryVideos()[0], oyasumilyStoryVideo);
    assert.equal(visibleGalleryVideos()[1], patonSecondStoryVideo);
    assert.equal(visibleGalleryVideos()[2], patonVoteFinalDayStoryVideo);
    assert.equal(galleryVideos.length, 32);

    for (const fixture of fixtures) {
      const entry = newsItem(fixture.newsId);
      assert.equal(entry?.media, fixture.item);
      assert.equal(
        galleryVideos.find(({ id }) => id === fixture.item.id),
        fixture.item,
      );
      assert.equal(fixture.item.sourceLabel, "Instagram Story");
      assert.equal(fixture.item.sourceDate, fixture.sourceDate);
      assert.equal("sourceUrl" in fixture.item, false);
      assert.equal(fixture.item.published, true);
      assert.equal(fixture.item.provenance, "owner-provided");
      assert.equal(fixture.item.width, 720);
      assert.equal(fixture.item.height, 1280);

      const feed = createPortalFeed({
        now: new Date(`${fixture.sourceDate}T12:00:00+09:00`),
        newsItems: [entry],
        storyItems: [],
        eventItems: [],
      });
      const feedItem = findFeedItem(feed, portalNewsId(fixture.newsId));
      assert.equal(feedItem.sourceUrl, undefined);
      assert.ok(feedItem.image?.endsWith(fixture.item.poster));
    }
  });

  it("surfaces each Story on the matching Activity only", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);

    assert.equal(liveNews[0]?.id, OYASUMILY_NEWS_ID);
    assert.equal(campusNews[0]?.id, PATON_SECOND_NEWS_ID);
    assert.equal(selectActivityMedia("live-stream")[0], oyasumilyStoryVideo);
    assert.equal(selectActivityMedia("campus-girls")[1]?.id, "mily-b63-01-campus-girls-prelim-final-result");
    assert.equal(selectActivityMedia("campus-girls")[2], patonSecondStoryVideo);
    assert.equal(campusNews.some((entry) => entry.id === OYASUMILY_NEWS_ID), false);
    assert.equal(liveNews.some((entry) => entry.id === PATON_SECOND_NEWS_ID), false);
    assert.equal(radioNews.some((entry) => entry.id === OYASUMILY_NEWS_ID), false);
    assert.equal(radioNews.some((entry) => entry.id === PATON_SECOND_NEWS_ID), false);
    assert.equal(missNews.some((entry) => entry.id === OYASUMILY_NEWS_ID), false);
    assert.equal(missNews.some((entry) => entry.id === PATON_SECOND_NEWS_ID), false);
  });

  it("keeps the overlay text exact and does not invent a schedule or interview", () => {
    const oyasumily = newsItem(OYASUMILY_NEWS_ID);
    const patonSecond = newsItem(PATON_SECOND_NEWS_ID);

    assert.equal(oyasumily.title, "「おやすみりぃ」翌日9:00からSHOWROOM配信");
    assert.equal(
      oyasumily.body,
      "9月2日未明、みりぃがInstagram Storyで、おやすみのあいさつとともに翌日9:00からのSHOWROOM配信を案内しました。「私にしては珍しい時間」と添えています。",
    );
    assert.equal(oyasumily.message.label, "みりぃのStory");
    assert.equal(oyasumily.message.text, OYASUMILY_MESSAGE);

    assert.equal(patonSecond.title, "パトン投票を2位で終え、応援に感謝");
    assert.equal(
      patonSecond.body,
      "みりぃがInstagram Storyで、Paton投票を2位で終えたことを報告し、応援への感謝を伝えました。投稿時点の表示は144,550pt。あわせて、面接に向けた意気込みもつづっています。",
    );
    assert.equal(patonSecond.message.label, "みりぃのStory");
    assert.equal(patonSecond.message.text, PATON_SECOND_MESSAGE);

    const copy = `${oyasumily.title}\n${oyasumily.body}\n${patonSecond.title}\n${patonSecond.body}`;
    assert.doesNotMatch(copy, /黒咲|くろえ|suzu/i);
    assert.doesNotMatch(copy, /面接.*(会場|場所|日時|日付)/);
    assert.equal(events.length, 0);
    assert.equal(
      streamSchedule.some((entry) => entry.date === "2026-09-02"),
      false,
    );
  });
});

describe("2026-09-02 Instagram Story — published media", () => {
  it("publishes exactly two shared MP4s and two real-frame posters", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b47-"))
      .sort();
    assert.deepEqual(
      assets,
      fixtures.flatMap(({ poster, publicVideo }) => [poster, publicVideo]).sort(),
    );

    for (const fixture of fixtures) {
      const mp4 = path.join(galleryDirectory, fixture.publicVideo);
      const poster = path.join(galleryDirectory, fixture.poster);
      assert.equal((await stat(mp4)).size, fixture.publicBytes);
      assert.equal(await sha256(mp4), fixture.publicSha256);
      assert.equal((await stat(poster)).size, fixture.posterBytes);
      assert.equal(await sha256(poster), fixture.posterSha256);

      const metadata = await sharp(poster).metadata();
      assert.equal(metadata.width, fixture.width);
      assert.equal(metadata.height, fixture.height);
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.iptc, undefined);
      assert.equal(metadata.xmp, undefined);
      assert.equal(metadata.icc, undefined);
    }
  });

  it("keeps geometry and frames, stays video-only, and uses faststart", async () => {
    for (const fixture of fixtures) {
      const mp4 = path.join(galleryDirectory, fixture.publicVideo);
      const info = await probe(mp4);
      const video = info.streams.find((stream) => stream.codec_type === "video");
      const audio = info.streams.find((stream) => stream.codec_type === "audio");

      assert.ok(video);
      assert.equal(video.codec_name, "h264");
      assert.equal(video.pix_fmt, "yuv420p");
      assert.equal(video.width, fixture.width);
      assert.equal(video.height, fixture.height);
      assert.equal(video.avg_frame_rate, fixture.avgFrameRate);
      assert.equal(video.nb_frames, fixture.nbFrames);
      assert.ok(Math.abs(Number(info.format.duration) - fixture.duration) < 0.001);
      assert.equal(audio, undefined);
      assert.equal(await isFaststart(mp4), true);
      assert.deepEqual(info.chapters, []);
    }
  });
});

describe("2026-09-02 Instagram Story — privacy and scope", () => {
  it("does not create articles, milestones, events, manual schedules, or photo records", () => {
    const ids = new Set([
      ...fixtures.map(({ item }) => item.id),
      OYASUMILY_NEWS_ID,
      PATON_SECOND_NEWS_ID,
    ]);
    assert.equal(stories.some((entry) => ids.has(entry.slug) || ids.has(entry.id)), false);
    assert.equal(highlights.some((entry) => ids.has(entry.id)), false);
    assert.equal(events.some((entry) => ids.has(entry.id)), false);
    assert.equal(streamSchedule.some((entry) => ids.has(entry.id)), false);
    assert.equal(media.some((entry) => ids.has(entry.id)), false);
    assert.equal(
      campusGirlsFinalStageRankingStoryVideos.some((entry) => ids.has(entry.id)),
      false,
    );
    assert.equal(contest.currentPhase.name.includes("2位"), false);
  });

  it("keeps handoff identifiers and Drive URLs out of tracked text", async () => {
    const files = await changedText();
    const forbidden = [
      /(?:^|\/)upload\//i,
      /drive\.google\.com/i,
      /[0-9A-F]{8}(?:-[0-9A-F]{4}){3}-[0-9A-F]{12}\.mp4/i,
      new RegExp(["4020", "620A"].join(""), "i"),
      new RegExp(["14A8", "FD3A"].join(""), "i"),
    ];

    for (const { file, text } of files) {
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

  it("documents the video-only public derivatives and omitted vote CTA", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("### 2026-09-02 Instagram Story おやすみりぃ・パトン2位");
    const end = ops.indexOf("### 2026-09-01 本人X おはよ〜 今日から9月ー");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);

    assert.match(docs, /batch b47/);
    assert.match(docs, /video-only/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /mily-b47-01-oyasumily\.mp4/);
    assert.match(docs, /mily-b47-02-paton-second\.mp4/);
    assert.match(docs, /3650d5e6f11e7343e61478aa69c5ce015dd05301e1f5f4870c837e5570b1b059/);
    assert.match(ops, /72件/);
    assert.match(ops, /独立動画28本/);
    assert.match(section, /Paton 2位NEWSには投票CTAを付けない/);
    assert.match(section, /streamSchedule \/ events には転記しない/);
    assert.match(section, /sameDayOrder: 2/);
    assert.doesNotMatch(docs, /drive\.google\.com/);
    assert.doesNotMatch(section, /drive\.google\.com/);
  });
});
