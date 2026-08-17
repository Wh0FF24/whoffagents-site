import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, CheckCircle2, Shield, Search, Check, ArrowRight } from 'lucide-react'
import { track } from '../utils/analytics'

const FORM_ACTION = 'https://whoff-web-studio.netlify.app/'

const features = [
  {
    icon: Zap,
    title: 'Fast, every time',
    desc: "Built lean, no bloated page builders. Scores 95+ on Google's speed test, because a slow site loses people before they see what you sell.",
  },
  {
    icon: CheckCircle2,
    title: 'Built for phones first',
    desc: 'Most of your customers find you on their phone. Your site is designed for that screen first, not squeezed in afterward.',
  },
  {
    icon: Shield,
    title: 'Booking & payments',
    desc: 'On Redesign Pro and up: people can book a class, reserve a spot, or pay you right from the site — no more back-and-forth texts.',
  },
  {
    icon: Search,
    title: 'Found on Google',
    desc: 'Right page titles, right structure, local listings set up correctly — so you actually show up when someone searches "near me."',
  },
]

const tiers = [
  {
    name: 'Redesign',
    price: '$1,500',
    priceNote: 'one-time setup',
    desc: 'For a clean, fast site that gets you found and looks legit.',
    features: [
      'Custom design (no templates)',
      'Mobile-first, 95+ Google speed scores',
      'Show up right on Google (titles, local results, link previews)',
      'Up to 5 pages',
    ],
    off: ['Booking / scheduling integration', 'Online store & payments'],
    featured: false,
  },
  {
    name: 'Redesign Pro',
    price: '$3,000',
    priceNote: 'one-time setup',
    desc: 'For businesses that take bookings or payments and want real marketing tools.',
    features: [
      'Everything in Redesign, up to 10 pages',
      'Booking / scheduling integration',
      'Online store & payments',
      'Google Analytics + conversion tracking',
      'Email capture & newsletter setup',
    ],
    off: [],
    featured: true,
  },
  {
    name: 'Platform',
    price: 'from $6,000',
    priceNote: 'scoped to your needs',
    desc: 'For businesses that need something custom — portals, order flows, calculators.',
    features: [
      'Unlimited pages, fully custom',
      'Everything in Redesign Pro',
      'Custom systems: order flows, portals, calculators',
    ],
    off: [],
    featured: false,
  },
]

const carePlans = [
  {
    name: 'Care Basic',
    price: '$95/mo',
    features: ['Hosting, SSL, security, backups', 'Small fixes & tweaks'],
  },
  {
    name: 'Care Full',
    price: '$195/mo',
    features: [
      'Everything in Care Basic',
      'Unlimited content edits — schedules, prices, events, photos. Email the change, live within 2 business days',
      'Quarterly results report — visitors, bookings, inquiries',
    ],
  },
]

const steps = [
  {
    num: '01',
    title: 'Tell us about your business',
    body: 'Fill out the short form below — two minutes. Your business, your current site (if you have one), what you need.',
  },
  {
    num: '02',
    title: 'We build it',
    body: 'Custom-designed with your real content, prices, and photos. No templates, no page builders. First version back in days, not months.',
  },
  {
    num: '03',
    title: 'You go live',
    body: 'On your own domain, with no disruption to current bookings or billing. 30-day guarantee — if you don’t love it, full refund.',
  },
]

function LeadForm() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [fields, setFields] = useState({
    business_name: '',
    name: '',
    phone: '',
    email: '',
    current_website: '',
    needs: '',
  })

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    const body = new URLSearchParams({ 'form-name': 'lead', 'bot-field': '', ...fields })
    try {
      await fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      track('Web-Studio-Lead-Submit', { source: 'web_studio_page' })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/[0.04] p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold/10 border border-brand-gold/30 mb-5">
          <CheckCircle2 className="w-7 h-7 text-brand-gold" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Thanks — we&apos;ve got it.</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          We&apos;ll call or text you within one business day to talk through your project and get
          your free quote sorted.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-border bg-brand-card p-6 md:p-10">
      {/* Honeypot */}
      <p className="hidden" aria-hidden="true">
        <label>
          Don&apos;t fill this out if you&apos;re human:
          <input
            tabIndex={-1}
            autoComplete="off"
            value={fields['bot-field'] || ''}
            onChange={(e) => setFields((f) => ({ ...f, 'bot-field': e.target.value }))}
          />
        </label>
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2 flex flex-col gap-2">
          <label htmlFor="business_name" className="text-sm text-gray-400 font-medium">Business name</label>
          <input
            id="business_name" required autoComplete="organization"
            value={fields.business_name} onChange={update('business_name')}
            className="px-4 py-3 rounded-lg text-sm bg-white/[0.04] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-gray-400 font-medium">Your name</label>
          <input
            id="name" required autoComplete="name"
            value={fields.name} onChange={update('name')}
            className="px-4 py-3 rounded-lg text-sm bg-white/[0.04] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm text-gray-400 font-medium">Phone</label>
          <input
            id="phone" type="tel" required autoComplete="tel"
            value={fields.phone} onChange={update('phone')}
            className="px-4 py-3 rounded-lg text-sm bg-white/[0.04] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-gray-400 font-medium">Email</label>
          <input
            id="email" type="email" required autoComplete="email"
            value={fields.email} onChange={update('email')}
            className="px-4 py-3 rounded-lg text-sm bg-white/[0.04] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="current_website" className="text-sm text-gray-400 font-medium">
            Current website <span className="text-gray-600 font-normal">(optional)</span>
          </label>
          <input
            id="current_website" autoComplete="url"
            value={fields.current_website} onChange={update('current_website')}
            className="px-4 py-3 rounded-lg text-sm bg-white/[0.04] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-all"
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <label htmlFor="needs" className="text-sm text-gray-400 font-medium">What do you need?</label>
          <textarea
            id="needs" required rows={4}
            placeholder="A new site, a redesign, online booking, an online store..."
            value={fields.needs} onChange={update('needs')}
            className="px-4 py-3 rounded-lg text-sm bg-white/[0.04] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-all resize-y"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white bg-brand-red hover:brightness-110 transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {status === 'loading' ? 'Sending...' : 'Send it — get my free quote'} <ArrowRight className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-500">No spam. No obligation. We reply within one business day.</span>
      </div>
      {status === 'error' && (
        <p className="mt-3 text-sm text-brand-red">Something went wrong sending that — try again, or email atlas@whoffagents.com directly.</p>
      )}
    </form>
  )
}

export default function WebStudio() {
  return (
    <div className="pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
              Whoff Web Studio
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
              Flat pricing from $1,500
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            A modern website for your business, live in <span className="text-brand-gold">days</span> — not months.
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Custom-built, mobile-first, and fast enough to actually keep people on the page. Flat
            pricing. No templates. No surprises on the invoice.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href="#lead-form"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-base bg-brand-red hover:brightness-110 transition-all duration-200"
            >
              Get your free quote <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 text-base border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              See pricing
            </a>
          </div>

          <div className="flex flex-wrap gap-8">
            {[
              { n: '95+', l: 'Google speed score' },
              { n: '< 7 days', l: 'to first live version' },
              { n: '$1,500', l: 'flat, to start' },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="text-xl font-extrabold text-brand-gold">{n}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What you get */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">What you get</p>
          <h2 className="text-2xl font-bold text-white mb-8">Everything a website should actually do.</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-gold/10 border border-brand-gold/20 mb-4">
                  <Icon className="w-4 h-4 text-brand-gold" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Pricing */}
        <motion.section
          id="pricing"
          className="mb-16 scroll-mt-24"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">Pricing</p>
          <h2 className="text-2xl font-bold text-white mb-3">Flat pricing. No surprises.</h2>
          <p className="text-gray-400 mb-10 max-w-2xl">
            One setup fee, then choose a care plan to keep the site alive. Every plan includes
            hosting, SSL, and security.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col p-6 rounded-2xl border ${
                  tier.featured
                    ? 'border-brand-gold/40 bg-brand-gold/[0.05]'
                    : 'border-white/[0.06] bg-white/[0.02]'
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-brand-gold text-black">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="text-sm text-gray-400 mt-2 min-h-[42px]">{tier.desc}</p>
                <div className="mt-5">
                  <div className="text-2xl font-extrabold text-white">{tier.price}</div>
                  <div className="text-xs text-gray-500 mt-1">{tier.priceNote}</div>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {tier.off.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center">&ndash;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#lead-form"
                  className={`mt-6 text-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    tier.featured
                      ? 'bg-brand-gold text-black hover:brightness-105'
                      : 'border border-white/15 text-gray-200 hover:border-white/30'
                  }`}
                >
                  Get started
                </a>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
            <h3 className="text-white font-bold mb-1">The care plan — pick one</h3>
            <p className="text-sm text-gray-400 mb-6">This is what keeps the site alive after launch.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {carePlans.map((plan) => (
                <div key={plan.name} className="p-5 rounded-xl border border-white/[0.06] bg-brand-dark/40">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-white font-semibold">{plan.name}</span>
                    <span className="text-brand-gold font-bold">{plan.price}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6">
              <span className="text-brand-gold font-semibold">Annual prepay:</span> 2 months of care free. &middot;{' '}
              <span className="text-brand-gold font-semibold">30-day guarantee:</span> don&apos;t love it, full refund.
            </p>
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">How it works</p>
          <h2 className="text-2xl font-bold text-white mb-8">Three steps. Live in days.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="border-t-2 border-brand-gold/40 pt-5">
                <div className="text-brand-gold font-mono text-sm font-bold">{step.num}</div>
                <h3 className="text-white font-semibold mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Why us */}
        <motion.section
          className="mb-16 p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Why us</p>
          <h2 className="text-xl font-bold text-white mb-5">Built by an AI-powered studio. Reviewed by humans.</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              We use AI to do the heavy lifting — the layout work, the first draft of every page.
              That&apos;s how we build a custom site in days instead of the months a typical agency
              takes.
            </p>
            <p>
              Every site is checked and finished by a person before it ever reaches you.{' '}
              <span className="text-white font-medium">You&apos;re not getting a template, and you&apos;re not getting a black box.</span>{' '}
              You&apos;re getting a fast, honest process and a website that&apos;s actually yours —
              built by a small local studio, not outsourced overseas.
            </p>
            <p>No fake reviews. No filler pages. No stock photos of people who don&apos;t work here. Just a site that loads fast and does its job.</p>
          </div>
        </motion.section>

        {/* Lead form */}
        <motion.section
          id="lead-form"
          className="scroll-mt-24"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">Get started</p>
          <h2 className="text-2xl font-bold text-white mb-3">Get your free quote</h2>
          <p className="text-gray-400 mb-8 max-w-2xl">
            Tell us about your business. We&apos;ll call or text you within one business day — no
            obligation.
          </p>
          <LeadForm />
        </motion.section>

      </div>
    </div>
  )
}
