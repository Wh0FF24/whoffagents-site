// Where the core sits and how it behaves in each homepage chapter.
// x/y: core center as a fraction of the viewport. d: diameter as a fraction
// of viewport height (desktop) or width (phone); see stateFor().
export const CHAPTER_IDS = ['core', 'capabilities', 'method', 'research', 'company', 'contact'];

const DESKTOP = {
  core: { x: 0.5, y: 0.47, d: 0.54, side: 'band', yaw: 0, pitch: 0, roll: 0, spin: 1, tendril: 1, strike: 1, echo: 0, web: 1, sparks: 1 },
  capabilities: { x: 0.7, y: 0.53, d: 0.5, side: 'left', yaw: 0.55, pitch: 0.12, roll: -0.08, spin: 1.3, tendril: 0.9, strike: 0.7, echo: 0, web: 0.6, sparks: 0.8 },
  method: { x: 0.62, y: 0.53, d: 0.32, side: 'left', yaw: 0.1, pitch: 0.38, roll: 0, spin: 2.4, tendril: 0, strike: 0, echo: 0, web: 0.3, sparks: 0.45 },
  research: { x: 0.31, y: 0.53, d: 0.33, side: 'right', yaw: -0.45, pitch: -0.08, roll: 0.1, spin: 0.8, tendril: 0.5, strike: 0.35, echo: 1, web: 0.7, sparks: 0.6 },
  company: { x: 0.7, y: 0.5, d: 0.46, side: 'left', yaw: 0.95, pitch: 0.05, roll: -0.04, spin: 0.9, tendril: 0.75, strike: 0.45, echo: 0, web: 0.5, sparks: 0.8 },
  contact: { x: 0.5, y: 0.285, d: 0.28, side: 'bottom', yaw: 0, pitch: -0.1, roll: 0, spin: 0.6, tendril: 0.85, strike: 0.5, echo: 0, web: 0.9, sparks: 1 },
};

const TABLET = {
  core: { x: 0.5, y: 0.47, d: 0.52 },
  capabilities: { x: 0.74, y: 0.5, d: 0.36 },
  method: { x: 0.64, y: 0.52, d: 0.27 },
  research: { x: 0.27, y: 0.5, d: 0.26 },
  company: { x: 0.75, y: 0.5, d: 0.34 },
  contact: { x: 0.5, y: 0.27, d: 0.26 },
};


// The working loop drawn around the core in the method chapter.
export const LOOP_STAGES = [
  { n: '01', name: 'Intent', role: 'Human', tone: 'human' },
  { n: '02', name: 'Plan', role: 'AI', tone: 'ai' },
  { n: '03', name: 'Build', role: 'AI', tone: 'ai' },
  { n: '04', name: 'Review', role: 'Independent', tone: 'check' },
  { n: '05', name: 'Measure', role: 'Test', tone: 'check' },
  { n: '06', name: 'Judge', role: 'Human', tone: 'human' },
  { n: '07', name: 'Outcome', role: 'Accepted', tone: 'outcome' },
];

export const STATE_KEYS = ['yaw', 'pitch', 'roll', 'spin', 'tendril', 'strike', 'echo', 'web', 'sparks'];

// Phone: after the intro the core sinks into the background, centred behind
// the copy, which scrolls over it (the director dims it). d is a fraction of
// width, capped at `cap` of height.
const PHONE = {
  core: { x: 0.5, y: 0.47, d: 0.84, cap: 0.44 },
  capabilities: { x: 0.5, y: 0.5, d: 0.9, cap: 0.46 },
  method: { x: 0.5, y: 0.5, d: 0.9, cap: 0.46 },
  research: { x: 0.5, y: 0.5, d: 0.9, cap: 0.46 },
  company: { x: 0.5, y: 0.5, d: 0.9, cap: 0.46 },
  contact: { x: 0.5, y: 0.5, d: 0.9, cap: 0.46 },
};

// The phone intro, top to bottom (core-home.css): the kicker (ending 136px
// down), the headline's first line, the core, the second line, then the
// tagline and actions anchored to the bottom. On a short screen, such as a
// phone browser with its toolbars showing, the core shrinks and moves down
// so none of them overlap. Taller screens keep the plain pose (center at
// .47 H, diameter min(.84 W, .44 H)). `viewportWidth` is the CSS viewport
// width (vw and the media queries); width/height are the stage's.
export function phoneIntro(width, height, viewportWidth = width) {
  const title = 1.02 * Math.min(44, Math.max(34, 0.1 * viewportWidth));
  const above = 152 + title;
  const foot = viewportWidth < 289 ? 172 : viewportWidth < 368 ? 152 : 102;
  const below = 14 + title + foot + Math.max(26, 0.04 * height);
  const d = Math.max(40, Math.min(0.84 * width, 0.44 * height, height - above - below));
  const y = Math.max(above + d / 2, Math.min(0.47 * height, height - below - d / 2));
  return { d, y };
}

// Portrait tablets stack like phones: side-by-side copy would sit behind the
// core. core-home.css uses the same test in its phone media query.
export function layoutFor(width, height = 0) {
  if (width < 760 || (width < 1100 && height >= width)) return 'phone';
  if (width < 1100) return 'tablet';
  return 'desktop';
}

// width/height place the core (stage size); the layout choice uses the same
// viewport measure as the CSS media queries (scrollbar included).
export function stateFor(id, width, height, layoutWidth = width, layoutHeight = height) {
  const layout = layoutFor(layoutWidth, layoutHeight);
  const base = DESKTOP[id];
  const place = layout === 'phone' ? PHONE[id] : layout === 'tablet' ? TABLET[id] : base;
  let diameter = layout === 'phone'
    ? Math.min(place.d * width, height * place.cap)
    : Math.min(place.d * height, width * (layout === 'tablet' ? 0.56 : 0.5));
  // The intro's instrument frame (0.69 d below center) must clear the
  // headline copy and calls to action along the bottom of the screen.
  if (id === 'core' && layout !== 'phone') diameter = Math.min(diameter, ((1 - place.y) * height - 128) / 0.69);
  let y = place.y * height;
  if (id === 'core' && layout === 'phone') ({ d: diameter, y } = phoneIntro(width, height, layoutWidth));
  return {
    ...base,
    x: place.x * width,
    y,
    d: diameter,
    // Decoys and filaments crowd a narrow screen; keep them calmer there.
    echo: base.echo * (layout === 'phone' ? 0.85 : 1),
    tendril: base.tendril * (layout === 'phone' ? 0.65 : 1),
    strike: base.strike * (layout === 'phone' ? 0.6 : 1),
  };
}

export function smooth(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
