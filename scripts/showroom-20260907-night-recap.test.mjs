import assert from "node:assert/strict";
import { withoutApprovedSongLinks } from "./approved-song-links.mjs";
import { readFile } from "node:fs/promises";
import { it } from "node:test";
import {
  streamRecap20260907Night as recap,
  streamRecap20260907Asa,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

const DURATION_SECONDS = 72 * 60 + 48;

it("places the September 7 night recording before that morning recording with valid source-relative timestamps", () => {
  assert.ok(streamRecaps.includes(recap));
  assert.equal(streamRecaps.filter((item) => item.date === recap.date)[0], recap);
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.indexOf(streamRecap20260907Asa));
  assert.equal(recap.date, streamRecap20260907Asa.date);
  for (const items of [recap.highlights, recap.timeline]) {
    const times = items.map(({ timestamp }) =>
      timestamp.split(":").reduce((n, v) => n * 60 + Number(v), 0),
    );
    assert.deepEqual(times, [...times].sort((a, b) => a - b));
    assert.ok(times.every((t) => t >= 0 && t <= DURATION_SECONDS));
  }
  assert.equal(recap.image, undefined);
  assert.equal(recap.gallery, undefined);
  assert.equal(recap.ranking.length, 0);
  assert.match(recap.nextNote, /配信時点/);
  assert.match(recap.nextNote, /7時半/);
  assert.doesNotMatch(recap.nextNote, /streamSchedule|07:00|8:20/);
  assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
  assert.match(recap.transcriptionNote, /静止画は掲載していません/);
  assert.ok(recap.highlights.every((h) => !h.quote));
});

it("records the confirmed night song with official original and reference karaoke links", async () => {
  assert.equal(recap.songs?.length, 1);
  const [song] = recap.songs;
  assert.equal(song.title, "366日");
  assert.equal(song.artist, "HY");
  assert.equal(song.timestamp, "0:44:00");
  assert.equal(song.youtubeUrl, "https://www.youtube.com/watch?v=glsH4Mgxz-g");
  assert.equal(song.karaoke?.channel, "EdKara");
  assert.equal(song.karaoke?.youtubeUrl, "https://www.youtube.com/watch?v=OwV-IccMBZs");
  assert.notEqual(song.karaoke?.youtubeUrl, song.youtubeUrl);
  const source = await readFile(new URL("../src/data/streamRecap20260907Night.ts", import.meta.url), "utf8");
  assert.doesNotMatch(withoutApprovedSongLinks(source), /https?:\/\/|data:|\.mp4|\.mp3/);
  assert.doesNotMatch(source, /drive\.google\.com|docs\.google\.com/);
});
