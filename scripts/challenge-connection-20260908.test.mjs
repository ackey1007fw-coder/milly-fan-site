import assert from "node:assert/strict";
import test from "node:test";
import { amiMilyKoreaPromise } from "../src/data/challengeConnection.ts";

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

test("AI生成表示のある投稿画像をサイト素材として保持しない", () => {
  assert.equal("image" in amiMilyKoreaPromise, false);
});
