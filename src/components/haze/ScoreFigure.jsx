import { GAUGE, LENS, LENS_POINTS, SCREEN, scoreAt } from './hazeData';

// A sample of the screen the app would show. A small window on the mix: one
// point is you, the rest are decoys. Under it, a gauge with a worded end on
// each side. It is a picture of an interface, not a reading. The markup is
// the frame the gauge comes to rest on. The motion starts it at the easy end.
export default function ScoreFigure() {
  const rest = scoreAt(GAUGE.rest);
  return (
    <svg className="hz-fig hz-fig--score" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hz-gauge-fill" x1="0" x2="1">
          <stop offset="0" stopColor="#e6ebf1" />
          <stop offset="1" stopColor="#2f6be8" />
        </linearGradient>
        <radialGradient id="hz-lens-fill">
          <stop offset="0" stopColor="#0e2248" />
          <stop offset="1" stopColor="#070d18" />
        </radialGradient>
        <radialGradient id="hz-you-glow">
          <stop offset="0" stopColor="#f4f7fb" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f4f7fb" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect className="hz-screen" x={SCREEN.x} y={SCREEN.y} width={SCREEN.width} height={SCREEN.height} rx="24" />
      <text className="hz-t hz-t--strong hz-screen-name" x={GAUGE.left} y={SCREEN.y + 40}>
        Haze
      </text>
      <text className="hz-t hz-t--dim" x={GAUGE.right} y={SCREEN.y + 40} textAnchor="end">
        Sample screen
      </text>
      <line className="hz-screen-rule" x1={GAUGE.left} y1={SCREEN.y + 56} x2={GAUGE.right} y2={SCREEN.y + 56} />

      <circle className="hz-lens" cx={LENS.x} cy={LENS.y} r={LENS.r} fill="url(#hz-lens-fill)" />
      <g className="hz-lens-points">
        {LENS_POINTS.points.map((point, index) => (
          <circle key={index} className="hz-lens-dot" cx={point.x} cy={point.y} r={point.r} data-order={point.order} opacity={rest.decoy(point.order)} />
        ))}
        <circle className="hz-lens-glow" cx={LENS_POINTS.you.x} cy={LENS_POINTS.you.y} r="19" fill="url(#hz-you-glow)" opacity={rest.youGlow} />
        <circle className="hz-lens-you" cx={LENS_POINTS.you.x} cy={LENS_POINTS.you.y} r={rest.youR} fill={rest.youFill} />
      </g>

      <text className="hz-t hz-t--dim" x={GAUGE.left} y={GAUGE.y - 22}>
        Score
      </text>
      <rect className="hz-gauge-track" x={GAUGE.left} y={GAUGE.y - 4} width={GAUGE.right - GAUGE.left} height="8" rx="4" fill="url(#hz-gauge-fill)" />
      <g className="hz-gauge-sway">
        <g className="hz-gauge-mark" transform={`translate(${rest.markX} ${GAUGE.y})`}>
          <circle className="hz-gauge-glow" r="15" />
          <circle className="hz-gauge-knob" r="8" />
        </g>
      </g>
      <text className="hz-t" x={GAUGE.left} y={GAUGE.y + 32}>
        Easy to pick out
      </text>
      <text className="hz-t" x={GAUGE.right} y={GAUGE.y + 32} textAnchor="end">
        Hard to pick out
      </text>
      <text className="hz-t hz-notice" x="200" y={GAUGE.y + 60} textAnchor="middle" opacity={rest.notice}>
        The blur is not working.
      </text>
    </svg>
  );
}
