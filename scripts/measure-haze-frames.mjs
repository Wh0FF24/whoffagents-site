// Measure how evenly the /haze page draws its frames with the processor
// slowed, as a stand-in for a mid-range phone.
//   node scripts/measure-haze-frames.mjs <url> [slowdown]
// Run it against a preview build on this machine. The slowdown is Chrome's
// own processor throttle (4 by default: four times slower).
//
// At 390x664 and 1440x900 it reports, for the opening at rest, for each
// scene while it plays, and for one steady scroll down the whole page: how
// many frames were drawn, the rate, how many took longer than two frames'
// time (33 ms) or three (50 ms), and the longest.
//
// It times the page's own frames. It says the page's work is light enough.
// It does not measure a real phone's graphics chip.
import { chromium } from '@playwright/test';
import process from 'node:process';

const [url = 'http://127.0.0.1:4470/haze', slowdown = '4'] = process.argv.slice(2);
const target = new URL(url);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname)) {
  console.error('Refusing to run: this measure only opens a local preview.');
  process.exit(2);
}
const rate = Number(slowdown);
const SCENES = ['pattern', 'crowd', 'tested', 'score'];

// Time every frame the page draws for a while, optionally scrolling steadily.
const frames = (page, { time = 0, pace = 0 }) =>
  page.evaluate(
    ({ lasts, speed }) =>
      new Promise((resolve) => {
        const gaps = [];
        const end = document.documentElement.scrollHeight - window.innerHeight;
        const began = performance.now();
        let last = began;
        let place = window.scrollY;
        const step = (now) => {
          gaps.push(now - last);
          if (speed) {
            place += (speed * Math.min(now - last, 100)) / 1000;
            window.scrollTo({ top: place, behavior: 'instant' });
          }
          last = now;
          if (speed ? place >= end : now - began >= lasts) resolve(gaps.slice(1));
          else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }),
    { lasts: time, speed: pace },
  );

const sum = (gaps) => {
  const total = gaps.reduce((all, gap) => all + gap, 0);
  return {
    frames: gaps.length,
    perSecond: Math.round((gaps.length / total) * 1000),
    over33: gaps.filter((gap) => gap > 33.4).length,
    over50: gaps.filter((gap) => gap > 50).length,
    longest: Math.round(Math.max(...gaps)),
  };
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [width, height] of [[390, 664], [1440, 900]]) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: width < 700 ? 2 : 1 });
  await context.route('**/*', (route) => (route.request().method() === 'GET' && route.request().url().startsWith(target.origin) ? route.continue() : route.abort()));
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.hz-page[data-hz-on]', { timeout: 15000 });
  // Time a fixed piece of work before and after the slowdown, to show the
  // slowdown is really in force.
  const work = () =>
    page.evaluate(() => {
      const began = performance.now();
      let total = 0;
      for (let index = 0; index < 3e7; index += 1) total += Math.sqrt(index);
      return performance.now() - began + total * 0;
    });
  const unslowed = await work();
  const session = await context.newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate });
  const slowed = await work();
  await page.waitForTimeout(1500);

  const report = { size: `${width}x${height}`, slowdown: rate, measuredSlowdown: Number((slowed / unslowed).toFixed(1)) };
  report.opening = sum(await frames(page, { time: 4000 }));
  const held = (await page.locator('#pattern').getAttribute('data-hz-to')) !== null;
  for (const id of SCENES) {
    if (held) {
      // Scroll steadily through the stretch the scene is held for.
      const range = await page.locator(`#${id}`).evaluate((section) => ({ from: Number(section.dataset.hzFrom), to: Number(section.dataset.hzTo) }));
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), range.from);
      await page.waitForTimeout(600);
      const gaps = await page.evaluate(
        ({ to, speed }) =>
          new Promise((resolve) => {
            const all = [];
            let last = performance.now();
            let place = window.scrollY;
            const step = (now) => {
              all.push(now - last);
              place += (speed * Math.min(now - last, 100)) / 1000;
              last = now;
              window.scrollTo({ top: place, behavior: 'instant' });
              if (place >= to) resolve(all.slice(1));
              else requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }),
        { to: range.to, speed: 420 },
      );
      report[id] = sum(gaps);
    } else {
      // Bring the figure into view and time the scene while it plays.
      await page.locator(`#${id} .hz-figure`).evaluate((figure) => window.scrollTo({ top: figure.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' }));
      report[id] = { ...sum(await frames(page, { time: 6200 })), played: (await page.locator(`#${id}`).getAttribute('data-hz-play')) === 'done' };
    }
  }
  // A fresh load for the scroll down the whole page, so every scene is
  // still waiting to play when the scroll reaches it.
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.hz-page[data-hz-on]', { timeout: 15000 });
  await page.waitForTimeout(1500);
  report.wholePage = sum(await frames(page, { pace: width < 700 ? 500 : 800 }));
  console.log(JSON.stringify(report));
  await context.close();
}
await browser.close();
