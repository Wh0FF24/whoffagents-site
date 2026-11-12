import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { routeMeta } from '../src/data/routeMeta.js';

// The Eidolon page: an unlisted page of scroll-driven scenes with the site's
// inquiry form at the end. These checks run against the preview build, where
// the form sends nothing.
const ROUTE = '/eidolon';
const CAPTION = 'Illustrative model, not measured traffic or performance.';
const SCENES = ['signal', 'crowd', 'lanes', 'keeping-up', 'full-day'];

// The wording that was reviewed, one line per block of text. A change to any
// sentence on the page fails here until this file is changed on purpose:
//   EIDOLON_COPY_UPDATE=1 npx playwright test tests/eidolon.spec.js -g wording
const REVIEWED_COPY = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'eidolon-copy.txt');
// Optionally, a list of wording to keep off the page: a file of patterns, one
// per line, kept outside this repository.
const WORDLIST = process.env.EIDOLON_WORDLIST;
// Marks the page never uses: long dashes, and the signs that go with figures.
const MARKS = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}%$]`);
// Counts written out as words. The page gives no figure but 24.
const COUNTS = /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|dozens?|hundreds?|thousands?|millions?|twice|double|half|halves|thirds?|quarters?)\b/i;

test.beforeEach(async ({ context }) => {
  // Fail any write closed, even if a preview guard regresses.
  await context.route('**/*', (route) => (route.request().method() === 'POST' ? route.abort('blockedbyclient') : route.continue()));
});

// The page's own wording in the order it appears: headings, paragraphs, list
// items, the labels drawn inside the figures (shown or not at this moment),
// and the descriptions given to assistive technology. The request form is the
// site's shared one and is read separately.
const readCopy = (page) => page.evaluate(() => {
  const main = document.querySelector('#main-content');
  const blocks = 'h1, h2, h3, p, li, dt, dd, figcaption, text, a, label, legend, button';
  const lines = [];
  let last = null;
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    const parent = node.parentElement;
    if (!text || parent.closest('noscript, script, style, form')) continue;
    const block = parent.closest(blocks) || parent;
    if (block === last) lines[lines.length - 1] += ` ${text}`;
    else lines.push(text);
    last = block;
  }
  for (const node of main.querySelectorAll('[aria-label]')) {
    if (!node.closest('form')) lines.push(`(described as) ${node.getAttribute('aria-label')}`);
  }
  return lines;
});

// Everything the request form can show in this build, with its field hints.
const readForm = (page) => page.locator('#request form.iq-form').evaluate((form) => [
  form.innerText,
  ...[...form.querySelectorAll('[placeholder], [aria-label]')].flatMap((node) => [node.getAttribute('placeholder') || '', node.getAttribute('aria-label') || '']),
].join('\n'));

const scrollTo = (page, top) => page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);

// Scroll a scene to a point of its play-through (0 start, 1 finished).
async function play(page, id, progress) {
  const section = page.locator(`#${id}`);
  await expect(section).toHaveAttribute('data-eid-to', /\d+/, { timeout: 15000 });
  const range = await section.evaluate((element) => ({ from: Number(element.dataset.eidFrom), to: Number(element.dataset.eidTo) }));
  await scrollTo(page, range.from + (range.to - range.from) * progress + (progress >= 1 ? 4 : 0));
}

for (const [width, height] of [[320, 568], [390, 664], [768, 1024], [1440, 900]]) {
  test(`the page fits ${width}px, reads as one document and meets WCAG A/AA checks`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(ROUTE);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveTitle(routeMeta[ROUTE].title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Eidolon');
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const clipped = await page.locator('h1, h2, h3').evaluateAll((headings) => headings.filter((heading) => {
      const range = document.createRange();
      range.selectNodeContents(heading);
      return [...range.getClientRects()].some((rect) => rect.right > window.innerWidth + 1 || rect.left < -1);
    }).map((heading) => heading.textContent));
    expect(clipped, 'clipped headings').toEqual([]);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
  });
}

test('it renders every scene, the status board and the form, with no console errors', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await expect(page.getByRole('heading', { level: 1, name: 'Eidolon' })).toBeVisible();
  await expect(page.locator('.eid-hero-status')).toHaveText('In development');
  await expect(page.getByRole('link', { name: 'Request a pilot conversation' })).toHaveAttribute('href', '#request');
  await expect(page.getByRole('link', { name: 'See what it does' })).toHaveAttribute('href', '#signal');
  for (const id of SCENES) {
    await play(page, id, 1);
    await expect(page.locator(`#${id} h2`)).toBeVisible();
    await expect(page.locator(`#${id} .eid-figure`)).toHaveAttribute('data-live', 'true');
    await expect(page.locator(`#${id} figcaption`)).toHaveText(CAPTION);
    await expect(page.locator(`#${id} .eid-stage`)).toHaveAttribute('aria-label', /^Illustration\./);
    await page.waitForTimeout(900);
  }
  await expect(page.locator('.eid-hero-caption')).toHaveText(CAPTION);
  await expect(page.locator('#lanes .eid-proof')).toHaveText('Shown in the lab');
  await page.locator('#status').scrollIntoViewIfNeeded();
  await expect(page.locator('#status .eid-board-row')).toHaveCount(6);
  await expect(page.locator('#status')).toContainText('Protection effectiveness has not been established');
  await page.locator('#request').scrollIntoViewIfNeeded();
  await expect(page.locator('#request form.iq-form')).toBeVisible();
  await expect(page.locator('#request')).toContainText('Organizations only.');
  await expect(page.locator('#request')).toContainText('United States only for now.');
  await expect(page.locator('#request')).toContainText('Requests are reviewed before any reply.');
  await expect(page.locator('#request')).toContainText('nothing here is a performance guarantee');
  await page.waitForTimeout(1200);
  expect(errors, 'console and page errors').toEqual([]);
});

test('the wording is the reviewed wording: nothing added, no number but 24', async ({ page }) => {
  // With reduced motion every line is on the page at once, as plain text.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE);
  await expect(page.locator('#status')).toContainText('Protection effectiveness has not been established');
  const copy = await readCopy(page);
  if (process.env.EIDOLON_COPY_UPDATE) {
    fs.mkdirSync(path.dirname(REVIEWED_COPY), { recursive: true });
    fs.writeFileSync(REVIEWED_COPY, `${copy.join('\n')}\n`);
  }
  const reviewed = fs.readFileSync(REVIEWED_COPY, 'utf8').split(/\r?\n/).filter(Boolean);
  expect(copy, 'the page says something the reviewed wording does not, or the other way round').toEqual(reviewed);

  // The shared form: both reply methods and a finished preview submission, so
  // every string it can show in this build has been read.
  const form = page.locator('#request form.iq-form');
  const forms = [await readForm(page)];
  await form.getByRole('button', { name: 'Phone', exact: true }).click();
  forms.push(await readForm(page));
  await form.getByRole('button', { name: 'Email', exact: true }).click();
  await form.getByLabel('Name', { exact: true }).fill('Preview tester');
  await form.getByLabel('Organization', { exact: true }).fill('Example organization');
  await form.getByLabel('Email', { exact: true }).fill('test@example.com');
  await form.locator('textarea').fill('Local preview check only.');
  await form.getByRole('button', { name: 'Send request' }).click();
  await expect(form.getByRole('status')).toHaveText('Preview complete. Nothing was sent.');
  forms.push(await readForm(page));

  // What was typed into the fields is not page copy, and is not read here.
  const text = [...copy, ...forms, await page.title(), routeMeta[ROUTE].description].join('\n');
  expect(text).toContain('decoy');
  expect(text).toContain('operator console');
  expect(text).toContain('In development');
  expect(text.match(MARKS)?.[0] ?? null, 'a mark the page does not use').toBeNull();
  expect([...new Set(text.match(/\d+/g) || [])], 'numbers on the page').toEqual(['24']);
  expect(text.match(COUNTS)?.[0] ?? null, 'a count written out as a word').toBeNull();
  if (WORDLIST) {
    const patterns = fs.readFileSync(WORDLIST, 'utf8').split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
    expect(patterns.length, 'patterns in the list').toBeGreaterThan(0);
    for (const pattern of patterns) expect(text.match(new RegExp(pattern, 'i'))?.[0] ?? null, 'wording from the list').toBeNull();
  }
});

// The list is private, so a run without it cannot check it. This shows as
// skipped in that case, so such a run is never mistaken for a full pass.
test('the private word list was supplied for this run', () => {
  test.skip(!WORDLIST, 'EIDOLON_WORDLIST is not set: the private word list was not checked');
  expect(fs.existsSync(WORDLIST), 'the word list file').toBe(true);
});

test('the request form offers the two request types, requires an organization, and sends nothing in preview', async ({ page }) => {
  const posts = [];
  page.on('request', (request) => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto(`${ROUTE}#request`);
  const form = page.locator('#request form.iq-form');
  await expect(form.locator('.iq-preview-note')).toContainText('Submitting sends nothing');
  await expect(form.getByRole('radio')).toHaveCount(2);
  await expect(form.getByRole('radio', { name: 'A pilot conversation', exact: true })).toBeChecked();
  await expect(form.getByRole('radio', { name: 'A pilot conversation', exact: true })).toHaveValue('Eidolon pilot');
  await expect(form.getByRole('radio', { name: 'Progress updates', exact: true })).toHaveValue('Eidolon updates');
  await expect(form.getByLabel('Organization', { exact: true })).toHaveAttribute('required', '');
  await expect(form).toContainText('reply STOP to opt out of texts');
  // Without an organization the browser holds the form back.
  await form.getByLabel('Name', { exact: true }).fill('Preview tester');
  await form.getByLabel('Email', { exact: true }).fill('test@example.com');
  await form.locator('textarea').fill('Local preview check only.');
  await form.getByRole('button', { name: 'Send request' }).click();
  await expect(form.getByRole('status')).toBeEmpty();
  await form.getByText('Progress updates', { exact: true }).click();
  await expect(form.getByRole('radio', { name: 'Progress updates', exact: true })).toBeChecked();
  await form.getByLabel('Organization', { exact: true }).fill('Example organization');
  await form.getByRole('button', { name: 'Send request' }).click();
  await expect(form.getByRole('status')).toHaveText('Preview complete. Nothing was sent.');
  expect(posts).toEqual([]);
});

test('the page is unlisted: marked noindex, absent from the sitemap, and linked from no other page', async ({ page, request }) => {
  expect(routeMeta[ROUTE].sitemap).toBe(false);
  expect(routeMeta[ROUTE].robots).toContain('noindex');
  const html = await (await request.get(ROUTE)).text();
  expect(html).toMatch(/<meta name="robots" content="noindex[^"]*"/);
  expect(html.match(/<meta name="robots"/g)).toHaveLength(1);
  expect(html).toContain(`<link rel="canonical" href="https://whoffagents.com${ROUTE}"`);
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('eidolon');
  expect(await (await request.get('/robots.txt')).text()).not.toContain('eidolon');
  // No page links here: not the navigation, not the footer, not any body copy.
  for (const route of Object.keys(routeMeta)) {
    await page.goto(route);
    const links = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter((href) => /^\/?eidolon(\/|#|\?|$)/i.test(href.replace(/^https?:\/\/[^/]+/, ''))));
    expect(links, `links to the page from ${route}`).toEqual([]);
  }
});

test('it serves useful HTML without JavaScript, at normal height', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '4174'}${ROUTE}`);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', routeMeta[ROUTE].title);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', routeMeta[ROUTE].description);
  await expect(page.locator('.eid-fig')).toHaveCount(5);
  await expect(page.locator('#request form.iq-form')).toBeVisible();
  // No scene is stretched for a scroll that no script will play.
  const tallest = await page.locator('.eid-scene').evaluateAll((scenes) => Math.max(...scenes.map((scene) => scene.offsetHeight)));
  expect(tallest).toBeLessThan(1200);
  await context.close();
});

test('a trailing slash opens the page itself', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${ROUTE}/`);
  await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  await expect(page).toHaveTitle(routeMeta[ROUTE].title);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://whoffagents.com${ROUTE}`);
  expect(errors).toEqual([]);
});

test('with reduced motion each scene is a finished still frame with its caption', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE);
  await page.waitForTimeout(1200);
  // Nothing moves, nothing waits dimmed, and no scene is stretched.
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await expect(page.locator('[data-beat][data-on="false"]')).toHaveCount(0);
  await expect(page.locator('.eid-fig--day')).toHaveAttribute('data-step', '5');
  await expect(page.locator('.eid-fig--keep')).toHaveAttribute('data-seg', '4');
  await expect(page.locator('.eid-scene[data-eid-to]')).toHaveCount(0);
  for (const id of SCENES) {
    const scene = page.locator(`#${id}`);
    expect(await scene.evaluate((element) => element.offsetHeight), `${id} height`).toBeLessThan(1000);
    await expect(scene.locator('figcaption')).toHaveText(CAPTION);
    await scene.locator('.eid-figure').scrollIntoViewIfNeeded();
    await expect(scene.locator('.eid-fig')).toBeVisible();
  }
  // The finished frames: the reticle locked on the phone, the crowd in place,
  // every lane open, the day run.
  expect(await page.locator('.sig-lock').evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  expect(await page.locator('.crowd-node').evaluateAll((nodes) => nodes.every((node) => Number(getComputedStyle(node).opacity) > 0.5))).toBe(true);
  expect(await page.locator('.lanes-whole').evaluate((element) => getComputedStyle(element).opacity)).toBe('0');
  await expect(page.locator('.day-sweep')).toHaveAttribute('stroke-dashoffset', '0');
});

test('scrolling plays each scene from its opening state to its finished frame, and back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  const day = page.locator('.eid-fig--day');
  await play(page, 'full-day', 0);
  await expect(day).toHaveAttribute('data-step', '0');
  await expect(page.locator('#full-day [data-beat][data-on="true"]')).toHaveCount(0);
  await play(page, 'full-day', 0.5);
  await expect(day).toHaveAttribute('data-step', '3');
  await play(page, 'full-day', 1);
  await expect(day).toHaveAttribute('data-step', '5');
  await expect(page.locator('#full-day [data-beat][data-on="false"]')).toHaveCount(0);
  await play(page, 'full-day', 0);
  await expect(day).toHaveAttribute('data-step', '0');

  // The device crosses the figure with the scroll, and marks appear behind it.
  await play(page, 'keeping-up', 0);
  await expect(page.locator('.eid-fig--keep')).toHaveAttribute('data-seg', '0');
  await expect(page.locator('.keep-replan.is-ahead')).toHaveCount(16);
  await play(page, 'keeping-up', 1);
  await expect(page.locator('.eid-fig--keep')).toHaveAttribute('data-seg', '4');
  await expect(page.locator('.keep-replan.is-ahead')).toHaveCount(0);

  // The reticle closes on the phone it locks, centred on it.
  await play(page, 'signal', 1);
  await expect.poll(() => page.locator('.sig-lock').evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  await page.waitForTimeout(900);
  const offset = await page.evaluate(() => {
    const centre = (selector) => {
      const rect = document.querySelector(selector).getBoundingClientRect();
      return [rect.left + rect.width / 2, rect.top + rect.height / 2];
    };
    const [rx, ry] = centre('.sig-reticle .eid-reticle-corners');
    const [px, py] = centre('.sig-target .eid-phone-body');
    return Math.hypot(rx - px, ry - py);
  });
  expect(offset, 'distance between the reticle and the phone, in pixels').toBeLessThan(1.5);

  // In the crowd the reticle keeps moving between decoys.
  await play(page, 'crowd', 1);
  await page.waitForTimeout(900);
  const place = () => page.locator('.crowd-reticle').getAttribute('transform');
  const places = new Set();
  for (let sample = 0; sample < 8; sample += 1) {
    places.add(await place());
    await page.waitForTimeout(350);
  }
  expect(places.size, 'reticle positions seen').toBeGreaterThan(3);
});

test('scenes run only while they are on screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await expect(page.locator('#signal')).toHaveAttribute('data-eid-to', /\d+/, { timeout: 15000 });
  const running = (selector) => page.evaluate((target) => document.querySelector(target).getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length, selector);

  // At the top only the opening instrument moves.
  await page.waitForTimeout(800);
  await expect(page.locator('.eid-hero')).toHaveAttribute('data-live', 'true');
  expect(await running('.eid-hero')).toBeGreaterThan(0);
  for (const id of SCENES) {
    await expect(page.locator(`#${id} .eid-figure`)).toHaveAttribute('data-live', 'false');
    expect(await running(`#${id}`), `${id} while off screen`).toBe(0);
  }

  // In a scene, that scene moves and the opening instrument rests.
  await play(page, 'crowd', 1);
  await expect(page.locator('#crowd .eid-figure')).toHaveAttribute('data-live', 'true');
  await expect(page.locator('.eid-hero')).toHaveAttribute('data-live', 'false');
  await page.waitForTimeout(900);
  expect(await running('#crowd')).toBeGreaterThan(0);
  expect(await running('.eid-hero'), 'opening instrument while off screen').toBe(0);
  expect(await running('#full-day'), 'a later scene while off screen').toBe(0);

  // Past it, its loops stop: the reticle stays where it was left.
  await page.locator('#request').scrollIntoViewIfNeeded();
  await expect(page.locator('#crowd .eid-figure')).toHaveAttribute('data-live', 'false');
  expect(await running('#crowd')).toBe(0);
  const before = await page.locator('.crowd-reticle').getAttribute('transform');
  await page.waitForTimeout(1500);
  expect(await page.locator('.crowd-reticle').getAttribute('transform')).toBe(before);
});

test('held scenes fit the window on laptop screens', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [1366, 650], [1280, 600], [1024, 768]]) {
    await page.setViewportSize({ width, height });
    await page.goto(ROUTE);
    for (const id of SCENES) {
      await play(page, id, 1);
      await page.waitForTimeout(250);
      const box = await page.locator(`#${id} .eid-scene-grid`).evaluate((grid) => {
        const rects = [...grid.children].map((child) => child.getBoundingClientRect());
        return { top: Math.min(...rects.map((rect) => rect.top)), bottom: Math.max(...rects.map((rect) => rect.bottom)) };
      });
      expect(box.top, `${id} top at ${width}x${height}`).toBeGreaterThanOrEqual(0);
      expect(box.bottom, `${id} bottom at ${width}x${height}`).toBeLessThanOrEqual(height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}x${height}`).toBe(true);
  }
});

test('the opening fits a phone screen with its toolbars showing', async ({ page }) => {
  for (const [width, height] of [[375, 548], [390, 664], [360, 640]]) {
    await page.setViewportSize({ width, height });
    await page.goto(ROUTE);
    await page.waitForTimeout(1600);
    for (const name of ['Request a pilot conversation', 'See what it does']) {
      const box = await page.getByRole('link', { name }).boundingBox();
      expect(box.y + box.height, `${name} at ${width}x${height}`).toBeLessThanOrEqual(height);
      expect(box.x + box.width, `${name} at ${width}x${height}`).toBeLessThanOrEqual(width);
    }
    await expect(page.locator('.eid-hero-status')).toBeVisible();
  }
});

test('the page settles without layout shift', async ({ page }) => {
  await page.addInitScript(() => {
    window.__shift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__shift += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  for (const [width, height] of [[1440, 900], [390, 664], [375, 548]]) {
    await page.setViewportSize({ width, height });
    await page.goto(ROUTE);
    await expect(page.locator('#signal')).toHaveAttribute('data-eid-to', /\d+/, { timeout: 15000 });
    await page.waitForTimeout(3000);
    expect(await page.evaluate(() => window.__shift), `layout shift at ${width}x${height}`).toBeLessThan(0.01);
  }
});

test('where newer browser features are missing the page still renders, as still frames', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.addInitScript(() => {
    delete window.ResizeObserver;
    delete window.IntersectionObserver;
    delete Element.prototype.checkVisibility;
    delete window.requestIdleCallback;
  });
  for (const [width, height] of [[390, 664], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto(ROUTE);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.locator('#full-day .eid-figure').scrollIntoViewIfNeeded();
    await expect(page.locator('.eid-fig--day')).toHaveAttribute('data-step', '5');
    await page.locator('#request').scrollIntoViewIfNeeded();
    await expect(page.locator('#request form.iq-form')).toBeVisible();
  }
  expect(errors, 'page errors').toEqual([]);
});

test('if the motion cannot load, the page drops the tall layout and stays readable', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route(/eidolonMotion-[^/]*\.js$/, (route) => route.abort());
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await expect(page.locator('.eid-page')).toHaveAttribute('data-eid-static', '', { timeout: 15000 });
  const tallest = await page.locator('.eid-scene').evaluateAll((scenes) => Math.max(...scenes.map((scene) => scene.offsetHeight)));
  expect(tallest).toBeLessThan(1200);
  await expect(page.locator('[data-beat][data-on="false"]')).toHaveCount(0);
  await expect(page.locator('.eid-fig--day')).toHaveAttribute('data-step', '5');
  expect(errors, 'page errors').toEqual([]);
});

test('the opening links land on their sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE);
  await page.getByRole('link', { name: 'See what it does' }).click();
  await expect(page).toHaveURL(/#signal$/);
  await expect(page.locator('#signal h2')).toBeInViewport();
  await page.goto(ROUTE);
  await page.getByRole('link', { name: 'Request a pilot conversation' }).click();
  await expect(page).toHaveURL(/#request$/);
  await expect(page.locator('#request h2')).toBeInViewport();
});
