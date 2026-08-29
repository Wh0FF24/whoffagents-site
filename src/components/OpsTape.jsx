/**
 * OpsTape — the operating log as texture. Every line is real: the standing
 * cron cadence (am-brief 07:30 / pm-report 17:00), the latest
 * conventional-commit subjects injected at build time (__OPS_LINES__, from
 * `git log` — filtered in vite.config.js / prerender.mjs), and the build
 * stamp. The full list is prerendered as static text; after window load —
 * and only in-viewport, and only when motion is allowed — it re-types
 * itself once, character by character. Layout height is reserved up front,
 * so typing can never shift the page.
 */
import { useEffect, useRef } from 'react'
import '../styles/board.css'

const BUILD = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '—'
const COMMITS = typeof __OPS_LINES__ !== 'undefined' ? __OPS_LINES__ : []

const LINES = [
  'am-brief 07:30 — compiled + delivered',
  'pm-report 17:00 — filed',
  ...COMMITS,
  `deploy whoffagents.com · build ${BUILD}`,
]

const LINE_H = 18 // px per line, fixed — the CLS guard

/* Re-type the already-rendered lines, one at a time, ~28ms/char.
   Runs once; pauses while the tab is hidden. */
function typeInto(list) {
  const items = Array.from(list.children)
  if (items.length === 0) return
  const caret = document.createElement('span')
  caret.className = 'tape-caret'
  items.forEach((li) => {
    li.dataset.full = li.textContent
    li.textContent = ''
  })
  items[0].appendChild(caret)
  let line = 0
  let chr = 0
  const tick = () => {
    if (document.hidden) {
      setTimeout(tick, 300) // paused off-tab
      return
    }
    const li = items[line]
    if (!li) {
      caret.remove()
      return
    }
    chr += 1
    li.textContent = li.dataset.full.slice(0, chr)
    if (chr >= li.dataset.full.length) {
      line += 1
      chr = 0
      const next = items[line]
      if (!next) {
        caret.remove() // done — never re-runs
        return
      }
      next.appendChild(caret)
      setTimeout(tick, 220) // beat between lines
    } else {
      li.appendChild(caret)
      setTimeout(tick, 28)
    }
  }
  setTimeout(tick, 260)
}

export default function OpsTape() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return undefined
    let io
    const arm = () => {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect()
            typeInto(el)
          }
        },
        { threshold: 0.25 }
      )
      io.observe(el)
    }
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })
    return () => {
      if (io) io.disconnect()
      window.removeEventListener('load', arm)
    }
  }, [])

  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1.5">[ what our agents did today ]</div>
      <ul
        ref={ref}
        className="m-0 p-0 list-none text-[11.5px] leading-none text-gray-300"
        style={{ height: LINES.length * LINE_H }}
      >
        {LINES.map((l, i) => (
          <li key={`${i}:${l}`} className="whitespace-nowrap overflow-hidden" style={{ height: LINE_H, lineHeight: `${LINE_H}px` }}>
            {l}
          </li>
        ))}
      </ul>
    </div>
  )
}
