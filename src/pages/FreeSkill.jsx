import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Copy, Download } from 'lucide-react'
import { useState } from 'react'
import { track } from '../utils/analytics'

// The actual head of the shipped skill file — this is what you download.
const codeExample = `---
name: context-anchor
description: Drop a working reference at any point in a
  session to prevent cascading context drift. Use when
  switching tasks, resuming after a break, or handing
  off between agents.
triggers:
  - /anchor
  - /context-anchor
---`

const features = [
  { text: 'Drop before handoffs — prevent context drift across agent boundaries' },
  { text: 'Plain-markdown skill — works anywhere Claude reads skills' },
  { text: 'Runs in 30 seconds — no setup, no boilerplate' },
  { text: 'MIT licensed — use everywhere' },
]

export default function FreeSkill() {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="pt-32 pb-32 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-16 font-mono">
          <Link to="/products" className="hover:text-gray-300 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-300">Free Skill</span>
        </div>

        {/* Hero */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-6">free skill · context-anchor</p>
          <h1 className="type-h1 mb-6">Stop losing context</h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            One free skill that prevents your agents from starting cold. Drop it before handoffs,
            breaks, or context switches — your AI keeps everything that matters.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/downloads/context-anchor-SKILL.md"
              download="SKILL.md"
              onClick={() => track('FreeSkill-Download', { source: 'free_skill_page' })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-white bg-brand-red hover:brightness-110 transition-all"
            >
              <Download className="w-4 h-4" /> Download SKILL.md — free
            </a>
            <a
              href="https://whoffagents.beehiiv.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-gray-300 border border-white/10 hover:border-white/25 transition-all"
            >
              Get updates by email
            </a>
          </div>
          <p className="mono-note mt-4">
            no email gate. drop it in .claude/skills/context-anchor/ and go.
          </p>
        </motion.div>

        {/* Code Example */}
        <motion.div
          className="mb-16 card-surface p-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-gray-500">context-anchor/SKILL.md</span>
            <button
              onClick={copyCode}
              className="text-xs px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-2"
            >
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
            {codeExample}
          </pre>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mb-20 grid gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-4 p-4 card-surface">
              <CheckCircle2 size={20} className="text-brand-red-bright flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">{feature.text}</p>
            </div>
          ))}
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="type-h2 mb-8">Questions?</h2>

          {[
            {
              q: 'How does context-anchor work?',
              a: 'The skill scans your conversation history, creates a compressed reference that preserves key decisions and context, and outputs it in a format Claude can re-ingest. Perfect before handing off to another agent or resuming after a break.',
            },
            {
              q: "What's the difference between the free skill and Ship Fast?",
              a: "context-anchor is one standalone skill — great for preventing context loss. Ship Fast is 11 integrated skills (auth, payments, deploy, testing, monitoring, and more) for $49 one-time. Get the free skill to experience the quality; buy Ship Fast when you're ready to ship full products faster.",
            },
            {
              q: 'Is this really free forever?',
              a: 'Yes. MIT licensed — use it forever, modify it, sell products built with it. No strings attached, no email required.',
            },
            {
              q: 'What do I need to run it?',
              a: "Anything that reads Claude skills — Claude Code first among them. It's a plain markdown skill file: drop it in your skills directory and trigger it with /anchor.",
            },
          ].map(({ q, a }) => (
            <details key={q} className="card-surface group">
              <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 text-white font-semibold">
                {q}
                <span className="text-brand-red-bright font-mono transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-5 text-gray-400 leading-relaxed text-sm">{a}</p>
            </details>
          ))}
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          className="mt-20 pt-16 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-400 mb-6">Like what you see? Explore the full skill pack.</p>
          <Link
            to="/products/ship-fast-skill-pack"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg card-surface text-white hover:bg-white/10 transition-colors"
          >
            View Ship Fast <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
