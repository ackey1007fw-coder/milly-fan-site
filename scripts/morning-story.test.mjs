import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  driveGallerySections,
  driveVideoView,
  visibleDriveGallery,
} from "../src/data/driveGallery.ts";
import {
  galleryVideos,
  isSelfHostedGalleryVideo,
  morningStoryVideo,
  visibleGalleryVideos,
} from "./fixtures/gallery-videos-before-b41.ts";
import { media } from "../src/data/media.ts";
import { news } from "./fixtures/news-before-b41.ts";
import { stories } from "../src/data/stories.ts";
import { validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
  isProbablyBinary,
} from "./scan-tracked-text.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryAssetDirectory = path.join(root, "public/media/gallery");
const expectedMessage = "8/17（月）今日からお仕事が始まる皆さん応援して…";
const expectedAlt =
  "猫耳とひげのフィルターで「OHAYO!!」と表示された、8月17日朝のみりぃの動画";

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

function publicAssetPath(publicPath) {
  assert.match(publicPath, /^\/media\//, publicPath);
  assert.equal(DRIVE_HOST_PATTERN.test(publicPath), false, publicPath);
  return path.join(root, "public", publicPath);
}

function galleryVideoViews() {
  const drive = driveGallerySections(visibleDriveGallery());
  return [
    ...visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5").filter(isSelfHostedGalleryVideo).map(driveVideoView),
    ...drive.videos,
  ];
}

describe("2026-08-17 morning Instagram Story", () => {
  it("keeps the approved Latest copy and only the visible message range", () => {
    const item = news.find((entry) => entry.id === "2026-08-17-morning-story");

    assert.ok(item);
    assert.equal(item.date, "2026-08-17");
    assert.equal(item.title, "おはよう☀️ 朝のストーリー");
    assert.equal(
      item.body,
      "猫耳フィルターで「OHAYO!!」。みりぃから届いた朝のひとコマ。",
    );
    assert.equal(item.message?.label, "みりぃのメッセージ");
    assert.equal(item.message?.text, expectedMessage);
    assert.equal(item.message?.text.endsWith("…"), true);
  });

  it("uses a non-link source label when no permanent Story URL exists", async () => {
    const item = news.find((entry) => entry.id === "2026-08-17-morning-story");
    const latest = await read("src/components/Latest.tsx");

    assert.ok(item);
    assert.equal(item.source, undefined);
    assert.equal(item.sourceLabel, "Instagram Story");
    assert.deepEqual(verifyNews([item]), []);
    assert.match(latest, /item\.source\s*\?/);
    assert.match(latest, /item\.sourceLabel\s*\?/);
    assert.match(latest, /<ExternalLink[\s\S]*?href=\{item\.source\}/);
    assert.match(latest, /<span[\s\S]*?\{item\.sourceLabel\}/);
    assert.doesNotMatch(latest, /href=""|href="#"|href=\{item\.source \?\? ""\}/);
  });

  it("keeps the birthday source link and CTA intact", async () => {
    const birthday = news.find((entry) => entry.id === "2026-08-02-21st-birthday");
    const latest = await read("src/components/Latest.tsx");

    assert.ok(birthday);
    assert.equal(birthday.source, "https://www.instagram.com/p/DbiY3PHk1c8/");
    assert.equal(birthday.ctaLabel, "Instagramの投稿を見る");
    assert.match(latest, /href=\{item\.source\}/);
    assert.match(latest, /href=\{resolvedLinks\.cta\.url\}/);
  });

  it("describes the video contents for Latest aria-label and Gallery caption", () => {
    const item = news.find((entry) => entry.id === "2026-08-17-morning-story");
    const view = driveVideoView(morningStoryVideo);

    assert.ok(item?.media);
    assert.equal(item.media.alt, expectedAlt);
    assert.equal(morningStoryVideo.alt, expectedAlt);
    assert.equal(view.video.label, expectedAlt);
  });
});

describe("shared morning Story assets", () => {
  it("uses one MP4 and one poster object in both Latest and Gallery", () => {
    const item = news.find((entry) => entry.id === "2026-08-17-morning-story");
    const galleryItem = galleryVideos.find(
      (entry) => entry.id === morningStoryVideo.id,
    );

    assert.ok(item?.media);
    assert.equal(item.media, morningStoryVideo);
    assert.equal(galleryItem, morningStoryVideo);
    assert.equal(item.media.src, morningStoryVideo.src);
    assert.equal(item.media.poster, morningStoryVideo.poster);
    assert.equal(item.media.src, "/media/gallery/mily-b03-01-morning-ohayo.mp4");
    assert.equal(
      item.media.poster,
      "/media/gallery/mily-b03-01-morning-ohayo-poster.jpg",
    );
  });

  it("ships the sanitized MP4 and real-frame poster", async () => {
    const mp4 = publicAssetPath(morningStoryVideo.src);
    const poster = publicAssetPath(morningStoryVideo.poster);

    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(mp4)).size < 5 * 1024 * 1024);
    assert.ok((await stat(poster)).size > 0);
    assert.deepEqual(
      await validateVideoDerivatives(morningStoryVideo, galleryAssetDirectory),
      { width: 720, height: 1280 },
    );
  });

  it("does not publish a second purpose-specific copy or the UI screenshot", async () => {
    const files = await readdir(path.join(root, "public"), { recursive: true });
    const morningAssets = files
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b03-01-morning-ohayo"));

    assert.deepEqual(morningAssets.sort(), [
      "media/gallery/mily-b03-01-morning-ohayo-poster.jpg",
      "media/gallery/mily-b03-01-morning-ohayo.mp4",
    ]);
    assert.equal(
      files.some((file) => /写真1|screenshot|story-screen/i.test(String(file))),
      false,
    );
  });

  it("keeps Drive handoff details out of frontend text and public text assets", async () => {
    const frontendFiles = [
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "src/data/morningStoryVideo.ts",
      "src/data/morningStoryVideo.json",
      "src/data/morningStory20260820.json",
      "src/components/Latest.tsx",
      "src/components/Gallery.tsx",
      "src/lib/galleryItems.ts",
    ];

    for (const relative of frontendFiles) {
      const source = await read(relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.deepEqual(findDriveIds(source), [], relative);
    }

    const publicFiles = await readdir(path.join(root, "public"), { recursive: true });
    for (const relative of publicFiles) {
      const file = path.join(root, "public", relative);
      if (!(await stat(file)).isFile()) continue;
      const bytes = await readFile(file);
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, String(relative));
      assert.deepEqual(findDriveIds(source), [], String(relative));
    }
  });
});

describe("Latest video playback contract", () => {
  it("renders the Latest video with controls and inline non-autoplay playback", async () => {
    const latest = await read("src/components/Latest.tsx");

    assert.match(latest, /<video/);
    assert.match(latest, /poster=\{media\.poster\}/);
    assert.match(latest, /controls/);
    assert.match(latest, /playsInline/);
    assert.match(latest, /preload="none"/);
    assert.doesNotMatch(latest, /autoPlay|autoplay|\bloop\b/);
    assert.match(latest, /aspect-\[9\/16\]/);
  });
});

describe("Gallery video contracts", () => {
  it("renders every published standalone Gallery video through the local contract", async () => {
    const gallery = await read("src/components/Gallery.tsx");
    const selector = await read("src/lib/galleryItems.ts");
    const visible = visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5");

    assert.ok(visible.length > 0);
    assert.match(selector, /isSelfHostedGalleryVideo/);
    assert.match(selector, /driveVideoView/);
    assert.match(gallery, /selectGalleryEntries\(\)/);
    assert.match(gallery, /src=\{video\.video\.src\}/);
    assert.match(gallery, /お預かりした動画/);
    assert.match(gallery, /mixchCards/);
    assert.doesNotMatch(gallery, /同一動画の重複/);

    for (const item of visible.filter(isSelfHostedGalleryVideo)) {
      const view = driveVideoView(item);
      const mp4 = publicAssetPath(item.src);
      const poster = publicAssetPath(item.poster);

      assert.equal(item.kind, "video");
      assert.equal(item.published, true);
      assert.match(item.src, /^\/media\//);
      assert.match(item.poster, /^\/media\//);
      assert.equal(DRIVE_HOST_PATTERN.test(item.src), false, item.id);
      assert.equal(DRIVE_HOST_PATTERN.test(item.poster), false, item.id);
      assert.equal(typeof item.alt, "string");
      assert.ok(item.alt.length > 0);
      assert.ok(Number.isInteger(item.width) && item.width > 0);
      assert.ok(Number.isInteger(item.height) && item.height > 0);
      assert.equal(existsSync(mp4), true, item.src);
      assert.equal(existsSync(poster), true, item.poster);
      assert.ok((await stat(mp4)).size > 0, item.src);
      assert.ok((await stat(poster)).size > 0, item.poster);
      assert.equal(view.video.controls, true, item.id);
      assert.equal(view.video.playsInline, true, item.id);
      assert.equal(view.video.preload, "none", item.id);
      assert.equal("autoPlay" in view.video, false, item.id);
      assert.equal("loop" in view.video, false, item.id);
      assert.equal(view.video.label, item.alt);
      assert.deepEqual(
        await validateVideoDerivatives(
          item,
          path.join(root, "public", path.dirname(item.src).replace(/^\//, "")),
        ),
        { width: item.width, height: item.height },
      );
    }
  });

  it("applies the same playback contract to every Gallery-visible video", async () => {
    const views = galleryVideoViews();

    assert.ok(views.length > 0);
    for (const view of views) {
      const mp4 = publicAssetPath(view.video.src);
      const poster = publicAssetPath(view.video.poster);

      assert.match(view.video.src, /^\/media\//, view.key);
      assert.match(view.video.poster, /^\/media\//, view.key);
      assert.equal(DRIVE_HOST_PATTERN.test(view.video.src), false, view.key);
      assert.equal(DRIVE_HOST_PATTERN.test(view.video.poster), false, view.key);
      assert.deepEqual(findDriveIds(view.video.src), [], view.key);
      assert.deepEqual(findDriveIds(view.video.poster), [], view.key);
      assert.equal(typeof view.video.label, "string");
      assert.ok(view.video.label.length > 0, view.key);
      assert.ok(Number.isInteger(view.video.width) && view.video.width > 0, view.key);
      assert.ok(Number.isInteger(view.video.height) && view.video.height > 0, view.key);
      assert.equal(existsSync(mp4), true, view.video.src);
      assert.equal(existsSync(poster), true, view.video.poster);
      assert.equal(view.video.controls, true, view.key);
      assert.equal(view.video.playsInline, true, view.key);
      assert.equal(view.video.preload, "none", view.key);
      assert.equal("autoPlay" in view.video, false, view.key);
      assert.equal("loop" in view.video, false, view.key);
    }
  });

  it("preserves the existing photo and Drive-video archives", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    // b01の6枚（誕生日5枚 + ネックレス）は残したまま、2026-08-19 に b05-01、
    // 2026-08-20 に b08-01 と b10 の5枚、2026-08-23 に b20 の3枚と b22 の2枚、
    // 2026-08-26 に b28-01 と b27 の静止画2枚、b29-01 の誕生日室内セルフィーを追加した。
    assert.equal(media.filter((item) => item.kind === "photo").length, 33);
    for (const id of [
      "mily-b01-01",
      "mily-b01-02",
      "mily-b01-03",
      "mily-b01-04",
      "mily-b01-05",
      "mily-b01-06",
    ]) {
      assert.ok(media.some((item) => item.id === id), id);
    }
    assert.equal(drive.photos.length, 45);
    assert.equal(drive.videos.length, 11);
    // 自己ホスト15本 + Mixch outbound 2本。Drive Gallery の動画11本は別枠。
    assert.equal(visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5").length, 17);
    assert.equal(
      visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5").filter(isSelfHostedGalleryVideo).length + drive.videos.length,
      26,
    );
    assert.equal(galleryVideoViews().length, 26);
  });
});

describe("STORIES boundary", () => {
  it("does not add the morning post to the article collection", async () => {
    const source = await read("src/data/stories.ts");

    assert.equal(stories.some((story) => story.date === "2026-08-17"), false);
    assert.equal(stories.some((story) => /morning|ohayo/i.test(story.slug)), false);
    assert.doesNotMatch(source, /2026-08-17-morning-story|mily-b03-01-morning-ohayo/);
  });
});
