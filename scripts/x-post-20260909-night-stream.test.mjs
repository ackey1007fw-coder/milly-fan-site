import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { news } from "../src/data/news.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-09-morning-thanks-night-stream";
const SOURCE = "https://x.com/Mily_chan36/status/2097492757690646747";
const SHOWROOM = "https://www.showroom-live.com/r/circle2026_0734";

describe("2026-09-09 night SHOWROOM X announcement", () => {
  it("adds one factual, source-backed text NEWS item", () => {
    const entry = news.find(({ id }) => id === NEWS_ID);

    assert.ok(entry);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-09-09");
    assert.deepEqual(entry.activityIds, ["live-stream", "miss-circle"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, SHOWROOM);
    assert.equal(entry.ctaLabel, "SHOWROOMを見る");
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.match(entry.body, /朝枠へのお礼/);
    assert.match(entry.body, /21:30〜23:00/);
    assert.match(entry.body, /3次審査期間中/);
    assert.match(entry.body, /応援を呼びかけ/);
    assert.deepEqual(verifyNews([entry]), []);

    const publishedCopy = `${entry.title}\n${entry.body}`;
    assert.doesNotMatch(publishedCopy, /残り\s*\d|pt|ポイント|アバ権|is_live|next_live|公式|公認/i);
  });

  it("does not add the X announcement to event, media, or social registries", async () => {
    for (const relative of ["src/data/events.ts", "src/data/media.ts", "src/data/socials.ts"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("2097492757690646747"), false, relative);
    }
  });
});