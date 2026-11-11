import { FrameMarks, Phone, Reticle, RhythmRing } from './Parts';
import { CROWD_CENTER, CROWD_DECOYS, CROWD_FAR, CROWD_REST, CROWD_TRAIL } from './crowdLayout';
import { RHYTHMS } from './hud';

// Decoys bloom out around the protected phone, each with a day of its own.
// The reticle that held the phone now moves from one to the next. The markup
// is the finished frame: the crowd in place, the reticle caught mid-search.
export default function CrowdFigure() {
  return (
    <svg className="eid-fig eid-fig--crowd" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <FrameMarks />
      <text className="eid-tag is-observer" x="30" y="38">OBSERVER VIEW</text>
      <text className="eid-tag is-alert crowd-reticle-before" x="30" y="54">LOCKED</text>
      <text className="eid-tag is-gold crowd-reticle-after" x="30" y="54">SEARCHING</text>
      <text className="eid-tag is-quiet" x="370" y="38" textAnchor="end">CONTENT · HIDDEN</text>
      <text className="eid-tag is-alert crowd-status-before" x="370" y="54" textAnchor="end">PATTERN · EXPOSED</text>
      <text className="eid-tag is-gold crowd-status-after" x="370" y="54" textAnchor="end">PATTERN · ONE OF MANY</text>

      <g className="crowd-tethers">
        {[...CROWD_DECOYS, ...CROWD_FAR].map((node) => (
          <line key={node.id} className="eid-tether crowd-tether" x1={CROWD_CENTER.x} y1={CROWD_CENTER.y} x2={node.x} y2={node.y} />
        ))}
      </g>

      {CROWD_FAR.map((node) => (
        <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
          <g className="crowd-node crowd-node--far" data-x={node.x} data-y={node.y}>
            <RhythmRing pattern={RHYTHMS[node.rhythm]} inner={13} reach={6} />
            <Phone width={13} height={23} className="is-decoy" />
          </g>
        </g>
      ))}

      {CROWD_DECOYS.map((node) => (
        <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
          <g className="crowd-node" data-x={node.x} data-y={node.y}>
            <RhythmRing pattern={RHYTHMS[node.rhythm]} inner={20} reach={11} />
            <Phone width={19} height={34} className="is-decoy" />
          </g>
          <text className="eid-tag is-quiet crowd-label" y="66" textAnchor="middle">{node.label}</text>
        </g>
      ))}

      <g transform={`translate(${CROWD_CENTER.x} ${CROWD_CENTER.y})`}>
        <circle className="eid-wave" r="30" style={{ '--delay': '0s' }} />
        <circle className="eid-wave" r="30" style={{ '--delay': '1.7s' }} />
        <RhythmRing pattern={RHYTHMS.phone} inner={30} reach={13} className="is-phone" />
        <Phone width={26} height={46} />
      </g>
      <text className="eid-tag is-bright" x="30" y="372">CENTER · PROTECTED PHONE</text>

      {/* where the reticle has been, and where it is now */}
      <polyline className="eid-trail crowd-trail" points={CROWD_TRAIL.map((point) => `${point.x},${point.y}`).join(' ')} />
      <g className="crowd-lock">
        <g transform={`translate(${CROWD_CENTER.x} ${CROWD_CENTER.y})`}>
          <Reticle half={50} />
        </g>
        <text className="eid-lock-text" x="286" y="154.6" textAnchor="middle">LOCKED</text>
      </g>
      <g className="eid-reticle crowd-reticle" transform={`translate(${CROWD_REST.x} ${CROWD_REST.y})`}>
        <g className="crowd-reticle-scale">
          <Reticle half={40} className="is-searching" />
        </g>
      </g>
    </svg>
  );
}
