/**
 * SwitchboardBoard — the /agents hero schematic.
 *
 * Five channels — the page's real capabilities list — patch into one agent
 * core, switchboard style. One 10-second cycle, five 2-second slots: the
 * live jack's LED flips amber, a pulse runs its trace into the core, the
 * core ring flashes on arrival, and the caption under the board names the
 * same channel. Same grammar as OrchestrationBoard (mono labels, panel
 * nodes, corner ticks, dash pulses); CSS-only motion via board.css; the
 * static render is complete for prerender and reduced motion.
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

/* jacks — one per capability on this page (subs are fragments of that copy) */
const jacks = [
  { y: 40, label: 'PHONE', sub: 'every call' },
  { y: 116, label: 'EMAIL', sub: 'triage · drafts' },
  { y: 192, label: 'SMS', sub: 'threads moving' },
  { y: 268, label: 'CRON', sub: 'on a clock' },
  { y: 344, label: 'SKILLS·MCP', sub: 'integrations' },
]

/* patch traces: jack (right edge x=108) into the core (left edge x=360) */
const traces = [
  'M 108 57 H 200 V 185 H 360',
  'M 108 133 H 260 V 197 H 360',
  'M 108 209 H 360',
  'M 108 285 H 260 V 221 H 360',
  'M 108 361 H 200 V 233 H 360',
]

/* captions — derived from the capabilities copy rendered on this page */
const captions = [
  'phone: answers every call · takes messages · books callbacks',
  'email: sorts · flags · drafts for your approval',
  'sms: answers · confirms · keeps threads moving',
  'cron: morning briefs · monitoring · reports on a clock',
  'skills: custom Claude skills · MCP integrations',
]

function Jack({ y, label, sub, slot }) {
  const x = 16
  const w = 92
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx="3" fill={C.panel} stroke={C.redDim} strokeWidth="1" />
      <path d={`M ${x} ${y + 8} V ${y} H ${x + 8}`} fill="none" stroke={C.red} strokeWidth="1" />
      {/* stacked LED: green base, amber while this channel is live */}
      <circle cx={x + 82} cy={y + 10} r="2.5" fill={C.ok} />
      <circle cx={x + 82} cy={y + 10} r="2.5" fill={C.amber} className={`swb-led swb-s${slot}`} />
      <text x={x + 10} y={y + 16} fontFamily={MONO} fontSize="8.5" letterSpacing="1.5" fill="#D7DADE">{label}</text>
      <text x={x + 10} y={y + 27} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.faint}>{sub}</text>
    </g>
  )
}

export default function SwitchboardBoard() {
  return (
    <div aria-hidden="true">
      <svg viewBox="0 0 560 420" className="w-full block" role="presentation">
        {/* faint drafting grid */}
        <g stroke="rgba(255,255,255,0.025)" strokeWidth="1">
          {[70, 140, 210, 280, 350].map((y) => <line key={y} x1="0" y1={y} x2="560" y2={y} />)}
          {[80, 160, 240, 320, 400, 480].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="420" />)}
        </g>

        {/* patch traces + slot pulses */}
        {traces.map((d, i) => (
          <g key={d}>
            <path d={d} pathLength="100" fill="none" stroke={C.line} strokeWidth="1" />
            <path
              d={d} pathLength="100" fill="none" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"
              className={`swb-pulse swb-t${i + 1}`}
            />
          </g>
        ))}

        {/* junction dots at the patch elbows */}
        {[[200, 185], [260, 197], [260, 221], [200, 233]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="2" fill={C.line} />
        ))}

        {/* jacks */}
        {jacks.map((j, i) => <Jack key={j.label} {...j} slot={i + 1} />)}

        {/* agent core — double ring, flashes as each channel patches in */}
        <g>
          <rect x={360} y={175} width={140} height={70} rx="4" fill={C.panel} stroke={C.redDim} strokeWidth="1" />
          <rect x={356} y={171} width={148} height={78} rx="6" fill="none" stroke="rgba(229,72,77,0.22)" strokeWidth="1" />
          <rect x={356} y={171} width={148} height={78} rx="6" fill="none" stroke={C.red} strokeWidth="1.5" className="swb-core" />
          <circle cx={372} cy={187} r="2.5" fill={C.red} className="node-breathe" />
          <text x={384} y={191} fontFamily={MONO} fontSize="9" letterSpacing="2" fill="#FFFFFF">AGENT</text>
          <text x={370} y={209} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.text}>24/7 · no hold music</text>
          <text x={370} y={219} fontFamily={MONO} fontSize="6.5" letterSpacing="0.8" fill={C.faint}>scoped per project</text>
        </g>

        {/* footer receipt — same true lines as the home board */}
        <text x={16} y={408} fontFamily={MONO} fontSize="7.5" letterSpacing="1" fill={C.faint}>
          build {typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '—'}
        </text>
        <text x={544} y={408} textAnchor="end" fontFamily={MONO} fontSize="7.5" letterSpacing="1" fill={C.faint}>
          provo, ut
        </text>
      </svg>

      {/* channel captions — cross-fade on the same 10s clock as the jacks.
          Fixed h-5 container: zero layout shift. */}
      <div className="relative h-5 mt-3">
        {captions.map((c, i) => (
          <span
            key={c}
            className={`swb-cap${i === 0 ? ' swb-cap-first' : ''} swb-s${i + 1} mono-note absolute inset-x-0 text-center whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
