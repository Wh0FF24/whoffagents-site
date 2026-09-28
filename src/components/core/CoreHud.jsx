import { forwardRef } from 'react';
import { LOOP_STAGES } from './coreChapters';

// Instrument rings drawn around the core. Units: the core's radius is 50, so
// the 200-unit box is twice the core's diameter. The director positions and
// scales the whole instrument; each ring animates independently.
const TAU = Math.PI * 2;
const polar = (radius, degrees) => {
  const a = (degrees - 90) * (Math.PI / 180);
  return [Math.cos(a) * radius, Math.sin(a) * radius];
};
const round = (value) => Math.round(value * 100) / 100;

const TICKS = Array.from({ length: 144 }, (_, index) => {
  const major = index % 12 === 0;
  const mid = index % 6 === 0;
  const [x1, y1] = polar(55.5, index * 2.5);
  const [x2, y2] = polar(major ? 59.6 : mid ? 58.2 : 57.2, index * 2.5);
  return { x1: round(x1), y1: round(y1), x2: round(x2), y2: round(y2), major };
});

const DOTS = Array.from({ length: 90 }, (_, index) => {
  const [x, y] = polar(71, index * 4);
  return { cx: round(x), cy: round(y) };
});


const LOOP_NODES = LOOP_STAGES.map((stage, index) => {
  const [cx, cy] = polar(84, (index / LOOP_STAGES.length) * 360);
  return { ...stage, cx: round(cx), cy: round(cy) };
});

// Decoy positions mirror coreScene ECHOES (world units x 50 x core scale .66).
const TRACKS = [
  { id: '01', x: 0, y: 0, r: 34 },
  { id: '02', x: -57.8, y: -39.6, r: 31 },
  { id: '03', x: 64.4, y: -31.4, r: 28.5 },
  { id: '04', x: 18.2, y: 64.4, r: 30 },
];

function bracket(x, y, r, size = 6) {
  const s = r + 3;
  return [
    `M${round(x - s)} ${round(y - s + size)}V${round(y - s)}H${round(x - s + size)}`,
    `M${round(x + s - size)} ${round(y - s)}H${round(x + s)}V${round(y - s + size)}`,
    `M${round(x + s)} ${round(y + s - size)}V${round(y + s)}H${round(x + s - size)}`,
    `M${round(x - s + size)} ${round(y + s)}H${round(x - s)}V${round(y + s - size)}`,
  ].join('');
}

const arc = (radius, from, to) => {
  const [x1, y1] = polar(radius, from);
  const [x2, y2] = polar(radius, to);
  const large = to - from > 180 ? 1 : 0;
  return `M${round(x1)} ${round(y1)}A${radius} ${radius} 0 ${large} 1 ${round(x2)} ${round(y2)}`;
};

const CoreHud = forwardRef(function CoreHud(_, ref) {
  const loopCircumference = round(TAU * 84);
  return (
    <div className="ch-hud" ref={ref} aria-hidden="true">
      <svg className="hud-layer hud-ticks" viewBox="-100 -100 200 200">
        <g className="hud-tick-group">
          {TICKS.map((tick, index) => (
            <line key={index} className={tick.major ? 'hud-tick hud-tick--major' : 'hud-tick'} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} />
          ))}
        </g>
      </svg>

      <svg className="hud-layer hud-arcs hud-arcs--a" viewBox="-100 -100 200 200">
        <path className="hud-arc hud-arc--crimson" d={arc(64, 12, 96)} />
        <path className="hud-arc hud-arc--crimson hud-arc--thin" d={arc(64, 204, 232)} />
        <path className="hud-arc hud-arc--silver" d={arc(66.6, 118, 176)} />
      </svg>
      <svg className="hud-layer hud-arcs hud-arcs--b" viewBox="-100 -100 200 200">
        <path className="hud-arc hud-arc--royal" d={arc(68.6, 250, 340)} />
        <path className="hud-arc hud-arc--royal hud-arc--thin" d={arc(68.6, 40, 58)} />
        <path className="hud-arc hud-arc--gold" d={arc(62.2, 150, 164)} />
      </svg>

      <svg className="hud-layer hud-dots" viewBox="-100 -100 200 200">
        {DOTS.map((dot, index) => <circle key={index} className="hud-dot" cx={dot.cx} cy={dot.cy} r="0.55" />)}
      </svg>

      <svg className="hud-layer hud-frame" viewBox="-100 -100 200 200">
        <g className="hud-degrees">
          <text x="0" y="-63.4">000</text>
          <text x="0" y="64.6">180</text>
        </g>
        <circle className="hud-outline" r="76.5" />
        <path className="hud-bracket" d={bracket(0, 0, 66, 7)} />
        <g className="hud-cross">
          <path d="M0 -97V-89M0 97V89" />
        </g>
      </svg>

      <svg className="hud-layer hud-loop" viewBox="-100 -100 200 200">
        <circle className="hud-loop-track" r="84" />
        <circle
          className="hud-loop-progress"
          r="84"
          transform="rotate(-90)"
          strokeDasharray={loopCircumference}
          strokeDashoffset={loopCircumference}
        />
        {LOOP_NODES.map((node) => (
          <g key={node.n} className={`hud-loop-node hud-loop-node--${node.tone}`} data-stage={node.n}>
            <circle cx={node.cx} cy={node.cy} r="2.4" />
            <circle className="hud-loop-halo" cx={node.cx} cy={node.cy} r="4.6" />
          </g>
        ))}
        <g className="hud-loop-runner">
          <circle cx="0" cy="-84" r="1.3" />
        </g>
      </svg>

      <svg className="hud-layer hud-research" viewBox="-100 -100 200 200">
        <defs>
          <linearGradient id="hud-sweep-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0442ae" stopOpacity="0" />
            <stop offset="1" stopColor="#3f78e8" stopOpacity=".32" />
          </linearGradient>
        </defs>
        <g className="hud-sweep">
          <path d="M0 0L98 0A98 98 0 0 0 69.3 -69.3Z" fill="url(#hud-sweep-fill)" />
          <path className="hud-sweep-edge" d="M0 0L98 0" />
        </g>
        <circle className="hud-research-range" r="98" />
        <circle className="hud-research-range" r="66" />
        {TRACKS.map((track) => (
          <g key={track.id} className="hud-track" data-track={track.id}>
            <path d={bracket(track.x, track.y, track.r, 5)} />
            <text x={round(track.x - track.r - 3)} y={round(track.y - track.r - 5.4)}>TRACK {track.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
});

export default CoreHud;
