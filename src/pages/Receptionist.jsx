/**
 * /receptionist — the AI phone receptionist package, sold honestly.
 *
 * Every claim on this page traces to something we run or something Will
 * decided, and nothing else is on it:
 *   - the line, the number, and what it does/refuses  → Ops/phone/RECEPTIONIST.md,
 *     Ops/ORG.md ("Whoff Receptionist", assistant on +1 385-318-0061)
 *   - the pricing shape (setup + monthly service fee + usage passed through
 *     at cost on the customer's own account, never a subscription we absorb)
 *     → Will, 2026-09-07: "sell it as custom quote with cost passed through
 *     or BYO subscription, never absorb subscriptions per customer"
 *   - the $500 one-time setup is the same figure and the same Stripe link
 *     already live on /agents — not a new number invented here
 *
 * Deliberately absent: testimonials, call counts, customer counts, and a
 * recorded sample call. We have no recording on disk, so there is no audio
 * element rather than a staged one. The live number is the demo.
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PhoneCall, ArrowRight } from 'lucide-react'
import Card, { SectionHeader, accentVars } from '../components/ui/Card'
import { LeadFormSection } from '../components/studio/StudioSections'
import { initReveal } from '../utils/reveal'

const PHONE_DISPLAY = '+1 385-318-0061'
const PHONE_HREF = 'tel:+13853180061'

const callSteps = [
  {
    t: 'it rings',
    h: 'It picks up and says what it is.',
    s: 'First thing out of its mouth is that it is an AI receptionist, not a person. Nobody works that out halfway through the call and feels tricked.',
  },
  {
    t: 'the middle',
    h: 'It gets the four things that matter.',
    s: 'Business name, caller’s name, what they actually need, and the best email to reach them. It answers what it has been told and takes a message on anything else.',
  },
  {
    t: 'after',
    h: 'The call is written down and answered.',
    s: 'The transcript and the intake land in our log, and a human-directed reply goes out by email. On our own line that reply goes within the hour.',
  },
]

const does = [
  'Answers every call, including the ones after hours and the ones you are already on the phone for.',
  'Tells the caller up front it is an assistant.',
  'Captures the business, the name, the need, and the email.',
  'Writes down the whole call — you read the transcript, not a guess about it.',
  'Says it does not know rather than inventing an answer.',
]

const doesNot = [
  'Does not quote a price beyond the ones you have given it.',
  'Does not negotiate, discount, or match a competitor.',
  'Does not claim work has been started, booked, or finished.',
  'Does not take card or payment details, ever.',
  'Does not transfer the call — it takes the message and hands it on.',
]

export default function Receptionist() {
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
          <p className="eyebrow mb-6">ai phone receptionist · call it right now</p>
          <h1 className="type-display mb-8 anim-rise">
            The call you
            <br />
            <span className="text-brand-red-bright">didn&apos;t answer.</span>
          </h1>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-start">
            <div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-5 anim-rise anim-d2">
                An AI that answers your business line in a natural speaking voice. It picks
                up when you can&apos;t, finds out who is calling and what they want, gets
                their email, and hands you a written summary. No phone tree, no hold music,
                no voicemail nobody checks.
              </p>
              <p className="text-gray-400 leading-relaxed max-w-xl mb-8 anim-rise anim-d2">
                <span className="text-white font-medium">There is nothing to install and no hardware to buy.</span>{' '}
                It runs on our systems and we look after it once it is live.
              </p>
              <div className="flex flex-wrap gap-3 anim-rise anim-d3">
                <a
                  href={PHONE_HREF}
                  className="cta-solid btn-charge inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-white bg-brand-red transition-all duration-200"
                >
                  <PhoneCall className="w-5 h-5" /> Call {PHONE_DISPLAY}
                </a>
                <a
                  href="#lead-form"
                  className="btn-charge inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 border border-white/10 hover:border-white/25 transition-all duration-200"
                >
                  Get a quote <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <p className="mono-note mt-6 anim-rise anim-d4">
                that number is our own line — the receptionist that answers it is the same one we would build for you
              </p>
            </div>

            {/* The demo is the phone number, not a produced clip. We have no
                recording of a real customer call, so there is no player here. */}
            <div className="anim-rise anim-d3">
              <Card ticks className="p-8 text-center">
                <p className="eyebrow mb-6">hear it before you buy anything</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                  We are not going to play you a polished clip we recorded ourselves. Call
                  the line and try to trip it up — ask it something awkward, ask for a price,
                  ask for a human. What you hear is what your customers would hear.
                </p>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-lg bg-black/40 border border-white/10 hover:border-brand-red-bright/50 transition-all font-mono text-lg text-white"
                >
                  <PhoneCall className="w-5 h-5 text-brand-red-bright" />
                  {PHONE_DISPLAY}
                </a>
                <p className="mono-note mt-4">an AI answers · say so if you want a human and we&apos;ll email you</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ONE CALL, START TO FINISH ============ */}
      <section data-reveal className="shell pt-4 pb-2">
        <p className="eyebrow mb-3">what actually happens · one call</p>
        <p className="text-gray-400 leading-relaxed max-w-2xl mb-8">
          There is no clever part. It is one job, done every time, without anyone
          having to be there.
        </p>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {callSteps.map((step, i) => (
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
      </section>

      {/* ============ 01 — DOES / DOESN'T ============ */}
      <section data-reveal style={accentVars('01')} className="shell py-20">
        <SectionHeader
          index="01"
          eyebrow="the rules it runs on"
          title="What it does, and what it will never do"
          lede="A receptionist that improvises is a liability. Ours is built to capture and hand off — the boundaries below are written into it, not left to its judgment on the call."
        />
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          <Card ticks className="p-6">
            <p className="eyebrow mb-4">what it does</p>
            <ul className="space-y-2.5 text-sm text-gray-300 leading-relaxed">
              {does.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </Card>
          <Card className="p-6">
            <p className="eyebrow mb-4">what it never does</p>
            <ul className="space-y-2.5 text-sm text-gray-400 leading-relaxed">
              {doesNot.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </Card>
        </div>
      </section>

      {/* ============ 02 — PRICING.
           Three parts, kept separate on purpose: a one-time setup, a monthly
           service fee, and the metered usage passed through at cost. We do not
           put a subscription of ours in the middle of yours. ============ */}
      <section data-reveal style={accentVars('02')} className="shell py-20">
        <SectionHeader
          index="02"
          eyebrow="what it costs"
          title="Setup, a service fee, and the usage at cost"
          lede="Voice AI is metered — every minute it spends on the phone costs real money to somebody. Most sellers bury that in a flat monthly number and take the spread. We split it out so you can see which part is us and which part is the meter."
        />
        <Card featured ticks className="p-6 md:p-9 mt-10">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-8 items-start">
            <div>
              <div className="space-y-6">
                <div>
                  <p className="type-h3 mb-1.5">
                    Setup — <span className="text-brand-red-bright">$500</span>, one time
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    We set up the number, teach it your business, write what it says when it
                    picks up, decide who gets which call, and run a live test call with you
                    before it ever speaks to a customer. This is not a subscription and it is
                    the same $500 already listed on our{' '}
                    <Link to="/agents" className="underline underline-offset-2">agents page</Link>.
                  </p>
                </div>
                <div>
                  <p className="type-h3 mb-1.5">A monthly service fee — quoted for your business</p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Keeping your receptionist configured, updated when your business changes,
                    and watched while it runs. We quote it once we know what you want it to
                    handle. We do not publish a figure here because we would be making it up
                    before knowing your job — tell us the job and you get the number before
                    you commit to anything.
                  </p>
                </div>
                <div>
                  <p className="type-h3 mb-1.5">The usage, passed through at cost</p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    The phone minutes and the AI itself are metered. That bill goes on your
                    own account — either one we set up in your name, or your existing
                    subscription if you already have one. You pay the provider what the
                    provider charges. We take no cut of it and we never absorb it into a
                    plan of ours, which is the only way this stays honest as your call
                    volume moves.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
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
                  Ask for the full quote first
                </a>
              </div>
            </div>
            <div>
              <p className="mono-note leading-relaxed">
                for scale: an assistant like this costs us roughly $10&ndash;40 a month in
                metered model usage at our own volume. yours depends entirely on how much
                your phone rings, which is exactly why we will not sell you a flat number
                for it.
              </p>
              <p className="mono-note leading-relaxed mt-4">
                anything past answering the phone &mdash; email, texts, calendars, records &mdash;
                is quoted as its own project.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* ============ 03 — WHAT WE'RE NOT CLAIMING.
           The section a normal vendor deletes. It is here because every number
           we could put on this page would have to be invented. ============ */}
      <section data-reveal style={accentVars('03')} className="shell py-20">
        <SectionHeader
          index="03"
          eyebrow="the part other pages leave out"
          title="What we are not claiming"
          lede="This line went live in September 2026. It is new, and pretending otherwise would be the first thing we got wrong."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {[
            {
              h: 'No testimonials',
              d: 'We have not put quotes on this page, because we do not have customer quotes for this product yet. When we do, they will have names on them.',
            },
            {
              h: 'No call statistics',
              d: 'No "10,000 calls answered", no percentages, no captured-revenue figure. We are not going to hand you arithmetic we made up.',
            },
            {
              h: 'No recorded sample call',
              d: 'A recording we produced ourselves proves nothing anyway. The number at the top is live — that is the demo, and it is the same line we run our own business on.',
            },
            {
              h: 'It is intake, not sales',
              d: 'It takes the message and hands it to a person. It is not going to close a deal for you on the phone, and we would not sell you one that claimed to.',
            },
            {
              h: 'You approve it before customers hear it',
              d: 'You call it, try to break it, and sign off. Nothing reaches a real customer until you say it is ready — and you can switch it off at any time.',
            },
            {
              h: 'A human owns the judgment',
              d: 'Agents do the work here and a person reviews what ships. That is how our own company runs, and it is the same arrangement we build for you.',
            },
          ].map((c, i) => (
            <Card key={c.h} className="p-5 rv-item" style={{ '--i': i }}>
              <h3 className="type-h3 mb-2">{c.h}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{c.d}</p>
            </Card>
          ))}
        </div>
        <p className="mono-note mt-6">
          how your callers&apos; details are handled is in our{' '}
          <Link to="/privacy" className="underline underline-offset-2">privacy policy</Link>
        </p>
      </section>

      {/* ============ CLOSING CALL BAR ============ */}
      <section data-reveal className="shell pb-4">
        <Card ticks className="p-8 text-center">
          <p className="eyebrow mb-5">the shortest way to judge this</p>
          <h2 className="type-h2 mb-5">Call it. Decide after.</h2>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-3 px-7 py-4 rounded-lg bg-black/40 border border-white/10 hover:border-brand-red-bright/50 transition-all font-mono text-lg text-white"
          >
            <PhoneCall className="w-5 h-5 text-brand-red-bright" />
            {PHONE_DISPLAY}
          </a>
          <p className="mono-note mt-4">no form to fill in first · no hold music · it will tell you it&apos;s an AI</p>
        </Card>
      </section>

      <LeadFormSection index="04" source="receptionist_page" />
    </div>
  )
}
