import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { streamRecapRulesPublicCopy } from "./stream-recap-rules-copy.mjs";
import {
  streamRecap20260904Night as recap,
  streamRecap20260904Day,
  streamRecap20260904Asa,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

const RECAP_FILE = new URL("../src/data/streamRecap20260904Night.ts", import.meta.url);
// Baseline of reviewed PUBLIC copy only. Do not store private names in fixtures.
const APPROVED_RECAP_BLOB_SHA = "0a86fc7b7cd834d247cc96e4267a94d0ad2bd364";
// 公開文は共有定数からも組み立てるので、そちらの変更も再レビュー対象にする。
// ファイル全体ではなく、実際にページへ出る文だけを対象にする（コメントの手直しで
// baseline が動くと、再レビューの意味が薄れるため）。
const APPROVED_RULES_COPY_SHA = "aa8b785c6233d172a166212fd11df4db615d9720";

function gitBlobSha(source) {
  const bytes = Buffer.from(source.replace(/\r\n/g, "\n"), "utf8");
  return createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
}

function seconds(timestamp) {
  assert.match(timestamp, /^\d+:\d{2}:\d{2}$/);
  const [hour, minute, second] = timestamp.split(":").map(Number);
  assert.ok(minute < 60 && second < 60);
  return hour * 3600 + minute * 60 + second;
}

describe("2026-09-04 SHOWROOM夜配信メモ", () => {
  it("orders the night before the day and morning without duplicating any recap", () => {
    assert.equal(recap.id, "2026-09-04-night-gachi-showroom");
    assert.equal(recap.dateLabel, "2026.09.04（金）");
    assert.equal(recap.broadcastLabel, "22:32頃〜 約67分");
    assert.equal(recap.platformLabel, "SHOWROOM");
    assert.equal(recap.verifiedAt, "2026-09-05");
    assert.deepEqual(streamRecaps.filter((item) => item.date === "2026-09-04"), [
      recap, streamRecap20260904Day, streamRecap20260904Asa,
    ]);
    const dates = streamRecaps.map((item) => item.date);
    assert.deepEqual(dates, [...dates].sort().reverse());
    assert.equal(new Set(streamRecaps.map((item) => item.id)).size, streamRecaps.length);
  });

  it("keeps the motto, gratitude and support in a concise text-only card", () => {
    assert.match(recap.summary, /喜怒哀楽を楽しむ/);
    assert.match(recap.summary, /感謝/);
    assert.equal(recap.highlights.length, 5);
    assert.deepEqual(recap.goals.map((goal) => goal.item), ["WEB投票", "キラキラ"]);
    assert.equal(recap.ranking.length, 1);
    assert.match(recap.ranking[0], /個人名は掲載していません/);
    assert.doesNotMatch(recap.ranking[0], /\d+位/);
    for (const field of ["image", "gallery", "galleryZip"]) {
      assert.equal(Object.hasOwn(recap, field), false);
    }
  });

  it("marks source limitations and keeps next-day announcements historical", () => {
    assert.match(recap.sourceLabel, /配信レポート・文字起こし抜粋（オーナー提供）/);
    assert.doesNotMatch(recap.sourceLabel, /動画確認|音声確認/);
    assert.match(recap.transcriptionNote, /タイムスタンプ.*目安/);
    assert.match(recap.transcriptionNote, /再確認は行っていません/);
    assert.match(recap.transcriptionNote, /録音音声・画面録画・全文文字起こしは掲載していません/);
    assert.match(recap.nextNote, /配信時点では、翌9月5日/);
    assert.match(recap.nextNote, /ファンルームで案内すると話していました/);
    assert.doesNotMatch(recap.nextNote, /\d{1,2}:\d{2}/);
    for (const items of [recap.highlights, recap.timeline]) {
      const times = items.map((item) => seconds(item.timestamp));
      assert.deepEqual(times, [...times].sort((a, b) => a - b));
      assert.ok(times.every((time) => time >= 0 && time <= 67 * 60 + 18));
    }
  });

  it("locks reviewed public copy without private-name or private-source fixtures", async () => {
    assert.equal(
      gitBlobSha(streamRecapRulesPublicCopy),
      APPROVED_RULES_COPY_SHA,
      "共有注記の公開文が変わりました。読み直してから baseline を更新してください。",
    );
    const source = await readFile(RECAP_FILE, "utf8");
    assert.equal(gitBlobSha(source), APPROVED_RECAP_BLOB_SHA);
    assert.equal(gitBlobSha(source.replace(/\r?\n/g, "\r\n")), APPROVED_RECAP_BLOB_SHA);
    assert.notEqual(gitBlobSha(`${source}\n// TEST_VIEWER_001\n`), APPROVED_RECAP_BLOB_SHA);
    assert.doesNotMatch(source, /https?:\/\/|data:|\.mp3|\.aac|\.mp4|\.zip/);
  });

  it("does not cross-post the recap into news, schedules, gallery or profile", async () => {
    for (const filename of [
      "news.ts", "events.ts", "highlights.ts", "media.ts", "galleryVideos.ts",
      "streamSchedule.ts", "contest.ts", "profile.ts",
    ]) {
      const source = await readFile(new URL(`../src/data/${filename}`, import.meta.url), "utf8");
      assert.equal(source.includes(recap.id), false, filename);
      assert.equal(source.includes("streamRecap20260904Night"), false, filename);
    }
  });
});
