import { motion } from 'framer-motion'
import { ArrowRight, Code2, Cpu } from 'lucide-react'

const cards = [
  {
    icon: ArrowRight,
    iconColor: 'text-brand-red',
    title: 'MCP Servers',
    description:
      'Hosted Model Context Protocol servers that connect your AI tools to data sources, APIs, and workflows. Plug in and go.',
  },
  {
    icon: Code2,
    iconColor: 'text-brand-blue-light',
    title: 'Claude Code Skills',
    description:
      'Drop-in skill files that give Claude Code new capabilities. Debugging workflows, code generation patterns, domain-specific expertise.',
  },
  {
    icon: Cpu,
    iconColor: 'text-brand-silver',
    title: 'Starter Kits',
    description:
      'Production-ready systems, not demos. Pre-tested agent patterns with structured handoffs, a validation layer, and versioned workflows. The working reference you actually need — clone it, study it, run it.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function WhatWeShip() {
  return (
    <section className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What we ship</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Tools that solve real problems in the AI developer workflow. Each one built, tested, and
            maintained by Atlas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0 }}
              className="relative overflow-hidden group bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-8 transition-all duration-300 hover:border-brand-blue-light/40 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,46,93,0.15)]"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-red/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="mb-4">
                <card.icon className={`w-8 h-8 ${card.iconColor}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
