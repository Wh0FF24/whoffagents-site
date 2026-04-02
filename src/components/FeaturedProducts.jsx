import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const products = [
  {
    title: 'Crypto Data MCP',
    description:
      'Real-time on-chain data, price feeds, and DeFi analytics piped directly into Claude Code. Query any chain, any token.',
    meta: 'MCP Server',
    price: 'Freemium',
    accentColor: 'cyan',
  },
  {
    title: 'Ship Fast Skill Pack',
    description:
      '10 Claude Code skills for rapid app development. Auth, payments, deployment, testing, CI/CD \u2014 all pre-configured.',
    meta: 'Skill Bundle',
    price: '$49',
    accentColor: 'purple',
  },
  {
    title: 'Workflow Automator',
    description:
      'MCP server that connects to Make.com, Zapier, and n8n. Trigger automations from Claude Code conversations.',
    meta: 'MCP Server',
    price: 'Freemium',
    accentColor: 'cyan',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function FeaturedProducts() {
  const location = useLocation()

  const handleWaitlistClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24 px-6 border-t border-brand-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured tools</h2>
          <p className="text-gray-400">First wave dropping soon. Subscribe to get early access.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative group bg-brand-card border border-brand-border rounded-xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundImage:
                  product.accentColor === 'cyan'
                    ? 'linear-gradient(135deg, rgba(0,212,255,0.02), transparent)'
                    : 'linear-gradient(135deg, rgba(124,58,237,0.02), transparent)',
              }}
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  border: '1px solid transparent',
                  borderImage:
                    product.accentColor === 'cyan'
                      ? 'linear-gradient(135deg, rgba(0,212,255,0.4), rgba(124,58,237,0.2)) 1'
                      : 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(0,212,255,0.2)) 1',
                }}
              />

              {/* Coming Soon badge */}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  product.accentColor === 'cyan'
                    ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20'
                    : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
                }`}
              >
                <motion.span
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  Coming Soon
                </motion.span>
              </span>

              <h3 className="text-lg font-semibold text-white mb-2">{product.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>
              <div className="text-gray-600 text-sm mb-4">
                {product.meta} &middot; {product.price}
              </div>
              <Link
                to="/#newsletter"
                onClick={handleWaitlistClick}
                className="text-sm text-brand-cyan hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Join Waitlist &rarr;
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="text-sm text-gray-400 hover:text-brand-cyan transition-colors duration-200 cursor-pointer"
          >
            View all tools &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
