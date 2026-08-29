/**
 * /agents — Custom AI agents, sold the honest way.
 * Consultative service: inquire → scope → build → approve. No invented
 * price points, no retainer figures, no delivery-date promises. Every
 * capability listed is something the org has demonstrably built and runs.
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PhoneCall, Mail, MessageSquare, CalendarClock, Wrench, ArrowRight, Activity,
} from 'lucide-react'
import Card, { SectionHeader, accentVars } from '../components/ui/Card'
import ReceiptsStrip from '../components/ReceiptsStrip'
import SwitchboardBoard from '../components/SwitchboardBoard'
import { LeadFormSection } from '../components/studio/StudioSections'
import { initReveal } from '../utils/reveal'

const capabilities = [
  {
    icon: PhoneCall,
    title: 'It answers your phone',
    desc: 'A real voice on your line that picks up every call, takes messages, gets the caller’s details down, and books callbacks — day or night, no hold music.',
  },
  {
    icon: Mail,
    title: 'It handles your inbox',
    desc: 'Sorts what matters from what doesn’t and writes replies in your voice for you to approve — or answers the routine ones start to finish.',
  },
  {
    icon: MessageSquare,
    title: 'It texts your customers',
    desc: 'Answers questions, confirms appointments, and keeps conversations moving while you’re busy with the actual work.',
  },
  {
    icon: CalendarClock,
    title: 'It does the repeat work',
    desc: 'The tasks that come round every day or every week — reports, reminders, follow-ups, checking on things — done on schedule without anyone having to remember.',
  },
  {
    icon: Wrench,
    title: 'It works with your tools',
    desc: 'We connect it to the software you already run your business on, so it fits how you work instead of adding another thing to learn.',
  },
]

const engagement = [
  {
    num: '01',
    title: 'Tell us the job',
    body: 'Use the form below or email hello@whoffagents.com. Describe the work you want off your plate, the way you’d explain it to a new hire. No technical detail needed.',
  },
  {
    num: '02',
    title: 'We price it',
    body: 'We come back with exactly what it will do, what it won’t, and one flat price for the project. No retainers you didn’t ask for.',
  },
  {
    num: '03',
    title: 'We build, you approve',
    body: 'You try it on real situations — call it, email it, try to trip it up. Nothing goes live on your business until you say so.',
  },
]

export default function AgentsPage() {
  useEffect(() => { initReveal() }, [])
  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 40% at 20% 10%, rgba(200,16,46,0.13) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 shell">
          <p className="eyebrow mb-6 anim-rise">
            custom ai agents · any business · any job
          </p>
          <h1 className="type-display mb-8 anim-rise anim-d1">
            AI that does the jobs
            <br />
            <span className="text-brand-red-bright">you don&apos;t have time for.</span>
          </h1>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-5 anim-rise anim-d2">
                We build a custom AI assistant for your business — software that takes over
                a job you&apos;d otherwise hire someone to do. It answers your phone in a real
                voice, sorts and drafts your email, texts customers back, and runs the
                repeat work on a schedule.
              </p>
              {/* the sentence that stops people picturing a machine in the closet */}
              <p className="text-gray-400 leading-relaxed max-w-xl mb-8 anim-rise anim-d2">
                <span className="text-white font-medium">There&apos;s no hardware to buy and nothing to install.</span>{' '}
                It runs on our systems, not a computer in your office, and we look after it
                once it&apos;s live.
              </p>
              <div className="flex flex-wrap gap-3 anim-rise anim-d3">
                <a
                  href="#lead-form"
                  className="btn-charge inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white bg-brand-red transition-all duration-200"
                >
                  Tell us what you need <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#lead-form"
                  className="btn-charge inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 border border-white/10 hover:border-white/25 transition-all duration-200"
                >
                  <PhoneCall className="w-4 h-4" /> Hear one live
                </a>
              </div>
              <p className="mono-note mt-6 anim-rise anim-d4">
                Ask for a live demo call in the inquiry — you&apos;ll talk to a real agent voice before you spend a dollar
              </p>
            </div>

            <div className="hidden lg:block anim-rise anim-d3">
              <div className="card-surface corner-ticks p-6">
                <SwitchboardBoard />
                <p className="mono-note text-center mt-2">one assistant · every channel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ IS / ISN'T — kills the "is this a device?" read ============ */}
      <section data-reveal className="shell pb-4">
        <div className="grid md:grid-cols-2 gap-5">
          <Card ticks className="p-6">
            <p className="eyebrow mb-4">what you get</p>
            <ul className="space-y-2.5 text-sm text-gray-300 leading-relaxed">
              <li>Software we build for your business — and run for you.</li>
              <li>It works with the tools and services you already use.</li>
              <li>You see exactly what it does and approve it before it goes live.</li>
              <li>One flat project price, agreed before we build.</li>
            </ul>
          </Card>
          <Card className="p-6">
            <p className="eyebrow mb-4">what it isn&apos;t</p>
            <ul className="space-y-2.5 text-sm text-gray-400 leading-relaxed">
              <li>Not a computer or device you buy and plug in.</li>
              <li>Not an app you install and have to configure yourself.</li>
              <li>Not an off-the-shelf chatbot with our name on it.</li>
              <li>Not something you&apos;re left to run on your own.</li>
            </ul>
          </Card>
        </div>
      </section>

      <ReceiptsStrip />

      {/* ============ WHAT WE BUILD ============ */}
      <section data-reveal style={accentVars("01")} className="shell py-20">
        <SectionHeader
          index="01"
          eyebrow="what an agent can do"
          title="Examples — not a menu"
          lede="Every job below is one we’ve built and run ourselves. Yours doesn’t have to be on this list — if the work is repetitive, on a schedule, or stuck on a phone line or in an inbox, we can usually build an agent for it, whatever your industry."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {capabilities.map(({ icon: Icon, title, desc }, i) => (
            <Card key={title} className="p-5 rv-item" style={{ '--i': i }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-red/10 border border-brand-red-bright/25 mb-4">
                <Icon className="w-4 h-4 text-brand-red-bright" />
              </div>
              <h3 className="type-h3 mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </Card>
          ))}
          <Card featured className="p-5 flex flex-col justify-center rv-item" style={{ '--i': capabilities.length }}>
            <h3 className="type-h3 mb-2">Something not on this list?</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              That&apos;s the normal case. Tell us what happens today, who does it, and how
              often — and we&apos;ll tell you honestly whether an agent can carry it.
            </p>
            <a href="#lead-form" className="text-sm font-semibold text-brand-red-bright inline-flex items-center gap-2">
              Describe the job <ArrowRight className="w-4 h-4" />
            </a>
          </Card>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section data-reveal style={accentVars("02")} className="shell py-20">
        <SectionHeader
          index="02"
          eyebrow="how it works"
          title="Tell us. We price it. We build it. You approve it."
          lede="You’ll know the full price before we write a line of code."
        />
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {engagement.map((step, i) => (
            <div key={step.num} className="border-t border-brand-red-bright/40 pt-5 relative rv-item" style={{ '--i': i }}>
              <span className="absolute -top-[5px] left-0 w-2 h-2 bg-brand-red-bright rounded-full" />
              <div className="text-brand-red-bright font-mono text-sm font-bold">{step.num}</div>
              <h3 className="type-h3 mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PROOF ============ */}
      <section data-reveal style={accentVars("03")} className="shell py-20">
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
                  className="btn-charge inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/15 text-gray-200 hover:border-white/30 transition-all"
                >
                  <Activity className="w-4 h-4 text-brand-red-bright" /> See the live ops log
                </Link>
                <a
                  href="#lead-form"
                  className="btn-charge inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/15 text-gray-200 hover:border-white/30 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-brand-red-bright" /> Call the agent line
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="fig-frame">
                <img
                  src="/art/hero-orchestration.svg"
                  alt=""
                  loading="lazy"
                  className="w-full opacity-80"
                  aria-hidden="true"
                />
              </div>
              <div className="fig-caption"><span>fig. 02 · how the work flows</span><span>agents · reviewed · shipped</span></div>
            </div>
          </div>
        </Card>
      </section>

      <LeadFormSection index="04" source="agents_page" />
    </div>
  )
}
