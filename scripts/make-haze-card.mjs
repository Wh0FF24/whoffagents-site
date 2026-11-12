// Draw the link-preview picture for /haze: public/og-haze.png, 1200 by 630.
//   node scripts/make-haze-card.mjs [output file] [words file]
//
// The picture is the page's own opening, drawn still: the same points as the
// opening figure (src/components/haze/hazeData.js), the page's colors and its
// own font. Every word on it is taken from the page as it is published: the
// name, the label, the headline and the button (scripts/haze-card-words.mjs).
// Change the page's wording and this picture has to be drawn again.
//
// To try other wording without touching the page, pass a second argument: a
// JSON file holding any of the same keys. That is for looking only. The file
// that ships is drawn from the words the tests check against the page.
//
// Nothing is fetched: the font is read from public/fonts and placed in the
// page as data, and the page is built here as a string.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { FAR_DISCS, MIST_POINTS, PROFILE_POINTS } from '../src/components/haze/hazeData.js';
import { CARD, WORDS, headlineText } from './haze-card-words.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [target = path.join(root, 'public', 'og-haze.png'), wordsFile] = process.argv.slice(2);
const words = wordsFile ? { ...WORDS, ...JSON.parse(fs.readFileSync(wordsFile, 'utf8')) } : WORDS;

const escape = (text) => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const lines = (text) => escape(text).split(String.fromCharCode(10)).join('<br>');
const headline = words.headline
  .map((part) => (part.soft ? `<span>${lines(part.text)}</span>` : lines(part.text)))
  .join('');
// A longer headline is set a little smaller, so it still sits beside the figure.
const length = headlineText(words).length;
const size = length <= 36 ? 72 : length <= 46 ? 64 : 56;

const font = fs.readFileSync(path.join(root, 'public', 'fonts', 'archivo-var-latin.woff2')).toString('base64');

const far = FAR_DISCS.map((d) => `<circle cx="${d.x}" cy="${d.y}" r="${d.r}" fill="url(#disc)" opacity="${d.o}"/>`).join('');
const mist = MIST_POINTS.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="url(#mist)" opacity="${p.o}"/>`).join('');
const soft = PROFILE_POINTS.map((p) => `<circle cx="${p.softX}" cy="${p.softY}" r="${p.softR}" fill="url(#soft)" opacity="${p.softO}"/>`).join('');
const sharp = PROFILE_POINTS.map(
  (p) => `<circle cx="${p.x}" cy="${p.y}" r="${p.edge ? 2.1 : 1.5}" fill="${p.edge ? '#f4f7fb' : '#c9d2dd'}" opacity="${p.edge ? 1 : 0.82}"/>`,
).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "Archivo";
    font-style: normal;
    font-weight: 100 900;
    src: url(data:font/woff2;base64,${font}) format("woff2");
  }
  html, body { margin: 0; }
  body {
    position: relative;
    width: ${CARD.width}px;
    height: ${CARD.height}px;
    overflow: hidden;
    background: #030506;
    color: #f1f4f8;
    font-family: "Archivo", system-ui, sans-serif;
  }
  .bloom {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 58% 78% at 76% 50%, #0442ae5c, #0442ae00 70%),
      radial-gradient(ellipse 50% 50% at 6% 104%, #0442ae33, #0442ae00 70%);
  }
  .figure {
    position: absolute;
    top: 25px;
    right: 22px;
    width: 580px;
    height: 580px;
  }
  .figure svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .copy {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 76px;
    width: 660px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .name {
    position: absolute;
    top: 58px;
    left: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 30px;
    font-weight: 620;
    letter-spacing: 0.01em;
  }
  .name::before {
    content: "";
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: radial-gradient(circle, #dbe7ff 0 16%, #6f9bff 42%, #2f6be800 72%);
  }
  .label {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 26px;
    color: #c2d0ec;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .label::before {
    content: "";
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #8fb3ff;
    box-shadow: 0 0 14px #2f6be8;
  }
  h1 {
    margin: 0;
    font-size: ${size}px;
    font-weight: 520;
    letter-spacing: -0.034em;
    line-height: 1.04;
    word-spacing: 0.04em;
  }
  h1 span {
    color: #e6eeff;
    text-shadow: 0 0 0.14em #8fb3ffd9, 0 0 0.5em #2f6be8b3;
  }
  .button {
    align-self: flex-start;
    margin-top: 40px;
    padding: 17px 34px;
    border: 1px solid #2f6be8;
    border-radius: 999px;
    background: #0442ae;
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0.005em;
  }
</style>
</head>
<body>
  <div class="bloom"></div>
  <div class="figure">
    <svg viewBox="0 0 400 400">
      <defs>
        <radialGradient id="disc">
          <stop offset="0" stop-color="#5b8cff" stop-opacity="1"/>
          <stop offset="0.6" stop-color="#2f6be8" stop-opacity="0.5"/>
          <stop offset="1" stop-color="#0442ae" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="soft">
          <stop offset="0" stop-color="#f1f5fb" stop-opacity="0.95"/>
          <stop offset="0.45" stop-color="#c9d6ea" stop-opacity="0.4"/>
          <stop offset="1" stop-color="#c9d6ea" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="mist">
          <stop offset="0" stop-color="#9dbcff" stop-opacity="0.95"/>
          <stop offset="0.45" stop-color="#4f83f5" stop-opacity="0.42"/>
          <stop offset="1" stop-color="#2f6be8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <g opacity="0.55">${far}</g>
      <g opacity="0.9">${mist}</g>
      <g opacity="0.42">${soft}</g>
      <g opacity="0.92">${sharp}</g>
    </svg>
  </div>
  <div class="copy">
    <div class="name">${escape(words.name)}</div>
    <div class="label">${escape(words.label)}</div>
    <h1>${headline}</h1>
    <div class="button">${escape(words.button)}</div>
  </div>
</body>
</html>`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport: CARD, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const asked = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('data:') && request.url() !== 'about:blank') asked.push(request.url());
  });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const face = await page.evaluate(() => document.fonts.check('520 72px "Archivo"'));
  if (!face) throw new Error('The page font did not load, so the picture would be drawn in a fallback font.');
  if (asked.length) throw new Error(`The picture asked for outside files: ${asked.join(', ')}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  await page.screenshot({ path: target, clip: { x: 0, y: 0, ...CARD }, type: 'png' });
  console.log(`Wrote ${path.relative(root, target)} (${CARD.width} by ${CARD.height}).`);
} finally {
  await browser.close();
}
