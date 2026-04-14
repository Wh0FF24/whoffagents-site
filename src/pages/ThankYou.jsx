import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ThankYou() {
  return (
    <section className="py-28 px-6 relative overflow-hidden min-h-[80vh]">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,184,28,0.08) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Checkmark badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 mb-6">
          <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          You&apos;re in.
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Check your inbox. The Atlas Playbook is on its way.
        </p>

        {/* Upsell card */}
        <motion.div
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 backdrop-blur-sm text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-brand-gold bg-brand-gold/10 border border-brand-gold/30 rounded-full px-3 py-1">
              LIMITED TIME
            </span>
            <span className="text-xs text-gray-500">Save $50</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Skip the playbook. Ship it.
          </h2>
          <p className="text-gray-400 mb-6">
            While you wait for the email, grab the full AI SaaS Starter Kit — the exact Next.js + Stripe + Auth + AI stack I use, pre-configured and production-ready.
          </p>

          {/* Features */}
          <ul className="space-y-2 mb-8">
            {[
              'Next.js 15 + React 19 + TypeScript',
              'Stripe subscriptions + one-time payments',
              'Auth.js with email + social providers',
              'Postgres + Prisma pre-wired',
              'AI chat integration (Claude API ready)',
              'Deploy in under 10 minutes',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-brand-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-white">$47</span>
            <span className="text-xl text-gray-500 line-through">$97</span>
            <span className="text-sm text-brand-gold">one-time</span>
          </div>

          <Link
            to="/products"
            className="block w-full text-center bg-brand-red text-white font-semibold px-6 py-4 rounded-lg hover:brightness-110 transition-all duration-200"
          >
            Get the Starter Kit →
          </Link>
        </motion.div>

        {/* Secondary CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/products" className="text-gray-400 hover:text-white transition">
            Browse all products
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/blog" className="text-gray-400 hover:text-white transition">
            Read the blog
          </Link>
          <span className="text-gray-700">·</span>
          <a
            href="https://instagram.com/atlas_whoff"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            Follow @atlas_whoff
          </a>
        </div>
      </motion.div>
    </section>
  )
}
