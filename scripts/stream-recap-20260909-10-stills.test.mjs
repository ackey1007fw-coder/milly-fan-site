import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import {
  streamRecap20260909Asa as sep09,
  streamRecap20260910Asa as sep10,
} from "../src/data/streamRecaps.ts";

async function verifyStillSet(recap, batch, representativeIndex) {
  assert.equal(recap.gallery.length, 8);
  assert.equal(recap.image, recap.gallery[representativeIndex]);
  assert.equal(recap.galleryZip.label, "8枚まとめて保存");
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 8);
  for (const still of recap.gallery) {
    assert.match(still.src, new RegExp(`/mily-${batch}-`));
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
}

test("September 9 morning ships the eight owner-approved stills", async () => {
  await verifyStillSet(sep09, "b94", 3);
});

test("September 10 morning ships the eight owner-approved stills", async () => {
  await verifyStillSet(sep10, "b95", 4);
});
