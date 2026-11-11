import { FrameMarks, Phone } from './Parts';
import { arc, polar } from './hud';

// A full day with no link: plan at the dock, undock, 24 hours dark, dock
// again, read the report. The markup is the finished frame: the day run, the
// link restored and the report in.
const CX = 200;
const CY = 170;

const TICKS = Array.from({ length: 96 }, (_, index) => {
  const reach = index % 24 === 0 ? 110 : index % 4 === 0 ? 106.5 : 103.5;
  const [x1, y1] = polar(index % 24 === 0 ? 97 : 100, index * 3.75, CX, CY);
  const [x2, y2] = polar(reach, index * 3.75, CX, CY);
  return { x1, y1, x2, y2, major: index % 24 === 0 };
});

// Each decoy's day as arcs around the dial: planned first, then run.
const TRACKS = [
  { radius: 88, spans: [[20, 48], [96, 140], [168, 176], [236, 292], [318, 340]] },
  { radius: 79, spans: [[4, 30], [64, 80], [120, 188], [214, 226], [270, 330]] },
  { radius: 70, spans: [[40, 92], [130, 150], [196, 260], [300, 352]] },
];
const SWEEP_RADIUS = 48;
const SWEEP_LENGTH = Math.round(2 * Math.PI * SWEEP_RADIUS * 100) / 100;
const RIM_RADIUS = 114;
const RIM_LENGTH = Math.round(2 * Math.PI * RIM_RADIUS * 100) / 100;

const STATES = ['PLANNED', 'UNDOCKED', 'NO LINK', 'DOCKED', 'REPORT'];
const PLAN_ROWS = [96, 70, 84];
const REPORT_ROWS = [92, 66, 80];

export default function DayFigure() {
  return (
    <svg className="eid-fig eid-fig--day" viewBox="0 0 400 400" data-step={STATES.length} data-flow="none" aria-hidden="true" focusable="false">
      <defs>
        <mask id="eid-day-sweep" maskUnits="userSpaceOnUse" x="96" y="66" width="208" height="208">
          <circle
            className="day-sweep"
            cx={CX}
            cy={CY}
            r={SWEEP_RADIUS}
            fill="none"
            stroke="#fff"
            strokeWidth={SWEEP_RADIUS * 2}
            strokeDasharray={SWEEP_LENGTH}
            strokeDashoffset="0"
            data-length={SWEEP_LENGTH}
            transform={`rotate(-90 ${CX} ${CY})`}
          />
        </mask>
      </defs>
      <FrameMarks />
      <text className="eid-tag is-device" x="30" y="38">DEVICE VIEW</text>
      <text className="eid-tag is-quiet" x="370" y="38" textAnchor="end">RUN ON A TEST PHONE</text>

      {/* the day */}
      <g className="day-dial">
        {TICKS.map((tick, index) => (
          <line key={index} className={tick.major ? 'eid-tick is-major' : 'eid-tick'} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} />
        ))}
        <circle className="eid-day-rim" cx={CX} cy={CY} r={RIM_RADIUS} />
        <circle className="eid-day-progress day-progress" cx={CX} cy={CY} r={RIM_RADIUS} strokeDasharray={RIM_LENGTH} strokeDashoffset="0" data-length={RIM_LENGTH} transform={`rotate(-90 ${CX} ${CY})`} />
      </g>
      <g className="day-planned">
        {TRACKS.flatMap((track) => track.spans.map(([from, to]) => (
          <path key={`${track.radius}-${from}`} className="eid-day-planned day-plan-arc" d={arc(track.radius, from, to, CX, CY)} />
        )))}
      </g>
      <g className="day-run" mask="url(#eid-day-sweep)">
        {TRACKS.flatMap((track) => track.spans.map(([from, to]) => (
          <path key={`${track.radius}-${from}`} className="eid-day-run" d={arc(track.radius, from, to, CX, CY)} />
        )))}
      </g>
      <g className="day-hand" transform={`rotate(0 ${CX} ${CY})`}>
        <path className="eid-day-hand" d={`M${CX} ${CY - 62}V${CY - 113}`} />
        <circle className="eid-day-hand-tip" cx={CX} cy={CY - 114} r="2.4" />
      </g>

      {/* the device, and where things stand */}
      <text className="eid-tag is-bright" x={CX} y="136" textAnchor="middle">24 HOURS</text>
      <Phone x={CX} y={CY} width={22} height={38} />
      {STATES.map((state, index) => (
        <text key={state} className={`eid-tag is-device day-state day-state-${index + 1}`} x={CX} y="214" textAnchor="middle">{state}</text>
      ))}

      {/* the link between the device and the console */}
      <g className="day-link">
        <path className="eid-link day-link-upper" d="M200 286V296M194 296H206" />
        <path className="eid-link day-link-lower" d="M200 298V308M194 298H206" />
        <path className="eid-link-flow day-flow-plan" d="M200 308V286" />
        <path className="eid-link-flow day-flow-report" d="M200 286V308" />
        <text className="eid-tag is-device day-link-on" x="214" y="301">LINK</text>
        <text className="eid-tag is-gold day-link-off" x="214" y="301">NO LINK</text>
      </g>

      {/* the operator console: the plan goes out, the report comes back */}
      <g className="day-console">
        <rect className="eid-panel" x="36" y="308" width="328" height="64" />
        <path className="eid-panel-ticks" d="M36 315V308H43M357 372H364V365" />
        <text className="eid-tag is-device" x="46" y="324">OPERATOR CONSOLE</text>
        <text className="eid-tag is-dim" x="46" y="342">PLAN</text>
        {PLAN_ROWS.map((width, index) => (
          <rect key={width} className="eid-console-row day-plan-row" x="46" y={348 + index * 7.5} width={width} height="3" />
        ))}
        <text className="eid-tag is-dim" x="214" y="342">REPORT</text>
        {REPORT_ROWS.map((width, index) => (
          <g key={width} className="day-report-row">
            <rect className="eid-console-row is-report" x="214" y={348 + index * 7.5} width={width} height="3" />
            <path className="eid-console-check" d={`M322 ${349.5 + index * 7.5}l2.4 2.4l4.6 -5`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
