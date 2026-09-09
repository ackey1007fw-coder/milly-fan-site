import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { galleryVideos, showroomAvatarRightsStoryVideo, visibleGalleryVideos } from "../src/data/galleryVideos.ts";
import { news } from "../src/data/news.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIDEO = "mily-b92-01-showroom-avatar-rights-story.mp4";
const POSTER = "mily-b92-01-showroom-avatar-rights-story-poster.jpg";
const VIDEO_SHA = "6b895c06caf779f838cf0748901fa675344f1b98e654ea973e763805eba6a761";
const POSTER_SHA = "82df135bd4a115864b2b94101a1a894754e32f6be7e399f2fcaa9551bb896e84";

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

describe("undated owner-provided SHOWROOM Story", () => {
  it("publishes once in Gallery without inventing dated NEWS", () => {
    const item = showroomAvatarRightsStoryVideo;
    assert.equal(item.sourceDate, null);
    assert.equal(item.sourceLabel, "Instagram Story");
    assert.equal(item.provenance, "owner-provided");
    assert.equal(item.published, true);
    assert.deepEqual(visibleGalleryVideos().filter(({ id }) => id === item.id), [item]);
    assert.equal(news.some((entry) => entry.media === item), false);
    assert.equal(galleryVideos.filter(({ id }) => id === item.id).length, 1);

    const entries = selectGalleryEntries().filter(({ key }) => key === item.id);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].kind, "video");
    assert.equal(entries[0].item.video.controls, true);
    assert.equal(entries[0].item.video.playsInline, true);
    assert.equal(entries[0].item.video.preload, "none");
  });

  it("keeps the published MP4 and real-frame poster intact", async () => {
    const video = await readFile(path.join(root, "public/media/gallery", VIDEO));
    const poster = await readFile(path.join(root, "public/media/gallery", POSTER));
    assert.equal(video.length, 46562);
    assert.equal(poster.length, 70445);
    assert.equal(sha256(video), VIDEO_SHA);
    assert.equal(sha256(poster), POSTER_SHA);
    assert.ok(video.indexOf("moov") > 0 && video.indexOf("moov") < video.indexOf("mdat"));
    assert.equal(poster.readUInt16BE(0), 0xffd8);
  });
});