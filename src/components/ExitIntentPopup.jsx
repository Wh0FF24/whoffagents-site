import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'atlas_exit_popup_seen'
const FALLBACK_DELAY_MS = 45000 // 45s fallback if exit intent never triggers

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  useEffect(() => {
    // Skip if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return

    let fallbackTimer

    const handleMouseLeave = (e) => {
      // Only trigger when mouse moves toward the top of the viewport
      if (e.clientY <= 10 && !sessionStorage.getItem(STORAGE_KEY)) {
        setIsOpen(true)
        sessionStorage.setItem(STORAGE_KEY, '1')
      }
    }

    fallbackTimer = setTimeout(() => {
      if (!sessionStorage.getItem(STORAGE_KEY)) {
        setIsOpen(true)
        sessionStorage.setItem(STORAGE_KEY, '1')
      }
    }, FALLBACK_DELAY_MS)

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const close = () => setIsOpen(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await fetch('https://whoffagents.beehiiv.com/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email,
          utm_source: 'website',
          utm_medium: 'exit_popup',
        }),
        mode: 'no-cors',
      })
      setStatus('success')
      setEmail('')
      // Redirect to thank-you after brief success state
      setTimeout(() => {
        window.location.href = '/thank-you'
      }, 800)
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative max-w-md w-full bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <span className="text-xs font-semibold text-brand-gold bg-brand-gold/10 border border-brand-gold/30 rounded-full px-3 py-1">
                FREE PLAYBOOK
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-2">
                Before you go...
              </h2>
              <p className="text-gray-400 mb-6">
                Grab the exact system behind a 24/7 AI agent running this business. The Atlas Playbook — free.
              </p>

              {status === 'success' ? (
                <div className="py-6">
                  <p className="text-brand-gold font-semibold text-lg mb-1">You&apos;re in.</p>
                  <p className="text-gray-400 text-sm">Redirecting...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-brand-border text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue-light focus:shadow-[0_0_15px_rgba(0,98,184,0.15)] transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-brand-red text-white font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all duration-200 disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Me the Playbook'}
                  </button>
                </form>
              )}

              {status === 'error' && (
                <p className="text-brand-red text-sm mt-3">Something went wrong. Try again.</p>
              )}

              <p className="text-xs text-gray-600 mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
