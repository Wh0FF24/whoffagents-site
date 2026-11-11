import { Phone, Reticle } from './Parts';
import { arc, corners, polar, round } from './hud';

// The page's opening instrument: one phone at the centre, its decoys standing
// around it like echoes, and a reticle that keeps moving between them. Each
// ring is its own layer so the browser can turn it without redrawing the rest.
const TICKS = Array.from({ length: 120 }, (_, index) => {
  const reach = index % 10 === 0 ? 181 : index % 5 === 0 ? 177 : 174;
  const [x1, y1] = polar(170, index * 3);
  const [x2, y2] = polar(reach, index * 3);
  return { x1, y1, x2, y2, major: index % 10 === 0 };
});

// Decoys: where each stands, and its own slow pulse.
const GHOSTS = [
  { angle: 302, radius: 104, pace: '6.4s', delay: '-1.2s' },
  { angle: 22, radius: 120, pace: '8.1s', delay: '-3.6s' },
  { angle: 98, radius: 98, pace: '5.3s', delay: '-0.4s' },
  { angle: 172, radius: 114, pace: '7.2s', delay: '-5s' },
  { angle: 242, radius: 102, pace: '9s', delay: '-2.2s' },
].map((ghost) => {
  const [x, y] = polar(ghost.radius, ghost.angle);
  // Two fading copies trail back toward the phone each decoy came from.
  const [ex, ey] = polar(ghost.radius - 9, ghost.angle);
  const [fx, fy] = polar(ghost.radius - 18, ghost.angle);
  return { ...ghost, x, y, ex, ey, fx, fy };
});

const [sweepX, sweepY] = polar(168, 44);
const layer = { viewBox: '-200 -200 400 400', focusable: 'false' };

// The reticle's stops, as shares of the figure's size (the box is 400 wide).
const HUNT = Object.fromEntries([GHOSTS[0], GHOSTS[2], GHOSTS[3], GHOSTS[1], GHOSTS[4]].flatMap((ghost, index) => [
  [`--hx${index}`, `${round(ghost.x / 4)}%`],
  [`--hy${index}`, `${round(ghost.y / 4)}%`],
]));

export default function HeroFigure() {
  return (
    <div className="eid-hero-fig" aria-hidden="true">
      <svg className="eid-hero-layer" {...layer}>
        <defs>
          <radialGradient id="eid-hero-glow">
            <stop offset="0" stopColor="#0442ae" stopOpacity="0.3" />
            <stop offset="0.55" stopColor="#0442ae" stopOpacity="0.07" />
            <stop offset="1" stopColor="#0442ae" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="168" fill="url(#eid-hero-glow)" />
        <g className="eid-hero-ticks">
          {TICKS.map((tick, index) => (
            <line key={index} className={tick.major ? 'is-major' : undefined} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} />
          ))}
        </g>
        <circle className="eid-hero-outline" r="189" />
        <circle className="eid-hero-range" r="64" />
        <circle className="eid-hero-range" r="118" />
        <path className="eid-hero-cross" d="M0 -198V-191M0 198V191M-198 0H-191M198 0H191" />
        <path className="eid-hero-corners" d={corners(0, 0, 197, 15)} />
      </svg>

      <svg className="eid-hero-layer eid-hero-turn is-slow" {...layer}>
        <path className="eid-hero-arc is-crimson" d={arc(160, 20, 96)} />
        <path className="eid-hero-arc is-crimson is-thin" d={arc(160, 204, 232)} />
        <path className="eid-hero-arc is-gold" d={arc(154, 150, 166)} />
      </svg>
      <svg className="eid-hero-layer eid-hero-turn is-counter" {...layer}>
        <path className="eid-hero-arc is-royal" d={arc(148, 250, 338)} />
        <path className="eid-hero-arc is-royal is-thin" d={arc(148, 40, 58)} />
        <path className="eid-hero-arc is-silver" d={arc(142, 118, 176)} />
      </svg>

      <svg className="eid-hero-layer eid-hero-turn is-sweep" {...layer}>
        <defs>
          <linearGradient id="eid-hero-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7ba8ff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#7ba8ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0 0L0 -168A168 168 0 0 1 ${sweepX} ${sweepY}Z`} fill="url(#eid-hero-sweep)" />
        <path className="eid-hero-sweep-edge" d="M0 0V-168" />
      </svg>

      <svg className="eid-hero-layer" {...layer}>
        {GHOSTS.map((ghost) => (
          <g key={ghost.angle}>
            <line className="eid-tether" x1="0" y1="0" x2={ghost.x} y2={ghost.y} />
            <g className="eid-ghost" style={{ '--pace': ghost.pace, '--delay': ghost.delay }}>
              <Phone x={ghost.fx} y={ghost.fy} width={24} height={42} className="is-echo is-faint" />
              <Phone x={ghost.ex} y={ghost.ey} width={24} height={42} className="is-echo" />
              <Phone x={ghost.x} y={ghost.y} width={24} height={42} className="is-decoy" />
            </g>
          </g>
        ))}
        <circle className="eid-wave" r="38" style={{ '--delay': '0s' }} />
        <circle className="eid-wave" r="38" style={{ '--delay': '1.5s' }} />
        <Phone width={34} height={60} />
      </svg>

      <svg className="eid-hero-layer eid-hero-hunt" style={HUNT} {...layer}>
        <g className="eid-reticle">
          <Reticle half={30} className="is-searching" />
        </g>
      </svg>
    </div>
  );
}
