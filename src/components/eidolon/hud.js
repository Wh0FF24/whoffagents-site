// Geometry and data for the Eidolon figures. Everything here is a pure
// function or a constant, so the prerendered markup and the browser agree
// and each figure is complete before any script runs.

export const round = (value) => Math.round(value * 100) / 100;

// 0 degrees points up; angles grow clockwise, like a clock face.
export const polar = (radius, degrees, cx = 0, cy = 0) => {
  const a = (degrees - 90) * (Math.PI / 180);
  return [round(cx + Math.cos(a) * radius), round(cy + Math.sin(a) * radius)];
};

export const arc = (radius, from, to, cx = 0, cy = 0) => {
  const [x1, y1] = polar(radius, from, cx, cy);
  const [x2, y2] = polar(radius, to, cx, cy);
  const large = to - from > 180 ? 1 : 0;
  return `M${x1} ${y1}A${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
};

// Four corner marks of a square centred on (x, y).
export const corners = (x, y, half, length) => [
  `M${round(x - half)} ${round(y - half + length)}V${round(y - half)}H${round(x - half + length)}`,
  `M${round(x + half - length)} ${round(y - half)}H${round(x + half)}V${round(y - half + length)}`,
  `M${round(x + half)} ${round(y + half - length)}V${round(y + half)}H${round(x + half - length)}`,
  `M${round(x - half + length)} ${round(y + half)}H${round(x - half)}V${round(y + half - length)}`,
].join('');

// A small repeatable generator: the "noise" in a figure is the same on every
// render, on the server and in the browser.
export function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Daily rhythms, one value per hour of a day (0 quiet, 1 busy). These are
// drawn shapes for the illustrations, not recorded activity.
export const RHYTHMS = {
  phone: [0.1, 0.05, 0.05, 0.05, 0.1, 0.2, 0.5, 0.8, 0.9, 0.6, 0.5, 0.6, 0.7, 0.6, 0.5, 0.5, 0.6, 0.8, 1, 0.9, 0.7, 0.5, 0.3, 0.2],
  commuter: [0.1, 0.05, 0.05, 0.05, 0.1, 0.3, 0.7, 1, 0.8, 0.4, 0.3, 0.35, 0.4, 0.35, 0.3, 0.4, 0.7, 1, 0.9, 0.5, 0.4, 0.3, 0.2, 0.1],
  shift: [0.9, 1, 0.9, 0.8, 0.7, 0.8, 0.5, 0.2, 0.1, 0.05, 0.05, 0.05, 0.1, 0.1, 0.2, 0.3, 0.3, 0.4, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9],
  traveler: [0.05, 0.05, 0.6, 0.9, 0.1, 0.05, 0.05, 0.7, 0.2, 0.05, 0.05, 0.05, 0.8, 1, 0.3, 0.05, 0.05, 0.05, 0.5, 0.9, 0.6, 0.05, 0.05, 0.3],
  resident: [0.1, 0.1, 0.1, 0.1, 0.15, 0.3, 0.5, 0.6, 0.65, 0.6, 0.65, 0.6, 0.6, 0.65, 0.6, 0.65, 0.6, 0.6, 0.5, 0.5, 0.4, 0.3, 0.2, 0.1],
  extraA: [0.2, 0.1, 0.05, 0.05, 0.05, 0.1, 0.2, 0.4, 0.7, 0.9, 0.8, 0.5, 0.3, 0.3, 0.5, 0.8, 0.9, 0.6, 0.4, 0.3, 0.5, 0.6, 0.4, 0.3],
  extraB: [0.5, 0.3, 0.1, 0.05, 0.05, 0.05, 0.1, 0.3, 0.4, 0.3, 0.2, 0.4, 0.8, 0.9, 0.5, 0.2, 0.2, 0.3, 0.6, 0.8, 0.9, 1, 0.8, 0.6],
};

// A ring of 24 radial bars: one bar per hour, longer when busier.
export const rhythmRing = (pattern, inner, reach) => pattern.map((value, hour) => {
  const [x1, y1] = polar(inner, hour * 15);
  const [x2, y2] = polar(inner + 1.5 + value * reach, hour * 15);
  return { x1, y1, x2, y2 };
});
