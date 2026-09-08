// Maps legacy Plausible event names to PostHog-expected names
const PH_NAME = {
  "Email-Capture": "email_capture_submit",
  "Checkout-Start": "stripe_checkout_click",
};

export function track(eventName, props = {}) {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible(eventName, { props });
  }
  if (
    import.meta.env.VITE_POSTHOG_KEY &&
    import.meta.env.VITE_PRIVATE_PREVIEW === "false"
  ) {
    import("posthog-js").then(({ default: posthog }) => {
      posthog.capture(PH_NAME[eventName] ?? eventName, props);
    });
  }
}
