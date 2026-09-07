import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  streamRecap20260902,
  streamRecap20260902Night,
  streamRecaps,
} from "../src/data/streamRecaps.ts";
import { events } from "../src/data/events.ts";
import { news } from "../src/data/news.ts";
import { highlights } from "../src/data/highlights.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("2026-09-02 SHOWROOM夜ラジオ配信メモ", () => {
  it("stores the verified night summary separately from the morning recap", () => {
    const recap = streamRecap20260902Night;

    assert.equal(recap.date, "2026-09-02");
    assert.equal(recap.dateLabel, "2026.09.02（水）");
    assert.equal(recap.theme, "夜のラジオ配信・三次前日");
    assert.equal(recap.broadcastLabel, "21:13頃〜 約74分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-03");
    assert.match(recap.sourceLabel, /オーナー提供/);
    assert.match(recap.sourceLabel, /夜配信/);
    assert.match(recap.summary, /三次前日/);
    assert.match(recap.transcriptionNote, /録音音声・画面録画・全文文字起こしは掲載していません/);
    assert.ok(streamRecaps.includes(recap));
    assert.ok(
      streamRecaps.indexOf(streamRecap20260902Night) <
        streamRecaps.indexOf(streamRecap20260902),
    );
  });

  it("keeps a short recap and withholds ranking names", () => {
    const recap = streamRecap20260902Night;

    assert.equal(recap.highlights.length, 3);
    assert.equal(recap.goals.length, 5);
    assert.equal(recap.ranking.length, 1);
    assert.equal(recap.timeline.length, 10);
    assert.ok(recap.highlights.some(({ title }) => /通過/.test(title)));
    assert.ok(recap.highlights.some(({ body }) => /スーツ謝罪会見/.test(body)));
    assert.ok(recap.highlights.some(({ title }) => /海くん/.test(title)));
    assert.ok(recap.goals.some(({ item }) => item === "三次通過"));
    assert.match(recap.ranking[0], /個人名は掲載していません/);
    assert.equal(streamRecap20260902.ranking.length, 1);
    assert.match(streamRecap20260902.ranking[0], /個人名は掲載していません/);
    assert.deepEqual(recap.image, streamRecap20260902.image);
    assert.equal(recap.image?.src, "/media/live/mily-b51-01-morning-radio-showroom.jpg");
    assert.equal(recap.image?.caption, "配信中に使われていた静止画");

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

  it("does not promote tentative slots, other contest names, or private archive files", async () => {
    const recap = streamRecap20260902Night;
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const data = await readFile(path.join(root, "src/data/streamRecaps.ts"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(page, /function StreamRecap/);
    assert.match(page, /activityId !== "live-stream"/);
    assert.match(page, /streamRecaps\.map/);
    assert.match(page, /defaultOpen/);
    assert.match(page, /この回の見どころ/);
    assert.match(page, /この回の目標/);
    assert.match(page, /タイムスタンプと次枠/);
    assert.match(page, /<StreamRecap activityId=\{content\.activity\.id\} \/>/);
    assert.doesNotMatch(page, /function StreamRankingList/);

    assert.match(recap.nextNote, /7:30/);
    assert.match(recap.nextNote, /14:40/);
    assert.match(recap.nextNote, /21:00/);
    assert.doesNotMatch(data, /いくちゃん|ゆめちゃん/);
    assert.doesNotMatch(recap.summary, /フレキャン/);
    assert.equal(recap.ranking.length, 1);
    assert.equal(
      streamRecaps.every((item) => item.ranking.length <= 1),
      true,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-05" && slot.time === "05:30"),
      false,
    );
    assert.equal(
      events.some((item) => item.id === "2026-09-02-night-showroom"),
      false,
    );
    assert.equal(
      news.some((item) => item.id === "2026-09-02-night-showroom"),
      false,
    );
    assert.equal(
      highlights.some((item) => item.id === "2026-09-02-night-showroom"),
      false,
    );

    for (const source of [data, ops]) {
      assert.doesNotMatch(source, /drive\.google\.com|docs\.google\.com\/document/);
    }
    assert.doesNotMatch(data, /\.mp3|\.aac|stream\.ts|stt_raw/);
    assert.doesNotMatch(data, /公式|公認|本人運営/);
  });
});
