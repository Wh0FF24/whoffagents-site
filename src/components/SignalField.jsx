import { useEffect, useRef, useState } from 'react'

/**
 * SignalField — the site's one canvas splurge: the drafting grid coming
 * alive. A sparse dot-matrix (26px pitch, 1px dots) fills its parent
 * absolutely; slow red signal pulses travel along random rows/columns, and
 * on desktop the dots near the cursor brighten while the nearest few snap
 * to small red squares (the brand's junction grammar).
 *
 * Gates: hover + fine pointer AND no reduced motion — otherwise renders
 * nothing after mount. SSR renders an inert placeholder div so hydration is
 * clean. Init is idle-scheduled; the rAF loop pauses offscreen (IO) and on
 * document.hidden; DPR capped at 1.5. Mount inside a positioned wrapper.
 */
const GATE = '(hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const GAP = 26 // grid pitch, CSS px
const RADIUS = 130 // pointer influence
const TAIL = GAP * 5 // pulse comet length

export default function SignalField() {
  const [mode, setMode] = useState('ssr') // 'ssr' → 'on' | 'off'
  const ref = useRef(null)

  useEffect(() => {
    const ok = window.matchMedia(GATE).matches && !window.matchMedia(REDUCE).matches
    setMode(ok ? 'on' : 'off')
  }, [])

  useEffect(() => {
    if (mode !== 'on') return
    const canvas = ref.current
    if (!canvas) return
    let ctx = null
    let raf = 0
    let idleId = 0
    let resizeT = 0
    let running = false
    let onscreen = true
    let w = 0
    let h = 0
    const ptr = { x: -9e3, y: -9e3, cx: -9e3, cy: -9e3, active: false }
    const pulses = []
    let nextPulse = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeT)
      resizeT = setTimeout(size, 150)
    })
    const io = new IntersectionObserver((es) => {
      onscreen = es[0] ? es[0].isIntersecting : true
      sync()
    })

    function size() {
      if (!ctx) return
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const ease = (x) => 1 - Math.pow(1 - x, 3)

    function draw(t) {
      raf = running ? requestAnimationFrame(draw) : 0
      if (!running || !w) return
      // lerped cursor for the trailing feel
      ptr.x += (ptr.cx - ptr.x) * 0.12
      ptr.y += (ptr.cy - ptr.y) * 0.12
      if (t >= nextPulse) {
        if (pulses.length < 3) {
          const horiz = Math.random() < 0.5
          pulses.push({
            horiz,
            line: Math.round(Math.random() * ((horiz ? h : w) / GAP)) * GAP,
            t0: t,
            dur: 2600 + Math.random() * 1800,
            dir: Math.random() < 0.5 ? 1 : -1,
          })
        }
        nextPulse = t + 3000 + Math.random() * 2200
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        if (t - pulses[i].t0 > pulses[i].dur) pulses.splice(i, 1)
      }
      ctx.clearRect(0, 0, w, h)
      const near = [] // up to 3 nearest dots -> red junction squares
      const usePtr = ptr.active
      ctx.fillStyle = '#fff'
      for (let y = 0; y <= h; y += GAP) {
        for (let x = 0; x <= w; x += GAP) {
          let a = 0.1
          if (usePtr) {
            const dx = x - ptr.x
            const dy = y - ptr.y
            const d2 = dx * dx + dy * dy
            if (d2 < RADIUS * RADIUS) {
              const f = 1 - Math.sqrt(d2) / RADIUS // eased falloff
              a = 0.1 + 0.45 * f * f
              if (near.length < 3) near.push({ d2, x, y })
              else {
                let m = 0
                for (let k = 1; k < 3; k++) if (near[k].d2 > near[m].d2) m = k
                if (d2 < near[m].d2) near[m] = { d2, x, y }
              }
            }
          }
          ctx.globalAlpha = a
          ctx.fillRect(x, y, 1, 1)
        }
      }
      // signal pulses: a brightened segment traveling along its trace
      ctx.fillStyle = 'rgba(229,72,77,1)'
      for (const p of pulses) {
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
      // nearest dots snap to 2px junction squares
      if (usePtr) {
        for (const nd of near) {
          ctx.globalAlpha = 0.9 * (1 - Math.sqrt(nd.d2) / RADIUS)
          ctx.fillRect(nd.x - 1, nd.y - 1, 2, 2)
        }
      }
      ctx.globalAlpha = 1
    }

    function sync() {
      const should = onscreen && !document.hidden
      if (should === running) return
      running = should
      if (running && !raf) raf = requestAnimationFrame(draw)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      ptr.cx = e.clientX - rect.left
      ptr.cy = e.clientY - rect.top
      if (!ptr.active) {
        ptr.active = true
        ptr.x = ptr.cx // teleport on entry — no sweep-in streak
        ptr.y = ptr.cy
      }
    }
    function onLeave() {
      ptr.active = false
    }
    function onVis() {
      sync()
    }

    idleId = ('requestIdleCallback' in window)
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : setTimeout(start, 200)

    function start() {
      idleId = 0
      ctx = canvas.getContext('2d')
      if (!ctx) return
      size()
      ro.observe(canvas.parentElement)
      io.observe(canvas)
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', onLeave)
      document.addEventListener('visibilitychange', onVis)
      sync()
    }

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      clearTimeout(resizeT)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [mode])

  if (mode === 'off') return null
  const style = { position: 'absolute', inset: 0, pointerEvents: 'none' }
  if (mode === 'ssr') return <div aria-hidden="true" style={style} />
  return <canvas ref={ref} aria-hidden="true" style={style} />
}
