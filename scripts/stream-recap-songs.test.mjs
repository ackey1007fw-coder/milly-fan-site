import assert from "node:assert/strict";
import { it } from "node:test";
import { withoutApprovedSongLinks } from "./approved-song-links.mjs";
import { streamRecaps, streamRecap20260905Day } from "../src/data/streamRecaps.ts";

it("keeps song links on individual official YouTube videos with ordered recording positions", () => {
  for (const recap of streamRecaps) {
    let previous = -1;
    for (const song of recap.songs ?? []) {
      assert.ok(song.title.trim());
      assert.ok(song.artist.trim());
      assert.match(song.timestamp, /^\d+:\d{2}:\d{2}$/);
      const parts = song.timestamp.split(":").map(Number);
      assert.ok(parts[1] < 60 && parts[2] < 60);
      const seconds = parts.reduce((n, value) => n * 60 + value, 0);
      assert.ok(seconds >= previous);
      previous = seconds;
      const url = new URL(song.youtubeUrl);
      assert.equal(withoutApprovedSongLinks(song.youtubeUrl), "[approved song link]");
      assert.equal(url.protocol, "https:");
      assert.equal(url.hostname, "www.youtube.com");
      assert.equal(url.pathname, "/watch");
      assert.match(url.searchParams.get("v"), /^[A-Za-z0-9_-]{11}$/);
    }
  }
});

it("continues detecting unapproved links and altered versions of approved URLs", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=TEST_VIDEO1",
    "https://www.youtube.com/watch?v=aRDURmIYBZ4&extra=1",
    "https://example.com/recording",
  ]) assert.equal(withoutApprovedSongLinks(url), url);
});

it("does not turn the September 5 afternoon discussion of the morning song into a performance", () => {
  assert.equal(streamRecap20260905Day.songs?.length ?? 0, 0);
});

it("keeps reference karaoke separate from original recordings and requires an identified creator", () => {
  for (const recap of streamRecaps) {
    for (const song of recap.songs ?? []) {
      if (!song.karaoke) continue;
      assert.ok(song.karaoke.channel.trim());
      assert.notEqual(song.karaoke.youtubeUrl, song.youtubeUrl);
      assert.equal(withoutApprovedSongLinks(song.karaoke.youtubeUrl), "[approved song link]");
    }
  }
});
