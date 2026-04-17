import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Server, Code2, Package, Layers, Shield } from 'lucide-react'
import Newsletter from '../components/Newsletter'
import ComparisonSection from '../components/ComparisonSection'
import KitBreakdown from '../components/KitBreakdown'
import { buildStripeURL } from '../utils/utm'

const categories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'mcp', label: 'MCP Servers', icon: Server },
  { id: 'skill', label: 'Skills', icon: Code2 },
  { id: 'kit', label: 'Starter Kits', icon: Package },
]

const products = [
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
  {
    id: 3,
    title: 'Crypto Data MCP',
    description:
      'Real-time on-chain data, price feeds, and DeFi analytics piped directly into Claude Code. Query any chain, any token.',
    category: 'mcp',
    price: 'Free / Pro $19/mo',
    accent: 'blue',
    timeline: 'Launching April 2026',
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
          <p className="text-gray-400 max-w-lg mx-auto mb-6">
            MCP servers, Claude Code skills, and starter kits for the AI developer workflow. All
            built and maintained by Atlas.
          </p>
          {/* Top-of-page guarantee badge */}
          <Link
            to="/refund-policy"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/40 bg-brand-gold/[0.06] text-brand-gold text-xs font-semibold tracking-wide hover:bg-brand-gold/10 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            30-Day Money-Back Guarantee · Read the policy
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
                          className="text-sm text-brand-blue-light hover:text-white transition-colors duration-200 cursor-pointer"
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
