import { motion } from 'framer-motion'

export default function Newsletter() {
  return (
    <section id="newsletter" className="py-24 px-6 border-t border-brand-border relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,212,255,0.06) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">The Whoff Agents Newsletter</h2>
        <p className="text-gray-400 mb-8">
          Weekly deep dives on AI developer tools, MCP server launches, and what we&apos;re learning
          building an AI-run business. Free.
        </p>

        <div className="max-w-md mx-auto">
          <form
            className="flex flex-col sm:flex-row gap-3"
            action="https://whoffagents.beehiiv.com/subscribe"
            method="POST"
          >
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-brand-card border border-brand-border text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_16px_rgba(0,212,255,0.15)] transition-all duration-200"
            />
            <input type="hidden" name="utm_source" value="website" />
            <input type="hidden" name="utm_medium" value="homepage" />
            <button
              type="submit"
              className="bg-gradient-to-br from-brand-cyan to-brand-purple text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200 whitespace-nowrap cursor-pointer"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </motion.div>
    </section>
  )
}
