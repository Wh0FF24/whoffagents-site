// Capture each homepage chapter at full resolution for visual review.
// node scripts/capture-core.mjs <url> <outDir> [width] [height] [chapters]
import { chromium } from '@playwright/test';
import process from 'node:process';

const [url = 'http://127.0.0.1:5199/', out = 'test-results/core', width = '1440', height = '900', only = ''] = process.argv.slice(2);
const chapters = ['core', 'capabilities', 'method', 'research', 'company', 'contact'].filter((id) => !only || only.split(',').includes(id));
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) }, deviceScaleFactor: 1 });
const logs = [];
page.on('console', (message) => { if (['error', 'warning'].includes(message.type())) logs.push(`${message.type()}: ${message.text()}`); });
page.on('pageerror', (error) => logs.push(`pageerror: ${error.message}`));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(4500);
for (const id of chapters) {
  if (id !== 'core') {
    await page.evaluate((target) => {
      const element = document.getElementById(target);
      const top = element.getBoundingClientRect().top + window.scrollY;
      const extra = target === 'method' ? Math.max(0, element.offsetHeight - window.innerHeight) * 0.55 : 0;
      window.scrollTo({ top: top + extra, behavior: 'instant' });
    }, id);
    await page.waitForTimeout(2800);
  }
  await page.screenshot({ path: `${out}/${width}-${id}.png` });
}
const info = await page.evaluate(() => ({
  scene: document.querySelector('.ch-layer')?.dataset.scene,
  chapter: document.querySelector('.ch-layer')?.dataset.chapter,
  scrollHeight: document.documentElement.scrollHeight,
  overflowX: document.documentElement.scrollWidth > innerWidth,
}));
console.log(JSON.stringify(info));
console.log(logs.slice(0, 20).join('\n'));
await browser.close();
