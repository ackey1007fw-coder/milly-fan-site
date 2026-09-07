import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  streamRecap20260903,
  streamRecap20260903Lunch,
  streamRecap20260903Night,
  streamRecaps,
} from "../src/data/streamRecaps.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { contest } from "../src/data/contest.ts";
import { profile } from "../src/data/profile.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COVER_SRC = "/media/live/mily-b54-01-close-smile.jpg";
const BOARD_SRC = "/media/live/mily-b54-02-ouen-board.jpg";
const COVER_SHA256 =
  "97aba78460d282201692a2a13522b100721d359f18de3559ec53a97e6a354a21";
const BOARD_SHA256 =
  "445deb6d73de7196c19a526b1b46daac2c646565964de025d253c704e2097c1e";

function jpegSize(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error("not a jpeg");
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return {
        height: (buffer[offset + 5] << 8) | buffer[offset + 6],
        width: (buffer[offset + 7] << 8) | buffer[offset + 8],
      };
    }
    const length = (buffer[offset + 2] << 8) | buffer[offset + 3];
    offset += 2 + length;
  }
  throw new Error("jpeg size not found");
}

describe("2026-09-03 SHOWROOM三次初日昼配信メモ", () => {
  it("stores the lunch recap above the same-day morning slot", () => {
    const recap = streamRecap20260903Lunch;

    assert.equal(recap.id, "2026-09-03-lunch-gachi-showroom");
    assert.equal(recap.date, "2026-09-03");
    assert.equal(recap.dateLabel, "2026.09.03（木）");
    assert.equal(recap.theme, "昼の配信・三次初日");
    assert.equal(recap.broadcastLabel, "14:40頃〜 約40分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-04");
    assert.match(recap.sourceLabel, /昼配信/);
    assert.match(recap.sourceLabel, /オーナー提供/);
    const lunchIndex = streamRecaps.indexOf(recap);
    assert.ok(lunchIndex > 0, "同じ日の夜枠より後ろに置く");
    assert.equal(streamRecaps[lunchIndex - 1], streamRecap20260903Night);
    assert.equal(streamRecaps[lunchIndex + 1], streamRecap20260903);
  });

  it("keeps the verified content of the lunch slot", () => {
    const recap = streamRecap20260903Lunch;

    assert.equal(recap.highlights.length, 5);
    assert.equal(recap.goals.length, 5);
    assert.equal(recap.timeline.length, 11);
    assert.ok(recap.highlights.some(({ title }) => /応援方法の紙/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /アバター権/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /100キラ/.test(title)));
    assert.ok(recap.goals.some(({ item }) => item === "キラキラ星"));
    assert.ok(recap.goals.some(({ item }) => item === "WEB投票"));
    assert.match(recap.summary, /メイク/);
    assert.match(recap.nextNote, /21:00/);
    assert.match(recap.transcriptionNote, /顔の生成・補正はしていません/);
  });

  it("publishes the two real frames without generative retouching", async () => {
    const recap = streamRecap20260903Lunch;
    const stills = recap.gallery ?? [];

    assert.equal(stills.length, 2);
    assert.equal(recap.image, stills[0]);
    assert.equal(stills[0].src, COVER_SRC);
    assert.equal(stills[1].src, BOARD_SRC);
    assert.match(stills[1].alt, /応援方法の紙/);

    for (const [still, sha] of [
      [stills[0], COVER_SHA256],
      [stills[1], BOARD_SHA256],
    ]) {
      const file = path.join(root, "public", still.src.slice(1));
      assert.equal(existsSync(file), true);
      const bytes = await readFile(file);
      const size = jpegSize(bytes);
      assert.equal(size.width, 1280);
      assert.equal(size.height, 720);
      assert.equal(still.width, 1280);
      assert.equal(still.height, 720);
      assert.equal(bytes.includes(Buffer.from("Exif")), false);
      assert.equal(bytes.includes(Buffer.from("Lavc")), false);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), sha);
      assert.ok(still.downloadName);
      assert.doesNotMatch(still.alt, /コメント|視聴者|アイコン|出場者/);
    }

    assert.equal(recap.galleryZip, undefined);
  });

  it("stays inside the LIVE STREAM card and keeps viewers out of the text", async () => {
    const recap = streamRecap20260903Lunch;
    const data = await readFile(path.join(root, "src/data/streamRecaps.ts"), "utf8");
    const recapText = [
      recap.summary,
      ...(recap.gallery ?? []).flatMap((still) => [still.alt, still.caption ?? ""]),
      ...recap.highlights.flatMap(({ title, body, quote }) => [title, body, quote ?? ""]),
      ...recap.goals.flatMap(({ item, target, statusThen }) => [item, target, statusThen]),
      ...recap.ranking,
      ...recap.timeline.map(({ label }) => label),
      recap.nextNote,
      recap.transcriptionNote,
    ].join("\n");

    assert.doesNotMatch(recapText, /きょうか|やすぴ|あっきー|ひげおやじ|ジュンちゃん/);
    assert.doesNotMatch(recapText, /フレキャン|ミスコン他/);
    assert.doesNotMatch(data, /drive\.google\.com|docs\.google\.com/);

    // b54 は LIVE STREAM の配信カード専用。他の掲載面へ漏らさない。
    for (const [label, collection] of [
      ["media", media],
      ["galleryVideos", galleryVideos],
      ["news", news],
      ["stories", stories],
      ["contest", contest],
      ["profile", profile],
    ]) {
      assert.equal(
        JSON.stringify(collection).includes("b54-"),
        false,
        `${label} に b54 が漏れている`,
      );
    }
    assert.equal(
      news.some((item) => item.id === "2026-09-03-lunch-gachi-showroom"),
      false,
    );
    assert.equal(
      events.some((item) => item.id === "2026-09-03-lunch-gachi-showroom"),
      false,
    );
    assert.equal(
      highlights.some((item) => item.id === "2026-09-03-lunch-gachi-showroom"),
      false,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-03" && slot.time === "14:40"),
      true,
    );
  });
});
