/**
 * /products — the developer line + the done-for-you AI receptionist.
 * Listing bar: everything here has a verifiable deliverable behind its
 * checkout (public repo, shipped pack, or live service). De-listed SKUs
 * (trading line, unverified legacy tools) keep their checkout URLs alive
 * on unlisted pages — see /products/archive.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Server, Code2, Package, Layers, Shield, Bot, ChevronRight } from 'lucide-react'
import Newsletter from '../components/Newsletter'
import ComparisonSection from '../components/ComparisonSection'
import KitBreakdown from '../components/KitBreakdown'
import { buildStripeURL } from '../utils/utm'

const categories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'agent', label: 'Done-For-You', icon: Bot },
  { id: 'mcp', label: 'MCP Servers', icon: Server },
  { id: 'skill', label: 'Skills', icon: Code2 },
  { id: 'kit', label: 'Starter Kits', icon: Package },
]

const products = [
  {
    id: 13,
    title: 'AI Receptionist — Done-For-You Setup',
    description:
      'A 24/7 AI receptionist for your business: answers every call, qualifies the job, captures contact details, emails you summaries. Fixed-scope setup: number provisioning, custom greeting + business knowledge, routing rules, and a live test call with you before launch — done within 48 hours. Don\'t take our word for it: call (540) 584-1986 right now and talk to the exact AI you\'d be hiring.',
    category: 'agent',
    price: '$500',
    timeline: 'Setup — $500 one-time',
    buyLink: 'https://buy.stripe.com/cNi7sN6J987H4rB0wJaZi0q',
    buttonLabel: 'Get Set Up',
    featured: true,
  },
  {
    id: 12,
    title: 'Fable 5 Skill Auditor',
    description:
      'Claude Fable 5 dropped June 9 — and Anthropic\'s own docs say skills written for prior models "can degrade output quality" on it. Some legacy patterns now trigger silent refusal-fallbacks or hard API rejections. This CLI scans your .claude/skills against 12 rules grounded in Anthropic\'s migration guide, flags every violation with line numbers, and auto-rewrites flagged skills lean via your local claude CLI. We ran it on our own 31-skill fleet first.',
    category: 'skill',
    price: '$19',
    timeline: 'NEW — Fable 5 ready',
    buyLink: 'https://buy.stripe.com/4gM6oJ6J973D4rBfrDaZi0p',
    demoGif: '/demos/fable5-audit-demo.gif',
    featured: true,
  },
  {
    id: 2,
    title: 'Ship Fast Skill Pack',
    description:
      '11 Claude Code skills for the unfun layer of shipping a SaaS: auth-setup, stripe-payments, deploy-config, api-builder, database-setup, testing-suite, ui-components, email-system, monitoring, seo-meta — plus context-anchor to prevent context drift mid-build. v2.0: rewritten Fable 5-lean per Anthropic\'s migration guide, verified clean by our own auditor (0 findings). Free updates forever. Copy into .claude/commands/ship-fast/ and go.',
    category: 'skill',
    price: '$49',
    timeline: 'v2.0 — Fable 5 ready',
    buyLink: 'https://buy.stripe.com/5kQ4gB7Nd1Jj3nx1ANaZi0a',
    learnMoreLink: '/products/ship-fast-skill-pack',
    demoGif: '/demos/shipfast-demo.gif',
  },
  {
    id: 1,
    title: 'AI SaaS Starter Kit',
    description:
      'Next.js boilerplate for AI SaaS: NextAuth (GitHub + Google OAuth), Stripe billing with 3-tier pricing + customer portal + webhooks, streaming Claude chat with per-plan limits, dashboard, Prisma (SQLite dev / Postgres prod), shadcn/ui-style components, dark mode, full TypeScript. Clone, set your keys, launch.',
    category: 'kit',
    price: '$47',
    timeline: 'Starter Kit — $47',
    buyLink: 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i',
    learnMoreLink: '/products/ai-saas-starter',
  },
  {
    id: 14,
    title: 'context-anchor',
    description:
      'One free skill that stops your agents from starting cold. Drops a compact working reference before handoffs, breaks, or context switches. MIT licensed, no email gate — download it and go.',
    category: 'skill',
    price: 'Free',
    timeline: 'Free — no email gate',
    learnMoreLink: '/free-skill',
  },
  {
    id: 3,
    title: 'AI Prompt Pack',
    description:
      '25 battle-tested Claude Code prompts packaged as slash commands. Drop into .claude/commands/ and use immediately. Includes prompts for architecture review, debugging, code review, test generation, refactoring, and SEO content.',
    category: 'skill',
    price: '$9',
    timeline: '25 prompts — $9',
    buyLink: 'https://buy.stripe.com/dRm3cx8Rh87H6zJgvHaZi0k',
  },
  {
    id: 4,
    title: 'SEO Writer Skill',
    description:
      'One Claude Code skill that rewrites any draft for search intent, keyword density, and linkable structure. Activates on "write SEO content" or "optimize for search."',
    category: 'skill',
    price: '$19',
    timeline: 'Single Skill — $19',
    buyLink: 'https://buy.stripe.com/3cI00lgjJ1Jj8HR5R3aZi0b',
  },
  {
    id: 5,
    title: 'Workflow Automator MCP Server',
    description:
      'Run multi-step workflows as Claude Code tool calls — trigger webhooks, chain API actions, branch on conditions. Perfect for replacing ad-hoc Zapier recipes with something your agent can reason about.',
    category: 'mcp',
    price: '$15',
    timeline: 'MCP Server — $15',
    buyLink: 'https://buy.stripe.com/14AaEZc3t87H4rBgvHaZi0f',
  },
  {
    id: 9,
    title: 'MCP Security Scanner',
    description:
      'Scan any MCP server for unsafe patterns, insecure defaults, and common misconfigurations. One-command scan, JSON output. Free tier covers the basics; Pro adds the advanced ruleset.',
    category: 'mcp',
    price: '$49',
    timeline: 'Scanner — $49',
    buyLink: 'https://buy.stripe.com/00w00ld7x3Rr3nx4MZaZi0d',
  },
  {
    id: 10,
    title: 'MCP Security Scanner Pro',
    description:
      'The Pro tier of MCP Security Scanner — full ruleset, priority signatures, and integration-ready reports. Same install, richer findings. For teams scanning at scale.',
    category: 'mcp',
    price: '$149',
    timeline: 'Pro Tier — $149',
    buyLink: 'https://buy.stripe.com/3cIaEZ7Nd9bL1fpfrDaZi07',
  },
  {
    id: 11,
    title: 'Grand Slam Offer Generator',
    description:
      'You have a product. You need an offer. Answer 8 questions. Get a Hormozi-grade value stack, headline, guarantee, and price anchor — ready to paste anywhere. 5 minutes. Free. Open source.',
    category: 'skill',
    price: 'Free',
    timeline: 'Start Here — Free',
    githubLink: 'https://github.com/Wh0FF24/grand-slam-offer-generator',
  },
]

const categoryLabels = {
  agent: 'Done-For-You',
  mcp: 'MCP Server',
  skill: 'Skill',
  kit: 'Starter Kit',
}

export default function Products() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter)

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow mb-4">the catalog</p>
          <h1 className="type-h1 mb-4">Developer tools &amp; AI products</h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Skills, MCP servers, and starter kits — extracted from the systems that run this
            studio — plus a done-for-you AI receptionist. Everything here exists, ships today,
            and is used in our own operation.
          </p>
          <Link
            to="/refund-policy"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/[0.03] text-gray-300 text-xs font-semibold tracking-wide hover:border-white/30 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-brand-red-bright" />
            30-day refund on every paid product · no questions asked
          </Link>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                filter === cat.id
                  ? 'bg-white/10 text-white border border-brand-red-bright/40'
                  : 'text-gray-400 hover:text-gray-300 border border-transparent hover:border-white/5'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className={`card-surface ${product.featured ? 'card-surface--featured' : ''} p-7 flex flex-col transition-transform duration-300 hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/[0.05] text-gray-300 border border-white/10">
                      {categoryLabels[product.category]}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-brand-red/10 text-brand-red-bright border border-brand-red-bright/25">
                      {product.timeline}
                    </span>
                  </div>

                  <h3 className="type-h3 text-lg mb-2">{product.title}</h3>
                  {product.demoGif && (
                    <img
                      src={product.demoGif}
                      alt={`${product.title} demo`}
                      loading="lazy"
                      className="rounded-lg border border-white/[0.08] w-full mb-3"
                    />
                  )}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm font-mono">{product.price}</span>
                    <div className="flex flex-col items-end gap-1.5">
                      {product.learnMoreLink && (
                        <Link
                          to={product.learnMoreLink}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          See details <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                      {product.buyLink ? (
                        <>
                          <a
                            href={product.buyLink?.startsWith('https://buy.stripe.com') ? buildStripeURL(product.buyLink) : product.buyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-sm font-semibold text-white bg-brand-red hover:brightness-110 transition-all duration-200 cursor-pointer px-4 py-2.5 rounded-lg whitespace-nowrap"
                          >
                            {product.buttonLabel ? `${product.buttonLabel} →` : `Get it — ${product.price} →`}
                          </a>
                          {product.buyLink.startsWith('https://buy.stripe.com') && (
                            <Link to="/refund-policy" className="text-[11px] text-gray-500 hover:text-gray-400 transition-colors">
                              Instant delivery · 30-day refund
                            </Link>
                          )}
                        </>
                      ) : product.githubLink ? (
                        <a
                          href={product.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                          Get on GitHub &rarr;
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <KitBreakdown />
        <ComparisonSection />
        <Newsletter />
      </div>
    </div>
  )
}
