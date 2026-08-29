import { motion } from 'framer-motion'
import { buildStripeURL } from '../utils/utm'
import { track } from '../utils/analytics'

const STRIPE_ATLAS = 'https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i'

const Check = () => (
  <svg className="w-4 h-4 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
)

const Cross = () => (
  <svg className="w-4 h-4 text-gray-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const rows = [
  {
    label: 'Price',
    diy: 'Engineer hours + time',
    crew: '$99 / month',
    atlas: <><span className="text-white font-extrabold text-lg">$47</span><br /><span className="text-brand-gold text-xs font-semibold">one-time · no subscription</span></>,
  },
  {
    label: 'Time to deploy',
    diy: '4 – 12 weeks',
    crew: 'Days (Python required)',
    atlas: <span className="text-green-400 font-semibold">An afternoon</span>,
  },
  {
    label: 'Auth (GitHub + Google)',
    diy: 'Build it yourself',
    crew: <Cross />,
    atlas: <><Check /><span className="text-gray-500 text-xs block text-center mt-1">NextAuth, pre-wired</span></>,
  },
  {
    label: 'Stripe billing 3-tier',
    diy: 'Build it yourself',
    crew: <Cross />,
    atlas: <><Check /><span className="text-brand-gold text-xs block text-center mt-1">portal + webhooks included</span></>,
  },
  {
    label: 'Streaming Claude chat',
    diy: 'Build it yourself',
    crew: <Cross />,
    atlas: <><Check /><span className="text-gray-500 text-xs block text-center mt-1">per-plan limits enforced</span></>,
  },
  {
    label: 'Database setup',
    diy: 'You design it',
    crew: 'Partial',
    atlas: <><Check /><span className="text-gray-500 text-xs block text-center mt-1">Prisma · SQLite dev / Postgres prod</span></>,
  },
  {
    label: 'Dashboard + dark mode',
    diy: <Cross />,
    crew: <Cross />,
    atlas: <><Check /><span className="text-gray-500 text-xs block text-center mt-1">shadcn/ui-style · full TypeScript</span></>,
  },
  {
    label: 'Tested as a system',
    diy: <Cross />,
    crew: <Cross />,
    atlas: <><Check /><span className="text-gray-500 text-xs block text-center mt-1">auth + billing + AI wired together</span></>,
  },
  {
    label: 'Delivery',
    diy: 'N/A',
    crew: 'Framework only',
    atlas: <><Check /><span className="text-gray-500 text-xs block text-center mt-1">instant GitHub invite</span></>,
  },
]

export default function ComparisonSection() {
  return (
    <section id="compare" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow mb-3">pricing</p>
          <h2 className="type-h2 mb-4">
            Three paths to a production AI SaaS.<br className="hidden md:block" /> One price that ends.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            CrewAI charges $99/month for a framework you still have to build.
            Hiring a team costs $8k–$20k/month. The AI SaaS Starter Kit is $47. Once.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-x-auto rounded-xl border border-brand-border"
        >
          <table className="w-full min-w-[580px] border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[28%]" />
                <th className="px-5 py-4 text-center text-sm font-semibold text-gray-500 w-[24%]">
                  Build It Yourself
                </th>
                <th className="px-5 py-4 text-center w-[24%]">
                  <span className="text-sm font-semibold text-gray-500">CrewAI</span>
                  <br />
                  <span className="text-xs font-normal text-gray-700">Python framework</span>
                </th>
                <th className="px-5 py-4 text-center w-[24%] bg-brand-red/5 border-x border-brand-red/20">
                  <span className="text-brand-gold text-sm">★</span>{' '}
                  <span className="text-white text-sm font-bold">AI SaaS Starter Kit</span>
                  <br />
                  <span className="text-brand-red text-xs font-semibold">$47 one-time</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-brand-border last:border-b-0 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
                >
                  <td className="px-5 py-4 text-sm font-medium text-gray-300">{row.label}</td>
                  <td className="px-5 py-4 text-center text-sm text-gray-600">
                    {typeof row.diy === 'string' ? row.diy : row.diy}
                  </td>
                  <td className="px-5 py-4 text-center text-sm text-gray-600">
                    {typeof row.crew === 'string' ? row.crew : row.crew}
                  </td>
                  <td className="px-5 py-4 text-center text-sm bg-brand-red/[0.03] border-x border-brand-red/10">
                    {typeof row.atlas === 'string' ? <span className="text-white">{row.atlas}</span> : row.atlas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* CTA block */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-500 text-sm mb-2">
            CrewAI = <span className="text-gray-400 font-semibold">$99/mo</span>
            {' '}·{' '}
            DIY = <span className="text-gray-400 font-semibold">weeks + engineer time</span>
            {' '}·{' '}
            AI SaaS Starter Kit = <span className="text-brand-gold font-semibold">$47, once</span>
          </p>
          <p className="text-gray-700 text-xs mb-8">After 1 month of CrewAI you've already spent more than twice as much.</p>
          <a
            href={buildStripeURL(STRIPE_ATLAS)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('Checkout-Start', { location: 'comparison' })}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(200,16,46,0.35)]"
          >
            Get the AI SaaS Starter Kit — $47
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="text-gray-700 text-xs mt-3">One-time payment · Instant GitHub invite · No subscription</p>
        </motion.div>
      </div>
    </section>
  )
}
