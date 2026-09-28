// Lightning-over-copy audit. Needs the dev server (npm run dev -- --port 5199):
// in development the scene publishes the on-screen geometry of every live
// lightning segment and every bright filament pulse. This script arrives at each
// chapter three ways (chapter rail, mouse wheel, instant jump), scrolls the whole
// page continuously, and rests on each chapter (at its top and 15% of a screen
// either side), sampling every rendered frame and
// testing strikes and bright pulses against the line boxes of all visible copy
// (re-measured every frame, since copy moves while scrolling).
// node scripts/audit-lightning.mjs [url]
import process from 'node:process';
import { chromium } from '@playwright/test';

const [url = 'http://127.0.0.1:5199/'] = process.argv.slice(2);
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, rail: true },
  { name: 'tall desktop', width: 1920, height: 1080, rail: true },
  { name: 'short desktop', width: 1280, height: 720, rail: true },
  { name: 'narrow desk', width: 1100, height: 900, rail: true },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'portrait tab', width: 768, height: 1024, hasTouch: true },
  { name: 'phone', width: 390, height: 664, isMobile: true, hasTouch: true },
  { name: 'phone landsc', width: 844, height: 390, isMobile: true, hasTouch: true },
];

function installSampler() {
  const hits = (x0, y0, x1, y1, box) => {
    let t0 = 0;
    let t1 = 1;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const p = [-dx, dx, -dy, dy];
    const q = [x0 - box.left, box.right - x0, y0 - box.top, box.bottom - y0];
    for (let i = 0; i < 4; i += 1) {
      if (p[i] === 0) { if (q[i] < 0) return false; continue; }
      const t = q[i] / p[i];
      if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
    }
    return true;
  };
  // Every visible line of copy counts. (In the stacked layout, phones and
  // portrait tablets, the core sinks behind the copy with its pulses dark.)
  const copyBoxes = () => {
    const boxes = [];
    const walker = document.createTreeWalker(document.querySelector('.ch'), NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent.trim();
      const parent = node.parentElement;
      if (!text || !parent || (parent.closest('.ch-layer') && !parent.closest('.ch-loop-labels'))) continue;
      if (!parent.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        const box = { label: text.slice(0, 30), left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
        if (box.right > box.left && box.bottom > box.top && box.bottom > 0 && box.top < window.innerHeight) boxes.push(box);
      }
    }
    return boxes;
  };
  window.__auditSample = async (ms) => {
    let last = window.__coreDebug?.frame ?? -1;
    let frames = 0;
    let strikeFrames = 0;
    let pulseFrames = 0;
    const offenders = {};
    const end = performance.now() + ms;
    while (performance.now() < end) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const debug = window.__coreDebug;
      if (!debug || debug.frame === last) continue;
      last = debug.frame;
      frames += 1;
      const boxes = copyBoxes();
      let strikeHit = false;
      let pulseHit = false;
      for (const box of boxes) {
        if (debug.strikes.some(([x0, y0, x1, y1]) => hits(x0, y0, x1, y1, box))) {
          strikeHit = true;
          offenders[box.label] = (offenders[box.label] || 0) + 1;
        }
        if (debug.pulses.some(([x, y]) => x > box.left - 6 && x < box.right + 6 && y > box.top - 6 && y < box.bottom + 6)) {
          pulseHit = true;
          offenders[`pulse: ${box.label}`] = (offenders[`pulse: ${box.label}`] || 0) + 1;
        }
      }
      strikeFrames += strikeHit ? 1 : 0;
      pulseFrames += pulseHit ? 1 : 0;
    }
    const worst = Object.entries(offenders).sort((a, b) => b[1] - a[1])[0];
    return { frames, strikeFrames, pulseFrames, worst: worst ? worst[0] : '' };
  };
}

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const rows = [];
try {
  // AUDIT_ONLY=tablet (a substring of a viewport name) runs just that one.
  for (const viewport of VIEWPORTS.filter((item) => !process.env.AUDIT_ONLY || item.name.includes(process.env.AUDIT_ONLY))) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.isMobile, hasTouch: viewport.hasTouch });
    await page.addInitScript(() => { window.__coreDebugOn = true; });
    await page.addInitScript(installSampler);
    page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) console.error(`[${viewport.name}] navigated: ${frame.url()}`); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('.ch-layer')?.dataset.scene === 'ready', null, { timeout: 20000 });
    const record = (scenario, chapter, result) => rows.push({ viewport: viewport.name, scenario, chapter, ...result });
    // A navigation (dev-server reload) destroys the page context: reload the
    // homepage, let it boot, and report the interrupted run as skipped.
    const guarded = async (work) => {
      try {
        return await work();
      } catch (error) {
        if (!/context was destroyed|navigation/i.test(String(error))) throw error;
        console.error(`[${viewport.name}] run interrupted by a navigation; reloading`);
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => document.querySelector('.ch-layer')?.dataset.scene === 'ready', null, { timeout: 20000 });
        await page.waitForTimeout(4500);
        return { frames: 0, strikeFrames: 0, pulseFrames: 0, worst: 'SKIPPED (navigation)' };
      }
    };
    // The boot sequence itself.
    record('boot', 'core', await guarded(() => page.evaluate(() => window.__auditSample(4500))));
    const holds = await page.evaluate(() => [...document.querySelectorAll('[data-chapter-section]')].map((section) => {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return { id: section.id, start: top, rest: top + Math.max(0, rect.height - window.innerHeight) / 2 };
    }));
    const jumpTo = (y) => page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);

    for (let index = 1; index < holds.length; index += 1) {
      const from = holds[index - 1];
      const to = holds[index];
      if (viewport.rail) {
        await jumpTo(from.rest);
        await page.waitForTimeout(2500);
        const sample = page.evaluate(() => window.__auditSample(4000));
        await page.locator('.ch-rail a').nth(index).click();
        record('rail click', to.id, await guarded(() => sample));
      }
      await jumpTo(from.rest);
      await page.waitForTimeout(2500);
      const wheelSample = page.evaluate(() => window.__auditSample(4500));
      await page.mouse.move(viewport.width / 2, viewport.height / 2);
      const notches = Math.max(1, Math.ceil((to.start - from.rest) / 120));
      for (let step = 0; step < notches; step += 1) {
        await page.mouse.wheel(0, 120);
        await page.waitForTimeout(70);
      }
      record('wheel', to.id, await guarded(() => wheelSample));
      // An instant jump from the previous chapter (keyboard End, anchors).
      await jumpTo(from.rest);
      await page.waitForTimeout(2500);
      const jumpSample = page.evaluate(() => window.__auditSample(3000));
      await jumpTo(to.rest);
      record('jump', to.id, await guarded(() => jumpSample));
    }
    // One continuous pass from the top to the footer.
    await jumpTo(0);
    await page.waitForTimeout(2500);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const continuous = page.evaluate((ms) => window.__auditSample(ms), Math.ceil(total / 90) * 95 + 1500);
    for (let y = 0; y < total; y += 90) {
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(60);
    }
    record('continuous scroll', 'all', await guarded(() => continuous));
    // Let smooth scrolling finish easing before jumping, or it pulls the page back.
    await page.waitForTimeout(3000);
    // At rest on every chapter.
    for (const hold of holds) {
      await jumpTo(hold.rest);
      await page.waitForTimeout(2500);
      record('at rest', hold.id, await guarded(() => page.evaluate(() => window.__auditSample(3000))));
    }
    // At rest part-way into and out of every chapter too: lightning may fire
    // wherever the page is still and the core has settled, not only at the top.
    for (const hold of holds) {
      for (const shift of [-0.15, 0.15]) {
        await jumpTo(Math.max(0, hold.rest + shift * viewport.height));
        await page.waitForTimeout(2500);
        record(`rest ${shift > 0 ? '+' : '-'}15% screen`, hold.id, await guarded(() => page.evaluate(() => window.__auditSample(3000))));
      }
    }
    await jumpTo(1e7);
    await page.waitForTimeout(1500);
    record('at rest', 'page end', await guarded(() => page.evaluate(() => window.__auditSample(2000))));
    await page.close();
  }
} finally {
  await browser.close();
}
let failed = 0;
for (const row of rows) {
  const bad = row.strikeFrames > 0 || row.pulseFrames > 0 || row.worst.startsWith('SKIPPED');
  failed += bad ? 1 : 0;
  // Zero frames means the scene was not drawing (e.g. the page end).
  console.log(`${bad ? '✗' : '✓'} ${row.viewport.padEnd(13)} ${row.scenario.padEnd(17)} ${row.chapter.padEnd(12)} ${row.frames ? `${String(row.frames).padStart(4)} frames` : 'not drawing'}  lightning over copy: ${row.strikeFrames}  bright pulse over copy: ${row.pulseFrames}${row.worst ? `  (${row.worst})` : ''}`);
}
console.log(`\n${rows.length} runs, ${rows.reduce((sum, row) => sum + row.frames, 0)} frames, ${failed} with lightning or a bright pulse over copy.`);
process.exitCode = failed ? 1 : 0;
