import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: '"Why not just build this myself?"',
    a: `You can. Most people who buy this tried first. The problem isn't writing the code — it's the 6 weeks of agents silently overwriting each other's work before you figure out what's actually wrong. We've already hit those walls. The Atlas Starter Kit is the system we rebuilt after the failures, not the first attempt. You're buying the tuning, not the scaffolding.`,
  },
  {
    q: '"What if Anthropic just releases official patterns?"',
    a: `They might. Anthropic is great at building models. They're not a company that ships opinionated ops tooling for indie developers who need agents running overnight with no babysitting. The gap this fills — persistent context, crash recovery, token-efficient handoffs, watchdog coordination — is operational, not theoretical. Official docs won't tell you how to keep six agents aligned on a Tuesday at 2am when one crashes.`,
  },
  {
    q: '"Is this just a bunch of config files?"',
    a: `Config files are the smallest part. What you're actually getting: the orchestration protocol that keeps agents from talking past each other (PAX), the memory architecture that survives context resets, the crash recovery watchdog, and the exact system prompt structure that took months to pressure-test on real production workloads. Yes, some of that lives in files. So does every useful piece of software.`,
  },
  {
    q: '"Is this a one-time purchase or a subscription?"',
    a: `One-time purchase. You pay once, you own it. No monthly fees, no seat licenses, no renewal emails. Future updates to the starter kit are included as long as we're shipping them. You already pay Anthropic for API usage — we're not adding another line item to that bill.`,
  },
  {
    q: '"What support do I get if I get stuck?"',
    a: `Every purchase includes access to the private Discord where we troubleshoot setups in public threads (so the fix helps everyone). We're an active shop — not a ghost vendor. The quickstart guide covers the 90% case. If you hit the 10%, post in Discord and you'll have a human answer within 24 hours, usually faster.`,
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-24 bg-gray-950">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Questions we hear every week
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">
            Real answers. No marketing speak.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={i}
                className="border border-gray-800 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between text-white font-semibold text-lg hover:bg-gray-900 transition-colors"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-yellow-400 flex-shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-300 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
