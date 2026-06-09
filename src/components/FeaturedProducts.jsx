import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { buildStripeURL } from '../utils/utm'
import { track } from '../utils/analytics'

const featured = {
  title: 'Ship Fast Skill Pack',
  description:
    'Stop rebuilding auth, payments, and CI from scratch every time you ship. 11 Claude Code skills — auth-setup, stripe-payments, api-builder, database-setup, deploy-config, testing-suite, email-system, monitoring, seo-meta, ui-components, context-anchor. Drop into .claude/skills/ and invoke by keyword. Battle-tested on whoffagents.com.',
  meta: 'Claude Code Skill',
  price: '$49',
  accentColor: 'gold',
  timeline: '11 skills — $49',
  timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
  internalLink: '/products/ship-fast-skill-pack',
  buyLink: 'https://buy.stripe.com/5kQ4gB7Nd1Jj3nx1ANaZi0a',
  bullets: ['Pre-wired, not boilerplate', 'Model-agnostic (Claude, OpenAI, Gemini)', 'MIT-licensed · lifetime updates'],
}

const products = [
  {
    title: 'Atlas Starter Kit',
    description:
      'PAX Protocol handoffs that stop context drift. Spawn brief templates that give agents rich enough context for non-mediocre work on the first try. Human-in-the-loop gates at every destructive action. Versioned PLAN.md vault so every session builds on the last.\n\nNot docs. Not a demo. The exact system running whoffagents.com — packaged and readable. One-time $97.',
    meta: 'Starter Kit',
    price: '$97',
    accentColor: 'gold',
    timeline: 'Starter Kit — $97',
    timelineBadgeClass: 'bg-brand-red/20 text-brand-red border border-brand-red/30',
    link: 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i',
    linkText: 'Get the Starter Kit — $97',
    secondaryLink: null,
    secondaryLinkText: null,
  },
  {
    title: 'Grand Slam Offer Generator',
    description:
      'You have a product. You need an offer. Answer 8 questions. Get a Hormozi-grade value stack, headline, guarantee, and price anchor — ready to paste anywhere. 5 minutes. Free. Open source.',
    meta: 'Claude Code Skill',
    price: 'Free',
    accentColor: 'blue',
    timeline: 'Start Here — Free',
    timelineBadgeClass: 'bg-brand-blue/20 text-white border border-brand-blue/30',
    link: 'https://github.com/Wh0FF24/grand-slam-offer-generator',
    linkText: 'Get on GitHub',
    secondaryLink: null,
    secondaryLinkText: null,
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
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start free. Scale fast.</h2>
          <p className="text-gray-400">A clear path from zero to automated. All built and maintained by Atlas.</p>
        </motion.div>

        {/* Ship Fast — featured hero card */}
        <motion.div
          className="relative group bg-brand-card border border-brand-gold/30 rounded-2xl p-8 overflow-hidden mb-6 max-w-3xl mx-auto transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,184,28,0.08)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,184,28,0.04), transparent)' }}
        >
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${featured.timelineBadgeClass}`}>
                {featured.timeline}
              </span>
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                Instant delivery · 30-day refund
              </span>
            </div>
            <span className="text-brand-gold font-mono font-bold text-lg">{featured.price} one-time</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{featured.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{featured.description}</p>
          <ul className="flex flex-wrap gap-3 mb-6">
            {featured.bullets.map((b) => (
              <li key={b} className="flex items-center gap-1.5 text-xs text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={buildStripeURL(featured.buyLink)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('Checkout-Start', { location: 'featured-hero', product: featured.title })}
              className="inline-block text-sm font-semibold text-white bg-brand-red hover:brightness-110 transition-all duration-200 px-5 py-2.5 rounded-lg"
            >
              Get Ship Fast — $49 →
            </a>
            <Link
              to={featured.internalLink}
              className="text-sm text-brand-gold hover:text-white transition-colors duration-200"
            >
              See full details →
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0 }}
              className="relative group bg-brand-card border border-brand-border rounded-xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,46,93,0.15)]"
              style={{
                backgroundImage:
                  product.accentColor === 'blue'
                    ? 'linear-gradient(135deg, rgba(0,46,93,0.04), transparent)'
                    : product.accentColor === 'red'
                    ? 'linear-gradient(135deg, rgba(200,16,46,0.03), transparent)'
                    : 'linear-gradient(135deg, rgba(255,184,28,0.03), transparent)',
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-red/40 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  border: '1px solid transparent',
                  borderImage: 'linear-gradient(135deg, rgba(200,16,46,0.4), rgba(0,98,184,0.3)) 1',
                }}
              />

              {/* Timeline badge */}
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${product.timelineBadgeClass || 'bg-white/5 text-gray-400 border border-white/10'}`}>
                {product.timeline}
              </span>

              <h3 className="text-lg font-semibold text-white mb-2">{product.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>
              <div className="text-gray-500 text-sm mb-4">
                {product.meta} &middot; {product.price}
              </div>
              <div className="flex flex-col gap-1.5">
                {product.link?.startsWith('http') ? (
                  <a
                    href={product.link?.startsWith('https://buy.stripe.com') ? buildStripeURL(product.link) : product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => product.link?.startsWith('https://buy.stripe.com') && track('Checkout-Start', { location: 'products-grid', product: product.title })}
                    className="text-sm text-brand-blue-light hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {product.linkText || 'Join Waitlist'} &rarr;
                  </a>
                ) : (
                  <Link
                    to={product.link || '/#newsletter'}
                    onClick={product.link ? undefined : handleWaitlistClick}
                    className="text-sm text-brand-blue-light hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {product.linkText || 'Join Waitlist'} &rarr;
                  </Link>
                )}
                {product.secondaryLink && (
                  <a
                    href={product.secondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                  >
                    {product.secondaryLinkText} &rarr;
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="text-sm text-gray-400 hover:text-brand-blue-light transition-colors duration-200 cursor-pointer"
          >
            View all tools &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
