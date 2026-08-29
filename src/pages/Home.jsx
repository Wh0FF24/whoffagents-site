/**
 * Homepage — the umbrella.
 * One identity (an AI-operated studio, human-reviewed), three true lines:
 *   01 websites for local businesses  (primary conversion path — lead form)
 *   02 custom AI agents               (consultative, /agents)
 *   03 tools for developers           (/products)
 * Nothing on this page is aspirational: every offer is deliverable today.
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown, PhoneCall, Mail, MessageSquare, CalendarClock, Terminal } from 'lucide-react'
import OrchestrationBoard from '../components/OrchestrationBoard'
import ReceiptsStrip from '../components/ReceiptsStrip'
import Card, { SectionHeader } from '../components/ui/Card'
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
const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5 },
}

const paths = [
  {
    tag: 'for local businesses',
    title: 'A website that wins you customers',
    body: 'Custom-designed, live in days, flat pricing from $1,500. Found on Google, fast on phones.',
    art: '/art/path-websites.svg',
    href: '#web-studio',
    anchor: true,
    cta: 'See how it works',
    accent: 'solid', // red fill
  },
  {
    tag: 'for busy teams',
    title: 'A custom AI agent on your phones & inbox',
    body: 'Answers calls, triages email, books callbacks, runs your follow-ups. Scoped to your business.',
    art: '/art/path-agents.svg',
    href: '/agents',
    cta: 'Explore custom agents',
    accent: 'outline', // red outline
  },
  {
    tag: 'for developers',
    title: 'The tools we run on, packaged',
    body: 'Claude Code skills, MCP servers, and starter kits — extracted from our own daily operation.',
    art: '/art/path-devtools.svg',
    href: '/products',
    cta: 'Browse the tools',
    accent: 'ghost', // graphite
  },
]

const agentCapabilities = [
  { icon: PhoneCall, text: 'Phone agents with custom voices — answer every call, take messages, book callbacks' },
  { icon: Mail, text: 'Email triage and drafting — your inbox sorted and answered before you open it' },
  { icon: MessageSquare, text: 'SMS assistants that keep conversations moving while you work' },
  { icon: CalendarClock, text: 'Scheduled back-office routines — reporting, monitoring, follow-ups, on the clock' },
]

const devPicks = [
  {
    name: 'Ship Fast Skill Pack',
    price: '$49',
    desc: '11 Claude Code skills for the unfun layer of shipping a SaaS — auth, Stripe, deploy, testing.',
    to: '/products/ship-fast-skill-pack',
  },
  {
    name: 'AI SaaS Starter Kit',
    price: '$47',
    desc: 'Next.js boilerplate: NextAuth, Stripe billing + webhooks, streaming Claude chat, Prisma.',
    to: '/products/ai-saas-starter',
  },
  {
    name: 'context-anchor',
    price: 'Free',
    desc: 'One free skill that stops your agents from starting cold after handoffs and breaks.',
    to: '/free-skill',
  },
]

function PathCard({ tag, title, body, art, href, anchor, cta, accent }) {
  const ctaCls = {
    solid: 'bg-brand-red text-white hover:brightness-110',
    outline: 'border border-brand-red-bright/50 text-brand-red-bright hover:bg-brand-red/10',
    ghost: 'border border-white/15 text-gray-200 hover:border-white/30',
  }[accent]

  const inner = (
    <>
      <div className="h-40 flex items-center justify-center border-b border-white/[0.06] bg-black/20 overflow-hidden">
        <img src={art} alt="" loading="lazy" className="h-[150%] w-auto opacity-90 transition-transform duration-500 group-hover:scale-105" aria-hidden="true" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="eyebrow mb-3">{tag}</p>
        <h3 className="type-h3 text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed flex-1">{body}</p>
        <span className={`mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${ctaCls}`}>
          {cta} {anchor ? <ArrowDown className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </span>
      </div>
    </>
  )

  const cls = 'card-surface group flex flex-col overflow-hidden hover:-translate-y-1 transition-transform duration-300'
  return anchor
    ? <a href={href} className={cls}>{inner}</a>
    : <Link to={href} className={cls}>{inner}</Link>
}

export default function Home() {
  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        {/* red signal glow, top-left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 40% at 18% 8%, rgba(200,16,46,0.13) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="eyebrow mb-6">
              whoff agents · an AI-operated studio · provo, utah
            </motion.p>
            <motion.h1 variants={fadeUp} className="type-display mb-6">
              Agents build it.
              <br />
              <span className="text-brand-red-bright">A human</span> signs off.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8">
              We&apos;re a small studio where AI agents do the building — websites for local
              businesses, custom AI assistants, tools for developers — and a person reviews
              everything before it ships. Flat pricing. Plain English. No surprises.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white bg-brand-red hover:brightness-110 transition-all duration-200"
              >
                Get a free quote <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 border border-white/10 hover:border-white/25 transition-all duration-200"
              >
                See pricing
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="mono-note mt-6">
              flat pricing · live in days · 30-day money-back guarantee
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          >
            <OrchestrationBoard />
          </motion.div>
        </div>
      </section>

      {/* ============ THREE PATHS ============ */}
      <motion.section {...reveal} className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {paths.map((p) => <PathCard key={p.tag} {...p} />)}
        </div>
      </motion.section>

      <ReceiptsStrip />

      {/* ============ PATH 01 — WEB STUDIO ============ */}
      <div id="web-studio" className="scroll-mt-16 relative">
        <div className="max-w-6xl mx-auto px-6 pt-20">
          <motion.div {...reveal}>
            <p className="eyebrow mb-4">path 01 · whoff web studio</p>
            <h2 className="type-h1 mb-4">
              Websites for local businesses.
              <br />
              <span className="text-brand-red-bright">Live in days.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Custom-designed, hand-finished websites — no templates, no page builders.
              Flat pricing from $1,500, and the first thing you see is a working version
              of your actual site.
            </p>
          </motion.div>
        </div>
        <StudioFeatures index="01" />
        <StudioPricing index="02" />
        <StudioSteps index="03" />
      </div>

      <StudioWhyUs index="04" />

      {/* ============ PATH 02 — CUSTOM AGENTS ============ */}
      <motion.section {...reveal} className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-center">
          <div>
            <SectionHeader
              index="05"
              eyebrow="path 02 · custom AI agents"
              title="An agent that answers your phones — and your email"
              lede="The same kind of agents that run this company, scoped to yours. Tell us the job; we scope it, build it, and you approve it before it goes live. Priced per project — no retainers you didn't ask for."
            />
            <ul className="mt-8 space-y-3">
              {agentCapabilities.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="w-7 h-7 rounded-md bg-brand-red/10 border border-brand-red-bright/25 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand-red-bright" />
                  </span>
                  <span className="leading-relaxed pt-1">{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/agents"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold border border-brand-red-bright/50 text-brand-red-bright hover:bg-brand-red/10 transition-all"
              >
                How custom agents work <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-300 border border-white/10 hover:border-white/25 transition-all"
              >
                Ask about an agent
              </a>
            </div>
          </div>
          <Card ticks className="p-8 text-center">
            <p className="eyebrow mb-6">hear one right now</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              Don&apos;t take our word for it. This number is answered by an AI agent —
              the same kind we&apos;d build for you. Call it. Ask it anything.
            </p>
            <a
              href="tel:+15405841986"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-lg bg-black/40 border border-white/10 hover:border-brand-red-bright/50 transition-all font-mono text-lg text-white"
            >
              <PhoneCall className="w-5 h-5 text-brand-red-bright" />
              (540) 584-1986
            </a>
            <p className="mono-note mt-4">live 24/7 · answered by an agent</p>
          </Card>
        </div>
      </motion.section>

      {/* ============ PATH 03 — DEVELOPER TOOLS ============ */}
      <motion.section {...reveal} className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeader
          index="06"
          eyebrow="path 03 · for developers"
          title="The tools we run on, packaged"
          lede="Everything in the catalog exists because our own agents needed it first. Buy it, use it, own it — one-time prices, 30-day refunds."
        />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {devPicks.map(({ name, price, desc, to }) => (
            <Link key={name} to={to} className="card-surface group p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <Terminal className="w-4 h-4 text-gray-500" />
                <span className="font-mono text-sm text-brand-red-bright font-bold">{price}</span>
              </div>
              <h3 className="type-h3 mb-2">{name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed flex-1">{desc}</p>
              <span className="mt-5 text-sm font-semibold text-gray-300 group-hover:text-white inline-flex items-center gap-2 transition-colors">
                See details <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-300 border border-white/10 hover:border-white/25 transition-all"
          >
            Browse all developer tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      <StudioFAQ index="07" extraFaqs={[
        {
          q: 'Wait — an AI-operated studio?',
          a: "Yes, really. AI agents run this company's day-to-day — they built this website, they answer our phones, they write our reports — with a human directing the work and reviewing everything that ships. We sell what we use on ourselves every day.",
        },
      ]} />

      <LeadFormSection index="08" source="homepage" />
    </div>
  )
}
