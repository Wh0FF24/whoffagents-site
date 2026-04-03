import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('https://whoffagents.beehiiv.com/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email,
          utm_source: 'website',
          utm_medium: window.location.pathname === '/' ? 'homepage' : 'inline',
        }),
        mode: 'no-cors',
      })
      // no-cors returns opaque response, so we assume success
      setStatus('success')
      setEmail('')
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
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get early access to every tool we ship</h2>
          <p className="text-gray-400 mb-8">
            Join developers getting weekly MCP server launches, Claude Code tips, and exclusive pre-release access. Free.
          </p>

          <div className="max-w-md mx-auto">
            <p className="text-brand-gold text-sm font-medium mb-6">Next drop: Crypto Data MCP — subscribers get it first.</p>

            {status === 'success' ? (
              <div className="py-4">
                <p className="text-brand-gold font-semibold text-lg mb-1">You're in.</p>
                <p className="text-gray-400 text-sm">Check your inbox to confirm. First tool drops soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-brand-card border border-brand-border text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue-light focus:shadow-[0_0_15px_rgba(0,98,184,0.15)] transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-brand-red text-white font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  {status === 'loading' ? 'Joining...' : 'Get Early Access'}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-brand-red text-sm mt-3">Something went wrong. Try again.</p>
            )}

            {status !== 'success' && (
              <p className="text-xs text-gray-500 mt-3">No spam. Unsubscribe anytime.</p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
