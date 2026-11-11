// Check what the Eidolon request form would send in a LIVE build, without
// sending it.
//   npm run build            (no VITE_PRIVATE_PREVIEW: the live transport)
//   npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
//   node scripts/check-eidolon-request.mjs http://127.0.0.1:4174/eidolon
//
// Nothing leaves this machine:
//  - the script only runs against a loopback address;
//  - the browser resolves every host name to this machine, so a request that
//    slipped past the script would find nothing listening;
//  - every request to another origin is answered here, by the script, and
//    never passed on. The lead form's reply is opaque to the page anyway.
// The fields below are the ones the downstream lead pipeline reads (see
// src/components/studio/StudioSections.jsx). This check fails if the form
// stops sending exactly those.
import { chromium } from '@playwright/test';
import process from 'node:process';

const [url = 'http://127.0.0.1:4174/eidolon'] = process.argv.slice(2);
const target = new URL(url);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname)) {
  console.error('Refusing to run: this check only runs against a local preview.');
  process.exit(2);
}

const LEAD_FORM = 'https://whoff-web-studio.netlify.app/';
const FIELDS = ['form-name', 'bot-field', 'business_name', 'name', 'phone', 'email', 'current_website', 'needs'];
const CASES = [
  { choose: 'A pilot conversation', tag: '[Eidolon pilot] ', reply: 'Email' },
  { choose: 'Progress updates', tag: '[Eidolon updates] ', reply: 'Phone' },
];

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--host-resolver-rules=MAP * 127.0.0.1'],
});
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

for (const item of CASES) {
  const context = await browser.newContext();
  const sent = [];
  const refused = [];
  await context.route('**/*', (route) => {
    const request = route.request();
    if (request.url().startsWith(target.origin)) {
      // The site itself: pages and assets only, never a write.
      return request.method() === 'GET' ? route.continue() : route.abort();
    }
    if (request.url() === LEAD_FORM && request.method() === 'POST') {
      sent.push({ headers: request.headers(), body: request.postData() || '' });
      return route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
    }
    refused.push(`${request.method()} ${request.url()}`);
    return route.abort();
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const form = page.locator('#request form.iq-form');
  expect(await form.locator('.iq-preview-note').count() === 0, 'this is a preview build: rebuild without VITE_PRIVATE_PREVIEW');
  await form.getByText(item.choose, { exact: true }).click();
  await form.getByLabel('Name', { exact: true }).fill('Local check');
  await form.getByLabel('Organization', { exact: true }).fill('Example organization');
  if (item.reply === 'Phone') {
    await form.getByRole('button', { name: 'Phone', exact: true }).click();
    await form.getByLabel('Phone', { exact: true }).fill('local check only');
  } else {
    await form.getByLabel('Email', { exact: true }).fill('local-check@example.com');
  }
  await form.locator('textarea').fill('Local check of the request form. Not a real request.');
  await form.getByRole('button', { name: 'Send request' }).click();
  await page.waitForTimeout(1500);
  const status = (await form.getByRole('status').textContent()) || '';

  expect(sent.length === 1, `${item.choose}: expected one request to the lead form, saw ${sent.length}`);
  if (sent.length) {
    const fields = new URLSearchParams(sent[0].body);
    const names = [...fields.keys()];
    expect(JSON.stringify(names) === JSON.stringify(FIELDS), `${item.choose}: field names ${names.join(', ')}`);
    expect((sent[0].headers['content-type'] || '').startsWith('application/x-www-form-urlencoded'), `${item.choose}: content type ${sent[0].headers['content-type']}`);
    expect(fields.get('form-name') === 'lead', `${item.choose}: form-name ${fields.get('form-name')}`);
    expect(fields.get('business_name') === 'Example organization', `${item.choose}: business_name ${fields.get('business_name')}`);
    expect((fields.get('needs') || '').startsWith(item.tag), `${item.choose}: needs starts ${JSON.stringify((fields.get('needs') || '').slice(0, 24))}`);
    expect((fields.get('needs') || '').endsWith(`Preferred reply: ${item.reply}`), `${item.choose}: needs ends ${JSON.stringify((fields.get('needs') || '').slice(-28))}`);
    expect(item.reply === 'Phone' ? fields.get('email') === '' && fields.get('phone') !== '' : fields.get('phone') === '' && fields.get('email') !== '', `${item.choose}: reply field`);
    console.log(`${item.choose}:`);
    for (const [name, value] of fields) console.log(`  ${name} = ${JSON.stringify(value)}`);
  }
  expect(status.startsWith('Sent. Requests are reviewed before any reply.'), `${item.choose}: status ${JSON.stringify(status)}`);
  expect(!/one business day/.test(status) && !status.includes(String.fromCharCode(0x2014)), `${item.choose}: status wording ${JSON.stringify(status)}`);
  console.log(`  status shown = ${JSON.stringify(status)}`);
  console.log(`  other requests refused = ${refused.length}`);
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error(`\nFAILED\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('\nOK: the form sends exactly the fields the lead pipeline reads, and nothing was sent.');
