import { FrameMarks, Phone } from './Parts';
import { KEEP_END, KEEP_LANES, KEEP_SEGMENTS, KEEP_START, KEEP_STOPS, keepReplans } from './keepLayout';

// The device moves between kinds of place. Each decoy changes what it is
// doing shortly after, at a moment of its own, so the marks never line up.
// The markup is the finished frame: the device at the end of its route.
const TEXTURES = 5;

export default function KeepFigure() {
  return (
    <svg className="eid-fig eid-fig--keep" viewBox="0 0 400 400" data-seg={KEEP_SEGMENTS.length - 1} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="eid-keep-reveal">
          <rect className="keep-reveal" x="30" y="140" width="340" height="190" />
        </clipPath>
      </defs>
      <FrameMarks />
      <text className="eid-tag is-device" x="30" y="38">DEVICE VIEW</text>
      <text className="eid-tag is-quiet" x="370" y="38" textAnchor="end">EACH IN ITS OWN TIME</text>

      {/* where the device is */}
      <g className="keep-route">
        {KEEP_SEGMENTS.map((segment, index) => (
          <path
            key={segment.from}
            className={`eid-route ${segment.place ? 'is-place' : 'is-moving'} keep-route-${index}`}
            d={`M${segment.from} 98H${segment.to}`}
          />
        ))}
        {[KEEP_START, ...KEEP_STOPS, KEEP_END].map((x) => <circle key={x} className="eid-route-node" cx={x} cy="98" r="2.6" />)}
        {KEEP_SEGMENTS.map((segment, index) => segment.place && (
          <text key={segment.place} className={`eid-tag keep-place keep-place-${index}`} x={(segment.from + segment.to) / 2} y="118" textAnchor="middle">{segment.place}</text>
        ))}
      </g>
      {KEEP_STOPS.map((x) => <line key={x} className="eid-guide keep-guide" x1={x} y1="104" x2={x} y2="326" />)}

      {/* what each decoy is doing; the texture changes when it re-plans */}
      <g clipPath="url(#eid-keep-reveal)">
        {KEEP_LANES.map((lane) => {
          const bounds = [KEEP_START, ...keepReplans(lane), KEEP_END];
          return (
            <g key={lane.id} className="keep-lane">
              {bounds.slice(0, -1).map((from, index) => (
                <line key={from} className={`eid-plan is-t${(lane.first + index) % TEXTURES}`} x1={from} y1={lane.y} x2={bounds[index + 1] - 3} y2={lane.y} />
              ))}
            </g>
          );
        })}
      </g>
      {KEEP_LANES.map((lane) => (
        <g key={lane.id}>
          <text className="eid-tag is-quiet" x="36" y={lane.y - 13}>{lane.label}</text>
          {keepReplans(lane).map((x) => (
            <path key={x} className="eid-replan keep-replan" data-x={x} d={`M${x} ${lane.y - 6}L${x + 4.4} ${lane.y}L${x} ${lane.y + 6}L${x - 4.4} ${lane.y}Z`} />
          ))}
        </g>
      ))}

      {/* the device itself, and the moment it marks on every lane */}
      <g className="keep-now" transform={`translate(${KEEP_END} 0)`}>
        <line className="eid-now" x1="0" y1="126" x2="0" y2="326" />
        <Phone y={76} width={11} height={19} />
        <path className="eid-now-caret" d="M-3.4 89.5H3.4L0 95Z" />
      </g>

      <path className="eid-rule" d="M30 336H370" />
      <text className="eid-tag is-dim" x="36" y="351">PLACE</text>
      <text className="eid-tag is-dim" x="152" y="351">MOTION</text>
      <text className="eid-tag is-dim" x="268" y="351">TIME OF DAY</text>
      <text className="eid-tag is-bright keep-value is-home" x="36" y="368">HOME</text>
      <text className="eid-tag is-bright keep-value is-transit" x="36" y="368">IN TRANSIT</text>
      <text className="eid-tag is-bright keep-value is-work" x="36" y="368">WORK</text>
      <text className="eid-tag is-bright keep-value is-store" x="36" y="368">STORE</text>
      <text className="eid-tag is-bright keep-value is-still" x="152" y="368">STILL</text>
      <text className="eid-tag is-bright keep-value is-moving" x="152" y="368">MOVING</text>
      <text className="eid-tag is-bright keep-value is-morning" x="268" y="368">MORNING</text>
      <text className="eid-tag is-bright keep-value is-midday" x="268" y="368">MIDDAY</text>
      <text className="eid-tag is-bright keep-value is-evening" x="268" y="368">EVENING</text>
    </svg>
  );
}
