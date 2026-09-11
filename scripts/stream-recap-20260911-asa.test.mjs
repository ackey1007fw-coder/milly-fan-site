import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap20260911Asa as recap } from "../src/data/streamRecap20260911Asa.ts";
import { AUTO_TRANSCRIPT_MATERIAL_NOTE, RANKING_NOTE } from "../src/data/streamRecapRules.ts";

test("September 11 radio recap is registered once and ahead of September 10", () => {
  assert.equal(streamRecaps.filter((item) => item.id === recap.id).length, 1);
  const position = streamRecaps.indexOf(recap);
  const previous = streamRecaps.findIndex((item) => item.id === "2026-09-10-asa-showroom");
  assert.ok(position >= 0 && previous > position);
  assert.equal(recap.date, "2026-09-11");
  assert.equal(recap.dateLabel, "2026.09.11（金）");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.equal(recap.broadcastLabel, "5:11頃〜 約85分");
});

test("September 11 distinguishes media length from recorder bookkeeping", () => {
  assert.ok(recap.transcriptionNote.startsWith(AUTO_TRANSCRIPT_MATERIAL_NOTE));
  assert.match(recap.transcriptionNote, /録画開始記録05:11:19/);
  assert.match(recap.transcriptionNote, /実測85分12秒/);
  assert.match(recap.transcriptionNote, /保存完了までの経過時間とは区別/);
  assert.match(recap.transcriptionNote, /実際の配信開始・終了時刻を確定するものではありません/);
  assert.match(recap.transcriptionNote, /全1821区間/);
  assert.match(recap.transcriptionNote, /主要4区間の再認識/);
  assert.match(recap.transcriptionNote, /全編手動聴取は未実施/);
  assert.doesNotMatch(recap.transcriptionNote, /06:37:22/);
});

test("September 11 keeps historical next-slot guidance and omits unsupported extras", () => {
  assert.match(recap.nextNote, /^配信時点では/);
  assert.match(recap.nextNote, /早くて21時頃/);
  assert.match(recap.nextNote, /短い枠になる可能性/);
  assert.match(recap.nextNote, /現在の配信予定を示すものではありません/);
  assert.deepEqual(recap.ranking, [RANKING_NOTE]);
  for (const field of ["songs", "image", "gallery", "galleryZip"]) assert.equal(recap[field], undefined);
  assert.match(recap.transcriptionNote, /確認した6場面/);
  assert.match(recap.transcriptionNote, /同じ目を閉じたラジオ用の写真/);
  assert.doesNotMatch(JSON.stringify(recap), /残り2日|残り日数|https?:\/\//);
});

test("September 11 source and media decisions are retained in the daily ledger", () => {
  const ledger = readFileSync(new URL("../docs/CONTENT-OPS.md", import.meta.url), "utf8");
  const section = ledger.split("## 2026-09-11 朝のラジオ配信メモ")[1]?.split(/\n## /)[0];
  assert.ok(section, "The dated operational record is required");
  assert.match(section, /オーナー指定/);
  assert.match(section, /5112\.063秒/);
  assert.match(section, /保存完了時刻を配信終了時刻として扱わない/);
  assert.match(section, /全1,821区間/);
  assert.match(section, /計280秒/);
  assert.match(section, /全編手動聴取は未実施/);
  assert.match(section, /実フレーム6場面/);
  assert.match(section, /画像は非掲載/);
});
