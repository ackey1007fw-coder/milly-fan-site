import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import {
  OHAYO_PANDA_SELFIE_X_URL,
  ohayoPandaSelfieImage,
} from "../src/data/ohayoPandaSelfie.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-12-ohayo-panda-selfie";
const SOURCE = "https://x.com/Mily_chan36/status/2098566313593680195";
const VOTE = "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-12 X final-day update", () => {
  it("adds one source-backed Latest / NEWS item", () => {
    const entry = item();
    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-09-12");
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.source, OHAYO_PANDA_SELFIE_X_URL);
    assert.equal(entry.sourceLabel, "元のX投稿を見る");
    assert.match(entry.title, /20:40〜21:59/);
    assert.match(entry.body, /36,599pt/);
    assert.ok(
      entry.additionalCtas?.some(
        (cta) => cta.url === "https://www.showroom-live.com/r/circle2026_0734",
      ),
    );
    assert.ok(entry.additionalCtas?.some((cta) => cta.url === VOTE));
    assert.equal(entry.media, ohayoPandaSelfieImage);
    assert.equal(entry.message?.label, "画像内テキスト");
    assert.equal(entry.message?.text, "おはよう♡");
    assert.equal(entry.source.includes("?"), false);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("keeps the ordinary X photo on NEWS instead of auto-promoting Gallery", () => {
    assert.equal(media.some((entry) => entry.id === "mily-b101-01"), false);
    assert.equal(ohayoPandaSelfieImage.kind, "image");
    assert.equal(ohayoPandaSelfieImage.width, 1152);
    assert.equal(ohayoPandaSelfieImage.height, 2048);
  });
  it("ships one metadata-clean NEWS image and no Gallery copy", async () => {
    const newsFile = path.join(
      root,
      "public/media/news/mily-b101-01-ohayo-panda-selfie.jpg",
    );
    const galleryFile = path.join(
      root,
      "public/media/gallery/mily-b101-01-ohayo-panda-selfie-1600.jpg",
    );
    assert.equal(existsSync(newsFile), true, newsFile);
    assert.equal(existsSync(galleryFile), false, galleryFile);
    assert.equal(ohayoPandaSelfieImage.src, "/media/news/mily-b101-01-ohayo-panda-selfie.jpg");
    const metadata = await sharp(newsFile).metadata();
    assert.equal(metadata.width, 1152);
    assert.equal(metadata.height, 2048);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  });
});
