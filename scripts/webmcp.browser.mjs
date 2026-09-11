import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const playwright = process.env.PLAYWRIGHT_MODULE_ROOT
  ? await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, "playwright/index.mjs")).href)
  : await import("playwright");
const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(process.env.WEBMCP_ARTIFACT_DIR ?? join(tmpdir(), "mily-webmcp-browser"));
const port = process.env.WEBMCP_TEST_PORT ?? "4187";
const base = `http://127.0.0.1:${port}`;
const names = ["find_song", "get_latest_schedule", "get_live_recap", "search_live_archives"];
const report = { target: "isolated local production build", head: process.env.PR_HEAD_SHA ?? null, limitations: ["Mocked browser API tests are not native WebMCP or ChatGPT client verification", "Viewports are emulated, not physical devices", "External requests are blocked; schedule APIs use fixtures"], results: [] };
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, [join(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", port, "--strictPort"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
let serverLog = ""; let serverError; let browser;
server.on("error", error => { serverError = error; });
for (const stream of [server.stdout, server.stderr]) stream.on("data", chunk => { serverLog = (serverLog + chunk).slice(-4000); });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (serverError) throw serverError;
    if (server.exitCode !== null) throw new Error(`Preview exited: ${serverLog}`);
    try { ready = (await fetch(base)).ok; } catch { /* local server boot */ }
    if (ready) break;
    await pause(100);
  }
  assert.ok(ready, "Preview failed to start");
  for (const scenario of [
    { name: "chromium-desktop-no-api", engine: "chromium", width: 1280, height: 900, api: "none" },
    { name: "webkit-mobile-no-api", engine: "webkit", width: 390, height: 844, api: "none" },
    { name: "chromium-desktop-document-api", engine: "chromium", width: 1280, height: 900, api: "document" },
    { name: "chromium-mobile-document-api", engine: "chromium", width: 390, height: 844, api: "document" },
    { name: "chromium-legacy-navigator-api", engine: "chromium", width: 390, height: 844, api: "navigator" },
  ]) {
    browser = await playwright[scenario.engine].launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: scenario.width, height: scenario.height }, isMobile: scenario.width < 500, hasTouch: scenario.width < 500, locale: "ja-JP", timezoneId: "Asia/Tokyo", reducedMotion: "reduce" });
    await context.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.origin !== base) return route.abort();
      if (url.pathname.startsWith("/api/")) {
        const payload = url.pathname === "/api/mily-schedule" ? { ok: true, slots: [] } : { ok: false };
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) });
      }
      return route.continue();
    });
    await context.addInitScript(api => {
      const tools = new Map();
      Object.defineProperty(window, "__webmcpTestTools", { value: tools });
      for (const owner of [document, navigator]) Object.defineProperty(owner, "modelContext", { configurable: true, value: undefined });
      if (api !== "none") {
        const registry = {
          async registerTool(tool, options) {
            if (tools.has(tool.name)) throw new Error("duplicate");
            tools.set(tool.name, tool);
            options?.signal?.addEventListener("abort", () => tools.delete(tool.name), { once: true });
          },
          unregisterTool(name) { tools.delete(name); },
        };
        Object.defineProperty(api === "document" ? document : navigator, "modelContext", { configurable: true, value: registry });
      }
    }, scenario.api);
    const page = await context.newPage();
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    const result = { scenario: scenario.name, browserVersion: browser.version(), passed: [], status: "running" };
    report.results.push(result);
    const check = async (name, fn) => { await fn(); result.passed.push(name); console.log(`PASS ${scenario.name}: ${name}`); };
    const call = (name, input) => page.evaluate(async ({ name, input }) => JSON.parse((await window.__webmcpTestTools.get(name).execute(input)).content[0].text), { name, input });
    try {
      for (const route of ["/", "/activities/live/"]) {
        await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
        await page.locator("#root").waitFor();
        await check(`ordinary content and no overflow at ${route}`, async () => {
          assert.ok((await page.locator("body").innerText()).includes("みりぃ"));
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
        });
        if (scenario.api === "none") {
          assert.equal(await page.evaluate(() => window.__webmcpTestTools.size), 0);
          continue;
        }
        await page.waitForFunction(() => window.__webmcpTestTools.size === 4);
        await check(`four registrations and real data reads at ${route}`, async () => {
          assert.deepEqual(await page.evaluate(() => [...window.__webmcpTestTools.keys()].sort()), names);
          const search = await call("search_live_archives", { date: "2026-09-10" });
          assert.equal(search.items[0].id, "2026-09-10-asa-showroom");
          const songs = await call("find_song", { date: "2026-09-10", limit: 5 });
          assert.deepEqual(new Set(songs.items.map(s => s.title)), new Set(["ケセラセラ", "かわいいだけじゃだめですか？"]));
          assert.equal((await call("get_live_recap", { id: search.items[0].id })).found, true);
          assert.equal((await call("get_latest_schedule", {})).showroom.sourceMode, "contest-official");
          assert.equal((await call("find_song", { limit: 100 })).error, "INVALID_ARGUMENT");
        });
        if (route.includes("live")) {
          await check("read operations preserve DOM and returned recap links open the existing card", async () => {
            const before = await page.locator("#song-catalog").innerHTML();
            const overview = await call("get_live_recap", { id: "2026-09-10-asa-showroom" });
            assert.equal(await page.locator("#song-catalog").innerHTML(), before);
            await page.goto(new URL(overview.sourceUrl, base).href, { waitUntil: "networkidle" });
            assert.equal(await page.locator("#recap-2026-09-10-asa-showroom").evaluate(node => node.open), true);
          });
        }
      }
      await page.screenshot({ path: join(output, `${scenario.name}.png`), fullPage: false });
      await page.goto(`${base}/activities/radio/`, { waitUntil: "networkidle" });
      await check("no registration outside pilot routes and no runtime errors", async () => {
        assert.equal(await page.evaluate(() => window.__webmcpTestTools.size), 0);
        assert.deepEqual(errors, []);
      });
      result.status = "passed";
    } catch (error) {
      result.status = "failed"; result.error = error.message;
      await page.screenshot({ path: join(output, `${scenario.name}-failure.png`) }).catch(() => {});
      throw error;
    } finally { await context.close(); await browser.close(); browser = undefined; }
  }
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
  await writeFile(join(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
}
