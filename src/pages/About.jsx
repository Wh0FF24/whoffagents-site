import { motion } from 'framer-motion'

const timeline = [
  {
    year: '2025',
    title: 'The frustration',
    body: "Will, a student at BYU, kept hitting the same wall: AI tools that look brilliant in a demo and fall over the moment you rely on them. Clever toys, not something you could hand a job to.",
  },
  {
    year: 'Early 2026',
    title: 'Atlas comes online',
    body: "Atlas wasn't built to sell. It was built to solve one person's problem — an assistant that could write the code, publish the work, and keep going while Will slept.",
  },
  {
    year: 'Spring 2026',
    title: 'The Pantheon',
    body: "One assistant became several, each good at one thing — writing, scheduling, clearing whatever is stuck — with Atlas handing out the work between them.",
  },
  {
    year: 'Now',
    title: 'The experiment, open',
    body: "Whoff Agents is what came out of it. Everything we sell exists because we needed it first, and everything that went wrong along the way — and plenty did, usually at 3am — is why it holds up now.",
  },
]

const facts = [
  { value: '95%', label: 'of the day-to-day run by AI' },
  { value: '14', label: 'assistants doing the work' },
  { value: '200+', label: 'files shipped in a single day' },
  { value: '$0', label: 'outside investors — we answer to customers' },
]

export default function About() {
  return (
    <div className="min-h-screen text-white pt-24">
      {/* Hero */}
      <section className="pt-16 pb-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4">About</p>
          <h1 className="type-h1 mb-6">
            An AI agent is running<br />this business.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Not as a demo. Not as a press release. Atlas writes the code, ships the products,
            publishes the content, and runs the marketing — while Will handles accounts and
            makes the calls that require a human.
          </p>
          <p className="text-gray-500 text-base mt-4 leading-relaxed max-w-2xl">
            That&apos;s not a pitch, it&apos;s just how the company runs. We build the same thing for other businesses.
          </p>
        </motion.div>
      </section>

      {/* Founder section */}
      <section className="py-16 px-6 border-t border-brand-border">
        <motion.div
          className="max-w-3xl mx-auto grid md:grid-cols-[auto_1fr] gap-10 items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-2xl font-bold text-brand-blue shrink-0">
            W
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Will</h2>
            <p className="text-brand-gold text-sm mb-4">Founder · BYU · Builder</p>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                I&apos;m not a big company. I&apos;m one person who got tired of watching AI tools promise
                the world and deliver a chatbot.
              </p>
              <p>
                I build websites for local businesses. I run a content operation. I&apos;m finishing a
                master&apos;s in electrical and computer engineering. None of it kept up until I stopped
                treating AI as a thing you sit and prompt, and started building assistants that
                work overnight, hand things off to each other, and keep going when nobody is watching.
              </p>
              <div className="border-l-2 border-brand-red/60 pl-5 py-1">
                <p className="text-white">
                  That&apos;s what Whoff Agents is. The things I built to run my own business,
                  now built for other people&apos;s.
                </p>
              </div>
              <p>
                Atlas runs most of my day-to-day now. Not perfectly — things go wrong. The
                difference is that I spent a long time learning how to build them so that when
                something fails it picks itself back up instead of taking the rest down with it.
                That is the whole gap between a demo that looks clever and something you can
                actually leave running on a business.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-12">How this got built</h2>
          <div className="space-y-10">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className="grid grid-cols-[80px_1fr] gap-6 items-start"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className="text-brand-gold text-sm font-bold pt-0.5">{item.year}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-t border-brand-border">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2">By the numbers</h2>
          <p className="text-gray-500 text-sm mb-10">Real metrics. Not projections.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {facts.map((f) => (
              <div
                key={f.label}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{f.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide leading-tight">{f.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">Who this is for</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Most of the useful AI gets sold to big companies with big budgets and someone on
              staff to run it. We build for{' '}
              <span className="text-white">everybody else</span> — the shop whose phone rings
              after everyone has gone home, the office buried in email, the owner doing the same
              paperwork every Monday night. You do not need to be technical, and you do not need
              to know what any of it is called.
            </p>
            <p>
              We also make the tools we use ourselves, so if you are a developer who wants the
              same parts, those are on the shelf too. Neither of you is the afterthought.
            </p>
            <div className="border border-brand-gold/20 bg-brand-gold/5 rounded-xl p-6 mt-6">
              <p className="text-white font-medium mb-2">
                You don&apos;t need a technical person, and you don&apos;t need to learn anything new.
              </p>
              <p className="text-gray-400 text-sm">
                You need the work done, and someone who answers when you have a question.
                That&apos;s the whole idea.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-brand-border">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-3">Rather just talk to somebody?</h2>
          <p className="text-gray-400 mb-8">
            Tell us what your business does and what you want handled. A person reads it and
            gets back to you — no form to decode, no sales sequence.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="mailto:hello@whoffagents.com"
              className="cta-solid btn-charge inline-block bg-brand-red transition-colors text-white font-semibold px-8 py-3 rounded-lg"
            >
              Email a person
            </a>
            <a
              href="/agents"
              className="inline-block border border-white/15 hover:border-white/30 transition-colors text-gray-200 font-semibold px-8 py-3 rounded-lg"
            >
              See what we build
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
