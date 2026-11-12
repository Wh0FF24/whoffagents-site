import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { routeMeta } from '../src/data/routeMeta.js';
import { buildSite, serveSite } from '../scripts/haze-local.mjs';
import { CARD, WORDS, headlineText } from '../scripts/haze-card-words.mjs';

// The Haze page: a waitlist page that stands on its own, with scroll-driven
// scenes and a form of its own. Most checks run against the suite's preview
// build, where the form sends nothing. The form's live behavior is checked
// against two small live builds made here and served from this machine only.
const ROUTE = '/haze';
const CAPTION = 'Illustrative model. Not measured performance.';
const SCENES = ['pattern', 'crowd', 'tested', 'score'];
const PORT = process.env.PLAYWRIGHT_PORT || '4174';
const LIVE_PORTS = { closed: Number(process.env.HAZE_LIVE_PORT || 4475), open: Number(process.env.HAZE_LIVE_PORT || 4475) + 1 };
const ENDPOINT = '/api/haze-waitlist';
// Made up. It only has to be present for the site to try to start analytics.
const MADE_UP_KEY = 'phc_local_check_not_a_real_key';

// The wording that was reviewed, one line per block of text. A line that
// only shows in one situation starts with a note in brackets saying when.
// Any change to what the page says fails here until this file is changed on
// purpose:
//   HAZE_COPY_UPDATE=1 npx playwright test tests/haze.spec.js -g wording
const REVIEWED_COPY = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'haze-copy.txt');
// Optionally, a list of wording to keep off the page: a file of patterns, one
// per line, kept outside this repository.
const WORDLIST = process.env.HAZE_WORDLIST;
const NOTES = {
  title: '(page title)',
  description: '(description for search and link previews)',
  described: '(described to screen readers)',
  email: '(shown when the email is missing or not valid)',
  choice: '(shown when a choice is missing)',
  preview: '(shown after a send in a preview build)',
  sent: '(shown after a send)',
  failed: '(shown when a send does not go through)',
  full: '(shown in place of the form when the list is full)',
  closed: '(shown in place of the form while the waitlist is closed)',
  noscript: '(shown when scripts are off)',
};
const reviewed = () => fs.readFileSync(REVIEWED_COPY, 'utf8').split(/\r?\n/).filter(Boolean);
// The one reviewed line that carries a given note.
const line = (note) => {
  const found = reviewed().filter((entry) => entry.startsWith(`${note} `));
  expect(found, `reviewed lines marked ${note}`).toHaveLength(1);
  return found[0].slice(note.length + 1);
};

// The prices are the only figures the page gives.
const PRICES = ['$3 a month', '$5 a month', '$8 a month'];
// Places where the reviewed wording uses a number word in passing. Nothing
// else on the page may count anything, in digits or in words.
const PLAIN_USES = [
  'tell us two things',
  'you hear first',
  'One email when there is news',
  'Pick one answer for each question',
  'Each one has its own interests',
  'says less about the real one',
  'A one-time price, not monthly',
  'Both',
];
const COUNTS = /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|dozens?|hundreds?|thousands?|millions?|billions?|once|twice|thrice|double|triple|half|halves|thirds?|quarters?|first|second|both|couple|percent)\b/i;
const LONG_DASH = new RegExp(`[${String.fromCharCode(0x2012, 0x2013, 0x2014, 0x2015)}]`);

let live = null;

test.beforeAll(async () => {
  // Two live builds (no preview flag): one with no waitlist address, one
  // with it and with a made-up analytics key. Only the browser bundle is
  // built, into a cache folder, so the suite's own build is left alone.
  const made = {};
  for (const [name, settings] of [
    ['closed', {}],
    ['open', { VITE_HAZE_WAITLIST_ENDPOINT: ENDPOINT, VITE_POSTHOG_KEY: MADE_UP_KEY }],
  ]) {
    const dir = buildSite({ settings, outDir: `node_modules/.cache/haze-builds/${name}` });
    const state = { fail: false };
    const site = await serveSite({
      dir,
      port: LIVE_PORTS[name],
      answer: (pathname) => (pathname === ENDPOINT && !state.fail ? { status: 200, body: '{"ok":true}' } : { status: state.fail ? 500 : 404 }),
    });
    made[name] = { ...site, state };
  }
  live = made;
});

test.afterAll(async () => {
  await live?.closed.close();
  await live?.open.close();
});

test.beforeEach(async ({ context }) => {
  // On the suite's own build, fail any write closed, even if a guard regresses.
  await context.route('**/*', (route) => {
    const request = route.request();
    const toSuite = request.url().startsWith(`http://127.0.0.1:${PORT}/`);
    return request.method() === 'POST' && toSuite ? route.abort('blockedbyclient') : route.continue();
  });
});

// Everything the page says, in the order it appears: each block of text
// once, with the words inside it kept together, then the descriptions given
// to assistive technology.
const readCopy = (page) =>
  page.evaluate((described) => {
    const main = document.querySelector('#main-content');
    const blocks = 'h1, h2, h3, p, li, figcaption, text, label, legend, button, a.hz-button, a.hz-textlink';
    const lines = [];
    let last = null;
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (parent.closest('script, style')) continue;
      // With scripts on, a noscript block is one run of markup, not text.
      if (parent.closest('noscript') && !parent.closest('noscript p')) continue;
      const block = parent.closest(blocks) || parent;
      if (block === last) {
        lines[lines.length - 1] += node.textContent;
      } else if (node.textContent.trim()) {
        lines.push(node.textContent);
        last = block;
      }
    }
    const tidy = lines.map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean);
    for (const node of main.querySelectorAll('[aria-label]')) tidy.push(`${described} ${node.getAttribute('aria-label')}`);
    return tidy;
  }, NOTES.described);

const scrollTo = (page, top) => page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
const started = (page) => expect(page.locator('.hz-page')).toHaveAttribute('data-hz-on', '', { timeout: 15000 });

// Scroll a held scene to a point of its play-through (0 start, 1 finished).
async function play(page, id, progress) {
  const section = page.locator(`#${id}`);
  await expect(section).toHaveAttribute('data-hz-to', /\d+/, { timeout: 15000 });
  const range = await section.evaluate((element) => ({ from: Number(element.dataset.hzFrom), to: Number(element.dataset.hzTo) }));
  await scrollTo(page, range.from + (range.to - range.from) * progress + (progress >= 1 ? 6 : 0));
}

// How many times anything inside a part of the page changes over a stretch of time.
const changes = (page, selector, time = 1200) =>
  page.evaluate(
    ({ target, wait }) =>
      new Promise((resolve) => {
        let count = 0;
        const observer = new MutationObserver((records) => {
          count += records.length;
        });
        observer.observe(document.querySelector(target), { attributes: true, childList: true, characterData: true, subtree: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(count);
        }, wait);
      }),
    { target: selector, wait: time },
  );
const running = (page, selector) =>
  page.evaluate((target) => document.querySelector(target).getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length, selector);

async function fill(form, email = 'test@example.com') {
  await form.getByLabel('Email', { exact: true }).fill(email);
  await form.getByText('Browser extension', { exact: true }).click();
  await form.getByText('$5 a month', { exact: true }).click();
}

/* ------------------------------------------------------- the page as built */

for (const [width, height] of [[320, 568], [390, 664], [768, 1024], [1440, 900]]) {
  test(`the page fits ${width}px, reads as one document and meets WCAG A/AA checks`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(ROUTE);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveTitle(routeMeta[ROUTE].title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Blur the profile they build on you.');
    await expect(page.locator('h1')).toHaveCount(1);
    // Real headings, in order: one first-level heading, then one for each section.
    expect(await page.locator('#main-content').locator('h1, h2, h3, h4').evaluateAll((headings) => headings.map((heading) => heading.tagName))).toEqual(['H1', ...Array(7).fill('H2')]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const clipped = await page.locator('h1, h2').evaluateAll((headings) =>
      headings
        .filter((heading) => {
          const range = document.createRange();
          range.selectNodeContents(heading);
          return [...range.getClientRects()].some((rect) => rect.right > window.innerWidth + 1 || rect.left < -1);
        })
        .map((heading) => heading.textContent),
    );
    expect(clipped, 'clipped headings').toEqual([]);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
    // The same checks with the form's messages showing.
    await page.locator('#waitlist form').getByRole('button', { name: 'Join the waitlist' }).click();
    await expect(page.locator('.hz-form-problems p')).toHaveCount(2);
    const again = await new AxeBuilder({ page }).include('#waitlist').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(again.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
  });
}

test('it renders every scene and section, each figure with its caption and description, with no console errors', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await started(page);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.hz-opening .hz-button')).toHaveAttribute('href', '#waitlist');
  await expect(page.getByRole('link', { name: 'See how it works' })).toHaveAttribute('href', '#pattern');
  // Five figures, the opening included, each with the caption and a description.
  await expect(page.locator('figure.hz-figure')).toHaveCount(5);
  await expect(page.locator('figure.hz-figure figcaption')).toHaveText(Array(5).fill(CAPTION));
  for (const stage of await page.locator('figure.hz-figure .hz-stage').all()) {
    await expect(stage).toHaveAttribute('role', 'img');
    await expect(stage).toHaveAttribute('aria-label', /^Illustration/);
  }
  for (const id of SCENES) {
    await play(page, id, 1);
    await expect(page.locator(`#${id} h2`)).toBeVisible();
    await expect(page.locator(`#${id} .hz-figure`)).toHaveAttribute('data-live', 'true');
    await expect(page.locator(`#${id} figcaption`)).toBeVisible();
    await page.waitForTimeout(700);
  }
  for (const id of ['rules', 'limits']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id} li`)).toHaveCount(4);
  }
  await page.locator('#waitlist').scrollIntoViewIfNeeded();
  await expect(page.locator('#waitlist form')).toBeVisible();
  await page.waitForTimeout(1200);
  expect(errors, 'console and page errors').toEqual([]);
});

test('the wording is the reviewed wording: nothing added, no figures but the prices, no long dashes', async ({ page, browser }) => {
  // With reduced motion every line is on the page at once, as plain text.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE);
  await expect(page.locator('#waitlist form')).toBeVisible();
  const said = [`${NOTES.title} ${await page.title()}`, `${NOTES.description} ${await page.locator('meta[name="description"]').getAttribute('content')}`, ...(await readCopy(page))];

  // What the form says when it is sent with nothing filled in, and after a send.
  const form = page.locator('#waitlist form');
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  const problems = await page.locator('.hz-form-problems p').allTextContents();
  expect(problems).toHaveLength(2);
  said.push(`${NOTES.email} ${problems[0]}`, `${NOTES.choice} ${problems[1]}`);
  await fill(form);
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  said.push(`${NOTES.preview} ${await page.locator('.hz-form-ending').textContent()}`);

  // What a live build says: after a send, when a send fails, and while closed.
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const other = await context.newPage();
  await other.goto(`${live.open.origin}${ROUTE}`);
  await fill(other.locator('#waitlist form'));
  live.open.state.fail = true;
  await other.locator('#waitlist form').getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(other.locator('.hz-form-problems p')).toHaveCount(1);
  const failed = await other.locator('.hz-form-problems p').textContent();
  live.open.state.fail = false;
  await other.locator('#waitlist form').getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(other.locator('.hz-form-ending')).toBeVisible();
  said.push(`${NOTES.sent} ${await other.locator('.hz-form-ending').textContent()}`, `${NOTES.failed} ${failed}`);
  // And when the far end answers that the list is full.
  await other.reload();
  await fill(other.locator('#waitlist form'));
  await other.route(`**${ENDPOINT}`, (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false,"full":true}' }));
  await other.locator('#waitlist form').getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(other.locator('.hz-form-ending')).toBeVisible();
  said.push(`${NOTES.full} ${await other.locator('.hz-form-ending').textContent()}`);
  await other.unroute(`**${ENDPOINT}`);
  await other.goto(`${live.closed.origin}${ROUTE}`);
  said.push(`${NOTES.closed} ${await other.locator('.hz-form-closed').textContent()}`);
  await context.close();

  // What the page adds when scripts are off.
  const plain = await browser.newContext({ javaScriptEnabled: false });
  const still = await plain.newPage();
  await still.goto(`http://127.0.0.1:${PORT}${ROUTE}`);
  const without = await readCopy(still);
  const extra = without.filter((entry) => !said.includes(entry));
  said.push(...extra.map((entry) => `${NOTES.noscript} ${entry}`));
  await plain.close();

  if (process.env.HAZE_COPY_UPDATE) {
    fs.mkdirSync(path.dirname(REVIEWED_COPY), { recursive: true });
    fs.writeFileSync(REVIEWED_COPY, `${said.join('\n')}\n`);
  }
  expect(said, 'the page says something the reviewed wording does not, or the other way round').toEqual(reviewed());

  // The title and description are the ones the route is listed with.
  expect(said[0]).toBe(`${NOTES.title} ${routeMeta[ROUTE].title}`);
  expect(said[1]).toBe(`${NOTES.description} ${routeMeta[ROUTE].description}`);

  // The same wording as one text, without the notes in brackets, and the
  // page's own markup and styles beside it.
  const text = said.map((entry) => entry.replace(/^\([^)]*\) /, '')).join('\n');
  const markup = await page.locator('.hz-page').evaluate((element) => element.outerHTML);
  expect(text).toContain('decoy');
  expect(text).toContain(CAPTION);
  expect(text.match(LONG_DASH)?.[0] ?? null, 'a long dash').toBeNull();
  // No figure but the three prices, and no count written out as a word
  // beyond the plain uses in the reviewed wording.
  const priced = PRICES.reduce((rest, price) => {
    expect(rest, `the price ${price}`).toContain(price);
    return rest.split(price).join('');
  }, text);
  expect([...new Set(priced.match(/[0-9]+|[$%]/g) || [])], 'figures and signs beyond the prices').toEqual([]);
  const counted = PLAIN_USES.reduce((rest, use) => {
    expect(rest, `the reviewed wording "${use}"`).toContain(use);
    return rest.split(use).join('');
  }, priced);
  expect(counted.match(COUNTS)?.[0] ?? null, 'a count written out as a word').toBeNull();

  if (WORDLIST) {
    const patterns = fs.readFileSync(WORDLIST, 'utf8').split(/\r?\n/).map((entry) => entry.trim()).filter((entry) => entry && !entry.startsWith('#'));
    expect(patterns.length, 'patterns in the list').toBeGreaterThan(0);
    for (const pattern of patterns) {
      expect(text.match(new RegExp(pattern, 'i'))?.[0] ?? null, 'wording from the list, in what the page says').toBeNull();
      expect(markup.match(new RegExp(pattern, 'i'))?.[0] ?? null, 'wording from the list, in the page markup or styles').toBeNull();
    }
  }
});

// The list is private, so a run without it cannot check it. This shows as
// skipped in that case, so such a run is never mistaken for a full pass.
test('the private word list was supplied for this run', () => {
  test.skip(!WORDLIST, 'HAZE_WORDLIST is not set: the private word list was not checked');
  expect(fs.existsSync(WORDLIST), 'the word list file').toBe(true);
});

/* ------------------------------------------------------------ the shell */

test('the page stands on its own: no site header, navigation or footer here, and both still on the home page', async ({ page }) => {
  await page.goto(ROUTE);
  await expect(page.locator('.wf-header, .wf-footer, .wf-skip, .dp-page-rail')).toHaveCount(0);
  await expect(page.getByRole('navigation')).toHaveCount(0);
  await expect(page.locator('#main-content')).not.toHaveClass(/legacy-page/);
  await expect(page.locator('.hz-bar')).toBeVisible();
  await expect(page.locator('.hz-bar-name')).toHaveText('Haze');
  await expect(page.locator('.hz-bar a')).toHaveText('Join the waitlist');
  await expect(page.locator('.hz-footer')).toBeVisible();
  // The only links: two to the form, one to the first scene, one to the
  // site's home page, and the address for leaving the list.
  const links = await page.locator('#main-content a').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).sort());
  expect(links).toEqual(['#pattern', '#waitlist', '#waitlist', '/', 'mailto:hello@whoffagents.com']);
  await expect(page.locator('.hz-footer a')).toHaveText('Whoff Agents');
  await expect(page.locator('.hz-footer a')).toHaveAttribute('href', '/');
  // The preview build keeps its label.
  await expect(page.locator('.wf-preview-label')).toBeVisible();

  await page.goto('/');
  await expect(page.locator('.wf-header')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation', exact: true })).toHaveCount(1);
  await expect(page.locator('.wf-footer')).toHaveCount(1);
  await expect(page.locator('.hz-bar, .hz-footer')).toHaveCount(0);
});

test('the top bar button and the opening links land on their sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE);
  await page.getByRole('link', { name: 'See how it works' }).click();
  await expect(page).toHaveURL(/#pattern$/);
  await expect(page.locator('#pattern h2')).toBeInViewport();
  await page.goto(ROUTE);
  await page.locator('.hz-bar a').click();
  await expect(page).toHaveURL(/#waitlist$/);
  await expect(page.locator('#waitlist h2')).toBeInViewport();
  // The bar stays in reach all the way down.
  await expect(page.locator('.hz-bar a')).toBeInViewport();
});

test('the page is unlisted: marked noindex, absent from the sitemap, and linked from no other page', async ({ page, request }) => {
  expect(routeMeta[ROUTE].sitemap).toBe(false);
  expect(routeMeta[ROUTE].robots).toBe('noindex, nofollow');
  const html = await (await request.get(ROUTE)).text();
  expect(html.match(/<meta name="robots"[^>]*>/g)).toEqual(['<meta name="robots" content="noindex, nofollow" />']);
  expect(html).toContain(`<title>${routeMeta[ROUTE].title}</title>`);
  expect(html).toContain(`<meta name="description" content="${routeMeta[ROUTE].description}"`);
  expect(html).toContain(`<link rel="canonical" href="https://whoffagents.com${ROUTE}"`);
  expect(await (await request.get('/sitemap.xml')).text()).not.toMatch(/haze/i);
  expect(await (await request.get('/robots.txt')).text()).not.toMatch(/haze/i);
  // No page links here: not the navigation, not the footer, not any body copy.
  for (const route of Object.keys(routeMeta).filter((entry) => entry !== ROUTE)) {
    await page.goto(route);
    await expect(page.locator('#main-content')).not.toBeEmpty();
    const links = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter((href) => /^\/?haze(\/|#|\?|$)/i.test(href.replace(/^https?:\/\/[^/]+/, ''))));
    expect(links, `links to the page from ${route}`).toEqual([]);
  }
});

test('a shared link shows the page\'s own picture, and the picture says only what the page says', async ({ page, request }) => {
  const picture = 'https://whoffagents.com/og-haze.png';
  expect(routeMeta[ROUTE].image).toBe('/og-haze.png');
  // In the HTML itself, where a link preview reads it without running any script.
  const html = await (await request.get(ROUTE)).text();
  expect(html.match(/<meta property="og:image" content="[^"]*"/g)).toEqual([`<meta property="og:image" content="${picture}"`]);
  expect(html.match(/<meta name="twitter:image" content="[^"]*"/g)).toEqual([`<meta name="twitter:image" content="${picture}"`]);
  // Every other page keeps the site's picture.
  const home = await (await request.get('/')).text();
  expect(home).toContain('<meta property="og:image" content="https://whoffagents.com/og-engineering.png"');
  expect(home).not.toContain('og-haze');
  // The file is there: a PNG of the size link previews expect.
  const file = await request.get('/og-haze.png');
  expect(file.status()).toBe(200);
  expect(file.headers()['content-type']).toContain('image/png');
  const bytes = await file.body();
  expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([CARD.width, CARD.height]);
  // Each thing drawn on it is on the page, so the picture cannot say more than the page does.
  await page.goto(ROUTE);
  const shown = (await page.locator('.hz-page').innerText()).replace(/\s+/g, ' ').toLowerCase();
  for (const words of [WORDS.name, WORDS.label, headlineText(), WORDS.button]) {
    expect(shown, `"${words}" is on the picture but not on the page`).toContain(words.toLowerCase());
  }
  // Once the app is running the tags still name this page's picture, and the home page's name the site's.
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', picture);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', picture);
  await page.goto('/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://whoffagents.com/og-engineering.png');
});

test('it serves useful HTML without JavaScript, at normal height, with a form that cannot be sent', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}${ROUTE}`);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', routeMeta[ROUTE].title);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', routeMeta[ROUTE].description);
  await expect(page.locator('svg.hz-fig')).toHaveCount(4);
  await expect(page.locator('figure.hz-figure figcaption')).toHaveText(Array(5).fill(CAPTION));
  // No scene is stretched for a scroll that no script will play.
  const tallest = await page.locator('.hz-scene').evaluateAll((scenes) => Math.max(...scenes.map((scene) => scene.offsetHeight)));
  expect(tallest).toBeLessThan(1100);
  // The form is there to read. It cannot be sent, and it says why.
  await expect(page.locator('#waitlist form')).toBeVisible();
  await expect(page.locator('#waitlist form button[type="submit"]')).toBeDisabled();
  await expect(page.locator('.hz-form-noscript')).toHaveText(line(NOTES.noscript));
  await expect(page.locator('#waitlist form')).toHaveAttribute('method', 'post');
  await context.close();
});

test('a trailing slash opens the page itself', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${ROUTE}/`);
  await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  await expect(page).toHaveTitle(routeMeta[ROUTE].title);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://whoffagents.com${ROUTE}`);
  await expect(page.locator('.hz-page')).toBeVisible();
  await expect(page.locator('.wf-header')).toHaveCount(0);
  expect(errors).toEqual([]);
});

/* --------------------------------------------------------------- motion */

test('with reduced motion each scene is a finished still frame with its caption', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE);
  await page.waitForTimeout(1200);
  // Nothing moves, nothing has been set back to an opening state, and no scene is stretched.
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await expect(page.locator('.hz-page')).not.toHaveAttribute('data-hz-on', '');
  await expect(page.locator('[data-hz-from], [data-hz-play]')).toHaveCount(0);
  expect(await page.locator('.hz-fig [style*="opacity"], [data-hz-rise][style]').count()).toBe(0);
  for (const id of SCENES) {
    const scene = page.locator(`#${id}`);
    expect(await scene.evaluate((element) => element.offsetHeight), `${id} height`).toBeLessThan(1000);
    await expect(scene.locator('figcaption')).toHaveText(CAPTION);
    await scene.locator('.hz-figure').scrollIntoViewIfNeeded();
    await expect(scene.locator('svg.hz-fig')).toBeVisible();
  }
  const opacity = (selector) => page.locator(selector).first().evaluate((element) => getComputedStyle(element).opacity);
  // The opening rests soft. The pattern is gathered and its profile sharp.
  expect(await opacity('.hz-open-sharp')).toBe('0');
  expect(await opacity('.hz-open-soft')).toBe('1');
  expect(await opacity('.hz-fig--pattern .hz-card-state--sharp')).toBe('1');
  // With the crowd in, the profile is soft.
  expect(await opacity('.hz-fig--crowd .hz-card-state--blurry')).toBe('1');
  expect(await opacity('.hz-fig--crowd .hz-card-state--sharp')).toBe('0');
  expect(await opacity('.hz-fig--crowd .hz-card-routine')).toBe('0');
  expect(await page.locator('.hz-fig--crowd .hz-row--decoy .hz-dot').evaluateAll((dots) => dots.every((dot) => getComputedStyle(dot).opacity === '1'))).toBe(true);
  // The random marks have been dropped, and both outcomes are named.
  expect(Number(await opacity('.hz-mark--caught'))).toBeLessThan(0.5);
  expect(await opacity('.hz-test-out--caught')).toBe('1');
  expect(await opacity('.hz-test-out--passes')).toBe('1');
  // The gauge rests short of its far end, with no warning showing.
  const mark = await page.locator('.hz-gauge-mark').getAttribute('transform');
  const [x] = mark.match(/[\d.]+/g).map(Number);
  expect(x).toBeGreaterThan(200);
  expect(x).toBeLessThan(320);
  await expect(page.locator('.hz-notice')).toHaveAttribute('opacity', '0');
});

test('on a wide screen the scroll plays each scene from its opening state to its finished frame, and back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await started(page);
  // What each figure holds as built, to compare with where the scroll leaves it.
  const drawn = (id) =>
    page.locator(`#${id} svg.hz-fig`).evaluate((svg) =>
      [...svg.querySelectorAll('circle, g[transform], rect, path, text')].map((element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return [element.tagName, Math.round(box.x), Math.round(box.y), Math.round(box.width), Number(style.opacity).toFixed(2)].join(' ');
      }),
    );

  // The pattern: scattered and soft at first, gathered at the end.
  await play(page, 'pattern', 0);
  await page.waitForTimeout(900);
  const firstDot = page.locator('.hz-fig--pattern .hz-dot').first();
  const placed = { x: await firstDot.getAttribute('cx'), from: await firstDot.getAttribute('data-fx') };
  expect(Number(placed.x)).toBeCloseTo(Number(placed.from), 0);
  expect(Number(await firstDot.evaluate((dot) => getComputedStyle(dot).opacity))).toBeLessThan(0.3);
  expect(await page.locator('.hz-fig--pattern .hz-card-state--sharp').evaluate((element) => getComputedStyle(element).opacity)).toBe('0');
  await play(page, 'pattern', 1);
  await page.waitForTimeout(1500);
  expect(await page.locator('.hz-fig--pattern .hz-card-state--sharp').evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  const finished = await drawn('pattern');
  // Back to the start, then forward again: the same finished frame.
  await play(page, 'pattern', 0);
  await page.waitForTimeout(1500);
  expect(await drawn('pattern')).not.toEqual(finished);
  await play(page, 'pattern', 1);
  await page.waitForTimeout(1500);
  expect(await drawn('pattern')).toEqual(finished);

  // The crowd: it opens on the sharp profile and ends on the soft one.
  await play(page, 'crowd', 0);
  await page.waitForTimeout(1200);
  const crowd = (selector) => page.locator(`.hz-fig--crowd ${selector}`).first().evaluate((element) => getComputedStyle(element).opacity);
  expect(await crowd('.hz-card-state--sharp')).toBe('1');
  expect(await crowd('.hz-card-state--blurry')).toBe('0');
  expect(await crowd('.hz-row--decoy .hz-dot')).toBe('0');
  await play(page, 'crowd', 1);
  await page.waitForTimeout(1500);
  expect(await crowd('.hz-card-state--sharp')).toBe('0');
  expect(await crowd('.hz-card-state--blurry')).toBe('1');

  // Tested: a random mark has not reached the detector at the start, and
  // lies dropped at the end. A tested one ends past it.
  await play(page, 'tested', 0);
  await page.waitForTimeout(1200);
  const gate = await page.locator('.hz-gate-line').evaluate((element) => element.getBoundingClientRect().x);
  const centreX = (selector) => page.locator(selector).first().evaluate((element) => element.getBoundingClientRect().x + element.getBoundingClientRect().width / 2);
  expect(await centreX('.hz-mark--caught')).toBeLessThan(gate);
  expect(await centreX('.hz-mark--tested.is-passed')).toBeLessThan(gate);
  expect(await page.locator('.hz-test-out--caught').evaluate((element) => getComputedStyle(element).opacity)).toBe('0');
  await play(page, 'tested', 1);
  await page.waitForTimeout(1500);
  expect(await centreX('.hz-mark--caught')).toBeLessThan(gate);
  expect(await centreX('.hz-mark--tested.is-passed')).toBeGreaterThan(gate);
  expect(Number(await page.locator('.hz-mark--caught').first().evaluate((element) => getComputedStyle(element).opacity))).toBeLessThan(0.5);

  // The score: the marker starts at the easy end, with the warning showing.
  await play(page, 'score', 0);
  await page.waitForTimeout(1200);
  const markX = async () => Number((await page.locator('.hz-gauge-mark').getAttribute('transform')).match(/[\d.]+/)[0]);
  const easy = await markX();
  expect(Number(await page.locator('.hz-notice').getAttribute('opacity'))).toBeGreaterThan(0.9);
  await play(page, 'score', 1);
  await page.waitForTimeout(1500);
  expect(await markX()).toBeGreaterThan(easy + 150);
  expect(Number(await page.locator('.hz-notice').getAttribute('opacity'))).toBe(0);
});

test('on a wide screen scenes run only while they are on screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await started(page);
  await page.waitForTimeout(900);

  // At the top only the opening moves.
  await expect(page.locator('.hz-figure--opening')).toHaveAttribute('data-live', 'true');
  expect(await running(page, '.hz-figure--opening')).toBeGreaterThan(0);
  for (const id of SCENES) {
    await expect(page.locator(`#${id} .hz-figure`)).toHaveAttribute('data-live', 'false');
    expect(await running(page, `#${id}`), `${id} while off screen`).toBe(0);
  }
  expect(await changes(page, '#pattern'), 'the first scene before it is reached').toBe(0);
  expect(await changes(page, '#score'), 'the last scene before it is reached').toBe(0);

  // In a scene, that scene moves and the opening rests where it was.
  await play(page, 'crowd', 1);
  await expect(page.locator('#crowd .hz-figure')).toHaveAttribute('data-live', 'true');
  await expect(page.locator('.hz-figure--opening')).toHaveAttribute('data-live', 'false');
  await page.waitForTimeout(900);
  expect(await running(page, '#crowd')).toBeGreaterThan(0);
  expect(await running(page, '.hz-figure--opening'), 'the opening while off screen').toBe(0);
  expect(await running(page, '#score'), 'a later scene while off screen').toBe(0);
  expect(await changes(page, '#pattern'), 'the scene before, once left').toBe(0);
  expect(await changes(page, '#tested'), 'the scene after, not yet reached').toBe(0);

  // Past them all, nothing is left running.
  await page.locator('#waitlist').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  for (const id of SCENES) {
    await expect(page.locator(`#${id} .hz-figure`)).toHaveAttribute('data-live', 'false');
    expect(await running(page, `#${id}`), `${id} once left`).toBe(0);
    expect(await changes(page, `#${id}`, 700), `${id} once left`).toBe(0);
  }
  expect(await running(page, '.hz-figure--opening')).toBe(0);
});

test('on a phone each scene waits, plays once as its figure comes into view, and ends on its finished frame', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto(ROUTE);
  await started(page);
  // Not held: nothing is stretched, and nothing follows the scroll.
  await expect(page.locator('[data-hz-from]')).toHaveCount(0);
  const tallest = await page.locator('.hz-scene').evaluateAll((scenes) => Math.max(...scenes.map((scene) => scene.offsetHeight)));
  expect(tallest).toBeLessThan(1100);

  for (const id of SCENES) {
    const section = page.locator(`#${id}`);
    await expect(section).toHaveAttribute('data-hz-play', 'waiting');
    expect(await changes(page, `#${id}`, 500), `${id} before it is reached`).toBe(0);
  }
  // The first scene is set to its opening state while it waits.
  const firstDot = page.locator('.hz-fig--pattern .hz-dot').first();
  expect(Number(await firstDot.getAttribute('cx'))).toBeCloseTo(Number(await firstDot.getAttribute('data-fx')), 0);

  // Bring its figure into view: it plays through and stops.
  await page.locator('#pattern .hz-figure').evaluate((figure) => window.scrollTo({ top: figure.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' }));
  await expect(page.locator('#pattern')).toHaveAttribute('data-hz-play', 'playing');
  expect(await changes(page, '#pattern', 600)).toBeGreaterThan(0);
  await expect(page.locator('#pattern')).toHaveAttribute('data-hz-play', 'done', { timeout: 15000 });
  expect(await page.locator('.hz-fig--pattern .hz-card-state--sharp').evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  expect(await changes(page, '#pattern .hz-fig', 800), 'the first scene once it has played').toBe(0);
  // The others are still waiting.
  await expect(page.locator('#score')).toHaveAttribute('data-hz-play', 'waiting');

  // A scene left partway stops where it is, and carries on when it is back.
  const toFigure = () => page.locator('#tested .hz-figure').evaluate((figure) => window.scrollTo({ top: figure.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' }));
  await toFigure();
  await expect(page.locator('#tested')).toHaveAttribute('data-hz-play', 'playing');
  await page.waitForTimeout(700);
  await scrollTo(page, 0);
  await expect(page.locator('#tested .hz-figure')).toHaveAttribute('data-live', 'false');
  await page.waitForTimeout(300);
  expect(await changes(page, '#tested', 800), 'a scene left partway').toBe(0);
  await expect(page.locator('#tested')).toHaveAttribute('data-hz-play', 'playing');
  await toFigure();
  await expect(page.locator('#tested')).toHaveAttribute('data-hz-play', 'done', { timeout: 15000 });
  const gate = await page.locator('.hz-gate-line').evaluate((element) => element.getBoundingClientRect().x);
  expect(await page.locator('.hz-mark--tested.is-passed').first().evaluate((element) => element.getBoundingClientRect().x)).toBeGreaterThan(gate);
});

test('held scenes fit the window on laptop screens', async ({ page }) => {
  for (const [width, height] of [[1440, 900], [1366, 650], [1280, 600], [1024, 768]]) {
    await page.setViewportSize({ width, height });
    await page.goto(ROUTE);
    await started(page);
    const bar = await page.locator('.hz-bar').evaluate((element) => element.getBoundingClientRect().bottom);
    for (const id of SCENES) {
      await play(page, id, 1);
      await page.waitForTimeout(250);
      const box = await page.locator(`#${id} .hz-scene-grid`).evaluate((grid) => {
        const rects = [...grid.children].map((child) => child.getBoundingClientRect());
        return { top: Math.min(...rects.map((rect) => rect.top)), bottom: Math.max(...rects.map((rect) => rect.bottom)) };
      });
      expect(box.top, `${id} top at ${width}x${height}`).toBeGreaterThanOrEqual(bar);
      expect(box.bottom, `${id} bottom at ${width}x${height}`).toBeLessThanOrEqual(height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}x${height}`).toBe(true);
  }
});

test('the opening fits a phone screen with its toolbars showing: both buttons without scrolling', async ({ page }) => {
  for (const [width, height] of [[375, 548], [390, 664], [360, 640]]) {
    await page.setViewportSize({ width, height });
    await page.goto(ROUTE);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    const bar = await page.locator('.hz-bar').boundingBox();
    for (const link of [page.locator('.hz-opening .hz-button'), page.getByRole('link', { name: 'See how it works' })]) {
      const box = await link.boundingBox();
      expect(box.y, `${await link.textContent()} at ${width}x${height}`).toBeGreaterThanOrEqual(bar.y + bar.height);
      expect(box.y + box.height, `${await link.textContent()} at ${width}x${height}`).toBeLessThanOrEqual(height);
      expect(box.x + box.width, `${await link.textContent()} at ${width}x${height}`).toBeLessThanOrEqual(width);
    }
    await expect(page.locator('.hz-label')).toBeInViewport();
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport({ ratio: 1 });
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
    await started(page);
    await page.waitForTimeout(3000);
    expect(await page.evaluate(() => window.__shift), `layout shift at ${width}x${height}`).toBeLessThan(0.01);
  }
});

test('if the motion cannot load, or the browser lacks what it needs, the page stays as still frames', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  const settled = async () => {
    await expect(page.locator('.hz-page')).toHaveAttribute('data-hz-static', '', { timeout: 15000 });
    const tallest = await page.locator('.hz-scene').evaluateAll((scenes) => Math.max(...scenes.map((scene) => scene.offsetHeight)));
    expect(tallest).toBeLessThan(1100);
    await expect(page.locator('.hz-page')).not.toHaveAttribute('data-hz-on', '');
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    expect(await page.locator('.hz-fig--crowd .hz-card-state--blurry').evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    await expect(page.locator('#waitlist form')).toBeVisible();
  };
  // The motion's own script does not arrive.
  await page.route(/hazeMotion-[^/]*\.js$/, (route) => route.abort());
  await page.goto(ROUTE);
  await settled();
  await page.unroute(/hazeMotion-[^/]*\.js$/);
  // The browser cannot say what is on screen.
  await page.addInitScript(() => {
    delete window.IntersectionObserver;
  });
  await page.goto(ROUTE);
  await settled();
  expect(errors, 'page errors').toEqual([]);
});

test('turning motion off while the page is open puts every scene back on its finished frame', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Where each part of each figure sits, and how strongly it shows.
  const frames = () =>
    page.locator('svg.hz-fig').evaluateAll((figures) =>
      figures.map((svg) => {
        const stage = svg.getBoundingClientRect();
        return [...svg.querySelectorAll('circle, rect, path, text, line')].map((element) => {
          const box = element.getBoundingClientRect();
          return [element.tagName, Math.round(box.x - stage.x), Math.round(box.y - stage.y), Math.round(box.width), Number(getComputedStyle(element).opacity).toFixed(2)].join(' ');
        });
      }),
    );
  // The finished frames, as the page is built.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE);
  const built = await frames();
  // With motion on, a scene partway through is not on its finished frame.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(ROUTE);
  await started(page);
  await play(page, 'crowd', 0.45);
  await page.waitForTimeout(1000);
  expect(await frames()).not.toEqual(built);
  // Motion off: nothing is running or stretched, and every figure is as built.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hz-page')).not.toHaveAttribute('data-hz-on', '');
  await expect(page.locator('[data-hz-from], [data-hz-play]')).toHaveCount(0);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  const tallest = await page.locator('.hz-scene').evaluateAll((scenes) => Math.max(...scenes.map((scene) => scene.offsetHeight)));
  expect(tallest).toBeLessThan(1000);
  expect(await frames()).toEqual(built);
  // Motion back on: the scenes are held and played by the scroll again.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await started(page);
  await expect(page.locator('[data-hz-from]')).toHaveCount(4);
});

test('a change of screen shape moves the scenes between held and played, with nothing left over', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await started(page);
  await expect(page.locator('[data-hz-from]')).toHaveCount(4);
  // Narrow: no scene follows the scroll, none is stretched, all wait to play.
  await page.setViewportSize({ width: 390, height: 664 });
  await expect(page.locator('[data-hz-from]')).toHaveCount(0);
  await expect(page.locator('[data-hz-play="waiting"]')).toHaveCount(4);
  const tallest = await page.locator('.hz-scene').evaluateAll((scenes) => Math.max(...scenes.map((scene) => scene.offsetHeight)));
  expect(tallest).toBeLessThan(1100);
  // Wide again: held and played by the scroll, and not waiting on a clock.
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('[data-hz-from]')).toHaveCount(4);
  await expect(page.locator('[data-hz-play]')).toHaveCount(0);
  await play(page, 'score', 1);
  await page.waitForTimeout(1300);
  await expect(page.locator('.hz-notice')).toHaveAttribute('opacity', '0');
  expect(errors, 'page errors').toEqual([]);
});

/* ------------------------------------------------------- the form, preview */

test('in a preview build the form works on screen, names what is missing, and sends nothing', async ({ page }) => {
  const posts = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') posts.push(`${request.method()} ${request.url()}`);
  });
  await page.goto(`${ROUTE}#waitlist`);
  const section = page.locator('#waitlist');
  const form = section.locator('form');
  await expect(section.locator('[data-hz-waitlist]')).toHaveAttribute('data-hz-waitlist', 'preview');
  await expect(form.getByLabel('Email', { exact: true })).toHaveAttribute('type', 'email');
  await expect(form.getByLabel('Email', { exact: true })).toHaveAttribute('required', '');
  // The choices, with the values a signup carries.
  await expect(form.getByRole('group', { name: 'Where would you use it?' }).getByRole('radio')).toHaveCount(3);
  await expect(form.getByRole('group', { name: 'What would you pay?' }).getByRole('radio')).toHaveCount(5);
  expect(await form.locator('input[name="where"]').evaluateAll((inputs) => inputs.map((input) => input.value))).toEqual(['extension', 'android', 'both']);
  expect(await form.locator('input[name="pay"]').evaluateAll((inputs) => inputs.map((input) => input.value))).toEqual(['free', '3', '5', '8', 'once']);
  await expect(form.getByRole('radio', { checked: true })).toHaveCount(0);
  const note = form.getByLabel(/What bothers you most about being tracked\?/);
  await expect(note).toHaveAttribute('maxlength', '200');
  await expect(note).not.toHaveAttribute('required', '');
  await note.pressSequentially('x'.repeat(205));
  expect((await note.inputValue()).length).toBe(200);
  await note.fill('');
  // The field for scripts: never seen, never reached, never announced.
  const extra = form.locator('input[name="website"]');
  await expect(extra).toHaveAttribute('tabindex', '-1');
  expect(await extra.evaluate((input) => input.closest('[aria-hidden="true"]') !== null)).toBe(true);
  expect(await extra.evaluate((input) => input.getBoundingClientRect().right)).toBeLessThan(0);
  await expect(section.getByRole('link', { name: 'hello@whoffagents.com' })).toHaveAttribute('href', 'mailto:hello@whoffagents.com');

  // Sent with nothing filled in: both messages, announced, and focus on the first gap.
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  const alert = form.getByRole('alert');
  await expect(alert.locator('p')).toHaveText([line(NOTES.email), line(NOTES.choice)]);
  await expect(form.getByLabel('Email', { exact: true })).toBeFocused();
  await expect(form.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByLabel('Email', { exact: true })).toHaveAccessibleDescription(line(NOTES.email));
  await expect(form.getByRole('group', { name: 'Where would you use it?' })).toHaveAccessibleDescription(line(NOTES.choice));
  // An address that is not one: the email message only, once the choices are made.
  await form.getByLabel('Email', { exact: true }).fill('not an address');
  await form.getByText('Both', { exact: true }).click();
  await form.getByText('A one-time price, not monthly', { exact: true }).click();
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(alert.locator('p')).toHaveText([line(NOTES.email)]);
  // One choice missing: the choice message only, and focus on that question.
  await page.reload();
  await form.getByLabel('Email', { exact: true }).fill('test@example.com');
  await form.getByText('Android app', { exact: true }).click();
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(alert.locator('p')).toHaveText([line(NOTES.choice)]);
  await expect(form.locator('input[name="pay"]').first()).toBeFocused();
  await form.getByText('$8 a month', { exact: true }).click();
  await expect(alert.locator('p')).toHaveCount(0);

  // Complete: the preview ending takes the form's place, with focus on it.
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  const ending = section.getByRole('status');
  await expect(ending).toHaveText(line(NOTES.preview));
  await expect(ending).toBeFocused();
  await expect(form).toHaveCount(0);
  // How to leave the list stays in view once the form is gone.
  await expect(section.getByRole('link', { name: 'hello@whoffagents.com' })).toBeVisible();
  const result = await new AxeBuilder({ page }).include('#waitlist').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
  await page.waitForTimeout(500);
  expect(posts).toEqual([]);
});

test('the form can be filled in and sent with the keyboard alone', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE);
  const form = page.locator('#waitlist form');
  await expect(form.getByRole('button', { name: 'Join the waitlist' })).toBeEnabled();
  const focused = () => page.evaluate(() => {
    const element = document.activeElement;
    const style = getComputedStyle(element);
    return { name: element.getAttribute('name') || element.textContent.trim(), value: element.value ?? null, ring: style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2 };
  });
  // From the top of the page: the bar, the two opening links, then the form.
  const stops = [];
  for (let press = 0; press < 4; press += 1) {
    await page.keyboard.press('Tab');
    stops.push(await focused());
  }
  expect(stops.map((stop) => stop.name)).toEqual(['Join the waitlist', 'Join the waitlist', 'See how it works', 'email']);
  expect(stops.every((stop) => stop.ring), 'a visible focus ring on every stop').toBe(true);
  await expect(page.locator('#waitlist h2')).toBeInViewport();
  await page.keyboard.type('keys@example.com');
  // Each question is one stop. Arrow keys choose within it.
  await page.keyboard.press('Tab');
  expect(await focused()).toMatchObject({ name: 'where', value: 'extension', ring: true });
  await page.keyboard.press('ArrowDown');
  await expect(form.locator('input[name="where"][value="android"]')).toBeChecked();
  await page.keyboard.press('Tab');
  expect(await focused()).toMatchObject({ name: 'pay', value: 'free', ring: true });
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(form.locator('input[name="pay"][value="5"]')).toBeChecked();
  await page.keyboard.press('Tab');
  expect(await focused()).toMatchObject({ name: 'note', ring: true });
  await page.keyboard.type('Typed with the keyboard.');
  // The hidden field is not a stop: the button is next.
  await page.keyboard.press('Tab');
  expect(await focused()).toMatchObject({ name: 'Join the waitlist', ring: true });
  await page.keyboard.press('Enter');
  const ending = page.locator('#waitlist').getByRole('status');
  await expect(ending).toHaveText(line(NOTES.preview));
  await expect(ending).toBeFocused();
  // From the ending: the address for leaving the list, then the footer link.
  await page.keyboard.press('Tab');
  expect(await focused()).toMatchObject({ name: 'hello@whoffagents.com', ring: true });
  await page.keyboard.press('Tab');
  expect(await focused()).toMatchObject({ name: 'Whoff Agents', ring: true });
});

/* --------------------------------------------------------- the form, live */

test('in a live build with no waitlist address the form is not shown at all', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const writes = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') writes.push(request.url());
  });
  await page.goto(`${live.closed.origin}${ROUTE}`);
  const section = page.locator('#waitlist');
  await expect(section.locator('.hz-form-closed')).toHaveText(line(NOTES.closed));
  await expect(section.locator('[data-hz-waitlist]')).toHaveAttribute('data-hz-waitlist', 'closed');
  await expect(section.locator('form, input, button, a')).toHaveCount(0);
  // No way round it: nothing on the page offers email or another form.
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('form')).toHaveCount(0);
  // The rest of the page is as usual, and it is not a preview.
  await expect(section.locator('h2')).toHaveText('Should we build it?');
  await expect(page.locator('.wf-preview-label')).toHaveCount(0);
  await expect(page.locator('.hz-bar a')).toHaveAttribute('href', '#waitlist');
  expect(writes).toEqual([]);
  expect(live.closed.posts).toEqual([]);
  await context.close();
});

test('in a live build with a waitlist address the form sends one POST with exactly the five fields', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const before = live.open.posts.length;
  const arrived = () => live.open.posts.slice(before);
  await page.goto(`${live.open.origin}${ROUTE}`);
  const section = page.locator('#waitlist');
  const form = section.locator('form');
  await expect(section.locator('[data-hz-waitlist]')).toHaveAttribute('data-hz-waitlist', 'open');
  await expect(page.locator('.wf-preview-label')).toHaveCount(0);

  // Nothing is sent while something is missing.
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(form.getByRole('alert').locator('p')).toHaveText([line(NOTES.email), line(NOTES.choice)]);
  expect(arrived()).toEqual([]);

  // An answer that is not a success: the failed message, and the answers kept.
  await form.getByLabel('Email', { exact: true }).fill('live@example.com');
  await form.getByText('Both', { exact: true }).click();
  await form.getByText('$3 a month', { exact: true }).click();
  await form.getByLabel(/What bothers you most/).fill('  A local check, not a signup. ');
  live.open.state.fail = true;
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(form.getByRole('alert').locator('p')).toHaveText([line(NOTES.failed)]);
  await expect(form.getByLabel('Email', { exact: true })).toHaveValue('live@example.com');
  await expect(form.locator('input[name="pay"][value="3"]')).toBeChecked();
  await expect(form.getByRole('button', { name: 'Join the waitlist' })).toBeEnabled();
  // A request that cannot be made at all is a failure too.
  await page.route(`**${ENDPOINT}`, (route) => route.abort());
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(form.getByRole('alert').locator('p')).toHaveText([line(NOTES.failed)]);
  await page.unroute(`**${ENDPOINT}`);
  expect(arrived()).toHaveLength(1);

  // An address the far end would never take is caught here, before anything
  // is sent. The browser's own check lets this one through. The page's does not.
  await form.getByLabel('Email', { exact: true }).fill('live@example');
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(form.getByRole('alert').locator('p')).toHaveText([line(NOTES.email)]);
  await expect(form.getByLabel('Email', { exact: true })).toBeFocused();
  expect(arrived()).toHaveLength(1);
  // If the far end still turns an address away, the page says so. "Try again
  // in a minute" would never work for that person.
  await form.getByLabel('Email', { exact: true }).fill('live@example.com');
  await page.route(`**${ENDPOINT}`, (route) => route.fulfill({ status: 400, contentType: 'application/json', body: '{"ok":false}' }));
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(form.getByRole('alert').locator('p')).toHaveText([line(NOTES.email)]);
  await expect(form.getByLabel('Email', { exact: true })).toBeFocused();
  await expect(form.locator('input[name="pay"][value="3"]')).toBeChecked();
  await page.unroute(`**${ENDPOINT}`);
  expect(arrived()).toHaveLength(1);

  // A success: the sent message takes the form's place.
  live.open.state.fail = false;
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  const ending = section.getByRole('status');
  await expect(ending).toHaveText(line(NOTES.sent));
  await expect(ending).toBeFocused();
  await expect(form).toHaveCount(0);
  expect(arrived()).toHaveLength(2);
  for (const post of arrived()) {
    expect(post.path).toBe(ENDPOINT);
    expect(post.headers['content-type']).toBe('application/json');
    expect(post.headers.cookie, 'a cookie header').toBeUndefined();
    expect(post.headers.referer, 'a referrer').toBeUndefined();
    // Exactly these fields, in this order, and nothing else.
    expect(post.body).toBe(JSON.stringify({ email: 'live@example.com', where: 'both', pay: '3', note: 'A local check, not a signup.', website: '' }));
  }

  // The hidden field filled in: the page answers as if sent, and sends nothing.
  await page.reload();
  await fill(form, 'script@example.com');
  await form.locator('input[name="website"]').fill('https://example.com', { force: true });
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(section.getByRole('status')).toHaveText(line(NOTES.sent));
  await page.waitForTimeout(500);
  expect(arrived()).toHaveLength(2);

  // A 503 that does not say the list is full is an outage, not a full list:
  // the plain failed message, with the form kept so the person can try again.
  await page.reload();
  await fill(form, 'late@example.com');
  await page.route(`**${ENDPOINT}`, (route) => route.fulfill({ status: 503, contentType: 'text/html', body: 'Service Unavailable' }));
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(form.getByRole('alert').locator('p')).toHaveText([line(NOTES.failed)]);
  await expect(form).toHaveCount(1);
  await page.unroute(`**${ENDPOINT}`);

  // A full list: the far end says so, and the page says so in place of the
  // form, with what to do. "Try again in a minute" would never work.
  await page.route(`**${ENDPOINT}`, (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false,"full":true}' }));
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await expect(section.getByRole('status')).toHaveText(line(NOTES.full));
  await expect(form).toHaveCount(0);
  await page.unroute(`**${ENDPOINT}`);
  expect(arrived()).toHaveLength(2);
  await context.close();
});

test('a live build of the page asks nothing of any other origin and keeps nothing in the browser', async ({ playwright }) => {
  test.setTimeout(120000);
  // A browser of its own that resolves every host name to this machine, so a
  // request that slipped past the catch below would find nothing listening.
  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--host-resolver-rules=MAP * 127.0.0.1'],
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : { channel: 'chrome' }),
  });
  const visit = async (address, waitUntil = 'load') => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const outside = [];
    // Every request to another origin is noted and answered here. None is passed on.
    await context.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(`${live.open.origin}/`)) return route.continue();
      outside.push(url.split('?')[0]);
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    const page = await context.newPage();
    await page.goto(`${live.open.origin}${address}`, { waitUntil });
    return { context, page, outside };
  };
  const kept = async (context, page) => ({
    cookies: (await context.cookies()).length,
    ...(await page.evaluate(async () => ({
      local: Object.keys(window.localStorage),
      session: Object.keys(window.sessionStorage),
      databases: (await window.indexedDB.databases()).length,
      documentCookie: document.cookie,
    }))),
  });
  try {
    for (const address of [`${ROUTE}?utm_source=local-check&utm_campaign=local-check`, `${ROUTE}/`, `${ROUTE}//`, '/HAZE']) {
      const { context, page, outside } = await visit(address, 'networkidle');
      if (new URL(page.url()).pathname === ROUTE) {
        // Scroll the whole page, then send the form.
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let top = 0; top < height; top += 600) {
          await scrollTo(page, top);
          await page.waitForTimeout(80);
        }
        const form = page.locator('#waitlist form');
        await fill(form, 'quiet@example.com');
        await form.getByRole('button', { name: 'Join the waitlist' }).click();
        await expect(page.locator('#waitlist').getByRole('status')).toHaveText(line(NOTES.sent));
      }
      await page.waitForTimeout(700);
      expect(outside, `requests to other origins from ${address}`).toEqual([]);
      expect(await kept(context, page), `kept in the browser by ${address}`).toEqual({ cookies: 0, local: [], session: [], databases: 0, documentCookie: '' });
      await context.close();
    }
    // Every other page is as it was: analytics starts, and the campaign capture runs.
    for (const address of ['/?utm_source=local-check', '/about']) {
      const { context, page, outside } = await visit(address);
      await expect.poll(() => outside.filter((url) => /posthog\.com/.test(url)).length, { message: `analytics requests from ${address}`, timeout: 10000 }).toBeGreaterThan(0);
      if (address.includes('utm_source')) expect((await kept(context, page)).session).toContain('whoff_utms');
      await context.close();
    }
  } finally {
    await browser.close();
  }
});
