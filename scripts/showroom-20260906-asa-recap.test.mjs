import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { it } from "node:test";
import sharp from "sharp";
import { streamRecap20260906Asa as recap, streamRecap20260905Night, streamRecaps } from "../src/data/streamRecaps.ts";

it("places the September 6 morning recording before the previous night with valid source-relative timestamps", () => {
  assert.ok(streamRecaps.includes(recap));
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.indexOf(streamRecap20260905Night));
  for (const items of [recap.highlights, recap.timeline]) {
    const times = items.map(({timestamp}) => timestamp.split(":").reduce((n,v) => n * 60 + Number(v), 0));
    assert.deepEqual(times, [...times].sort((a,b) => a-b));
    assert.ok(times.every(t => t >= 0 && t <= 5254));
  }
  assert.match(recap.nextNote, /配信時点/);
  assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
  assert.ok(recap.highlights.every(h => !h.quote));
});

it("keeps withdrawn September 6 stills and ZIP out of public data and assets", async () => {
  assert.equal(recap.gallery.length, 3);
  assert.equal(recap.image, recap.gallery[1]);
  assert.equal(recap.galleryZip.label, "3枚まとめて保存");
  for (const still of recap.gallery) {
    assert.match(still.src, /mily-b62-/);
    const meta = await sharp(await readFile(new URL(`../public${still.src}`, import.meta.url))).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    for (const field of ["exif", "xmp", "iptc"]) assert.equal(meta[field], undefined);
  }
  const files = await readdir(new URL("../public/media/live/", import.meta.url));
  assert.equal(files.some(name => name.startsWith("mily-b61-")), false);
  assert.ok(recap.highlights.length > 0);
  const source = await readFile(new URL("../src/data/streamRecap20260906Asa.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /mily-b61-/);
});
