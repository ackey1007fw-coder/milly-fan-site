import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { galleryVideos } from "./fixtures/gallery-videos-before-b41.ts";
import {
  defaultSrc,
  featuredPhoto,
  media,
  srcSetFor,
  visibleMedia,
} from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import { createPortalFeed } from "./fixtures/portal-feed-before-b41.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { stories } from "../src/data/stories.ts";
import { verifyMedia } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const GALLERY_ID = "mily-b08-01";
const BASE_PATH = "/media/gallery/mily-b08-01-do-what-you-can-morning";
const NEWS_ID = "2026-08-20-morning-message";
const LATEST_PHOTO = "/media/news/mily-b08-01-do-what-you-can-morning.jpg";
const SOURCE = "https://x.com/mily_chan36/status/2090242507586322892";
const ORIGINAL = path.join(root, "media/original/mily-b08-01-do-what-you-can-morning.jpg");
/** Owner-confirmed intrinsic size of the source material. */
const SOURCE_WIDTH = 1538;
const SOURCE_HEIGHT = 2048;

function galleryItem() {
  return media.find((entry) => entry.id === GALLERY_ID);
}

function publicPath(relative) {
  return path.join(root, "public", relative.replace(/^\//, ""));
}

describe("2026-08-20 morning photo — Gallery entry", () => {
  it("adds exactly one Gallery item and passes the shared media invariants", () => {
    const matches = media.filter((entry) => entry.basePath.includes("mily-b08"));

    assert.equal(matches.length, 1);
    assert.equal(matches[0].id, GALLERY_ID);
    assert.deepEqual(verifyMedia(media), []);
    assert.equal(visibleMedia(media).some((entry) => entry.id === GALLERY_ID), true);
  });

  it("keeps owner-provided provenance with the confirmed X post and date", () => {
    const item = galleryItem();

    assert.ok(item);
    assert.equal(item.kind, "photo");
    assert.equal(item.provenance, "owner-provided");
    assert.equal(item.sourceUrl, SOURCE);
    assert.equal(item.sourceDate, "2026-08-20");
    // 撮影者は未確認。推測して埋めない。
    assert.equal(item.credit, null);
    assert.equal(item.published, true);
  });

  it("describes the situation without judging appearance", () => {
    const alt = galleryItem().alt;

    assert.equal(alt, "室内の鏡の前でスマートフォンを持って撮影するみりぃ");
    for (const phrase of [
      "女子アナ", "美人", "神ビジュ", "上品", "かわいい", "可愛い",
      "綺麗", "きれい", "美しい", "スタイル", "前向き", "自信",
    ]) {
      assert.equal(alt.includes(phrase), false, phrase);
    }
  });

  it("serves every derivative from a local self-hosted path, never an X image URL", () => {
    const item = galleryItem();

    assert.equal(item.basePath, BASE_PATH);
    assert.match(item.basePath, /^\/media\/gallery\//);
    for (const format of ["jpg", "webp"]) {
      for (const entry of srcSetFor(item, format).split(", ")) {
        const [url] = entry.split(" ");
        assert.match(url, /^\/media\/gallery\/mily-b08-01-/);
        for (const host of ["pbs.twimg.com", "twimg", "x.com", "twitter.com", "cdninstagram", "http"]) {
          assert.equal(url.includes(host), false, `${url} / ${host}`);
        }
      }
    }
    assert.match(defaultSrc(item), /^\/media\/gallery\/mily-b08-01-.*\.jpg$/);
  });
});

describe("2026-08-20 morning photo — derivative files", () => {
  it("ships all six derivatives and matches the manifest to the real files", async () => {
    const item = galleryItem();

    // マニフェストの width / height は最大派生の実寸と一致する
    const largest = await sharp(publicPath(`${BASE_PATH}-1600.jpg`)).metadata();
    assert.equal(item.width, largest.width);
    assert.equal(item.height, largest.height);
    assert.equal(largest.width, SOURCE_WIDTH);
    assert.equal(largest.height, SOURCE_HEIGHT);

    for (const width of item.widths) {
      for (const format of ["jpg", "webp"]) {
        const file = publicPath(`${BASE_PATH}-${width}.${format}`);
        assert.equal(existsSync(file), true, file);
        const meta = await sharp(file).metadata();

        // アップスケールしない（元素材幅が上限）
        assert.ok(meta.width <= SOURCE_WIDTH, `${file} upscaled to ${meta.width}`);
        assert.equal(meta.width, Math.min(width, SOURCE_WIDTH));
        // 高さは縦横比どおり。トリミングも引き伸ばしもしていない。
        assert.equal(
          meta.height,
          Math.round((meta.width * SOURCE_HEIGHT) / SOURCE_WIDTH),
          file,
        );
        // プライバシーメタデータは派生に残さない
        assert.equal(meta.exif, undefined, file);
        assert.equal(meta.iptc, undefined, file);
        assert.equal(meta.xmp, undefined, file);
        assert.equal(meta.orientation, undefined, file);
      }
    }
  });

  it("keeps the 1538:2048 portrait ratio in every derivative", async () => {
    const sourceRatio = SOURCE_WIDTH / SOURCE_HEIGHT;

    for (const width of galleryItem().widths) {
      for (const format of ["jpg", "webp"]) {
        const meta = await sharp(publicPath(`${BASE_PATH}-${width}.${format}`)).metadata();
        // 丸め誤差以内。縦横比を変えていない。
        assert.ok(
          Math.abs(meta.width / meta.height - sourceRatio) < 0.002,
          `${width}.${format} ratio ${meta.width / meta.height}`,
        );
        assert.ok(meta.height > meta.width, "portrait orientation is kept");
      }
    }
  });

  it("is a plain resize of the owner-provided original, not a regenerated image", async () => {
    // 元素材は gitignore 済みなので CI には無い。ある環境でだけ実測で照合する。
    if (!existsSync(ORIGINAL)) return;

    const source = await sharp(ORIGINAL).metadata();
    assert.equal(source.width, SOURCE_WIDTH);
    assert.equal(source.height, SOURCE_HEIGHT);

    // 960 派生を元素材から作り直し、画素差で「単なる縮小」であることを確認する。
    // AI生成・AI補正・generative fill・outpainting・トリミングがあれば差が開く。
    const expected = await sharp(ORIGINAL)
      .rotate()
      .resize({ width: 960, withoutEnlargement: true })
      .greyscale()
      .raw()
      .toBuffer();
    const actual = await sharp(publicPath(`${BASE_PATH}-960.jpg`))
      .greyscale()
      .raw()
      .toBuffer();

    assert.equal(actual.length, expected.length);
    let total = 0;
    for (let index = 0; index < actual.length; index += 1) {
      total += Math.abs(actual[index] - expected[index]);
    }
    const meanAbsoluteDifference = total / actual.length;
    assert.ok(meanAbsoluteDifference < 3, `mean |Δ| = ${meanAbsoluteDifference}`);
  });

  it("keeps the untouched original out of git", async () => {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const run = promisify(execFile);
    const { stdout } = await run("git", ["ls-files"], {
      cwd: root,
      maxBuffer: 1024 * 1024 * 16,
    });

    const tracked = stdout.split("\n").filter(Boolean);
    // media/original/ で git に入ってよいのは README だけ（元素材はコミットしない）
    assert.deepEqual(
      tracked.filter((file) => file.startsWith("media/original/")),
      ["media/original/README.md"],
    );
    assert.equal(tracked.includes(`media/original/mily-b08-01-do-what-you-can-morning.jpg`), false);
  });
});

describe("2026-08-20 morning photo — Gallery renders the portrait uncropped", () => {
  it("overrides the 4/3 tile with the real aspect ratio", async () => {
    const item = galleryItem();
    const gallery = await readFile(path.join(root, "src/components/Gallery.tsx"), "utf8");

    assert.equal(item.aspect, "1538 / 2048");
    // aspect の値は実寸と一致する（タイルが写真を歪めない）
    const [w, h] = item.aspect.split(" / ").map(Number);
    assert.equal(w, item.width);
    assert.equal(h, item.height);
    assert.ok(h > w, "portrait");
    // 4:3 へ強制クロップしない
    assert.notEqual(item.aspect, "4 / 3");
    assert.equal(item.focal, undefined, "no crop repositioning needed");

    // 既存の縦写真対応をそのまま使う（レイアウトは変更しない）
    assert.match(gallery, /aspect-\[4\/3\] w-full object-cover/);
    assert.match(gallery, /item\.aspect \? \{ aspectRatio: item\.aspect \} : \{\}/);
    // 横スクロール源になる固定px幅を持ち込まない
    assert.doesNotMatch(gallery, /w-\[\d+px\]/);
    assert.match(gallery, /sm:grid-cols-2/);
  });

  it("leaves the existing landscape tiles on the default 4/3", () => {
    for (const id of ["mily-b01-01", "mily-b01-02", "mily-b01-03", "mily-b01-04", "mily-b01-05", "mily-b01-06"]) {
      const item = media.find((entry) => entry.id === id);
      assert.ok(item, id);
      assert.equal(item.aspect, undefined, id);
    }
  });
});

describe("2026-08-20 morning photo — surrounding content is untouched", () => {
  it("keeps every existing Gallery item and the Hero featured photo", () => {
    for (const id of [
      "mily-b05-01",
      "mily-b01-01",
      "mily-b01-02",
      "mily-b01-03",
      "mily-b01-04",
      "mily-b01-05",
      "mily-b01-06",
    ]) {
      assert.ok(media.some((entry) => entry.id === id), id);
    }
    // b08 公開後に、別の owner-confirmed batch b10 が5枚、b20 が3枚、b22 が2枚、
    // 2026-08-26 に b28 が1枚と b27 の静止画が2枚、b29-01 が1枚、
    // その後 b30〜b32 と既存 NEWS の b14 / b24 が Gallery に追加されている。
    assert.equal(media.filter((entry) => entry.kind === "photo").length, 33);
    // Hero の featured を奪っていない
    assert.equal(featuredPhoto(media)?.id, "mily-b01-03");
    assert.equal(
      media.filter((entry) => entry.featured === true).length,
      1,
    );
  });

  it("keeps the Latest entry and its own /media/news/ file", () => {
    const entry = news.find((candidate) => candidate.id === NEWS_ID);

    assert.ok(entry, "Latest の 2026-08-20-morning-message を消していない");
    assert.equal(entry.date, "2026-08-20");
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.media.kind, "image");
    // Gallery 追加で Latest 側のパスを差し替えない
    assert.equal(entry.media.src, LATEST_PHOTO);
    assert.equal(entry.media.width, SOURCE_WIDTH);
    assert.equal(entry.media.height, SOURCE_HEIGHT);
    assert.equal(existsSync(publicPath(LATEST_PHOTO)), true);
  });

  it("adds nothing to Gallery Videos or /stories/", async () => {
    const storiesSource = await readFile(path.join(root, "src/data/stories.ts"), "utf8");

    assert.equal(galleryVideos.some((entry) => "src" in entry && entry.src.includes("mily-b08")), false);
    assert.equal(stories.some((story) => story.slug.includes("do-what-you-can")), false);
    assert.doesNotMatch(storiesSource, /mily-b08|do-what-you-can-morning/);
  });

  it("adds no unexpected public b08 asset", async () => {
    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));

    assert.deepEqual(
      publicFiles.filter((file) => file.includes("mily-b08")).sort(),
      [
        "media/gallery/mily-b08-01-do-what-you-can-morning-1600.jpg",
        "media/gallery/mily-b08-01-do-what-you-can-morning-1600.webp",
        "media/gallery/mily-b08-01-do-what-you-can-morning-480.jpg",
        "media/gallery/mily-b08-01-do-what-you-can-morning-480.webp",
        "media/gallery/mily-b08-01-do-what-you-can-morning-960.jpg",
        "media/gallery/mily-b08-01-do-what-you-can-morning-960.webp",
        "media/news/mily-b08-01-do-what-you-can-morning.jpg",
      ],
    );
  });

  it("does not change the existing Portal Feed behaviour", () => {
    const scopedNews = news.filter((entry) => entry.date <= "2026-08-20");
    const feed = createPortalFeed({
      now: new Date("2026-08-20T12:00:00+09:00"),
      newsItems: scopedNews,
      storyItems: [],
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    // Portal Feed は news / stories / events だけを見る。Gallery 追加で image は変わらない。
    assertPortalNewsFollowsSort(feed, scopedNews);
    assert.ok(entry.image?.endsWith(LATEST_PHOTO));
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(feed.items.some((candidate) => candidate.image?.includes("/media/gallery/mily-b08")), false);
  });
});
