import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(join(process.env.PLAYWRIGHT_MODULE_ROOT, 'playwright/index.mjs')).href);
const output = join(process.env.SONG_CATALOG_ARTIFACT_DIR, 'avatar-story');
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { stdio: 'ignore' });
let browser;
const results = [];
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch('http://127.0.0.1:4175/news/')).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready);
  browser = await chromium.launch({ headless: true });
  for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1440, 1000]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4175/news/', { waitUntil: 'networkidle' });
    const card = page.locator('li').filter({ hasText: '初めてのアバ権達成！' });
    await card.waitFor();
    await card.scrollIntoViewIfNeeded();
    const video = card.locator('video');
    await video.evaluate(async element => { element.muted = true; await element.play(); });
    await page.waitForFunction(() => {
      const element = document.querySelector('video[src*="b103-01"]');
      return element && element.currentTime > 0 && element.videoWidth === 512;
    });
    const state = await video.evaluate(element => ({ duration: element.duration, controls: element.controls, inline: element.playsInline, width: element.videoWidth, height: element.videoHeight }));
    assert.equal(state.duration, 20);
    assert.equal(state.controls, true);
    assert.equal(state.inline, true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.deepEqual(errors, []);
    await card.screenshot({ path: join(output, `${name}.png`) });
    await page.goto('http://127.0.0.1:4175/', { waitUntil: 'domcontentloaded' });
    await page.locator('#latest').getByText('初めてのアバ権達成！3次審査を走り切った感謝を届けて', { exact: true }).waitFor();
    results.push({ name, state, errors, status: 'passed' });
    await page.close();
  }
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2));
  await browser?.close();
  server.kill('SIGTERM');
}
console.log(JSON.stringify(results));
