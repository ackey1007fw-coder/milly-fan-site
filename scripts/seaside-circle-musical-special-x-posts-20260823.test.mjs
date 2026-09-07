import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import {
  galleryVideos,
  seasideCircleMusicalSpecialThanksVideo,
  seasideCircleMusicalSpecialVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b41.ts";
import { highlights } from "../src/data/highlights.ts";
import {
  defaultSrc,
  featuredPhoto,
  media,
  srcSetFor,
  visibleMedia,
} from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import { profile } from "../src/data/profile.ts";
import { socials } from "../src/data/socials.ts";
import {
  stories,
  storyBySlug,
  storySources,
} from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-23-seaside-circle-musical-special";
const STORY_SLUG = "2026-08-23-musical-special";
const STORY_HREF = "/stories/2026-08-23-musical-special/";
const BEFORE_X = "https://x.com/fm_smw856/status/2091322098954490025";
const AFTER_X = "https://x.com/fm_smw856/status/2091499993102524714";
const BEFORE_ID = "mily-b22-01";
const AFTER_ID = "mily-b22-02";
const BEFORE_SLUG = "seaside-circle-musical-special-before";
const AFTER_SLUG = "seaside-circle-musical-special-after";
const BEFORE_STORY_MEDIA = "seaside-circle-musical-special-before-photo";
const AFTER_STORY_MEDIA = "seaside-circle-musical-special-after-photo";
const BEFORE_SOURCE_ID = "fm-smw-x-2026-08-23-musical-special-before";
const AFTER_SOURCE_ID = "fm-smw-x-2026-08-23-musical-special-after";
const SIZES = {
  [BEFORE_ID]: {
    480: [480, 480],
    960: [960, 960],
    1600: [1600, 1600],
  },
  [AFTER_ID]: {
    480: [480, 360],
    960: [960, 720],
    1600: [1600, 1200],
  },
};

function newsItem() {
  return news.find((item) => item.id === NEWS_ID);
}

function story() {
  return storyBySlug(STORY_SLUG);
}

function galleryItems() {
  return [BEFORE_ID, AFTER_ID].map((id) => media.find((item) => item.id === id));
}

function publicPath(relativePath) {
  return path.join(root, "public", relativePath.replace(/^\//, ""));
}

describe("2026-08-23 seaside circle official X posts — NEWS stays one item", () => {
  it("keeps a single 8/23 radio NEWS and does not add a duplicate", () => {
    const matches = news.filter((entry) => entry.id === NEWS_ID);
    const extra = news.filter(
      (entry) =>
        entry.date === "2026-08-23" &&
        entry.id !== NEWS_ID &&
        /seaside-circle|musical-special|fm-smw|fm_smw/.test(entry.id),
    );
    const entry = newsItem();

    assert.equal(matches.length, 1);
    assert.equal(extra.length, 0);
    assert.equal(news.length, 49);
    assert.equal(entry?.date, "2026-08-23");
    assert.equal(entry?.sameDayOrder, 4);
    assert.deepEqual(entry?.activityIds, ["radio"]);
    assert.equal(entry?.title, "真夏のミュージカル特集🎭 清水美依紗さんを迎えた生放送");
    assert.deepEqual(verifyNews(news), []);
  });

  it("adds the after-broadcast X post as the NEWS external source and keeps the STORY CTA", () => {
    const entry = newsItem();

    assert.equal(entry?.source, AFTER_X);
    assert.equal(entry?.sourceLabel, "FM湘南マジックウェイブの放送後投稿を見る");
    assert.equal(entry?.url, STORY_HREF);
    assert.equal(entry?.ctaLabel, "真夏のミュージカル特集の放送記録を読む");
    assert.notEqual(entry?.url, entry?.source);
  });

  it("does not replace the NEWS representative media", () => {
    const entry = newsItem();

    assert.equal(entry?.media, seasideCircleMusicalSpecialThanksVideo);
    assert.equal(entry?.media?.src, seasideCircleMusicalSpecialThanksVideo.src);
    assert.equal(entry?.media?.poster, seasideCircleMusicalSpecialThanksVideo.poster);
    assert.doesNotMatch(entry?.media?.src ?? "", /mily-b22/);
    assert.notEqual(entry?.media, seasideCircleMusicalSpecialVideo);
  });
});

describe("2026-08-23 seaside circle official X posts — STORY sources and photos", () => {
  it("adds both official X URLs as additional STORY sources", () => {
    const entry = story();

    assert.ok(entry);
    assert.equal(storySources[BEFORE_SOURCE_ID].url, BEFORE_X);
    assert.equal(storySources[AFTER_SOURCE_ID].url, AFTER_X);
    assert.equal(
      storySources[BEFORE_SOURCE_ID].label,
      "FM湘南マジックウェイブ X投稿（放送前 / 2026年8月23日）",
    );
    assert.equal(
      storySources[AFTER_SOURCE_ID].label,
      "FM湘南マジックウェイブ X投稿（放送後 / 2026年8月23日）",
    );
    assert.ok(entry.sourceIds.includes(BEFORE_SOURCE_ID));
    assert.ok(entry.sourceIds.includes(AFTER_SOURCE_ID));
    assert.ok(entry.sourceIds.includes("broadcast-transcript-2026-08-23"));
    assert.ok(entry.sourceIds.includes("program-instagram-story-2026-08-23"));
    assert.ok(entry.sourceIds.includes("program-instagram-story-thanks-2026-08-23"));
  });

  it("keeps existing b19 and b21 videos on the STORY", () => {
    const entry = story();
    const videos = entry?.media.filter((item) => item.kind === "video") ?? [];
    const lead = entry?.media.find((item) => item.id === "seaside-circle-musical-special-story");
    const thanks = entry?.media.find((item) => item.id === "seaside-circle-musical-special-thanks-story");

    assert.equal(entry?.leadMediaId, "seaside-circle-musical-special-story");
    assert.equal(videos.length, 2);
    assert.equal(lead?.src, seasideCircleMusicalSpecialVideo.src);
    assert.equal(lead?.poster, seasideCircleMusicalSpecialVideo.poster);
    assert.equal(thanks?.src, seasideCircleMusicalSpecialThanksVideo.src);
    assert.equal(thanks?.poster, seasideCircleMusicalSpecialThanksVideo.poster);
    assert.equal(visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5").includes(seasideCircleMusicalSpecialVideo), true);
    assert.equal(visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5").includes(seasideCircleMusicalSpecialThanksVideo), true);
    assert.equal(galleryVideos.length, 20);
  });

  it("reuses Gallery derivatives for both STORY photos", () => {
    const entry = story();
    const before = entry?.media.find((item) => item.id === BEFORE_STORY_MEDIA);
    const after = entry?.media.find((item) => item.id === AFTER_STORY_MEDIA);
    const start = entry?.sections.find((section) => section.id === "start");
    const closing = entry?.sections.find((section) => section.id === "closing");

    assert.equal(before?.kind, "image");
    assert.equal(after?.kind, "image");
    assert.equal(
      before?.src,
      "/media/gallery/mily-b22-01-seaside-circle-musical-special-before-1600.jpg",
    );
    assert.equal(
      after?.src,
      "/media/gallery/mily-b22-02-seaside-circle-musical-special-after-1600.jpg",
    );
    assert.equal(before?.width, 1600);
    assert.equal(before?.height, 1600);
    assert.equal(after?.width, 1600);
    assert.equal(after?.height, 1200);
    assert.equal(
      start?.blocks.some((block) => block.type === "media" && block.mediaId === BEFORE_STORY_MEDIA),
      true,
    );
    assert.equal(
      closing?.blocks.some((block) => block.type === "media" && block.mediaId === AFTER_STORY_MEDIA),
      true,
    );
    assert.match(
      start?.blocks.find((block) => block.type === "paragraph" && block.sourceIds.includes(BEFORE_SOURCE_ID))?.text ?? "",
      /真夏の！ミュージカル特集！/,
    );
    assert.match(
      closing?.blocks.find((block) => block.type === "paragraph" && block.sourceIds.includes(AFTER_SOURCE_ID))?.text ?? "",
      /作品や楽曲/,
    );
  });

  it("does not invent extra guest profile facts or RT claims", () => {
    const published = JSON.stringify({
      news: newsItem(),
      story: story(),
      photos: galleryItems(),
    });

    for (const phrase of [
      "みりぃがRTした",
      "みりぃがおすすめした",
      "みりぃが紹介した",
      "三重のアリアナ",
      "YouTuber",
      "所属事務所",
      "生年月日",
      "出身地",
    ]) {
      assert.equal(published.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-23 seaside circle official X posts — Gallery photos", () => {
  it("registers two owner-provided published photos with the matching X URLs", () => {
    const items = galleryItems();
    const visible = visibleMedia(media);

    assert.equal(items.length, 2);
    assert.equal(items[0]?.id, BEFORE_ID);
    assert.equal(items[1]?.id, AFTER_ID);
    assert.equal(visible.indexOf(items[0]), 14);
    assert.equal(visible.indexOf(items[1]), 15);
    assert.equal(visible.filter((item) => item.kind === "photo").length, 33);
    assert.deepEqual(verifyMedia(media), []);

    for (const item of items) {
      assert.equal(item?.kind, "photo");
      assert.equal(item?.provenance, "owner-provided");
      assert.equal(item?.sourceDate, "2026-08-23");
      assert.equal(item?.credit, null);
      assert.equal(item?.published, true);
      assert.deepEqual(item?.widths, [480, 960, 1600]);
      assert.equal(visible.includes(item), true);
      assert.notEqual(item?.featured, true);
    }

    assert.equal(items[0].sourceUrl, BEFORE_X);
    assert.equal(items[1].sourceUrl, AFTER_X);
    assert.equal(items[0].width, 1600);
    assert.equal(items[0].height, 1600);
    assert.equal(items[0].aspect, "1600 / 1600");
    assert.equal(items[1].width, 1600);
    assert.equal(items[1].height, 1200);
    assert.equal(items[1].aspect, undefined);
    assert.equal(featuredPhoto(media)?.id, "mily-b01-03");
  });

  it("uses local b22 paths and situation-based captions", () => {
    const items = galleryItems();

    assert.equal(items[0].basePath, `/media/gallery/mily-b22-01-${BEFORE_SLUG}`);
    assert.equal(items[1].basePath, `/media/gallery/mily-b22-02-${AFTER_SLUG}`);
    assert.equal(items[0].caption, "『真夏のミュージカル特集』放送前のスタジオショット。");
    assert.equal(items[1].caption, "放送を終えたあとのスタジオショット。");
    assert.match(defaultSrc(items[0]), /^\/media\/gallery\/mily-b22-01-/);
    assert.match(defaultSrc(items[1]), /^\/media\/gallery\/mily-b22-02-/);

    for (const item of items) {
      for (const format of ["jpg", "webp"]) {
        assert.equal(srcSetFor(item, format).includes("http"), false);
      }
      for (const phrase of ["仲良し", "大盛り上がり", "かわいい", "可愛い", "美人"]) {
        assert.equal(`${item.alt}${item.caption}`.includes(phrase), false, phrase);
      }
    }
  });

  it("ships 12 uncropped derivatives without private metadata or upscaling", async () => {
    for (const item of galleryItems()) {
      for (const requestedWidth of item.widths) {
        for (const format of ["jpg", "webp"]) {
          const file = publicPath(`${item.basePath}-${requestedWidth}.${format}`);
          assert.equal(existsSync(file), true, file);
          const metadata = await sharp(file).metadata();
          const [expectedWidth, expectedHeight] = SIZES[item.id][requestedWidth];

          assert.equal(metadata.width, expectedWidth, file);
          assert.equal(metadata.height, expectedHeight, file);
          assert.equal(metadata.exif, undefined, file);
          assert.equal(metadata.iptc, undefined, file);
          assert.equal(metadata.xmp, undefined, file);
          assert.equal(metadata.icc, undefined, file);
          assert.equal(metadata.orientation, undefined, file);
        }
      }
    }
  });

  it("adds only the expected 12 Gallery derivatives and no NEWS stills", async () => {
    const files = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b22"));

    assert.equal(files.length, 12);
    assert.equal(files.every((file) => file.startsWith("media/gallery/")), true);
    assert.equal(files.some((file) => file.startsWith("media/news/")), false);
  });

  it("keeps both untouched originals out of git", async () => {
    const { stdout } = await run("git", ["ls-files"], {
      cwd: root,
      maxBuffer: 1024 * 1024 * 16,
    });
    const tracked = stdout.split("\n").filter(Boolean);

    assert.equal(tracked.some((file) => file.startsWith("media/original/mily-b22")), false);
  });
});

describe("2026-08-23 seaside circle official X posts — scope boundaries", () => {
  it("does not add the X posts to events, schedule, profile, or socials", async () => {
    assert.equal(events.length, 0);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );
    assert.equal(JSON.stringify(events).includes("fm_smw856"), false);
    assert.equal(JSON.stringify(highlights).includes("fm_smw856"), false);
    assert.equal(JSON.stringify(profile).includes("2091322098954490025"), false);
    assert.equal(JSON.stringify(socials).includes("2091499993102524714"), false);

    for (const relative of [
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "shared/radio-program.js",
      "src/data/radio.ts",
      "src/data/profile.ts",
      "src/data/socials.ts",
      "src/data/contest.ts",
    ]) {
      const text = await readFile(path.join(root, relative), "utf8");
      assert.doesNotMatch(
        text,
        /2091322098954490025|2091499993102524714/,
        relative,
      );
      assert.doesNotMatch(text, /mily-b22-0[12]/, relative);
      assert.doesNotMatch(text, /fm-smw-x-2026-08-23-musical-special/, relative);
    }
  });

  it("keeps Drive handoff details out of tracked publication records", async () => {
    const published = JSON.stringify({
      news: newsItem(),
      story: story(),
      gallery: galleryItems(),
    });

    assert.doesNotMatch(published, DRIVE_HOST_PATTERN);
    assert.deepEqual(findDriveIds(published), []);

    for (const relative of [
      "src/data/news.ts",
      "src/data/media.ts",
      "src/data/stories.ts",
      "docs/CONTENT-OPS.md",
      "docs/MEDIA.md",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.doesNotMatch(source, DRIVE_HOST_PATTERN, relative);
      assert.equal(findDriveIds(source).length, 0, relative);
    }
  });
});
