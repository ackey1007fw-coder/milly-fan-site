import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import {
  RANKING_NOTE,
  streamRecap20260913Asa as recap,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

test("September 13 morning is the newest recap", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps[1].id, "2026-09-12-asa-showroom");
  assert.equal(recap.broadcastLabel, "6:00頃〜 約41分");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.deepEqual(recap.ranking, [RANKING_NOTE]);
  assert.equal(recap.songs, undefined);
  assert.match(recap.summary, /WEB投票最終日/);
  assert.match(recap.summary, /ラジオ/);
  assert.match(recap.nextNote, /夜にも配信できる可能性/);
  assert.match(recap.nextNote, /状況を見て/);
});

test("September 13 morning records only verified recap topics", () => {
  const publicText = JSON.stringify(recap);
  assert.match(publicText, /メイク/);
  assert.match(publicText, /湘南シーサイドサークル/);
  assert.match(publicText, /アバター権/);
  assert.match(publicText, /13位から1位/);
  assert.doesNotMatch(publicText, /live23420187|573253|Mily_SHOWROOM_AutoRecord|ChatGPTWork/);
});

test("September 13 morning ships eight real-frame stills", async () => {
  assert.equal(recap.gallery.length, 8);
  assert.equal(recap.image, recap.gallery[6]);
  assert.equal(recap.galleryZip.label, "8枚まとめて保存");
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 8);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b111-/);
    const file = new URL(`../public${still.src}`, import.meta.url);
    const meta = await sharp(await readFile(file)).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    for (const field of ["exif", "xmp", "iptc"]) assert.equal(meta[field], undefined);
    assert.ok(still.alt?.includes("みりぃ"));
    assert.ok(still.caption && still.downloadName);
  }
  const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  assert.match(recap.transcriptionNote, /全1,139区間/);
  assert.match(recap.transcriptionNote, /40分44\.502秒/);
  assert.match(recap.transcriptionNote, /実フレーム8枚/);
});
