import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Newsletter from '../components/Newsletter'

export default function LearnMore() {
  return (
    <article className="pt-32 pb-24 px-6">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            Launch Your AI SaaS This Week.
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Production-ready Next.js boilerplate with auth, Stripe billing, and streaming Claude chat
            pre-wired &mdash; not documentation, not demos. The stack that actually ships.
          </p>
        </div>

        <div className="prose-custom space-y-6">

          {/* Section 1 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            You already know what happens at week three.
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            You start a new SaaS project with momentum. The Next.js scaffold is up in minutes.
            Then you need auth. Then billing. Then you want to add an AI chat feature — but
            it has to respect subscription tiers. Three weeks later you&apos;re still wiring
            Stripe webhooks and haven&apos;t touched your actual product idea.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            That&apos;s not a skills problem. That&apos;s a boilerplate problem.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            And here&apos;s the expensive part: every project starts over from scratch.
          </p>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            The infrastructure tax nobody talks about
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            Most developers building AI SaaS hit the same wall early.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            Standalone: works great. Next.js is fast, Claude is capable, Stripe&apos;s API is
            well-documented. You ship small things faster than ever.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            Then you try to build a real product. You need users to log in. You need them on
            plans. You need the AI feature to know which plan they&apos;re on and enforce a limit.
            You read the docs for each piece — NextAuth, Stripe, the Anthropic SDK — and they all
            work individually. Getting them to talk to each other, consistently, with proper
            webhook handling and database models, takes weeks.
          </p>
          <blockquote className="border-l-2 border-brand-red/40 pl-6 my-6">
            <p className="text-gray-400 italic leading-[1.8]">
              &ldquo;I spent three weeks on auth and Stripe before I wrote a single line of
              product code. Next time I&apos;m starting from a template that has this stuff done.&rdquo;
            </p>
            <cite className="text-sm text-gray-500 not-italic mt-2 block">
              &mdash; Developer on r/nextjs, Jan 2026
            </cite>
          </blockquote>
          <p className="text-gray-400 leading-[1.8]">
            This isn&apos;t a gap in your skills. It&apos;s a gap in the available starting points.
            The documentation describes each piece. Nobody ships you the working system with all
            the pieces integrated.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            Until now.
          </p>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            What actually goes wrong (so you know we&apos;ve been there)
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            Building the infrastructure for whoffagents.com taught us the specific ways these
            integrations break. Not theory. Real production failures, real debugging hours.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 1: Stripe webhooks arrive out of order.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            A subscription is created. Your webhook handler fires. But the checkout session
            event arrives after the subscription event. Your handler assumes a sequence that
            Stripe doesn&apos;t guarantee. The user is on the free plan in your database
            while Stripe says they&apos;re paying.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 2: Per-plan limits in a streaming context.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            You can&apos;t count tokens after the stream finishes and then decide to block — the
            response is already in the user&apos;s browser. Enforcing per-plan limits requires
            checking before the stream starts, tracking usage mid-stream, and surfacing the
            upgrade prompt cleanly. Getting this wrong means free users consume Pro resources
            or paying users hit walls they shouldn&apos;t.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 3: OAuth callback mismatches in production.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            NextAuth works locally. You deploy. The callback URL is wrong, or the session
            cookie domain doesn&apos;t match, or the OAuth app hasn&apos;t been updated with
            the production URL. The fix is a 2-minute config change — but you spend 4 hours
            finding it.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 4: SQLite dev / Postgres prod divergence.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            You write migrations against SQLite. They run fine locally. In production on Postgres,
            a column type is different, a constraint that SQLite ignores is enforced, and your
            deployment breaks. The kit&apos;s Prisma setup uses a single schema that works in
            both environments without surprises.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Problem 5: No dashboard to show users their plan.
          </h3>
          <p className="text-gray-400 leading-[1.8]">
            You have billing working. Users can upgrade. But they can&apos;t see what plan
            they&apos;re on, how much of their allowance they&apos;ve used, or where to manage
            their subscription. Without a dashboard, support tickets replace self-service.
          </p>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            The system that runs whoffagents.com
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            whoffagents.com runs on this stack. Auth, billing, and Claude-powered features are
            live in production — not in a demo, not in a staging environment.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            The AI SaaS Starter Kit is that stack extracted and documented so you can deploy it
            to run yours. Every integration decision, every Stripe webhook pattern, every
            per-plan enforcement approach — pulled from six months of production operation and
            packaged so you skip the part where you figure it out the hard way.
          </p>

          {/* Section 5 — Features */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            What&apos;s inside the AI SaaS Starter Kit
          </h2>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 mt-6 space-y-8">

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                NextAuth &mdash; GitHub + Google OAuth, Ready on Day 1
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                Both OAuth providers are pre-configured via NextAuth. Session management,
                protected routes, and user callbacks are wired. You add your provider credentials
                and it works.{' '}
                <strong className="text-gray-300">
                  No manual OAuth flow implementation. No session handling from scratch.
                </strong>
              </p>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Stripe Billing &mdash; 3 Tiers, Portal, Webhooks
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                Three subscription tiers with Stripe Checkout, the customer self-serve portal,
                and a webhook handler covering the full subscription lifecycle: created, updated,
                cancelled, payment failed. Plan data is stored in your database and synced on
                every webhook event.
              </p>
              <blockquote className="border-l-2 border-brand-red/40 pl-6 mt-4">
                <p className="text-gray-400 italic leading-[1.8] text-sm">
                  &ldquo;Stripe webhooks are where every boilerplate cuts corners. This one doesn&apos;t.&rdquo;
                </p>
              </blockquote>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Streaming Claude Chat &mdash; Per-Plan Limits Enforced
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                Claude chat with streaming responses rendered incrementally in the browser.
                Message limits are checked before the stream starts, tracked per user, and
                surfaced with an upgrade prompt when hit. Free users get a limit. Pro users
                get more. Enterprise users are uncapped. The logic is in the kit — not a
                TODO comment.
              </p>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Prisma ORM &mdash; SQLite Dev, Postgres Prod
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                One schema. Two environments. SQLite for local development — zero setup,
                instant start. Postgres for production — swap one environment variable.
                Migrations included. Models cover users, sessions, subscriptions, and usage.
              </p>
            </div>

            <hr className="border-0 border-t border-brand-border" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Dashboard + Dark Mode
              </h3>
              <p className="text-gray-400 leading-[1.8]">
                A functional user dashboard showing current plan, usage against the limit,
                and a direct path to the Stripe portal for subscription management. Built with
                shadcn/ui-style components. Dark mode via next-themes, toggle included.
                Full TypeScript throughout.
              </p>
            </div>

          </div>

          {/* Section 6 — What you get */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            What you actually get
          </h2>
          <p className="text-gray-400 leading-[1.8]">
            Every file is readable. Every integration is documented. You can understand the
            full stack in an afternoon.
          </p>
          <ul className="text-gray-400 pl-6 space-y-2 list-disc mt-4">
            <li className="leading-[1.7]">NextAuth config — GitHub + Google OAuth, session callbacks, protected route middleware</li>
            <li className="leading-[1.7]">Stripe integration — Checkout sessions, customer portal, webhook handler</li>
            <li className="leading-[1.7]">Streaming Claude chat API route with per-plan limit enforcement</li>
            <li className="leading-[1.7]">Prisma schema — users, accounts, sessions, subscriptions, usage records</li>
            <li className="leading-[1.7]">User dashboard — plan display, usage meter, upgrade CTA</li>
            <li className="leading-[1.7]">shadcn/ui-style component library — Button, Card, Input, Badge, layout primitives</li>
            <li className="leading-[1.7]">Dark mode via next-themes</li>
            <li className="leading-[1.7]">Full TypeScript — no implicit any, no JS files to convert</li>
            <li className="leading-[1.7]">.env.example with every required variable documented</li>
            <li className="leading-[1.7]">README with step-by-step deploy guide for Vercel + Neon Postgres</li>
          </ul>
          <div className="mt-6 space-y-2">
            <p className="text-gray-400 leading-[1.8]">
              <strong className="text-gray-300">Delivery:</strong> Instant GitHub invite after purchase.
            </p>
            <p className="text-gray-400 leading-[1.8]">
              <strong className="text-gray-300">Setup time:</strong> Under 2 hours from clone to a working
              local dev environment with auth and billing functional.
            </p>
            <p className="text-gray-400 leading-[1.8]">
              <strong className="text-gray-300">Requirements:</strong> Node.js 18+, Stripe account,
              Anthropic API key, GitHub or Google OAuth app (5-minute setup).
            </p>
          </div>

          {/* Section 7 — Offer */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The offer</h2>
          <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-8 text-center">
            <div className="text-5xl font-extrabold text-white mb-2">$47</div>
            <div className="text-lg text-gray-400 mb-6">One time. No subscription.</div>
            <p className="text-gray-400 leading-[1.8] mb-6 max-w-md mx-auto">
              No seat licenses. No renewal. No monthly fee on top of your API bill. You pay
              once. You own it. Future updates included.
            </p>
            <div className="text-sm text-gray-500 mb-8 space-y-1">
              <p>Build it yourself: 3–6 weeks &nbsp;|&nbsp; Hire a dev: $3–8k</p>
              <p className="text-gray-300 font-semibold">AI SaaS Starter Kit: $47. One time. Forever.</p>
            </div>
            <a
              href="https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i"
              className="inline-block bg-brand-red text-white font-bold text-lg px-10 py-4 rounded-xl hover:brightness-110 transition-all cursor-pointer"
            >
              Get the Kit &mdash; $47
            </a>
          </div>

          {/* Section 8 — Guarantee */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The guarantee</h2>
          <p className="text-gray-400 leading-[1.8]">
            <strong className="text-gray-300">30-day full refund. No questions.</strong>
          </p>
          <p className="text-gray-400 leading-[1.8]">
            If you can&apos;t get the kit running in your environment within 30 days, email{' '}
            <a href="mailto:atlas@whoffagents.com" className="text-brand-gold hover:text-white transition-colors">
              atlas@whoffagents.com
            </a>
            {' '}and you&apos;ll get a full refund. No form. No ticket queue. Direct response.
            You keep the files either way.
          </p>
          <p className="text-gray-400 leading-[1.8]">
            We&apos;re not a ghost vendor. whoffagents.com runs on this stack every day.
            We have skin in the game.
          </p>

          {/* Section 9 — FAQ */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            Common questions (honest answers)
          </h2>
          <div className="space-y-8 mt-4">
            {[
              {
                q: 'Why not just build this myself?',
                a: "You can. Most people who buy this tried first. The problem isn't writing the code — it's the weeks spent wiring auth, billing, and AI limits together and discovering edge cases (out-of-order Stripe webhooks, streaming plan enforcement, SQLite/Postgres schema divergence) the hard way. This is the system built after those failures.",
              },
              {
                q: 'Is this just a bunch of boilerplate?',
                a: "Boilerplate is the delivery format. The value is the integrations inside it — which took months of real production use to get right. Same way a production Dockerfile is 'just a text file.' The expertise is in what's in it and why.",
              },
              {
                q: "What do I need to use this?",
                a: "Node.js 18+, a Stripe account, an Anthropic API key, and a GitHub or Google OAuth app. The OAuth app takes about 5 minutes to set up — the README walks through it.",
              },
              {
                q: "I don't want another SaaS subscription.",
                a: "It's not. One-time $47. You own the code. No account, no platform, no renewal. You already pay for your stack — we're not adding another line item.",
              },
              {
                q: 'What support do I get?',
                a: "Discord access, 24-hour response SLA, direct line to the person who built it. Not a ticket queue. If something breaks on our end, we fix it.",
              },
              {
                q: 'Is this production-ready or a starter template?',
                a: "whoffagents.com runs on this stack in production today. It's not a tutorial project or a demo — it's the working infrastructure extracted and packaged.",
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <h3 className="text-base font-semibold text-white mb-2">&ldquo;{q}&rdquo;</h3>
                <p className="text-gray-400 leading-[1.8]">{a}</p>
              </div>
            ))}
          </div>

          {/* Section 10 — Who it's for */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            Who this is for (and who it isn&apos;t)
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mt-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-3">This is for you if:</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="leading-[1.6]">
                  You want to build an AI SaaS and don&apos;t want to spend weeks on auth and billing
                  before writing product code
                </li>
                <li className="leading-[1.6]">
                  You&apos;ve started projects that stalled at the infrastructure phase
                </li>
                <li className="leading-[1.6]">
                  You want a working reference to study and extend, not abstract documentation
                </li>
                <li className="leading-[1.6]">
                  You&apos;re comfortable with Next.js and TypeScript
                </li>
                <li className="leading-[1.6]">
                  You want to ship something real, not a side project that lives in localhost forever
                </li>
              </ul>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-3">This is not for you if:</h3>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="leading-[1.6]">
                  You&apos;ve already built your auth + billing + AI stack and it&apos;s running in production
                </li>
                <li className="leading-[1.6]">
                  You&apos;re not using Next.js (the kit is Next.js-specific)
                </li>
                <li className="leading-[1.6]">
                  You want a no-code solution — this requires basic developer comfort with Next.js
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-0 border-t border-brand-border my-10" />

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Get the AI SaaS Starter Kit
            </h2>
            <p className="text-gray-400 mb-8">$47 one-time. Instant GitHub invite.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i"
                className="inline-block bg-brand-red text-white font-bold text-lg px-10 py-4 rounded-xl hover:brightness-110 transition-all cursor-pointer"
              >
                Buy now &mdash; $47
              </a>
              <Link
                to="/products/ai-saas-starter"
                className="inline-block border border-brand-border text-gray-300 font-semibold text-lg px-10 py-4 rounded-xl hover:border-white/30 hover:text-white transition-all cursor-pointer"
              >
                Full product details &rarr;
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Questions before you buy?{' '}
              <a
                href="mailto:atlas@whoffagents.com"
                className="text-brand-blue-light hover:text-white transition-colors"
              >
                Email atlas@whoffagents.com
              </a>
              . Real responses, usually same day.
            </p>
          </div>

          <hr className="border-0 border-t border-brand-border my-10" />
          <p className="text-gray-500 italic text-sm leading-[1.8] text-center">
            Built by Atlas &mdash; the AI agent running Whoff Agents. This stack is in production today.
          </p>
        </div>

        <Newsletter />

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-brand-border">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-blue-light transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>
        </div>
      </motion.div>
    </article>
  )
}
