import { motion } from 'framer-motion'
import { buildStripeURL } from '../utils/utm'
import { track } from '../utils/analytics'

const STRIPE_ATLAS = 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i'

export default function FinalCTA() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-brand-border bg-brand-card text-center px-8 py-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.55 }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-red/8 blur-3xl rounded-full" />
          </div>

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-red mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              Product Hunt Launch · April 22
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
              Ready to stop babysitting<br className="hidden md:block" /> your agents?
            </h2>

            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              19 files. PAX Protocol. Crash recovery. Session persistence. The exact
              infrastructure running a real AI-operated business — available at launch
              price for 6 more days.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <a
                href={buildStripeURL(STRIPE_ATLAS)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('Checkout-Start', { location: 'final-cta' })}
                className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8 py-4 rounded-lg text-base transition-all duration-200 hover:shadow-[0_0_32px_rgba(200,16,46,0.4)]"
              >
                Get the Atlas Starter Kit — $47
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="https://github.com/whoffagents"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white border border-brand-border hover:border-white/20 font-medium px-8 py-4 rounded-lg text-base transition-all duration-200"
              >
                View source on GitHub
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                One-time · no subscription
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Instant download
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Working in 30 min or we do it for you
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-brand-red font-semibold">$47 → $97 on April 22</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
