import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { it } from "node:test";
import sharp from "sharp";
import { streamRecap20260905Day as recap, streamRecap20260905Asa, streamRecaps } from "../src/data/streamRecaps.ts";

it("places the September 5 daytime recording before that morning with valid source-relative timestamps", () => {
  assert.ok(streamRecaps.includes(recap));
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.indexOf(streamRecap20260905Asa));
  for (const items of [recap.highlights, recap.timeline]) {
    const times = items.map(({timestamp}) => timestamp.split(":").reduce((n,v) => n * 60 + Number(v), 0));
    assert.deepEqual(times, [...times].sort((a,b) => a-b));
    assert.ok(times.every(t => t >= 0 && t <= 2804));
  }
  assert.match(recap.nextNote, /配信時点/);
  assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
  assert.ok(recap.highlights.every(h => !h.quote));
});

it("ships ten distinct daytime images at source resolution without metadata and a download ZIP", async () => {
  assert.equal(recap.gallery.length, 10);
  assert.equal(new Set(recap.gallery.map(i => i.src)).size, 10);
  assert.ok(recap.gallery.includes(recap.image));
  for (const still of recap.gallery) {
    const meta = await sharp(await readFile(new URL(`../public${still.src}`, import.meta.url))).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    for (const field of ["exif", "xmp", "iptc"]) assert.equal(meta[field], undefined);
    assert.ok(still.alt && still.caption && still.downloadName);
  }
  const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  const source = await readFile(new URL("../src/data/streamRecap20260905Day.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /https?:\/\/|data:|\.mp4|\.mp3/);
});
