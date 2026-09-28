// Persona Fleet as an illustration: a sweep over four signatures that look
// alike. Which one is the source? That is the research question, not a result.
const BLIPS = [
  { id: '01', x: 62, y: -48 },
  { id: '02', x: -78, y: -30 },
  { id: '03', x: -34, y: 74 },
  { id: '04', x: 70, y: 58 },
];

export default function RadarFigure() {
  return (
    <figure className="eng-radar" data-draw="">
      <svg className="eng-radar-svg" viewBox="-160 -160 320 320" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="eng-radar-glow">
            <stop offset="0" stopColor="#0442ae" stopOpacity="0.22" />
            <stop offset="1" stopColor="#0442ae" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="eng-radar-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7ba8ff" stopOpacity="0" />
            <stop offset="1" stopColor="#7ba8ff" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <circle r="150" fill="url(#eng-radar-glow)" />
        {[40, 80, 120, 150].map((r) => (
          <circle key={r} data-stroke className="eng-radar-ring" r={r} />
        ))}
        <path data-stroke className="eng-radar-cross" d="M-150 0H150M0 -150V150" />
        <g className="eng-radar-sweep">
          <path d="M0 0L150 0A150 150 0 0 0 129.9 -75Z" fill="url(#eng-radar-sweep)" />
          <path className="eng-radar-edge" d="M0 0H150" />
        </g>
        {BLIPS.map((blip, index) => (
          <g key={blip.id} className="eng-radar-blip" style={{ '--delay': `${index * 0.6}s` }}>
            <circle className="eng-radar-ping" cx={blip.x} cy={blip.y} r="9" />
            <circle className="eng-radar-dot" cx={blip.x} cy={blip.y} r="4" />
            <path className="eng-radar-bracket" d={`M${blip.x - 14} ${blip.y - 8}v-6h6M${blip.x + 8} ${blip.y - 14}h6v6M${blip.x + 14} ${blip.y + 8}v6h-6M${blip.x - 8} ${blip.y + 14}h-6v-6`} />
            <text x={blip.x + 18} y={blip.y - 12}>{`TRACK ${blip.id}`}</text>
          </g>
        ))}
        <circle className="eng-radar-origin" r="3" />
      </svg>
      <figcaption>Illustration: four plausible signatures, one source.</figcaption>
    </figure>
  );
}
