// Geometry for the figures on the /haze page. Every figure is drawn in a box
// 400 units square. Positions come from a seeded generator, so the page the
// server renders and the page the browser draws hold exactly the same points.

export const round = (value) => Math.round(value * 10) / 10;
const fine = (value) => Math.round(value * 1000) / 1000;

function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

const TURN = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/* ------------------------------------------------------------ the opening */

// A head and shoulders, the plain sign for a profile, made of points. Each
// point has a sharp place (where it sits when the profile is in focus) and a
// soft place a little way off (where it sits once the edge has gone).
function profilePoints() {
  const random = seeded(41);
  const points = [];
  const add = (x, y, edge) => {
    const angle = random() * TURN;
    const reach = (edge ? 9 : 6) + random() * 15;
    points.push({
      x: round(x),
      y: round(y),
      edge,
      softX: round(x + Math.cos(angle) * reach),
      softY: round(y + Math.sin(angle) * reach),
      softR: round(7 + random() * 8),
      softO: fine(0.2 + random() * 0.3),
    });
  };
  // Head: a ring and a filled centre.
  const head = { x: 200, y: 146, r: 47 };
  for (let index = 0; index < 30; index += 1) {
    const angle = (index / 30) * TURN;
    add(head.x + Math.cos(angle) * head.r, head.y + Math.sin(angle) * head.r, true);
  }
  for (let index = 1; index <= 30; index += 1) {
    const radius = Math.sqrt(index / 31) * (head.r - 8);
    add(head.x + Math.cos(index * GOLDEN) * radius, head.y + Math.sin(index * GOLDEN) * radius, false);
  }
  // Shoulders: the upper half of an oval, its base line, and a filled centre.
  const body = { x: 200, y: 322, rx: 96, ry: 100 };
  for (let index = 0; index <= 34; index += 1) {
    const angle = Math.PI + (index / 34) * Math.PI;
    add(body.x + Math.cos(angle) * body.rx, body.y + Math.sin(angle) * body.ry, true);
  }
  for (let index = 1; index < 16; index += 1) {
    add(body.x - body.rx + (index / 16) * body.rx * 2, body.y, true);
  }
  for (let index = 1; index <= 110; index += 1) {
    const radius = Math.sqrt(index / 111);
    const x = Math.cos(index * GOLDEN) * radius * (body.rx - 9);
    const y = Math.sin(index * GOLDEN) * radius * (body.ry - 9);
    if (y < -3) add(body.x + x, body.y + y, false);
  }
  return points;
}

// Points of decoy activity that drift across the opening, each on a path of
// its own. Places and distances are shares of the figure's size.
function driftPoints() {
  const random = seeded(7);
  return Array.from({ length: 30 }, (_, index) => {
    const angle = (random() - 0.5) * 1.1 + (index % 2 ? 0 : Math.PI);
    const reach = 16 + random() * 22;
    const near = index % 3 === 0;
    return {
      x: round(8 + random() * 84),
      y: round(10 + random() * 80),
      dx: round(Math.cos(angle) * reach),
      dy: round(Math.sin(angle) * reach * 0.6),
      size: round(near ? 2.2 + random() * 1.6 : 0.9 + random() * 0.9),
      glow: fine(near ? 0.34 + random() * 0.2 : 0.7 + random() * 0.25),
      pace: round(11 + random() * 12),
      delay: round(-random() * 22),
    };
  });
}

// Large, faint discs far behind the profile, for depth.
function farDiscs() {
  const random = seeded(19);
  return Array.from({ length: 8 }, () => ({
    x: round(40 + random() * 320),
    y: round(50 + random() * 300),
    r: round(26 + random() * 44),
    o: fine(0.05 + random() * 0.08),
  }));
}

// Soft blue points among the profile's own once it has gone soft: the decoy
// activity that is now part of the picture.
function mistPoints() {
  const random = seeded(52);
  return Array.from({ length: 46 }, () => {
    const angle = random() * TURN;
    const reach = Math.sqrt(random());
    return {
      x: round(200 + Math.cos(angle) * reach * 128),
      y: round(226 + Math.sin(angle) * reach * 150),
      r: round(5 + random() * 11),
      o: fine(0.14 + random() * 0.26),
    };
  });
}

export const PROFILE_POINTS = profilePoints();
export const MIST_POINTS = mistPoints();
export const DRIFT_POINTS = driftPoints();
export const FAR_DISCS = farDiscs();

/* ------------------------------------------------- the day (scenes 2 and 3) */

// One day runs left to right across the figure.
export const DAY = { left: 102, right: 372 };
const dayX = (share) => DAY.left + (DAY.right - DAY.left) * share;
export const DAY_PARTS = [
  { label: 'Morning', x: round(dayX(0.12)) },
  { label: 'Midday', x: round(dayX(0.39)) },
  { label: 'Evening', x: round(dayX(0.65)) },
  { label: 'Night', x: round(dayX(0.9)) },
];

// A row of activity: clusters of points around certain times of day. Each
// cluster is [time of day as a share, spread, how many].
function rowPoints(random, y, clusters, gap = 8.6) {
  const places = [];
  for (const [centre, spread, count] of clusters) {
    for (let index = 0; index < count; index += 1) {
      const lean = (random() + random() + random()) / 1.5 - 1;
      places.push(Math.min(0.985, Math.max(0.015, centre + lean * spread)));
    }
  }
  places.sort((first, second) => first - second);
  // Keep neighbours apart, then pull the row back inside the day.
  const xs = [];
  for (const share of places) xs.push(Math.max(dayX(share), (xs[xs.length - 1] ?? -Infinity) + gap));
  for (let index = xs.length - 1, limit = DAY.right; index >= 0; index -= 1) {
    xs[index] = Math.min(xs[index], limit);
    limit = xs[index] - gap;
  }
  return xs.map((x) => {
    return {
      x: round(x),
      y: round(y + (random() - 0.5) * 2.4),
      r: round(1.9 + random() * 1.9),
      // Where the point starts in scene 2: anywhere, before it finds its place.
      fromX: round(26 + random() * 348),
      fromY: round(40 + random() * 330),
      order: fine(random()),
    };
  });
}

function dayRows() {
  const random = seeded(23);
  const real = [
    { id: 'cycling', label: 'Cycling', y: 93, clusters: [[0.12, 0.085, 9], [0.56, 0.05, 2]] },
    { id: 'cooking', label: 'Cooking', y: 135, clusters: [[0.65, 0.08, 8], [0.4, 0.03, 2]] },
    { id: 'music', label: 'Music', y: 177, clusters: [[0.84, 0.11, 7], [0.36, 0.1, 4]] },
  ].map((row) => ({ ...row, points: rowPoints(random, row.y, row.clusters) }));
  // Each decoy keeps its own interest and its own hours, and a tempo of its
  // own for the slow pulse it has while the scene is on screen.
  const decoys = [
    { id: 'gardening', label: 'Gardening', y: 72, clusters: [[0.4, 0.1, 8], [0.1, 0.04, 2]], pace: 3.4, each: 0.07 },
    { id: 'painting', label: 'Painting', y: 114, clusters: [[0.9, 0.09, 8], [0.5, 0.05, 2]], pace: 5.1, each: 0.1 },
    { id: 'baking', label: 'Baking', y: 156, clusters: [[0.2, 0.07, 5], [0.52, 0.07, 5]], pace: 4.2, each: 0.055 },
    { id: 'guitar', label: 'Guitar', y: 198, clusters: [[0.74, 0.1, 8], [0.28, 0.07, 2]], pace: 6.3, each: 0.085 },
  ].map((row) => ({ ...row, points: rowPoints(random, row.y, row.clusters) }));
  // Decoy activity also lands on the real rows, at other times of day.
  const mixed = [
    { id: 'cycling', y: 93, clusters: [[0.78, 0.13, 5]] },
    { id: 'cooking', y: 135, clusters: [[0.15, 0.1, 5]] },
    { id: 'music', y: 177, clusters: [[0.1, 0.07, 4]] },
  ].map((row) => {
    const taken = real.find((item) => item.id === row.id).points;
    const points = rowPoints(random, row.y, row.clusters).filter((point) => taken.every((other) => Math.abs(other.x - point.x) > 8));
    return { ...row, points };
  });
  return { real, decoys, mixed };
}

export const DAY_ROWS = dayRows();

// The profile card under the day, and the line of daily rhythm inside it. A
// rhythm is a smooth line with a rise at each busy time of day.
export const CARD = { x: 28, y: 246, width: 344, height: 126, left: 46, right: 354, valueX: 126 };
const STRIP = { left: CARD.left, right: CARD.right, base: 303, lift: 21 };

function rhythmLine(peaks, lift = STRIP.lift) {
  const steps = 64;
  const parts = [];
  for (let index = 0; index <= steps; index += 1) {
    const share = index / steps;
    let height = 0;
    for (const [centre, width, strength] of peaks) {
      height += strength * Math.exp(-((share - centre) ** 2) / (2 * width * width));
    }
    const x = round(STRIP.left + (STRIP.right - STRIP.left) * share);
    const y = round(STRIP.base - Math.min(1, height) * lift);
    parts.push(`${index ? 'L' : 'M'}${x} ${y}`);
  }
  return parts.join('');
}

export const RHYTHM_REAL = rhythmLine([[0.12, 0.05, 1], [0.66, 0.055, 0.86]]);
export const RHYTHM_DECOYS = [
  rhythmLine([[0.4, 0.07, 0.9]]),
  rhythmLine([[0.9, 0.06, 0.95], [0.5, 0.04, 0.3]]),
  rhythmLine([[0.2, 0.05, 0.7], [0.52, 0.05, 0.75]]),
  rhythmLine([[0.74, 0.07, 0.88], [0.28, 0.05, 0.32]]),
];
// With every rhythm laid over the others, the strip fills in: no single rise
// stands out any more.
export const RHYTHM_BAND = `${rhythmLine([[0.12, 0.07, 0.62], [0.3, 0.09, 0.6], [0.5, 0.1, 0.62], [0.7, 0.09, 0.64], [0.9, 0.07, 0.6]], 17)}L${STRIP.right} ${STRIP.base}L${STRIP.left} ${STRIP.base}Z`;

// Interests in the card: named and sharp at first, then soft and unnamed.
export const CHIPS = [
  { label: 'Cycling', x: 126, width: 64 },
  { label: 'Cooking', x: 196, width: 66 },
  { label: 'Music', x: 268, width: 52 },
];
export const SOFT_CHIPS = [
  { x: 126, width: 40 },
  { x: 172, width: 30 },
  { x: 208, width: 44 },
  { x: 258, width: 28 },
  { x: 292, width: 36 },
  { x: 334, width: 20 },
];

/* ------------------------------------------------------- tested (scene 4) */

// Two rows of decoys move left to right toward a detector. Every mark keeps
// the same pace. A random mark stops at the detector and drops. A tested mark
// passes and carries on.
export const GATE = { x: 206, top: 62, bottom: 338, stop: 197 };
export const TEST_PACE = 30;
export const TEST_LENGTH = 8;
export const TEST_ROWS = { random: 134, tested: 268 };

function testedMarks() {
  const random = seeded(88);
  const far = TEST_PACE * TEST_LENGTH;
  // Random decoys: uneven sizes, uneven spacing, turned every which way.
  const caught = [1.3, 2.15, 3.6, 4.25, 6.0].map((at, index) => ({
    kind: 'caught',
    at,
    size: round(6.5 + random() * 5),
    turn: Math.round(random() * 80 - 40),
    startX: round(GATE.stop - TEST_PACE * at),
    // Where it comes to rest once dropped: short of the detector, below
    // its row.
    x: round(GATE.stop - 4 - index * 10 - random() * 5),
    y: round(194 + (index % 2) * 10 - random() * 4),
    restTurn: Math.round(random() * 150 - 75),
  }));
  const waiting = [42, 80, 137, 171].map((x) => ({
    kind: 'waiting',
    size: round(6.5 + random() * 5),
    turn: Math.round(random() * 80 - 40),
    x,
    y: TEST_ROWS.random,
    startX: x - far,
  }));
  // Tested decoys: an even hand, in the short runs real activity comes in.
  const tested = [46, 68, 122, 144, 236, 258, 304, 326, 362].map((x) => ({
    kind: x > GATE.x ? 'passed' : 'queued',
    r: round(4 + random() * 1.2),
    x,
    y: TEST_ROWS.tested,
    startX: x - far,
    at: round((GATE.x - (x - far)) / TEST_PACE),
  }));
  return { caught, waiting, tested };
}

export const TEST_MARKS = testedMarks();

/* -------------------------------------------------------- score (scene 5) */

// A sample screen: a small window on the mix, and a gauge under it.
export const SCREEN = { x: 40, y: 44, width: 320, height: 312 };
export const GAUGE = { left: 66, right: 334, y: 278, rest: 0.78 };
export const LENS = { x: 200, y: 170, r: 56 };

function lensPoints() {
  const random = seeded(64);
  const you = { x: LENS.x - 13, y: LENS.y + 7 };
  const points = [];
  for (let index = 1; index <= 30 && points.length < 17; index += 1) {
    const radius = Math.sqrt(index / 31) * (LENS.r - 9);
    const x = LENS.x + Math.cos(index * GOLDEN + 0.6) * radius;
    const y = LENS.y + Math.sin(index * GOLDEN + 0.6) * radius;
    if (Math.hypot(x - you.x, y - you.y) < 13) continue;
    points.push({ x: round(x), y: round(y), r: round(3.6 + random() * 1.6), order: fine(random()) });
  }
  return { you, points };
}

export const LENS_POINTS = lensPoints();

// What the sample screen shows at a given reading, from 0 (easy to pick out)
// to 1 (hard to pick out). The figure is drawn with this at its resting
// reading, and the motion paints with it, so the two always agree.
const between = (from, to, amount) => from + (to - from) * amount;
const limit = (value) => Math.min(1, Math.max(0, value));
const YOU_BRIGHT = [244, 247, 251];
const YOU_MIXED = [111, 155, 255];

export function scoreAt(level) {
  const blend = limit(level / 0.82);
  return {
    markX: round(between(GAUGE.left, GAUGE.right, level)),
    youR: round(between(7.2, 4.4, blend)),
    youFill: `rgb(${YOU_BRIGHT.map((channel, index) => Math.round(between(channel, YOU_MIXED[index], blend))).join(' ')})`,
    youGlow: fine(between(0.5, 0, limit(level / 0.5))),
    notice: fine(limit(1 - (level - 0.16) / 0.18)),
    decoy: (order) => fine(between(0.07, 1, limit((level * 1.3 - order * 0.72) / 0.24))),
  };
}
