/**
 * Whoff Web Studio — shared sections.
 * ONE source of truth for the web-design offer: the homepage and /web both
 * render these. Pricing mirrors Luke-Sales/kit/PRICING.md exactly.
 *
 * The lead form's endpoint, form-name, and field names are LOAD-BEARING:
 * Luke's outreach pipeline depends on them. Do not rename anything here.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, CheckCircle2, CalendarClock, Search, Check, ArrowRight,
  Smartphone, ServerCog, PhoneCall,
} from 'lucide-react'
import Card, { SectionHeader, accentVars } from '../ui/Card'
import { track } from '../../utils/analytics'

const FORM_ACTION = 'https://whoff-web-studio.netlify.app/'

/* ---------------- data ---------------- */

export const studioFeatures = [
  {
    icon: Search,
    title: 'Found on Google',
    desc: 'Right page titles, right structure, local listings set up correctly — so you show up when someone searches "near me."',
  },
  {
    icon: Smartphone,
    title: 'Built for phones first',
    desc: 'Most of your customers find you on their phone. Your site is designed for that screen first, not squeezed in afterward.',
  },
  {
    icon: Zap,
    title: 'Fast, every time',
    desc: "Built lean — no bloated page builders. 95+ on Google's speed test, because a slow site loses people before they see what you sell.",
  },
  {
    icon: CalendarClock,
    title: 'Booking & payments',
    desc: 'On Redesign Pro and up: customers book a slot, reserve a spot, or pay you right on the site — no more back-and-forth texts.',
  },
  {
    icon: ServerCog,
    title: 'We handle the hosting',
    desc: 'Hosting, SSL, security, and backups are part of every care plan. You never think about servers. Ever.',
  },
  {
    icon: PhoneCall,
    title: 'A person you can call',
    desc: "A small local studio, not an offshore ticket queue. Email a change on Care Full and it's live within two business days.",
  },
]

export const studioTiers = [
  {
    name: 'Redesign',
    price: '$1,500',
    priceNote: 'one-time setup',
    desc: 'A clean, fast site that gets you found and looks legit.',
    features: [
      'Custom design (no templates)',
      'Mobile-first, 95+ Google speed scores',
      'Show up right on Google (titles, local results, link previews)',
      'Up to 5 pages',
    ],
    off: ['Booking / scheduling', 'Online store & payments'],
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

export const carePlans = [
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

export const studioSteps = [
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
    body: "On your own domain, with no disruption to current bookings or billing. 30-day guarantee — if you don't love it, full refund.",
  },
]

export const studioFaqs = [
  {
    q: 'How long does it actually take?',
    a: "First working version in under a week for most Redesign and Redesign Pro projects. Larger Platform builds are scoped individually. “Live in days” means the site — collecting your content from you is usually the slowest part, so we hand you a 15-minute checklist and take it from there.",
  },
  {
    q: 'I already have a website. Does that help or hurt?',
    a: "It helps. We reuse everything worth keeping — your photos, your text, your domain — and rebuild the parts that are slow, dated, or invisible to Google. Your current site stays live until the new one replaces it. No downtime, no lost bookings.",
  },
  {
    q: 'Do I have to write the content?',
    a: "No. Bring what you have — even if it's just your services and prices scribbled in a text message. We draft the pages, you correct anything that doesn't sound like you, and nothing goes live until you've approved it.",
  },
  {
    q: 'Who owns the site?',
    a: "You do. Your domain, your content, your site. If you ever leave, you take it with you — we'll even help you move it. The care plan covers hosting and upkeep; it isn't a hostage arrangement.",
  },
  {
    q: 'Is it really built by AI?',
    a: "AI agents do the heavy lifting — layout, first drafts, the technical build. That's how a custom site costs $1,500 instead of $10,000. A person reviews and finishes every site before you ever see it, and a person answers when you email us.",
  },
  {
    q: 'What if I don’t love it?',
    a: '30-day satisfaction guarantee: full refund, no argument. And the first thing you see is a working version of your actual site — not a mood board — so you’ll know early.',
  },
]

/* ---------------- lead form ---------------- */

export function LeadForm({ source = 'web_studio_page' }) {
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
      track('Web-Studio-Lead-Submit', { source })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <Card ticks className="p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-red/10 border border-brand-red-bright/30 mb-5">
          <CheckCircle2 className="w-7 h-7 text-brand-red-bright" />
        </div>
        <h3 className="type-h3 text-2xl mb-3">Thanks — we&apos;ve got it.</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          We&apos;ll call or text you within one business day to talk through your project and get
          your free quote sorted.
        </p>
      </Card>
    )
  }

  const inputCls =
    'w-full px-4 py-3 rounded-lg text-sm bg-white/[0.04] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-brand-red-bright/60 transition-all'

  return (
    <Card ticks className="p-6 md:p-10">
      <form onSubmit={handleSubmit}>
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
            <div className="field-armed relative">
              <input
                id="business_name" required autoComplete="organization"
                value={fields.business_name} onChange={update('business_name')}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-gray-400 font-medium">Your name</label>
            <div className="field-armed relative">
              <input
                id="name" required autoComplete="name"
                value={fields.name} onChange={update('name')}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm text-gray-400 font-medium">Phone</label>
            <div className="field-armed relative">
              <input
                id="phone" type="tel" required autoComplete="tel"
                value={fields.phone} onChange={update('phone')}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-400 font-medium">Email</label>
            <div className="field-armed relative">
              <input
                id="email" type="email" required autoComplete="email"
                value={fields.email} onChange={update('email')}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="current_website" className="text-sm text-gray-400 font-medium">
              Current website <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <div className="field-armed relative">
              <input
                id="current_website" autoComplete="url"
                value={fields.current_website} onChange={update('current_website')}
                className={inputCls}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="needs" className="text-sm text-gray-400 font-medium">What do you need?</label>
            <div className="field-armed relative">
              <textarea
                id="needs" required rows={4}
                placeholder="A new site, a redesign, online booking, an AI agent for your phones..."
                value={fields.needs} onChange={update('needs')}
                className={`${inputCls} resize-y`}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-charge inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white bg-brand-red transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            {status === 'loading' ? 'Sending...' : 'Send it to a person'} <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">No spam. No obligation. We reply within one business day.</span>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          By submitting, you agree to be contacted by phone, text, or email about your project.
          Message and data rates may apply; reply STOP to opt out of texts at any time. See our{' '}
          <Link to="/privacy" className="underline hover:text-gray-300 transition-colors">privacy policy</Link>.
        </p>
        {status === 'error' && (
          <p className="mt-3 text-sm text-brand-red-bright">
            Something went wrong sending that — try again, or email{' '}
            <a href="mailto:hello@whoffagents.com" className="underline">hello@whoffagents.com</a>.
          </p>
        )}
        <p className="mono-note mt-4">
          prefer email? <a href="mailto:hello@whoffagents.com" className="text-gray-400 hover:text-white transition-colors">hello@whoffagents.com</a>
        </p>
      </form>
    </Card>
  )
}

/* ---------------- sections ---------------- */

export function StudioFeatures({ index = '01' }) {
  return (
    <section data-reveal style={accentVars(index)} className="shell py-20">
      <SectionHeader
        index={index}
        eyebrow="what you get"
        title="Everything a website should actually do"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {studioFeatures.map(({ icon: Icon, title, desc }, i) => (
          <Card key={title} className="rv-item p-5" style={{ '--i': i }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-red/10 border border-brand-red-bright/25 mb-4">
              <Icon className="w-4 h-4 text-brand-red-bright" />
            </div>
            <h3 className="type-h3 mb-2">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function StudioPricing({ index = '02' }) {
  return (
    <section data-reveal id="pricing" style={accentVars(index)} className="shell py-20 scroll-mt-24">
      <SectionHeader
        index={index}
        eyebrow="pricing"
        title="Flat pricing. No surprises."
        lede="One setup fee, then a care plan that keeps the site alive. Every plan includes hosting, SSL, and security."
      />

      <div className="grid md:grid-cols-3 gap-5 mt-10 mb-10">
        {studioTiers.map((tier, i) => (
          <Card key={tier.name} featured={tier.featured} className="rv-item relative flex flex-col p-6" style={{ '--i': i }}>
            {tier.featured && (
              <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-brand-gold text-black">
                Most popular
              </span>
            )}
            <h3 className="type-h3 text-lg">{tier.name}</h3>
            <p className="text-sm text-gray-400 mt-2 min-h-[42px]">{tier.desc}</p>
            <div className="mt-5">
              <div className="text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{tier.price}</div>
              <div className="mono-note mt-1">{tier.priceNote}</div>
            </div>
            <ul className="mt-6 space-y-2.5 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-brand-red-bright flex-shrink-0 mt-0.5" />
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
                  ? 'cta-solid bg-brand-red text-white hover:brightness-110'
                  : 'border border-white/15 text-gray-200 hover:border-white/30'
              }`}
            >
              Get started
            </a>
          </Card>
        ))}
      </div>

      <Card className="p-6 md:p-8">
        <h3 className="type-h3 mb-1">The care plan — pick one</h3>
        <p className="text-sm text-gray-400 mb-6">This is what keeps the site alive after launch.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {carePlans.map((plan) => (
            <div key={plan.name} className="p-5 rounded-xl border border-white/[0.06] bg-black/30">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-white font-semibold">{plan.name}</span>
                <span className="text-brand-red-bright font-bold font-mono text-sm">{plan.price}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-brand-red-bright flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-6">
          <span className="text-white font-semibold">Annual prepay:</span> 2 months of care free. &middot;{' '}
          <span className="text-white font-semibold">30-day guarantee:</span> don&apos;t love it, full refund.
        </p>
      </Card>
    </section>
  )
}

export function StudioSteps({ index = '03' }) {
  return (
    <section data-reveal style={accentVars(index)} className="shell py-20">
      <SectionHeader index={index} eyebrow="how it works" title="Three steps. Live in days." />
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {studioSteps.map((step, i) => (
          <div key={step.num} style={{ '--i': i }} className="rv-item border-t border-brand-red-bright/40 pt-5 relative">
            <span className="absolute -top-[5px] left-0 w-2 h-2 bg-brand-red-bright rounded-full" />
            <div className="text-brand-red-bright font-mono text-sm font-bold">{step.num}</div>
            <h3 className="type-h3 mt-3 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StudioWhyUs({ index = '04' }) {
  return (
    <section data-reveal style={accentVars(index)} className="shell py-20">
      <Card ticks className="p-6 md:p-10 grid lg:grid-cols-[1fr_300px] gap-8 items-center">
        <div>
          <p className="eyebrow mb-4"><span className="text-gray-600 mr-2">{index}</span>why us</p>
          <h2 className="type-h2 mb-5">Built by AI agents.<br />Reviewed by humans.</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              AI agents do the heavy lifting — the layout work, the first draft of every page.
              That&apos;s how we build a custom site in days instead of the months a typical agency
              takes, at a fraction of the price.
            </p>
            <p>
              Every site is checked and finished by a person before it ever reaches you.{' '}
              <span className="text-white font-medium">You&apos;re not getting a template, and you&apos;re not getting a black box.</span>{' '}
              You&apos;re getting a fast, honest process and a website that&apos;s actually yours —
              built by a small studio in Provo, not outsourced overseas.
            </p>
            <p>
              No fake reviews. No filler pages. No stock photos of people who don&apos;t work here.
              Just a site that loads fast and does its job.
            </p>
          </div>
        </div>
        <img
          src="/art/hero-orchestration.svg"
          alt=""
          loading="lazy"
          className="hidden lg:block w-full opacity-80"
          aria-hidden="true"
        />
      </Card>
    </section>
  )
}

export function StudioFAQ({ index = '05', extraFaqs = [] }) {
  const faqs = [...studioFaqs, ...extraFaqs]
  return (
    <section data-reveal id="faq" style={accentVars(index)} className="max-w-3xl mx-auto px-6 py-20 scroll-mt-24">
      <SectionHeader index={index} eyebrow="questions" title="Asked by every owner we talk to" center />
      <div className="mt-10 space-y-3">
        {faqs.map(({ q, a }) => (
          <details key={q} className="card-surface group">
            <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 text-white font-semibold">
              {q}
              <span className="text-brand-red-bright font-mono transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="px-6 pb-5 text-gray-400 leading-relaxed text-sm">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function LeadFormSection({ index = '06', source }) {
  return (
    <section data-reveal id="lead-form" style={accentVars(index)} className="max-w-4xl mx-auto px-6 py-20 scroll-mt-24">
      <SectionHeader
        index={index}
        eyebrow="talk to a person"
        title="Tell us what you need"
        lede="No quote form to decode and no sales sequence. Say what your business does and what you want handled — a person reads it and calls or texts you back within one business day."
      />
      <div className="mt-10">
        <LeadForm source={source} />
      </div>
    </section>
  )
}
