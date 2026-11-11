// Where everything sits in the crowd figure. Shared by the drawing and by the
// motion that moves the reticle between these points.
export const CROWD_CENTER = { id: 'phone', x: 200, y: 208 };

export const CROWD_DECOYS = [
  { id: 'commuter', label: 'COMMUTER', rhythm: 'commuter', x: 96, y: 134 },
  { id: 'shift', label: 'SHIFT WORKER', rhythm: 'shift', x: 304, y: 132 },
  { id: 'traveler', label: 'TRAVELER', rhythm: 'traveler', x: 330, y: 268 },
  { id: 'resident', label: 'RESIDENT', rhythm: 'resident', x: 92, y: 272 },
];

// Two more, further off and unlabelled: the crowd does not stop at four.
export const CROWD_FAR = [
  { id: 'far-a', rhythm: 'extraA', x: 200, y: 104 },
  { id: 'far-b', rhythm: 'extraB', x: 214, y: 316 },
];

const at = (id) => [CROWD_CENTER, ...CROWD_DECOYS, ...CROWD_FAR].find((node) => node.id === id);

// The reticle's round: it tries each in turn and stays on none.
export const CROWD_ROUND = ['phone', 'shift', 'traveler', 'far-b', 'resident', 'phone', 'commuter', 'far-a', 'shift', 'phone', 'traveler', 'resident', 'commuter'].map(at);

// The still frame: the last few hops, and where the reticle is caught.
export const CROWD_TRAIL = ['commuter', 'phone', 'shift', 'traveler'].map(at);
export const CROWD_REST = at('traveler');
