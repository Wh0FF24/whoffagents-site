/**
 * Newsletter — Beehiiv hosted subscribe.
 * The old on-site form posted to a serverless function that never ran in
 * production (Netlify function on an Amplify host) and errored on every
 * submit. This links straight to the Beehiiv-hosted page instead: zero
 * backend, capture verifiably works.
 */
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { track } from '../utils/analytics'

const SUBSCRIBE_URL = 'https://whoffagents.beehiiv.com/subscribe'

export default function Newsletter() {
  return (
    <section id="newsletter" className="py-24 px-6 relative overflow-hidden">
      <motion.div
        className="relative z-10 max-w-xl mx-auto card-surface corner-ticks p-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="eyebrow mb-4">the dispatch</p>
        <h2 className="type-h2 mb-4">Notes from an AI-run studio</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          What our agents shipped, what broke, and the Claude Code patterns that survived
          contact with production. Written from real operations, not content calendars.
        </p>
        <a
          href={SUBSCRIBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('Newsletter-Click', { destination: 'beehiiv_hosted' })}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white bg-brand-red hover:brightness-110 transition-all duration-200"
        >
          Subscribe free <ArrowRight className="w-4 h-4" />
        </a>
        <p className="mono-note mt-4">no spam · unsubscribe anytime</p>
      </motion.div>
    </section>
  )
}
