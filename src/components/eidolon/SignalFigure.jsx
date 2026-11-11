import { FrameMarks, Phone, Reticle } from './Parts';
import { round, seeded } from './hud';

// One phone, seen from outside. Three readings (where, when, how much) start
// as noise and resolve into a pattern; then the reticle locks on. The markup
// below is the finished frame: motion, when it runs, starts from the noise.
const rand = seeded(2311);

const PANELS = [
  { key: 'where', x: 33, title: 'WHERE', axis: 'PLACES' },
  { key: 'when', x: 148, title: 'WHEN', axis: '24 HOURS' },
  { key: 'much', x: 263, title: 'HOW MUCH', axis: 'TRAFFIC' },
];
const PANEL_TOP = 262;
const PANEL_WIDTH = 104;
const PANEL_HEIGHT = 82;

const GRID = Array.from({ length: 35 }, (_, index) => ({ x: 45 + (index % 7) * 14, y: 290 + Math.floor(index / 7) * 12 }));
const STRAY = Array.from({ length: 16 }, () => ({ x: round(45 + rand() * 82), y: round(288 + rand() * 50) }));
const TRACK = 'M56 330L70 306L92 292L114 298L108 322L84 336Z';
const DWELL = [{ x: 56, y: 330 }, { x: 114, y: 298 }];

const WHEN = [3, 2, 2, 2, 3, 6, 14, 26, 30, 20, 15, 17, 21, 18, 15, 16, 20, 27, 34, 36, 28, 17, 9, 5]
  .map((height, hour) => ({ x: round(157.2 + hour * 3.6), height, noise: round((4 + rand() * 28) / height) }));

const MUCH = [4, 9, 20, 26, 24, 11, 3, 2, 6, 13, 14, 13, 12, 5, 2, 3, 9, 3, 2, 8]
  .map((half, index) => ({ x: round(270 + index * 4.6), half, noise: round((3 + rand() * 21) / half) }));

export default function SignalFigure() {
  return (
    <svg className="eid-fig eid-fig--signal" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <FrameMarks />
      <text className="eid-tag is-observer" x="30" y="38">OBSERVER VIEW</text>
      <text className="eid-tag is-quiet" x="370" y="38" textAnchor="end">CONTENT · HIDDEN</text>
      <text className="eid-tag is-alert sig-exposed" x="370" y="54" textAnchor="end">PATTERN · EXPOSED</text>

      {/* the phone and what it gives off */}
      <g className="sig-target" transform="translate(200 150)">
        <circle className="eid-wave" r="30" style={{ '--delay': '0s' }} />
        <circle className="eid-wave" r="30" style={{ '--delay': '1.3s' }} />
        <circle className="eid-wave" r="30" style={{ '--delay': '2.6s' }} />
        <Phone width={28} height={50} />
      </g>

      {/* the readings feed the reticle */}
      <path className="eid-bus" d="M85 258V240H315V258M200 258V208" />
      <path className="eid-feed sig-feed-where" d="M85 258V240H200V208" />
      <path className="eid-feed sig-feed-when" d="M200 258V208" />
      <path className="eid-feed sig-feed-much" d="M315 258V240H200V208" />

      {PANELS.map((panel) => (
        <g key={panel.key} className={`sig-panel sig-panel--${panel.key}`}>
          <rect className="eid-panel" x={panel.x} y={PANEL_TOP} width={PANEL_WIDTH} height={PANEL_HEIGHT} />
          <path
            className="eid-panel-ticks"
            d={`M${panel.x} ${PANEL_TOP + 7}V${PANEL_TOP}H${panel.x + 7}M${panel.x + PANEL_WIDTH - 7} ${PANEL_TOP + PANEL_HEIGHT}H${panel.x + PANEL_WIDTH}V${PANEL_TOP + PANEL_HEIGHT - 7}`}
          />
          <text className="eid-tag is-observer" x={panel.x + 8} y={PANEL_TOP + 15}>{panel.title}</text>
          <rect className={`eid-lamp sig-lamp-${panel.key}`} x={panel.x + PANEL_WIDTH - 14} y={PANEL_TOP + 7} width="6" height="6" />
          <text className="eid-tag is-dim" x={panel.x + PANEL_WIDTH / 2} y={PANEL_TOP + PANEL_HEIGHT + 16} textAnchor="middle">{panel.axis}</text>
        </g>
      ))}

      {/* where: stray points settle into a route between two places */}
      <g className="sig-where">
        {GRID.map((dot) => <circle key={`${dot.x}-${dot.y}`} className="eid-grid-dot" cx={dot.x} cy={dot.y} r="0.7" />)}
        <g className="sig-stray">
          {STRAY.map((dot, index) => <circle key={index} className="eid-stray" cx={dot.x} cy={dot.y} r="1.5" />)}
        </g>
        <path className="eid-track sig-track" d={TRACK} />
        {DWELL.map((node) => (
          <g key={node.x} className="sig-dwell">
            <circle className="eid-dwell-ring" cx={node.x} cy={node.y} r="7" />
            <circle className="eid-dwell" cx={node.x} cy={node.y} r="3.2" />
          </g>
        ))}
      </g>

      {/* when: a day of activity, hour by hour */}
      <g className="sig-when">
        <path className="eid-axis" d="M156 339.5H244M157 339.5v4M178.6 339.5v3M200.2 339.5v4M221.8 339.5v3M243.4 339.5v4" />
        {WHEN.map((bar) => (
          <rect key={bar.x} className="eid-bar sig-when-bar" x={bar.x} y={338 - bar.height} width="2.2" height={bar.height} data-noise={bar.noise} />
        ))}
      </g>

      {/* how much: the shape of the traffic */}
      <g className="sig-much">
        <path className="eid-axis" d="M268 312H362" />
        {MUCH.map((bar) => (
          <rect key={bar.x} className="eid-bar sig-much-bar" x={bar.x} y={312 - bar.half} width="2.8" height={bar.half * 2} data-noise={bar.noise} />
        ))}
      </g>

      {/* the reticle closes on the phone */}
      <g className="eid-reticle sig-reticle" transform="translate(200 150)">
        <g className="sig-reticle-drift">
          <g className="sig-reticle-scale">
            <Reticle half={46} />
          </g>
        </g>
      </g>
      <g className="sig-lock">
        <text className="eid-lock-text" x="282" y="108.6" textAnchor="middle">LOCKED</text>
      </g>
    </svg>
  );
}
