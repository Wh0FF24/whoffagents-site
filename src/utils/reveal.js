/**
 * Site-wide scroll-reveal core (the one IntersectionObserver).
 * Contract: initReveal() adds .js to <html>, observes every [data-reveal],
 * flips .in once per element, then unobserves. Idempotent — pages call it
 * from a useEffect on mount. A MutationObserver picks up elements mounted
 * after route changes, so consumers never need to re-wire anything.
 * All CSS lives in index.css under an html.js scope, so prerendered /
 * no-JS HTML is never hidden. Under prefers-reduced-motion the observer
 * still adds .in (downstream CSS relies on it); the CSS shows content
 * statically. SSR-safe: nothing here touches document at module scope.
 */
let io = null
let queued = false

function scan() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (el.__rv) return
    el.__rv = true
    io.observe(el)
  })
}

function boot() {
  if (io) return
  document.documentElement.classList.add('js')
  io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in')
        io.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15 })
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true })
  scan()
}

export function initReveal() {
  if (typeof document === 'undefined') return
  if (io) { scan(); return }
  if (queued) return
  queued = true
  // Defer past first paint so the prerendered HTML lands un-hidden.
  if ('requestIdleCallback' in window) window.requestIdleCallback(boot)
  else setTimeout(boot, 1)
}
