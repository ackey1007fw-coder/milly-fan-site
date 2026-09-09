import assert from "node:assert/strict";
import { test } from "node:test";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap20260909Asa as recap } from "../src/data/streamRecap20260909Asa.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE } from "../src/data/streamRecapRules.ts";

test("September 9 morning recap is registered once with the verified recording scope", () => {
  assert.equal(streamRecaps.filter((item) => item.id === recap.id).length, 1);
  assert.ok(streamRecaps.includes(recap));
  assert.equal(recap.dateLabel, "2026.09.09（水）");
  assert.equal(recap.broadcastLabel, "7:43頃〜 約22分");
  assert.equal(recap.highlights.length, 7);
  assert.deepEqual(recap.ranking, [RANKING_NOTE]);
  assert.ok(recap.transcriptionNote.startsWith(AUTO_TRANSCRIPT_MATERIAL_NOTE));
  assert.match(recap.transcriptionNote, /録画開始記録/);
  assert.match(recap.transcriptionNote, /実際の配信開始時刻とは区別/);
  assert.match(recap.transcriptionNote, /録画の長さ/);
});

test("September 9 evening guidance stays historical, without guessed songs or unapproved media", () => {
  assert.match(recap.nextNote, /^配信時点では/);
  assert.match(recap.nextNote, /21時半/);
  assert.match(recap.nextNote, /後ろ倒し/);
  assert.match(recap.nextNote, /現在の配信予定を示すものではありません/);
  assert.equal(recap.songs, undefined);
  assert.equal(recap.image, undefined);
  assert.equal(recap.gallery, undefined);
  assert.equal(recap.galleryZip, undefined);
});
