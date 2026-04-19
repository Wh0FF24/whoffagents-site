import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import posthog from 'posthog-js'

/**
 * Product Hunt launch-day banner.
 *
 * Activates automatically on April 21, 2026 (any timezone) and stays live for 48hr.
 * Manual override: set localStorage 'ph-banner-force' to 'on' or 'off' for testing.
 *
 * To deactivate post-launch: change ACTIVE_END to a past date or remove component
 * import from Home.jsx. To swap PH URL: update PH_URL constant when listing goes live.
 */

// Bake-in timing — adjust if launch date moves
const ACTIVE_START = new Date('2026-04-21T00:00:00-07:00') // Tue Apr 21 12:01am PT
const ACTIVE_END = new Date('2026-04-23T00:00:00-07:00')   // Thu Apr 23 12:01am PT — 48hr launch window
const PH_URL = 'https://www.producthunt.com/posts/whoff-agents'

export default function PHLaunchBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    // Manual overrides for testing (paste in console: localStorage.setItem('ph-banner-force','on'))
    const force = localStorage.getItem('ph-banner-force')
    if (force === 'on') {
      setActive(true)
      return
    }
    if (force === 'off') {
      setActive(false)
      return
    }
    // Auto-activate during launch window
    const now = new Date()
    setActive(now >= ACTIVE_START && now < ACTIVE_END)
  }, [])

  // Restore dismissal state from sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem('ph-banner-dismissed') === '1') {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('ph-banner-dismissed', '1')
  }

  if (!active || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-brand-red via-brand-red to-brand-gold text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">🚀</span>
            <p className="text-sm md:text-base font-semibold truncate">
              <span className="hidden sm:inline">We&apos;re LIVE on Product Hunt today.</span>
              <span className="sm:hidden">LIVE on Product Hunt.</span>
              {' '}Your upvote takes 2 seconds and means the world.
            </p>
          </div>
          <a
            href={PH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-brand-red font-bold text-sm px-4 py-2 rounded-lg hover:brightness-110 transition-all whitespace-nowrap"
            onClick={() => {
              // Track click in PostHog
              posthog.capture('ph_banner_click', { url: PH_URL })
            }}
          >
            Hunt Us →
          </a>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
