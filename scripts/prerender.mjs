/**
 * Vite SSR prerender — runs after `npm run build` to generate static HTML
 * for key routes so Googlebot sees real content instead of the empty SPA shell.
 *
 * How it works:
 *   1. Build a Node-compatible SSR bundle from src/entry-server.jsx
 *   2. Read dist/index.html (the client build template with hashed asset refs)
 *   3. For each route: call render(url), inject HTML into template, write dist/{route}/index.html
 *   4. Clean up the SSR bundle
 *
 * Amplify serves static files before applying the catch-all rewrite rule, so
 * dist/products/ship-fast-skill-pack/index.html is served directly to crawlers.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const routeMeta = {
  '/': {
    title: 'Whoff Agents | AI Employees for Home-Service Businesses',
    description: 'Hire an AI Lead Qualification Agent that answers every inbound call, qualifies the job, and books appointments — 24/7. $99/mo.',
    canonical: 'https://whoffagents.com',
  },
  '/products': {
    title: 'Products | Whoff Agents',
    description: 'AI tools, skill packs, and automation agents built for SaaS founders and service businesses.',
    canonical: 'https://whoffagents.com/products',
  },
  '/products/ship-fast-skill-pack': {
    title: 'Ship Fast Skill Pack | Whoff Agents',
    description: '10 Claude Code skills for auth, Stripe, databases, email, and deploy — ship your SaaS faster. One-time $49, lifetime updates.',
    canonical: 'https://whoffagents.com/products/ship-fast-skill-pack',
  },
  '/products/crypto-data-mcp': {
    title: 'Crypto Data MCP | Whoff Agents',
    description: 'Real-time crypto price and market data MCP server for Claude Code. Free on GitHub.',
    canonical: 'https://whoffagents.com/products/crypto-data-mcp',
  },
  '/atlas/ops': {
    title: 'Atlas Ops | Whoff Agents',
    description: 'Atlas AI operations dashboard.',
    canonical: 'https://whoffagents.com/atlas/ops',
  },
  '/blog': {
    title: 'Blog | Whoff Agents',
    description: 'Insights on AI agents, automation, and building SaaS with Claude.',
    canonical: 'https://whoffagents.com/blog',
  },
  '/about': {
    title: 'About | Whoff Agents',
    description: 'The story behind Whoff Agents and Atlas, our AI-run business.',
    canonical: 'https://whoffagents.com/about',
  },
  '/web': {
    title: 'Web Design in Provo, Utah | Whoff Web Studio',
    description: 'Modern, fast websites for Utah County businesses. Flat pricing from $1,500, live in days — not months. Built by Whoff Web Studio, part of Whoff Agents.',
    canonical: 'https://whoffagents.com/web',
  },
  '/privacy': {
    title: 'Privacy Policy | Whoff Agents',
    description: 'How Whoff Agents LLC collects, uses, and protects your information.',
    canonical: 'https://whoffagents.com/privacy',
  },
  '/terms': {
    title: 'Terms of Service | Whoff Agents',
    description: 'The terms governing use of whoffagents.com and Whoff Agents LLC products and services.',
    canonical: 'https://whoffagents.com/terms',
  },
}

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

// --- 3. Load render function ---
const ssrEntry = path.join(serverOutDir, 'entry-server.js')
const { render } = await import(ssrEntry)

// --- 4. Render each route ---
let ok = 0
let failed = 0

for (const route of routes) {
  try {
    const appHtml = render(route)
    const meta = routeMeta[route]

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
        /<link rel="canonical" href="[^"]*"/,
        `<link rel="canonical" href="${meta.canonical}"`
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

// --- 5. Clean up SSR bundle ---
fs.rmSync(serverOutDir, { recursive: true, force: true })

console.log(`\nPrerender complete — ${ok} routes OK${failed ? `, ${failed} failed` : ''}.`)
if (failed > 0) process.exit(1)
