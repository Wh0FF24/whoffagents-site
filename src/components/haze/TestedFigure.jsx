import { GATE, TEST_MARKS, TEST_ROWS } from './hazeData';

// Two kinds of decoy move toward a detector. The random kind, uneven and
// turned every which way, stops there and drops. The tested kind, which
// comes in the short runs real activity comes in, passes and carries on.
// The markup is the finished frame. The motion runs the two rows from the
// left and plays each arrival at the detector.
const place = (mark, turn) => `translate(${mark.x} ${mark.y})${turn ? ` rotate(${turn})` : ''}`;

export default function TestedFigure() {
  const { caught, waiting, tested } = TEST_MARKS;
  return (
    <svg className="hz-fig hz-fig--tested" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hz-gate-fill" x1="0" x2="1">
          <stop offset="0" stopColor="#dfe6f0" stopOpacity="0" />
          <stop offset="0.5" stopColor="#dfe6f0" stopOpacity="0.34" />
          <stop offset="1" stopColor="#dfe6f0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hz-gate-stop">
          <stop offset="0" stopColor="#f4f7fb" stopOpacity="0.72" />
          <stop offset="1" stopColor="#f4f7fb" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hz-gate-through">
          <stop offset="0" stopColor="#8fb3ff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#8fb3ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <line className="hz-row-line" x1="30" y1={TEST_ROWS.random} x2="370" y2={TEST_ROWS.random} />
      <line className="hz-row-line" x1="30" y1={TEST_ROWS.tested} x2="370" y2={TEST_ROWS.tested} />

      <text className="hz-t hz-t--strong" x="30" y={TEST_ROWS.random - 34}>
        Random
      </text>
      <text className="hz-t hz-t--strong" x="30" y={TEST_ROWS.tested - 34}>
        Tested
      </text>
      <text className="hz-t hz-test-out hz-test-out--caught" x="370" y={TEST_ROWS.random - 34} textAnchor="end">
        Caught
      </text>
      <text className="hz-t hz-test-out hz-test-out--passes" x="370" y={TEST_ROWS.tested - 34} textAnchor="end">
        Passes
      </text>

      <g className="hz-gate">
        <rect className="hz-gate-glow" x={GATE.x - 15} y={GATE.top} width="30" height={GATE.bottom - GATE.top} fill="url(#hz-gate-fill)" />
        <line className="hz-gate-line" x1={GATE.x} y1={GATE.top} x2={GATE.x} y2={GATE.bottom} />
        <circle className="hz-gate-stop" cx={GATE.x} cy={TEST_ROWS.random} r="22" fill="url(#hz-gate-stop)" />
        <circle className="hz-gate-through" cx={GATE.x} cy={TEST_ROWS.tested} r="22" fill="url(#hz-gate-through)" />
      </g>
      <text className="hz-t hz-t--dim" x={GATE.x} y={GATE.top - 14} textAnchor="middle">
        Detector
      </text>

      <g className="hz-marks hz-marks--random">
        {waiting.map((mark) => (
          <g key={mark.x} className="hz-mark hz-mark--waiting" transform={place(mark, mark.turn)}>
            <rect x={-mark.size / 2} y={-mark.size / 2} width={mark.size} height={mark.size} rx="1.4" />
          </g>
        ))}
        {caught.map((mark) => (
          <g key={mark.x} className="hz-mark hz-mark--caught" transform={place(mark, mark.restTurn)}>
            <rect x={-mark.size / 2} y={-mark.size / 2} width={mark.size} height={mark.size} rx="1.4" />
          </g>
        ))}
      </g>
      <g className="hz-marks hz-marks--tested">
        {tested.map((mark) => (
          <g key={mark.x} className={`hz-mark hz-mark--tested is-${mark.kind}`} transform={place(mark)}>
            <circle r={mark.r} />
          </g>
        ))}
      </g>
    </svg>
  );
}
