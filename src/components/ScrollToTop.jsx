import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // allow the page transition to mount before seeking the anchor
      const t = setTimeout(() => {
        let id
        try { id = decodeURIComponent(hash.slice(1)) } catch { return }
        document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      }, 350)
      return () => clearTimeout(t)
    }
    // Instant, not the page's smooth scroll-behavior: a glide to the top
    // would still be under way when the new page's ScrollTrigger refreshes,
    // and it restores the mid-glide position.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
