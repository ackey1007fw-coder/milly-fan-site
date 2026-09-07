import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "./fixtures/gallery-videos-before-b41.ts";
import { highlights } from "../src/data/highlights.ts";
import { media, visibleMedia } from "../src/data/media.ts";
import {
  MOVIE_NIGHT_INSTAGRAM_PROFILE_URL,
  MOVIE_NIGHT_INSTAGRAM_URL,
  movieNightNewsImages,
  movieNightPhotos,
} from "../src/data/movieNightPhotos.ts";
import {
  news,
  newsDisplayMedia,
  sortNewsByDateDesc,
} from "./fixtures/news-before-b41.ts";
import { createPortalFeed } from "./fixtures/portal-feed-before-b41.ts";
import { stories } from "../src/data/stories.ts";
import { selectGalleryEntries } from "./fixtures/gallery-items-before-b41.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";
import { findFeedItem, portalNewsId } from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-27-movie-night";

function newsItem() {
  return news.find((item) => item.id === NEWS_ID);
}

function publicPath(relativePath) {
  return path.join(root, "public", relativePath.replace(/^\//, ""));
}

describe("2026-08-27 movie-night Instagram post — NEWS", () => {
  it("publishes one source-backed item first without inventing an Activity relation", () => {
    const item = newsItem();

    assert.ok(item);
    assert.deepEqual(verifyNews(news), []);
    assert.equal(item.date, "2026-08-27");
    assert.equal(item.sameDayOrder, 3);
    assert.equal(sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3"))[0], item);
    assert.equal(item.source, MOVIE_NIGHT_INSTAGRAM_URL);
    assert.equal(item.sourceLabel, "Instagramの投稿を見る");
    assert.equal(item.url, MOVIE_NIGHT_INSTAGRAM_PROFILE_URL);
    assert.equal(item.ctaLabel, "みりぃのInstagramを見る");
    assert.equal(item.activityIds, undefined);
    assert.deepEqual(resolveNewsLinks(item, Date.now()), {
      relatedUrl: MOVIE_NIGHT_INSTAGRAM_PROFILE_URL,
      cta: {
        label: "みりぃのInstagramを見る",
        url: MOVIE_NIGHT_INSTAGRAM_PROFILE_URL,
      },
    });
  });

  it("preserves the supplied caption and keeps the summary source-bounded", () => {
    const item = newsItem();

    assert.ok(item.message?.text.includes("開始5分からエンドロールまで号泣"));
    assert.ok(item.message?.text.includes("皆さんのおすすめの映画教えてっ"));
    assert.ok(item.message?.text.includes("#キャンパスガールズ"));
    for (const phrase of ["傑作", "必見", "絶対見るべき", "受賞", "興行収入"]) {
      assert.equal(`${item.title}${item.body}`.includes(phrase), false, phrase);
    }
  });

  it("shows all five supplied photos on the same NEWS card in post order", () => {
    const displayMedia = newsDisplayMedia(newsItem());

    assert.equal(displayMedia.length, 5);
    assert.deepEqual(displayMedia, movieNightNewsImages);
    assert.deepEqual(
      displayMedia.map((image) => image.src),
      movieNightPhotos.map((photo) => `${photo.basePath}-1600.jpg`),
    );
    for (const image of displayMedia) {
      assert.equal(image.kind, "image");
      assert.equal(image.srcSet.includes("http"), false);
      assert.equal(image.webpSrcSet.includes("http"), false);
    }
  });

  it("flows through a scoped Portal Feed with the post source and local lead image", () => {
    const item = newsItem();
    const feed = createPortalFeed({
      now: new Date("2026-08-27T23:00:00+09:00"),
      newsItems: [item],
      storyItems: [],
      eventItems: [],
    });
    const feedItem = findFeedItem(feed, portalNewsId(NEWS_ID));

    assert.equal(feedItem.sourceUrl, MOVIE_NIGHT_INSTAGRAM_URL);
    assert.ok(feedItem.image.endsWith(movieNightNewsImages[0].src));
    assert.equal(new URL(feedItem.image).hostname, "mily-fan-site.vercel.app");
  });
});

describe("2026-08-27 movie-night Instagram post — Gallery", () => {
  it("publishes exactly the five approved local photos with confirmed provenance", () => {
    assert.deepEqual(verifyMedia(media), []);
    assert.equal(media[0].id, "mily-b63-01");
    assert.deepEqual(media.slice(1, 6), [...movieNightPhotos]);

    for (const item of movieNightPhotos) {
      assert.equal(item.kind, "photo");
      assert.equal(item.provenance, "owner-provided");
      assert.equal(item.sourceUrl, MOVIE_NIGHT_INSTAGRAM_URL);
      assert.equal(item.sourceDate, "2026-08-27");
      assert.equal(item.credit, null);
      assert.equal(item.published, true);
      assert.equal(visibleMedia(media).includes(item), true);
      assert.equal(
        selectGalleryEntries().some(
          (entry) => entry.kind === "media" && entry.item === item,
        ),
        true,
      );
    }
  });

  it("ships 30 responsive derivatives without metadata, crop, or upscaling", async () => {
    for (const item of movieNightPhotos) {
      for (const requestedWidth of item.widths) {
        for (const format of ["jpg", "webp"]) {
          const file = publicPath(`${item.basePath}-${requestedWidth}.${format}`);
          assert.equal(existsSync(file), true, file);
          const metadata = await sharp(file).metadata();
          const expectedWidth = Math.min(requestedWidth, item.width);

          assert.equal(metadata.width, expectedWidth, file);
          assert.equal(
            metadata.height,
            Math.round((expectedWidth * item.height) / item.width),
            file,
          );
          assert.equal(metadata.exif, undefined, file);
          assert.equal(metadata.iptc, undefined, file);
          assert.equal(metadata.xmp, undefined, file);
          assert.equal(metadata.icc, undefined, file);
          assert.equal(metadata.orientation, undefined, file);
        }
      }
    }
  });

  it("keeps the untouched originals out of git", async () => {
    const { stdout } = await run("git", ["ls-files"], {
      cwd: root,
      maxBuffer: 1024 * 1024 * 16,
    });
    const tracked = stdout.split("\n").filter(Boolean);

    assert.equal(tracked.some((file) => file.startsWith("media/original/mily-b38")), false);
  });
});

describe("2026-08-27 movie-night Instagram post — scope and docs", () => {
  it("does not copy the regular post into unrelated content models", () => {
    const serialized = [stories, highlights, events, galleryVideos].map((items) =>
      JSON.stringify(items),
    );

    for (const content of serialized) {
      assert.equal(/movie-night|mily-b38/.test(content), false);
    }
  });

  it("records the updated inventory and source/placement decisions", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const mediaGuide = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");

    assert.match(ops, /48件/);
    assert.match(ops, /写真32枚/);
    assert.match(ops, /Dci0CvNE29X/);
    assert.match(mediaGuide, /batch b38/);
    assert.match(mediaGuide, /作品ポスター/);
    assert.doesNotMatch(mediaGuide, /codex-remote-attachments/);
  });
});
