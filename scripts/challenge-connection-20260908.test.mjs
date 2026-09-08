import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { amiMilyKoreaPromise } from "../src/data/challengeConnection.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("天宮あみさんとの約束導線は確認済み公開ソースだけを使う", () => {
  assert.equal(amiMilyKoreaPromise.date, "2026-09-08");
  assert.equal(
    amiMilyKoreaPromise.source.url,
    "https://x.com/amis2_mh/status/2097322336387297549",
  );
  assert.equal(
    amiMilyKoreaPromise.milyReply.url,
    "https://x.com/Mily_chan36/status/2097324863921041811",
  );
  assert.equal(amiMilyKoreaPromise.amiEntry.url, "https://2026.frecam.jp/entry/837");
  assert.doesNotMatch(amiMilyKoreaPromise.body, /妹分/);
});

test("b91公開画像は元構図を保ちmetadataを持たない", async () => {
  const file = path.join(root, amiMilyKoreaPromise.image.src.replace(/^\//, "public/"));
  const metadata = await sharp(file).metadata();
  assert.equal(metadata.width, 1536);
  assert.equal(metadata.height, 1024);
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.xmp, undefined);
  assert.equal(metadata.icc, undefined);
});
