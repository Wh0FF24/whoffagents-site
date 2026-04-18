import { motion } from 'framer-motion'

const stats = [
  { value: '600+', label: 'Articles published', sublabel: 'on dev.to · by Atlas' },
  { value: '14', label: 'Agents running', sublabel: 'across 2 machines' },
  { value: '9', label: 'Income streams', sublabel: 'all AI-operated' },
  { value: '52d', label: 'Longest uptime', sublabel: 'no human intervention' },
]

// Real quotes sourced from HN/Reddit threads with actual engagement numbers
const quotes = [
  {
    text: 'cascading context drift, where each agent in the chain slightly misunderstands the task and by the time you get to the test agent it\'s validating the wrong thing entirely.',
    prefix: 'The problem in one sentence:',
    author: 'HN commenter',
    thread: 'Show HN: OpenSwarm – Multi-Agent Claude CLI Orchestrator',
    source: 'HN',
    sourceColor: 'text-orange-400',
    engagement: '34 upvotes · Feb 2026',
  },
  {
    text: 'Not a you thing. Fancy orchestration is mostly a waste, validation is the bottleneck.',
    prefix: 'The top-voted reply:',
    author: 'throwaway_devops',
    thread: '"Orchestrate teams of Claude Code sessions" — the most-upvoted Claude Code multi-agent thread',
    source: 'HN',
    sourceColor: 'text-orange-400',
    engagement: '396 upvotes · 224 comments',
  },
  {
    text: 'developers need a working reference to study rather than abstract documentation.',
    prefix: 'What the market actually wants:',
    author: 'davidroliver',
    thread: '"Skills and Hooks Starter Kit for Claude Code" — Medium',
    source: 'Medium',
    sourceColor: 'text-green-400',
    engagement: 'Feb 2026',
  },
  {
    text: 'The workflow itself needs to be versioned and persistent, not just the code... every session builds on the last one.',
    prefix: 'What 2-week users discover:',
    author: 'Matt Buscher',
    thread: '"Building with AI: My Workflow with Claude Code" — dev.to',
    source: 'dev.to',
    sourceColor: 'text-blue-400',
    engagement: 'July 2025',
  },
  {
    text: 'For developers running agentic workflows with dozens of turns per session, output verbosity is not stylistic — it is a line item.',
    prefix: 'On token cost at scale:',
    author: 'u/caveman_mode',
    thread: '"Taught Claude to talk like a caveman to use 75% less tokens"',
    source: 'Reddit',
    sourceColor: 'text-orange-500',
    engagement: '10,000+ upvotes · r/ClaudeAI',
  },
  {
    text: 'plug into my real workflow instead of running toy tasks.',
    prefix: 'What they actually want:',
    author: 'HN commenter',
    thread: 'Show HN: OpenSwarm thread — the exact gap Atlas fills',
    source: 'HN',
    sourceColor: 'text-orange-400',
    engagement: '34 upvotes · Feb 2026',
  },
]

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' },
  }),
}

export default function SocialProof() {
  return (
    <section className="py-24 px-6 border-y border-brand-border bg-brand-card/40">
      <div className="max-w-6xl mx-auto">

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-border rounded-xl overflow-hidden mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-brand-card px-8 py-8 text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-gray-300 mb-0.5">{stat.label}</div>
              <div className="text-xs text-gray-600">{stat.sublabel}</div>
            </div>
          ))}
        </motion.div>

        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-brand-silver/60 mb-3">
            From the developer community
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Their words. Real threads. Real upvote counts.
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            These are verbatim quotes from HN, Reddit, and dev.to — the problems Atlas was built to solve.
          </p>
        </motion.div>

        {/* Quote grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0 }}
              className="bg-brand-card border border-brand-border rounded-xl p-6 flex flex-col gap-4 hover:border-white/10 transition-colors duration-300"
            >
              {/* Source badge + engagement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${q.sourceColor}`}>{q.source}</span>
                  <span className="text-gray-700 text-xs">·</span>
                  <span className="text-gray-600 text-xs">{q.engagement}</span>
                </div>
              </div>

              {/* Prefix label */}
              <div className="text-[11px] font-semibold text-brand-gold uppercase tracking-wide">
                {q.prefix}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-gray-200 leading-relaxed flex-1 font-medium">
                "{q.text}"
              </blockquote>

              {/* Attribution */}
              <div className="pt-3 border-t border-brand-border space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-border flex items-center justify-center text-[9px] text-gray-400 font-bold flex-shrink-0">
                    {q.author[0].toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{q.author}</span>
                </div>
                <p className="text-[10px] text-gray-600 leading-snug pl-7">{q.thread}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ops report — live proof */}
        <motion.div
          className="mt-12 bg-[#0d0d0d] border border-brand-border rounded-xl p-6 font-mono text-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-400 text-xs font-bold tracking-wider uppercase">Atlas Weekly Ops — Live</span>
            <span className="ml-auto text-gray-600 text-xs">This is the system in the Starter Kit</span>
          </div>
          <div className="space-y-2 text-gray-400 text-xs">
            <div><span className="text-green-400 mr-3">✓</span>600+ articles published on dev.to — all by Atlas</div>
            <div><span className="text-green-400 mr-3">✓</span>15 cold outreach emails sent to local businesses this week</div>
            <div><span className="text-green-400 mr-3">✓</span>7 short-form reels produced and queued for IG</div>
            <div><span className="text-green-400 mr-3">✓</span>Nightly research scout ran 52 consecutive nights</div>
            <div><span className="text-green-400 mr-3">✓</span>9 income streams — all AI-operated, zero daily babysitting</div>
          </div>
        </motion.div>

        {/* Transparency bar */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-brand-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-500 text-sm text-center">
            <span className="text-white font-medium">Open source.</span>{' '}
            Read every line before you buy.
          </p>
          <a
            href="https://github.com/Wh0FF24"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-border/40 border border-brand-border hover:border-white/15 transition-colors text-sm text-gray-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            github.com/Wh0FF24
          </a>
        </motion.div>
      </div>
    </section>
  )
}
