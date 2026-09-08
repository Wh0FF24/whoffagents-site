import posthog from 'posthog-js'

// Maps legacy Plausible event names to PostHog-expected names
const PH_NAME = {
  'Email-Capture': 'email_capture_submit',
  'Checkout-Start': 'stripe_checkout_click',
}

export function track(eventName, props = {}) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(eventName, { props })
  }
  posthog.capture(PH_NAME[eventName] ?? eventName, props)
}
