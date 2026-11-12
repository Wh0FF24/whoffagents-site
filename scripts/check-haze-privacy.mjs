// Check what the /haze page says about itself, on a real live build:
// "This page loads nothing from other companies and sets no cookies."
//   node scripts/check-haze-privacy.mjs [port]
//
// What it does:
//  1. Builds the site the way production is built (no preview flag), with a
//     made-up analytics key and a made-up waitlist address, into dist/.
//  2. Serves dist/ on 127.0.0.1 (port 4477 unless another is given).
//  3. Opens /haze, /haze/ and /haze/index.html in Chrome, scrolls the whole
//     page, and fills in and sends the form.
//  4. Opens / and /about, to confirm analytics still starts on other pages.
//  5. Removes dist/, so a build holding the made-up settings is not left
//     behind.
//
// Nothing leaves this machine:
//  - Every request to any other origin is caught and answered here, by this
//    script, and never passed on.
//  - The browser resolves every host name to this machine, so a request that
//    slipped past would find nothing listening.
//  - The waitlist address is a path on the local server, which records what
//    arrives and stores nothing.
//
// It fails unless, on the page: no request went to another origin, no
// cookie was set, nothing was kept in the browser, and sending the form made
// exactly one POST, to this origin, with exactly the five fields.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { buildSite, rootDir, serveSite } from './haze-local.mjs';

const port = Number(process.argv[2] || 4477);
const ENDPOINT = '/api/haze-waitlist';
const FIELDS = ['email', 'where', 'pay', 'note', 'website'];
const SENT = 'You are on the list. One email when there is news.';
// Made up. It only has to be present for the site to try to start analytics.
const MADE_UP_KEY = 'phc_local_check_not_a_real_key';

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
  return condition;
};

console.log('Building a live build with a made-up analytics key and waitlist address...');
const dist = buildSite({ prerender: true, settings: { VITE_POSTHOG_KEY: MADE_UP_KEY, VITE_HAZE_WAITLIST_ENDPOINT: ENDPOINT } });
const built = fs.readFileSync(path.join(dist, 'haze/index.html'), 'utf8');
check(/<meta name="robots" content="noindex, nofollow"/.test(built), 'the built page has no robots tag');
check(!/DESIGN PREVIEW/.test(built), 'this is a preview build, not a live one');

const site = await serveSite({ dir: dist, port, answer: (pathname) => (pathname === ENDPOINT ? { status: 200, body: '{"ok":true}' } : { status: 404 }) });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--host-resolver-rules=MAP * 127.0.0.1'] });

// Open one address in a fresh browser profile and watch everything it asks for.
async function visit(address, { width = 1280, height = 800 } = {}) {
  const context = await browser.newContext({ viewport: { width, height } });
  const seen = { outside: [], sameOriginWrites: [], sockets: [] };
  await context.route('**/*', (route) => {
    const request = route.request();
    if (request.url().startsWith(`${site.origin}/`)) {
      if (request.method() !== 'GET') seen.sameOriginWrites.push(`${request.method()} ${new URL(request.url()).pathname}`);
      return route.continue();
    }
    // Another origin: note it and answer here. It is never passed on.
    seen.outside.push(`${request.method()} ${request.url().split('?')[0]}`);
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  const page = await context.newPage();
  page.on('websocket', (socket) => seen.sockets.push(socket.url()));
  await page.goto(`${site.origin}${address}`, { waitUntil: 'networkidle' });
  return { context, page, seen };
}

// What the browser is holding for this origin once the visit is over.
async function kept(context, page) {
  const cookies = (await context.cookies()).map((cookie) => cookie.name);
  const stores = await page.evaluate(async () => ({
    local: Object.keys(window.localStorage),
    session: Object.keys(window.sessionStorage),
    databases: (await window.indexedDB.databases()).map((database) => database.name),
    caches: await window.caches.keys(),
    workers: (await navigator.serviceWorker.getRegistrations()).length,
    documentCookie: document.cookie,
  }));
  return { cookies, ...stores };
}

const nothingKept = (holding) =>
  holding.cookies.length === 0 &&
  holding.documentCookie === '' &&
  holding.local.length === 0 &&
  holding.session.length === 0 &&
  holding.databases.length === 0 &&
  holding.caches.length === 0 &&
  holding.workers === 0;

async function scrollThrough(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let top = 0; top < height; top += 500) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(600);
}

async function fillForm(page, email) {
  const form = page.locator('#waitlist form');
  await form.getByLabel('Email', { exact: true }).fill(email);
  await form.getByText('Phone app', { exact: true }).click();
  await form.getByText('$5 a month', { exact: true }).click();
  await form.getByLabel(/What bothers you most/).fill('Local check. Not a real signup.');
  return form;
}

/* ------------------------------------------------------- the page itself */

const report = [];
for (const [address, email] of [['/haze?utm_source=local-check&utm_campaign=local-check', 'local-check@example.com'], ['/haze/', 'local-check-two@example.com']]) {
  const name = address.split('?')[0];
  const before = site.posts.length;
  const { context, page, seen } = await visit(address);
  check(await page.locator('.hz-page').count() === 1, `${name}: the page did not open`);
  check(new URL(page.url()).pathname === '/haze', `${name}: the address did not settle on /haze`);
  await scrollThrough(page);
  const form = await fillForm(page, email);
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await page.locator('.hz-form-ending').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  const ending = (await page.locator('.hz-form-ending').textContent().catch(() => '')) || '';
  await page.waitForTimeout(800);
  const holding = await kept(context, page);
  const posts = site.posts.slice(before);

  check(ending === SENT, `${name}: after sending, the page says ${JSON.stringify(ending)}`);
  check(seen.outside.length === 0, `${name}: requests to other origins: ${seen.outside.join(', ')}`);
  check(seen.sockets.length === 0, `${name}: sockets opened: ${seen.sockets.join(', ')}`);
  check(nothingKept(holding), `${name}: kept in the browser: ${JSON.stringify(holding)}`);
  check(posts.length === 1 && seen.sameOriginWrites.length === 1, `${name}: expected one POST, saw ${posts.length} arrive and ${seen.sameOriginWrites.length} leave`);
  if (posts.length === 1) {
    const [post] = posts;
    let body = {};
    try {
      body = JSON.parse(post.body);
    } catch {
      check(false, `${name}: the body is not JSON: ${post.body.slice(0, 80)}`);
    }
    check(post.path === ENDPOINT, `${name}: posted to ${post.path}`);
    check((post.headers['content-type'] || '') === 'application/json', `${name}: content type ${post.headers['content-type']}`);
    check(!('cookie' in post.headers), `${name}: the POST carried a cookie header`);
    check(JSON.stringify(Object.keys(body)) === JSON.stringify(FIELDS), `${name}: fields ${Object.keys(body).join(', ')}`);
    check(body.email === email && body.where === 'android' && body.pay === '5' && body.website === '', `${name}: values ${post.body}`);
    report.push(`${name}: one POST to ${post.path}, content type ${post.headers['content-type']}, no cookie header, body ${post.body}`);
  }
  report.push(`${name}: requests to other origins ${seen.outside.length}, cookies ${holding.cookies.length}, localStorage ${holding.local.length}, sessionStorage ${holding.session.length}, IndexedDB ${holding.databases.length}, cache storage ${holding.caches.length}, service workers ${holding.workers}`);
  await context.close();
}

// The same page asked for by its file name. The app shows no form there, and
// it must be just as quiet.
{
  const { context, page, seen } = await visit('/haze/index.html');
  await scrollThrough(page);
  const holding = await kept(context, page);
  check(seen.outside.length === 0, `/haze/index.html: requests to other origins: ${seen.outside.join(', ')}`);
  check(nothingKept(holding), `/haze/index.html: kept in the browser: ${JSON.stringify(holding)}`);
  report.push(`/haze/index.html: requests to other origins ${seen.outside.length}, nothing kept ${nothingKept(holding)}`);
  await context.close();
}

// A filled hidden field means a script filled the form in. The page answers
// as if it went through and sends nothing.
{
  const before = site.posts.length;
  const { context, page, seen } = await visit('/haze');
  const form = await fillForm(page, 'local-check-three@example.com');
  await form.locator('input[name="website"]').fill('https://example.com', { force: true });
  await form.getByRole('button', { name: 'Join the waitlist' }).click();
  await page.locator('.hz-form-ending').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  const ending = (await page.locator('.hz-form-ending').textContent().catch(() => '')) || '';
  await page.waitForTimeout(500);
  check(ending === SENT, `hidden field filled: the page says ${JSON.stringify(ending)}`);
  check(site.posts.length === before && seen.sameOriginWrites.length === 0, 'hidden field filled: a request was sent');
  check(seen.outside.length === 0, `hidden field filled: requests to other origins: ${seen.outside.join(', ')}`);
  report.push(`hidden field filled: page says "${ending}", requests sent ${site.posts.length - before}`);
  await context.close();
}

/* ------------------------------------------------------ every other page */

// Analytics still starts everywhere else, as it did before. Its requests are
// caught and answered here like any other.
for (const address of ['/?utm_source=local-check', '/about']) {
  const name = address.split('?')[0];
  const { context, page, seen } = await visit(address);
  await page.waitForTimeout(2500);
  const analytics = seen.outside.filter((line) => /posthog\.com/.test(line));
  const holding = await kept(context, page);
  check(analytics.length > 0, `${name}: analytics did not start`);
  if (address.includes('utm_source')) check(holding.session.includes('whoff_utms'), `${name}: the campaign capture did not run`);
  const hosts = [...new Set(analytics.map((line) => new URL(line.split(' ')[1]).host))];
  report.push(`${name}: analytics requests ${analytics.length} (${hosts.join(', ')}), all answered locally. Kept by that page: cookies ${holding.cookies.length}, localStorage ${holding.local.length}, sessionStorage ${holding.session.length}`);
  await context.close();
}

await browser.close();
await site.close();
fs.rmSync(dist, { recursive: true, force: true });

console.log(`\n${report.join('\n')}`);
console.log(`\ndist/ removed (it held the made-up settings). Root: ${rootDir}`);
if (failures.length) {
  console.error(`\nFAILED\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('\nOK: the page asked nothing of any other origin, kept nothing in the browser, and sent one POST with exactly the five fields. Nothing left this machine.');
