import { motion } from 'framer-motion'
import { FileText, Settings, Bot, BookOpen, Zap, FolderOpen, Shield } from 'lucide-react'

const fileCategories = [
  { icon: BookOpen, label: 'Auth & OAuth', files: 1, detail: 'NextAuth · GitHub + Google OAuth, session management' },
  { icon: Settings, label: 'Stripe Billing', files: 1, detail: '3-tier pricing · customer portal · webhooks' },
  { icon: Bot, label: 'Claude Chat', files: 1, detail: 'Streaming AI chat · per-plan message limits' },
  { icon: FileText, label: 'Dashboard', files: 1, detail: 'User dashboard · usage tracking · dark mode' },
  { icon: Zap, label: 'Database', files: 1, detail: 'Prisma ORM · SQLite (dev) · Postgres (prod)' },
  { icon: FolderOpen, label: 'UI Components', files: 1, detail: 'shadcn/ui-style components · full TypeScript' },
]

const items = [
  {
    title: 'NextAuth — GitHub + Google OAuth, Ready on Day 1',
    body: 'Full authentication with GitHub and Google OAuth providers pre-wired via NextAuth. Session management, protected routes, and user callbacks are configured. No manual OAuth app setup beyond creating your provider credentials.',
    why: 'Auth is the most time-consuming boilerplate in any SaaS project. This removes 2–4 days of setup from every new project.',
  },
  {
    title: 'Stripe Billing — 3 Tiers, Portal, and Webhooks',
    body: 'Three-tier subscription structure (Free, Pro, Enterprise) with Stripe Checkout, the customer self-serve portal, and a full webhook handler covering subscription created, updated, and cancelled events. Plan limits are enforced in the application layer.',
    why: 'Stripe webhooks are where most boilerplates stop short. Getting event handling right — idempotency, retries, failed payment recovery — is where hours disappear. This has it handled.',
  },
  {
    title: 'Streaming Claude Chat with Per-Plan Limits',
    body: 'A streaming AI chat interface powered by Claude, with message limits enforced per subscription tier. Free plan users hit a cap and see an upgrade prompt. Pro and Enterprise tiers get higher limits. The streaming response is rendered incrementally — no waiting for the full reply.',
    why: 'Per-plan limits are the core monetization lever for AI SaaS. Getting this right in the streaming context (where you can\'t just count tokens after the fact) is non-trivial. This solves it.',
  },
  {
    title: 'Prisma ORM — SQLite Dev, Postgres Prod',
    body: 'Prisma schema covering users, accounts, sessions, subscriptions, and usage records. SQLite for local development (zero setup), Postgres for production (swap one env var). Migrations included.',
    why: 'The SQLite → Postgres pattern eliminates the "I need a cloud database just to run locally" problem. One schema, two environments, no friction.',
  },
  {
    title: 'User Dashboard',
    body: 'A functional dashboard showing the authenticated user\'s current plan, usage against their limit, and an upgrade path. Built with shadcn/ui-style components. Includes dark mode support.',
    why: 'Dashboards expose the plan/usage model to users — which is what drives upgrades. A working dashboard with real data out of the box beats a placeholder every time.',
  },
  {
    title: 'shadcn/ui-Style Components + Dark Mode',
    body: 'Component library following shadcn/ui conventions: Button, Card, Input, Badge, and layout primitives. Dark mode via next-themes — toggle included. Full TypeScript throughout.',
    why: 'Consistent component patterns mean you extend the kit instead of rewriting the UI from scratch. TypeScript catches integration errors before they ship.',
  },
  {
    title: 'Full TypeScript — End to End',
    body: 'Every file in the kit is TypeScript. API routes, auth callbacks, Stripe webhook handler, Prisma models, React components — all typed. No implicit any. No JavaScript files to convert later.',
    why: 'Type safety across the auth → billing → AI stack eliminates an entire class of runtime errors that only surface in production.',
  },
]

const roadmap = [
  { label: 'Day 1', text: 'Clone, configure .env, run the dev server. Auth, billing, and Claude chat are working.' },
  { label: 'Week 1', text: 'Customize the UI to your brand. Add your product\'s core feature behind the auth wall.' },
  { label: 'Month 1', text: 'Production deploy. Real users on real plans. Stripe billing live. Claude limits enforced.' },
  { label: 'Month 3', text: 'Iterate on features. The infrastructure is done — you\'re shipping product, not plumbing.' },
]

export default function KitBreakdown() {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/20 mb-4">
          AI SaaS Starter Kit · $47
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">What's Inside</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Production-ready Next.js boilerplate. Every feature earns its place. Here's exactly what you get and why it matters.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-14">
        {fileCategories.map((cat) => (
          <div
            key={cat.label}
            className="bg-brand-card border border-brand-border rounded-xl p-4 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2 mb-1">
              <cat.icon className="w-4 h-4 text-brand-gold" />
              <span className="text-white text-sm font-semibold">{cat.label}</span>
            </div>
            <span className="text-gray-500 text-xs leading-snug">{cat.detail}</span>
          </div>
        ))}
      </div>

      {/* Item breakdown */}
      <div className="space-y-4 mb-14">
        {items.map((item, i) => (
          <details
            key={i}
            className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none">
              <span className="text-white font-medium text-sm md:text-base">{item.title}</span>
              <svg
                className="w-4 h-4 text-gray-500 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-5 border-t border-brand-border pt-4 space-y-3">
              <p className="text-gray-300 text-sm leading-relaxed">{item.body}</p>
              <div className="flex gap-2">
                <span className="text-brand-gold text-xs font-semibold flex-shrink-0">Why it matters:</span>
                <p className="text-gray-400 text-xs leading-relaxed">{item.why}</p>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Roadmap */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-8 mb-8">
        <h3 className="text-white font-bold text-lg mb-6">What You Can Build With This</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {roadmap.map((step, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-red/10 text-brand-red border border-brand-red/20 w-fit">
                {step.label}
              </span>
              <p className="text-gray-400 text-sm leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-gray-500 text-sm border-t border-brand-border pt-4">
          The kit is the foundation. Every AI SaaS needs auth, billing, and a way to gate features by plan.
          This ships all three, wired together and production-tested —&nbsp;
          <span className="text-white font-medium">so you build your product, not the plumbing underneath it.</span>
        </p>
      </div>

      {/* Guarantee */}
      <div className="flex items-start gap-4 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-6">
        <Shield className="w-6 h-6 text-brand-gold flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-semibold mb-1">30-Day Refund Guarantee</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            If you can't get the kit running in your environment within 30 days, email{' '}
            <a href="mailto:atlas@whoffagents.com" className="text-brand-gold hover:text-white transition-colors">
              atlas@whoffagents.com
            </a>
            {' '}for a full refund. No ticket system. No questionnaire. Direct response.
          </p>
        </div>
      </div>
    </motion.section>
  )
}
