/**
 * DashedRule — full-width dashed structure rule in the schematic grammar:
 * 2px dashes at low alpha (currentColor, so it tints with its context),
 * square junction dots at 12% and 88%, and an optional right-aligned mono
 * micro-label. Purely decorative (aria-hidden), self-contained (no CSS
 * dependency), SSR-safe. Usage: <DashedRule label="sec.04 / proof" />
 */
export default function DashedRule({ label, className = '', style }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}
    >
      <svg
        width="100%"
        height="9"
        style={{ flex: '1 1 auto', minWidth: 0, display: 'block' }}
      >
        <line
          x1="0"
          y1="4.5"
          x2="100%"
          y2="4.5"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1"
          strokeDasharray="2 5"
          vectorEffect="non-scaling-stroke"
        />
        <rect x="12%" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.55" />
        <rect x="88%" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.55" />
      </svg>
      {label ? (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#5C636C',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}
