/**
 * OrchestrationBoard — the hero's living schematic.
 *
 * A hand-tuned SVG of how this company actually works, choreographed as ONE
 * job cycle on a 12-second clock: a brief enters intake, Atlas flashes and
 * fans the work out to three build lanes, the lanes work (LEDs go amber),
 * results converge on the human review gate, the board HOLDS while the gate
 * blinks amber and flips to PASS, then the job ships. CSS-only motion
 * (stroke-dashoffset + opacity — GPU cheap), phase-locked via animation
 * delays in board.css. Everything freezes complete under
 * prefers-reduced-motion. No particle libraries, no canvas loops.
 */
import { useNavigate } from 'react-router-dom'
import '../styles/board.css'

const MONO = "'JetBrains Mono', ui-monospace, monospace"

const C = {
  line: '#2A2D33',
  red: '#E5484D',
  redDim: 'rgba(229,72,77,0.55)',
  ok: '#3ECF6E',
  amber: '#F5A11C',
  text: '#8A9099',
  faint: '#98A0A9',
  panel: '#0E0F12',
}

/* The three build lanes ARE the three business lines, so each carries its own
   company colour: scarlet / gold / royal. Hovering a lane lights its whole
   circuit and reveals what that line actually does; clicking goes there. */
const LANES = [
  {
    n: 1, label: 'WEBSITES', sub: 'design + build', y: 45, led: 'ob-led-1',
    tint: '#E5484D', dim: 'rgba(229,72,77,0.55)',
    out: 'M 252 152 H 262 V 62 H 300', back: 'M 392 62 H 414 V 152 H 436',
    detail: 'flat pricing · live in days', to: '#web-studio',
  },
  {
    n: 2, label: 'AGENTS', sub: 'phones · email', y: 148, led: 'ob-led-2',
    tint: '#F5A11C', dim: 'rgba(245,161,28,0.55)',
    out: 'M 252 165 H 300', back: 'M 392 165 H 436',
    detail: 'phones · inbox · texts · routines', to: '/agents',
  },
  {
    n: 3, label: 'TOOLS', sub: 'skills · MCP', y: 251, led: 'ob-led-3',
    tint: '#3D8BDE', dim: 'rgba(61,139,222,0.55)',
    out: 'M 252 178 H 262 V 268 H 300', back: 'M 392 268 H 414 V 178 H 436',
    detail: 'skills · MCP servers · kits', to: '/products',
  },
]

function Node({ x, y, w = 92, h = 34, label, sub, accent = false, blink = false, cycleLed, tint, dim }) {
  const edge = tint || C.red
  return (
    <g>
      <rect
        className="ob-node-box"
        x={x} y={y} width={w} height={h} rx="3"
        fill={C.panel}
        stroke={accent ? (dim || C.redDim) : C.line}
        strokeWidth="1"
      />
      {/* corner tick */}
      <path d={`M ${x} ${y + 8} V ${y} H ${x + 8}`} fill="none" stroke={accent ? edge : C.faint} strokeWidth="1" />
      {cycleLed ? (
        /* stacked LED: green base, amber flips on while the lane works */
        <>
          <circle cx={x + w - 10} cy={y + 10} r="2.5" fill={C.ok} />
          <circle cx={x + w - 10} cy={y + 10} r="2.5" fill={C.amber} className={`ob-led ${cycleLed}`} />
        </>
      ) : (
        <circle cx={x + w - 10} cy={y + 10} r="2.5" fill={accent ? C.red : C.ok} className={blink ? 'status-blink' : undefined} />
      )}
      <text className="ob-node-label" x={x + 10} y={y + (sub ? 16 : 21)} fontFamily={MONO} fontSize="8.5" letterSpacing="1.5" fill="#D7DADE">{label}</text>
      {sub && (
        <text x={x + 10} y={y + 27} fontFamily={MONO} fontSize="6.5" letterSpacing="0.6" fill={C.faint}>{sub}</text>
      )}
    </g>
  )
}

function Trace({ d, boot, cycleClass }) {
  return (
    <>
      <path
        d={d} pathLength="100" fill="none" stroke={C.line} strokeWidth="1"
        className={boot ? `ob-boot ob-boot-${boot}` : undefined}
      />
      {cycleClass && (
        <path
          d={d} pathLength="100" fill="none" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"
          className={`ob-pulse ${cycleClass}`}
        />
      )}
    </>
  )
}

export default function OrchestrationBoard() {
  const navigate = useNavigate()
  /* lane click → that business line. Hash targets go through Lenis when the
     glide is running so the landing matches every other anchor on the page. */
  const go = (to) => {
    if (!to.startsWith('#')) {
      navigate(to)
      return
    }
    const el = document.querySelector(to)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el)
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="card-surface corner-ticks overflow-hidden" aria-hidden="true">
      {/* board chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
        <span className="w-2 h-2 rounded-full bg-brand-red-bright/80" />
        <span
          className="text-[10px] tracking-[0.14em] uppercase text-gray-500"
          style={{ fontFamily: MONO }}
        >
          whoff-agents / orchestration
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-ok status-blink" />
          <span className="text-[9px] text-gray-600" style={{ fontFamily: MONO }}>live</span>
        </span>
      </div>

      <svg viewBox="0 0 560 330" className="w-full block" role="img" aria-label="Schematic of the studio: agents build in three lanes, a human reviews, work ships">
        {/* faint drafting grid */}
        <g stroke="rgba(255,255,255,0.025)" strokeWidth="1">
          {[56, 112, 168, 224, 280].map((y) => <line key={y} x1="0" y1={y} x2="560" y2={y} />)}
          {[80, 160, 240, 320, 400, 480].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="330" />)}
        </g>

        {/* ---- traces (drawn first, under nodes) ----
             cycle order: t1 intake · t2–t4 fan-out · t5–t7 converge · t8 ship */}
        {/* intake -> atlas */}
        <Trace d="M 96 165 H 136" boot={1} cycleClass="ob-t1" />
        {/* atlas fan-out to three lanes */}
        <Trace d="M 252 152 H 262 V 62 H 300" boot={2} cycleClass="ob-t2" />
        <Trace d="M 252 165 H 300" boot={3} cycleClass="ob-t3" />
        <Trace d="M 252 178 H 262 V 268 H 300" boot={4} cycleClass="ob-t4" />
        {/* lanes -> review gate */}
        <Trace d="M 392 62 H 414 V 152 H 436" boot={5} cycleClass="ob-t5" />
        <Trace d="M 392 165 H 436" boot={6} cycleClass="ob-t6" />
        <Trace d="M 392 268 H 414 V 178 H 436" boot={7} cycleClass="ob-t7" />
        {/* review -> ship */}
        <Trace d="M 500 132 V 108" boot={8} cycleClass="ob-t8" />

        {/* junction dots */}
        {[[262, 62], [262, 268], [414, 152], [414, 178]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="2" fill={C.line} />
        ))}

        {/* ---- nodes ---- */}
        <Node x={16} y={148} w={80} label="INTAKE" sub="your brief" />
        {/* orchestrator — double ring, outer ring flashes as the brief lands.
            Box runs 140→248 so "orchestrator · 24/7" sits inside it; the old
            92-wide box let that line run past its own right edge. */}
        <g>
          <rect x={140} y={140} width={108} height={50} rx="4" fill={C.panel} stroke={C.redDim} strokeWidth="1" />
          <rect x={136} y={136} width={116} height={58} rx="6" fill="none" stroke="rgba(229,72,77,0.22)" strokeWidth="1" />
          <rect x={136} y={136} width={116} height={58} rx="6" fill="none" stroke={C.red} strokeWidth="1.5" className="ob-flash ob-flash-ring" />
          <circle cx={152} cy={152} r="2.5" fill={C.red} className="node-breathe" />
          <text x={164} y={156} fontFamily={MONO} fontSize="9" letterSpacing="2" fill="#FFFFFF">ATLAS</text>
          <text x={150} y={172} fontFamily={MONO} fontSize="6.5" letterSpacing="0.6" fill={C.text}>orchestrator · 24/7</text>
          <text x={150} y={182} fontFamily={MONO} fontSize="6.5" letterSpacing="0.6" fill={C.faint}>routes every job</text>
        </g>

        {/* the three lanes — each its own colour, each a live control:
            hover lights its circuit end to end, click goes to that line */}
        {LANES.map((L) => (
          <g
            key={L.n}
            className="ob-lane"
            style={{ color: L.tint }}
            onClick={() => go(L.to)}
          >
            {/* highlight overlays: same geometry as the base traces, lit on hover */}
            <path className="ob-hl" d={L.out} fill="none" stroke={L.tint} strokeWidth="1.5" />
            <path className="ob-hl" d={L.back} fill="none" stroke={L.tint} strokeWidth="1.5" />
            <Node
              x={300} y={L.y} label={L.label} sub={L.sub} accent
              cycleLed={L.led} tint={L.tint} dim={L.dim}
            />
            <text
              className="ob-lane-detail"
              x={300} y={L.y + 47}
              fontFamily={MONO} fontSize="6.5" letterSpacing="0.6" fill={L.tint}
            >
              {L.detail} →
            </text>
          </g>
        ))}

        {/* review gate — the human. THE HOLD: LED blinks amber twice,
            caption flips to PASS, then the job is released to ship. */}
        <g>
          <rect x={436} y={132} width={128} height={66} rx="4" fill={C.panel} stroke={C.line} strokeWidth="1" />
          <path d="M 436 140 V 132 H 444" fill="none" stroke={C.ok} strokeWidth="1" />
          <circle cx={448} cy={148} r="2.5" fill={C.ok} />
          <circle cx={448} cy={148} r="2.5" fill={C.amber} className="ob-gate" />
          <text x={458} y={151} fontFamily={MONO} fontSize="8.5" letterSpacing="1.5" fill="#D7DADE">HUMAN REVIEW</text>
          <text x={446} y={168} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.text}>nothing ships without</text>
          <text x={446} y={178} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.text}>a person signing off</text>
          <text x={446} y={190} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.faint} className="ob-idle">gate: WILL</text>
          <text x={446} y={190} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.ok} className="ob-pass">PASS · gate: WILL</text>
        </g>

        {/* ship — flashes as the released job lands */}
        <g>
          <rect x={468} y={74} width={64} height={34} rx="3" fill="rgba(229,72,77,0.08)" stroke={C.redDim} strokeWidth="1" />
          <rect x={468} y={74} width={64} height={34} rx="3" fill="rgba(229,72,77,0.28)" stroke={C.red} strokeWidth="1" className="ob-flash ob-flash-ship" />
          <text x={480} y={95} fontFamily={MONO} fontSize="9" letterSpacing="2" fill="#FFFFFF">SHIP</text>
          <circle cx={522} cy={84} r="2.5" fill={C.red} className="node-breathe" />
        </g>

        {/* footer receipt — every line true */}
        <text x={16} y={318} fontFamily={MONO} fontSize="7.5" letterSpacing="1" fill={C.faint}>
          am-brief 07:30 · pm-report 17:00 · build {typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '—'}
        </text>
        <text x={544} y={318} textAnchor="end" fontFamily={MONO} fontSize="7.5" letterSpacing="1" fill={C.faint}>
          provo, ut
        </text>
      </svg>
    </div>
  )
}
