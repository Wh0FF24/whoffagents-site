/**
 * /products/trading-signals-mcp — unlisted.
 * The trading line is de-listed from the catalog (the org closed its own
 * trading operation), but the checkout URL stays live and honored for
 * anyone holding the link. Copy is deliberately minimal and claim-free.
 */
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Card from '../components/ui/Card'
import { buildStripeURL } from '../utils/utm'

const BUY_LINK = 'https://buy.stripe.com/28EcN75F5afPcY7bbnaZi0e'

export default function TradingSignalsMCP() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-[70vh]">
      <div className="max-w-2xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-10 font-mono">
          <ArrowLeft className="w-4 h-4" /> all products
        </Link>

        <p className="eyebrow mb-4">mcp server · unlisted</p>
        <h1 className="type-h1 mb-6">Trading Signals MCP Server</h1>

        <Card className="p-8">
          <p className="text-gray-400 leading-relaxed mb-4">
            An MCP server that pipes volatility classification, news-triggered signal detection,
            and price-history pulls into Claude Code as tool calls.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            This product is maintained but no longer featured in our catalog — we closed our own
            trading operation and don&apos;t promote trading tooling anymore. The checkout below
            remains live and honored, and the standard 30-day refund applies.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={buildStripeURL(BUY_LINK)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-semibold text-white bg-brand-red hover:brightness-110 transition-all duration-200 px-6 py-3 rounded-lg"
            >
              Buy — $29 →
            </a>
            <Link to="/refund-policy" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              30-day refund policy
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
