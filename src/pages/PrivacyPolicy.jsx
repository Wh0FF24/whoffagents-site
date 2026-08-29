import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    <div className="space-y-4 text-gray-400 leading-relaxed">{children}</div>
  </div>
)

export default function PrivacyPolicy() {
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
              <Lock className="w-4 h-4" />
              Privacy Policy
            </span>
            <h1 className="type-h1 mb-4">Privacy Policy</h1>
            <p className="text-gray-500 text-sm">
              Whoff Agents LLC, a Virginia limited liability company operating from Provo, Utah &middot; Effective date: August 18, 2026
            </p>
          </div>

          <p className="text-gray-400 leading-relaxed mb-10">
            This Privacy Policy explains how Whoff Agents LLC (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) collects, uses, shares, and protects information in connection with
            whoffagents.com and the products and services we offer, including our SMS text
            messaging program.
          </p>

          <Section title="1. Who we are">
            <p>
              Whoff Agents LLC is a Virginia limited liability company, operating from Provo, Utah. You can reach us at{' '}
              <a href="mailto:hello@whoffagents.com" className="text-brand-gold hover:underline">
                hello@whoffagents.com
              </a>{' '}
              with any question about this policy or your information.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <p>We collect the following categories of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="text-gray-300">Contact and inquiry information</span> — name,
                business name, email address, phone number, and the contents of any message you
                send us through a contact or quote-request form.
              </li>
              <li>
                <span className="text-gray-300">Payment information</span> — processed directly by
                Stripe, our payment processor. We never receive or store your full card number.
              </li>
              <li>
                <span className="text-gray-300">Usage data and cookies/analytics</span> — how you
                interact with our site, collected through standard analytics tooling.
              </li>
              <li>
                <span className="text-gray-300">Communications</span> — anything you send us
                directly, by email, form, or text message.
              </li>
              <li>
                <span className="text-gray-300">SMS program data</span> — if you opt in to receive
                text messages from us: your mobile phone number, the content of messages sent to
                and from you, and timestamps and delivery status provided by our messaging
                carrier.
              </li>
            </ul>
          </Section>

          <Section title="3. How we use it">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Respond to your inquiries and quote requests;</li>
              <li>Provide and deliver the products and services you purchase;</li>
              <li>Send service and account-related notifications;</li>
              <li>Improve our site and our offerings.</li>
            </ul>
            <p>We do not sell personal information.</p>
          </Section>

          <Section title="4. Sharing">
            <p>
              We share information only with service providers as needed to operate our business,
              each of whom is bound to use your data only to provide their service to us:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Payment processing — Stripe</li>
              <li>Hosting — Amazon Web Services (AWS)</li>
              <li>Form processing — Netlify</li>
              <li>Communications — Twilio and our email providers</li>
            </ul>
            <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/[0.04] p-5">
              <p className="text-white font-semibold">
                No mobile information will be shared with third parties or affiliates for
                marketing or promotional purposes.
              </p>
            </div>
          </Section>

          <Section title="5. SMS / text messaging program">
            <p>
              If you opt in to our SMS program — by providing your mobile number to us or by
              texting us first — we may send you text messages related to your inquiry or our
              services.
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
                <strong className="text-white">REVOKE</strong> at any time to opt out. You will
                receive no further messages from us unless you opt back in.
              </li>
              <li>
                Reply <strong className="text-white">HELP</strong> or{' '}
                <strong className="text-white">INFO</strong> for help.
              </li>
              <li>Carriers are not liable for delayed or undelivered messages.</li>
              <li>Consent to receive texts is not a condition of any purchase.</li>
            </ul>
          </Section>

          <Section title="6. Data retention">
            <p>
              We retain information for as long as reasonably necessary to fulfill the purposes
              described above, or as required by law, including to maintain records of SMS
              consent and opt-out status.
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              We maintain reasonable administrative and technical safeguards designed to protect
              your information. No method of storage or transmission is 100% secure, and we
              cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="8. Children">
            <p>
              Our site and services are not directed to children under 13, and we do not
              knowingly collect information from children under 13.
            </p>
          </Section>

          <Section title="9. Your choices and rights">
            <p>
              You may request access to, correction of, or deletion of your personal information,
              or opt out of marketing communications at any time, by emailing{' '}
              <a href="mailto:hello@whoffagents.com" className="text-brand-gold hover:underline">
                hello@whoffagents.com
              </a>
              . You may also opt out of SMS messages at any time as described in Section 5 above —
              see also our{' '}
              <Link to="/terms" className="text-brand-gold hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </Section>

          <Section title="10. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. The effective date at the top
              of this page reflects the most recent revision.
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
