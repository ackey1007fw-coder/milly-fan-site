import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { featuredPhoto, media, visibleMedia } from "../src/data/media.ts";
import { verifyMedia } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const validItem = {
  id: "fixture",
  kind: "photo",
  basePath: "/media/gallery/mily-b01-03-bouquet-smile",
  widths: [480, 960, 1600],
  width: 1600,
  height: 1200,
  alt: "花束を持った写真",
  provenance: "owner-provided",
  sourceUrl: null,
  sourceDate: null,
  credit: null,
  published: true,
};

describe("media collection", () => {
  it("accepts the live collection", () => {
    assert.deepEqual(verifyMedia(media), []);
  });

  it("enforces the mily- filename scheme", () => {
    assert.deepEqual(verifyMedia([validItem]), []);

    const errors = verifyMedia([
      { ...validItem, id: "bad", basePath: "/media/gallery/birthday" },
    ]);
    assert.ok(errors.some((error) => error.includes("mily-bNN-NN")));
  });

  it("requires a sourceUrl when provenance claims an SNS post", () => {
    const errors = verifyMedia([
      { ...validItem, id: "sns", provenance: "sns-post" },
    ]);
    assert.ok(errors.some((error) => error.includes("sourceUrl")));
  });

  it("rejects guessed source dates", () => {
    const errors = verifyMedia([
      { ...validItem, id: "date", sourceDate: "2026-02-30" },
    ]);
    assert.ok(errors.some((error) => error.includes("sourceDate")));
  });

  it("ships every derivative file for published photos", () => {
    for (const item of visibleMedia(media)) {
      if (item.kind !== "photo") continue;
      for (const width of item.widths) {
        for (const format of ["jpg", "webp"]) {
          const file = path.join(root, "public", `${item.basePath}-${width}.${format}`);
          assert.ok(existsSync(file), `missing ${item.basePath}-${width}.${format}`);
        }
      }
    }
  });

  it("publishes the 8/19 autumn-leaf photo without cropping the portrait", () => {
    const item = media.find((entry) => entry.id === "mily-b05-01");
    assert.ok(item);
    assert.equal(item.published, true);
    assert.equal(item.kind, "photo");
    assert.equal(item.basePath, "/media/gallery/mily-b05-01-autumn-leaf");
    assert.equal(item.provenance, "owner-provided");
    // 撮影日・撮影者・公開投稿URLは未確認。推測して埋めない。
    assert.equal(item.sourceUrl, null);
    assert.equal(item.sourceDate, null);
    assert.equal(item.credit, null);
    // Hero の featured を奪わない
    assert.notEqual(item.featured, true);
    assert.equal(featuredPhoto(media)?.id, "mily-b01-03");
    // 元素材 1152px 幅。`-1600` は拡大されないので実寸を記録する。
    assert.equal(item.width, 1152);
    assert.equal(item.height, 2048);
    assert.equal(item.aspect, "1152 / 2048");
  });

  it("keeps landscape tiles on the default 4/3 aspect", () => {
    // 縦写真と正方形だけが aspect を持つ。4/3 の横写真は既定のまま。
    const portraits = new Set([
      "mily-b05-01",
      "mily-b08-01",
      "mily-b10-01",
      "mily-b10-02",
      "mily-b10-03",
      "mily-b10-04",
      "mily-b10-05",
      "mily-b22-01",
      "mily-b27-06",
      "mily-b27-07",
      "mily-b28-01",
      "mily-b29-01",
      "mily-b30-01",
      "mily-b31-01",
      "mily-b32-01",
      "mily-b14-01",
      "mily-b24-01",
      "mily-b38-01",
      "mily-b38-02",
      "mily-b38-03",
      "mily-b38-04",
      "mily-b38-05",
      "mily-b63-01",
    ]);
    for (const item of media) {
      if (portraits.has(item.id)) {
        assert.ok(item.aspect, item.id);
        continue;
      }
      assert.equal(item.aspect, undefined, item.id);
    }
  });

  it("publishes the 8/20 morning photo as a portrait Gallery tile", () => {
    const item = media.find((entry) => entry.id === "mily-b08-01");

    assert.ok(item);
    assert.equal(item.published, true);
    assert.equal(item.kind, "photo");
    assert.equal(item.basePath, "/media/gallery/mily-b08-01-do-what-you-can-morning");
    assert.equal(item.provenance, "owner-provided");
    // 一次出典は本人X投稿。投稿日は確認済み。撮影者は未確認なので推測しない。
    assert.equal(
      item.sourceUrl,
      "https://x.com/mily_chan36/status/2090242507586322892",
    );
    assert.equal(item.sourceDate, "2026-08-20");
    assert.equal(item.credit, null);
    // Hero の featured を奪わない
    assert.notEqual(item.featured, true);
    assert.equal(featuredPhoto(media)?.id, "mily-b01-03");
    // 元素材 1538px 幅。`-1600` は拡大されないので実寸を記録する。
    assert.equal(item.width, 1538);
    assert.equal(item.height, 2048);
    assert.equal(item.aspect, "1538 / 2048");
    assert.deepEqual(item.widths, [480, 960, 1600]);
  });

  it("only surfaces published items", () => {
    const items = visibleMedia([
      { ...validItem, id: "on" },
      { ...validItem, id: "off", published: false },
    ]);
    assert.deepEqual(items.map((item) => item.id), ["on"]);
  });

  it("never features an unpublished photo", () => {
    const photo = featuredPhoto(media);
    if (!photo) return;
    assert.equal(photo.published, true);
  });
});

describe("gallery provenance", () => {
  it("links to the source only when one is confirmed", async () => {
    const source = await readFile(
      path.join(root, "src/components/Gallery.tsx"),
      "utf8",
    );

    const selector = await readFile(
      path.join(root, "src/lib/galleryItems.ts"),
      "utf8",
    );
    assert.match(source, /from "\.\/ExternalLink"/);
    assert.match(selector, /visibleMedia\(media\)/);
    assert.match(source, /item\.sourceUrl \?/);
    assert.match(source, /href=\{item\.sourceUrl\}/);
    assert.match(source, /出典を見る/);
    // 縦写真は aspect でタイル比率を上書きし、4/3 へ切り抜かない
    assert.match(source, /aspect-\[4\/3\]/);
    assert.match(source, /item\.aspect \? \{ aspectRatio: item\.aspect \}/);
  });
});

describe("hero media wiring", () => {
  it("uses featuredPhoto and keeps the unofficial badge", async () => {
    const source = await readFile(path.join(root, "src/components/Hero.tsx"), "utf8");

    assert.match(source, /featuredPhoto/);
    assert.match(source, /ファン運営・非公式サイト/);
    assert.match(source, /href="#latest"/);
    // 応援導線は Support Hub（/support/）へ送る
    assert.match(source, /SUPPORT_HUB_ROUTE/);
  });

  it("keeps the unofficial disclaimer in the footer", async () => {
    const source = await readFile(
      path.join(root, "src/components/Footer.tsx"),
      "utf8",
    );
    assert.match(source, /ファン運営の非公式サイト/);
    assert.match(source, /本人の運営ではありません/);
  });
});
