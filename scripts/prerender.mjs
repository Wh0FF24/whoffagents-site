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
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const SITE = 'https://whoffagents.com'

const routeMeta = {
  '/': {
    title: 'Whoff Agents | Web Design, AI Agents & Developer Tools — Provo, Utah',
    description: 'An AI-operated studio in Provo, Utah. Custom web design for local businesses — live in days, flat pricing from $1,500 — plus custom AI agents and developer tools. Agents build; a human reviews everything.',
  },
  '/web': {
    title: 'Web Design in Provo, Utah | Whoff Web Studio',
    description: 'Custom web design for Utah County businesses. Mobile-first, 95+ Google speed scores, flat pricing from $1,500, live in days — not months. 30-day money-back guarantee.',
  },
  '/agents': {
    title: 'Custom AI Agents for Your Business | Whoff Agents',
    description: 'AI agents that answer your phones, triage your email, and run your back-office routines — built by a studio that runs on its own agents. Scoped per project. Call (540) 584-1986 to hear one live.',
  },
  '/products': {
    title: 'Developer Tools & AI Products | Whoff Agents',
    description: 'Claude Code skills, MCP servers, and starter kits extracted from a working AI-operated studio — plus a done-for-you AI receptionist. One-time prices, 30-day refunds.',
  },
  '/products/ship-fast-skill-pack': {
    title: 'Ship Fast Skill Pack | Whoff Agents',
    description: '11 Claude Code skills for auth, Stripe, databases, email, and deploy — ship your SaaS faster. One-time $49, free updates forever.',
  },
  '/products/ai-saas-starter': {
    title: 'AI SaaS Starter Kit | Whoff Agents',
    description: 'Next.js boilerplate for AI SaaS: NextAuth OAuth, Stripe billing with webhooks, streaming Claude chat with per-plan limits, Prisma, full TypeScript. One-time $47.',
  },
  '/products/ai-prompt-pack': {
    title: 'AI Prompt Pack | Whoff Agents',
    description: '25 battle-tested Claude Code prompts packaged as slash commands — architecture review, debugging, refactoring, test generation. One-time $9.',
  },
  '/products/crypto-data-mcp': {
    title: 'Crypto Data MCP Server | Whoff Agents',
    description: 'Real-time crypto price and market data MCP server for Claude Code. Free and open source, with an optional Pro tier.',
    sitemap: false, // unlisted — trading line de-listed, checkout stays live
  },
  '/products/trading-signals-mcp': {
    title: 'Trading Signals MCP Server | Whoff Agents',
    description: 'An MCP server for volatility classification, signal detection, and price-history pulls in Claude Code. Unlisted; checkout remains live.',
    sitemap: false, // unlisted — trading line de-listed, checkout stays live
  },
  '/products/archive': {
    title: 'Product Archive | Whoff Agents',
    description: 'De-listed products whose checkout links remain live and honored. 30-day refund applies to every purchase.',
    sitemap: false, // unlisted by design
  },
  '/free-skill': {
    title: 'Free Claude Code Skill: context-anchor | Whoff Agents',
    description: 'A free MIT-licensed Claude Code skill that stops agents from starting cold after handoffs and breaks. Direct download, no email gate.',
  },
  '/learn-more': {
    title: 'AI SaaS Starter Kit — The Full Breakdown | Whoff Agents',
    description: 'Everything inside the AI SaaS Starter Kit: NextAuth, Stripe billing, streaming Claude chat, Prisma — and the integration failures it saves you from. $47 one-time.',
  },
  '/blog': {
    title: 'Blog | Whoff Agents',
    description: 'Build logs from an AI-operated studio: what our agents shipped, what broke, and the Claude Code patterns that survived production.',
  },
  '/blog/why-an-ai-runs-this-business': {
    title: 'Why an AI Runs This Business | Whoff Agents Blog',
    description: 'The build log that started it: how Atlas, an AI agent, came to run the day-to-day of a real company — and what that experiment is for.',
  },
  '/blog/introducing-crypto-data-mcp': {
    title: 'Introducing Crypto Data MCP | Whoff Agents Blog',
    description: 'Build log: shipping a real-time crypto data MCP server for Claude Code, and what we learned doing it.',
  },
  '/about': {
    title: 'About | Whoff Agents',
    description: 'The story behind Whoff Agents: an AI-operated studio in Provo, Utah where agents do the building and a human reviews everything that ships.',
  },
  '/atlas/ops': {
    title: 'Atlas Ops — Live Operating Log | Whoff Agents',
    description: "Atlas is the AI that runs Whoff Agents' day-to-day. This page is its live operating log: real numbers, real decisions, and every human override.",
  },
  '/thank-you': {
    title: 'Thank You | Whoff Agents',
    description: 'Your download is ready — plus what to do next.',
    sitemap: false, // post-action page, not a landing page
  },
  '/refund-policy': {
    title: 'Refund Policy | Whoff Agents',
    description: '30-day refund on every paid product, no questions asked. The full policy in plain English.',
  },
  '/privacy': {
    title: 'Privacy Policy | Whoff Agents',
    description: 'How Whoff Agents LLC collects, uses, and protects your information.',
  },
  '/terms': {
    title: 'Terms of Service | Whoff Agents',
    description: 'The terms governing use of whoffagents.com and Whoff Agents LLC products and services.',
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
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
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
