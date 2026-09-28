// Render the static core poster (first paint, and the fallback without WebGL)
// from the live scene. Needs the dev server: npm run dev -- --port 5199
// node scripts/render-core-poster.mjs [url] [out.png]
import process from 'node:process';
import { chromium } from '@playwright/test';

const [url = 'http://127.0.0.1:5199/', out = 'test-results/core-poster.png'] = process.argv.slice(2);
const size = 1400;
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
try {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.addInitScript((edge) => {
    // Sphere diameter = 40% of the poster, matching the director's d / 400 scale.
    window.__coreFrame = () => ({ x: edge / 2, y: edge / 2, d: edge * 0.4, strike: 0, tendril: 0.85, web: 0.8, echo: 0, yaw: 0, pitch: 0, roll: 0, sparks: 1 });
  }, size);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.ch-hud,.ch-dots,.ch-loop-labels,.ch-vignette,.ch-shade,.ch-poster,.ch-chapter,.ch-rail,.ch-motion,header,footer,.wf-preview-label{display:none!important}' });
  await page.waitForFunction(() => document.querySelector('.ch-layer')?.dataset.scene === 'ready', null, { timeout: 20000 });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: out });
  console.log(`Rendered ${out}`);
} finally {
  await browser.close();
}
