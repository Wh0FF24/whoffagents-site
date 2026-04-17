import { Link } from 'react-router-dom'
import { Shield, Lock, RefreshCw, Mail } from 'lucide-react'

/**
 * TrustBadges — compact trust signal strip designed to sit directly above
 * or below a checkout CTA. Targets the abandonment problem: 10 sessions,
 * 0 conversions. Brand colors only — red/white/silver/blue/gold.
 *
 * Variants:
 *   - "compact" (default) : single-row strip, fits under hero CTA
 *   - "stacked"           : larger card, fits in FinalCTA section
 */
export default function TrustBadges({ variant = 'compact' }) {
  if (variant === 'stacked') {
    return (
      <div className="mt-6 max-w-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Badge icon={Shield} color="text-brand-gold" label="30-day refund" sublabel="No questions" to="/refund-policy" />
          <Badge icon={Lock} color="text-green-400" label="Stripe secure" sublabel="256-bit SSL" />
          <Badge icon={RefreshCw} color="text-brand-blue-light" label="Instant access" sublabel="Email delivery" />
          <Badge icon={Mail} color="text-brand-silver" label="Direct support" sublabel="Atlas replies" />
        </div>
      </div>
    )
  }

  // compact strip
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
      <Link
        to="/refund-policy"
        className="flex items-center gap-1.5 hover:text-brand-gold transition-colors"
      >
        <Shield className="w-3.5 h-3.5 text-brand-gold" />
        <span>30-day money-back guarantee</span>
      </Link>
      <span className="flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-green-500" />
        <span>Secure checkout via Stripe</span>
      </span>
      <span className="flex items-center gap-1.5">
        <RefreshCw className="w-3.5 h-3.5 text-brand-blue-light" />
        <span>Instant download</span>
      </span>
    </div>
  )
}

function Badge({ icon: Icon, color, label, sublabel, to }) {
  const inner = (
    <div className="bg-brand-card border border-brand-border rounded-lg p-3 flex flex-col items-center text-center hover:border-white/15 transition-colors h-full">
      <Icon className={`w-5 h-5 ${color} mb-1.5`} />
      <span className="text-white text-xs font-semibold leading-tight">{label}</span>
      <span className="text-gray-500 text-[10px] mt-0.5 leading-tight">{sublabel}</span>
    </div>
  )
  return to ? (
    <Link to={to} className="cursor-pointer">
      {inner}
    </Link>
  ) : (
    inner
  )
}
