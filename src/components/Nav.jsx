import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b border-white/5 transition-colors duration-300 ${
        scrolled ? 'bg-brand-dark/90 backdrop-blur-xl' : 'bg-brand-dark/70 backdrop-blur-xl'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-brand-cyan tracking-tight">
          whoff agents
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/products"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Tools
          </Link>
          <Link
            to="/blog"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Blog
          </Link>
          <Link
            to="/#newsletter"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="text-sm px-4 py-2 rounded-lg border border-brand-purple/50 text-brand-purple hover:bg-brand-purple/10 transition-colors duration-200 cursor-pointer"
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-white cursor-pointer"
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
              <Link
                to="/products"
                className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Tools
              </Link>
              <Link
                to="/blog"
                className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Blog
              </Link>
              <Link
                to="/#newsletter"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault()
                    document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  setMobileOpen(false)
                }}
                className="block text-sm text-brand-purple cursor-pointer"
              >
                Subscribe
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
