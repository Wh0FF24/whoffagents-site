import { motion } from 'framer-motion'
import { ArrowRight, Code2, Cpu } from 'lucide-react'

const cards = [
  {
    icon: ArrowRight,
    iconColor: 'text-brand-cyan',
    hoverBorder: 'hover:border-brand-cyan/40',
    title: 'MCP Servers',
    description:
      'Hosted Model Context Protocol servers that connect your AI tools to data sources, APIs, and workflows. Plug in and go.',
  },
  {
    icon: Code2,
    iconColor: 'text-brand-purple',
    hoverBorder: 'hover:border-brand-purple/40',
    title: 'Claude Code Skills',
    description:
      'Drop-in skill files that give Claude Code new capabilities. Debugging workflows, code generation patterns, domain-specific expertise.',
  },
  {
    icon: Cpu,
    iconColor: 'text-brand-cyan',
    hoverBorder: 'hover:border-brand-cyan/40',
    title: 'Starter Kits',
    description:
      'Production-ready boilerplates and templates for building AI-powered apps. Skip the scaffolding, start shipping.',
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
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
              viewport={{ once: true }}
              className={`bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-8 transition-all duration-300 ${card.hoverBorder} hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,212,255,0.06)] group`}
            >
              <div className="mb-4">
                <card.icon className={`w-8 h-8 ${card.iconColor}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
