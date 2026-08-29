/**
 * fx.js — the systems layer. One idle boot, one rAF clock (study law:
 * a tiny motion vocabulary on a single clock).
 *
 *  SCRUB   every [data-scrub] element carries a --px custom property that
 *          runs 0 → 1 across its viewport transit (0 = top edge enters the
 *          viewport bottom, 1 = bottom edge leaves the viewport top).
 *          Consumers (TheGate etc.) read it with calc()/clamp() in CSS.
 *          Implementation note: we deliberately use the rAF path on every
 *          browser instead of CSS animation-timeline: view(). Animating a
 *          registered custom property is main-thread work either way (custom
 *          props are not compositor-animatable), view() silently binds to the
 *          nearest overflow ancestor (an overflow:hidden section would freeze
 *          the timeline), and one code path behaves identically in Chrome,
 *          Safari and Firefox. The rAF writer only touches elements currently
 *          in view (one IntersectionObserver) and skips writes < 0.002.
 *          Reduced motion: --px is set to 1 once — final states, no frames.
 *
 *  DECODE  .eyebrow and [data-decode] text scramble-decodes once on
 *          scroll-in: left→right sweep (~18ms/char), unresolved chars
 *          reshuffle every ~40ms from the schematic charset, block cursor
 *          rides the boundary. Operates on TEXT NODES only, so the CSS
 *          ::before '▸ ' and child spans survive untouched. Element width is
 *          frozen (min-width) during the run — zero layout shift. Skipped
 *          entirely under reduced motion.
 *
 *  GLIDE   Lenis smooth scroll, desktop only (hover + fine pointer, ≥1024px,
 *          no reduced motion), driven by the same rAF clock. html.lenis /
 *          html.glide-on flip scroll-behavior to auto (Lenis requirement —
 *          index.css sets smooth). Hash anchors are intercepted (Lenis
 *          honors the target's scroll-mt-*, else −64 nav offset) unless a
 *          component already handled the click; route-change scroll resets
 *          keep working because Lenis re-syncs on external native scrolls.
 *
 * SSR-safe: nothing touches window/document at module scope or during
 * render. initFx() is idempotent and defers all work past first paint.
 * The site is fully functional with this module absent.
 */

let booted = false
let queued = false

const REDUCE = '(prefers-reduced-motion: reduce)'
const FINE = '(hover: hover) and (pointer: fine)'
const DECODE_SEL = '.eyebrow, [data-decode]'
const GLYPHS = '▪▸/\\|=+·01'
const CURSOR = '▮'
const SWEEP_MS = 18 // per-char resolve sweep
const SHUF_MS = 40 // unresolved reshuffle interval

// ---------------------------------------------------------------- rAF clock
const frameFns = new Set()
let rafId = 0

function pump(t) {
  rafId = 0
  if (!frameFns.size) return
  frameFns.forEach((fn) => fn(t))
  if (frameFns.size && !rafId) rafId = requestAnimationFrame(pump)
}
function onFrame(fn) {
  frameFns.add(fn)
  if (!rafId) rafId = requestAnimationFrame(pump)
}
function offFrame(fn) {
  frameFns.delete(fn)
}

// ---------------------------------------------------------------- scrub
let reduced = false
let scrubIO = null
const scrubInView = new Set()

function setPx(el, v) {
  el.style.setProperty('--px', v)
}

function scrubProgress(el, vh) {
  const r = el.getBoundingClientRect()
  const v = (vh - r.top) / (vh + r.height)
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function scrubFrame() {
  // one pass per scroll/resize event burst, then sleeps until the next one
  offFrame(scrubFrame)
  const vh = window.innerHeight
  scrubInView.forEach((el) => {
    const v = scrubProgress(el, vh)
    if (el.__fxPx !== undefined && Math.abs(v - el.__fxPx) < 0.002) return
    el.__fxPx = v
    setPx(el, v.toFixed(4))
  })
}

function wakeScrub() {
  if (scrubInView.size) onFrame(scrubFrame)
}

function initScrub() {
  try {
    // typed + inherited: consumers see a real number 0 before the first write
    if (window.CSS && CSS.registerProperty) {
      CSS.registerProperty({ name: '--px', syntax: '<number>', inherits: true, initialValue: 0 })
    }
  } catch { /* already registered (HMR) — fine */ }
  if (reduced) return
  scrubIO = new IntersectionObserver((entries) => {
    const vh = window.innerHeight
    entries.forEach((entry) => {
      if (entry.isIntersecting) scrubInView.add(entry.target)
      else {
        scrubInView.delete(entry.target)
        // park at the correct end state on the way out
        const v = scrubProgress(entry.target, vh)
        entry.target.__fxPx = v
        setPx(entry.target, v.toFixed(4))
      }
    })
    wakeScrub()
  }, { rootMargin: '64px 0px' })
  window.addEventListener('scroll', wakeScrub, { passive: true })
  window.addEventListener('resize', wakeScrub)
}

// ---------------------------------------------------------------- decode
let decodeIO = null
const decodeJobs = []

function shufChar(c) {
  return c === ' ' || c === '\u00a0' || c === '\n' || c === '\t'
    ? c
    : GLYPHS[(Math.random() * GLYPHS.length) | 0]
}

function startDecode(el) {
  const nodes = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let n
  while ((n = walker.nextNode())) {
    if (n.data) nodes.push({ node: n, chars: Array.from(n.data) })
  }
  const total = nodes.reduce((s, x) => s + x.chars.length, 0)
  if (!total) return
  const w = el.getBoundingClientRect().width
  if (w) el.style.minWidth = w + 'px' // freeze width — zero CLS
  decodeJobs.push({
    el,
    nodes,
    total,
    t0: performance.now(),
    shufT: 0,
    scr: nodes.map((x) => x.chars.map(shufChar)),
  })
  onFrame(decodeFrame)
}

function finishDecode(job) {
  job.nodes.forEach((entry) => {
    const text = entry.chars.join('')
    if (entry.node.data !== text) entry.node.data = text
  })
  job.el.style.minWidth = ''
}

function decodeFrame(t) {
  for (let i = decodeJobs.length - 1; i >= 0; i--) {
    const job = decodeJobs[i]
    const solved = (t - job.t0) / SWEEP_MS
    if (solved >= job.total || !job.el.isConnected) {
      finishDecode(job)
      decodeJobs.splice(i, 1)
      continue
    }
    const reshuffle = t - job.shufT >= SHUF_MS
    if (reshuffle) job.shufT = t
    let idx = 0
    job.nodes.forEach((entry, ni) => {
      const chars = entry.chars
      let out = ''
      for (let c = 0; c < chars.length; c++, idx++) {
        if (idx < solved) out += chars[c]
        else if (idx < solved + 1) out += CURSOR // block cursor on the boundary
        else {
          if (reshuffle) job.scr[ni][c] = shufChar(chars[c])
          out += job.scr[ni][c]
        }
      }
      if (entry.node.data !== out) entry.node.data = out
    })
  }
  if (!decodeJobs.length) offFrame(decodeFrame)
}

function initDecode() {
  if (reduced) return // labels simply render their final text
  decodeIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      decodeIO.unobserve(entry.target)
      startDecode(entry.target)
    })
  }, { threshold: 0.1 })
}

// ---------------------------------------------------------------- glide
let lenis = null
let styleEl = null

function lenisFrame(t) {
  if (lenis) lenis.raf(t)
}

function onAnchorClick(e) {
  if (!lenis || e.defaultPrevented || e.button !== 0) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = e.target.closest && e.target.closest('a[href^="#"]')
  if (!a) return
  const id = decodeURIComponent(a.getAttribute('href').slice(1))
  const target = id && document.getElementById(id)
  if (!target) return
  e.preventDefault()
  // Lenis already subtracts the target's scroll-margin-top (the pages tune
  // nav clearance per-element via scroll-mt-*); fall back to -64 (fixed nav
  // height) only for targets that declare no margin of their own.
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  const offset = margin > 0 ? 0 : -64
  lenis.scrollTo(target, {
    offset,
    // un-revealed sections sit translateY(14px) low when measured mid-page;
    // one corrective pass (no onComplete of its own — cannot loop) settles it
    onComplete: () => {
      const want = margin > 0 ? margin : 64
      if (Math.abs(target.getBoundingClientRect().top - want) > 3) {
        lenis.scrollTo(target, { offset, duration: 0.25 })
      }
    },
  })
  history.pushState(null, '', '#' + id)
}

function initGlide() {
  if (reduced) return
  if (!window.matchMedia(FINE).matches || window.innerWidth < 1024) return
  import('lenis')
    .then(({ default: Lenis }) => {
      if (lenis || reduced) return
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1.0, smoothWheel: true, autoRaf: false })
      document.documentElement.classList.add('glide-on')
      document.addEventListener('click', onAnchorClick)
      onFrame(lenisFrame)
      window.__lenis = lenis // integration hook / verification
    })
    .catch(() => { /* glide is a garnish — native scroll is the fallback */ })
}

// ---------------------------------------------------------------- scan / boot
let scanQueued = false

function scan() {
  scanQueued = false
  document.querySelectorAll('[data-scrub]').forEach((el) => {
    if (el.__fxScrub) return
    el.__fxScrub = true
    if (reduced) setPx(el, 1) // final states visible, zero per-frame work
    else scrubIO.observe(el)
  })
  if (!reduced) {
    document.querySelectorAll(DECODE_SEL).forEach((el) => {
      if (el.__fxDec) return
      el.__fxDec = true
      decodeIO.observe(el)
    })
  }
}

function queueScan() {
  if (scanQueued) return
  scanQueued = true
  requestAnimationFrame(scan)
}

/** Live downgrade if the OS setting flips mid-session (upgrade needs reload). */
function goReduced() {
  if (reduced) return
  reduced = true
  while (decodeJobs.length) finishDecode(decodeJobs.pop())
  if (scrubIO) scrubIO.disconnect()
  scrubInView.clear()
  document.querySelectorAll('[data-scrub]').forEach((el) => setPx(el, 1))
  if (lenis) {
    lenis.destroy()
    lenis = null
    document.documentElement.classList.remove('glide-on')
    document.removeEventListener('click', onAnchorClick)
  }
}

function boot() {
  if (booted) return
  booted = true
  const reduceMq = window.matchMedia(REDUCE)
  reduced = reduceMq.matches
  if (reduceMq.addEventListener) {
    reduceMq.addEventListener('change', (e) => { if (e.matches) goReduced() })
  }

  // Lenis requires scroll-behavior: auto while active (index.css sets
  // smooth). NOTE: Lenis wipes any root class starting with "lenis-" on
  // every state change (cleanUpClassName), so the planned "lenis-on" name
  // self-destructs — we target Lenis's own guaranteed html.lenis class and
  // keep html.glide-on as our explicit marker.
  styleEl = document.createElement('style')
  styleEl.textContent = 'html.lenis,html.glide-on{scroll-behavior:auto !important}'
  document.head.appendChild(styleEl)

  initScrub()
  initDecode()
  initGlide()
  scan()
  new MutationObserver(queueScan).observe(document.body, { childList: true, subtree: true })
}

export function initFx() {
  if (typeof document === 'undefined') return // SSR / prerender
  if (booted || queued) return
  queued = true
  const idle = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(boot, { timeout: 1500 })
    else setTimeout(boot, 120)
  }
  // hold init until after LCP: idle-schedule once the page has loaded
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
}
