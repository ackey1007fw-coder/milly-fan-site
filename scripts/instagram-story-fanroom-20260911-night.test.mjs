import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  galleryVideos,
} from "../src/data/galleryVideos.ts";
import { finalDayNightStoryVideo } from "../src/data/finalDayNightStoryVideo.ts";
import { miripochiStoryVideo } from "../src/data/miripochiStoryVideo.ts";
import { missCircleWebVoteLink } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDir = path.join(root, "public/media/gallery");
const run = promisify(execFile);
const VOTE_ID = "2026-09-11-miripochi-story";
const STORY_ID = "2026-09-11-night-stream-thanks-final-day-story";
const FANROOM_ID = "2026-09-11-night-fanroom-final-day";
const PHOTO_ID = "mily-b97-01";
const FINAL_VIDEO = "mily-b97-02-final-day-story.mp4";
const FINAL_POSTER = "mily-b97-02-final-day-story-poster.jpg";
const VOTE_VIDEO = "mily-b97-03-miripochi-story.mp4";
const VOTE_POSTER = "mily-b97-03-miripochi-story-poster.jpg";
const HASHES = {
  [FINAL_VIDEO]: "595d1436d96421900205352fe95f39a670037c455c80f4e06ffe8efc749f0d97",
  [FINAL_POSTER]: "846acdf94960065b6b0d971fd0983031aedd3bd1b72271d784633154599873c2",
  [VOTE_VIDEO]: "ca74f31e9644b02cabee6726e0d0f6be480996ab600745d85998da2b8ef106a5",
  [VOTE_POSTER]: "660a7fca52a4b86e71389f91f5fe2af0fe18f19a4f54732a00cc391a5f651575",
};

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function probe(file) {
  const mod = await import("ffprobe-static");
  const ffprobe = mod.default?.path ?? mod.default ?? mod.path ?? mod;
  const { stdout } = await run(ffprobe, [
    "-v", "error", "-show_format", "-show_streams", "-of", "json", file,
  ]);
  return JSON.parse(stdout);
}
describe("2026-09-11 night Story / Fan Room / Gallery update", () => {
  it("publishes the three dated NEWS records in the intended order", () => {
    const sameDay = sortNewsByDateDesc(news).filter(({ date }) => date === "2026-09-11");
    assert.deepEqual(sameDay.slice(0, 4).map(({ id }) => id), [
      VOTE_ID,
      STORY_ID,
      FANROOM_ID,
      "2026-09-11-morning-fanroom-voice",
    ]);
    for (const id of [VOTE_ID, STORY_ID, FANROOM_ID]) {
      assert.equal(news.filter((item) => item.id === id).length, 1);
    }
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the vote Story non-link while using the separately verified vote CTA", () => {
    const entry = news.find(({ id }) => id === VOTE_ID);
    assert.ok(entry);
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.relatedUrl, "https://www.instagram.com/mily_chan36");
    assert.equal(entry.media, miripochiStoryVideo);
    assert.equal(entry.additionalCtas?.[0]?.url, missCircleWebVoteLink.url);
    assert.match(entry.body, /遷移先は素材だけでは確認できない/);
  });
  it("records the 8/12 typo as corrected to the September 12 schedule", () => {
    const entry = news.find(({ id }) => id === STORY_ID);
    assert.ok(entry);
    assert.equal(entry.media, finalDayNightStoryVideo);
    assert.equal(finalDayNightStoryVideo.sourceDate, "2026-09-11");
    assert.equal(finalDayNightStoryVideo.sourceLabel, "Instagram Story");
    assert.equal(finalDayNightStoryVideo.provenance, "owner-provided");
    assert.match(entry.body, /翌9月12日/);
    assert.match(entry.body, /8月じゃなくて9月じゃーん！！！間違えすみません/);
    assert.match(entry.body, /公開動画の表示はそのまま/);
    assert.equal(entry.additionalCtas?.[0]?.url, "https://www.showroom-live.com/r/circle2026_0734");
  });

  it("publishes only Mily's Fan Room words and no fan identities", () => {
    const entry = news.find(({ id }) => id === FANROOM_ID);
    assert.ok(entry);
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "SHOWROOMファンルーム");
    assert.equal(entry.url, "https://www.showroom-live.com/room/fan_club?room_id=573253");
    assert.match(entry.body, /9月11日23:10/);
    assert.equal(entry.message?.label, "みりぃのファンルーム");
    assert.match(entry.message?.text ?? "", /3次審査突破&アバ権獲得/);
    assert.equal(entry.media, undefined);
  });
  it("adds the approved selfie to Gallery and keeps both Story videos NEWS-only", () => {
    const photoEntry = selectGalleryEntries().find(({ key }) => key === PHOTO_ID);
    assert.ok(photoEntry);
    assert.equal(photoEntry.kind, "media");
    const photo = photoEntry.item;
    assert.equal(photo.sourceDate, "2026-09-11");
    assert.equal(photo.sourceUrl, null);
    assert.equal(photo.provenance, "owner-provided");
    assert.equal(photo.published, true);
    assert.equal(photo.aspect, "1206 / 651");

    for (const item of [miripochiStoryVideo, finalDayNightStoryVideo]) {
      assert.equal(galleryVideos.some(({ id }) => id === item.id), false);
      assert.equal(item.sourceDate, "2026-09-11");
      assert.equal(item.published, true);
    }
    const keys = selectGalleryEntries().map(({ key }) => key);
    assert.equal(keys.filter((candidate) => candidate === PHOTO_ID).length, 1);
    for (const key of [miripochiStoryVideo.id, finalDayNightStoryVideo.id]) {
      assert.equal(keys.includes(key), false);
    }
  });
  it("pins the public Story files, strips audio, and keeps fast-start MP4s", async () => {
    for (const name of [FINAL_VIDEO, FINAL_POSTER, VOTE_VIDEO, VOTE_POSTER]) {
      assert.equal(await sha256(path.join(galleryDir, name)), HASHES[name]);
    }
    for (const name of [FINAL_VIDEO, VOTE_VIDEO]) {
      const file = path.join(galleryDir, name);
      const info = await probe(file);
      assert.equal(info.streams.length, 1);
      assert.equal(info.streams[0].codec_type, "video");
      assert.equal(info.streams[0].codec_name, "h264");
      assert.equal(info.streams[0].width, 512);
      assert.equal(info.streams[0].height, 910);
      const tags = JSON.stringify([info.format.tags, ...info.streams.map((stream) => stream.tags)]);
      assert.doesNotMatch(tags, /creation_time|location|comment|title/i);
      const bytes = await readFile(file);
      assert.ok(bytes.indexOf("moov") > 0);
      assert.ok(bytes.indexOf("mdat") > bytes.indexOf("moov"));
    }
  });

  it("publishes metadata-free real-image derivatives for the Fan Room selfie", async () => {
    const large = path.join(galleryDir, "mily-b97-01-night-fanroom-selfie-1600.jpg");
    const meta = await sharp(large).metadata();
    assert.equal(meta.width, 1206);
    assert.equal(meta.height, 651);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    const posterMeta = await sharp(path.join(galleryDir, FINAL_POSTER)).metadata();
    assert.equal(posterMeta.width, 512);
    assert.equal(posterMeta.height, 910);
  });
});
