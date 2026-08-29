/**
 * /web — Whoff Web Studio.
 * The page Luke's outreach links to. Same core content as the homepage's
 * web-studio path (shared sections = one source of truth), minus the
 * umbrella detours — a local-business lead lands here and sees only
 * their pitch.
 */
import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import ReceiptsStrip from '../components/ReceiptsStrip'
import {
  StudioFeatures, StudioPricing, StudioSteps, StudioWhyUs, StudioFAQ, LeadFormSection,
} from '../components/studio/StudioSections'
import { initReveal } from '../utils/reveal'

export default function WebStudio() {
  useEffect(() => { initReveal() }, [])
  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 40% at 20% 10%, rgba(200,16,46,0.13) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 shell grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <p className="eyebrow mb-6 anim-rise">
              whoff web studio · provo, utah
            </p>
            <h1 className="type-display mb-6 anim-rise anim-d1">
              A website for your business,
              <br />
              live in <span className="text-brand-red-bright">days.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8 anim-rise anim-d2">
              Custom-built, mobile-first, and fast enough to actually keep people on the page.
              Flat pricing. No templates. No surprises on the invoice.
            </p>
            <div className="flex flex-wrap gap-3 mb-8 anim-rise anim-d3">
              <a
                href="#lead-form"
                className="btn-charge inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white bg-brand-red transition-all duration-200"
              >
                Get your free quote <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 border border-white/10 hover:border-white/25 transition-all duration-200"
              >
                See pricing
              </a>
            </div>
            <div className="flex flex-wrap gap-8 anim-rise anim-d4">
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
            </div>
          </div>

          <div className="hidden lg:block anim-rise anim-d3">
            <div className="card-surface corner-ticks p-6">
              <div className="fig-frame relative">
                <img src="/art/path-websites.svg" alt="" className="w-full" aria-hidden="true" />
                <div className="fig-caption">
                  <span>fig. 01 · site build</span>
                  <span>whoff web studio</span>
                </div>
              </div>
              <p className="mono-note text-center mt-2">custom-designed · no templates · yours</p>
            </div>
          </div>
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
