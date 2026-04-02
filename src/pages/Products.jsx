import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Server, Code2, Package, Layers } from 'lucide-react'
import Newsletter from '../components/Newsletter'

const categories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'mcp', label: 'MCP Servers', icon: Server },
  { id: 'skill', label: 'Skills', icon: Code2 },
  { id: 'kit', label: 'Starter Kits', icon: Package },
]

const products = [
  {
    id: 1,
    title: 'Crypto Data MCP',
    description:
      'Real-time on-chain data, price feeds, and DeFi analytics piped directly into Claude Code. Query any chain, any token.',
    category: 'mcp',
    price: 'Free / Pro $19/mo',
    accent: 'blue',
    timeline: 'Launching April 2026',
  },
  {
    id: 2,
    title: 'Ship Fast Skill Pack',
    description:
      '10 Claude Code skills for rapid app development. Auth, payments, deployment, testing, CI/CD — all pre-configured.',
    category: 'skill',
    price: '$49',
    accent: 'red',
    timeline: 'Launching May 2026',
  },
  {
    id: 3,
    title: 'Workflow Automator',
    description:
      'MCP server that connects to Make.com, Zapier, and n8n. Trigger automations from Claude Code conversations.',
    category: 'mcp',
    price: 'Free / Pro $15/mo',
    accent: 'blue',
    timeline: 'Launching May 2026',
  },
  {
    id: 4,
    title: 'SEO Writer Skill',
    description:
      'Claude Code skill that generates SEO-optimized blog posts, meta descriptions, and content briefs from a single topic.',
    category: 'skill',
    price: '$19',
    accent: 'red',
    timeline: 'Launching June 2026',
  },
  {
    id: 5,
    title: 'AI SaaS Starter',
    description:
      'Full-stack Next.js + Stripe + Auth boilerplate for AI-powered SaaS apps. Database, billing, and dashboard pre-built.',
    category: 'kit',
    price: '$99',
    accent: 'gold',
    timeline: 'Launching June 2026',
  },
  {
    id: 6,
    title: 'Trading Signals MCP',
    description:
      'MCP server delivering real-time trading signals, technical analysis, and market sentiment data to your AI coding environment.',
    category: 'mcp',
    price: '$29/mo',
    accent: 'blue',
    timeline: 'Launching July 2026',
  },
]

const categoryLabels = {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Tools</h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            MCP servers, Claude Code skills, and starter kits for the AI developer workflow. All
            built and maintained by Atlas.
          </p>
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
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                      {product.timeline}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{product.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{product.price}</span>
                    <a
                      href="/#newsletter"
                      onClick={handleWaitlistClick}
                      className="text-sm text-brand-blue-light hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Join Waitlist &rarr;
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <Newsletter />
      </div>
    </div>
  )
}
