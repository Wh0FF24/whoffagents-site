import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Mail, Clock, CheckCircle2 } from 'lucide-react'

export default function RefundPolicy() {
  return (
    <div className="pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-gold mb-4">
              <Shield className="w-4 h-4" />
              Refund Policy
            </span>
            <h1 className="type-h1 mb-4">
              30-Day Money-Back Guarantee
            </h1>
            <p className="text-gray-400">No questions asked. No fine print. No retention emails.</p>
          </div>

          {/* Main guarantee box */}
          <div className="border border-brand-gold/30 rounded-2xl p-8 bg-brand-gold/[0.03] mb-10">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-brand-gold flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-white mb-3">The Promise</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If the AI SaaS Starter Kit doesn't work for you — for any reason — email{' '}
                  <a href="mailto:hello@whoffagents.com" className="text-brand-gold hover:underline">
                    hello@whoffagents.com
                  </a>{' '}
                  within 30 days of purchase. Full refund. Within 48 hours. No phone call. No
                  survey. No guilt-trip.
                </p>
                <p className="text-gray-400 text-sm">
                  You keep the files. We don't claw anything back. The risk is on us.
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <h2 className="text-2xl font-bold text-white mb-6">How to request a refund</h2>
          <div className="space-y-4 mb-12">
            {[
              {
                icon: Mail,
                title: '1. Email us',
                body: 'Send a one-line email to hello@whoffagents.com. Subject: "Refund". Include the email you used to check out. That is the entire process.',
              },
              {
                icon: Clock,
                title: '2. Wait up to 48 hours',
                body: 'Atlas processes refund requests within 48 hours, usually faster. Stripe takes another 5-10 business days to land the money back in your account.',
              },
              {
                icon: CheckCircle2,
                title: '3. Keep the files',
                body: 'You don\'t have to delete anything. The kit is yours to keep — even after a refund. We\'re not going to chase you for it.',
              },
            ].map((step) => (
              <div key={step.title} className="bg-brand-card border border-brand-border rounded-xl p-6 flex gap-4">
                <step.icon className="w-6 h-6 text-brand-blue-light flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Why we do this */}
          <div className="border-t border-brand-border pt-10 mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Why we offer this</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Most "refund policies" are a maze. Login required. 14-day windows. "Within reason."
              Approval committees. We think that's a tell — if a product needs friction to keep
              the money, the product isn't ready.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              The AI SaaS Starter Kit ships with readable source code. You can review the structure on{' '}
              <a href="https://github.com/Wh0FF24" target="_blank" rel="noopener noreferrer" className="text-brand-blue-light hover:text-white">
                GitHub
              </a>{' '}
              before you ever hit checkout. The $47 buys the packaged distribution, the QUICKSTART
              walkthrough, and direct email access to Atlas. If that isn't worth it to you, we
              shouldn't keep your money.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We'd rather have a happy refund than a resentful customer.
            </p>
          </div>

          {/* Secondary guarantee */}
          <div className="border border-yellow-400/30 rounded-2xl p-6 bg-yellow-400/[0.03] mb-10">
            <h3 className="text-white font-bold mb-2">The "We Do It For You" Guarantee</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Beyond the 30-day refund: if you follow QUICKSTART.md and your agent isn't running
              in 30 minutes, email{' '}
              <a href="mailto:support@whoffagents.com" className="text-yellow-400 hover:underline">
                support@whoffagents.com
              </a>{' '}
              and Atlas will personally configure and deploy your first agent at no charge. Not
              a refund. Not a credit. We actually do it for you.
            </p>
          </div>

          {/* Contact */}
          <div className="text-center text-sm text-gray-500">
            Questions before you buy?{' '}
            <a href="mailto:hello@whoffagents.com" className="text-brand-blue-light hover:text-white">
              hello@whoffagents.com
            </a>{' '}
            — replies in under 24 hours.
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              &larr; Back to Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
