// Line glyphs for the supporting pages, drawn on a 48-unit grid with the
// strokes marked so the motion layer can draw them in (data-stroke).
const GLYPHS = {
  software: (
    <>
      <rect data-stroke x="6" y="9" width="36" height="30" rx="3" />
      <path data-stroke d="M6 17h36" />
      <path data-stroke d="M19 24l-5 5 5 5" />
      <path data-stroke d="M29 24l5 5-5 5" />
      <path data-stroke d="M26 22.5l-4 13" />
    </>
  ),
  autonomy: (
    <>
      <circle data-stroke cx="12" cy="14" r="5" />
      <circle data-stroke cx="36" cy="14" r="5" />
      <circle data-stroke cx="24" cy="36" r="6" />
      <path data-stroke d="M16 17.5l5 12" />
      <path data-stroke d="M32 17.5l-5 12" />
      <path data-stroke d="M17 14h14" />
      <circle className="glyph-dot" cx="24" cy="36" r="1.8" />
    </>
  ),
  integration: (
    <>
      <rect data-stroke x="5" y="17" width="16" height="14" rx="3" />
      <rect data-stroke x="27" y="17" width="16" height="14" rx="3" />
      <path data-stroke d="M21 21h6" />
      <path data-stroke d="M21 27h6" />
      <path data-stroke d="M13 17v-6h22v6" />
      <path data-stroke d="M13 31v6h22v-6" />
    </>
  ),
  verification: (
    <>
      <circle data-stroke cx="24" cy="24" r="17" />
      <circle data-stroke cx="24" cy="24" r="9" />
      <path data-stroke d="M24 3v8M24 37v8M3 24h8M37 24h8" />
      <path data-stroke d="M19.5 24l3 3 6-6.5" />
    </>
  ),
  question: (
    <>
      <circle data-stroke cx="24" cy="24" r="18" />
      <path data-stroke d="M18.5 19a5.5 5.5 0 1 1 7.6 5.1c-1.4.6-2.1 1.7-2.1 3.2v1.7" />
      <circle className="glyph-dot" cx="24" cy="34" r="1.8" />
    </>
  ),
  challenge: (
    <>
      <path data-stroke d="M6 17h28" />
      <path data-stroke d="M28 11l6 6-6 6" />
      <path data-stroke d="M42 31H14" />
      <path data-stroke d="M20 25l-6 6 6 6" />
    </>
  ),
  evidence: (
    <>
      <path data-stroke d="M13 5h16l8 8v30H13z" />
      <path data-stroke d="M29 5v8h8" />
      <path data-stroke d="M18 23h14M18 29h14M18 35h8" />
      <path data-stroke d="M4 36l4 4 7-8" />
    </>
  ),
  web: (
    <>
      <rect data-stroke x="5" y="8" width="38" height="32" rx="3" />
      <path data-stroke d="M5 16h38" />
      <path data-stroke d="M12 24h14M12 30h22" />
    </>
  ),
  agents: (
    <>
      <path data-stroke d="M24 5l4.5 10.5L39 20l-10.5 4.5L24 35l-4.5-10.5L9 20l10.5-4.5z" />
      <path data-stroke d="M38 34l1.8 4.2L44 40l-4.2 1.8L38 46l-1.8-4.2L32 40l4.2-1.8z" />
    </>
  ),
  voice: (
    <>
      <path data-stroke d="M8 24v0M14 18v12M20 12v24M26 16v16M32 20v8M38 14v20" />
    </>
  ),
  products: (
    <>
      <path data-stroke d="M24 5l17 9v20l-17 9-17-9V14z" />
      <path data-stroke d="M7 14l17 9 17-9" />
      <path data-stroke d="M24 23v20" />
    </>
  ),
};

export default function Glyph({ name, className = '' }) {
  return (
    <svg className={`eng-glyph ${className}`.trim()} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {GLYPHS[name]}
    </svg>
  );
}
