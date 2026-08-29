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
import '../styles/board.css'

const MONO = "'JetBrains Mono', ui-monospace, monospace"

const C = {
  line: '#2A2D33',
  red: '#E5484D',
  redDim: 'rgba(229,72,77,0.55)',
  ok: '#3ECF6E',
  amber: '#F5A11C',
  text: '#8A9099',
  faint: '#5C636C',
  panel: '#0E0F12',
}

function Node({ x, y, w = 92, h = 34, label, sub, accent = false, blink = false, cycleLed }) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx="3"
        fill={C.panel}
        stroke={accent ? C.redDim : C.line}
        strokeWidth="1"
      />
      {/* corner tick */}
      <path d={`M ${x} ${y + 8} V ${y} H ${x + 8}`} fill="none" stroke={accent ? C.red : C.faint} strokeWidth="1" />
      {cycleLed ? (
        /* stacked LED: green base, amber flips on while the lane works */
        <>
          <circle cx={x + w - 10} cy={y + 10} r="2.5" fill={C.ok} />
          <circle cx={x + w - 10} cy={y + 10} r="2.5" fill={C.amber} className={`ob-led ${cycleLed}`} />
        </>
      ) : (
        <circle cx={x + w - 10} cy={y + 10} r="2.5" fill={accent ? C.red : C.ok} className={blink ? 'status-blink' : undefined} />
      )}
      <text x={x + 10} y={y + (sub ? 16 : 21)} fontFamily={MONO} fontSize="8.5" letterSpacing="1.5" fill="#D7DADE">{label}</text>
      {sub && (
        <text x={x + 10} y={y + 27} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.faint}>{sub}</text>
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
        <Trace d="M 96 165 H 148" boot={1} cycleClass="ob-t1" />
        {/* atlas fan-out to three lanes */}
        <Trace d="M 240 152 H 262 V 62 H 300" boot={2} cycleClass="ob-t2" />
        <Trace d="M 240 165 H 300" boot={3} cycleClass="ob-t3" />
        <Trace d="M 240 178 H 262 V 268 H 300" boot={4} cycleClass="ob-t4" />
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
        {/* orchestrator — double ring, outer ring flashes as the brief lands */}
        <g>
          <rect x={148} y={140} width={92} height={50} rx="4" fill={C.panel} stroke={C.redDim} strokeWidth="1" />
          <rect x={144} y={136} width={100} height={58} rx="6" fill="none" stroke="rgba(229,72,77,0.22)" strokeWidth="1" />
          <rect x={144} y={136} width={100} height={58} rx="6" fill="none" stroke={C.red} strokeWidth="1.5" className="ob-flash ob-flash-ring" />
          <circle cx={160} cy={152} r="2.5" fill={C.red} className="node-breathe" />
          <text x={172} y={156} fontFamily={MONO} fontSize="9" letterSpacing="2" fill="#FFFFFF">ATLAS</text>
          <text x={158} y={172} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.text}>orchestrator · 24/7</text>
          <text x={158} y={182} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.faint}>routes every job</text>
        </g>

        <Node x={300} y={45} label="WEBSITES" sub="design + build" accent cycleLed="ob-led-1" />
        <Node x={300} y={148} label="AGENTS" sub="phones · email" accent cycleLed="ob-led-2" />
        <Node x={300} y={251} label="TOOLS" sub="skills · MCP" accent cycleLed="ob-led-3" />

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
