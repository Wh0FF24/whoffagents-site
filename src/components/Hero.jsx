import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import AnimatedBackground from './AnimatedBackground'
import TrustBadges from './TrustBadges'
import { buildStripeURL } from '../utils/utm'
import { track } from '../utils/analytics'

const STRIPE_ATLAS = 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
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
  const [linesVisible, setLinesVisible] = useState(0)

  useEffect(() => {
    const spinId = setInterval(() => setTick(t => (t + 1) % 3), 1400)
    return () => clearInterval(spinId)
  }, [])

  useEffect(() => {
    if (linesVisible < 6) {
      const t = setTimeout(() => setLinesVisible(n => n + 1), 220)
      return () => clearTimeout(t)
    }
  }, [linesVisible])

  const spinner = ['⠋', '⠙', '⠹'][tick]

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, delay: 0.3, ease: 'easeOut' }}
    >
      {/* Multi-layer glow */}
      <div className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,16,46,0.18) 0%, transparent 70%)', filter: 'blur(20px)' }}
      />
      <div className="absolute -inset-3 rounded-2xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(200,16,46,0.10) 0%, rgba(255,184,28,0.04) 60%, transparent 100%)', filter: 'blur(8px)' }}
      />

      {/* Gradient border */}
      <div
        className="p-[1px] rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.5) 0%, rgba(255,184,28,0.3) 40%, rgba(30,30,30,0.8) 100%)' }}
      >
        {/* Window chrome */}
        <div className="relative rounded-[11px] overflow-hidden bg-[#0b0b0b] shadow-2xl font-mono text-xs leading-relaxed">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 bg-[#111] border-b border-white/[0.06]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-3 text-gray-600 text-[11px]">atlas-vault / coordination.md</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-gray-600">live</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-1.5">
            <div className="text-gray-600 mb-3"># New lead — live</div>

            {linesVisible > 0 && (
              <TerminalLine prefix="●" prefixColor="text-brand-gold">Inbound: Mike's Plumbing (385-555-0198)</TerminalLine>
            )}
            {linesVisible > 1 && (
              <div className="pl-4 space-y-1">
                <TerminalLine prefix="├─" prefixColor="text-gray-600">
                  <span className="text-green-400">✓</span>{' '}
                  <span className="text-brand-silver">agent</span>
                  <span className="text-gray-500">    answered in 0.4s</span>
                </TerminalLine>
                {linesVisible > 2 && (
                  <TerminalLine prefix="├─" prefixColor="text-gray-600">
                    <span className="text-brand-blue-light">{spinner}</span>{' '}
                    <span className="text-brand-silver">agent</span>
                    <span className="text-gray-500">    qualifying job...</span>
                  </TerminalLine>
                )}
                {linesVisible > 3 && (
                  <TerminalLine prefix="└─" prefixColor="text-gray-600">
                    <span className="text-gray-600">·</span>{' '}
                    <span className="text-gray-500">booking   queued</span>
                  </TerminalLine>
                )}
              </div>
            )}

            {linesVisible > 4 && (
              <div className="pt-2 border-t border-white/[0.05] mt-3 space-y-1.5">
                <div>
                  <span className="text-brand-gold">job</span>
                  <span className="text-gray-600">     </span>
                  <span className="text-gray-400">burst pipe · $800–1,200 est.</span>
                </div>

                <div className="flex gap-6 pt-1">
                  <div>
                    <span className="text-gray-600">booked </span>
                    <span className="text-green-400">Fri 8am ✓</span>
                  </div>
                  <div>
                    <span className="text-gray-600">confirm </span>
                    <span className="text-gray-400">sent</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">status </span>
                  <span className="text-brand-silver">warm lead → you</span>
                </div>
              </div>
            )}

            {linesVisible > 5 && (
              <div className="pt-3 border-t border-white/[0.05] mt-2 flex items-center gap-2">
                <span className="text-green-400 text-[11px]">●</span>
                <span className="text-gray-500 text-[11px]">24/7 · 0 missed leads · refund if not 10h saved</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom reflection */}
      <div
        className="absolute -bottom-6 left-4 right-4 h-12 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(200,16,46,0.08), transparent)',
          filter: 'blur(12px)',
          borderRadius: '50%',
        }}
      />
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6 overflow-hidden">
      <AnimatedBackground />

      {/* Radial vignette toward center-bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,16,46,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

        {/* Left: copy */}
        <motion.div variants={container} initial="hidden" animate="show">

          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              Lead Qualification Agent · Trades · $99/mo
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-[3.5rem] font-extrabold tracking-tight leading-[1.06] mb-6"
          >
            <span
              className="bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage: 'linear-gradient(135deg, #C0C0C0 0%, #C8102E 45%, #FFB81C 100%)',
                backgroundSize: '200% auto',
              }}
            >
              Your AI employee
            </span>
            <br />
            <span className="text-white">answers every lead.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-gray-400 leading-relaxed mb-8 max-w-lg"
          >
            A Lead Qualification Agent that fields every inbound call, qualifies the job, and
            books the appointment — 24/7, while you're on the job. Built for HVAC, plumbing,
            electrical, and pest control. If it doesn't save you 10 hours in week 1, we refund you.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-5">
            <a
              href="https://cal.com/atlas-whoffagents/setup-session"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('Checkout-Start', { location: 'hero' })}
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-7 py-3.5 rounded-lg text-sm transition-all duration-200"
              style={{ boxShadow: '0 0 0 0 rgba(200,16,46,0)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(200,16,46,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 0 rgba(200,16,46,0)' }}
            >
              Book Demo — $99/mo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white border border-brand-border hover:border-white/20 font-medium px-7 py-3.5 rounded-lg text-sm transition-all duration-200"
            >
              See how it works
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </motion.div>

          {/* Trust signals — directly under CTA */}
          <motion.div variants={fadeUp}>
            <TrustBadges variant="compact" />
          </motion.div>

          {/* Guarantee line */}
          <motion.div variants={fadeUp} className="mt-4 flex items-center gap-3 text-xs text-gray-600">
            <span className="text-brand-gold font-semibold">✓ First-month refund guarantee</span>
            <span>·</span>
            <span>No setup fee · Cancel anytime</span>
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
        transition={{
          opacity: { delay: 2.5, duration: 1 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div className="w-5 h-8 border border-gray-700 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-gray-600 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
