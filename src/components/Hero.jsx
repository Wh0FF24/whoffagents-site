import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import AnimatedBackground from './AnimatedBackground'
import { buildStripeURL } from '../utils/utm'
import { track } from '../utils/analytics'

const STRIPE_ATLAS = 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

function TerminalLine({ prefix, prefixColor, children, dim }) {
  return (
    <div className={`flex gap-2 ${dim ? 'opacity-40' : ''}`}>
      {prefix && <span className={prefixColor}>{prefix}</span>}
      <span className="text-gray-300">{children}</span>
    </div>
  )
}

function TerminalVisual() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 3), 1400)
    return () => clearInterval(id)
  }, [])

  const spinner = ['⠋', '⠙', '⠹'][tick]

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
    >
      {/* Glow */}
      <div className="absolute -inset-4 bg-brand-red/8 rounded-3xl blur-3xl pointer-events-none" />

      {/* Window chrome */}
      <div className="relative rounded-xl overflow-hidden border border-brand-border bg-[#0d0d0d] shadow-2xl font-mono text-xs leading-relaxed">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-brand-card border-b border-brand-border">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-3 text-gray-600 text-[11px]">atlas-vault / coordination.md</span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-1.5">
          <div className="text-gray-600 mb-3"># Atlas Task Queue — live</div>

          <TerminalLine prefix="●" prefixColor="text-brand-gold">TASK-051 [active]</TerminalLine>
          <div className="pl-4 space-y-1">
            <TerminalLine prefix="├─" prefixColor="text-gray-600">
              <span className="text-green-400">✓</span>{' '}
              <span className="text-brand-silver">researcher</span>
              <span className="text-gray-500">  research-051.md</span>
            </TerminalLine>
            <TerminalLine prefix="├─" prefixColor="text-gray-600">
              <span className="text-brand-blue-light">{spinner}</span>{' '}
              <span className="text-brand-silver">writer</span>
              <span className="text-gray-500">     processing handoff...</span>
            </TerminalLine>
            <TerminalLine prefix="└─" prefixColor="text-gray-600">
              <span className="text-gray-600">·</span>{' '}
              <span className="text-gray-500">publisher   queued</span>
            </TerminalLine>
          </div>

          <div className="pt-2 border-t border-brand-border/60 mt-3 space-y-1.5">
            <div>
              <span className="text-brand-gold">PAX</span>
              <span className="text-gray-600"> › </span>
              <span className="text-gray-400">{'{'}</span>
              <span className="text-brand-silver">T</span>
              <span className="text-gray-500">:051 </span>
              <span className="text-brand-silver">S</span>
              <span className="text-gray-500">:DONE </span>
              <span className="text-brand-silver">R</span>
              <span className="text-gray-500">:writer </span>
              <span className="text-brand-silver">H</span>
              <span className="text-gray-500">:research-051.md</span>
              <span className="text-gray-400">{'}'}</span>
            </div>

            <div className="flex gap-6 pt-1">
              <div>
                <span className="text-gray-600">drift  </span>
                <span className="text-green-400">0.0 ✓</span>
              </div>
              <div>
                <span className="text-gray-600">tokens </span>
                <span className="text-gray-400">9,102 / 200k</span>
              </div>
            </div>
            <div>
              <span className="text-gray-600">uptime </span>
              <span className="text-brand-silver">52d 07h 14m</span>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-border/60 mt-2 flex items-center gap-2">
            <span className="text-green-400 text-[11px]">●</span>
            <span className="text-gray-500 text-[11px]">14 agents · 9 income streams · $0 infra cost</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6">
      <AnimatedBackground />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

        {/* Left: copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              Atlas Starter Kit · Launch price $47
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #C0C0C0 0%, #C8102E 60%, #FFB81C 100%)' }}
            >
              Stop cascading
            </span>
            <br />
            <span className="text-white">context drift.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-gray-400 leading-relaxed mb-8 max-w-lg"
          >
            Your agents degrade because spawn prompts are sparse, handoffs are lossy, and you can't see
            what's happening. The Atlas Starter Kit is the coordination system extracted from a real
            AI-operated business — PAX Protocol, crash recovery, session persistence. Runs 14 agents.
            Ships daily.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-5">
            <a
              href={buildStripeURL(STRIPE_ATLAS)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('Checkout-Start', { location: 'hero' })}
              className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 text-sm hover:shadow-[0_0_24px_rgba(200,16,46,0.35)]"
            >
              Get the Starter Kit — $47
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="https://github.com/whoffagents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white border border-brand-border hover:border-white/20 font-medium px-7 py-3.5 rounded-lg text-sm transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Preview on GitHub
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-3 text-xs text-gray-600">
            <span className="text-brand-red font-semibold">↑ $47 → $97 on April 22</span>
            <span>·</span>
            <span>One-time · No subscription</span>
          </motion.div>
        </motion.div>

        {/* Right: terminal */}
        <div>
          <TerminalVisual />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 2.5, duration: 1 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <div className="w-5 h-8 border border-gray-700 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-gray-600 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
