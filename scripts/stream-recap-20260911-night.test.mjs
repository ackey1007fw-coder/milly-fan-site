import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import {
  RANKING_NOTE,
  streamRecap20260911Yoru as recap,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

test("September 11 night stays ahead of the same-day morning recap", () => {
  const nightIndex = streamRecaps.indexOf(recap);
  assert.ok(nightIndex > 0);
  assert.equal(streamRecaps[nightIndex + 1].id, "2026-09-11-asa-showroom");
  assert.equal(recap.broadcastLabel, "22:32頃〜 約34分");
  assert.deepEqual(recap.ranking, [RANKING_NOTE]);
  assert.match(recap.nextNote, /翌9月12日朝8時/);
});

test("September 11 night keeps the verified song link", () => {
  assert.equal(recap.songs.length, 1);
  assert.deepEqual(recap.songs[0], {
    title: "明日も",
    artist: "SHISHAMO",
    timestamp: "0:26:19",
    youtubeUrl: "https://www.youtube.com/watch?v=zhCtzmDWsN0",
    clip: {
      src: "/media/live-clips/mily-b102-01-ashitamo.mp4",
      poster: "/media/live-clips/mily-b102-01-ashitamo-poster.jpg",
      width: 640,
      height: 360,
      durationSeconds: 24,
      sourceTimestamp: "0:27:26",
    },
  });
});
test("September 11 night ships eight approved real-frame stills", async () => {
  assert.equal(recap.gallery.length, 8);
  assert.equal(recap.image, recap.gallery[5]);
  assert.equal(recap.galleryZip.label, "8枚まとめて保存");
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 8);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b98-/);
    const file = new URL(`../public${still.src}`, import.meta.url);
    const meta = await sharp(await readFile(file)).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    for (const field of ["exif", "xmp", "iptc"]) assert.equal(meta[field], undefined);
    assert.ok(still.alt && still.caption && still.downloadName);
  }
  const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  assert.match(recap.transcriptionNote, /実フレーム8枚を掲載/);
});
