import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { streamRecapRulesPublicCopy } from "./stream-recap-rules-copy.mjs";
import { fileURLToPath } from "node:url";
import {
  streamRecap20260902,
  streamRecap20260902Night,
  streamRecap20260903,
  streamRecap20260903Night,
  streamRecap20260904Day,
  streamRecap20260904Asa,
  streamRecap20260903Lunch,
  streamRecaps,
} from "../src/data/streamRecaps.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THUMB_SRC = "/media/live/mily-b55-01-smile.jpg";
const THUMB_FILE = path.join(root, "public", THUMB_SRC.slice(1));
const THUMB_SHA256 =
  "501f2178cd3ccec5dc6423a5694e50898ba4d7b9835db2fb19ca15d25baa1e16";
const ZIP_SRC = "/media/live/mily-b55-gachi-morning-stills.zip";
const ZIP_FILE = path.join(root, "public", ZIP_SRC.slice(1));
const RECAP_FILE = path.join(root, "src/data/streamRecap20260904Asa.ts");

// Git blob ID of the reviewed PUBLIC source, not a hash/list of private names.
// Covers copy, captions, filenames, source labels, and comments. Rebaseline only
// after another content/privacy review; never copy viewer names into fixtures.
const APPROVED_RECAP_BLOB_SHA = "6bd6620d7a1d468f56c6bdcfdf2a4b162b400341";
// 公開文は共有定数からも組み立てるので、そちらの変更も再レビュー対象にする。
// ファイル全体ではなく、実際にページへ出る文だけを対象にする（コメントの手直しで
// baseline が動くと、再レビューの意味が薄れるため）。
const APPROVED_RULES_COPY_SHA = "aa8b785c6233d172a166212fd11df4db615d9720";

function gitBlobSha(source) {
  // Match Git's LF-normalized source on Windows checkouts as well as CI.
  const bytes = Buffer.from(source.replace(/\r\n/g, "\n"), "utf8");
  return createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
}

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

describe("2026-09-04 SHOWROOM三次2日目朝配信メモ", () => {
  it("stores the second-day morning recap after the lunch recap", () => {
    const recap = streamRecap20260904Asa;

    assert.equal(recap.date, "2026-09-04");
    assert.equal(recap.dateLabel, "2026.09.04（金）");
    assert.equal(recap.theme, "朝の配信・三次2日目");
    assert.equal(recap.broadcastLabel, "07:12頃〜 約31分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-05");
    assert.match(recap.sourceLabel, /オーナー提供/);
    assert.match(recap.summary, /灰色パーカー/);
    assert.match(recap.summary, /スーツ/);
    assert.match(recap.transcriptionNote, /録音音声・画面録画・全文文字起こしは掲載していません/);
    assert.match(recap.transcriptionNote, /5枚/);
    const dayIndex = streamRecaps.indexOf(streamRecap20260904Day);
    assert.ok(dayIndex >= 0);
    assert.deepEqual(streamRecaps.slice(dayIndex, dayIndex + 7), [
      streamRecap20260904Day,
      recap,
      streamRecap20260903Night,
      streamRecap20260903Lunch,
      streamRecap20260903,
      streamRecap20260902Night,
      streamRecap20260902,
    ]);
  });

  it("keeps a concise recap and withholds ranking names", () => {
    const recap = streamRecap20260904Asa;

    assert.equal(recap.highlights.length, 6);
    assert.equal(recap.goals.length, 5);
    assert.equal(recap.ranking.length, 1);
    assert.equal(recap.timeline.length, 11);
    assert.ok(recap.highlights.some(({ title }) => /謝罪/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /スーツ/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /ペン/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /キラキラ/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /22:30/.test(title)));
    assert.ok(recap.highlights.some(({ title }) => /おつみり/.test(title)));
    assert.ok(recap.goals.some(({ item }) => item === "三次通過"));
    assert.ok(recap.goals.some(({ item }) => item === "夜枠"));
    assert.deepEqual(recap.ranking, [
      "配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。",
    ]);
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

  it("publishes five cropped stills, a best-shot thumb, and a download zip", async () => {
    const recap = streamRecap20260904Asa;
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const stills = recap.gallery ?? [];

    assert.equal(stills.length, 5);
    assert.equal(recap.image, stills[0]);
    assert.equal(recap.image?.src, THUMB_SRC);
    assert.equal(recap.image?.width, 400);
    assert.equal(recap.image?.height, 228);
    assert.match(recap.image?.alt ?? "", /笑顔|微笑/);
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
      const stillSize = jpegSize(bytes);
      assert.equal(stillSize.width, 400);
      assert.equal(stillSize.height, 228);
      assert.equal(bytes.includes(Buffer.from("Exif")), false);
      assert.match(still.alt, /みりぃ/);
      assert.doesNotMatch(still.alt, /コメント|アイコン|視聴者/);
      assert.ok(still.downloadName);
    }

    assert.match(page, /recap\.gallery/);
    assert.match(page, /galleryZip/);
    assert.match(page, /この回のスクショ/);
    assert.match(page, /download=\{still\.downloadName/);
    assert.match(page, /recap\.galleryZip\.label/);
    assert.match(page, /max-w-full object-contain/);
    assert.equal(recap.galleryZip?.label, "5枚まとめて保存");
    assert.equal(
      recap.galleryZip?.filename,
      "みりぃ_三次2日目朝_スクショ5枚.zip",
    );
  });

  it("locks reviewed public source without storing private-name fixtures", async () => {
    assert.equal(
      gitBlobSha(streamRecapRulesPublicCopy),
      APPROVED_RULES_COPY_SHA,
      "共有注記の公開文が変わりました。読み直してから baseline を更新してください。",
    );
    const source = await readFile(RECAP_FILE, "utf8");
    assert.equal(
      gitBlobSha(source),
      APPROVED_RECAP_BLOB_SHA,
      "Public recap source changed: review all copy and metadata before updating the baseline.",
    );
    assert.equal(gitBlobSha(source.replace(/\r?\n/g, "\r\n")), APPROVED_RECAP_BLOB_SHA);

    // A deliberately synthetic marker proves unreviewed additions are rejected.
    const changed = source.replace("WEB投票", "TEST_VIEWER_001");
    assert.notEqual(changed, source);
    assert.notEqual(gitBlobSha(changed), APPROVED_RECAP_BLOB_SHA);
    assert.notEqual(gitBlobSha(`${source}\n// TEST_VIEWER_001\n`), APPROVED_RECAP_BLOB_SHA);
  });

  it("does not expose private archive files or publish outside LIVE STREAM", async () => {
    const recap = streamRecap20260904Asa;
    const data = await readFile(path.join(root, "src/data/streamRecaps.ts"), "utf8");
    const recapFile = await readFile(RECAP_FILE, "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const mediaGuide = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
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

    assert.doesNotMatch(recapText, /充血|くしゃみ/);
    assert.doesNotMatch(data, /drive\.google\.com|docs\.google\.com\/document/);
    assert.doesNotMatch(recapFile, /drive\.google\.com|docs\.google\.com\/document/);
    assert.doesNotMatch(ops, /drive\.google\.com|docs\.google\.com\/document/);
    assert.match(mediaGuide, /batch b55/);
    assert.equal(mediaGuide.includes(THUMB_SHA256), true);
    assert.doesNotMatch(mediaGuide, /drive\.google\.com|docs\.google\.com\/document/);
    assert.doesNotMatch(data, /\.mp3|\.aac|stt_raw|ScreenRecording/);
    assert.doesNotMatch(recapFile, /\.mp3|\.aac|stt_raw|ScreenRecording/);
    assert.doesNotMatch(data, /公式|公認|本人運営/);
    assert.doesNotMatch(recapText, /Millie|millie/);

    assert.match(recap.nextNote, /22:30/);
    assert.match(recap.nextNote, /23:40/);
    assert.equal(
      news.some((item) => item.id === "2026-09-04-morning-gachi-showroom"),
      false,
    );
    assert.equal(
      events.some((item) => item.id === "2026-09-04-morning-gachi-showroom"),
      false,
    );
    assert.equal(
      highlights.some((item) => item.id === "2026-09-04-morning-gachi-showroom"),
      false,
    );
    assert.equal(JSON.stringify(media).includes("b55-"), false);
    assert.equal(JSON.stringify(galleryVideos).includes("b55-"), false);
    assert.equal(JSON.stringify(news).includes("b55-"), false);
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-04" && slot.time === "07:00"),
      true,
    );
    assert.equal(
      streamSchedule.some(
        (slot) =>
          slot.date === "2026-09-04" && slot.time === "22:30" && slot.endTime === "23:30",
      ),
      true,
    );
  });
});
