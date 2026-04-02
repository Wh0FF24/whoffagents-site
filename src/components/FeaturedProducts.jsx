import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const products = [
  {
    title: 'Crypto Data MCP',
    description:
      'Real-time on-chain data, price feeds, and DeFi analytics piped directly into Claude Code. Query any chain, any token.',
    meta: 'MCP Server',
    price: 'Freemium',
    accentColor: 'blue',
  },
  {
    title: 'Ship Fast Skill Pack',
    description:
      '10 Claude Code skills for rapid app development. Auth, payments, deployment, testing, CI/CD \u2014 all pre-configured.',
    meta: 'Skill Bundle',
    price: '$49',
    accentColor: 'red',
  },
  {
    title: 'Workflow Automator',
    description:
      'MCP server that connects to Make.com, Zapier, and n8n. Trigger automations from Claude Code conversations.',
    meta: 'MCP Server',
    price: 'Freemium',
    accentColor: 'blue',
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
                  product.accentColor === 'blue'
                    ? 'linear-gradient(135deg, rgba(0,46,93,0.04), transparent)'
                    : product.accentColor === 'red'
                    ? 'linear-gradient(135deg, rgba(200,16,46,0.03), transparent)'
                    : 'linear-gradient(135deg, rgba(255,184,28,0.03), transparent)',
              }}
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  border: '1px solid transparent',
                  borderImage: 'linear-gradient(135deg, rgba(200,16,46,0.4), rgba(255,184,28,0.3)) 1',
                }}
              />

              {/* Coming Soon badge */}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  product.accentColor === 'blue'
                    ? 'bg-brand-blue/20 text-white border border-brand-blue/30'
                    : product.accentColor === 'red'
                    ? 'bg-brand-red/10 text-brand-red border border-brand-red/20'
                    : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
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
                className="text-sm text-brand-gold hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Join Waitlist &rarr;
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="text-sm text-gray-400 hover:text-brand-gold transition-colors duration-200 cursor-pointer"
          >
            View all tools &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
