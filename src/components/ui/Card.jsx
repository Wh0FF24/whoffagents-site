import '../../styles/micro.css'

/**
 * The one card primitive. Every boxed surface on the site goes through here
 * (or uses .card-surface directly) so panels read as one system.
 *
 *  - featured: red-tinted surface for the highlighted item in a set
 *  - ticks:    drafting-mark corners for hero-level surfaces
 */
export default function Card({ featured = false, ticks = false, className = '', children, ...rest }) {
  return (
    <div
      className={[
        'card-surface',
        featured ? 'card-surface--featured' : '',
        ticks ? 'corner-ticks' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}

/* Section accent rotation — the company palette, cycled by section number so
   the page moves through scarlet → gold → royal → silver instead of running
   red-on-black end to end. Ghost alphas differ per hue because the same alpha
   reads very differently against near-black. */
const SECTION_ACCENTS = [
  { line: '#E5484D', ghost: 'rgba(229, 72, 77, 0.30)' }, // scarlet
  { line: '#F5A11C', ghost: 'rgba(245, 161, 28, 0.26)' }, // gold
  { line: '#3D8BDE', ghost: 'rgba(61, 139, 222, 0.30)' }, // royal (brand blue, lifted for the dark ground)
  { line: '#C0C0C0', ghost: 'rgba(192, 192, 192, 0.20)' }, // silver
]

function accentFor(index) {
  const n = parseInt(String(index), 10)
  return SECTION_ACCENTS[(Number.isFinite(n) ? n - 1 : 0) % SECTION_ACCENTS.length]
}

/**
 * Put these on a SECTION wrapper and everything inside it — icon chips, card
 * borders, drafting ticks, check marks, hover states — picks up that section's
 * colour instead of defaulting to red. Works because the Tailwind theme is
 * declared with @theme (not @theme inline), so `text-brand-red-bright` and
 * friends compile to var() references we can re-point per scope.
 * --color-brand-red (solid CTA fills) is deliberately NOT rotated here; it is
 * re-pinned on .btn-charge/.cta-solid so the action colour stays constant.
 */
export function accentVars(index) {
  const a = accentFor(index)
  return {
    '--sec-accent': a.line,
    '--sec-ghost': a.ghost,
    '--tick': `${a.line}BF`,
    '--tick-hot': a.line,
    '--color-brand-red-bright': a.line,
    '--color-brand-red': a.line,
  }
}

/**
 * Numbered section header. With an index it gains the ghost numeral and the
 * self-soldering circuit rule; both render in their final state without JS
 * and play a one-time entrance when the reveal system (html.js + [data-reveal].in)
 * scrolls them into view.
 *
 * .sh-clip clips HORIZONTALLY ONLY. The previous overflow-hidden also clipped
 * vertically, which sliced the top off every ghost numeral; the numeral is
 * meant to bleed up into the section's padding.
 */
export function SectionHeader({ index, eyebrow, title, lede, center = false, className = '' }) {
  const accent = accentFor(index)
  return (
    <div
      className={`relative sh-clip ${center ? 'text-center' : ''} ${className}`}
      style={index ? { '--sec-accent': accent.line, '--sec-ghost': accent.ghost } : undefined}
    >
      {index && (
        <span className="ghost-index" aria-hidden="true">
          {index}
        </span>
      )}
      <div className="relative z-10">
        <p className="eyebrow mb-4">
          {index && <span className="mr-2" style={{ color: accent.line }}>{index}</span>}
          {eyebrow}
        </p>
        <h2 className="type-h2 mb-4">{title}</h2>
        {lede && <p className={`text-gray-400 leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''}`}>{lede}</p>}
      </div>
      {index && (
        /* soldered rule — base trace + terminal pad in trace grey; the accent
           overlay self-draws once on reveal, square junctions pop in as it
           passes, and a short pulse then runs the line continuously (the
           board's trace grammar). The rule turns down at both ends, opening
           a bracket around the section's content.
           vector-effect keeps 1px strokes 1px under preserveAspectRatio="none";
           junctions are near-zero square-cap segments so they stay SQUARE
           (a real 2x2 rect would stretch into a slab at full width). */
        <svg
          className="solder-rule"
          aria-hidden="true"
          width="100%"
          height="20"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: accent.line }}
        >
          <path d="M0 20 V9 H58 V3 H99 V20" stroke="#2A2D33" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M92 3 h0.01" stroke="#2A2D33" strokeWidth="5" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
          <path
            className="sr-draw"
            d="M0 20 V9 H58 V3 H99 V20"
            pathLength="100"
            strokeDasharray="100"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* continuous carrier pulse — always running, like the board traces */}
          <path
            className="sr-pulse"
            d="M0 20 V9 H58 V3 H99 V20"
            pathLength="100"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path className="sr-j sr-j1" d="M30 9 h0.01" stroke="currentColor" strokeWidth="3" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
          <path className="sr-j sr-j2" d="M74 3 h0.01" stroke="currentColor" strokeWidth="3" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  )
}
