import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'
import HeroEmailCapture from './HeroEmailCapture'
import { buildStripeURL } from '../utils/utm'

const STRIPE_ATLAS = 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 max-w-3xl text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #C0C0C0 0%, #C8102E 100%)' }}>
            Stop cascading context drift.
          </span>
          <br />
          <span className="text-white">The multi-agent system</span>
          <br />
          <span className="text-white">built from a real business.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Agents produce mediocre work because spawn prompts are sparse. Context degrades across the chain. Validation fails at the handoff. You can&apos;t observe what&apos;s happening.
          <br />
          <br />
          The Atlas Starter Kit solves all four — PAX Protocol handoffs, spawn brief templates, human-in-the-loop gates, and versioned session persistence. Every pattern from the system running whoffagents.com. Readable source. $47 one-time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
        >
          <a
            href={buildStripeURL(STRIPE_ATLAS)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity duration-200 text-center cursor-pointer bg-brand-red"
          >
            Get the Starter Kit &mdash; $47
          </a>
          <a
            href="https://github.com/whoffagents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white font-medium px-8 py-3.5 text-center cursor-pointer transition-all duration-200"
          >
            Preview the architecture — GitHub →
          </a>
        </motion.div>

        {/* Urgency line */}
        <motion.p
          variants={fadeUp}
          className="text-sm text-gray-500"
        >
          Launch price. Goes to $97 on April 22. &middot; One-time. No subscription.
        </motion.p>

        {/* Hero email capture */}
        <motion.div variants={fadeUp}>
          <HeroEmailCapture />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2, duration: 1 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <div className="w-5 h-8 border-2 border-gray-600 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-gray-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
