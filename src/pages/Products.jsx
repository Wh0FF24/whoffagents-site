import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Server, Code2, Package, Layers, Shield, Bot } from 'lucide-react'
import Newsletter from '../components/Newsletter'
import ComparisonSection from '../components/ComparisonSection'
import KitBreakdown from '../components/KitBreakdown'
import { buildStripeURL } from '../utils/utm'

const categories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'agent', label: 'AI Employees', icon: Bot },
  { id: 'mcp', label: 'MCP Servers', icon: Server },
  { id: 'skill', label: 'Skills', icon: Code2 },
  { id: 'kit', label: 'Starter Kits', icon: Package },
]

const verticalTiers = [
  { vertical: 'Home Services', sub: 'HVAC · Plumbing · Electrical · Pest Control', price: '$99–299/mo', status: 'active' },
  { vertical: 'Real Estate', sub: 'Agents · Property Mgmt', price: '$149–499/mo', status: 'soon' },
  { vertical: 'Financial Services', sub: 'Advisors · Mortgage', price: '$299–999/mo', status: 'soon' },
  { vertical: 'Legal', sub: 'Law Firms · Solo Practitioners', price: '$500–2K/mo', status: 'soon' },
]

const products = [
  {
    id: 0,
    title: 'Lead Qualification Agent',
    description:
      'Your 24/7 AI employee answers every inbound call, qualifies the job type and budget, and books the appointment directly into your calendar. Built for HVAC, plumbing, electrical, and pest control. If it doesn\'t save you 10 hours in week 1, we refund you. Add-on: CRM sync + follow-up drip — $159/mo.',
    category: 'agent',
    price: '$99/mo',
    accent: 'red',
    timeline: 'Hire Now — $99/mo',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    buyLink: '/products',
    featured: true,
  },
  {
    id: 1,
    title: 'Atlas Starter Kit',
    description:
      'PAX Protocol handoffs that stop context drift. Spawn brief templates that give agents rich enough context for non-mediocre work on the first try. Human-in-the-loop gates at every destructive action. Versioned PLAN.md vault so every session builds on the last. The exact system running whoffagents.com — packaged and readable. Launch price: $47. Goes to $97 on April 22.',
    category: 'kit',
    price: '$47',
    accent: 'gold',
    timeline: 'Launch Price — $47',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    buyLink: 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i',
  },
  {
    id: 2,
    title: 'Ship Fast Skill Pack',
    description:
      '10 Claude Code skills for the unfun layer of shipping a SaaS: auth-patterns, stripe-payments, testing-suite, api-routes, deploy-config, db-migrations, env-config, monitoring, seo-meta, error-handling. Each activates on keyword match. Drop into .claude/skills/ and go.',
    category: 'skill',
    price: '$49',
    accent: 'gold',
    timeline: '10 skills — $49',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    buyLink: 'https://buy.stripe.com/5kQ4gB7Nd1Jj3nx1ANaZi0a',
  },
  {
    id: 3,
    title: 'AI Prompt Pack',
    description:
      '25 battle-tested Claude Code prompts packaged as slash commands. Drop into .claude/commands/ and use immediately. Includes prompts for architecture review, debugging, code review, test generation, refactoring, and SEO content.',
    category: 'skill',
    price: '$9',
    accent: 'blue',
    timeline: '25 prompts — $9',
    timelineBadgeClass: 'bg-brand-blue/20 text-white border border-brand-blue/30',
    buyLink: 'https://buy.stripe.com/dRm3cx8Rh87H6zJgvHaZi0k',
  },
  {
    id: 4,
    title: 'SEO Writer Skill',
    description:
      'One Claude Code skill that rewrites any draft for search intent, keyword density, and linkable structure. Activates on "write SEO content" or "optimize for search." Ships with proven patterns from 100+ published dev.to articles.',
    category: 'skill',
    price: '$19',
    accent: 'blue',
    timeline: 'Single Skill — $19',
    timelineBadgeClass: 'bg-brand-blue/20 text-white border border-brand-blue/30',
    buyLink: 'https://buy.stripe.com/3cI00lgjJ1Jj8HR5R3aZi0b',
  },
  {
    id: 5,
    title: 'Workflow Automator MCP Server',
    description:
      'Run multi-step workflows as Claude Code tool calls — trigger webhooks, chain API actions, branch on conditions. Perfect for replacing ad-hoc Zapier recipes with something your agent can reason about.',
    category: 'mcp',
    price: '$15',
    accent: 'red',
    timeline: 'MCP Server — $15',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    buyLink: 'https://buy.stripe.com/14AaEZc3t87H4rBgvHaZi0f',
  },
  {
    id: 6,
    title: 'Crypto Data MCP Server',
    description:
      'Real-time on-chain data, price feeds, and DeFi analytics piped directly into Claude Code. Query any chain, any token, via MCP tool calls. Powers the trading dashboards running on whoffagents infra.',
    category: 'mcp',
    price: '$19',
    accent: 'red',
    timeline: 'MCP Server — $19',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    buyLink: 'https://buy.stripe.com/8x26oJ6J9gEd7DN4MZaZi03',
  },
  {
    id: 7,
    title: 'AI Content Repurposer',
    description:
      'Feed long-form content in, get Twitter thread, LinkedIn post, and blog variants out. The exact tool used to repurpose the articles on dev.to. CLI-based, swap your LLM key in.',
    category: 'skill',
    price: '$19',
    accent: 'blue',
    timeline: 'CLI Tool — $19',
    timelineBadgeClass: 'bg-brand-blue/20 text-white border border-brand-blue/30',
    buyLink: 'https://buy.stripe.com/6oUeVfd7x0Ff4rB5R3aZi0c',
  },
  {
    id: 8,
    title: 'Trading Signals MCP Server',
    description:
      'Volatility classification, news-triggered signal detection, and price-history pulls piped into Claude Code. Backtested on Polymarket — the core research engine used for agent-driven paper trading.',
    category: 'mcp',
    price: '$29',
    accent: 'red',
    timeline: 'MCP Server — $29',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    buyLink: 'https://buy.stripe.com/28EcN75F5afPcY7bbnaZi0e',
  },
  {
    id: 9,
    title: 'MCP Security Scanner',
    description:
      'Scan any MCP server for unsafe patterns, insecure defaults, and common misconfigurations. One-command scan, JSON output. Free tier covers the basics; Pro adds the advanced ruleset.',
    category: 'mcp',
    price: '$49',
    accent: 'red',
    timeline: 'Scanner — $49',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    buyLink: 'https://buy.stripe.com/00w00ld7x3Rr3nx4MZaZi0d',
  },
  {
    id: 10,
    title: 'MCP Security Scanner Pro',
    description:
      'The Pro tier of MCP Security Scanner — full ruleset, priority signatures, and integration-ready reports. Same install, richer findings. For teams scanning at scale.',
    category: 'mcp',
    price: '$149',
    accent: 'gold',
    timeline: 'Pro Tier — $149',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    buyLink: 'https://buy.stripe.com/3cIaEZ7Nd9bL1fpfrDaZi07',
  },
  {
    id: 11,
    title: 'Grand Slam Offer Generator',
    description:
      'You have a product. You need an offer. Answer 8 questions. Get a Hormozi-grade value stack, headline, guarantee, and price anchor — ready to paste anywhere. 5 minutes. Free. Open source.',
    category: 'skill',
    price: 'Free',
    accent: 'blue',
    timeline: 'Start Here — Free',
    timelineBadgeClass: 'bg-brand-blue/20 text-white border border-brand-blue/30',
    githubLink: 'https://github.com/Wh0FF24/grand-slam-offer-generator',
  },
]

const categoryLabels = {
  agent: 'AI Employee',
  mcp: 'MCP Server',
  skill: 'Skill',
  kit: 'Starter Kit',
}

export default function Products() {
  const [filter, setFilter] = useState('all')
  const location = useLocation()

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter)

  const handleWaitlistClick = (e) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      window.location.href = '/#newsletter'
    } else {
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">AI Employees for Your Business</h1>
          <p className="text-gray-400 max-w-lg mx-auto mb-6">
            Hire an AI employee that works 24/7 — answers leads, qualifies jobs, books appointments.
            Built and operated by Atlas.
          </p>
          {/* Guarantee badge */}
          <Link
            to="/refund-policy"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/40 bg-brand-gold/[0.06] text-brand-gold text-xs font-semibold tracking-wide hover:bg-brand-gold/10 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            First-Month Refund Guarantee · If not 10h saved in week 1, you pay nothing
          </Link>
        </motion.div>

        {/* Vertical pricing tiers */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">What industry are you in?</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {verticalTiers.map((tier) => (
              <div
                key={tier.vertical}
                className={`relative rounded-xl border p-5 transition-all duration-200 ${
                  tier.status === 'active'
                    ? 'border-brand-red/40 bg-brand-red/[0.05] hover:border-brand-red/60'
                    : 'border-white/[0.06] bg-white/[0.02] opacity-60'
                }`}
              >
                {tier.status === 'active' && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">Active</span>
                )}
                {tier.status === 'soon' && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase text-gray-500 bg-white/[0.04] px-2 py-0.5 rounded-full">Coming Soon</span>
                )}
                <p className="text-sm font-bold text-white mb-1">{tier.vertical}</p>
                <p className="text-xs text-gray-500 mb-3">{tier.sub}</p>
                <p className={`text-sm font-semibold ${tier.status === 'active' ? 'text-brand-red' : 'text-gray-600'}`}>{tier.price}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                filter === cat.id
                  ? 'bg-white/10 text-white border border-brand-red/30'
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
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="relative group bg-brand-card border border-brand-border rounded-xl p-8 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Gradient border on hover */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      border: '1px solid transparent',
                      borderImage: 'linear-gradient(135deg, rgba(200,16,46,0.4), rgba(0,98,184,0.3)) 1',
                    }}
                  />

                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        product.accent === 'blue'
                          ? 'bg-brand-blue/20 text-white border border-brand-blue/30'
                          : product.accent === 'red'
                          ? 'bg-brand-red/10 text-brand-red border border-brand-red/20'
                          : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                      }`}
                    >
                      {categoryLabels[product.category]}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.timelineBadgeClass || 'bg-white/5 text-gray-400 border border-white/10'}`}>
                      {product.timeline}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{product.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{product.price}</span>
                    <div className="flex flex-col items-end gap-1.5">
                      {product.buyLink ? (
                        <a
                          href={product.buyLink?.startsWith('https://buy.stripe.com') ? buildStripeURL(product.buyLink) : product.buyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm font-semibold text-white bg-brand-red hover:brightness-110 transition-all duration-200 cursor-pointer px-4 py-2.5 rounded-lg whitespace-nowrap"
                        >
                          Get the Kit — {product.price} &rarr;
                        </a>
                      ) : product.githubLink ? (
                        <a
                          href={product.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-brand-blue-light hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                          Get on GitHub &rarr;
                        </a>
                      ) : (
                        <a
                          href="/#newsletter"
                          onClick={handleWaitlistClick}
                          className="text-sm text-brand-blue-light hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                          Notify Me &rarr;
                        </a>
                      )}
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
