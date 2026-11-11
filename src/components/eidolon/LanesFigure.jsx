import { FrameMarks, Phone, Reticle } from './Parts';

// One stream leaves the phone and fans out across the decoys' lanes. The
// observer follows one lane and sees a share of the stream. The markup is the
// finished frame; motion starts from a single lane carrying everything.
const LANES = [
  { y: 92, own: '2 11', period: 13, pace: '5.2s' },
  { y: 146, own: '3 17', period: 20, pace: '7.1s' },
  { y: 200, own: '2 8', period: 10, pace: '4.3s' },
  { y: 254, own: '4 21', period: 25, pace: '8.4s' },
  { y: 308, own: '2 13', period: 15, pace: '6s' },
];
const FOLLOWED = 2;
const lanePath = (y) => (y === 200 ? 'M157 200H346' : `M157 200C196 200 190 ${y} 232 ${y}H346`);

export default function LanesFigure() {
  return (
    <svg className="eid-fig eid-fig--lanes" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <FrameMarks />
      <text className="eid-tag is-observer" x="30" y="38">OBSERVER VIEW</text>
      <text className="eid-tag is-quiet" x="370" y="38" textAnchor="end">PROVEN IN THE LAB</text>
      <text className="eid-tag is-quiet lanes-title" x="289" y="70" textAnchor="middle">DECOY LANES</text>

      {/* the phone and its one stream */}
      <Phone x={56} y={200} width={26} height={46} />
      <text className="eid-tag is-bright" x="56" y="244" textAnchor="middle">PHONE</text>
      <path className="eid-stream-glow" d="M72 200H139" />
      <path className="eid-stream lanes-stream" d="M72 200H139" />
      <path className="eid-splitter" d="M139 200L148 191L157 200L148 209Z" />

      {LANES.map((lane, index) => (
        <g key={lane.y} className={`lanes-lane${index === FOLLOWED ? ' is-followed' : ''}`} data-lane={index}>
          <path className="eid-lane-base lanes-base" d={lanePath(lane.y)} />
          <path
            className="eid-lane-own lanes-own"
            d={lanePath(lane.y)}
            style={{ strokeDasharray: lane.own, '--period': `${lane.period}px`, '--pace': lane.pace }}
          />
          <path className="eid-lane-share lanes-share" d={lanePath(lane.y)} style={{ '--o': `${-index * 10}px` }} />
          <Phone x={362} y={lane.y} width={15} height={26} className="is-decoy lanes-decoy" />
        </g>
      ))}
      <path className="eid-lane-whole lanes-whole" d={lanePath(200)} />

      {/* the observer follows one lane */}
      <path className="eid-lane-followed" d="M266 200H334" />
      <g className="eid-reticle" transform="translate(300 200)">
        <Reticle half={22} />
      </g>

      <path className="eid-rule" d="M30 332H370" />
      <text className="eid-tag is-alert" x="30" y="351">FOLLOWING ONE IDENTITY</text>
      <text className="eid-tag is-bright lanes-sees-before" x="30" y="368">SEES THE WHOLE STREAM</text>
      <text className="eid-tag is-bright lanes-sees-after" x="30" y="368">SEES A FRACTION</text>
      <g className="lanes-gauge">
        {LANES.map((lane, index) => (
          <g key={lane.y}>
            <rect className="eid-gauge-cell" x={252 + index * 23} y="343" width="19" height="7" />
            <rect className={`eid-gauge-fill${index === FOLLOWED ? '' : ' lanes-cell-fill'}`} x={252 + index * 23} y="343" width="19" height="7" />
          </g>
        ))}
      </g>
      <text className="eid-tag is-dim" x="309.5" y="368" textAnchor="middle">STREAM SEEN</text>
    </svg>
  );
}
