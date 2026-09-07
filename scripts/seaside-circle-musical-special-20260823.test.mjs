import assert from "node:assert/strict";
import { withoutApprovedSongLinks } from "./approved-song-links.mjs";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  galleryVideos,
  seasideCircleMusicalSpecialVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b41.ts";
import { events } from "../src/data/events.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import {
  stories,
  storyBySlug,
  storySources,
} from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityNews } from "./fixtures/activity-content-before-b41.ts";
import { isFaststart } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(
  galleryDirectory,
  "mily-b19-01-seaside-circle-musical-special.mp4",
);
const poster = path.join(
  galleryDirectory,
  "mily-b19-01-seaside-circle-musical-special-poster.jpg",
);
const original = path.join(
  root,
  "media/original/mily-b19-01-seaside-circle-musical-special.mp4",
);

const NEWS_ID = "2026-08-23-seaside-circle-musical-special";
const STORY_SLUG = "2026-08-23-musical-special";
const STORY_HREF = "/stories/2026-08-23-musical-special/";
const ALT =
  "スタジオでヘッドホンをつけた3人が映る、湘南シーサイドサークルのInstagram Story動画";
const POSTER_SECONDS = "8.0";
const ORIGINAL_SHA256 =
  "0595d245226140b6d2981d8ce4f4a9c3c0c5d8503136bf2ca5b99861f63d9b69";
const PUBLIC_MP4_SHA256 =
  "a50be82df9620b5f246f6d84c6bd64d48de981e1b462219eaf216c71ec6ecf4c";
const POSTER_SHA256 =
  "1f3516f15c70ff802231ccae56716400bd1d543c1bc998e6daf9e2413e26b0b5";
const DOCS_HOST_PATTERN = /docs\.google\.com/i;
const DRIVE_SHARE_QUERY_PATTERN = new RegExp(["usp=", "drivesdk"].join(""), "i");
const DRIVE_FILE_PATH_PATTERN = /\/file\/d\//i;
const TRANSFER_PATH_PATTERN = /\/mnt\/data|\/exec-daemon\//i;
const YOUTUBE_ARCHIVE_PATTERN = new RegExp(
  ["youtu", ".be/", "y065", "xWn"].join("") + "|" + ["youtube", ".com/", "watch"].join(""),
  "i",
);
const STORY_PERMALINK_PATTERN = /instagram\.com\/stories\//i;
const PERSONAL_STORY_LABEL = /本人Instagram Story|みりぃのInstagram Story|@mily_chan36 のInstagram Story/;
const LISTENER_PATTERN = new RegExp(
  ["ラジオ", "ネーム"].join("") + "|" + ["アッ", "キー"].join("") + "|" + ["藤", "奈"].join(""),
);
const RAW_TRANSCRIPT_MARKERS = [
  "0:00:00",
  "[0:02:38]",
  "水騒がく",
  "シミズミー社",
];

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

function story() {
  return storyBySlug(STORY_SLUG);
}

function storyText(entry) {
  return [
    entry.title,
    entry.cardTitle,
    entry.lead,
    entry.cardDescription,
    ...entry.sections.flatMap((section) => [
      section.title,
      ...section.blocks.flatMap((block) =>
        block.type === "paragraph"
          ? [block.text]
          : block.type === "quote"
            ? block.paragraphs
            : [],
      ),
    ]),
  ].join("\n");
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function probe(file) {
  const ffprobe = await ffprobeExe();
  const { stdout } = await run(ffprobe, [
    "-hide_banner", "-v", "error",
    "-show_format", "-show_streams", "-show_chapters",
    "-print_format", "json", file,
  ]);
  return JSON.parse(stdout);
}

async function committableFiles() {
  const { stdout } = await run(
    "git",
    ["ls-files", "-co", "--exclude-standard"],
    { cwd: root, maxBuffer: 1024 * 1024 * 16 },
  );
  return stdout.split("\n").filter(Boolean);
}

describe("2026-08-23 seaside circle musical special — NEWS", () => {
  it("adds one 8/23 radio NEWS with the shared video and STORY CTA", () => {
    const matches = news.filter((entry) => entry.id === NEWS_ID);
    const entry = item();

    assert.equal(matches.length, 1);
    assert.equal(entry?.date, "2026-08-23");
    assert.equal(entry?.sameDayOrder, 4);
    assert.deepEqual(entry?.activityIds, ["radio"]);
    assert.equal(entry?.title, "真夏のミュージカル特集🎭 清水美依紗さんを迎えた生放送");
    assert.doesNotMatch(entry?.title ?? "", /迎えた3時間|語った3時間/);
    assert.match(entry?.body ?? "", /清水美依紗さん/);
    assert.match(entry?.body ?? "", /グレイテスト・ショーマン/);
    assert.match(entry?.body ?? "", /This Is Me/);
    assert.equal(entry?.source, "https://x.com/fm_smw856/status/2091499993102524714");
    assert.equal(entry?.sourceLabel, "FM湘南マジックウェイブの放送後投稿を見る");
    assert.equal(entry?.url, STORY_HREF);
    assert.equal(entry?.ctaLabel, "真夏のミュージカル特集の放送記録を読む");
    assert.equal(entry?.media?.kind, "video");
    assert.equal(entry?.media?.src.includes("mily-b21-01-seaside-circle-musical-special-thanks"), true);
    assert.notEqual(entry?.media, seasideCircleMusicalSpecialVideo);
    assert.notEqual(entry?.media?.src, seasideCircleMusicalSpecialVideo.src);
    assert.equal(news.length, 49);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("places the broadcast NEWS above the earlier 8/23 Fan Room items", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night")).map((entry) => entry.id);
    assert.equal(ordered[0], "2026-08-26-girlsaward-showroom-6th");
    assert.equal(ordered[1], "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2], "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3], "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4], "2026-08-26-girl-award-event-fanroom");
    assert.equal(ordered[5], "2026-08-26-mixch-15x-day");
    assert.equal(ordered[6], "2026-08-26-stream-1000");
    assert.equal(ordered[7], "2026-08-25-mixch-confidence-message");
    assert.equal(ordered[8], "2026-08-25-motivation");
    assert.equal(ordered[9], "2026-08-24-seasidecircle-yes-tokyo");
    assert.equal(ordered[10], "2026-08-24-campus-girls-final-stage-guide");
    assert.equal(ordered[11], "2026-08-24-makeup-stream");
    assert.equal(ordered[12], "2026-08-24-night-thanks-morning-stream");
    assert.equal(ordered[13], "2026-08-23-dragon-cloud");
    assert.equal(ordered[14], NEWS_ID);
    assert.equal(ordered[15], "2026-08-23-morning-showroom-fanroom");
    assert.equal(ordered[16], "2026-08-23-early-showroom-fanroom");
    assert.equal(ordered[17], "2026-08-23-earthquake-showroom-fanroom");
    assert.equal(ordered[18], "2026-08-22-night-showroom-thanks");
  });

  it("appears as related NEWS on the radio Activity without a copied body", () => {
    const priorRadioNews = news.filter(
      (entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story",
    );
    const radioNews = selectActivityNews("radio", priorRadioNews, priorRadioNews.length);
    assert.equal(radioNews[2]?.id, NEWS_ID);
    assert.equal(radioNews.some((entry) => entry.id === NEWS_ID), true);
    assert.equal(
      radioNews.filter((entry) => entry.id === NEWS_ID).length,
      1,
    );
  });
});

describe("2026-08-23 seaside circle musical special — STORY", () => {
  it("publishes the broadcast record on the existing STORY route", () => {
    const entry = story();
    assert.ok(entry);
    assert.equal(entry.published, true);
    assert.equal(entry.href, STORY_HREF);
    assert.equal(entry.date, "2026-08-23");
    assert.equal(entry.dateLabel, "2026.08.23");
    assert.equal(entry.badge, "RADIO");
    assert.equal(entry.eyebrow, "湘南シーサイドサークル｜放送記録");
    assert.equal(
      entry.title,
      "2026.08.23 湘南シーサイドサークル｜真夏のミュージカル特集 放送記録",
    );
    assert.equal(
      entry.cardTitle,
      "真夏のミュージカル特集｜清水美依紗さんを迎えた特別回",
    );
    assert.doesNotMatch(entry.cardTitle, /迎えた3時間|語った3時間/);
    assert.equal(entry.leadMediaId, "seaside-circle-musical-special-story");
    assert.deepEqual(entry.sourceIds, [
      "broadcast-transcript-2026-08-23",
      "program-instagram-story-2026-08-23",
      "program-instagram-story-thanks-2026-08-23",
      "fm-smw-x-2026-08-23-musical-special-before",
      "fm-smw-x-2026-08-23-musical-special-after",
    ]);
    assert.equal(
      storySources["broadcast-transcript-2026-08-23"].label,
      "2026年8月23日 湘南シーサイドサークル 生放送アーカイブ文字起こし（オーナー提供）",
    );
    assert.equal(
      storySources["program-instagram-story-2026-08-23"].label,
      "湘南シーサイドサークル Instagram Story（2026年8月23日）",
    );
    assert.equal(
      storySources["program-instagram-story-thanks-2026-08-23"].label,
      "湘南シーサイドサークル Instagram Story（清水美依紗さん出演お礼 / 2026年8月23日）",
    );
    assert.equal("url" in storySources["broadcast-transcript-2026-08-23"], false);
    assert.equal("url" in storySources["program-instagram-story-2026-08-23"], false);
    assert.equal("url" in storySources["program-instagram-story-thanks-2026-08-23"], false);
    assert.equal(stories[1], entry);
    assert.equal(stories[0]?.slug, "2026-08-25-motivation");
    assert.equal(storyBySlug("2026-08-18-radio")?.published, true);
    assert.equal(storyBySlug("second-round-result-2026")?.published, true);
  });

  it("uses the same MP4 and poster as Gallery for the lead video", () => {
    const entry = story();
    const lead = entry?.media.find(
      (media) => media.id === "seaside-circle-musical-special-story",
    );

    assert.equal(lead?.kind, "video");
    assert.equal(lead?.src, seasideCircleMusicalSpecialVideo.src);
    assert.equal(lead?.poster, seasideCircleMusicalSpecialVideo.poster);
    assert.equal(lead?.width, 720);
    assert.equal(lead?.height, 1280);
    assert.equal(lead?.label, ALT);
    assert.equal(entry?.leadMediaId, "seaside-circle-musical-special-story");
    assert.equal(
      galleryVideos.filter((video) => video.src === lead?.src).length,
      1,
    );
    assert.equal(
      news.filter((entry) => entry.media?.src === lead?.src).length,
      0,
    );
  });

  it("summarizes the broadcast and keeps みりぃ's own words without a raw transcript", () => {
    const text = storyText(story());

    assert.match(text, /真夏のミュージカル特集/);
    assert.match(text, /清水美依紗さん/);
    assert.match(text, /大学3年生/);
    assert.match(text, /グレイテスト・ショーマン/);
    assert.match(text, /This Is Me/);
    assert.match(text, /吹奏楽/);
    assert.match(text, /やりたいことを人に言ってみること/);
    assert.match(text, /エポニーヌ/);
    assert.match(text, /On My Own/);
    assert.match(text, /次回テーマは「映画」/);
    assert.doesNotMatch(text, LISTENER_PATTERN);
    for (const marker of RAW_TRANSCRIPT_MARKERS) {
      assert.equal(text.includes(marker), false, marker);
    }
    assert.doesNotMatch(text, /人生が変わった|決意した/);
    assert.doesNotMatch(text, PERSONAL_STORY_LABEL);
  });
});

describe("2026-08-23 seaside circle musical special — Gallery and assets", () => {
  it("shares one published Gallery video object", () => {
    assert.equal(galleryVideos[7], seasideCircleMusicalSpecialVideo);
    assert.equal(visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5")[5], seasideCircleMusicalSpecialVideo);
    assert.equal(seasideCircleMusicalSpecialVideo.published, true);
    assert.equal(seasideCircleMusicalSpecialVideo.provenance, "owner-provided");
    assert.equal(
      seasideCircleMusicalSpecialVideo.sourceLabel,
      "湘南シーサイドサークル Instagram Story",
    );
    assert.equal(seasideCircleMusicalSpecialVideo.sourceDate, "2026-08-23");
    assert.equal(seasideCircleMusicalSpecialVideo.alt, ALT);
    assert.equal("sourceUrl" in seasideCircleMusicalSpecialVideo, false);
    assert.equal(galleryVideos.length, 20);
    assert.equal(events.length, 0);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b19-01-seaside-circle-musical-special"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b19-01-seaside-circle-musical-special-poster.jpg",
      "media/gallery/mily-b19-01-seaside-circle-musical-special.mp4",
    ]);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
    assert.equal(
      existsSync(path.join(root, "public/media/news/mily-b19-01-seaside-circle-musical-special.mp4")),
      false,
    );
    assert.equal(
      existsSync(path.join(root, "public/media/stories/2026-08-23-musical-special/mily-b19-01-seaside-circle-musical-special.mp4")),
      false,
    );
  });

  it("keeps H.264 / AAC, source dimensions, faststart, and stripped metadata", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");
    const mp4Bytes = await readFile(mp4);

    assert.ok(video);
    assert.ok(audio);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(video.nb_frames, "571");
    assert.ok(
      Math.abs(Number(video.duration) - 19.033) < 0.01,
      `duration ${video.duration}`,
    );
    assert.equal(audio.codec_name, "aac");
    assert.equal(info.chapters?.length ?? 0, 0);
    assert.equal(createHash("sha256").update(mp4Bytes).digest("hex"), PUBLIC_MP4_SHA256);
    assert.equal(await isFaststart(mp4), true);
    assert.equal(info.format.tags?.creation_time, undefined);
    assert.doesNotMatch(JSON.stringify(info), /Core Media/);

    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");
      const sourceBytes = await readFile(original);
      assert.equal(sourceBytes.length, 7286091);
      assert.equal(
        createHash("sha256").update(sourceBytes).digest("hex"),
        ORIGINAL_SHA256,
      );
      assert.equal(sourceVideo?.width, 720);
      assert.equal(sourceVideo?.height, 1280);
      assert.equal(sourceVideo?.nb_frames, "571");
    }
  });

  it("uses an 8.0s real frame poster without privacy metadata", async () => {
    const posterBytes = await readFile(poster);
    const metadata = await sharp(poster).metadata();

    assert.equal(createHash("sha256").update(posterBytes).digest("hex"), POSTER_SHA256);
    assert.equal(metadata.width, 720);
    assert.equal(metadata.height, 1280);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(POSTER_SECONDS, "8.0");
  });
});

describe("2026-08-23 seaside circle musical special — privacy and routing", () => {
  it("does not publish Drive URLs, transfer paths, or invented Story permalinks", async () => {
    const published = [
      "src/data/news.ts",
      "src/data/stories.ts",
      "src/data/galleryVideos.ts",
      "src/data/activities.ts",
      "src/data/site.ts",
      "src/data/seasideCircleMusicalSpecialVideo.ts",
      "src/data/seasideCircleMusicalSpecialVideo.json",
      "stories/2026-08-23-musical-special/index.html",
      "docs/CONTENT-OPS.md",
      "docs/MEDIA.md",
      "public/sitemap.xml",
    ];
    const forbidden = [
      DOCS_HOST_PATTERN,
      DRIVE_HOST_PATTERN,
      DRIVE_SHARE_QUERY_PATTERN,
      DRIVE_FILE_PATH_PATTERN,
      TRANSFER_PATH_PATTERN,
      YOUTUBE_ARCHIVE_PATTERN,
      STORY_PERMALINK_PATTERN,
    ];

    for (const relative of published) {
      const text = await readFile(path.join(root, relative), "utf8");
      for (const pattern of forbidden) {
        const checkedText = relative === "docs/CONTENT-OPS.md" && pattern === YOUTUBE_ARCHIVE_PATTERN
          ? withoutApprovedSongLinks(text) : text;
        assert.equal(pattern.test(checkedText), false, `${relative} ${pattern}`);
      }
      assert.equal(findDriveIds(text).length, 0, relative);
    }

    for (const relative of [
      "src/data/seasideCircleMusicalSpecialVideo.ts",
      "src/data/seasideCircleMusicalSpecialVideo.json",
      "stories/2026-08-23-musical-special/index.html",
    ]) {
      const text = await readFile(path.join(root, relative), "utf8");
      assert.equal(PERSONAL_STORY_LABEL.test(text), false, relative);
      assert.equal(LISTENER_PATTERN.test(text), false, relative);
    }

    const files = await committableFiles();
    assert.equal(
      files.some((file) => file.startsWith("media/original/") && file.endsWith(".mp4")),
      false,
    );
  });

  it("registers the existing STORY routing pattern and overflow-safe video classes", async () => {
    const vite = await readFile(path.join(root, "vite.config.ts"), "utf8");
    const html = await readFile(
      path.join(root, "stories/2026-08-23-musical-special/index.html"),
      "utf8",
    );
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const storyPage = await readFile(path.join(root, "src/StoryPage.tsx"), "utf8");
    const gallery = await readFile(path.join(root, "src/components/Gallery.tsx"), "utf8");
    const sitemap = await readFile(path.join(root, "public/sitemap.xml"), "utf8");

    assert.match(
      vite,
      /storySeasideMusical:[\s\S]*"stories\/2026-08-23-musical-special\/index\.html"/,
    );
    assert.match(vite, /storyUrl\("2026-08-23-musical-special"\)/);
    assert.match(html, /src="\/src\/story-main\.tsx"/);
    assert.match(html, /rel="canonical" href="__STORY_2026_08_23_MUSICAL_SPECIAL_CANONICAL__"/);
    assert.match(html, /"@type": "Article"/);
    assert.match(sitemap, /\/stories\/2026-08-23-musical-special\//);
    assert.match(latest, /aspect-\[9\/16\].*max-w-sm/);
    assert.match(latest, /object-contain/);
    assert.match(latest, /controls/);
    assert.match(latest, /playsInline/);
    assert.match(storyPage, /overflow-x-hidden/);
    assert.match(storyPage, /aspect-\[9\/16\].*max-h-\[78vh\]/);
    assert.match(storyPage, /object-contain/);
    assert.match(gallery, /object-contain|aspect-\[9\/16\]/);
    assert.doesNotMatch(latest, /autoPlay/);
    assert.doesNotMatch(storyPage, /autoPlay/);
  });
});
