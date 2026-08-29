/**
 * /web — Whoff Web Studio.
 * The page Luke's outreach links to. Same core content as the homepage's
 * web-studio path (shared sections = one source of truth), minus the
 * umbrella detours — a local-business lead lands here and sees only
 * their pitch.
 */
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ReceiptsStrip from '../components/ReceiptsStrip'
import {
  StudioFeatures, StudioPricing, StudioSteps, StudioWhyUs, StudioFAQ, LeadFormSection,
} from '../components/studio/StudioSections'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
}

export default function WebStudio() {
  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 40% at 20% 10%, rgba(200,16,46,0.13) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="eyebrow mb-6">
              whoff web studio · provo, utah
            </motion.p>
            <motion.h1 variants={fadeUp} className="type-display mb-6">
              A website for your business,
              <br />
              live in <span className="text-brand-red-bright">days.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8">
              Custom-built, mobile-first, and fast enough to actually keep people on the page.
              Flat pricing. No templates. No surprises on the invoice.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white bg-brand-red hover:brightness-110 transition-all duration-200"
              >
                Get your free quote <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 border border-white/10 hover:border-white/25 transition-all duration-200"
              >
                See pricing
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-8">
              {[
                { n: '95+', l: 'google speed score' },
                { n: '< 7 days', l: 'to first live version' },
                { n: '$1,500', l: 'flat, to start' },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div className="text-2xl font-extrabold text-brand-red-bright" style={{ fontFamily: 'var(--font-display)' }}>{n}</div>
                  <div className="mono-note uppercase tracking-widest">{l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <div className="card-surface corner-ticks p-6">
              <img src="/art/path-websites.svg" alt="" className="w-full" aria-hidden="true" />
              <p className="mono-note text-center mt-2">custom-designed · no templates · yours</p>
            </div>
          </motion.div>
        </div>
      </section>

      <ReceiptsStrip />

      <StudioFeatures index="01" />
      <StudioPricing index="02" />
      <StudioSteps index="03" />
      <StudioWhyUs index="04" />
      <StudioFAQ index="05" />
      <LeadFormSection index="06" source="web_studio_page" />
    </div>
  )
}
