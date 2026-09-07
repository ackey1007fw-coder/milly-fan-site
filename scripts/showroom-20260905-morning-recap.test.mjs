import assert from "node:assert/strict";
import { withoutApprovedSongLinks } from "./approved-song-links.mjs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import sharp from "sharp";
import { streamRecap20260905Asa as recap, streamRecaps } from "../src/data/streamRecaps.ts";

describe("September 5 morning public archive", () => {
  it("keeps unique recaps newest first and historical next-slot announcements", () => {
    assert.ok(streamRecaps.includes(recap));
    const previousNight = streamRecaps.findIndex(r => r.id === "2026-09-04-night-gachi-showroom");
    assert.ok(previousNight >= 0);
    assert.ok(streamRecaps.indexOf(recap) < previousNight);
    assert.equal(new Set(streamRecaps.map(r => r.id)).size, streamRecaps.length);
    const dates = streamRecaps.map(r => r.date);
    assert.deepEqual(dates, [...dates].sort().reverse());
    for (const r of streamRecaps) assert.match(r.nextNote, /配信時点/);
  });
  it("publishes ten real-size downloadable stills without metadata or missing assets", async () => {
    assert.equal(recap.gallery.length, 10);
    assert.equal(new Set(recap.gallery.map(i => i.src)).size, 10);
    assert.ok(recap.gallery.includes(recap.image));
    for (const still of recap.gallery) {
      const bytes = await readFile(new URL(`../public${still.src}`, import.meta.url));
      const meta = await sharp(bytes).metadata();
      assert.equal(meta.width, still.width);
      assert.equal(meta.height, still.height);
      assert.equal(meta.width / meta.height, 16 / 9);
      assert.equal(meta.exif, undefined);
      assert.equal(meta.xmp, undefined);
      assert.equal(meta.iptc, undefined);
      assert.ok(still.alt && still.caption && still.downloadName);
    }
    const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
    assert.equal(zip.readUInt32LE(0), 0x04034b50);
  });
  it("discloses ASR limits and excludes source links and verbatim quotations", async () => {
    assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
    assert.match(recap.transcriptionNote, /目安/);
    assert.match(recap.transcriptionNote, /実フレーム10枚は目視確認/);
    assert.ok(recap.highlights.every(h => !h.quote));
    const source = await readFile(new URL("../src/data/streamRecap20260905Asa.ts", import.meta.url), "utf8");
    // 共通ルール（streamRecapRules.ts）のimportだけは除いてから、素材の出所が漏れていないかを見る。
    const body = source.replace(/^import[\s\S]*?from\s+"[^"]+";\n/gm, "");
    assert.doesNotMatch(withoutApprovedSongLinks(body), /https?:\/\/|data:|\.mp4|\.ts["']|\.mp3|stt_raw|ScreenRecording/);
    for (const items of [recap.highlights, recap.timeline]) {
      const times = items.map(({timestamp}) => timestamp.split(":").reduce((n,v) => n * 60 + Number(v), 0));
      assert.deepEqual(times, [...times].sort((a,b) => a-b));
      assert.ok(times.every(t => t >= 0 && t <= 1412));
    }
  });
});
