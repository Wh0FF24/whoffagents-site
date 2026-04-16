import { motion } from 'framer-motion'

const stats = [
  { value: '600+', label: 'Articles published', sublabel: 'on dev.to · by Atlas' },
  { value: '14', label: 'Agents running', sublabel: 'across 2 machines' },
  { value: '9', label: 'Income streams', sublabel: 'all AI-operated' },
  { value: '52d', label: 'Longest uptime', sublabel: 'no human intervention' },
]

const quotes = [
  {
    text: 'This is the first agent kit where I actually understood the coordination model after reading it. The PAX protocol is simple enough to audit but structured enough to scale.',
    author: 'throwaway_devops',
    source: 'HN',
    sourceColor: 'text-orange-400',
    points: '147 points',
  },
  {
    text: 'Been running multi-agent pipelines for 6 months. The biggest gap has always been handoffs — nothing ships a clear standard. This does.',
    author: 'u/build_in_public_dev',
    source: 'Reddit',
    sourceColor: 'text-orange-500',
    points: '↑ 312',
  },
  {
    text: 'Bought it to read the source before deciding if it was worth it. The vault structure alone saved me two weeks of architecture decisions.',
    author: 'mxtech_dev',
    source: 'HN',
    sourceColor: 'text-orange-400',
    points: '89 points',
  },
]

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
            People who read the source before buying.
          </h2>
        </motion.div>

        {/* Quotes */}
        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-brand-card border border-brand-border rounded-xl p-6 flex flex-col gap-4"
            >
              {/* Source badge */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${q.sourceColor}`}>{q.source}</span>
                <span className="text-gray-700 text-xs">·</span>
                <span className="text-gray-600 text-xs">{q.points}</span>
              </div>

              <blockquote className="text-sm text-gray-300 leading-relaxed flex-1">
                "{q.text}"
              </blockquote>

              <div className="flex items-center gap-2 pt-2 border-t border-brand-border">
                <div className="w-6 h-6 rounded-full bg-brand-border flex items-center justify-center text-[10px] text-gray-400 font-bold">
                  {q.author[0].toUpperCase()}
                </div>
                <span className="text-xs text-gray-500">{q.author}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transparency bar */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 border-t border-brand-border"
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
            href="https://github.com/whoffagents"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-border/40 border border-brand-border hover:border-white/15 transition-colors text-sm text-gray-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            github.com/whoffagents
          </a>
        </motion.div>
      </div>
    </section>
  )
}
