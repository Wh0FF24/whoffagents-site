import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, Mail } from 'lucide-react'

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 leading-relaxed">{children}</div>
  </div>
)

export default function TermsOfService() {
  return (
    <div className="pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-gold mb-4">
              <FileText className="w-4 h-4" />
              Terms of Service
            </span>
            <h1 className="type-h1 mb-4">Terms of Service</h1>
            <p className="text-gray-500 text-sm">
              Whoff Agents LLC, a Virginia limited liability company &middot; Effective date: August 18, 2026
            </p>
          </div>

          <p className="text-gray-400 leading-relaxed mb-10">
            These Terms of Service (&quot;Terms&quot;) govern your use of whoffagents.com and the
            products and services offered by Whoff Agents LLC (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;). By using our site or purchasing our products or services, you agree
            to these Terms.
          </p>

          <Section title="1. Acceptance of terms">
            <p>
              By accessing our site, submitting a form, or purchasing a product or service, you
              agree to be bound by these Terms. If you do not agree, please do not use our site or
              services.
            </p>
          </Section>

          <Section title="2. Who we are">
            <p>
              Whoff Agents LLC is a Virginia limited liability company. You can reach us at{' '}
              <a href="mailto:hello@whoffagents.com" className="text-brand-gold hover:underline">
                hello@whoffagents.com
              </a>
              .
            </p>
          </Section>

          <Section title="3. Services and products">
            <p>We offer:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Digital products (skill packs, starter kits, and similar downloadable goods);</li>
              <li>Website design and ongoing care-plan services; and</li>
              <li>AI-assistant services.</li>
            </ul>
          </Section>

          <Section title="4. Orders, payment, and refunds">
            <p>
              Prices are as listed at the point of sale. Payments are processed via Stripe. Refund
              terms are as stated on the applicable product or service page — for example, where a
              30-day guarantee is advertised, it applies as described there.
            </p>
          </Section>

          <Section title="5. Client responsibilities">
            <p>
              For website design and other service engagements, timely delivery depends on you.
              You agree to provide content, access, and approvals in a reasonably timely manner so
              we can deliver on the timelines described.
            </p>
          </Section>

          <Section title="6. Intellectual property">
            <p>
              The content on our site — including text, design, and code — is owned by Whoff
              Agents LLC. Ownership of work delivered as part of a client engagement (for example,
              a custom-built website) is governed by the terms of the applicable engagement.
            </p>
          </Section>

          <Section title="7. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use our site or services for any unlawful purpose;</li>
              <li>Interfere with or disrupt our site, services, or infrastructure; or</li>
              <li>Misrepresent your identity or affiliation in dealing with us.</li>
            </ul>
          </Section>

          <Section title="8. SMS terms">
            <p>
              If you opt in to our SMS program — by providing your mobile number to us or by
              texting us first — the following applies:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Message frequency varies.</li>
              <li>Message and data rates may apply.</li>
              <li>
                Reply <strong className="text-white">STOP</strong>,{' '}
                <strong className="text-white">CANCEL</strong>,{' '}
                <strong className="text-white">QUIT</strong>,{' '}
                <strong className="text-white">END</strong>,{' '}
                <strong className="text-white">UNSUBSCRIBE</strong>,{' '}
                <strong className="text-white">OPTOUT</strong>,{' '}
                <strong className="text-white">STOPALL</strong>, or{' '}
                <strong className="text-white">REVOKE</strong> at any time to opt out.
              </li>
              <li>
                Reply <strong className="text-white">HELP</strong> or{' '}
                <strong className="text-white">INFO</strong> for help.
              </li>
              <li>Carriers are not liable for delayed or undelivered messages.</li>
              <li>Consent to receive texts is not a condition of any purchase.</li>
            </ul>
            <p>
              See our{' '}
              <Link to="/privacy" className="text-brand-gold hover:underline">
                Privacy Policy
              </Link>{' '}
              for how we handle information collected through this program, including our
              commitment that no mobile information is shared with third parties or affiliates for
              marketing or promotional purposes.
            </p>
          </Section>

          <Section title="9. Disclaimers">
            <p>
              Our site, products, and services are provided &quot;as is&quot; and &quot;as
              available,&quot; without warranties of any kind, to the maximum extent permitted by
              law.
            </p>
          </Section>

          <Section title="10. Limitation of liability">
            <p>
              To the maximum extent permitted by law, our total liability arising out of or
              relating to these Terms or our products and services is limited to the amounts you
              actually paid us for the specific product or service giving rise to the claim.
            </p>
          </Section>

          <Section title="11. Governing law">
            <p>
              These Terms are governed by the laws of the Commonwealth of Virginia, without regard
              to its conflict-of-laws principles. Any dispute arising out of these Terms will be
              resolved in the courts located in Virginia.
            </p>
          </Section>

          <Section title="12. Changes to these terms">
            <p>
              We may update these Terms from time to time. The effective date at the top of this
              page reflects the most recent revision. Continued use of our site or services after
              a change constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <div className="pt-8 border-t border-brand-border flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            Questions?{' '}
            <a href="mailto:hello@whoffagents.com" className="text-brand-gold hover:underline">
              hello@whoffagents.com
            </a>
          </div>

          <div className="text-center mt-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              &larr; Back home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
