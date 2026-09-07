import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { open, readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  driveGallerySections,
  driveVideoView,
  visibleDriveGallery,
} from "../src/data/driveGallery.ts";
import { events } from "../src/data/events.ts";
import {
  galleryVideos,
  isSelfHostedGalleryVideo,
  mixchFinalDayMovie,
  morningStoryVideo,
  tiktokRadioVideo,
  tiktokSayonaraIchigoVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b58.ts";
import { highlights } from "../src/data/highlights.ts";
import { isMixchMovie } from "../src/data/mixchMovies.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
  isProbablyBinary,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(galleryDirectory, "mily-b37-01-tiktok-sayonara-ichigo.mp4");
const poster = path.join(
  galleryDirectory,
  "mily-b37-01-tiktok-sayonara-ichigo-poster.jpg",
);
const original = path.join(
  root,
  "media/original",
  "mily-b37-01-tiktok-sayonara-ichigo.mp4",
);

const NEWS_ID = "2026-04-23-tiktok-sayonara-ichigo";
const SOURCE = "https://www.tiktok.com/@seasidecircle/video/7631929037195185429";
const TITLE = "「さよならいちごちゃん」で踊ってみた🍓";
const BODY =
  "4月23日、湘南シーサイドサークルのTikTokに、みりぃが「さよならいちごちゃん」に合わせて踊る動画が投稿されました。フルで聴くと考えさせられることが多く、好きな曲だと綴っています。";
const MESSAGE =
  "この曲のフル、考えさせられること多くて\n" +
  "好きなんだよね^_^\n" +
  "『君の頭がいちごでできてるってこと🍓』\n" +
  "💞♬ #さよならいちごちゃん #fyp #踊ってみた";
const ALT =
  "室内でカメラに向かい、「さよならいちごちゃん」に合わせて表情豊かに踊る、みりぃの縦型動画";
const ORIGINAL_SHA256 =
  "d8ceee63da463ea94a6e953e611bcfcf9a08672cb390113484067f77ee48a988";
const PUBLIC_MP4_SHA256 =
  "eabb223c5ed5bb7e89b1b72c1787f873e06e4d1c7de64c3c8bb0161da4c8c5f8";
const POSTER_SHA256 =
  "42afb6e3ffc507ac3c03d4d81ba4699e25b0d090ccf14a7ca2011edd3b40a35c";
const POSTER_SECONDS = "2.4";
const PRIVATE_HANDOFF_KEY_PATTERN =
  /^(?:handoff(?:Url|Id)?|driveFileId|original(?:File)?Name|sourceFileName)$/i;
const SOURCE_METADATA_FILE_PATTERN =
  /(?:https?:\/\/|drive\.(?:google|usercontent\.google)\.com|media[\\/]original[\\/]|\.(?:mp4|mov|m4v|zip)\b)/i;

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function ffmpegExe() {
  const mod = await import("ffmpeg-static");
  return mod.default ?? mod;
}

async function probe(file) {
  const ffprobe = await ffprobeExe();
  const { stdout } = await run(ffprobe, [
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

async function repositoryFiles() {
  const { stdout } = await run(
    "git",
    ["ls-files", "-co", "--exclude-standard"],
    { cwd: root, maxBuffer: 1024 * 1024 * 16 },
  );
  return stdout.split("\n").filter(Boolean);
}

describe("2026-04-23 TikTok sayonara-ichigo post — Latest", () => {
  it("adds exactly one dated News item with the canonical TikTok source", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-04-23");
    assert.equal(entry.sameDayOrder, undefined);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "湘南シーサイドサークルのTikTok投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("preserves only the confirmed post text", () => {
    const entry = item();

    assert.equal(entry.message?.label, "湘南シーサイドサークルの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.doesNotMatch(entry.body, /目標|結果|達成|受賞|順位|投稿時刻|再生|コンテスト/);
  });

  it("does not change the current August Latest ranking", () => {
    const ordered = sortNewsByDateDesc(news);

    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1]?.id, "2026-09-02-miss-circle-third-round");
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.equal(ordered[4]?.id, "2026-09-01-first-showroom-oyasumiry");
    assert.equal(ordered[5]?.id, "2026-09-01-ohayo-september-x");
    assert.equal(ordered[6]?.id, "2026-09-01-paton-vote-final-day-story");
    assert.equal(ordered.at(-1)?.id, NEWS_ID);
    assert.equal(ordered.at(-2)?.id, "2026-08-02-21st-birthday");
    assert.equal(news.length, 75);
  });

  it("drives both Hero and Latest from the same ordered News list", async () => {
    const hero = await readFile(path.join(root, "src/components/Hero.tsx"), "utf8");
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");

    assert.equal(sortNewsByDateDesc(news)[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.match(hero, /selectHomeHeroNews\(news, now\)/);
    assert.match(latest, /const latestNews = sortNewsByDateDesc\(news\)/);
  });
});

describe("2026-04-23 TikTok video — shared Latest / Gallery asset", () => {
  it("shares one manifest object among the standalone Gallery videos", () => {
    const matches = galleryVideos.filter(
      (entry) => entry.id === tiktokSayonaraIchigoVideo.id,
    );
    const selfHosted = galleryVideos.filter(isSelfHostedGalleryVideo);
    const mixchIndex = galleryVideos.findIndex(isMixchMovie);

    assert.equal(item().media, tiktokSayonaraIchigoVideo);
    assert.deepEqual(matches, [tiktokSayonaraIchigoVideo]);
    assert.equal(galleryVideos[20], tiktokRadioVideo);
    assert.equal(selfHosted.at(-1), tiktokSayonaraIchigoVideo);
    assert.equal(selfHosted.at(-2), morningStoryVideo);
    assert.equal(galleryVideos[mixchIndex - 1], tiktokSayonaraIchigoVideo);
    assert.equal(galleryVideos[mixchIndex], mixchFinalDayMovie);
    assert.equal(galleryVideos.filter(isMixchMovie).length, 4);
    assert.equal(tiktokSayonaraIchigoVideo.provenance, "owner-provided");
    assert.equal(tiktokSayonaraIchigoVideo.sourceUrl, SOURCE);
    assert.equal(tiktokSayonaraIchigoVideo.sourceDate, "2026-04-23");
    assert.equal(tiktokSayonaraIchigoVideo.published, true);
    assert.equal(tiktokSayonaraIchigoVideo.alt, ALT);
  });

  it("keeps the relative order of existing August self-hosted videos", () => {
    const augustIds = galleryVideos
      .filter(isSelfHostedGalleryVideo)
      .filter((entry) => entry !== tiktokSayonaraIchigoVideo)
      .map((entry) => entry.id);

    assert.deepEqual(augustIds, [
      "mily-b47-01-oyasumily-story",
      "mily-b47-02-paton-second-story",
      "mily-b46-01-paton-vote-final-day-story",
      "mily-b46-02-september-mily-story",
      "mily-b45-01-paton-vote-voice-story",
      "mily-b44-02-paton-vote-first-place-story",
      "mily-b44-01-paton-vote-15x-emergency-story",
      "mily-b43-02-campus-girls-hold-second-story",
      "mily-b43-01-paton-vote-day5-story",
      "mily-b41-02-paton-vote-day4-story",
      "mily-b41-01-night-showroom-story",
      "mily-b36-01-seaside-circle-movie-theme-story",
      "mily-b35-01-miss-circle-showroom-story",
      "mily-b27-02-paton-vote-mirror",
      "mily-b27-01-paton-vote-collage",
      "mily-b25-01-seasidecircle-yes-tokyo",
      "mily-b23-01-night-thanks-morning-stream-story",
      "mily-b21-01-seaside-circle-musical-special-thanks",
      "mily-b19-01-seaside-circle-musical-special",
      "mily-b18-01-earthquake-safety-story",
      "mily-b15-01-tiktok-radio-misscircle",
      "mily-b13-02-event-story",
      "mily-b12-01-morning-ohayo-story",
      "mily-b11-01-morning-showroom-runway",
      "mily-b07-01-morning-story",
      "mily-b09-01-second-round-story",
      "mily-b03-01-morning-ohayo",
    ]);
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b37-01-tiktok-sayonara-ichigo"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b37-01-tiktok-sayonara-ichigo-poster.jpg",
      "media/gallery/mily-b37-01-tiktok-sayonara-ichigo.mp4",
    ]);
    assert.match(tiktokSayonaraIchigoVideo.src, /^\/media\/gallery\//);
    assert.match(tiktokSayonaraIchigoVideo.poster, /^\/media\/gallery\//);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
  });

  it("adds only one standalone Gallery video and leaves Drive Gallery unchanged", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    assert.equal(drive.photos.length, 45);
    assert.equal(drive.videos.length, 11);
    assert.equal(galleryVideos.length, 32);
    assert.equal(galleryVideos.filter(isSelfHostedGalleryVideo).length, 28);
    assert.equal(visibleGalleryVideos().filter(isSelfHostedGalleryVideo).length, 28);
    assert.equal(galleryVideos.filter(isMixchMovie).length, 4);
  });
});

describe("2026-04-23 TikTok video — published derivatives", () => {
  it("matches the manifest and is H.264 Baseline / yuv420p / video-only", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audioStreams = info.streams.filter((stream) => stream.codec_type === "audio");
    const bytes = await readFile(mp4);

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, tiktokSayonaraIchigoVideo.width);
    assert.equal(video.height, tiktokSayonaraIchigoVideo.height);
    assert.equal(video.width, 576);
    assert.equal(video.height, 1024);
    assert.equal(video.nb_frames, "473");
    assert.equal(Number(info.format.duration).toFixed(3), "17.556");
    assert.equal(audioStreams.length, 0);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), PUBLIC_MP4_SHA256);
    assert.equal(bytes.length, 2_038_963);

    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");
      const sourceBytes = await readFile(original);

      assert.equal(sourceBytes.length, 1_675_842);
      assert.equal(createHash("sha256").update(sourceBytes).digest("hex"), ORIGINAL_SHA256);
      assert.equal(sourceVideo.width, video.width);
      assert.equal(sourceVideo.height, video.height);
      assert.equal(sourceVideo.nb_frames, video.nb_frames);
      assert.equal(sourceVideo.profile, "High");
    }
  });

  it("uses faststart and removes source-specific metadata and chapters", async () => {
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(tiktokSayonaraIchigoVideo, galleryDirectory),
      { width: 576, height: 1024 },
    );

    const handle = await open(mp4, "r");
    try {
      const head = Buffer.alloc(64 * 1024);
      const { bytesRead } = await handle.read(head, 0, head.length, 0);
      const window = head.subarray(0, bytesRead);
      assert.ok(window.indexOf("moov", 0, "latin1") < window.indexOf("mdat", 0, "latin1"));
    } finally {
      await handle.close();
    }

    const info = await probe(mp4);
    const serialized = JSON.stringify(info);
    assert.equal(info.chapters.length, 0);
    assert.doesNotMatch(serialized, /aigc_info|vid_md5/);
    const metadata = [
      info.format.tags ?? {},
      ...info.streams.map((stream) => stream.tags ?? {}),
    ];
    assert.deepEqual(Object.keys(metadata[0]).sort(), [
      "compatible_brands",
      "encoder",
      "major_brand",
      "minor_version",
    ]);
    const streamMetadataKeys = Object.keys(metadata[1]).sort();
    const allowedStreamMetadataKeys = new Set([
      "encoder",
      "handler_name",
      "language",
      "vendor_id",
    ]);
    assert.deepEqual(
      streamMetadataKeys.filter((key) => !allowedStreamMetadataKeys.has(key)),
      [],
    );
    for (const key of ["encoder", "handler_name", "language"]) {
      assert.equal(streamMetadataKeys.includes(key), true, key);
    }
    assert.doesNotMatch(JSON.stringify(metadata), SOURCE_METADATA_FILE_PATTERN);
  });

  it("uses the selected 2.4-second real frame as a metadata-free poster", async () => {
    const meta = await sharp(poster).metadata();
    const posterBytes = await readFile(poster);
    assert.equal(meta.width, 576);
    assert.equal(meta.height, 1024);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(createHash("sha256").update(posterBytes).digest("hex"), POSTER_SHA256);
    assert.equal(posterBytes.length, 32_108);

    const ffmpeg = await ffmpegExe();
    const { stdout } = await run(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-ss",
        POSTER_SECONDS,
        "-i",
        mp4,
        "-frames:v",
        "1",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "gray",
        "-",
      ],
      { encoding: "buffer", maxBuffer: 1024 * 1024 * 64 },
    );
    const posterGray = await sharp(poster).greyscale().raw().toBuffer();

    assert.equal(stdout.length, posterGray.length);
    let total = 0;
    for (let index = 0; index < posterGray.length; index += 1) {
      total += Math.abs(posterGray[index] - stdout[index]);
    }
    assert.ok(total / posterGray.length < 3);
  });

  it("retains the existing uncropped playback contract", async () => {
    const view = driveVideoView(tiktokSayonaraIchigoVideo);
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const gallery = await readFile(path.join(root, "src/components/Gallery.tsx"), "utf8");

    assert.equal(view.video.controls, true);
    assert.equal(view.video.playsInline, true);
    assert.equal(view.video.preload, "none");
    assert.equal("autoPlay" in view.video, false);
    assert.equal("loop" in view.video, false);
    for (const source of [latest, gallery]) {
      assert.match(source, /controls/);
      assert.match(source, /playsInline/);
      assert.match(source, /preload/);
      assert.match(source, /object-contain/);
      assert.doesNotMatch(source, /autoPlay|autoplay|\bloop\b/);
    }
  });
});

describe("2026-04-23 TikTok post — privacy, identity and scope boundaries", () => {
  it("keeps private handoff fields, Drive ids and raw originals out of tracked/public files", async () => {
    const files = await repositoryFiles();
    const taskFiles = [
      "src/data/tiktokSayonaraIchigoVideo.json",
      "src/data/tiktokSayonaraIchigoVideo.ts",
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];

    assert.equal(files.includes(path.relative(root, original).replaceAll("\\", "/")), false);
    assert.equal(
      files.some(
        (relative) =>
          relative.startsWith("media/original/") &&
          relative.includes("mily-b37-01"),
      ),
      false,
    );

    for (const relative of taskFiles) {
      const bytes = await readFile(path.join(root, relative));
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.deepEqual(findDriveIds(source), [], relative);
    }

    const manifest = JSON.parse(
      await readFile(
        path.join(root, "src/data/tiktokSayonaraIchigoVideo.json"),
        "utf8",
      ),
    );
    assert.deepEqual(
      Object.keys(manifest).filter((key) => PRIVATE_HANDOFF_KEY_PATTERN.test(key)),
      [],
    );
    assert.equal(JSON.stringify(manifest).includes("media/original"), false);
  });

  it("does not add the post to excluded data surfaces", async () => {
    for (const relative of [
      "src/data/stories.ts",
      "src/data/events.ts",
      "src/data/profile.ts",
      "src/data/highlights.ts",
      "src/data/media.ts",
      "src/data/driveGalleryManifest.json",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("mily-b37-01"), false, relative);
    }
    assert.deepEqual(events, []);
    assert.equal(
      JSON.stringify(highlights).includes("mily-b37-01"),
      false,
    );
  });

  it("keeps Mily identity and unrelated people/sites out of task files", async () => {
    const taskFiles = [
      "src/data/tiktokSayonaraIchigoVideo.json",
      "src/data/tiktokSayonaraIchigoVideo.ts",
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];
    const forbidden = new RegExp(
      [
        ["Mi", "lly"].join(""),
        "Yukako",
        "Riri",
        "Mako",
        "Chizuru",
        "ouen-archive",
        "yukako-schedule",
        "riri-schedule",
        "mako-schedule",
      ].join("|"),
      "i",
    );

    for (const relative of taskFiles) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.doesNotMatch(source, forbidden, relative);
    }

    await run(process.execPath, ["scripts/check-site-identity.mjs", "main"], { cwd: root });
  });

  it("flows through Portal Feed with the TikTok source and shared poster", () => {
    const feed = createPortalFeed({
      newsItems: [item()],
      storyItems: [],
      now: new Date("2026-04-23T21:00:00+09:00"),
    });
    const entry = feed.items.find((candidate) => candidate.id === `mily:news:${NEWS_ID}`);

    assert.ok(entry);
    assert.equal(entry.publishedAt, "2026-04-23T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.ok(entry.image?.endsWith(tiktokSayonaraIchigoVideo.poster));
  });
});
