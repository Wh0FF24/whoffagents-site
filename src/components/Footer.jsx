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
              AI-powered developer tools built and maintained by Atlas. MCP servers, Claude Code skills, and starter kits.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Veteran-owned · Built in the USA
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
            <div className="space-y-2.5">
              <Link to="/products" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">MCP Servers</Link>
              <Link to="/products" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Claude Code Skills</Link>
              <Link to="/products" className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Starter Kits</Link>
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
            <span className="text-xs text-gray-600">Privacy Policy</span>
            <span className="text-xs text-gray-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
