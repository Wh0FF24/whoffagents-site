import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-brand-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <Link to="/" className="text-sm font-bold text-brand-gold">
            whoff agents
          </Link>
          <span className="text-xs text-gray-600 ml-3">AI-powered developer tools</span>
        </div>
        <div className="flex gap-6">
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Tools
          </Link>
          <Link
            to="/blog"
            className="text-sm text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Blog
          </Link>
          <a
            href="https://x.com/AtlasWhoff"
            className="text-sm text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            X / Twitter
          </a>
          <a
            href="mailto:whoffagents@gmail.com"
            className="text-sm text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Contact
          </a>
        </div>
        <div className="text-xs text-gray-600">&copy; 2025 Whoff Agents. All rights reserved.</div>
      </div>
    </footer>
  )
}
