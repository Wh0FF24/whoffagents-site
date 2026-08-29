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

export function SectionHeader({ index, eyebrow, title, lede, center = false, className = '' }) {
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      <p className="eyebrow mb-4">
        {index && <span className="text-gray-600 mr-2">{index}</span>}
        {eyebrow}
      </p>
      <h2 className="type-h2 mb-4">{title}</h2>
      {lede && <p className={`text-gray-400 leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''}`}>{lede}</p>}
    </div>
  )
}
