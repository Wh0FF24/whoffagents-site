import { motion } from 'framer-motion'

const pains = [
  {
    icon: '⟳',
    iconColor: 'text-brand-red',
    borderColor: 'hover:border-brand-red/40',
    glowColor: 'hover:shadow-[0_0_30px_rgba(200,16,46,0.08)]',
    quote: '"By day 3 my agents were overwriting each other\'s output. No errors. Just silently wrong results."',
    source: 'HN thread · Ask HN: Why do my multi-agent pipelines degrade?',
    label: 'Context Overwrite',
    body: 'Without a coordination protocol, agents share no ground truth. Each one rewrites state from its own partial context.',
  },
  {
    icon: '⚡',
    iconColor: 'text-brand-gold',
    borderColor: 'hover:border-brand-gold/40',
    glowColor: 'hover:shadow-[0_0_30px_rgba(255,184,28,0.08)]',
    quote: '"Handoffs break at the 3rd or 4th exchange. The second agent never has enough context from the first."',
    source: 'r/ClaudeAI · Multi-agent coordination problems',
    label: 'Lossy Handoffs',
    body: 'Every agent-to-agent transfer drops context. Sparse spawn prompts mean downstream agents start half-blind.',
  },
  {
    icon: '◌',
    iconColor: 'text-brand-blue-light',
    borderColor: 'hover:border-brand-blue-light/40',
    glowColor: 'hover:shadow-[0_0_30px_rgba(0,98,184,0.08)]',
    quote: '"I ran agents overnight. Came back to 47 identical articles and $80 in API bills."',
    source: 'Discord · Claude Code community',
    label: 'Zero Observability',
    body: 'No session persistence, no crash recovery, no audit trail. You don\'t know what happened until it\'s too late.',
  },
  {
    icon: '↯',
    iconColor: 'text-brand-silver',
    borderColor: 'hover:border-brand-silver/30',
    glowColor: 'hover:shadow-[0_0_30px_rgba(192,192,192,0.05)]',
    quote: '"Context drift isn\'t dramatic. Your agents just slowly stop knowing what they were doing."',
    source: 'HN · Show HN: My agent system after 2 weeks',
    label: 'Drift Accumulation',
    body: 'Context degrades quietly across long runs. By hour 6 your orchestrator is navigating by memory fragments.',
  },
]

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export default function PainPoints() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3">
            The real problem
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Agent systems don't fail loudly.<br className="hidden md:block" /> They fail quietly.
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed">
            Most agent kits solve the easy part — spawning agents. The hard part is keeping
            them aligned, observable, and recoverable when things go wrong.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.label}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0 }}
              className={`group relative bg-brand-card border border-brand-border rounded-xl p-6 transition-all duration-300 ${pain.borderColor} ${pain.glowColor}`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-2xl font-bold leading-none mt-0.5 flex-shrink-0 w-8 ${pain.iconColor}`}>
                  {pain.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold tracking-wider uppercase mb-3 ${pain.iconColor}`}>
                    {pain.label}
                  </div>
                  <blockquote className="text-sm text-gray-300 leading-relaxed mb-3 italic">
                    {pain.quote}
                  </blockquote>
                  <p className="text-[11px] text-gray-600 mb-4">{pain.source}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{pain.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
