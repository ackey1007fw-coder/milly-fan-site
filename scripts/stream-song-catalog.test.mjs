import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { it } from "node:test";
import { buildStreamSongCatalog, selectCatalogSongs, catalogArtists, catalogBroadcastCount } from "../src/lib/streamSongCatalog.ts";

const original = "https://www.youtube.com/watch?v=aRDURmIYBZ4";
const karaoke = { youtubeUrl: "https://www.youtube.com/watch?v=W5ykal8c4rY", channel: "カラオケ歌っちゃ王" };
const song = (overrides = {}) => ({ title: "Mela!", artist: "緑黄色社会", timestamp: "0:09:20", youtubeUrl: original, ...overrides });
const recap = (id, songs, overrides = {}) => ({ id, date: id.slice(0, 10), dateLabel: id.slice(0, 10), theme: "朝の歌", broadcastLabel: "9:01頃〜 約23分", songs, ...overrides });

it("catalog unit: ignores empty recaps and does not infer singing from summaries", () => {
  assert.deepEqual(buildStreamSongCatalog([recap("2026-09-05-day", undefined, { summary: "Mela!を振り返る" })]), []);
});
it("catalog unit: preserves the linked recording version without borrowing an older URL's note", () => {
  const older = song({ youtubeVersionNote: "公式企画動画。原盤音源とは異なります。" });
  const newer = song({ youtubeUrl: "https://www.youtube.com/watch?v=l8-RA3B0YRc" });
  assert.equal(buildStreamSongCatalog([recap("2026-08-18-night", [older])])[0].youtubeVersionNote, older.youtubeVersionNote);
  const merged = buildStreamSongCatalog([recap("2026-08-18-night", [older]), recap("2026-08-25-morning", [newer])])[0];
  assert.equal(merged.youtubeUrl, newer.youtubeUrl);
  assert.equal(merged.youtubeVersionNote, undefined);
});
it("catalog unit: merges the same song across broadcasts without mutating input", () => {
  const input = [recap("2026-09-05-asa", [song({ karaoke })]), recap("2026-09-06-asa", [song()])];
  const before = JSON.stringify(input);
  const result = buildStreamSongCatalog(input);
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].performances.map((p) => p.id), ["2026-09-06-asa", "2026-09-05-asa"]);
  assert.equal(catalogBroadcastCount(result), 2);
  assert.equal(result[0].youtubeUrl, original);
  assert.deepEqual(result[0].karaoke, karaoke);
  assert.notEqual(result[0].karaoke, karaoke);
  assert.equal(JSON.stringify(input), before);
});
it("catalog unit: normalizes width and case but preserves artist and version distinctions", () => {
  const songs = [song(), song({ title: " Ｍｅｌａ！ " }), song({ artist: "別のアーティスト" }), song({ title: "Mela! (Acoustic)" })];
  const result = buildStreamSongCatalog([recap("2026-09-05-asa", songs)]);
  assert.equal(result.length, 3);
  assert.equal(result[0].performances.length, 1);
});
it("catalog unit: retains separate repeat performances but counts unique broadcasts", () => {
  const result = buildStreamSongCatalog([recap("2026-09-05-asa", [song(), song(), song({ timestamp: "0:20:00" })])]);
  assert.equal(result[0].performances.length, 2);
  assert.equal(catalogBroadcastCount(result), 1);
});
it("catalog unit: sorts same-day broadcasts by their starting time", () => {
  const result = buildStreamSongCatalog([
    recap("2026-09-05-asa", [song()]),
    recap("2026-09-05-night", [song()], { broadcastLabel: "21:01頃〜 約47分" }),
  ]);
  assert.equal(result[0].performances[0].id, "2026-09-05-night");
});
it("catalog unit: supports multiple search terms, full-width text and exact artist filtering", () => {
  const result = buildStreamSongCatalog([recap("2026-09-05-asa", [song(), song({ title: "Other", artist: "別の人" })])]);
  assert.equal(selectCatalogSongs(result, "ｍＥＬＡ　緑黄").length, 1);
  assert.equal(selectCatalogSongs(result, "", "別の人").length, 1);
  assert.equal(selectCatalogSongs(result, "Mela", "別の人").length, 0);
  assert.equal(selectCatalogSongs(result, "unknown").length, 0);
  assert.equal(selectCatalogSongs(result, "   ").length, 2);
  assert.deepEqual(new Set(catalogArtists(result)), new Set(["緑黄色社会", "別の人"]));
});
it("catalog unit: supports recent and title ordering without sorting the source in place", () => {
  const result = buildStreamSongCatalog([
    recap("2026-09-06-asa", [song({ title: "Z" })]),
    recap("2026-09-05-asa", [song({ title: "A" })]),
  ]);
  const before = JSON.stringify(result);
  assert.deepEqual(selectCatalogSongs(result).map((s) => s.title), ["Z", "A"]);
  assert.deepEqual(selectCatalogSongs(result, "", "", "title").map((s) => s.title), ["A", "Z"]);
  assert.equal(JSON.stringify(result), before);
});
it("catalog unit: future verified recaps join the catalog without a second song list", () => {
  const input = [recap("2026-09-05-asa", [song()])];
  assert.equal(buildStreamSongCatalog(input).length, 1);
  input.push(recap("2026-09-06-asa", [song({ title: "Another song" })]));
  assert.equal(buildStreamSongCatalog(input).length, 2);
  assert.equal(catalogBroadcastCount(buildStreamSongCatalog(input)), 2);
});
it("catalog integration: includes every approved song and no discussion-only recap", async () => {
  const { streamRecaps, streamRecap20260905Day } = await import("../src/data/streamRecaps.ts");
  const { withoutApprovedSongLinks } = await import("./approved-song-links.mjs");
  const result = buildStreamSongCatalog(streamRecaps);
  const normalize = (value) => value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("ja");
  const expected = new Set();
  for (const r of streamRecaps) {
    for (const s of r.songs ?? []) expected.add(JSON.stringify([normalize(s.title), normalize(s.artist), r.id, s.timestamp]));
  }
  const actual = new Set();
  for (const entry of result) {
    assert.equal(withoutApprovedSongLinks(entry.youtubeUrl), "[approved song link]");
    if (entry.karaoke) assert.equal(withoutApprovedSongLinks(entry.karaoke.youtubeUrl), "[approved song link]");
    for (const p of entry.performances) {
      const identity = JSON.stringify([normalize(entry.title), normalize(entry.artist), p.id, p.timestamp]);
      assert.ok(expected.has(identity));
      actual.add(identity);
    }
  }
  assert.deepEqual(actual, expected);
  assert.ok(result.every((entry) => entry.performances.every((p) => p.id !== streamRecap20260905Day.id)));
});
it("catalog integration: live-only UI has safe links, honest coverage and working recap anchors", () => {
  const page = readFileSync(new URL("../src/ActivitiesPage.tsx", import.meta.url), "utf8");
  const ui = readFileSync(new URL("../src/components/StreamSongCatalog.tsx", import.meta.url), "utf8");
  assert.match(page, /content\.activity\.id === "live-stream" \? <StreamSongCatalog \/>/);
  assert.match(page, /id=\{`recap-\$\{recap\.id\}`\}/);
  assert.match(page, /addEventListener\("hashchange", openLinkedRecap\)/);
  assert.match(page, /removeEventListener\("hashchange", openLinkedRecap\)/);
  assert.match(ui, /href=\{`#recap-\$\{performance\.id\}`\}/);
  assert.match(ui, /過去の全配信を網羅した一覧ではありません/);
  assert.match(ui, /みりぃの歌唱映像ではありません/);
  assert.match(ui, /配信での使用音源は未確認/);
  assert.match(ui, /type="search"/);
  assert.match(ui, /role="status"/);
  assert.equal((ui.match(/target="_blank"/g) ?? []).length, (ui.match(/rel="noopener noreferrer"/g) ?? []).length);
  assert.doesNotMatch(ui, /<(?:iframe|video|audio)\b/);
});
