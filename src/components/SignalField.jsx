import { useEffect, useRef, useState } from 'react'

/**
 * SignalField — the site's one canvas splurge: the drafting grid coming
 * alive. A sparse dot-matrix (26px pitch, 1px dots) sits FIXED behind the
 * whole document, so it stays with you past the hero and down every page.
 * Slow signal pulses travel random rows/columns in the company colours, the
 * dots near the cursor brighten (nearest few snap to junction squares), and
 * a click fires a ring that lights the grid as it expands.
 *
 * Cost control: the dim base grid is rasterised ONCE per resize onto an
 * offscreen canvas and blitted each frame, so per-frame work is only the
 * ~100 dots under the pointer plus whatever pulses/ripples are alive —
 * not the ~2,000 dots of a full viewport.
 *
 * Gates: hover + fine pointer AND no reduced motion — otherwise renders
 * nothing after mount. SSR renders an inert placeholder div so hydration is
 * clean. Init is idle-scheduled; the loop pauses on document.hidden;
 * DPR capped at 1.5. z-index -1 keeps it under all content but above the
 * page background.
 */
const GATE = '(hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const GAP = 26 // grid pitch, CSS px
const RADIUS = 130 // pointer influence
const TAIL = GAP * 5 // pulse comet length
const BASE_A = 0.1 // resting dot alpha
/* scarlet · gold · royal — the same rotation the sections and lanes use */
const COLORS = ['229,72,77', '245,161,28', '61,139,222']
const RIP_MS = 1100
const RIP_MAX = 460
const RIP_BAND = 34

export default function SignalField() {
  const [mode, setMode] = useState('ssr') // 'ssr' → 'on' | 'off'
  const ref = useRef(null)

  useEffect(() => {
    const ok = window.matchMedia(GATE).matches && !window.matchMedia(REDUCE).matches
    setMode(ok ? 'on' : 'off')
  }, [])

  useEffect(() => {
    if (mode !== 'on') return undefined
    const canvas = ref.current
    if (!canvas) return undefined
    let ctx = null
    let raf = 0
    let idleId = 0
    let resizeT = 0
    let running = false
    let dpr = 1
    let w = 0
    let h = 0
    const base = document.createElement('canvas') // cached dim grid
    const ptr = { x: -9e3, y: -9e3, cx: -9e3, cy: -9e3, active: false }
    const pulses = []
    const ripples = []
    let nextPulse = 0
    let hue = 0

    function size() {
      if (!ctx) return
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = Math.max(1, window.innerWidth)
      h = Math.max(1, window.innerHeight)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      base.width = canvas.width
      base.height = canvas.height
      // rasterise the resting grid once — blitted per frame thereafter
      const b = base.getContext('2d')
      b.setTransform(dpr, 0, 0, dpr, 0, 0)
      b.clearRect(0, 0, w, h)
      b.fillStyle = '#fff'
      b.globalAlpha = BASE_A
      for (let y = 0; y <= h; y += GAP) {
        for (let x = 0; x <= w; x += GAP) b.fillRect(x, y, 1, 1)
      }
    }

    const ease = (x) => 1 - Math.pow(1 - x, 3)
    const snap = (v) => Math.round(v / GAP) * GAP

    function draw(t) {
      raf = running ? requestAnimationFrame(draw) : 0
      if (!running || !w) return
      ptr.x += (ptr.cx - ptr.x) * 0.12 // lerped cursor — trailing feel
      ptr.y += (ptr.cy - ptr.y) * 0.12

      if (t >= nextPulse) {
        if (pulses.length < 3) {
          const horiz = Math.random() < 0.5
          pulses.push({
            horiz,
            line: snap(Math.random() * (horiz ? h : w)),
            t0: t,
            dur: 2600 + Math.random() * 1800,
            dir: Math.random() < 0.5 ? 1 : -1,
            c: COLORS[hue++ % COLORS.length],
          })
        }
        nextPulse = t + 3000 + Math.random() * 2200
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        if (t - pulses[i].t0 > pulses[i].dur) pulses.splice(i, 1)
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (t - ripples[i].t0 > RIP_MS) ripples.splice(i, 1)
      }

      // blit the resting grid at device scale, then work in CSS px
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(base, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // --- pointer field: only the dots inside the influence box ---
      if (ptr.active) {
        const near = []
        const x0 = snap(ptr.x - RADIUS)
        const x1 = ptr.x + RADIUS
        const y0 = snap(ptr.y - RADIUS)
        const y1 = ptr.y + RADIUS
        ctx.fillStyle = '#fff'
        for (let y = Math.max(0, y0); y <= Math.min(h, y1); y += GAP) {
          for (let x = Math.max(0, x0); x <= Math.min(w, x1); x += GAP) {
            const dx = x - ptr.x
            const dy = y - ptr.y
            const d2 = dx * dx + dy * dy
            if (d2 >= RADIUS * RADIUS) continue
            const f = 1 - Math.sqrt(d2) / RADIUS
            ctx.globalAlpha = BASE_A + 0.45 * f * f
            ctx.fillRect(x, y, 1, 1)
            if (near.length < 3) near.push({ d2, x, y })
            else {
              let m = 0
              for (let k = 1; k < 3; k++) if (near[k].d2 > near[m].d2) m = k
              if (d2 < near[m].d2) near[m] = { d2, x, y }
            }
          }
        }
        // the nearest few snap to junction squares
        ctx.fillStyle = `rgba(${COLORS[0]},1)`
        for (const nd of near) {
          ctx.globalAlpha = 0.9 * (1 - Math.sqrt(nd.d2) / RADIUS)
          ctx.fillRect(nd.x - 1, nd.y - 1, 2, 2)
        }
      }

      // --- signal pulses: a brightened segment traveling its trace ---
      for (const p of pulses) {
        ctx.fillStyle = `rgba(${p.c},1)`
        const k = ease((t - p.t0) / p.dur)
        const len = p.horiz ? w : h
        const head = (p.dir > 0 ? k : 1 - k) * len
        for (let u = 0; u <= len; u += GAP) {
          const behind = (head - u) * p.dir
          if (behind < 0 || behind > TAIL) continue
          ctx.globalAlpha = 0.5 * (1 - behind / TAIL)
          const s = behind < GAP ? 2 : 1 // 2px head — junction grammar
          if (p.horiz) ctx.fillRect(u - s + 1, p.line - s + 1, s, s)
          else ctx.fillRect(p.line - s + 1, u - s + 1, s, s)
        }
      }

      // --- click ripples: an expanding ring firing the grid it crosses ---
      for (const r of ripples) {
        const k = (t - r.t0) / RIP_MS
        const rad = ease(k) * RIP_MAX
        const fade = 1 - k
        ctx.fillStyle = `rgba(${r.c},1)`
        const x0 = snap(r.x - rad - RIP_BAND)
        const y0 = snap(r.y - rad - RIP_BAND)
        const x1 = r.x + rad + RIP_BAND
        const y1 = r.y + rad + RIP_BAND
        for (let y = Math.max(0, y0); y <= Math.min(h, y1); y += GAP) {
          for (let x = Math.max(0, x0); x <= Math.min(w, x1); x += GAP) {
            const d = Math.hypot(x - r.x, y - r.y)
            const off = Math.abs(d - rad)
            if (off > RIP_BAND) continue
            const edge = 1 - off / RIP_BAND
            ctx.globalAlpha = 0.85 * edge * edge * fade
            const s = edge > 0.72 ? 2 : 1
            ctx.fillRect(x - s + 1, y - s + 1, s, s)
          }
        }
      }
      ctx.globalAlpha = 1
    }

    function sync() {
      const should = !document.hidden
      if (should === running) return
      running = should
      if (running && !raf) raf = requestAnimationFrame(draw)
    }

    function onMove(e) {
      ptr.cx = e.clientX // fixed layer — viewport coords map 1:1
      ptr.cy = e.clientY
      if (!ptr.active) {
        ptr.active = true
        ptr.x = ptr.cx // teleport on entry — no sweep-in streak
        ptr.y = ptr.cy
      }
    }
    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return
      if (ripples.length > 2) ripples.shift()
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now(), c: COLORS[hue++ % COLORS.length] })
    }
    function onLeave() {
      ptr.active = false
    }
    function onResize() {
      clearTimeout(resizeT)
      resizeT = setTimeout(size, 150)
    }

    function start() {
      idleId = 0
      ctx = canvas.getContext('2d')
      if (!ctx) return
      size()
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
      window.addEventListener('resize', onResize)
      document.documentElement.addEventListener('mouseleave', onLeave)
      document.addEventListener('visibilitychange', sync)
      sync()
    }

    idleId = ('requestIdleCallback' in window)
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : setTimeout(start, 200)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      clearTimeout(resizeT)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', onResize)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [mode])

  if (mode === 'off') return null
  const style = { position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }
  if (mode === 'ssr') return <div aria-hidden="true" style={style} />
  return <canvas ref={ref} aria-hidden="true" style={style} />
}
