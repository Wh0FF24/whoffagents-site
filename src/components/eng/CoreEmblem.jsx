import { useEffect, useRef, useState } from 'react';
import { LOOP_STAGES } from '../core/coreChapters';

// A small, living copy of the homepage core for a supporting page's hero.
// The poster carries first paint, reduced motion and browsers without WebGL;
// the scene fades in over it and draws only while the emblem is on screen.
// Instrument units match the homepage: the core's radius is 50, and the box
// (2.5 core diameters, like the poster) spans -125..125.
const polar = (radius, degrees) => {
  const a = (degrees - 90) * (Math.PI / 180);
  return [Math.round(Math.cos(a) * radius * 100) / 100, Math.round(Math.sin(a) * radius * 100) / 100];
};

const TICKS = Array.from({ length: 120 }, (_, index) => {
  const major = index % 10 === 0;
  const [x1, y1] = polar(56, index * 3);
  const [x2, y2] = polar(major ? 61 : 58.5, index * 3);
  return { x1, y1, x2, y2, major };
});

// Decoy positions mirror the scene's echoes (see CoreHud TRACKS).
const TRACKS = [
  { id: '01', x: 0, y: 0, r: 34 },
  { id: '02', x: -57.8, y: -39.6, r: 31 },
  { id: '03', x: 64.4, y: -31.4, r: 28.5 },
  { id: '04', x: 18.2, y: 64.4, r: 30 },
];

const LOOP = LOOP_STAGES.map((stage, index) => {
  const [cx, cy] = polar(88, (index / LOOP_STAGES.length) * 360);
  return { ...stage, cx, cy };
});

const bracket = (x, y, r, k) => [
  `M${x - r} ${y - r + k}V${y - r}H${x - r + k}`,
  `M${x + r - k} ${y - r}H${x + r}V${y - r + k}`,
  `M${x + r} ${y + r - k}V${y + r}H${x + r - k}`,
  `M${x - r + k} ${y + r}H${x - r}V${y + r - k}`,
].join('');

export default function CoreEmblem({ variant = 'company' }) {
  const host = useRef(null);
  const stage = useRef(null);
  const [scene, setScene] = useState('poster');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let emblem = null;
    let dead = false;
    import('./emblemScene')
      .then(({ createCoreEmblem }) => {
        if (!dead) emblem = createCoreEmblem(stage.current, host.current, { variant, onStatus: setScene });
      })
      .catch(() => setScene('fallback'));
    return () => {
      dead = true;
      emblem?.dispose();
    };
  }, [variant]);

  return (
    <div className="eng-emblem" ref={host} data-scene={scene} data-variant={variant} aria-hidden="true">
      <img className="eng-emblem-poster" src="/brand/whoff-core-poster.webp" alt="" width="700" height="700" decoding="async" />
      <div className="eng-emblem-stage" ref={stage} />
      <svg className="eng-emblem-hud" viewBox="-125 -125 250 250">
        <g className="eng-emblem-ticks">
          {TICKS.map((tick) => (
            <line key={`${tick.x1},${tick.y1}`} className={tick.major ? 'is-major' : undefined} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} />
          ))}
        </g>
        <g className="eng-emblem-arcs">
          <circle className="eng-emblem-arc is-crimson" r="66" pathLength="100" strokeDasharray="18 82" />
          <circle className="eng-emblem-arc is-royal" r="66" pathLength="100" strokeDasharray="11 89" strokeDashoffset="-52" />
        </g>
        <circle className="eng-emblem-outline" r="100" />
        <path className="eng-emblem-bracket" d={bracket(0, 0, 112, 10)} />
        {variant === 'research' && (
          <g className="eng-emblem-tracks">
            {TRACKS.map((track) => (
              <g key={track.id}>
                <path d={bracket(track.x, track.y, track.r, 6)} />
                <text x={track.x - track.r} y={track.y - track.r - 4}>{`TRACK ${track.id}`}</text>
              </g>
            ))}
          </g>
        )}
        {variant === 'company' && (
          <g className="eng-emblem-loop">
            <circle className="eng-emblem-loop-track" r="88" />
            {LOOP.map((node) => (
              <circle key={node.n} className={`eng-emblem-node is-${node.tone}`} cx={node.cx} cy={node.cy} r="3.2" />
            ))}
          </g>
        )}
        {variant === 'capabilities' && (
          <g className="eng-emblem-nodes">
            {[45, 135, 225, 315].map((angle, index) => {
              const [x, y] = polar(88, angle);
              const [tx, ty] = polar(104, angle);
              return (
                <g key={angle}>
                  <circle cx={x} cy={y} r="3.4" />
                  <text x={tx} y={ty}>{`0${index + 1}`}</text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
