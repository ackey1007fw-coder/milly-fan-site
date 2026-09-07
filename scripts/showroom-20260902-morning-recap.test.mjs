import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { streamRecap20260902 } from "../src/data/streamRecaps.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STILL_SRC = "/media/live/mily-b51-01-morning-radio-showroom.jpg";
const STILL_FILE = path.join(root, "public", STILL_SRC.slice(1));
const STILL_SHA256 =
  "a00eea08f642532348bc967ad3adeb130494a6828d1306f5fe23a0198490c4a8";

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

describe("2026-09-02 SHOWROOM朝ラジオ配信メモ", () => {
  it("stores the verified stream summary separately from schedule state", () => {
    const recap = streamRecap20260902;

    assert.equal(recap.date, "2026-09-02");
    assert.equal(recap.dateLabel, "2026.09.02（水）");
    assert.equal(recap.theme, "朝のラジオ配信");
    assert.equal(recap.broadcastLabel, "9:02頃〜 約62分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-03");
    assert.match(recap.sourceLabel, /オーナー提供/);
    assert.match(recap.summary, /みんなの太陽/);
    assert.match(recap.transcriptionNote, /録音音声・画面録画・全文文字起こしは掲載していません/);
    assert.match(recap.transcriptionNote, /静止画は録画の実フレームを1枚だけ掲載/);
  });

  it("keeps a concise, video-confirmed recap and withholds ranking names", () => {
    const recap = streamRecap20260902;

    assert.equal(recap.highlights.length, 8);
    assert.equal(recap.goals.length, 3);
    assert.equal(recap.ranking.length, 1);
    assert.equal(recap.timeline.length, 14);
    assert.ok(recap.highlights.some(({ title }) => /花束/.test(title)));
    assert.ok(recap.highlights.some(({ title, body }) => /未完成/.test(`${title} ${body}`)));
    assert.ok(recap.highlights.some(({ body }) => /通学に約2時間/.test(body)));
    assert.ok(recap.highlights.some(({ title }) => /太陽/.test(title)));
    assert.ok(recap.goals.some(({ item }) => item === "フォロワー"));
    assert.match(recap.ranking[0], /個人名は掲載していません/);

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

  it("shows the radio still on the morning card without publishing the recording", async () => {
    const recap = streamRecap20260902;
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const still = recap.image;

    assert.ok(still);
    assert.equal(still.src, STILL_SRC);
    assert.equal(still.width, 640);
    assert.equal(still.height, 360);
    assert.match(still.alt, /静止画/);
    assert.match(still.alt, /みりぃ/);
    assert.match(still.alt, /SHOWROOM/);
    assert.match(still.alt, /木の椅子/);
    assert.doesNotMatch(still.alt, /花束|ブーケ|コメント|アイコン|視聴者/);
    assert.equal(still.caption, "配信中に使われていた静止画");
    assert.equal(existsSync(STILL_FILE), true);

    const jpeg = await readFile(STILL_FILE);
    const size = jpegSize(jpeg);
    assert.equal(size.width, 640);
    assert.equal(size.height, 360);
    assert.equal(jpeg.subarray(0, 4).includes(0xff), true);
    assert.equal(jpeg.includes(Buffer.from("Exif")), false);
    assert.equal(createHash("sha256").update(jpeg).digest("hex"), STILL_SHA256);

    assert.match(page, /recap\.image/);
    assert.match(page, /object-contain/);
    assert.match(page, /max-w-\[640px\]/);
    assert.match(page, /recap\.image\.caption/);
    assert.match(page, /<figcaption/);
    assert.match(page, /recap\.transcriptionNote/);
    assert.match(page, /画像がある回は静止画も残します/);
    assert.doesNotMatch(page, /streamRecaps\[0\]\?\.transcriptionNote/);
  });

  it("does not promote same-day slots, profile numbers, or private archive files", async () => {
    const recap = streamRecap20260902;
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const data = await readFile(path.join(root, "src/data/streamRecaps.ts"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const morningText = [
      recap.summary,
      recap.image?.alt ?? "",
      recap.image?.src ?? "",
      ...recap.highlights.flatMap(({ title, body, quote }) => [title, body, quote ?? ""]),
      ...recap.goals.flatMap(({ item, target, statusThen }) => [item, target, statusThen]),
      ...recap.ranking,
      ...recap.timeline.flatMap(({ timestamp, label }) => [timestamp, label]),
      recap.nextNote,
      recap.sourceLabel,
      recap.transcriptionNote,
    ].join("\n");

    assert.match(page, /function StreamRecap/);
    assert.match(page, /activityId !== "live-stream"/);
    assert.match(page, /defaultOpen/);
    assert.match(page, /この回の見どころ/);
    assert.match(page, /この回の目標/);
    assert.match(page, /タイムスタンプと次枠/);
    assert.match(page, /<StreamRecap activityId=\{content\.activity\.id\} \/>/);

    assert.match(recap.nextNote, /14:40/);
    assert.doesNotMatch(data, /帰宅ラッシュ/);
    assert.doesNotMatch(morningText, /ハルルン|ヒロさん|まこちゃん|あっきーさん|ひげおやじさん/);
    assert.doesNotMatch(
      morningText,
      /湘南新宿ライン|東海道線|横浜から東京方面|日大まで片道約2時間|仕事中に来てくれた人|通勤ラッシュ/,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-02" && slot.time === "14:40"),
      false,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-02"),
      false,
    );
    assert.equal(
      events.some((item) => item.id === "2026-09-02-morning-showroom"),
      false,
    );
    assert.equal(
      news.some((item) => item.id === "2026-09-02-morning-showroom"),
      false,
    );
    assert.equal(
      highlights.some((item) => item.id === "2026-09-02-morning-showroom"),
      false,
    );
    assert.equal(
      JSON.stringify(media).includes("b51-01"),
      false,
    );
    assert.equal(
      JSON.stringify(galleryVideos).includes("b51-01"),
      false,
    );
    assert.equal(
      JSON.stringify(news).includes("b51-01"),
      false,
    );

    for (const source of [data, ops]) {
      assert.doesNotMatch(source, /drive\.google\.com|docs\.google\.com\/document/);
    }
    assert.doesNotMatch(data, /\.mp3|\.aac|stream\.ts|stt_raw/);
    assert.doesNotMatch(data, /公式|公認|本人運営/);
  });
});
