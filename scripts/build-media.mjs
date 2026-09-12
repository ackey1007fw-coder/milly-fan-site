/**
 * Builds web derivatives for gallery photos.
 *
 * Input:  media/original/  (untouched source files, never committed)
 * Output: public/media/gallery/<name>-<width>.{jpg,webp}
 *
 * Rules enforced here:
 * - never overwrite an existing output file (rename the source instead)
 * - never upscale
 * - metadata (EXIF / GPS / IPTC) is dropped: sharp strips it unless
 *   withMetadata() is called, which this script never does
 */
import { readdir, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SOURCE_DIR = path.join(root, "media/original");
export const OUTPUT_DIR = path.join(root, "public/media/gallery");
export const DERIVATIVE_WIDTHS = [480, 960, 1600];
export const NAME_RE = /^mily-b\d{2,}-\d{2}(-[a-z0-9]+)+\.(jpg|jpeg)$/;

export function invalidSourceNames(sources) {
  return sources.filter((name) => !NAME_RE.test(name));
}

export function derivativeFilenames(sourceName) {
  const base = sourceName.replace(/\.jpe?g$/i, "");
  return DERIVATIVE_WIDTHS.flatMap((width) =>
    ["jpg", "webp"].map((format) => `${base}-${width}.${format}`),
  );
}

/**
 * @returns {"build" | "skip" | "partial"}
 */
export function classifyExistingDerivatives(sourceName, existingNames) {
  const expected = derivativeFilenames(sourceName);
  const existing = expected.filter((name) => existingNames.has(name));
  if (existing.length === 0) return "build";
  if (existing.length === expected.length) return "skip";
  return "partial";
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let sources;
  try {
    sources = (await readdir(SOURCE_DIR)).filter((name) => /\.jpe?g$/i.test(name));
  } catch {
    console.error(`media:build — no ${path.relative(root, SOURCE_DIR)} directory found.`);
    process.exit(1);
  }

  const badNames = invalidSourceNames(sources);
  if (badNames.length > 0) {
    console.error("media:build — source filenames must match mily-bNN-NN-<slug>.jpg:");
    for (const name of badNames) console.error(`  - ${name}`);
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const name of sources) {
    const sourcePath = path.join(SOURCE_DIR, name);
    const outNames = derivativeFilenames(name);
    const existing = [];
    for (const outName of outNames) {
      const outPath = path.join(OUTPUT_DIR, outName);
      if (await exists(outPath)) existing.push(outPath);
    }

    const decision = classifyExistingDerivatives(name, new Set(existing.map((file) => path.basename(file))));
    if (decision === "skip") {
      console.log(`${name}  already built — skipping`);
      continue;
    }
    if (decision === "partial") {
      console.error(
        `media:build — ${name} has a partial derivative set. ` +
          "Refusing to overwrite published files; use a new name for changed content.",
      );
      process.exit(1);
    }

    const meta = await sharp(sourcePath).metadata();
    console.log(`${name}  ${meta.width}x${meta.height}`);

    for (const width of DERIVATIVE_WIDTHS) {
      for (const format of ["jpg", "webp"]) {
        const outPath = path.join(OUTPUT_DIR, `${name.replace(/\.jpe?g$/i, "")}-${width}.${format}`);

        const pipeline = sharp(sourcePath)
          .rotate()
          .resize({ width, withoutEnlargement: true });
        if (format === "jpg") {
          await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(outPath);
        } else {
          await pipeline.webp({ quality: 78 }).toFile(outPath);
        }
        console.log(`  -> ${path.relative(root, outPath)}`);
      }
    }
  }

  console.log("media:build — done.");
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  await main();
}
