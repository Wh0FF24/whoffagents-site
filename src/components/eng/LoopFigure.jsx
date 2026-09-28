import { LOOP_STAGES } from '../core/coreChapters';

// The seven-stage working loop from the homepage, drawn large: people set
// the intent and make the judgment; AI plans and builds; independent review
// and measurement sit between. It runs through once as it arrives (data-run).
const R = 96;
const place = (index, radius) => {
  const a = ((index / LOOP_STAGES.length) * 360 - 90) * (Math.PI / 180);
  return [Math.round(Math.cos(a) * radius * 10) / 10, Math.round(Math.sin(a) * radius * 10) / 10, Math.cos(a)];
};

export default function LoopFigure() {
  return (
    <figure className="eng-loop" data-run={LOOP_STAGES.length} data-step={LOOP_STAGES.length} data-draw="">
      <svg className="eng-loop-svg" viewBox="-190 -160 380 320" aria-hidden="true" focusable="false">
        <circle className="eng-loop-track" r={R} />
        <circle className="eng-loop-progress" r={R} pathLength="100" transform="rotate(-90)" />
        <g className="eng-loop-center">
          <circle data-stroke r="30" />
          <circle data-stroke r="18" />
          <circle className="eng-loop-nucleus" r="7" />
        </g>
        <g className="eng-loop-nodes">
        {LOOP_STAGES.map((stage, index) => {
          const [x, y] = place(index, R);
          const [lx, ly, cos] = place(index, R + 26);
          const anchor = Math.abs(cos) < 0.25 ? 'middle' : cos > 0 ? 'start' : 'end';
          return (
            <g key={stage.n} className={`eng-loop-node is-${stage.tone}`}>
              <circle className="eng-loop-dot" cx={x} cy={y} r="6.5" />
              <circle className="eng-loop-halo" cx={x} cy={y} r="12" />
              <text className="eng-loop-name" x={lx} y={ly - 2} textAnchor={anchor}>{stage.name}</text>
              <text className="eng-loop-role" x={lx} y={ly + 12} textAnchor={anchor}>{`${stage.n} · ${stage.role}`}</text>
            </g>
          );
        })}
        </g>
      </svg>
      <ol className="eng-visually-hidden" aria-label="Our working loop">
        {LOOP_STAGES.map((stage) => (
          <li key={stage.n}>{`${stage.name}: ${stage.role}`}</li>
        ))}
      </ol>
      <figcaption className="eng-loop-legend">
        <span className="is-human">Human intent & judgment</span>
        <span className="is-ai">AI planning & building</span>
        <span className="is-check">Independent review & tests</span>
        <span className="is-outcome">Accepted outcome</span>
      </figcaption>
    </figure>
  );
}
