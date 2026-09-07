import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { buildStreamSongCatalog, selectCatalogSongs } from "../src/lib/streamSongCatalog.ts";

// CI installs the pinned browser tooling outside the application/lockfile.
const playwright = process.env.PLAYWRIGHT_MODULE_ROOT
  ? await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright/index.mjs")).href)
  : await import("playwright");
const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(process.env.SONG_CATALOG_ARTIFACT_DIR ?? join(tmpdir(), "mily-song-catalog-browser"));
const base = "http://127.0.0.1:4173";
const live = `${base}/activities/live/`;
const catalog = buildStreamSongCatalog(streamRecaps);
assert.ok(catalog.length > 0, "The approved song data must not be empty");
const probe = catalog.find((song) => song.title === "Mela!") ?? catalog[0];
const targetHash = `#recap-${probe.performances[0].id}`;
const report = {
  target: "local production build (not the protected Vercel Preview)",
  commit: process.env.GITHUB_SHA ?? null,
  head: process.env.PR_HEAD_SHA ?? null,
  coverage: { songs: catalog.length, broadcasts: new Set(catalog.flatMap((song) => song.performances.map((p) => p.id))).size },
  limitations: ["Mobile viewports are emulated, not physical devices", "External player playback and source-video/song identification are not tested"],
  results: [],
};
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, [join(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "";
let serverError;
server.on("error", (error) => { serverError = error; });
for (const stream of [server.stdout, server.stderr]) stream.on("data", (chunk) => { serverLog = (serverLog + chunk).slice(-10000); });
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (serverError) throw serverError;
    if (server.exitCode !== null) throw new Error(`Preview exited: ${serverLog}`);
    try { ready = (await fetch(live)).ok; } catch { /* wait for the local preview */ }
    if (ready) break;
    await pause(100);
  }
  assert.ok(ready, `Local production build did not start: ${serverLog}`);
  for (const scenario of [
    { name: "chromium-desktop", engine: "chromium", viewport: { width: 1280, height: 900 } },
    { name: "chromium-mobile", engine: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    { name: "webkit-mobile", engine: "webkit", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    { name: "chromium-narrow", engine: "chromium", viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true },
  ]) {
    browser = await playwright[scenario.engine].launch({ headless: true });
    const context = await browser.newContext({ viewport: scenario.viewport, isMobile: scenario.isMobile ?? false, hasTouch: scenario.hasTouch ?? false, locale: "ja-JP", timezoneId: "Asia/Tokyo", reducedMotion: "reduce" });
    // Never contact private archives, social services, or external players in CI.
    await context.route("**/*", (route) => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.stack ?? error.message));
    const result = { scenario: scenario.name, passed: [], status: "running" };
    report.results.push(result);
    const check = async (name, operation) => { await operation(); result.passed.push(name); console.log(`PASS ${scenario.name}: ${name}`); };
    const section = page.locator("#song-catalog");
    const search = section.getByRole("searchbox", { name: "曲名・アーティストで検索" });
    const artist = section.getByRole("combobox", { name: "アーティスト", exact: true });
    const order = section.getByRole("combobox", { name: "並び順", exact: true });
    const titles = () => section.locator("h3").allTextContents();
    const expectTitles = async (expected) => {
      await page.waitForFunction(({ expected }) => JSON.stringify([...document.querySelectorAll("#song-catalog h3")].map((node) => node.textContent)) === JSON.stringify(expected), { expected });
      assert.deepEqual(await titles(), expected);
    };
    const overflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Horizontal page overflow");
    try {
      await page.goto(live, { waitUntil: "networkidle" });
      await section.waitFor({ state: "visible" });
      await check("initial count, latest order, responsive layout", async () => {
        await expectTitles(selectCatalogSongs(catalog).map((song) => song.title));
        assert.match(await section.getByRole("status").innerText(), new RegExp(`${catalog.length}曲中 ${catalog.length}曲`));
        await overflow();
        await section.screenshot({ path: join(output, `${scenario.name}-catalog.png`) });
      });
      await check("title / artist / full-width multi-term search", async () => {
        await search.fill("ｍＥＬＡ　緑黄");
        await expectTitles(["Mela!"]);
        await search.fill(probe.artist);
        await expectTitles(selectCatalogSongs(catalog, probe.artist).map((song) => song.title));
        await search.fill("");
      });
      await check("artist filter and both ordering controls", async () => {
        await artist.selectOption(probe.artist);
        await expectTitles(selectCatalogSongs(catalog, "", probe.artist).map((song) => song.title));
        await artist.selectOption("");
        await order.selectOption("title");
        await expectTitles(selectCatalogSongs(catalog, "", "", "title").map((song) => song.title));
        await order.selectOption("recent");
        await expectTitles(selectCatalogSongs(catalog).map((song) => song.title));
      });
      await check("zero results and clear restores search + artist", async () => {
        await artist.selectOption(probe.artist);
        await search.fill("__no_matching_song_191__");
        await expectTitles([]);
        assert.match(await section.getByRole("status").innerText(), /0曲を表示/);
        await section.getByRole("button", { name: "検索条件をクリア" }).click();
        assert.equal(await search.inputValue(), "");
        assert.equal(await artist.inputValue(), "");
        await expectTitles(selectCatalogSongs(catalog).map((song) => song.title));
      });
      await check("original / karaoke links preserve approved URLs and safe new tabs", async () => {
        const links = await section.locator('a[target="_blank"]').evaluateAll((nodes) => nodes.map((node) => ({ href: node.getAttribute("href"), rel: node.rel, label: node.getAttribute("aria-label") })));
        const approved = new Set(catalog.flatMap((song) => [song.youtubeUrl, ...(song.karaoke ? [song.karaoke.youtubeUrl] : [])]));
        assert.deepEqual(new Set(links.map((link) => link.href)), approved);
        for (const link of links) {
          assert.ok(link.rel.split(/\s+/).includes("noopener") && link.rel.split(/\s+/).includes("noreferrer"));
          assert.ok(link.label?.includes("新しいタブ"));
        }
      });
      await check("alternate official recordings disclose their version in both surfaces", async () => {
        for (const song of catalog.filter((entry) => entry.youtubeVersionNote)) {
          const card = section.locator("li").filter({ has: page.getByRole("heading", { name: song.title, exact: true }) }).first();
          assert.ok((await card.innerText()).includes(song.youtubeVersionNote));
          assert.equal(await card.getByRole("link", { name: `${song.title} — 公式歌唱動画をYouTubeで聴く（新しいタブ）`, exact: true }).getAttribute("href"), song.youtubeUrl);
          const details = page.locator(`#recap-${song.performances[0].id}`);
          await details.locator(":scope > summary").click();
          assert.ok((await details.innerText()).includes(song.youtubeVersionNote));
          assert.equal(await details.getByRole("link", { name: `${song.title} — 公式歌唱動画をYouTubeで聴く（新しいタブ）`, exact: true }).getAttribute("href"), song.youtubeUrl);
          await details.locator(":scope > summary").click();
        }
      });
      await check("keyboard expansion, recap jump, repeat same-hash reopen", async () => {
        await search.fill(probe.title);
        const card = section.locator("li").filter({ has: page.getByRole("heading", { name: probe.title, exact: true }) }).first();
        const summary = card.locator("summary");
        await summary.focus();
        await summary.press("Enter");
        const link = card.locator(`a[href="${targetHash}"]`).first();
        await link.click();
        await page.waitForFunction((hash) => location.hash === hash && document.querySelector(hash)?.open === true, targetHash);
        const target = page.locator(targetHash);
        await target.locator(":scope > summary").click();
        await page.waitForFunction((hash) => document.querySelector(hash)?.open === false, targetHash);
        assert.equal(new URL(page.url()).hash, targetHash);
        await link.click();
        await page.waitForFunction((hash) => document.querySelector(hash)?.open === true, targetHash);
        await overflow();
      });
      await check("direct recap link opens after a fresh page load", async () => {
        await page.goto(`${live}${targetHash}`, { waitUntil: "networkidle" });
        await page.waitForFunction((hash) => document.querySelector(hash)?.open === true, targetHash);
        await overflow();
      });
      await check("catalog stays exclusive to LIVE STREAM and no runtime errors", async () => {
        await page.goto(`${base}/activities/radio/`, { waitUntil: "networkidle" });
        assert.equal(await page.locator("#song-catalog").count(), 0);
        assert.deepEqual(errors, []);
      });
      result.status = "passed";
    } catch (error) {
      result.status = "failed";
      result.error = error instanceof Error ? error.message : String(error);
      await page.screenshot({ path: join(output, `${scenario.name}-failure.png`) }).catch(() => {});
      throw error;
    } finally {
      await context.close();
      await browser.close();
      browser = undefined;
    }
  }
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
  await writeFile(join(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
}
