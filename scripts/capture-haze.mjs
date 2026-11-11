// Capture the /haze page for visual review.
//   node scripts/capture-haze.mjs <url> <screenshot directory> [video directory]
// Run it against a preview build (VITE_PRIVATE_PREVIEW=true): the form on
// that page then sends nothing. As a second guard this script opens local
// addresses only, and refuses every write and every request to another host.
//
// Screenshots, at 1440x900 and 390x664:
//  - The opening at three points of its loop (in focus, losing its edge, soft).
//  - Each scene at three points (start, midway, finished).
//  - Each section of plain text, the form, and the form after a send with
//    nothing filled in and after a preview send.
//  - The same page with reduced motion, where each scene is a still frame.
// At 375x548, a phone screen with its toolbars showing: the opening.
//
// Videos, if a video directory is given: one slow scroll from top to bottom
// at each of the two sizes, haze-desktop.webm and haze-phone.webm. Give
// `none` as the screenshot directory to record the videos only.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const [url = 'http://127.0.0.1:4470/haze', out = 'test-results/haze', videoOut] = process.argv.slice(2);
const target = new URL(url);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname)) {
  console.error('Refusing to run: this capture only opens a local preview.');
  process.exit(2);
}

const SIZES = [
  { width: 1440, height: 900, scale: 1 },
  { width: 390, height: 664, scale: 2 },
  { width: 375, height: 548, scale: 2, openingOnly: true },
];
const SCENES = [
  ['02', 'pattern'],
  ['03', 'crowd'],
  ['04', 'tested'],
  ['05', 'score'],
];
const PLAIN = [
  ['06', 'rules'],
  ['07', 'limits'],
  ['08', 'waitlist'],
];
const POINTS = [
  ['1-start', 0.02],
  ['2-midway', 0.5],
  ['3-finished', 1],
];
// The opening loop, as shares of its length: in focus, losing its edge, soft.
const LOOP = [
  ['1-start', 0.2],
  ['2-midway', 0.46],
  ['3-finished', 0.86],
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const logs = [];

// Pages and their files from the local preview only, and never a write.
const guard = (context) =>
  context.route('**/*', (route) => {
    const request = route.request();
    return request.method() === 'GET' && request.url().startsWith(target.origin) ? route.continue() : route.abort();
  });

async function open(size, { reducedMotion = 'no-preference' } = {}) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.scale,
    reducedMotion,
  });
  await guard(context);
  const page = await context.newPage();
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) logs.push(`${size.width}: ${message.type()}: ${message.text()}`);
  });
  page.on('pageerror', (error) => logs.push(`${size.width}: pageerror: ${error.message}`));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

const scrollTo = (page, top) => page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
// Put an element in the middle of the screen (or at the top, under the bar).
const centre = (page, selector) =>
  page.locator(selector).evaluate((element) => {
    const bar = document.querySelector('.hz-bar')?.offsetHeight ?? 0;
    const room = window.innerHeight - bar - element.offsetHeight;
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - bar - Math.max(0, room / 2), behavior: 'instant' });
  });
const top = (page, selector) =>
  page.locator(selector).evaluate((element) => {
    const bar = document.querySelector('.hz-bar')?.offsetHeight ?? 0;
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - bar, behavior: 'instant' });
  });

// Hold the opening loop at one point of its length.
const holdLoop = (page, share) =>
  page.evaluate((at) => {
    for (const animation of document.querySelector('.hz-open-fig').getAnimations({ subtree: true })) {
      if (!['hz-focus', 'hz-soften'].includes(animation.animationName)) continue;
      animation.pause();
      animation.currentTime = at * animation.effect.getTiming().duration;
    }
  }, share);

for (const size of out === 'none' ? [] : SIZES) {
  const dir = path.join(out, `${size.width}x${size.height}`);
  fs.mkdirSync(dir, { recursive: true });
  const shot = (page, name) => page.screenshot({ path: path.join(dir, `${name}.png`) });

  // With motion: what a visitor scrolls through.
  {
    const { context, page } = await open(size);
    await page.waitForSelector('.hz-page[data-hz-on]', { timeout: 15000 });
    await page.waitForTimeout(500);
    for (const [name, share] of LOOP) {
      if (size.openingOnly && name !== '1-start') continue;
      await holdLoop(page, share);
      await page.waitForTimeout(250);
      await shot(page, size.openingOnly ? '01-opening' : `01-opening-${name}`);
    }
    if (!size.openingOnly) {
      // Where the opening is taller than the screen, the whole of it as well.
      if (await page.locator('.hz-opening').evaluate((section) => section.offsetHeight > window.innerHeight)) {
        await page.locator('.hz-opening').screenshot({ path: path.join(dir, '01-opening-whole.png') });
      }
      const held = (await page.locator('#pattern').getAttribute('data-hz-to')) !== null;
      for (const [number, id] of SCENES) {
        if (held) {
          // Held scenes follow the scroll: go to three points of the stretch.
          const range = await page.locator(`#${id}`).evaluate((section) => ({ from: Number(section.dataset.hzFrom), to: Number(section.dataset.hzTo) }));
          for (const [name, progress] of POINTS) {
            await scrollTo(page, range.from + (range.to - range.from) * progress + (progress === 1 ? 8 : 0));
            await page.waitForTimeout(1500);
            await shot(page, `${number}-${id}-${name}`);
          }
        } else {
          // Small screens play a scene once as its figure arrives: catch it
          // as it starts, partway, and when it has finished.
          await centre(page, `#${id} .hz-figure`);
          await page.waitForTimeout(120);
          await shot(page, `${number}-${id}-1-start`);
          await page.waitForTimeout(2500);
          await shot(page, `${number}-${id}-2-midway`);
          await page.waitForSelector(`#${id}[data-hz-play="done"]`, { timeout: 15000 });
          await page.waitForTimeout(300);
          await shot(page, `${number}-${id}-3-finished`);
          // The words that go with the figure sit above it on a small screen.
          await top(page, `#${id}`);
          await page.waitForTimeout(300);
          await shot(page, `${number}-${id}-words`);
        }
      }
      for (const [number, id] of PLAIN) {
        // Let the short rise finish before the picture is taken.
        await page.locator(`#${id}`).evaluate((section) => window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY + section.offsetHeight - window.innerHeight * 0.6, behavior: 'instant' }));
        await page.waitForTimeout(1300);
        await top(page, `#${id}`);
        await page.waitForTimeout(900);
        await shot(page, `${number}-${id}`);
        await page.locator(`#${id}`).screenshot({ path: path.join(dir, `${number}-${id}-whole.png`) });
      }
      // The form after a send with nothing filled in, and after a preview send.
      const form = page.locator('#waitlist form');
      await form.getByRole('button', { name: 'Join the waitlist' }).click();
      await page.waitForTimeout(500);
      await page.locator('#waitlist .hz-waitlist-form').screenshot({ path: path.join(dir, '08-waitlist-nothing-filled-in.png') });
      await form.getByLabel('Email', { exact: true }).fill('preview@example.com');
      await form.getByText('Both', { exact: true }).click();
      await form.getByText('$3 a month', { exact: true }).click();
      await form.getByRole('button', { name: 'Join the waitlist' }).click();
      await page.locator('.hz-form-ending').waitFor({ state: 'visible' });
      await page.waitForTimeout(400);
      await top(page, '#waitlist');
      await page.waitForTimeout(300);
      await shot(page, '08-waitlist-after-preview-send');
      await scrollTo(page, 9e6);
      await page.waitForTimeout(600);
      await shot(page, '09-footer');
    }
    await context.close();
  }

  // Reduced motion: every scene as its still frame.
  if (!size.openingOnly) {
    const { context, page } = await open(size, { reducedMotion: 'reduce' });
    await page.waitForTimeout(800);
    await page.locator('.hz-opening').screenshot({ path: path.join(dir, 'still-01-opening.png') });
    for (const [number, id] of [...SCENES, ...PLAIN]) {
      await page.locator(`#${id}`).screenshot({ path: path.join(dir, `still-${number}-${id}.png`) });
    }
    console.log(
      JSON.stringify({
        size: `${size.width}x${size.height}`,
        overflowX: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
        height: await page.evaluate(() => document.documentElement.scrollHeight),
      }),
    );
    await context.close();
  }
}

// One slow scroll from top to bottom, recorded with Playwright's own video
// recording. A recording is as large as its window in CSS pixels, so the
// page is shown in a frame of the size being recorded, and that frame is
// drawn at the screen's scale. The phone recording is then as sharp as a
// phone screen. On a small screen the scroll rests at each figure while its
// scene plays.
if (videoOut) {
  fs.mkdirSync(videoOut, { recursive: true });
  for (const [name, size, speed, rest] of [
    ['haze-desktop', SIZES[0], 172, 0],
    ['haze-phone', SIZES[1], 150, 4300],
  ]) {
    const full = { width: size.width * size.scale, height: size.height * size.scale };
    const context = await browser.newContext({ viewport: full, deviceScaleFactor: 1, recordVideo: { dir: videoOut, size: full } });
    await guard(context);
    const page = await context.newPage();
    page.on('pageerror', (error) => logs.push(`${name}: pageerror: ${error.message}`));
    const holder = `html{overflow:hidden}body{margin:0;background:#030506}iframe{display:block;border:0;width:${size.width}px;height:${size.height}px;transform:scale(${size.scale});transform-origin:0 0}`;
    await page.setContent(`<!doctype html><style>${holder}</style><iframe src="${url}"></iframe>`);
    const frame = await (await page.waitForSelector('iframe')).contentFrame();
    await frame.waitForSelector('.hz-page[data-hz-on]', { timeout: 15000 });
    // Stay on the opening while its loop comes into focus and goes soft.
    await page.waitForTimeout(rest ? 6500 : 7500);
    const stops = rest
      ? await frame.evaluate(() => {
          const bar = document.querySelector('.hz-bar').offsetHeight;
          return [...document.querySelectorAll('[data-hz-scene] .hz-figure')].map((figure) => Math.round(figure.getBoundingClientRect().top + window.scrollY - bar - (window.innerHeight - bar - figure.offsetHeight) / 2));
        })
      : [];
    await frame.evaluate(
      ({ pace, stopsAt, restFor }) =>
        new Promise((resolve) => {
          const end = document.documentElement.scrollHeight - window.innerHeight;
          let place = window.scrollY;
          let last = performance.now();
          let resting = 0;
          const step = (now) => {
            const passed = Math.min(50, now - last);
            last = now;
            if (resting > 0) {
              resting -= passed;
            } else {
              const next = place + (pace * passed) / 1000;
              const stop = stopsAt.find((at) => place < at && next >= at);
              place = stop ?? next;
              if (stop !== undefined) resting = restFor;
              window.scrollTo({ top: place, behavior: 'instant' });
            }
            if (place >= end) resolve();
            else requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }),
      { pace: speed, stopsAt: stops, restFor: rest },
    );
    await page.waitForTimeout(1500);
    const video = page.video();
    await context.close();
    const file = path.join(videoOut, `${name}.webm`);
    fs.rmSync(file, { force: true });
    fs.renameSync(await video.path(), file);
    console.log(`video: ${file}`);
  }
}

console.log(logs.length ? logs.slice(0, 30).join('\n') : 'no console errors or warnings');
await browser.close();
