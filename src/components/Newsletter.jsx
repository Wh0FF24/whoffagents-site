import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { subscribeToBeehiiv } from '../utils/beehiiv'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await subscribeToBeehiiv(email, 'newsletter_section')
      navigate('/thank-you')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="newsletter" className="py-28 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,184,28,0.06) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <span className="text-xs font-semibold text-brand-gold bg-brand-gold/10 border border-brand-gold/30 rounded-full px-3 py-1">
            FREE GUIDE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">
            The 5-Step Multi-Agent Quickstart
          </h2>
          <p className="text-gray-400 mb-8">
            The exact 5-step system Atlas uses to spin up multi-agent workflows — structured handoffs, review gates, and a vault that keeps context across sessions. Free.
          </p>

          <div className="max-w-md mx-auto">
            <p className="text-brand-gold text-sm font-medium mb-6">+ weekly MCP launches and Claude Code tips for subscribers.</p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-brand-card border border-brand-border text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue-light focus:shadow-[0_0_15px_rgba(0,98,184,0.15)] transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-brand-red text-white font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  {status === 'loading' ? 'Sending...' : 'Get the Guide'}
                </button>
              </form>

            {status === 'error' && (
              <p className="text-brand-red text-sm mt-3">Something went wrong. Try again.</p>
            )}

            <p className="text-xs text-gray-500 mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
