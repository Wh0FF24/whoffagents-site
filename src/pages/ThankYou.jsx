import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ThankYou() {
  return (
    <section className="py-28 px-6 relative overflow-hidden min-h-[80vh]">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,184,28,0.08) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 mb-6">
            <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            You&apos;re in.
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Your PAX Protocol Starter Kit is on its way to your inbox.
          </p>
          <p className="text-sm text-gray-500">
            Check spam if you don&apos;t see it in 5 minutes — subject line: &ldquo;Your Whoff Agents Kit&rdquo;
          </p>
        </div>

        {/* Confirmation */}
        <motion.div
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-brand-gold mb-3">Order Confirmed</p>
          <p className="text-gray-300">
            You just did what most devs only talk about. You bought the system. Now you run it.
          </p>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-brand-gold mb-4">Your Next Steps</p>
          <h2 className="text-2xl font-bold text-white mb-6">Get up and running in 3 steps</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-sm">1</span>
              <div>
                <p className="text-white font-semibold mb-1">Download your kit</p>
                <p className="text-gray-400 text-sm">Check your inbox for the download link from Gumroad.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-sm">2</span>
              <div>
                <p className="text-white font-semibold mb-2">Run the init script</p>
                <pre className="bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-green-400 font-mono overflow-x-auto">
{`cd pax-starter-kit
chmod +x init.sh
./init.sh`}
                </pre>
                <p className="text-gray-400 text-sm mt-2">Atlas spins up. Orchestrating in under 5 minutes.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-sm">3</span>
              <div>
                <p className="text-white font-semibold mb-1">Open QUICKSTART.md</p>
                <p className="text-gray-400 text-sm">Everything you need is in there. First agent pipeline runs in one terminal window.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upsell: Setup Session */}
        <motion.div
          className="rounded-2xl p-8 mb-6"
          style={{ background: 'var(--bg-card, rgba(255,255,255,0.03))', border: '1px solid rgba(220,38,38,0.3)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3">Limited — 3 Slots / Week</p>
          <h2 className="text-2xl font-bold text-white mb-3">
            Want Atlas running in your stack today — guaranteed?
          </h2>
          <p className="text-gray-400 mb-5">Book a 1-on-1 Setup Session with Will.</p>

          <ul className="space-y-2 mb-6">
            {[
              '60 minutes, live screen share',
              'We plug PAX into your codebase, your workflows',
              'You leave with a working multi-agent pipeline',
              'Recorded — keep it forever',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                <svg className="w-4 h-4 text-brand-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <p className="text-white font-semibold mb-4">Most people are shipping in the first session.</p>

          <a
            href="#"
            className="block w-full text-center bg-brand-red text-white font-bold px-6 py-4 rounded-lg hover:brightness-110 transition-all duration-200"
          >
            Book a Setup Session — $200 →
          </a>
          <p className="text-xs text-center text-gray-500 mt-3">Only 3 slots per week. First-come.</p>
        </motion.div>

        {/* Discord */}
        <motion.div
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-brand-gold mb-3">Community</p>
          <h2 className="text-2xl font-bold text-white mb-3">You&apos;re not doing this alone.</h2>
          <p className="text-gray-400 mb-5">
            Join the Whoff Agents Discord — where builders share pipelines, debug live, and ship fast.
          </p>

          <ul className="space-y-2 mb-6 text-sm">
            {[
              { channel: '#show-your-agents', desc: 'post what you build' },
              { channel: '#pax-protocol', desc: 'community support' },
              { channel: '#atlas-ops', desc: 'orchestration patterns from real deployments' },
            ].map(({ channel, desc }) => (
              <li key={channel} className="flex items-center gap-3 text-gray-300">
                <span className="text-brand-gold font-mono">{channel}</span>
                <span className="text-gray-500">—</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="block w-full text-center border border-brand-gold text-brand-gold font-bold px-6 py-3 rounded-lg hover:bg-brand-gold/10 transition-all duration-200"
          >
            Join the Discord →
          </a>
          <p className="text-xs text-center text-gray-500 mt-3">Free for all kit owners. Always will be.</p>
        </motion.div>

        {/* Share Request */}
        <motion.div
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-brand-gold mb-3">One Ask</p>
          <p className="text-gray-400 mb-5">If you found this valuable, tell one person. Here&apos;s a ready tweet:</p>

          <blockquote className="bg-black/30 border border-white/[0.08] rounded-lg p-5 mb-5 text-gray-300 text-sm leading-relaxed italic">
            Just set up a multi-agent AI system in under 5 minutes using the PAX Protocol Starter Kit from @whoffagents
            <br /><br />
            Atlas orchestrates. I just review output.
            <br /><br />
            This is what solo dev looks like in 2026.
            <br /><br />
            → whoffagents.com
          </blockquote>

          <a
            href="https://twitter.com/intent/tweet?text=Just+set+up+a+multi-agent+AI+system+in+under+5+minutes+using+the+PAX+Protocol+Starter+Kit+from+%40whoffagents%0A%0AAtlas+orchestrates.+I+just+review+output.%0A%0AThis+is+what+solo+dev+looks+like+in+2026.%0A%0A%E2%86%92+whoffagents.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#1d9bf0] text-white font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all duration-200"
          >
            Tweet This →
          </a>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">Questions? Reply to your confirmation email or ping us in Discord.</p>
          <p className="mb-6 italic">Built by Atlas. Shipped by Will. — Whoff Agents</p>
          <Link to="/" className="text-gray-400 hover:text-white transition">
            ← Back to whoffagents.com
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
