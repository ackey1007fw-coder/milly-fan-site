import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DERIVATIVE_WIDTHS,
  NAME_RE,
  OUTPUT_DIR,
  SOURCE_DIR,
  classifyExistingDerivatives,
  derivativeFilenames,
  invalidSourceNames,
} from "./build-media.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("media:build pipeline", () => {
  it("reads originals from media/original and writes public/media/gallery", () => {
    assert.equal(path.relative(root, SOURCE_DIR).replaceAll("\\", "/"), "media/original");
    assert.equal(
      path.relative(root, OUTPUT_DIR).replaceAll("\\", "/"),
      "public/media/gallery",
    );
    assert.deepEqual(DERIVATIVE_WIDTHS, [480, 960, 1600]);
  });

  it("accepts mily-bNN-NN slug names and rejects unsafe names", () => {
    assert.equal(NAME_RE.test("mily-b02-01-confirmed-slug.jpg"), true);
    assert.equal(invalidSourceNames(["mily-b02-01-confirmed-slug.jpg"]).length, 0);

    assert.equal(NAME_RE.test("mily-b110-01-confirmed-slug.jpg"), true);

    const bad = invalidSourceNames([
      "birthday.jpg",
      "mily-b2-1-short.jpg",
      "mily-b02-01.jpg",
      "mily-b02-01-HasCaps.jpg",
      "mily-b02-01-slug.png",
    ]);
    assert.equal(bad.length, 5);
  });

  it("plans six derivatives and skips a complete set", () => {
    const names = derivativeFilenames("mily-b02-01-confirmed-slug.jpg");
    assert.equal(names.length, 6);
    assert.ok(names.includes("mily-b02-01-confirmed-slug-480.webp"));
    assert.ok(names.includes("mily-b02-01-confirmed-slug-1600.jpg"));

    assert.equal(
      classifyExistingDerivatives("mily-b02-01-confirmed-slug.jpg", new Set()),
      "build",
    );
    assert.equal(
      classifyExistingDerivatives("mily-b02-01-confirmed-slug.jpg", new Set(names)),
      "skip",
    );
  });

  it("refuses a partial derivative set instead of overwriting", () => {
    const decision = classifyExistingDerivatives(
      "mily-b02-01-confirmed-slug.jpg",
      new Set(["mily-b02-01-confirmed-slug-480.jpg"]),
    );
    assert.equal(decision, "partial");
  });

  it("does not run the build as a side effect of being imported by tests", async () => {
    const source = await readFile(path.join(root, "scripts/build-media.mjs"), "utf8");
    assert.match(source, /isDirectRun/);
    assert.match(source, /if \(isDirectRun\)/);
    assert.doesNotMatch(source, /^await main\(\);$/m);
  });
});
