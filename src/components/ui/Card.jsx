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

/**
 * Numbered section header. With an index it gains the ghost numeral and the
 * self-soldering circuit rule; both render in their final state without JS
 * and play a one-time entrance when the reveal system (html.js + [data-reveal].in)
 * scrolls them into view. overflow-hidden clips the numeral bleed so narrow
 * viewports never get a horizontal scrollbar.
 */
export function SectionHeader({ index, eyebrow, title, lede, center = false, className = '' }) {
  return (
    <div className={`relative overflow-hidden ${center ? 'text-center' : ''} ${className}`}>
      {index && (
        <span className="ghost-index" aria-hidden="true">
          {index}
        </span>
      )}
      <div className="relative z-10">
        <p className="eyebrow mb-4">
          {index && <span className="text-gray-600 mr-2">{index}</span>}
          {eyebrow}
        </p>
        <h2 className="type-h2 mb-4">{title}</h2>
        {lede && <p className={`text-gray-400 leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''}`}>{lede}</p>}
      </div>
      {index && (
        /* soldered rule — base trace + terminal pad in trace grey; red overlay
           self-draws once on reveal, square junctions pop in as it passes.
           vector-effect keeps 1px strokes 1px under preserveAspectRatio="none";
           junctions are near-zero square-cap segments so they stay SQUARE
           (a real 2x2 rect would stretch into a slab at full width). */
        <svg
          className="solder-rule"
          aria-hidden="true"
          width="100%"
          height="12"
          viewBox="0 0 100 12"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 9 H58 V3 H92" stroke="#2A2D33" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M92 3 h0.01" stroke="#2A2D33" strokeWidth="5" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
          <path
            className="sr-draw"
            d="M0 9 H58 V3 H89"
            pathLength="100"
            strokeDasharray="100"
            stroke="#E5484D"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path className="sr-j sr-j1" d="M30 9 h0.01" stroke="#E5484D" strokeWidth="3" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
          <path className="sr-j sr-j2" d="M74 3 h0.01" stroke="#E5484D" strokeWidth="3" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  )
}
