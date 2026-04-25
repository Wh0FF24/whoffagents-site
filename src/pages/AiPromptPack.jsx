import { motion } from 'framer-motion'
import { Zap, MessageSquare, TrendingUp, Code2, Megaphone, Search, Check, ArrowRight } from 'lucide-react'
import Newsletter from '../components/Newsletter'
import { buildStripeURL } from '../utils/utm'

const BUY_LINK = 'https://buy.stripe.com/dRm3cx8Rh87H6zJgvHaZi0k'
const SHIP_FAST_LINK = 'https://buy.stripe.com/5kQ4gB7Nd1Jj3nx1ANaZi0a'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

const categories = [
  {
    icon: MessageSquare,
    label: 'Content Creation',
    count: 6,
    description: 'Social posts, thread starters, blog outlines — ready to fire into Claude.',
  },
  {
    icon: TrendingUp,
    label: 'Business Strategy',
    count: 5,
    description: 'Offer positioning, pricing rationale, go-to-market briefs.',
  },
  {
    icon: Megaphone,
    label: 'Marketing Copy',
    count: 5,
    description: 'Headlines, email hooks, landing page scaffolds, ad angles.',
  },
  {
    icon: Code2,
    label: 'Code & Dev',
    count: 5,
    description: 'Code review, debugging walkthroughs, README drafts, PR descriptions.',
  },
  {
    icon: Search,
    label: 'Research & Analysis',
    count: 4,
    description: 'Competitive intel, market sizing, product teardowns.',
  },
]

const features = [
  'Copy-paste ready — no setup, no config, just open and run',
  'Works with Claude Code, Claude.ai, and any Claude API app',
  'Covers 5 core workflow categories in 25 production-tested prompts',
]

export default function AiPromptPack() {
  return (
    <div className="pt-28 pb-0 px-6">
      <div className="max-w-5xl mx-auto">

        {/* ─── Hero ─── */}
        <motion.section
          className="text-center mb-28"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-gold/15 text-brand-gold border border-brand-gold/30 mb-6"
          >
            Prompt Pack &middot; 25 Prompts &middot; $9 One-Time
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #FFB81C 0%, #C8102E 100%)' }}
            >
              AI Prompt Pack
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            25 production-tested prompts across 5 workflow categories. Stop rewriting the same
            prompt from scratch every session.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={buildStripeURL(BUY_LINK)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity duration-200 text-center cursor-pointer bg-brand-red"
            >
              Get the Pack — $9
            </a>
            <a
              href="#whats-inside"
              className="text-gray-400 hover:text-white font-medium px-8 py-3.5 rounded-lg border border-brand-border hover:border-white/20 transition-all duration-200 text-center cursor-pointer"
            >
              See what's inside
            </a>
          </motion.div>
        </motion.section>

        {/* ─── Features ─── */}
        <section className="mb-20">
          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {features.map((feat, i) => (
              <motion.div
                key={feat}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-3 bg-brand-card border border-brand-border rounded-xl p-5"
              >
                <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <p className="text-sm text-gray-400 leading-relaxed">{feat}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── What's Inside ─── */}
        <section id="whats-inside" className="mb-28 scroll-mt-24">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What's inside</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              25 prompts organized by the five workflows you reach for most.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative group bg-brand-card border border-brand-border rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,184,28,0.08)]"
              >
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-4">
                  <cat.icon className="w-5 h-5 text-brand-gold" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-white">{cat.label}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-gray-500 border border-white/8">
                    {cat.count} prompts
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Buy CTA ─── */}
        <section className="mb-28">
          <motion.div
            className="relative bg-brand-card border border-brand-gold/20 rounded-2xl p-10 text-center max-w-2xl mx-auto overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-gold/15 text-brand-gold border border-brand-gold/30 mb-6">
              One-Time Purchase
            </span>

            <h2 className="text-3xl font-extrabold text-white mb-3">
              $9 — 25 Prompts, Forever
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              No subscription. Instant download. Works in Claude Code, Claude.ai, or anywhere you run Claude.
            </p>

            <a
              href={buildStripeURL(BUY_LINK)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-semibold px-10 py-4 rounded-lg bg-brand-red hover:brightness-110 transition-all duration-200 cursor-pointer text-lg"
            >
              Get the Pack — $9
            </a>

            <p className="text-gray-600 text-xs mt-5">
              30-day money-back guarantee · No questions asked
            </p>
          </motion.div>
        </section>

        {/* ─── Upsell: Ship Fast Skill Pack ─── */}
        <section className="mb-28">
          <motion.div
            className="relative bg-[#0a0a0a] border border-brand-red/20 rounded-2xl p-10 max-w-3xl mx-auto overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />

            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-red/10 text-brand-red border border-brand-red/20 mb-4">
                  Level Up
                </span>
                <h3 className="text-2xl font-extrabold text-white mb-3">
                  Ship Fast Skill Pack
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  20+ production-ready Claude Code skills that compress your dev loop. Where the
                  Prompt Pack gives you the words, Ship Fast gives you the automation. Built by the
                  same team running whoffagents.com.
                </p>
                <ul className="space-y-2">
                  {['Full Claude Code skill library', 'Automated dev workflows', 'Covers plan → code → deploy loop'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="w-3.5 h-3.5 text-brand-red shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:text-right shrink-0">
                <p className="text-3xl font-extrabold text-white mb-1">$49</p>
                <p className="text-gray-500 text-sm mb-5">One-time</p>
                <a
                  href={buildStripeURL(SHIP_FAST_LINK)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-lg border border-brand-red/40 hover:bg-brand-red/10 transition-all duration-200 cursor-pointer"
                >
                  Upgrade to Ship Fast
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Newsletter ─── */}
        <Newsletter />
      </div>
    </div>
  )
}
