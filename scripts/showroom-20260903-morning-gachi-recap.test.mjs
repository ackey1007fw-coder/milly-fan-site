import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  streamRecap20260902,
  streamRecap20260902Night,
  streamRecap20260903,
  streamRecaps,
} from "../src/data/streamRecaps.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THUMB_SRC = "/media/live/mily-b52-01-peace-smile.jpg";
const THUMB_FILE = path.join(root, "public", THUMB_SRC.slice(1));
const THUMB_SHA256 =
  "4d5e1e779c243d11fca7dd72e7c0647bb098260ab3340a14dfe2269562e229f4";
const ZIP_SRC = "/media/live/mily-b52-gachi-morning-stills.zip";
const ZIP_FILE = path.join(root, "public", ZIP_SRC.slice(1));

function jpegSize(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error("not a jpeg");
  }
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

describe("2026-09-03 SHOWROOM三次初日朝配信メモ", () => {
  it("stores the first gachi-event morning recap before the September 2 recaps", () => {
    const recap = streamRecap20260903;

    assert.equal(recap.date, "2026-09-03");
    assert.equal(recap.dateLabel, "2026.09.03（木）");
    assert.equal(recap.theme, "朝の配信・三次初日");
    assert.equal(recap.broadcastLabel, "7:30頃〜 約30分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-04");
    assert.match(recap.sourceLabel, /オーナー提供/);
    assert.match(recap.summary, /すっぴん/);
    assert.match(recap.summary, /WEB投票/);
    assert.match(recap.transcriptionNote, /録音音声・画面録画・全文文字起こしは掲載していません/);
    assert.match(recap.transcriptionNote, /10枚/);
    const recapIndex = streamRecaps.indexOf(recap);
    assert.ok(recapIndex >= 0);
    assert.deepEqual(streamRecaps.slice(recapIndex, recapIndex + 3), [
      recap,
      streamRecap20260902Night,
      streamRecap20260902,
    ]);
  });

  it("keeps a concise recap and withholds ranking names", () => {
    const recap = streamRecap20260903;

    assert.equal(recap.highlights.length, 6);
    assert.equal(recap.goals.length, 5);
    assert.equal(recap.ranking.length, 1);
    assert.equal(recap.timeline.length, 12);
    assert.ok(recap.highlights.some(({ title }) => /キラキラ/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /WEB投票/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /トマトの栄養素/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /すっぴん/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /リコピン/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /通過/.test(title)));
    assert.ok(recap.goals.some(({ item }) => item === "三次通過"));
    assert.ok(recap.goals.some(({ item }) => item === "アバター権"));
    assert.match(recap.ranking[0], /個人名は掲載していません/);
    assert.equal(
      streamRecaps.every((item) => item.ranking.length <= 1),
      true,
    );

    const highlightSeconds = recap.highlights.map(({ timestamp }) => {
      const [hour, minute, second] = timestamp.split(":").map(Number);
      return hour * 3600 + minute * 60 + second;
    });
    assert.deepEqual(
      highlightSeconds,
      [...highlightSeconds].sort((left, right) => left - right),
    );

    const seconds = recap.timeline.map(({ timestamp }) => {
      const [hour, minute, second] = timestamp.split(":").map(Number);
      return hour * 3600 + minute * 60 + second;
    });
    assert.deepEqual(seconds, [...seconds].sort((left, right) => left - right));
  });

  it("publishes ten cropped stills, a best-shot thumb, and a download zip", async () => {
    const recap = streamRecap20260903;
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const stills = recap.gallery ?? [];

    assert.equal(stills.length, 10);
    assert.equal(recap.image, stills[0]);
    assert.equal(recap.image?.src, THUMB_SRC);
    assert.equal(recap.image?.width, 400);
    assert.equal(recap.image?.height, 228);
    assert.match(recap.image?.alt ?? "", /ピース/);
    assert.match(recap.image?.caption ?? "", /ベストショット/);
    assert.equal(existsSync(THUMB_FILE), true);
    assert.equal(existsSync(ZIP_FILE), true);
    assert.equal(recap.galleryZip?.src, ZIP_SRC);

    const jpeg = await readFile(THUMB_FILE);
    const size = jpegSize(jpeg);
    assert.equal(size.width, 400);
    assert.equal(size.height, 228);
    assert.equal(jpeg.includes(Buffer.from("Exif")), false);
    assert.equal(createHash("sha256").update(jpeg).digest("hex"), THUMB_SHA256);

    for (const still of stills) {
      const file = path.join(root, "public", still.src.slice(1));
      assert.equal(existsSync(file), true);
      const bytes = await readFile(file);
      const size = jpegSize(bytes);
      assert.equal(size.width, 400);
      assert.equal(size.height, 228);
      assert.equal(bytes.includes(Buffer.from("Exif")), false);
      assert.match(still.alt, /みりぃ/);
      assert.doesNotMatch(still.alt, /コメント|アイコン|視聴者|きょうか/);
      assert.ok(still.downloadName);
    }

    assert.match(page, /recap\.gallery/);
    assert.match(page, /galleryZip/);
    assert.match(page, /この回のスクショ/);
    assert.match(page, /download=\{still\.downloadName/);
    assert.match(page, /recap\.galleryZip\.label/);
    assert.match(page, /max-w-full object-contain/);
    assert.doesNotMatch(
      page,
      /className="mx-auto h-auto w-full max-w-\[640px\] object-contain"/,
    );
    assert.equal(recap.galleryZip?.label, "10枚まとめて保存");
    assert.equal(
      recap.galleryZip?.filename,
      "みりぃ_三次初日朝_かわいいスクショ10枚.zip",
    );
  });

  it("does not leak viewer names, other contestants, or private archive files", async () => {
    const recap = streamRecap20260903;
    const data = await readFile(path.join(root, "src/data/streamRecaps.ts"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const recapText = [
      recap.summary,
      recap.image?.alt ?? "",
      ...(recap.gallery ?? []).flatMap((still) => [still.alt, still.caption ?? ""]),
      ...recap.highlights.flatMap(({ title, body, quote }) => [title, body, quote ?? ""]),
      ...recap.goals.flatMap(({ item, target, statusThen }) => [item, target, statusThen]),
      ...recap.ranking,
      ...recap.timeline.flatMap(({ timestamp, label }) => [timestamp, label]),
      recap.nextNote,
      recap.sourceLabel,
      recap.transcriptionNote,
    ].join("\n");

    assert.doesNotMatch(
      recapText,
      /きょうか|まこと|やすぴ|あっきー|ひげおやじ|ジュンちゃん|マーリー|ホワイトチョコ/,
    );
    assert.doesNotMatch(recapText, /充血|くしゃみ|うんこ|失敗したやん/);
    assert.doesNotMatch(data, /drive\.google\.com|docs\.google\.com\/document/);
    assert.doesNotMatch(ops, /drive\.google\.com|docs\.google\.com\/document/);
    assert.doesNotMatch(data, /\.mp3|\.aac|stt_raw|ScreenRecording/);
    assert.doesNotMatch(data, /公式|公認|本人運営/);
    assert.doesNotMatch(recapText, /Millie|millie/);

    assert.match(recap.nextNote, /14:40/);
    assert.equal(
      news.some((item) => item.id === "2026-09-03-morning-gachi-showroom"),
      false,
    );
    assert.equal(
      events.some((item) => item.id === "2026-09-03-morning-gachi-showroom"),
      false,
    );
    assert.equal(
      highlights.some((item) => item.id === "2026-09-03-morning-gachi-showroom"),
      false,
    );
    assert.equal(JSON.stringify(media).includes("b52-"), false);
    assert.equal(JSON.stringify(galleryVideos).includes("b52-"), false);
    assert.equal(JSON.stringify(news).includes("b52-"), false);
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-03" && slot.time === "07:30"),
      true,
    );
  });
});
