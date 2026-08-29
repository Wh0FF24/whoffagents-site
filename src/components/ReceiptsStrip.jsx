/**
 * ReceiptsStrip — true operational facts as texture.
 * Every fragment here is verifiable: the build stamp is injected at build
 * time, the brief/report cadence is the org's standing schedule, and the
 * demo line is a real number answered by an agent.
 *
 * Station-clock upgrade: SSR (and the pre-hydration static page) renders
 * exactly the strings below. After mount, the [base] cell becomes a live
 * Provo wall clock (America/Denver, correct for any visitor timezone) and
 * the [cadence] note becomes an honest countdown to the next real cron run
 * (am-brief 07:30 / pm-report 17:00 MT). Fixed-height mono lines — no CLS.
 */
import { useEffect, useState } from 'react'
import OpsTape from './OpsTape'
import '../styles/board.css'

const receipts = [
  { k: 'build', v: typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '—', note: 'agents built · human reviewed' },
  { k: 'cadence', v: 'am-brief 07:30', note: 'pm-report 17:00' },
  { k: 'agents on duty', v: 'phones · email · builds', note: 'ask us for a live demo call', href: '#lead-form' },
  { k: 'base', v: 'provo, utah', note: 'independent · $0 VC' },
]

const AM_BRIEF = 7 * 60 + 30 // 07:30 MT — the real morning cron
const PM_REPORT = 17 * 60 //    17:00 MT — the real evening cron

/* Wall-clock parts in America/Denver, whatever the visitor's TZ. */
function denverNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Denver',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (t) => {
    const p = parts.find((x) => x.type === t)
    return p ? p.value : '00'
  }
  return { h: get('hour'), m: get('minute'), s: get('second') }
}

/* Honest countdown to the next standing run, midnight rollover included. */
function nextRun({ h, m }) {
  const mins = Number(h) * 60 + Number(m)
  let label = 'am-brief'
  let at = AM_BRIEF
  if (mins >= AM_BRIEF && mins < PM_REPORT) {
    label = 'pm-report'
    at = PM_REPORT
  } else if (mins >= PM_REPORT) {
    at = AM_BRIEF + 24 * 60
  }
  const d = at - mins
  return `next: ${label} in ${Math.floor(d / 60)}h ${String(d % 60).padStart(2, '0')}m`
}

function Colon() {
  return <span className="tape-colon">:</span>
}

export default function ReceiptsStrip() {
  // null until mounted -> SSR and hydration render the static strings
  const [now, setNow] = useState(null)

  useEffect(() => {
    const tick = () => {
      if (!document.hidden) setNow(denverNow()) // paused off-tab
    }
    tick()
    const id = setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  return (
    <div className="relative border-y border-white/[0.06] overflow-hidden">
      {/* faint circuit band behind */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: 'url(/art/divider-texture.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 font-mono">
        {receipts.map(({ k, v, note, href }) => {
          let vNode = v
          let noteNode = note
          if (now && k === 'base') {
            vNode = (
              <>provo {now.h}<Colon />{now.m}<Colon />{now.s} MT</>
            )
          }
          if (now && k === 'cadence') noteNode = nextRun(now)
          return (
            <div key={k} className="min-w-0">
              <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">[{k}]</div>
              {href ? (
                <a href={href} className="text-[12.5px] text-gray-100 hover:text-brand-red-bright transition-colors whitespace-nowrap">{vNode}</a>
              ) : (
                <div className="text-[12.5px] text-gray-100 whitespace-nowrap">{vNode}</div>
              )}
              <div className="text-[10px] text-gray-400 truncate">{noteNode}</div>
            </div>
          )
        })}
      </div>
      {/* ops tape — the receipts' long-form sibling, same band */}
      <div className="relative max-w-6xl mx-auto px-6 pb-5 font-mono">
        <OpsTape />
      </div>
    </div>
  )
}
