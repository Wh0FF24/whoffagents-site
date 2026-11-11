// Local helpers for checking the /haze page: build the site with a given set
// of build-time settings, and serve a build from this machine only.
// Used by scripts/check-haze-privacy.mjs and tests/haze.spec.js.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Settings that decide what a build does. Every one is set here, so a build
// never picks them up from the shell or from a local env file by accident.
const SETTINGS = ['VITE_PRIVATE_PREVIEW', 'VITE_HAZE_WAITLIST_ENDPOINT', 'VITE_POSTHOG_KEY', 'VITE_CONTACT_ENDPOINT'];

function run(args, env) {
  const result = spawnSync(process.execPath, args, { cwd: rootDir, env, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`build step failed: node ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  }
}

// Build the site. With `prerender` the result is the same as `npm run build`
// and lands in dist/. Without it, only the browser bundle is built, into
// `outDir`, which is enough to exercise the page's scripts.
export function buildSite({ settings = {}, outDir = 'dist', prerender = false }) {
  const env = { ...process.env };
  for (const name of SETTINGS) env[name] = settings[name] ?? '';
  if (prerender && outDir !== 'dist') throw new Error('the prerender step writes to dist/ only');
  run([path.join(rootDir, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', outDir, '--emptyOutDir', '--logLevel', 'warn'], env);
  if (prerender) run([path.join(rootDir, 'scripts/prerender.mjs')], env);
  return path.resolve(rootDir, outDir);
}

const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
};

// Serve a build on 127.0.0.1. An address with no file extension gets that
// route's own page where the build has one, and the site's shell otherwise,
// which is how the host answers. A POST is never passed on anywhere: it is
// recorded, and answered by `answer` (a status and a body), or refused.
export function serveSite({ dir, port, answer }) {
  const posts = [];
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    if (request.method === 'POST') {
      let body = '';
      request.setEncoding('utf8');
      request.on('data', (chunk) => {
        body += chunk;
      });
      request.on('end', () => {
        posts.push({ path: url.pathname, headers: request.headers, body });
        const reply = answer?.(url.pathname) ?? { status: 404 };
        response.writeHead(reply.status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        response.end(reply.body ?? '{}');
      });
      return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405);
      response.end();
      return;
    }
    let asked;
    try {
      asked = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400);
      response.end();
      return;
    }
    const inside = (file) => (file.startsWith(dir + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile() ? file : null);
    const relative = asked.replace(/^\/+|\/+$/g, '');
    const file = path.extname(relative)
      ? inside(path.join(dir, relative))
      : inside(path.join(dir, relative, 'index.html')) ?? inside(path.join(dir, 'index.html'));
    if (!file) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(file).pipe(response);
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      resolve({
        origin: `http://127.0.0.1:${port}`,
        posts,
        close: () => new Promise((done) => {
          server.closeAllConnections?.();
          server.close(() => done());
        }),
      });
    });
  });
}
