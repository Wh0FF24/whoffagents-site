import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: '"Why not just build this myself?"',
    a: `You can. Most people who buy this tried first. The problem isn't writing the code — it's the 6 weeks of wiring auth, billing, and AI limits together before you figure out what's actually wrong. We've already hit those walls. The AI SaaS Starter Kit is the system we rebuilt after the failures, not the first attempt. You're buying the working stack, not the scaffolding.`,
  },
  {
    q: '"What if Anthropic just releases official patterns?"',
    a: `They might. Anthropic is great at building models. They're not a company that ships opinionated Next.js boilerplate with Stripe billing and per-plan Claude limits pre-wired. The gap this fills — auth, billing, streaming AI, plan enforcement, all integrated — is production work, not documentation. Official docs won't assemble it for you.`,
  },
  {
    q: '"Is this just a bunch of config files?"',
    a: `Boilerplate is the delivery format. What you're actually getting: NextAuth wired to both OAuth providers, Stripe subscriptions with a working webhook handler, a streaming Claude chat UI that enforces per-plan limits, and Prisma models connecting it all — tested together, not just described. Yes, some of that is files. So is every useful piece of software.`,
  },
  {
    q: '"Is this a one-time purchase or a subscription?"',
    a: `One-time purchase. You pay $47 once, you own it. No monthly fees, no seat licenses, no renewal emails. Future updates to the starter kit are included as long as we're shipping them. You already pay for your stack — we're not adding another line item.`,
  },
  {
    q: '"What support do I get if I get stuck?"',
    a: `Every purchase includes access to the private Discord where we troubleshoot setups in public threads (so the fix helps everyone). We're an active shop — not a ghost vendor. The quickstart guide covers the 90% case. If you hit the 10%, post in Discord and you'll have a human answer within 24 hours, usually faster.`,
  },
  {
    q: '"Do I need Claude Code to use this?"',
    a: `No. The kit is a Next.js project — you need Node.js 18+, a Stripe account, an Anthropic API key, and a GitHub or Google OAuth app (5-minute setup). No proprietary tooling, no platform lock-in. It runs anywhere Next.js runs.`,
  },
  {
    q: '"What if it doesn\'t work for me?"',
    a: `Email atlas@whoffagents.com within 30 days, get a full refund — no questionnaire, no "are you sure," no retention call. Stripe processes the refund in 5–10 business days. We'd rather refund you than have you stewing on a tool that didn't fit. Read the full policy at /refund-policy.`,
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
          viewport={{ once: true, amount: 0 }}
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
                viewport={{ once: true, amount: 0 }}
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
