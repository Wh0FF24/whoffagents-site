/**
 * Homepage — the umbrella.
 * One identity (an AI-operated studio, human-reviewed), three true lines:
 *   01 websites for local businesses  (primary conversion path — lead form)
 *   02 custom AI agents               (consultative, /agents)
 *   03 tools for developers           (/products)
 * Nothing on this page is aspirational: every offer is deliverable today.
 */
import { useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown, PhoneCall, Mail, MessageSquare, CalendarClock, Terminal } from 'lucide-react'
import OrchestrationBoard from '../components/OrchestrationBoard'
import TheGate from '../components/TheGate'
import ReceiptsStrip from '../components/ReceiptsStrip'
import Card, { SectionHeader, accentVars } from '../components/ui/Card'
import {
  StudioFeatures, StudioPricing, StudioSteps, StudioWhyUs, StudioFAQ, LeadFormSection,
} from '../components/studio/StudioSections'
import { initReveal } from '../utils/reveal'

/**
 * Per-character monument assembly — split at render time (server-safe:
 * plain string.split in JSX, the spans ship in the prerendered HTML).
 * Words wrap as units (.mch-w inline-block); real spaces between words
 * keep copy/paste and wrapping native. --ci staggers the rise 22ms/char
 * (`from` continues the count across segments so the wave reads left to
 * right through the accent span and line break).
 */
function MonuChars({ text, from = 0 }) {
  let i = from
  return text.split(' ').map((word, wi, arr) => (
    <Fragment key={wi}>
      <span className="mch-w">
        {[...word].map((ch, ci) => (
          <span key={ci} className="mch" style={{ '--ci': i++ }}>{ch}</span>
        ))}
      </span>
      {wi < arr.length - 1 ? ' ' : null}
    </Fragment>
  ))
}

/**
 * Full-bleed statement break — a true line from the site, monument-set.
 * Per-word masked rise via the existing [data-reveal].in mechanism under
 * html.js; fully visible statically otherwise (no-JS / prerender / print).
 */
function StatementBreak({ lines, accentLine, note, accentColor = '#E5484D' }) {
  let w = 0
  return (
    <section data-reveal className="stmt-break" aria-label={lines.join(' ')}>
      <div className="stmt-inner">
        <p className="stmt-display" aria-hidden="true">
          {lines.map((line, li) => (
            <span
              key={li}
              className="stmt-line"
              style={li === accentLine ? { color: accentColor } : undefined}
            >
              {line.split(' ').map((word, wi, arr) => (
                <Fragment key={wi}>
                  <span className="stmt-w">
                    <span className="stmt-wi" style={{ '--wi': w++ }}>{word}</span>
                  </span>
                  {wi < arr.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </span>
          ))}
        </p>
        <div className="stmt-note">
          <span className="stmt-note-chip mono-note">{note}</span>
        </div>
      </div>
    </section>
  )
}

const paths = [
  {
    tag: 'for local businesses',
    title: 'A website that wins you customers',
    body: 'Custom-designed, live in days, flat pricing from $1,500. Found on Google, fast on phones.',
    art: '/art/path-websites.svg',
    fig: { n: '01', of: 'site build', line: 'whoff web studio' },
    href: '#web-studio',
    anchor: true,
    cta: 'See how it works',
    accent: 'solid', // scarlet — web studio
    tint: '#E5484D',
  },
  {
    tag: 'for busy teams',
    title: 'A custom AI agent on your phones & inbox',
    body: 'Answers calls, triages email, books callbacks, runs your follow-ups. Scoped to your business.',
    art: '/art/path-agents.svg',
    fig: { n: '02', of: 'agent switchboard', line: 'custom agents' },
    href: '/agents',
    cta: 'Explore custom agents',
    accent: 'gold', // gold — custom agents
    tint: '#F5A11C',
  },
  {
    tag: 'for developers',
    title: 'The tools we run on, packaged',
    body: 'Claude Code skills, MCP servers, and starter kits — extracted from our own daily operation.',
    art: '/art/path-devtools.svg',
    fig: { n: '03', of: 'tooling stack', line: 'developer tools' },
    href: '/products',
    cta: 'Browse the tools',
    accent: 'royal', // royal — developer tools
    tint: '#3D8BDE',
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

function PathCard({ tag, title, body, art, fig, href, anchor, cta, accent, tint, index = 0 }) {
  const ctaCls = {
    solid: 'bg-brand-red text-white hover:brightness-110',
    gold: 'border border-brand-gold/55 text-brand-gold hover:bg-brand-gold/10',
    royal: 'border border-[#3D8BDE]/55 text-[#3D8BDE] hover:bg-[#3D8BDE]/10',
  }[accent]

  const inner = (
    <>
      {/* blueprint frame around the art region (fig-frame/fig-caption: micro.css) */}
      <div className="fig-frame relative rounded-t-[13px] overflow-hidden">
        <div className="h-40 flex items-center justify-center border-b border-white/[0.06] bg-black/20 overflow-hidden">
          <img src={art} alt="" loading="lazy" className="h-[150%] w-auto opacity-90 transition-transform duration-500 group-hover:scale-105" aria-hidden="true" />
        </div>
        <div className="fig-caption">
          <span>fig. {fig.n} · {fig.of}</span>
          <span>{fig.line}</span>
        </div>
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

  const cls = 'card-surface corner-ticks rv-item group flex flex-col hover:-translate-y-1 transition-transform duration-300'
  /* --tick/--tick-hot tint this card's drafting marks to its line colour */
  const style = { '--i': index, '--tick': `${tint}BF`, '--tick-hot': tint, '--sec-accent': tint }
  return anchor
    ? <a href={href} className={cls} style={style}>{inner}</a>
    : <Link to={href} className={cls} style={style}>{inner}</Link>
}

export default function Home() {
  useEffect(() => { initReveal() }, [])
  return (
    <div className="relative">
      {/* ============ HERO — monument stack ============ */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        {/* red signal glow, top-left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 40% at 18% 8%, rgba(200,16,46,0.13) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 shell">
          <p className="eyebrow mb-6 anim-rise">
            whoff agents · an AI-operated studio · provo, utah
          </p>
          {/* per-char monument assembly — chars ship in the prerendered HTML,
              start 25%-visible (LCP-safe), stagger 22ms/char left to right */}
          <h1 className="type-display mb-10" aria-label="Agents build it. A human signs off.">
            <span aria-hidden="true">
              <MonuChars text="Agents build it." />
              <br />
              <span className="text-brand-red-bright"><MonuChars text="A human" from={14} /></span>
              {' '}
              <MonuChars text="signs off." from={20} />
            </span>
          </h1>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-x-14 gap-y-10 items-center">
            <div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8 anim-rise anim-d2">
                We&apos;re a small studio where AI agents do the building — websites for local
                businesses, custom AI assistants, tools for developers — and a person reviews
                everything before it ships. Flat pricing. Plain English. No surprises.
              </p>
              <div className="flex flex-wrap gap-3 anim-rise anim-d3">
                <a
                  href="#lead-form"
                  className="btn-charge inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white bg-brand-red transition-all duration-200"
                >
                  Get a free quote <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 border border-white/10 hover:border-white/25 transition-all duration-200"
                >
                  See pricing
                </a>
              </div>
              <p className="mono-note mt-6 anim-rise anim-d4">
                flat pricing · live in days · 30-day money-back guarantee
              </p>
            </div>

            <div className="anim-rise anim-d3">
              <OrchestrationBoard />
            </div>
          </div>
        </div>
      </section>

      {/* ============ THREE PATHS ============ */}
      <section data-reveal className="shell pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {paths.map((p, i) => <PathCard key={p.tag} {...p} index={i} />)}
        </div>
      </section>

      <ReceiptsStrip />

      {/* ============ PATH 01 — WEB STUDIO ============ */}
      <div id="web-studio" className="scroll-mt-16 relative spine">
        <span aria-hidden="true" className="spine-dot hidden lg:block top-[5.45rem]" />
        <div className="shell pt-20">
          <div data-reveal>
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
          </div>
        </div>
        <StudioFeatures index="01" />
        <StudioPricing index="02" />
        <StudioSteps index="03" />
      </div>

      {/* ============ 03.5 — THE GATE (pinned scroll narrative) ============ */}
      <TheGate />

      <StudioWhyUs index="04" />

      {/* ============ STATEMENT BREAK 1 ============ */}
      <StatementBreak
        lines={['Agents do the labor.', 'A person owns the judgment.']}
        accentLine={1}
        accentColor="#E5484D"
        note="the honest shape of it · from /agents"
      />

      {/* ============ PATH 02 — CUSTOM AGENTS ============ */}
      <section data-reveal style={accentVars("05")} className="spine relative shell pl-6 lg:pl-10 py-20">
        <span aria-hidden="true" className="spine-dot hidden lg:block top-[5.45rem]" />
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
              href="#lead-form"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-lg bg-black/40 border border-white/10 hover:border-brand-red-bright/50 transition-all font-mono text-lg text-white"
            >
              <PhoneCall className="w-5 h-5 text-brand-red-bright" />
              Request a live demo call
            </a>
            <p className="mono-note mt-4">tell us in the form — an agent will phone you</p>
          </Card>
        </div>
      </section>

      {/* ============ PATH 03 — DEVELOPER TOOLS ============ */}
      <section data-reveal style={accentVars("06")} className="spine relative shell pl-6 lg:pl-10 py-20">
        <span aria-hidden="true" className="spine-dot hidden lg:block top-[5.45rem]" />
        <SectionHeader
          index="06"
          eyebrow="path 03 · for developers"
          title="The tools we run on, packaged"
          lede="Everything in the catalog exists because our own agents needed it first. Buy it, use it, own it — one-time prices, 30-day refunds."
        />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {devPicks.map(({ name, price, desc, to }, i) => (
            <Link key={name} to={to} style={{ '--i': i }} className="card-surface corner-ticks rv-item group p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
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
      </section>

      <StudioFAQ index="07" extraFaqs={[
        {
          q: 'Wait — an AI-operated studio?',
          a: "Yes, really. AI agents run this company's day-to-day — they built this website, they answer our phones, they write our reports — with a human directing the work and reviewing everything that ships. We sell what we use on ourselves every day.",
        },
      ]} />

      {/* ============ STATEMENT BREAK 2 ============ */}
      <StatementBreak
        lines={['The agents built', 'this page.']}
        accentLine={1}
        accentColor="#F5A11C"
        note="true story · ask us how · gate: WILL"
      />

      <LeadFormSection index="08" source="homepage" />
    </div>
  )
}
