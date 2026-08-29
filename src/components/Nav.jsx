import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/web', label: 'Websites' },
  { to: '/agents', label: 'AI Agents' },
  { to: '/products', label: 'Dev Tools' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog', match: (p) => p.startsWith('/blog') },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const isActive = (l) => (l.match ? l.match(location.pathname) : location.pathname === l.to)

  const quoteHref = `${location.pathname === '/' ? '' : '/'}#lead-form`
  const onQuoteClick = (e) => {
    if (location.pathname === '/' || location.pathname === '/web' || location.pathname === '/agents') {
      e.preventDefault()
      document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b border-white/5 transition-colors duration-300 ${
        scrolled ? 'bg-brand-dark/92 backdrop-blur-xl' : 'bg-brand-dark/70 backdrop-blur-xl'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Whoff Agents" className="h-9 w-9 rounded-md" />
          <div className="flex flex-col leading-none">
            <span
              className="text-[17px] font-bold text-white tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              whoff agents
            </span>
            <span className="text-[9px] text-gray-500 tracking-[0.22em] uppercase font-mono">
              an AI-operated studio
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={isActive(l) ? 'page' : undefined}
              className={`link-trace text-sm transition-colors duration-200 ${
                isActive(l) ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={quoteHref}
            onClick={onQuoteClick}
            className="btn-charge text-sm font-semibold px-4 py-2 rounded-lg bg-brand-red text-white"
          >
            <span>Get a quote</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-white cursor-pointer p-2.5 -mr-2.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-white/5"
          >
            <div className="px-6 py-4 space-y-3 bg-brand-dark/95 backdrop-blur-xl">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  aria-current={isActive(l) ? 'page' : undefined}
                  className={`block text-sm transition-colors ${
                    isActive(l) ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={quoteHref}
                onClick={(e) => {
                  onQuoteClick(e)
                  setMobileOpen(false)
                }}
                className="btn-charge block text-sm text-center font-semibold bg-brand-red text-white px-4 py-2.5 rounded-lg"
              >
                <span>Get a quote</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
