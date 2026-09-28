import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const asset = (file, mime) => `data:${mime};base64,${fs.readFileSync(path.join(root, file)).toString('base64')}`;
const font = asset('public/fonts/archivo-var-latin.woff2', 'font/woff2');
const logo = asset('public/brand/whoff-logo.svg', 'image/svg+xml');
const core = asset('public/brand/whoff-core-poster.webp', 'image/webp');
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Whoff Agents LLC — social card</title><style>
    @font-face{font-family:Archivo;src:url('${font}')}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;background:#000;color:#eeeae4;font-family:Archivo,sans-serif}.core{position:absolute;width:980px;height:980px;right:-210px;top:-175px}.shade{position:absolute;inset:0;background:linear-gradient(90deg,#030506 18%,#030506e6 40%,transparent 66%)}.logo{position:absolute;top:58px;left:62px;width:190px}.copy{position:absolute;top:206px;left:62px}h1{font-size:70px;font-weight:450;letter-spacing:-4px;line-height:1.03;margin:0 0 34px}h1 span{color:#a9adb3}p{font-size:18px;letter-spacing:.02em;color:#b2bbc5}footer{position:absolute;bottom:43px;left:62px;right:62px;border-top:1px solid #28323e;padding-top:19px;display:flex;justify-content:space-between;font-size:13px;color:#a4afb4}footer span:first-child{color:#e8dbe0}
  </style></head><body><img class="core" src="${core}" alt=""><div class="shade"></div><img class="logo" src="${logo}" alt="Whoff Agents LLC"><div class="copy"><h1>Human intent.<br><span>Intelligent action.</span></h1><p>Software. Autonomous systems. Applied research.</p></div><footer><span>Whoff Agents LLC / AI-native engineering</span><span>whoffagents.com</span></footer></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.core').evaluate(image => image.decode());
  await page.locator('.logo').evaluate(image => image.decode());
  const output = path.join(root, 'public/og-engineering.png');
  await page.screenshot({ path: output });
  console.log(`Rendered ${output} (1200 × 630)`);
} finally {
  await browser.close();
}
