import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Copy, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { subscribeToBeehiiv } from '../utils/beehiiv'

const codeExample = `// Before: context lost after handoff
async function complexTask() {
  // 2000 lines of context
  // ... then handoff to another agent
  // Agent starts cold, re-reads everything
}

// After: context-anchor skill drops anchor
import { contextAnchor } from 'ship-fast'
await contextAnchor.run()
// Compressed reference prevents cascade`

const features = [
  { text: 'Drop before handoffs — prevent context drift across agent boundaries' },
  { text: 'Works in Claude Code, Copilot CLI, and Gemini CLI' },
  { text: 'Runs in 30 seconds — no setup, no boilerplate' },
  { text: 'MIT licensed — use everywhere' },
]

export default function FreeSkill() {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const email = e.currentTarget.email.value.trim()
    if (!email) {
      setError('Please enter a valid email')
      setLoading(false)
      return
    }

    try {
      await subscribeToBeehiiv(email, { utm_medium: 'free_skill_landing' })
      navigate(`/thank-you?email=${encodeURIComponent(email)}&source=free_skill`)
    } catch (err) {
      setError('Failed to subscribe. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="pt-32 pb-32 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-16">
          <Link to="/products" className="hover:text-gray-300 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-300">Free Skill</span>
        </div>

        {/* Hero */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-6">
              Free Skill
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Stop Losing Context
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              One free skill that prevents your agents from starting cold. Drop it before handoffs, breaks, or context switches — your AI remembers everything that matters.
            </p>
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          className="mb-20 p-6 rounded-lg border border-white/5 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-gray-500">context-anchor.ts</span>
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
          className="mb-24 grid gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">{feature.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Email Capture */}
        <motion.div
          className="mb-20 p-8 rounded-lg border-2 border-emerald-500/30 bg-emerald-500/5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Get it free right now</h2>
          <p className="text-gray-400 mb-6">Join our developer community. One email, no spam ever.</p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Get Free Skill'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif font-bold text-white mb-8">Questions?</h2>

          <details className="p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
            <summary className="text-white font-semibold flex items-center justify-between">
              How does context-anchor work?
              <span className="transition-transform group-open:rotate-180">+</span>
            </summary>
            <p className="mt-4 text-gray-400">
              The skill scans your conversation history, creates a compressed reference that preserves key decisions and context, and outputs it in a format Claude can re-ingest. Perfect before handing off to another agent or resuming after a break.
            </p>
          </details>

          <details className="p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
            <summary className="text-white font-semibold flex items-center justify-between">
              What's the difference between the free skill and Ship Fast?
              <span className="transition-transform group-open:rotate-180">+</span>
            </summary>
            <p className="mt-4 text-gray-400">
              context-anchor is one standalone skill — great for preventing context loss. Ship Fast is 11 integrated skills (auth, payments, deploy, testing, monitoring, and more) for $49 one-time. Get the free skill to experience the quality; buy Ship Fast when you're ready to ship full products faster.
            </p>
          </details>

          <details className="p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
            <summary className="text-white font-semibold flex items-center justify-between">
              Is this really free forever?
              <span className="transition-transform group-open:rotate-180">+</span>
            </summary>
            <p className="mt-4 text-gray-400">
              Yes. It's MIT licensed — you can use it forever, modify it, sell products built with it, everything. No strings attached. The email signup helps us stay connected with the community.
            </p>
          </details>

          <details className="p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
            <summary className="text-white font-semibold flex items-center justify-between">
              What platforms does it work on?
              <span className="transition-transform group-open:rotate-180">+</span>
            </summary>
            <p className="mt-4 text-gray-400">
              Claude Code, Copilot CLI, Gemini CLI, and standalone Claude API calls. If Claude can invoke skills, context-anchor will work.
            </p>
          </details>
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          className="mt-20 pt-16 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400 mb-6">Like what you see? Explore the full skill pack.</p>
          <Link
            to="/products/ship-fast-skill-pack"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            View Ship Fast <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
