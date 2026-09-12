import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import {
  RANKING_NOTE,
  streamRecap20260912Asa as recap,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

test("September 12 morning stays ahead of September 11 night", () => {
  const recapIndex = streamRecaps.indexOf(recap);
  assert.ok(recapIndex > 0);
  assert.equal(streamRecaps[recapIndex + 1].id, "2026-09-11-yoru-showroom");
  assert.equal(recap.broadcastLabel, "8:00頃〜 約40分");
  assert.deepEqual(recap.ranking, [RANKING_NOTE]);
  assert.match(recap.nextNote, /22時まで/);
  assert.match(recap.nextNote, /約1時間20分/);
  assert.doesNotMatch(recap.nextNote, /20時40分/);
});

test("September 12 morning records the three verified songs", () => {
  assert.deepEqual(recap.songs.map(({ clip: _clip, ...song }) => song), [
    { title: "拝啓、少年よ", artist: "Hump Back", timestamp: "0:15:38", youtubeUrl: "https://www.youtube.com/watch?v=d6i4AtCxrDo" },
    { title: "好きすぎて滅！", artist: "M!LK", timestamp: "0:23:13", youtubeUrl: "https://www.youtube.com/watch?v=ZVUxJsPfoX8" },
    { title: "Lovers", artist: "sumika", timestamp: "0:33:21", youtubeUrl: "https://www.youtube.com/watch?v=FFITBgsyVr4" },
  ]);
});
test("September 12 morning ships eight real-frame stills", async () => {
  assert.equal(recap.gallery.length, 8);
  assert.equal(recap.image, recap.gallery[3]);
  assert.equal(recap.galleryZip.label, "8枚まとめて保存");
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 8);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b99-/);
    const file = new URL(`../public${still.src}`, import.meta.url);
    const meta = await sharp(await readFile(file)).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    for (const field of ["exif", "xmp", "iptc"]) assert.equal(meta[field], undefined);
    assert.ok(still.alt && still.caption && still.downloadName);
  }
  const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  assert.match(recap.transcriptionNote, /全988区間/);
  assert.match(recap.transcriptionNote, /40分28\.838秒/);
  assert.match(recap.transcriptionNote, /実フレーム8枚/);
});

test("September 12 morning public text does not expose unstable point counts", () => {
  const publicText = JSON.stringify(recap);
  assert.doesNotMatch(publicText, /43,?405|43,?360|4,?361|45,?000/);
  assert.match(recap.summary, /三次通過/);
  assert.match(recap.summary, /アバター権/);
});
