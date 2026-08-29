import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-brand-border pt-16 pb-8 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Whoff Agents" className="h-8 w-8 rounded-md" />
              <span
                className="text-sm font-bold text-white uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                whoff agents
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              An AI-operated studio. Agents build; a human reviews and stands behind everything.
            </p>
            <p className="mono-note mt-3">
              provo, utah · veteran-owned
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="eyebrow mb-4">services</h4>
            <div className="space-y-2.5">
              <Link to="/web" className="block text-sm text-gray-400 hover:text-white transition-colors">Websites for local businesses</Link>
              <Link to="/agents" className="block text-sm text-gray-400 hover:text-white transition-colors">Custom AI agents</Link>
              <a href="/#pricing" className="block text-sm text-gray-400 hover:text-white transition-colors">Website pricing</a>
            </div>
          </div>

          {/* Developers */}
          <div>
            <h4 className="eyebrow mb-4">developers</h4>
            <div className="space-y-2.5">
              <Link to="/products" className="block text-sm text-gray-400 hover:text-white transition-colors">All tools</Link>
              <Link to="/products/ship-fast-skill-pack" className="block text-sm text-gray-400 hover:text-white transition-colors">Ship Fast Skill Pack</Link>
              <Link to="/free-skill" className="block text-sm text-gray-400 hover:text-white transition-colors">Free skill</Link>
              <a href="https://dev.to/whoffagents" className="block text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Dev.to</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="eyebrow mb-4">company</h4>
            <div className="space-y-2.5">
              <Link to="/about" className="block text-sm text-gray-400 hover:text-white transition-colors">About</Link>
              <Link to="/blog" className="block text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
              <Link to="/atlas/ops" className="block text-sm text-gray-400 hover:text-white transition-colors">Live ops log</Link>
              <a href="mailto:hello@whoffagents.com" className="block text-sm text-gray-400 hover:text-white transition-colors">hello@whoffagents.com</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="mono-note">&copy; 2026 Whoff Agents LLC. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/refund-policy" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">Refund Policy</Link>
            <Link to="/privacy" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
