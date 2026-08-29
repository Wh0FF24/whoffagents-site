import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, Shield, Zap, Package, ArrowRight, Database, CreditCard, MessageSquare, LayoutDashboard } from 'lucide-react'
import { buildStripeURL } from '../utils/utm'
import Newsletter from '../components/Newsletter'

const BUY_LINK = 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i'

const whatsInside = [
  {
    icon: Shield,
    title: 'NextAuth.js Authentication',
    desc: 'GitHub + Google OAuth out of the box. JWT sessions, protected routes via middleware. No auth library wrestling.',
  },
  {
    icon: CreditCard,
    title: 'Stripe Billing',
    desc: 'Subscriptions, checkout sessions, customer portal, and webhook handling. 3-tier pricing wired and ready.',
  },
  {
    icon: MessageSquare,
    title: 'Streaming AI Chat',
    desc: 'Anthropic Claude integration with conversation history and per-plan message limits enforced server-side.',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    desc: 'Sidebar nav, stats cards, and activity feed. The shell every SaaS needs on day one.',
  },
  {
    icon: Database,
    title: 'Prisma ORM',
    desc: 'SQLite for local dev, Postgres for production. Migrations included. No config ceremony.',
  },
  {
    icon: Package,
    title: 'shadcn/ui-style Components + Dark Mode',
    desc: 'Accessible component patterns, Tailwind, dark mode, full TypeScript, and SEO meta tags throughout.',
  },
]

const techStack = [
  'Next.js',
  'TypeScript',
  'Prisma',
  'NextAuth',
  'Stripe',
  'Anthropic Claude',
  'Tailwind',
]

const faqs = [
  {
    q: 'What Node version do I need?',
    a: 'Node 18 or later. The repo includes an .nvmrc if you use nvm.',
  },
  {
    q: 'What is the license?',
    a: 'Single developer license — use it on unlimited projects, forever. You cannot resell the boilerplate itself.',
  },
  {
    q: 'Which AI provider does it use?',
    a: "Anthropic Claude. You swap in your own API key via .env.local — one line. The streaming handler is straightforward to adapt to OpenAI if you prefer.",
  },
  {
    q: 'How does the refund process work?',
    a: 'One email to hello@whoffagents.com within 30 days. No forms, no questions.',
  },
  {
    q: 'Do I get updates?',
    a: 'Yes. Free updates forever via the private GitHub repo. When dependencies update or Anthropic ships breaking changes, the repo gets patched.',
  },
]

export default function AiSaasStarter() {
  return (
    <div className="pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-12">
          <Link to="/products" className="hover:text-gray-300 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-300">AI SaaS Starter Kit</span>
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
              Starter Kit
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-red/10 text-brand-red border border-brand-red/20">
              $47 one-time
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
              Private GitHub Repo
            </span>
          </div>

          <h1 className="type-h1 mb-5">
            Production-ready Next.js boilerplate: auth, billing, streaming AI chat, and dashboard — wired together.
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Every AI SaaS needs the same foundation: users, payments, and a chat interface. This kit has all three wired together with{' '}
            <span className="text-white font-medium">NextAuth, Stripe, and Anthropic Claude</span>. Deploy in an afternoon, not a week.
          </p>

          <p className="text-sm font-semibold text-gray-200 mb-6">
            Full TypeScript. Prisma ORM. shadcn/ui-style components. Dark mode. SEO meta.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={buildStripeURL(BUY_LINK)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-base bg-brand-red hover:brightness-110 transition-all duration-200"
            >
              Get the Kit — $47 <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Instant delivery · 30-day refund
          </p>
        </motion.div>

        {/* Real screenshots — actual renders of the kit, not mockups */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
            What it looks like — real renders, not mockups
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <img
              src="/screenshots/ai-saas-starter/landing-hero.png"
              alt="AI SaaS Starter Kit — landing page hero, exactly as it ships"
              loading="lazy"
              className="rounded-xl border border-white/[0.08] w-full md:col-span-2"
            />
            <img
              src="/screenshots/ai-saas-starter/landing-pricing.png"
              alt="Built-in 3-tier pricing section"
              loading="lazy"
              className="rounded-xl border border-white/[0.08] w-full"
            />
            <img
              src="/screenshots/ai-saas-starter/login.png"
              alt="Auth login page (NextAuth — GitHub + Google OAuth)"
              loading="lazy"
              className="rounded-xl border border-white/[0.08] w-full"
            />
          </div>
        </motion.section>

        {/* Tech stack badges */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Tech stack</p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/[0.04] text-gray-300 border border-white/[0.08]"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* What's inside */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">What's inside</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {whatsInside.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-brand-gold/20 transition-colors"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 flex-shrink-0 rounded-md flex items-center justify-center bg-brand-red/10 border border-brand-red/20">
                    <Icon className="w-3.5 h-3.5 text-brand-red" />
                  </div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How delivery works */}
        <motion.section
          className="mb-16 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">How delivery works</p>
          <ol className="space-y-3">
            {[
              'Checkout — Stripe confirms your payment instantly.',
              'Invite — you get a GitHub collaborator invite at your checkout email within minutes.',
              'Clone — accept the invite, clone the private repo, follow QUICKSTART.md.',
              'Updates — free forever. The repo stays yours as long as you have it.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded flex items-center justify-center text-[11px] font-bold text-white bg-brand-red">
                  {i + 1}
                </span>
                <span className="text-gray-400">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-gray-500">
            Not happy?{' '}
            <Link to="/refund-policy" className="text-brand-gold hover:underline">30-day refund</Link>
            {' '}— one email, no forms.
          </p>
        </motion.section>

        {/* FAQ */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">FAQ</p>
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <p className="text-sm font-semibold text-white mb-2">{q}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Bottom CTA */}
        <motion.div
          className="text-center p-10 rounded-2xl border border-brand-red/20 bg-brand-red/[0.04]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-extrabold text-white mb-3">Stop building auth and billing from scratch.</h2>
          <p className="text-gray-400 text-sm mb-6">
            $47 one-time. Everything you need to ship a real AI SaaS — wired up, typed, and ready.
          </p>
          <div>
            <a
              href={buildStripeURL(BUY_LINK)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-bold text-white text-base bg-brand-red hover:brightness-110 transition-all duration-200"
            >
              Get AI SaaS Starter Kit — $47 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Instant delivery · 30-day refund
          </p>
        </motion.div>

        <Newsletter />

      </div>
    </div>
  )
}
