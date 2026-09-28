import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { routeMeta } from '../src/data/routeMeta.js';

const baseline = 'a27b8926cd0fed0aa5a15117200995f3811385a0';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const baselineMeta = git('show', `${baseline}:src/data/routeMeta.js`);
const oldRoutes = [...baselineMeta.matchAll(/^  "(\/[^\"]*)": \{/gm)].map(match => match[1]);
const routes = Object.keys(routeMeta);
const errors = [];
for (const route of oldRoutes) if (!routes.includes(route)) errors.push(`Missing original route: ${route}`);
const oldAssets = git('ls-tree', '-r', '--name-only', baseline, 'public').trim().split('\n');
for (const asset of oldAssets) {
  if (!fs.existsSync(asset)) errors.push(`Missing original asset: ${asset}`);
  else if (git('hash-object', asset).trim() !== git('rev-parse', `${baseline}:${asset}`).trim()) errors.push(`Changed original asset: ${asset}`);
}
for (const file of ['src/data/products.js', 'src/components/InquiryForm.jsx', 'amplify.yml', 'public/_headers', 'public/robots.txt']) {
  if (git('diff', baseline, '--', file).length) errors.push(`Preserved contract changed: ${file}`);
}
const htmlFor = route => fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');
const documents = new Map(routes.map(route => [route, htmlFor(route)]));
const localDestinations = new Set();
const brokenAnchors = new Set();
for (const [route, html] of documents) {
  if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`Expected one h1: ${route}`);
  if (!html.includes('name="robots" content="noindex, nofollow"')) errors.push(`Missing preview noindex: ${route}`);
  for (const match of html.matchAll(/href="([^\"]+)"/g)) {
    const target = new URL(match[1].replaceAll('&amp;', '&'), `https://whoffagents.com${route}`);
    if (target.origin !== 'https://whoffagents.com') continue;
    localDestinations.add(target.pathname);
    if (!routes.includes(target.pathname) && !fs.existsSync(path.join('dist', target.pathname))) errors.push(`Broken link from ${route}: ${target.pathname}`);
    if (target.hash && documents.has(target.pathname)) {
      const targetHtml = documents.get(target.pathname);
      const id = decodeURIComponent(target.hash.slice(1));
      if (!targetHtml.includes(`id="${id}"`)) brokenAnchors.add(`${route} -> ${target.pathname}${target.hash}`);
    }
  }
}
errors.push(...[...brokenAnchors].map(target => `Missing anchor: ${target}`));
const report = { baseline, originalRoutes: oldRoutes.length, currentRoutes: routes.length, preservedAssets: oldAssets.length, localDestinations: localDestinations.size, errors };
fs.mkdirSync('test-results', { recursive: true });
fs.writeFileSync('test-results/preservation-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
