import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectFiles, SCAN_EXTENSIONS } from "./check-site-identity.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

function relativeLuminance(hex) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe("mily site identity", () => {
  it("uses the mily public identity in package and repo metadata", async () => {
    const pkg = JSON.parse(await read("package.json"));
    const site = await read("src/data/site.ts");
    const agents = await read("AGENTS.md");

    assert.equal(pkg.name, "mily-fan-site");
    assert.match(site, /mily-fan-site/);
    assert.match(site, /https:\/\/mily-fan-site\.vercel\.app/);
    assert.doesNotMatch(pkg.name, /\bmilly\b/i);
    assert.doesNotMatch(site, /\bmilly\b/i);
    assert.match(agents, /mily-fan-site/);
    assert.match(agents, /@mily_chan36/);
    assert.doesNotMatch(agents, /\bmilly\b/i);
  });

  it("keeps the unofficial disclaimer in the document title", async () => {
    const html = await read("index.html");
    assert.match(html, /<title>三橋莉子（みりぃ）ファンサイト｜配信・活動情報（非公式）<\/title>/);
    assert.match(html, /ファン運営の非公式サイト/);
    assert.match(html, /本人運営ではありません/);
    assert.doesNotMatch(html, /公式・公認・本人運営ではありません/);
  });

  it("keeps standalone / home-screen names unofficial", async () => {
    const manifest = JSON.parse(await read("public/site.webmanifest"));
    assert.match(manifest.name, /非公式|ファンサイト/);
    assert.match(manifest.short_name, /非公式|ファンサイト/);
    assert.doesNotMatch(manifest.short_name, /^みりぃ$/);
    assert.match(manifest.description, /非公式/);
    assert.match(manifest.description, /ファン運営/);
    assert.match(manifest.description, /本人運営ではありません/);
    assert.doesNotMatch(manifest.description, /公式・公認・本人運営ではありません/);
    assert.equal(manifest.display, "standalone");
  });

  it("stores favicon.svg as valid UTF-8 XML", async () => {
    const bytes = await readFile(path.join(root, "public/favicon.svg"));
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    assert.match(text, /encoding="UTF-8"/);
    assert.match(text, /aria-label="みりぃ ファンサイト（非公式）"/);
    assert.doesNotMatch(text, /\uFFFD/);
  });

  it("uses a WCAG AA contrast color for schedule kind labels", async () => {
    const ratio = contrastRatio("#8a4e20", "#fffcf8");
    assert.ok(ratio >= 4.5, `contrast ratio ${ratio.toFixed(2)} is below 4.5`);
    const css = await read("src/components/Schedule.tsx");
    assert.match(css, /text-apricot-ink/);
    assert.doesNotMatch(css, /text-apricot[^-]/);
  });

  it("passes the site identity guard", () => {
    const result = spawnSync(
      process.execPath,
      [path.join(root, "scripts/check-site-identity.mjs"), "main"],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr || result.stdout);
  });

  it("scans public metadata files in the identity guard", async () => {
    for (const extension of [".webmanifest", ".xml", ".txt", ".svg"]) {
      assert.equal(SCAN_EXTENSIONS.has(extension), true, `should scan ${extension}`);
    }

    const files = await collectFiles(root);
    const rel = files.map((filePath) =>
      path.relative(root, filePath).replaceAll("\\", "/"),
    );

    for (const expected of [
      "public/site.webmanifest",
      "public/sitemap.xml",
      "public/robots.txt",
      "public/favicon.svg",
    ]) {
      assert.ok(rel.includes(expected), `should scan ${expected}`);
    }
  });
});
