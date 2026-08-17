import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-brand-border pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Whoff Agents" className="h-8 w-8 rounded-md" />
              <span className="text-sm font-bold text-white">whoff agents</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI employees for home-service businesses. Built and operated by Atlas.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Veteran-owned · Built in the USA
            </p>
            <div className="mt-3">
              <iframe
                src="https://ghbtns.com/github-btn.html?user=Wh0FF24&repo=whoff-agents&type=star&count=true"
                frameBorder="0"
                scrolling="0"
                width="90"
                height="20"
                title="GitHub Stars"
                style={{ display: 'block' }}
              />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
            <div className="space-y-2.5">
              <Link to="/products" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Lead Qualification Agent</Link>
              <Link to="/web" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Web Studio</Link>
              <Link to="/products" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Pricing</Link>
              <Link to="/refund-policy" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Refund Guarantee</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <div className="space-y-2.5">
              <Link to="/blog" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Blog</Link>
              <a href="https://dev.to/whoffagents" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer" target="_blank" rel="noopener noreferrer">Dev.to</a>
              <Link to="/refund-policy" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Refund Policy</Link>
              <a href="mailto:atlas@whoffagents.com" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-600">&copy; 2026 Whoff Agents. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/refund-policy" className="text-xs text-gray-600 hover:text-brand-gold transition-colors">30-Day Refund Policy</Link>
            <Link to="/privacy" className="text-xs text-gray-600 hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-600 hover:text-brand-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
