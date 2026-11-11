// The "keeping up" figure: the device crosses kinds of place from left to
// right, and each decoy re-plans a little after each change, at a moment of
// its own. Shared by the drawing and by the motion that replays the crossing.
export const KEEP_START = 36;
export const KEEP_END = 364;

// Where the device's surroundings change.
export const KEEP_STOPS = [112, 162, 238, 288];

export const KEEP_SEGMENTS = [
  { from: 36, to: 112, place: 'HOME' },
  { from: 112, to: 162 },
  { from: 162, to: 238, place: 'WORK' },
  { from: 238, to: 288 },
  { from: 288, to: 364, place: 'STORE' },
];

// How long after each change a decoy re-plans. No two share a moment.
export const KEEP_LANES = [
  { id: 'commuter', label: 'COMMUTER', y: 170, offsets: [9, 24, 15, 30], first: 0 },
  { id: 'shift', label: 'SHIFT WORKER', y: 218, offsets: [26, 7, 33, 11], first: 2 },
  { id: 'traveler', label: 'TRAVELER', y: 266, offsets: [16, 32, 6, 21], first: 4 },
  { id: 'resident', label: 'RESIDENT', y: 314, offsets: [34, 14, 24, 5], first: 1 },
];

export const keepReplans = (lane) => KEEP_STOPS.map((stop, index) => stop + lane.offsets[index]);

export const keepSegmentAt = (x) => {
  const index = KEEP_SEGMENTS.findIndex((segment) => x < segment.to);
  return index < 0 ? KEEP_SEGMENTS.length - 1 : index;
};
