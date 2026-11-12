import { corners, rhythmRing, round } from './hud';

// Shared pieces of the Eidolon figures. Each figure is drawn in a 400 by 400
// box. Crimson with gold marks what an outside observer does; royal blue with
// silver marks the protected phone and its decoys.

// Corner marks and a short scale along the bottom edge.
export function FrameMarks() {
  return (
    <g className="eid-frame">
      <path className="eid-frame-corners" d="M14 30V14H30M370 14H386V30M386 370V386H370M30 386H14V370" />
      <path
        className="eid-frame-scale"
        d={Array.from({ length: 29 }, (_, index) => `M${60 + index * 10} 386v${index % 7 === 0 ? -6 : -3}`).join('')}
      />
    </g>
  );
}

// A phone, centred on (x, y).
export function Phone({ x = 0, y = 0, width = 26, height = 46, className = '' }) {
  const left = -width / 2;
  const top = -height / 2;
  return (
    <g className={`eid-phone ${className}`.trim()} transform={`translate(${x} ${y})`}>
      <rect className="eid-phone-body" x={left} y={top} width={width} height={height} rx={width * 0.2} />
      <rect className="eid-phone-screen" x={left + width * 0.12} y={top + height * 0.12} width={width * 0.76} height={height * 0.74} rx={width * 0.07} />
      <path className="eid-phone-ear" d={`M${-width * 0.15} ${top + height * 0.065}H${width * 0.15}`} />
    </g>
  );
}

// The ring of a day's activity around a phone or a decoy.
export function RhythmRing({ pattern, inner = 20, reach = 11, className = '' }) {
  return (
    <g className={`eid-ring ${className}`.trim()}>
      {rhythmRing(pattern, inner, reach).map((bar, hour) => (
        <line key={hour} x1={bar.x1} y1={bar.y1} x2={bar.x2} y2={bar.y2} />
      ))}
    </g>
  );
}

// The observer's reticle, centred on its own origin so it can be moved and
// scaled as one piece.
export function Reticle({ half = 44, className = '' }) {
  const reach = half + 10;
  return (
    <g className={`eid-reticle-body ${className}`.trim()}>
      <circle className="eid-reticle-ring" r={round(half * 0.66)} />
      <path className="eid-reticle-corners" d={corners(0, 0, half, round(half * 0.3))} />
      <path className="eid-reticle-cross" d={`M0 ${-reach}V${-half + 5}M0 ${half - 5}V${reach}M${-reach} 0H${-half + 5}M${half - 5} 0H${reach}`} />
      <path className="eid-reticle-pip" d={`M-4 ${-reach - 5}L0 ${-reach + 1}L4 ${-reach - 5}Z`} />
    </g>
  );
}
