import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Code2, CheckCircle2, Shield, Zap, Package, ArrowRight } from 'lucide-react'
import { buildStripeURL } from '../utils/utm'
import Newsletter from '../components/Newsletter'

const BUY_LINK = 'https://buy.stripe.com/5kQ4gB7Nd1Jj3nx1ANaZi0a'

const skills = [
  { name: 'auth-setup', desc: 'OAuth, JWT, and session handling wired in one invocation' },
  { name: 'stripe-payments', desc: 'Payment link + webhook + fulfillment as a single skill run' },
  { name: 'api-builder', desc: 'REST/tRPC scaffolding with validation and error handling' },
  { name: 'database-setup', desc: 'Supabase/Postgres client + migrations pattern' },
  { name: 'deploy-config', desc: 'Vercel and AWS Amplify one-command deploy' },
  { name: 'testing-suite', desc: 'Vitest config with coverage and CI integration' },
  { name: 'email-system', desc: 'Transactional email + list management out of the box' },
  { name: 'monitoring', desc: 'Sentry/PostHog wiring and structured JSON logging' },
  { name: 'seo-meta', desc: 'Meta tags, OG images, and sitemap in one pass' },
  { name: 'ui-components', desc: 'Design-system tokens + accessible component stubs' },
]

const features = [
  { icon: Zap, text: 'Pre-wired, not boilerplate — every skill runs in Claude Code out of the box, no config gauntlet' },
  { icon: Shield, text: 'Battle-tested on a real AI business — powers whoffagents.com in production' },
  { icon: Code2, text: 'Works with Anthropic, OpenAI, and Gemini — model-agnostic, no lock-in' },
  { icon: Package, text: 'MIT-licensed — use in commercial projects, no strings attached' },
  { icon: CheckCircle2, text: 'Lifetime updates — one-time $49, new skills added quarterly' },
]

const objections = [
  {
    q: '"I can just write auth myself."',
    a: 'You can. But can you ship 10 products this year if you do? Ship Fast is one-time $49 and saves ~40 hours per project — the first project pays for itself in the first afternoon.',
  },
  {
    q: '"How is this different from create-next-app templates?"',
    a: 'Templates are starter scaffolding — obsolete the moment you diverge. Ship Fast skills stay useful as your code evolves because Claude invokes them as sub-workflows, not one-time generators.',
  },
  {
    q: '"What if a skill breaks after an update?"',
    a: 'The repo is open on GitHub under MIT. I fix reported issues personally within 48 hours. You can also patch your local copy — it\'s just a Markdown file.',
  },
]

export default function ShipFast() {
  return (
    <div className="pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-12">
          <Link to="/products" className="hover:text-gray-300 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-300">Ship Fast Skill Pack</span>
        </div>

        {/* Hero */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
              Skill
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-red/10 text-brand-red border border-brand-red/20">
              10 skills — $49
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
              MIT Licensed
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Stop rebuilding auth, payments, and CI from scratch every time you ship.
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            10 Claude Code skills for the unfun layer of shipping a SaaS. Drop into{' '}
            <code className="text-brand-gold bg-white/5 px-1.5 py-0.5 rounded text-sm">.claude/skills/</code>{' '}
            and invoke by keyword. Each skill handles one whole system — auth, payments, deploys, tests — in a single run.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={buildStripeURL(BUY_LINK)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-base bg-brand-red hover:brightness-110 transition-all duration-200"
            >
              Get Ship Fast — $49 <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Wh0FF24/ship-fast-skill-pack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-gray-300 text-base border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              View on GitHub
            </a>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            One-time purchase · Lifetime updates · 30-day refund if it doesn't save you time
          </p>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          className="rounded-xl border border-brand-gold/20 bg-brand-gold/[0.04] p-5 mb-16 flex flex-wrap gap-6 items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-sm text-gray-300">
            <span className="text-brand-gold font-bold">Konstantin</span> bought Ship Fast on Apr 18 and shipped auth + Stripe in the same afternoon.
          </div>
          <div className="flex gap-6 text-center ml-auto">
            {[
              { n: '10', label: 'skills' },
              { n: '~40h', label: 'saved / project' },
              { n: '$49', label: 'one-time' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="text-xl font-extrabold text-white">{n}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product images */}
        <motion.section
          className="mb-16 space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {[
            { src: '/images/ship-fast-01-hero.png', alt: 'Before: 847 lines from scratch. After: 10 skills installed in seconds.' },
            { src: '/images/ship-fast-02-in-action.png', alt: 'Type /auth setup — auth is wired in under 1 second.' },
            { src: '/images/ship-fast-03-diff-stat.png', alt: '847 lines of auth boilerplate vs 41 lines with Ship Fast. 95% less code.' },
          ].map(({ src, alt }, i) => (
            <motion.div
              key={src}
              className="rounded-xl overflow-hidden border border-white/[0.06]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            >
              <img src={src} alt={alt} className="w-full block" loading="lazy" />
            </motion.div>
          ))}
        </motion.section>

        {/* Skills grid */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">What's in the pack</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-brand-gold/20 transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
              >
                <code className="mt-0.5 text-xs font-mono text-brand-gold bg-brand-gold/10 px-2 py-1 rounded whitespace-nowrap">
                  /{skill.name}
                </code>
                <p className="text-sm text-gray-400 leading-relaxed">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Feature bullets */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">Why Ship Fast</p>
          <div className="space-y-4">
            {features.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center bg-brand-red/10 border border-brand-red/20">
                  <Icon className="w-4 h-4 text-brand-red" />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed pt-1.5">{text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Objection handlers */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">Common questions</p>
          <div className="space-y-4">
            {objections.map(({ q, a }, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <p className="text-sm font-semibold text-white mb-2">{q}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* How to install */}
        <motion.section
          className="mb-16 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Setup in 60 seconds</p>
          <ol className="space-y-3">
            {[
              'Buy — you get a GitHub repo invite in your email.',
              'Clone: git clone https://github.com/Wh0FF24/ship-fast-skill-pack',
              'Copy: cp -r ship-fast-skill-pack/skills/ your-project/.claude/skills/',
              'Use: open Claude Code and type /auth-setup, /stripe-payments, etc.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded flex items-center justify-center text-[11px] font-bold text-white bg-brand-red">
                  {i + 1}
                </span>
                <span className="text-gray-400">{step}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* Bottom CTA */}
        <motion.div
          className="text-center p-10 rounded-2xl border border-brand-red/20 bg-brand-red/[0.04]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to stop rebuilding the same stuff?</h2>
          <p className="text-gray-400 text-sm mb-6">
            $49 one-time. The first project it touches pays for itself.
          </p>
          <a
            href={buildStripeURL(BUY_LINK)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-bold text-white text-base bg-brand-red hover:brightness-110 transition-all duration-200"
          >
            Get Ship Fast — $49 <ArrowRight className="w-4 h-4" />
          </a>
          <p className="mt-4 text-xs text-gray-500">
            One-time · MIT license · 30-day refund guarantee
          </p>
        </motion.div>

        <Newsletter />

      </div>
    </div>
  )
}
