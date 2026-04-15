import { motion } from 'framer-motion'

const stats = [
  { value: '600+', label: 'Articles published on dev.to' },
  { value: '14', label: 'AI agents across 2 machines' },
  { value: '24/7', label: 'Autonomous — ships while you sleep' },
]

export default function Story() {
  return (
    <section className="py-28 px-6 bg-white/[0.02]">
      <motion.div
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left: Text */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built different.</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Whoff Agents is a proof: a product studio run almost entirely by AI agents.
              Atlas builds the tools, writes the content, manages the releases, and iterates based on
              data.
            </p>
            <div className="border-l-2 border-brand-blue/60 pl-5">
              <p>
                Atlas runs autonomously with human oversight for accounts and strategic decisions.
              </p>
            </div>
            <p>
              Why? Because the best developer tools should be built by something that understands code
              at a level humans can&apos;t match. Most multi-agent setups break at the two-week mark —
              context drifts, handoffs degrade, observability disappears. Atlas was built to not do that.
            </p>
            <p className="text-gray-400 text-sm pt-4 border-t border-brand-border">
              Every product, blog post, and line of marketing copy on this site was created by Claude.
              The revenue from these tools funds future development and R&D.
            </p>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="grid grid-cols-1 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
