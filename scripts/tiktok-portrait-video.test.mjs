import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { it } from "node:test";
import { galleryVideos, tiktokPortraitVideo, visibleGalleryVideos } from "../src/data/galleryVideos.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { news as previousNews } from "./fixtures/news-before-b58.ts";
import { galleryVideos as previous } from "./fixtures/gallery-videos-before-b58.ts";

it("shares the owner-dated TikTok between Latest and Gallery", async () => {
  const item = tiktokPortraitVideo;
  assert.equal(item.sourceDate, "2026-09-05");
  assert.equal(item.sourceUrl, "https://vt.tiktok.com/ZSqNgRAvx/");
  assert.deepEqual(visibleGalleryVideos().filter(({ id }) => id === item.id), [item]);
  assert.equal(galleryVideos.length, previous.length + 2);
  assert.deepEqual(
    galleryVideos.filter(
      ({ id }) => id !== item.id && id !== "mily-b59-01-third-round-vote-day2-story",
    ),
    previous,
  );
  const updates = news.filter((entry) => entry.media === item);
  assert.equal(updates.length, 1);
  assert.equal(updates[0].date, item.sourceDate);
  assert.equal(updates[0].source, item.sourceUrl);
  assert.equal(
    news.find((entry) => entry.id === "2026-09-05-tiktok-radio-portrait"),
    updates[0],
  );
  const ordered = sortNewsByDateDesc(news);
  assert.equal(ordered[0]?.id, "2026-09-07-campus-girls-finals-ex-vol1");
  assert.equal(ordered[1]?.id, "2026-09-06-stream-thanks-next-slots");
  assert.equal(ordered[2]?.id, "2026-09-06-campus-girls-prelim-final-result");
  assert.equal(ordered[3]?.id, "2026-09-06-night-slot-2230");
  assert.equal(ordered[4]?.id, "2026-09-05-morning-stream-thanks");
  assert.equal(ordered[5], updates[0]);
  assert.equal(news.length, previousNews.length + 7);
  assert.deepEqual(
    news.filter(
      (entry) =>
        entry !== updates[0] &&
        entry.id !== "2026-09-05-morning-stream-thanks" &&
        entry.id !== "2026-09-06-night-slot-2230" &&
        entry.id !== "2026-09-06-campus-girls-prelim-final-result" &&
        entry.id !== "2026-09-07-campus-girls-finals-ex-vol1" &&
        entry.id !== "2026-09-06-stream-thanks-next-slots" &&
        entry.id !== "2026-09-04-third-round-vote-day2-story",
    ),
    previousNews,
  );
  assert.equal(galleryVideos[0], item);
  const entries = selectGalleryEntries().filter(({ key }) => key === item.id);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].kind, "video");
  const view = entries[0].item.video;
  assert.equal(view.src, item.src);
  assert.equal(view.poster, item.poster);
  assert.equal(view.controls, true);
  assert.equal(view.playsInline, true);
  assert.equal(view.preload, "none");
  const mp4 = await readFile(new URL("../public" + item.src, import.meta.url));
  const poster = await readFile(new URL("../public" + item.poster, import.meta.url));
  assert.ok(mp4.length > 0 && mp4.length < 2_000_000);
  assert.ok(mp4.indexOf("moov") > 0 && mp4.indexOf("moov") < mp4.indexOf("mdat"));
  assert.equal(poster.readUInt16BE(0), 0xffd8);
});
