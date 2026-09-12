import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import sharp from "sharp";
import ffprobe from "ffprobe-static";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { buildStreamSongClips, catalogSongClipCount } from "../src/lib/streamSongClips.ts";
import { buildStreamSongCatalog } from "../src/lib/streamSongCatalog.ts";

const run = promisify(execFile);
const root = new URL("../", import.meta.url);
const clips = buildStreamSongClips(streamRecaps);
const expectedTitles = ["拝啓、少年よ", "好きすぎて滅！", "Lovers"];

async function probe(path) {
  const { stdout } = await run(ffprobe.path, [
    "-v", "error", "-show_format", "-show_streams", "-print_format", "json", path,
  ]);
  return JSON.parse(stdout);
}

test("song clips derive from the existing song records only", () => {
  assert.equal(clips.length, 3);
  assert.deepEqual(clips.map((item) => item.title), expectedTitles);
  assert.ok(clips.every((item) => item.performance.id === "2026-09-12-asa-showroom"));
  assert.equal(catalogSongClipCount(buildStreamSongCatalog(streamRecaps)), clips.length);
});
test("site clips are short playable MP4s with real-frame posters", async () => {
  for (const item of clips) {
    const clip = item.performance.clip;
    assert.equal(clip.durationSeconds, 24);
    assert.equal(clip.width, 640);
    assert.equal(clip.height, 360);
    assert.match(clip.src, /^\/media\/live-clips\/mily-b100-/);
    const videoUrl = new URL(`../public${clip.src}`, import.meta.url);
    const posterUrl = new URL(`../public${clip.poster}`, import.meta.url);
    assert.ok((await stat(videoUrl)).size > 100_000);
    const media = await probe(fileURLToPath(videoUrl));
    const video = media.streams.find((stream) => stream.codec_type === "video");
    const audio = media.streams.find((stream) => stream.codec_type === "audio");
    assert.equal(video.codec_name, "h264");
    assert.equal(video.width, 640);
    assert.equal(video.height, 360);
    assert.equal(audio.codec_name, "aac");
    assert.ok(Math.abs(Number(media.format.duration) - 24) < 0.2);
    const bytes = await readFile(videoUrl);
    assert.ok(bytes.indexOf(Buffer.from("moov")) < bytes.indexOf(Buffer.from("mdat")));
    const poster = await sharp(await readFile(posterUrl)).metadata();
    assert.equal(poster.width, 640);
    assert.equal(poster.height, 360);
    assert.equal(poster.exif, undefined);
    assert.equal(poster.xmp, undefined);
    assert.equal(poster.iptc, undefined);
  }
});
test("song clips route is indexable and reachable from LIVE", async () => {
  const page = await readFile(new URL("../src/SongClipsPage.tsx", import.meta.url), "utf8");
  const catalogUi = await readFile(new URL("../src/components/StreamSongCatalog.tsx", import.meta.url), "utf8");
  const html = await readFile(new URL("../activities/live/clips/index.html", import.meta.url), "utf8");
  const metadata = await readFile(new URL("../src/lib/songClipsMetadata.ts", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const vite = await readFile(new URL("../vite.config.ts", import.meta.url), "utf8");
  assert.match(catalogUi, /href="\/activities\/live\/clips\/"/);
  assert.match(page, /buildStreamSongClips\(streamRecaps\)/);
  assert.match(page, /controls/);
  assert.match(page, /playsInline/);
  assert.match(page, /preload="metadata"/);
  assert.doesNotMatch(page, /autoPlay/);
  assert.match(metadata, /ファン制作・非公式アーカイブ/);
  assert.match(html, /__SONG_CLIPS_CANONICAL__/);
  assert.match(html, /__SONG_CLIPS_JSON_LD__/);
  assert.match(sitemap, /activities\/live\/clips\//);
  assert.match(vite, /activityLiveClips: "activities\/live\/clips\/index\.html"/);
});

test("public song clip implementation does not contain private handoff data", async () => {
  const files = [
    "src/SongClipsPage.tsx", "src/data/streamRecap20260912Asa.ts",
    "docs/CONTENT-OPS.md", "docs/MEDIA.md", "docs/STREAM-SONG-CATALOG-QA.md",
  ];
  const text = (await Promise.all(files.map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")))).join("\n");
  assert.doesNotMatch(text, /(?:[A-Z]:\\Users\\|(?:live|room)[_-]?id\s*[:=]|qa_20\d{6}|private\s+(?:message|chat))/i);
});
