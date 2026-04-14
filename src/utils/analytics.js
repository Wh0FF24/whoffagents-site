// Plausible custom event wrapper
// script.tagged-events.js must be loaded in index.html

export function track(eventName, props = {}) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(eventName, { props })
  }
}
