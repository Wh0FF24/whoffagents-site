// Capture every scene of the Eidolon page for visual review.
//   node scripts/capture-eidolon.mjs <url> <outDir>
// Run it against a preview build (VITE_PRIVATE_PREVIEW=true): the form on
// that page then sends nothing. As a second guard this script submits no
// form, and refuses every write and every request to another host.
//
// At 1440x900 and 390x664 it saves the opening (and its lower part where it
// is taller than the screen), each scene at three points of its scroll
// (start, midway, finished), the status board and the request form (one
// screen of each, and each whole), then the same page with reduced motion,
// where each scene is a still frame. At 375x548, a phone screen with its
// toolbars showing, it saves the opening.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const [url = 'http://127.0.0.1:4174/eidolon', out = 'test-results/eidolon'] = process.argv.slice(2);
const origin = new URL(url).origin;

const SIZES = [
  { width: 1440, height: 900, scale: 1 },
  { width: 390, height: 664, scale: 2 },
  { width: 375, height: 548, scale: 2, heroOnly: true },
];
const SCENES = [
  ['02', 'signal'],
  ['03', 'crowd'],
  ['04', 'lanes'],
  ['05', 'keeping-up'],
  ['06', 'full-day'],
];
const POINTS = [
  ['1-start', 0.04],
  ['2-midway', 0.5],
  ['3-finished', 1],
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const logs = [];

async function open(size, reducedMotion) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.scale,
    reducedMotion,
  });
  await context.route('**/*', (route) => {
    const request = route.request();
    return request.method() === 'GET' && request.url().startsWith(origin) ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  page.on('console', (message) => { if (['error', 'warning'].includes(message.type())) logs.push(`${size.width}: ${message.type()}: ${message.text()}`); });
  page.on('pageerror', (error) => logs.push(`${size.width}: pageerror: ${error.message}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

const scrollTo = (page, top) => page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);

for (const size of SIZES) {
  const dir = path.join(out, `${size.width}x${size.height}`);
  fs.mkdirSync(dir, { recursive: true });

  // With motion: what a visitor scrolls through.
  {
    const { context, page } = await open(size, 'no-preference');
    await page.waitForTimeout(2600);
    await page.screenshot({ path: path.join(dir, '01-hero.png') });
    if (!size.heroOnly) {
      await page.waitForSelector('[data-eid-scene][data-eid-to]', { timeout: 15000 });
      for (const [number, id] of SCENES) {
        const range = await page.locator(`#${id}`).evaluate((section) => ({ from: Number(section.dataset.eidFrom), to: Number(section.dataset.eidTo) }));
        for (const [name, progress] of POINTS) {
          await scrollTo(page, range.from + (range.to - range.from) * progress + (progress === 1 ? 6 : 0));
          await page.waitForTimeout(1500);
          await page.screenshot({ path: path.join(dir, `${number}-${id}-${name}.png`) });
        }
      }
      // The skip link waits off screen until focused; a capture taller than
      // the screen would otherwise draw it over the section.
      await page.addStyleTag({ content: '.wf-skip { display: none; }' });
      for (const [number, id] of [['07', 'status'], ['08', 'request']]) {
        const section = page.locator(`#${id}`);
        await section.scrollIntoViewIfNeeded();
        // Let the reveals finish before the picture is taken.
        await section.evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY + element.offsetHeight - window.innerHeight * 0.5, behavior: 'instant' }));
        await page.waitForTimeout(1600);
        await section.evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }));
        await page.waitForTimeout(1200);
        // One screen of it, then the whole section however tall it is.
        await page.screenshot({ path: path.join(dir, `${number}-${id}.png`) });
        await section.screenshot({ path: path.join(dir, `${number}-${id}-whole.png`) });
      }
      // Where the opening is taller than the screen, its lower part as well.
      const below = await page.locator('.eid-hero').evaluate((hero) => Math.round(hero.getBoundingClientRect().bottom + window.scrollY - window.innerHeight));
      if (below > 1) {
        await scrollTo(page, below);
        await page.waitForTimeout(900);
        await page.screenshot({ path: path.join(dir, '01-hero-lower.png') });
      }
    }
    await context.close();
  }

  // Reduced motion: every scene as its still frame.
  if (!size.heroOnly) {
    const { context, page } = await open(size, 'reduce');
    // The skip link waits off screen until focused; a capture taller than
    // the screen would otherwise draw it over the section.
    await page.addStyleTag({ content: '.wf-skip { display: none; }' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(dir, 'still-01-hero.png') });
    for (const [number, id] of [...SCENES, ['07', 'status'], ['08', 'request']]) {
      await page.locator(`#${id}`).screenshot({ path: path.join(dir, `still-${number}-${id}.png`) });
    }
    console.log(JSON.stringify({
      size: `${size.width}x${size.height}`,
      overflowX: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
      height: await page.evaluate(() => document.documentElement.scrollHeight),
    }));
    await context.close();
  }
}

console.log(logs.length ? logs.slice(0, 30).join('\n') : 'no console errors or warnings');
await browser.close();
