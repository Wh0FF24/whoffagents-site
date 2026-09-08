// Keep the static poster until a visitor interacts. No Three.js download on load.
// Each mounted scene owns its listeners; navigation/unmount cancels pending work.
let interacted = false;

export function deferScene(load) {
  const events = [
    "pointermove",
    "pointerdown",
    "touchstart",
    "keydown",
    "wheel",
    "scroll",
  ];
  let pending = true;
  const cancel = () => {
    pending = false;
    events.forEach((event) => window.removeEventListener(event, start));
  };
  const start = () => {
    if (!pending) return;
    cancel();
    interacted = true;
    load();
  };
  if (interacted) queueMicrotask(start);
  events.forEach((event) =>
    window.addEventListener(event, start, { passive: true }),
  );
  return cancel;
}
