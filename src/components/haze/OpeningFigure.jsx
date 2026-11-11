import { DRIFT_POINTS, FAR_DISCS, MIST_POINTS, PROFILE_POINTS } from './hazeData';

// The opening: a profile made of points of activity. In focus it is a clear
// head and shoulders. As decoy points drift through, every point slips a
// little from its place and the edge is gone. Each part is a layer of its
// own, so the browser can fade and move it without redrawing the others.
// What is drawn here is the soft frame, which is where the loop comes to rest.
const box = { viewBox: '0 0 400 400', focusable: 'false' };

export default function OpeningFigure() {
  return (
    <div className="hz-open-fig" aria-hidden="true">
      <div className="hz-open-layer hz-open-far">
        <svg {...box}>
          <defs>
            <radialGradient id="hz-open-disc">
              <stop offset="0" stopColor="#5b8cff" stopOpacity="1" />
              <stop offset="0.6" stopColor="#2f6be8" stopOpacity="0.5" />
              <stop offset="1" stopColor="#0442ae" stopOpacity="0" />
            </radialGradient>
          </defs>
          {FAR_DISCS.map((disc, index) => (
            <circle key={index} cx={disc.x} cy={disc.y} r={disc.r} fill="url(#hz-open-disc)" opacity={disc.o} />
          ))}
        </svg>
      </div>

      <div className="hz-open-layer hz-open-soft">
        <svg {...box}>
          <defs>
            <radialGradient id="hz-open-soft-point">
              <stop offset="0" stopColor="#f1f5fb" stopOpacity="0.95" />
              <stop offset="0.45" stopColor="#c9d6ea" stopOpacity="0.4" />
              <stop offset="1" stopColor="#c9d6ea" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hz-open-mist-point">
              <stop offset="0" stopColor="#9dbcff" stopOpacity="0.95" />
              <stop offset="0.45" stopColor="#4f83f5" stopOpacity="0.42" />
              <stop offset="1" stopColor="#2f6be8" stopOpacity="0" />
            </radialGradient>
          </defs>
          {MIST_POINTS.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={point.r} fill="url(#hz-open-mist-point)" opacity={point.o} />
          ))}
          {PROFILE_POINTS.map((point, index) => (
            <circle key={index} cx={point.softX} cy={point.softY} r={point.softR} fill="url(#hz-open-soft-point)" opacity={point.softO} />
          ))}
        </svg>
      </div>

      <div className="hz-open-layer hz-open-sharp">
        <svg {...box}>
          {PROFILE_POINTS.map((point, index) => (
            <circle key={index} className={point.edge ? 'is-edge' : undefined} cx={point.x} cy={point.y} r={point.edge ? 2.1 : 1.5} />
          ))}
        </svg>
      </div>

      <div className="hz-open-layer hz-open-drift">
        {DRIFT_POINTS.map((point, index) => (
          <i
            key={index}
            style={{
              '--x': `${point.x}%`,
              '--y': `${point.y}%`,
              '--dx': point.dx,
              '--dy': point.dy,
              '--s': point.size,
              '--o': point.glow,
              '--pace': `${point.pace}s`,
              '--delay': `${point.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
