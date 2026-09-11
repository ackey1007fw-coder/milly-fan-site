import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, it } from "node:test";
import ffprobe from "ffprobe-static";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "../src/data/news.ts";
import { morningFanroomVoice as voice } from "../src/data/morningFanroomVoice.ts";
import { news as beforeB41 } from "./fixtures/news-before-b41.ts";
import { news as beforeB58 } from "./fixtures/news-before-b58.ts";
import { news as beforeSeptember9 } from "./fixtures/news-before-20260909.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { media } from "../src/data/media.ts";
import { stories } from "../src/data/stories.ts";
import { verifyNews } from "./content-invariants.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ID = "2026-09-11-morning-fanroom-voice";
const entry = news.find((item) => item.id === ID);
const audioPath = path.join(root, "public", voice.src);
const run = promisify(execFile);

describe("2026-09-11 Fan Room voice: actual self-hosted audio", () => {
  it("adds one dated NEWS item connected to the real audio object", () => {
    assert.ok(entry);
    assert.equal(news.filter((item) => item.id === ID).length, 1);
    assert.equal(entry.date, "2026-09-11");
    assert.match(entry.body, /9月11日06:41/);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.media, voice);
    assert.deepEqual(newsDisplayMedia(entry), [voice]);
    assert.deepEqual(verifyNews(news), []);
  });
  it("uses a local MP4 audio resource and an honest source label", () => {
    assert.equal(voice.kind, "audio");
    assert.equal(voice.mimeType, "audio/mp4");
    assert.equal(voice.sourcePublishedAt, "2026-09-11T06:41:34+09:00");
    assert.equal(voice.sourceDate, entry.date);
    assert.match(voice.src, /^\/media\/news\/mily-b93-01-.+\.m4a$/);
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "SHOWROOMファンルーム");
    assert.equal(entry.url, "https://www.showroom-live.com/room/fan_club?room_id=573253");
    assert.equal(entry.ctaLabel, "元のファンルームを見る");
    assert.doesNotMatch(JSON.stringify(entry), /static\.showroom-live\.com|iframe/);
  });
  it("does not publish a transcript, private detail, screenshot, or tentative schedule", () => {
    assert.equal(entry.message, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.doesNotMatch(entry.body, /廊下|寝落ち|オーディション|21時|21:00/);
    assert.equal(JSON.stringify([galleryVideos, media, stories]).includes(voice.id), false);
  });
  it("keeps historical fixtures historical while testing the new item in current NEWS", () => {
    assert.ok(news.some((item) => item.id === ID));
    for (const snapshot of [beforeB41, beforeB58, beforeSeptember9]) {
      assert.equal(snapshot.some((item) => item.id === ID), false);
      assert.ok(snapshot.some((item) => item.id === "2026-08-26-girl-award-event-fanroom"));
    }
    const older = { id: "older", date: "2026-09-10", title: "older", body: "older" };
    assert.equal(sortNewsByDateDesc([older, entry])[0].id, ID);
  });
  it("pins the reviewed audio file and fast-start container", async () => {
    const bytes = await readFile(audioPath);
    assert.equal(bytes.length, 181947);
    assert.equal(createHash("sha256").update(bytes).digest("hex"),
      "53b2508fb6bdde59be4319fd97bc4f6b5e5b06e2d3ba0b829bfd03ed5cf08b83");
    const atoms = [];
    for (let offset = 0; offset < bytes.length;) {
      const size = bytes.readUInt32BE(offset);
      assert.ok(size >= 8 && offset + size <= bytes.length);
      atoms.push({ type: bytes.toString("ascii", offset + 4, offset + 8), offset });
      offset += size;
    }
    assert.equal(atoms[0].type, "ftyp");
    assert.ok(atoms.find((atom) => atom.type === "moov").offset <
      atoms.find((atom) => atom.type === "mdat").offset);
  });
  it("contains only AAC mono audio with no source timestamp metadata", async () => {
    const { stdout } = await run(ffprobe.path, ["-v", "error", "-show_format",
      "-show_streams", "-show_chapters", "-of", "json", audioPath]);
    const probe = JSON.parse(stdout);
    assert.equal(probe.streams.length, 1);
    assert.equal(probe.streams[0].codec_name, "aac");
    assert.equal(probe.streams[0].codec_type, "audio");
    assert.equal(probe.streams[0].sample_rate, "12000");
    assert.equal(probe.streams[0].channels, 1);
    assert.ok(Math.abs(Number(probe.format.duration) - 70.827) < 0.01);
    assert.deepEqual(probe.chapters, []);
    assert.doesNotMatch(JSON.stringify([probe.format.tags, probe.streams[0].tags]),
      /creation_time|location|owner|comment|title/);
  });
  it("reuses manual playback controls without autoplay or a CDN iframe", async () => {
    const component = await readFile(path.join(root, "src/components/NewsAudioCard.tsx"), "utf8");
    assert.match(component, /<audio[\s\S]*?controls[\s\S]*?preload="none"/);
    assert.match(component, /<source src=\{media.src\} type=\{media.mimeType\}/);
    assert.doesNotMatch(component, /autoPlay|<iframe/);
    const previous = news.find((item) => item.id === "2026-08-26-girl-award-event-fanroom");
    assert.equal(previous.media.kind, "audio");
    assert.equal(previous.media.src, "/media/news/mily-b27-01-girl-award-event-voice.m4a");
  });
});
