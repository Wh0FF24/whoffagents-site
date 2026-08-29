/**
 * /products/archive — unlisted.
 * Home for checkout links whose products were de-listed from the catalog.
 * Purchase paths stay live and honored (hard constraint); marketing claims
 * don't. Copy here is name + price only, on purpose.
 */
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Card from '../components/ui/Card'
import { buildStripeURL } from '../utils/utm'

const archived = [
  {
    name: 'AI Content Repurposer',
    price: '$19',
    buyLink: 'https://buy.stripe.com/6oUeVfd7x0Ff4rB5R3aZi0c',
  },
]

const unlistedPages = [
  { name: 'Crypto Data MCP Server', to: '/products/crypto-data-mcp' },
  { name: 'Trading Signals MCP Server', to: '/products/trading-signals-mcp' },
]

export default function ProductsArchive() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-[70vh]">
      <div className="max-w-2xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-10 font-mono">
          <ArrowLeft className="w-4 h-4" /> all products
        </Link>

        <p className="eyebrow mb-4">unlisted</p>
        <h1 className="type-h1 mb-6">Product archive</h1>
        <p className="text-gray-400 leading-relaxed mb-10 max-w-xl">
          Products we&apos;ve removed from the main catalog. Existing checkout links stay live
          and are honored, and the standard 30-day refund applies to every purchase.
        </p>

        <div className="space-y-4">
          {archived.map(({ name, price, buyLink }) => (
            <Card key={name} className="p-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="type-h3">{name}</h2>
                <p className="mono-note mt-1">{price} · one-time</p>
              </div>
              <a
                href={buildStripeURL(buyLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white bg-brand-red hover:brightness-110 transition-all duration-200 px-5 py-2.5 rounded-lg whitespace-nowrap"
              >
                Buy — {price} →
              </a>
            </Card>
          ))}

          {unlistedPages.map(({ name, to }) => (
            <Card key={name} className="p-6 flex items-center justify-between gap-4">
              <h2 className="type-h3">{name}</h2>
              <Link to={to} className="text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
                View page →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
