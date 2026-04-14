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
      {/* PH Launch Banner */}
      <div className="w-full bg-brand-red/90 text-white text-xs text-center py-2 px-4">
        Product Hunt launch: $47 → $97 on April 22.{' '}
        <a
          href="https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:opacity-80 transition-opacity"
        >
          Get the Starter Kit before it goes up →
        </a>
      </div>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Whoff Agents"
            className="h-9 w-9 rounded-md"
          />
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold text-white tracking-tight">
              whoff agents
            </span>
            <span className="text-[10px] text-brand-silver/60 tracking-widest uppercase">
              by Atlas
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/products"
            className={`text-sm transition-colors duration-200 cursor-pointer ${location.pathname === '/products' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Tools
          </Link>
          <Link
            to="/blog"
            className={`text-sm transition-colors duration-200 cursor-pointer ${location.pathname.startsWith('/blog') ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
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
            className="text-sm px-4 py-2 rounded-lg border border-brand-silver/30 text-brand-silver hover:border-brand-gold/50 hover:text-brand-gold transition-colors duration-200 cursor-pointer"
          >
            Free Guide
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
                className={`block text-sm transition-colors cursor-pointer ${location.pathname === '/products' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                Tools
              </Link>
              <Link
                to="/blog"
                className={`block text-sm transition-colors cursor-pointer ${location.pathname.startsWith('/blog') ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
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
                className="block text-sm text-center font-semibold bg-brand-red text-white px-4 py-2.5 rounded-lg cursor-pointer"
              >
                Get Free Guide
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
