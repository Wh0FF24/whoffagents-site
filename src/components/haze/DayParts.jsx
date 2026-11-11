import { CARD, CHIPS, DAY, DAY_PARTS, RHYTHM_BAND, RHYTHM_DECOYS, RHYTHM_REAL, SOFT_CHIPS } from './hazeData';

// Shared pieces of the two figures that show a day of activity: rows of
// points along the day, and the profile that can be read off them.

// Whose activity is whose. The decoys join it in the second figure.
export function Legend({ decoys = false }) {
  return (
    <g className="hz-legend">
      <g className="hz-legend-item hz-legend-item--you">
        <circle className="hz-legend-you" cx="33" cy="42" r="4" />
        <text className="hz-t" x="44" y="46.4">
          You
        </text>
      </g>
      {decoys && (
        <g className="hz-legend-item hz-legend-item--decoys">
          <circle className="hz-legend-decoy" cx="87" cy="42" r="4" />
          <text className="hz-t" x="98" y="46.4">
            Decoys
          </text>
        </g>
      )}
    </g>
  );
}

// The parts of the day, under the rows.
export function DayAxis() {
  return (
    <g className="hz-day-axis">
      {DAY_PARTS.map((part) => (
        <text key={part.label} className="hz-t hz-t--dim hz-day-part" x={part.x} y="228" textAnchor="middle">
          {part.label}
        </text>
      ))}
    </g>
  );
}

// One row of activity: what it is about, and when it happens. A real row is
// silver. A decoy row is blue, and keeps a slow pulse of its own.
export function DayRow({ row, kind, extra }) {
  return (
    <g
      className={`hz-row hz-row--${kind}`}
      data-row={row.id}
      data-each={row.each}
      style={row.pace ? { '--pace': `${row.pace}s` } : undefined}
    >
      <text className="hz-t hz-row-label" x="28" y={row.y + 4.2}>
        {row.label}
      </text>
      <line className="hz-row-line" x1={DAY.left - 8} y1={row.y} x2={DAY.right + 8} y2={row.y} />
      <g className="hz-row-dots">
        {row.points.map((point, index) => (
          <circle key={index} className="hz-dot" cx={point.x} cy={point.y} r={point.r} data-fx={point.fromX} data-fy={point.fromY} data-order={point.order} />
        ))}
      </g>
      {extra && (
        <g className="hz-row-dots hz-row-dots--mixed">
          {extra.points.map((point, index) => (
            <circle key={index} className="hz-dot hz-dot--mixed" cx={point.x} cy={point.y} r={point.r} />
          ))}
        </g>
      )}
    </g>
  );
}

// The profile. On its own it is sharp: a clear line of daily rhythm, a
// routine in words, interests by name. With `mixed`, the soft version is
// drawn over it: every decoy's rhythm laid on top, and soft shapes where the
// words were. The page shows the soft one. The motion starts from the sharp.
export function ProfileCard({ mixed = false }) {
  const bottom = CARD.y + CARD.height;
  return (
    <g className="hz-card">
      {mixed && (
        <g className="hz-card-feather">
          <rect x={CARD.x} y={CARD.y} width={CARD.width} height={CARD.height} rx="14" />
          <rect x={CARD.x} y={CARD.y} width={CARD.width} height={CARD.height} rx="14" />
          <rect x={CARD.x} y={CARD.y} width={CARD.width} height={CARD.height} rx="14" />
        </g>
      )}
      <rect className="hz-card-edge" x={CARD.x} y={CARD.y} width={CARD.width} height={CARD.height} rx="14" />
      <text className="hz-t hz-t--strong hz-card-title" x={CARD.left} y={CARD.y + 25}>
        Profile
      </text>
      <text className="hz-t hz-card-state hz-card-state--sharp" x={CARD.right} y={CARD.y + 25} textAnchor="end">
        Sharp
      </text>
      {mixed && (
        <text className="hz-t hz-card-state hz-card-state--blurry" x={CARD.right} y={CARD.y + 25} textAnchor="end">
          Blurry
        </text>
      )}

      {mixed && <path className="hz-rhythm-band" d={RHYTHM_BAND} fill="url(#hz-band-fill)" />}
      {mixed && RHYTHM_DECOYS.map((line, index) => <path key={index} className="hz-rhythm hz-rhythm--decoy" d={line} />)}
      {mixed && <path className="hz-rhythm hz-rhythm--faded" d={RHYTHM_REAL} />}
      <path className="hz-rhythm hz-rhythm--real" d={RHYTHM_REAL} />

      <text className="hz-t hz-t--dim hz-card-name hz-card-name--routine" x={CARD.left} y={bottom - 42}>
        Routine
      </text>
      <text className="hz-t hz-card-routine" x={CARD.valueX} y={bottom - 42}>
        Up early, online late
      </text>
      {mixed && <rect className="hz-soft hz-card-routine-soft" x={CARD.valueX} y={bottom - 53} width="148" height="13" rx="6.5" fill="url(#hz-soft-fill)" />}

      <text className="hz-t hz-t--dim hz-card-name hz-card-name--interests" x={CARD.left} y={bottom - 16}>
        Interests
      </text>
      {CHIPS.map((chip) => (
        <g key={chip.label} className="hz-chip">
          <rect x={chip.x} y={bottom - 30} width={chip.width} height="20" rx="10" />
          <text className="hz-t" x={chip.x + chip.width / 2} y={bottom - 16} textAnchor="middle">
            {chip.label}
          </text>
        </g>
      ))}
      {mixed && SOFT_CHIPS.map((chip) => <rect key={chip.x} className="hz-soft hz-soft-chip" x={chip.x} y={bottom - 28} width={chip.width} height="16" rx="8" fill="url(#hz-soft-fill)" />)}
    </g>
  );
}

// Fills for the soft shapes in the mixed profile.
export function SoftDefs() {
  return (
    <defs>
      <linearGradient id="hz-soft-fill" x1="0" x2="1">
        <stop offset="0" stopColor="#9db4dc" stopOpacity="0" />
        <stop offset="0.18" stopColor="#9db4dc" stopOpacity="0.5" />
        <stop offset="0.82" stopColor="#9db4dc" stopOpacity="0.5" />
        <stop offset="1" stopColor="#9db4dc" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="hz-band-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6f9bff" stopOpacity="0.42" />
        <stop offset="1" stopColor="#6f9bff" stopOpacity="0.04" />
      </linearGradient>
    </defs>
  );
}
