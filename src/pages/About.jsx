import { motion } from 'framer-motion'

const timeline = [
  {
    year: '2025',
    title: 'The frustration',
    body: "Will Weigeshoff, a student at BYU, kept running into the same wall: AI tools that demo beautifully and break in production. Chatbots, not infrastructure. Novelties, not systems.",
  },
  {
    year: 'Early 2026',
    title: 'Atlas comes online',
    body: "Atlas wasn't a product. It was a solution to a personal problem — an AI agent that could write code, manage releases, run content ops, and stay running while Will slept.",
  },
  {
    year: 'Spring 2026',
    title: 'The Pantheon',
    body: "One agent became many. Atlas coordinates a network — Peitho handles copy, Prometheus manages scheduling, Athena clears blockers. Each agent specialized. All crash-tolerant. The Pantheon.",
  },
  {
    year: 'Now',
    title: 'The experiment, open',
    body: "Whoff Agents is the Pantheon's output, packaged. Every tool here was built because Atlas needed it. Every lesson was learned the hard way — context drift, broken handoffs, 3am crashes. All of it's baked in.",
  },
]

const facts = [
  { value: '95%', label: 'of operations run by Atlas' },
  { value: '14', label: 'agents in the Pantheon' },
  { value: '200+', label: 'files shipped in a single day' },
  { value: '$0', label: 'VC money. Zero.' },
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
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            An AI agent is running<br />this business.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Not as a demo. Not as a press release. Atlas writes the code, ships the products,
            publishes the content, and runs the marketing — while Will handles accounts and
            makes the calls that require a human.
          </p>
          <p className="text-gray-500 text-base mt-4 leading-relaxed max-w-2xl">
            This is what we built. And we&apos;re selling you the exact infrastructure that makes it work.
          </p>
        </motion.div>
      </section>

      {/* Founder section */}
      <section className="py-16 px-6 border-t border-brand-border">
        <motion.div
          className="max-w-3xl mx-auto grid md:grid-cols-[auto,1fr] gap-10 items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-2xl font-bold text-brand-blue shrink-0">
            W
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Will Weigeshoff</h2>
            <p className="text-brand-gold text-sm mb-4">Founder · BYU · Builder</p>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                I&apos;m not a big company. I&apos;m one person who got tired of watching AI tools promise
                the world and deliver a chatbot.
              </p>
              <p>
                I trade on Polymarket. I build websites for local businesses. I run a content operation.
                None of it scaled until I stopped using AI as a tool and started building it as
                infrastructure — agents that run overnight, coordinate with each other, and keep going
                when I&apos;m not watching.
              </p>
              <div className="border-l-2 border-brand-red/60 pl-5 py-1">
                <p className="text-white">
                  That&apos;s what Whoff Agents is. The actual systems I built for myself,
                  packaged so you can use them without starting from scratch.
                </p>
              </div>
              <p>
                Atlas runs 95% of my day-to-day. Not perfectly. Sometimes it breaks. But I
                learned how to make it crash-tolerant, self-recovering, and genuinely useful —
                and those lessons are in every product here.
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
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-12">How this got built</h2>
          <div className="space-y-10">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className="grid grid-cols-[80px,1fr] gap-6 items-start"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
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
          viewport={{ once: true }}
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
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">The mission</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Most developer tools are built for developers. We&apos;re building tools for{' '}
              <span className="text-white">builders who are done waiting on a team</span> —
              solo founders, indie developers, and people running operations that used to require
              five people.
            </p>
            <p>
              The Pantheon is proof it works. Fourteen agents. Two machines. Content, code,
              marketing, support — all running on infrastructure you can replicate.
            </p>
            <div className="border border-brand-gold/20 bg-brand-gold/5 rounded-xl p-6 mt-6">
              <p className="text-white font-medium mb-2">
                You don&apos;t need a dev team. You don&apos;t need funding.
              </p>
              <p className="text-gray-400 text-sm">
                You need working infrastructure that doesn&apos;t quit when you close your laptop.
                That&apos;s what we&apos;re building here.
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
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-3">Start with what works</h2>
          <p className="text-gray-400 mb-8">
            The same starter kit Atlas was built with. Set up in 30 minutes.
          </p>
          <a
            href="/products"
            className="inline-block bg-brand-red hover:bg-red-600 transition-colors text-white font-semibold px-8 py-3 rounded-lg"
          >
            See the tools →
          </a>
        </motion.div>
      </section>
    </div>
  )
}
