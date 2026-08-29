/**
 * /agents — Custom AI agents, sold the honest way.
 * Consultative service: inquire → scope → build → approve. No invented
 * price points, no retainer figures, no delivery-date promises. Every
 * capability listed is something the org has demonstrably built and runs.
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PhoneCall, Mail, MessageSquare, CalendarClock, CalendarCheck, Table2, Wrench, ArrowRight, Activity,
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
    desc: 'A natural speaking voice on your line — not a phone tree — that picks up every call, takes messages, gets the caller’s details down, and books callbacks — day or night, no hold music.',
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
    icon: CalendarCheck,
    title: 'It books jobs into your calendar',
    desc: 'Checks what’s free, books the slot, sends the confirmation, and puts it on the calendar your office already uses — then sends a reminder the day before.',
  },
  {
    icon: Table2,
    title: 'It keeps your records up to date',
    desc: 'Takes what comes in on the phone or by email and puts it where it belongs — your customer list, a spreadsheet, a job sheet — so nobody has to retype it later.',
  },
  {
    icon: CalendarClock,
    title: 'It does the repeat work',
    desc: 'The tasks that come round every day or every week — reminders, follow-ups, chasing a quote nobody answered, the same report every Monday — done without anyone having to remember.',
  },
  {
    icon: Wrench,
    title: 'It works with your tools',
    desc: 'Our own agents already run on email, phone and text every day. For your build we connect to what you use — your calendar, your spreadsheets, your customer list. Name the software and we’ll tell you yes or no before you pay anything.',
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
                a job you&apos;d otherwise hire someone to do. It answers your phone in a natural speaking
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
                Ask for a live demo call in the inquiry — you&apos;ll hear exactly what your customers would hear, before you spend a dollar
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

      {/* ============ WHAT IT LOOKS LIKE — the plain-English story.
           Deliberately NOT a schematic: the hero diagram is desktop-only and
           reads as equipment to a non-technical visitor, so the actual
           explanation has to live in words, on every screen size. ============ */}
      <section data-reveal className="shell pt-4 pb-2">
        <p className="eyebrow mb-3">an example · one call, start to finish</p>
        <p className="text-gray-400 leading-relaxed max-w-2xl mb-8">
          Say you asked us for the simplest version: something to answer the phone when nobody
          is there to pick it up. Here is the whole thing, from the ring to your morning coffee.
        </p>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              t: 'step 1 · 6:40 pm',
              h: 'The phone rings after hours.',
              s: 'Everyone has gone home. Right now that call goes to voicemail — or to whichever competitor picks up next.',
            },
            {
              t: 'step 2 · same call',
              h: 'It picks up and takes care of the caller.',
              s: 'Gets their name, their number, and what they need — answers what it has been told, and books them in.',
            },
            {
              t: 'step 3 · 7:02 am',
              h: 'You read it over coffee.',
              s: 'Who called, what they wanted, and when they are booked. You did not lose the job and nobody stayed late.',
            },
          ].map((step, i) => (
            <div key={step.t} className="rv-item relative pt-5" style={{ '--i': i }}>
              <span className="absolute top-0 left-0 right-0 h-px bg-white/10" />
              <span
                className="absolute -top-[2px] left-0 w-[5px] h-[5px]"
                style={{ background: 'var(--sec-accent, #E5484D)' }}
                aria-hidden="true"
              />
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-gray-400 mb-3">
                {step.t}
              </div>
              <p className="type-h3 mb-2">{step.h}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{step.s}</p>
            </div>
          ))}
        </div>
        <p className="mono-note mt-6">
          the phone is just the most common one — the same idea covers email, texts, and the work that repeats every week
        </p>
      </section>

      {/* ============ THE PRICED ENTRY POINT.
           This product is real, fixed-scope and purchasable — it was sitting in
           the developer catalogue behind a nav item called "Dev Tools", which is
           the last place a business owner would look. It is also the only price
           on this page, and "no price anywhere" reads as "expensive". ============ */}
      <section data-reveal className="shell pt-8 pb-2">
        <Card featured ticks className="p-6 md:p-9">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-8 items-center">
            <div>
              <p className="eyebrow mb-4">start here · already built</p>
              <h2 className="type-h2 mb-4">
                If what you want is the phone answered, it&apos;s{' '}
                <span className="text-brand-red-bright">$500</span>, one time.
              </h2>
              <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">
                The most common job people ask us for is already packaged at a fixed
                price. We set up the number, teach it your business, write what it says
                when it picks up, decide who gets which call, and run a live test call
                with you before it ever speaks to a customer. It answers every call,
                works out what the job is, takes the caller&apos;s details, and emails
                you a summary.
              </p>
              <ul className="text-sm text-gray-400 leading-relaxed space-y-1.5 mb-6">
                <li>— the $500 is the setup, once. It is not a subscription.</li>
                <li>
                  — after that you pay for what it actually handles — the phone line and the
                  calls it takes. A shop getting a handful of calls a week costs very little to
                  run; a busy office answering all day costs more. We work it out from your real
                  call volume and tell you the number before you switch it on.
                </li>
                <li>— you hear it and sign off before it goes live, and you can stop any time</li>
                <li>— anything beyond answering the phone is quoted as its own project</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://buy.stripe.com/cNi7sN6J987H4rB0wJaZi0q"
                  className="cta-solid btn-charge inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-white bg-brand-red transition-all duration-200"
                >
                  Get set up — $500 <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#lead-form"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-gray-200 border border-white/15 hover:border-white/30 transition-all"
                >
                  Ask a question first
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="mono-note leading-relaxed">
                everything else on this page — email, texts, calendars, records, the
                repeat work — is quoted per project, because what it costs depends
                entirely on what you want it to do. tell us the job and we&apos;ll send
                the number before you commit to anything.
              </p>
            </div>
          </div>
        </Card>
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

      {/* ============ 03 — YOUR DATA + GETTING IT RIGHT.
           The two things owners actually worry about: a leak of their customer
           list, and an AI confidently telling a customer something untrue. ============ */}
      <section data-reveal style={accentVars("03")} className="shell py-20">
        <SectionHeader
          index="03"
          eyebrow="the two things everyone asks"
          title="Your customers' details, and getting it right"
          lede="Two fair questions before you let anything talk to your customers: what happens to their information, and what happens when it doesn't know the answer. Here are ours, in plain terms."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {[
            {
              h: 'It only sees what you allow',
              d: 'You decide what it can reach — one inbox, one calendar, one spreadsheet — and we put that in writing before it goes live. It cannot go looking anywhere else.',
            },
            {
              h: 'We don’t sell it or train on it',
              d: 'Your customers’ information is not sold, and it is not used to train AI models. The only places it goes are the services needed to run your agent, and we name those for you up front.',
            },
            {
              h: 'It doesn’t guess',
              d: 'Asked something it hasn’t been given an answer for, it says so, takes a message, and flags it for you. We build it to admit what it doesn’t know rather than invent something.',
            },
            {
              h: 'You read everything it did',
              d: 'Every call and message is written down in plain language where you can check it. If it gets something wrong you will see it, and we fix it.',
            },
            {
              h: 'You test it before customers do',
              d: 'You try to trip it up on real situations first — wrong prices, odd questions, angry callers. Nothing reaches a customer until you say it is ready.',
            },
            {
              h: 'You can switch it off',
              d: 'Any time, and it stops. Calls go back to however you handle them today. Nothing is locked into your business, and a person here looks after it while it runs.',
            },
            {
              h: 'It tells people it’s an assistant',
              d: 'Callers are told they are speaking to an assistant. We don’t pretend it is a person, so you never get the call from a customer who worked it out halfway through.',
            },
            {
              h: 'It can’t invent a price',
              d: 'It can only say what you gave it. No prices, no lead times, no promises you didn’t make — if you didn’t give it the answer, it takes a message instead.',
            },
            {
              h: 'A real emergency reaches you',
              d: 'You decide what counts as urgent. When it hears one, it stops taking a message and puts the call through to whoever is on call — no queue, no callback form.',
            },
          ].map((c, i) => (
            <Card key={c.h} className="p-5 rv-item" style={{ '--i': i }}>
              <h3 className="type-h3 mb-2">{c.h}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{c.d}</p>
            </Card>
          ))}
        </div>
        <p className="mono-note mt-6">
          the full detail lives in our{' '}
          <Link to="/privacy" className="underline underline-offset-2">privacy policy</Link>
        </p>
      </section>

      {/* ============ 04 — ADVICE ON ITS OWN, no build attached ============ */}
      <section data-reveal style={accentVars("04")} className="shell py-20">
        <SectionHeader
          index="04"
          eyebrow="if you're not ready to build"
          title="You can just hire the thinking"
          lede="Plenty of owners know something in their week should be automated but don't know what — or whether it's even possible yet. You can buy our time for that on its own, with no build attached."
        />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            {
              h: 'A working session on your business',
              d: 'We go through how your week actually runs and mark which jobs an agent could carry, which it couldn’t, and which one is worth doing first. You keep the notes whether or not you hire us to build anything.',
            },
            {
              h: 'A second opinion on AI you’re being sold',
              d: 'If someone has quoted you for an AI tool and you want to know whether it is real, we will tell you straight. We build this for a living, so we know what is genuinely hard and what is marketing.',
            },
            {
              h: 'Help for your own team',
              d: 'If you have technical people and would rather they built it in-house, we will advise them instead — and sell them the same tools we use ourselves. We are happy either way.',
            },
          ].map((c, i) => (
            <Card key={c.h} className="p-5 rv-item" style={{ '--i': i }}>
              <h3 className="type-h3 mb-2">{c.h}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{c.d}</p>
            </Card>
          ))}
        </div>
        <p className="mono-note mt-6">
          billed by the session and quoted before you book — ask in the form and we&apos;ll send the rate
        </p>
      </section>

      {/* ============ PROOF ============ */}
      <section data-reveal style={accentVars("05")} className="shell py-20">
        <Card ticks className="p-6 md:p-10">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-center">
            <div>
              <p className="eyebrow mb-4"><span className="text-gray-600 mr-2">05</span>the proof</p>
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
                <a
                  href="#lead-form"
                  className="btn-charge inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/15 text-gray-200 hover:border-white/30 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-brand-red-bright" /> Have an agent call you
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

      <LeadFormSection index="06" source="agents_page" />
    </div>
  )
}
