/**
 * /agents — Custom AI agents, sold the honest way.
 * Consultative service: inquire → scope → build → approve. No invented
 * price points, no retainer figures, no delivery-date promises. Every
 * capability listed is something the org has demonstrably built and runs.
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  PhoneCall, Mail, MessageSquare, CalendarClock, Wrench, ArrowRight, Activity,
} from 'lucide-react'
import Card, { SectionHeader } from '../components/ui/Card'
import ReceiptsStrip from '../components/ReceiptsStrip'
import { LeadFormSection } from '../components/studio/StudioSections'

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

const capabilities = [
  {
    icon: PhoneCall,
    title: 'Phone agents',
    desc: 'A custom voice on your line that answers every call, takes messages, captures contact details, and books callbacks — 24/7, no hold music.',
  },
  {
    icon: Mail,
    title: 'Email triage & drafting',
    desc: 'An agent that sorts your inbox, flags what matters, and drafts replies in your voice for you to approve — or handles routine threads end-to-end.',
  },
  {
    icon: MessageSquare,
    title: 'SMS assistants',
    desc: 'Text-message agents that answer questions, confirm appointments, and keep conversations moving while you work.',
  },
  {
    icon: CalendarClock,
    title: 'Scheduled routines',
    desc: 'Autonomous back-office work on a clock: morning briefs, monitoring, report generation, follow-up sequences — done before you sit down.',
  },
  {
    icon: Wrench,
    title: 'Skills & integrations',
    desc: 'Custom Claude skills and MCP integrations that wire agents into the tools you already use.',
  },
]

const engagement = [
  {
    num: '01',
    title: 'Tell us the job',
    body: 'Use the form below or email hello@whoffagents.com. Describe the work you want off your plate — in plain English, no spec required.',
  },
  {
    num: '02',
    title: 'We scope it',
    body: 'We come back with what the agent will do, what it won’t, and a flat scoped price for your project. No retainers you didn’t ask for.',
  },
  {
    num: '03',
    title: 'We build, you approve',
    body: 'You test the agent against real scenarios — call it, email it, break it. Nothing goes live on your business until you sign off.',
  },
]

export default function AgentsPage() {
  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 40% at 20% 10%, rgba(200,16,46,0.13) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="eyebrow mb-6">
              custom AI agents · scoped per project
            </motion.p>
            <motion.h1 variants={fadeUp} className="type-display mb-6">
              We run on our
              <br />
              own <span className="text-brand-red-bright">agents.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8">
              AI agents answer this company&apos;s phones, triage its inbox, write its reports, and
              built the page you&apos;re reading. We build the same thing for your business:
              tell us what you need, we scope it, we build it, you approve it.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white bg-brand-red hover:brightness-110 transition-all duration-200"
              >
                Ask about an agent <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:+15405841986"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 border border-white/10 hover:border-white/25 transition-all duration-200"
              >
                <PhoneCall className="w-4 h-4" /> Hear one live
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="mono-note mt-6">
              (540) 584-1986 — a real line, answered by an agent, 24/7
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <div className="card-surface corner-ticks p-6">
              <img src="/art/path-agents.svg" alt="" className="w-full" aria-hidden="true" />
              <p className="mono-note text-center mt-2">one agent · every channel</p>
            </div>
          </motion.div>
        </div>
      </section>

      <ReceiptsStrip />

      {/* ============ WHAT WE BUILD ============ */}
      <motion.section {...reveal} className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeader
          index="01"
          eyebrow="what we build"
          title="Agents that do real jobs"
          lede="Everything below is something we've built and run — not a roadmap slide."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {capabilities.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-red/10 border border-brand-red-bright/25 mb-4">
                <Icon className="w-4 h-4 text-brand-red-bright" />
              </div>
              <h3 className="type-h3 mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </Card>
          ))}
          <Card featured className="p-5 flex flex-col justify-center">
            <h3 className="type-h3 mb-2">Something else?</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              If it&apos;s repetitive, on a schedule, or stuck in your inbox, an agent can
              probably carry it. Describe it and we&apos;ll tell you honestly if we can build it.
            </p>
            <a href="#lead-form" className="text-sm font-semibold text-brand-red-bright inline-flex items-center gap-2">
              Describe the job <ArrowRight className="w-4 h-4" />
            </a>
          </Card>
        </div>
      </motion.section>

      {/* ============ HOW IT WORKS ============ */}
      <motion.section {...reveal} className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeader
          index="02"
          eyebrow="how engagement works"
          title="Inquire. Scope. Build. Approve."
          lede="Pricing is scoped per project — you'll know the full number before we write a line of code."
        />
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {engagement.map((step) => (
            <div key={step.num} className="border-t border-brand-red-bright/40 pt-5 relative">
              <span className="absolute -top-[5px] left-0 w-2 h-2 bg-brand-red-bright rounded-full" />
              <div className="text-brand-red-bright font-mono text-sm font-bold">{step.num}</div>
              <h3 className="type-h3 mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ============ PROOF ============ */}
      <motion.section {...reveal} className="max-w-6xl mx-auto px-6 py-20">
        <Card ticks className="p-6 md:p-10">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-center">
            <div>
              <p className="eyebrow mb-4"><span className="text-gray-600 mr-2">03</span>the proof</p>
              <h2 className="type-h2 mb-5">Our own operations run on these agents</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  This isn&apos;t a product demo we spun up for the sales page. Agents run this
                  company&apos;s day-to-day — the inbox, the phone line, the morning brief at 07:30,
                  the evening report at 17:00, and the website you&apos;re on right now.
                </p>
                <p>
                  <span className="text-white font-medium">A human directs the work and reviews everything that ships.</span>{' '}
                  That&apos;s the honest shape of it: agents do the labor, a person owns the judgment.
                  It&apos;s the same arrangement we&apos;ll build for you.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/atlas/ops"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/15 text-gray-200 hover:border-white/30 transition-all"
                >
                  <Activity className="w-4 h-4 text-brand-red-bright" /> See the live ops log
                </Link>
                <a
                  href="tel:+15405841986"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/15 text-gray-200 hover:border-white/30 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-brand-red-bright" /> Call the agent line
                </a>
              </div>
            </div>
            <img
              src="/art/hero-orchestration.svg"
              alt=""
              loading="lazy"
              className="hidden lg:block w-full opacity-80"
              aria-hidden="true"
            />
          </div>
        </Card>
      </motion.section>

      <LeadFormSection index="04" source="agents_page" />
    </div>
  )
}
