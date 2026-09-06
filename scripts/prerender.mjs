/**
 * Vite SSR prerender — runs after `npm run build` to generate static HTML
 * for every route so crawlers see real content instead of the empty SPA
 * shell, plus dist/sitemap.xml generated from the same routeMeta (single
 * source of truth — no phantom URLs).
 *
 * How it works:
 *   1. Build a Node-compatible SSR bundle from src/entry-server.jsx
 *   2. Read dist/index.html (the client build template with hashed asset refs)
 *   3. For each route: call render(url), inject HTML into template, write dist/{route}/index.html
 *   4. Write dist/sitemap.xml from routeMeta (entries with sitemap: false are
 *      prerendered but not advertised to crawlers — unlisted pages)
 *   5. Clean up the SSR bundle
 *
 * Amplify serves static files before applying the catch-all rewrite rule, so
 * dist/products/ship-fast-skill-pack/index.html is served directly to crawlers.
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import { routeMeta } from '../src/data/routeMeta.js'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

/**
 * Real recent commit subjects for the ops tape — same logic as the
 * getOpsLines() in vite.config.js (this SSR build has its own independent
 * define block, so both must define __OPS_LINES__ — keep them in sync).
 * Conventional-commit subjects only; housekeeping/meta lines are dropped so
 * internal cleanup language never renders on the site. Returns [] whenever
 * git history is unavailable (e.g. a shallow CI clone).
 */
function getOpsLines() {
  try {
    return execSync('git log -12 --format=%s', { encoding: 'utf8', cwd: rootDir })
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => /^(feat|fix|perf|style|docs|chore):/.test(s))
      .filter((s) => !/honest|fabricat|purge|remove/i.test(s))
      .slice(0, 4)
  } catch {
    return []
  }
}

const SITE = 'https://whoffagents.com'


const routes = Object.keys(routeMeta)
const serverOutDir = path.join(rootDir, 'dist/server')

// react-router-dom v7 removed `./server` sub-path export.
// StaticRouter lives in react-router's react-server bundle.
// We alias the missing sub-path so the SSR entry still resolves it.
const rrServerEntry = path.join(
  rootDir,
  'node_modules/react-router/dist/production/index-react-server.mjs'
)

// --- 1. Build SSR bundle ---
console.log('▶ Building SSR bundle...')
await build({
  configFile: false,
  root: rootDir,
  plugins: [react()],
  resolve: {
    alias: {
      'react-router-dom/server': rrServerEntry,
    },
  },
  define: {
    'import.meta.env.SSR': true,
    'import.meta.env.PROD': true,
    'import.meta.env.DEV': false,
    'import.meta.env.MODE': '"production"',
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    __OPS_LINES__: JSON.stringify(getOpsLines()),
  },
  build: {
    ssr: path.join(rootDir, 'src/entry-server.jsx'),
    outDir: serverOutDir,
    rollupOptions: {
      output: { format: 'esm' },
    },
  },
})

// --- 2. Read client build template ---
const template = fs.readFileSync(path.join(rootDir, 'dist/index.html'), 'utf-8')

// --- 3. Load render function (file:// URL so Windows dev machines work too) ---
const ssrEntry = path.join(serverOutDir, 'entry-server.js')
const { render } = await import(pathToFileURL(ssrEntry).href)

// --- 4. Render each route ---
let ok = 0
let failed = 0

for (const route of routes) {
  try {
    const appHtml = render(route)
    const meta = routeMeta[route]
    const canonical = route === '/' ? SITE : `${SITE}${route}`

    const html = template
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
      .replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${meta.description}"`
      )
      .replace(
        /<meta property="og:title" content="[^"]*"/,
        `<meta property="og:title" content="${meta.title}"`
      )
      .replace(
        /<meta property="og:description" content="[^"]*"/,
        `<meta property="og:description" content="${meta.description}"`
      )
      .replace(
        /<meta property="og:url" content="[^"]*"/,
        `<meta property="og:url" content="${canonical}"`
      )
      .replace(
        /<link rel="canonical" href="[^"]*"/,
        `<link rel="canonical" href="${canonical}"`
      )

    const outDir =
      route === '/' ? path.join(rootDir, 'dist') : path.join(rootDir, 'dist', route)

    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html)

    console.log(`  ✓ dist${route === '/' ? '/index.html' : route + '/index.html'}`)
    ok++
  } catch (err) {
    console.error(`  ✗ ${route} — ${err.message}`)
    failed++
  }
}

// --- 5. Generate sitemap.xml from the same routeMeta ---
const today = new Date().toISOString().slice(0, 10)
const sitemapRoutes = routes.filter((r) => routeMeta[r].sitemap !== false)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map((r) => {
    const loc = r === '/' ? `${SITE}/` : `${SITE}${r}`
    const priority = r === '/' ? '1.0' : r === '/web' || r === '/agents' || r === '/products' ? '0.9' : '0.7'
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(rootDir, 'dist/sitemap.xml'), sitemap)
console.log(`  ✓ dist/sitemap.xml (${sitemapRoutes.length} URLs)`)

// --- 6. Clean up SSR bundle ---
fs.rmSync(serverOutDir, { recursive: true, force: true })

console.log(`\nPrerender complete — ${ok} routes OK${failed ? `, ${failed} failed` : ''}.`)
if (failed > 0) process.exit(1)
