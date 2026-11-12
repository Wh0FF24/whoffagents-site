// The size of the /haze link-preview picture and the words drawn on it.
// scripts/make-haze-card.mjs draws them, and tests/haze.spec.js checks that
// each one is still on the page, so the picture cannot say more than the
// page does.
export const CARD = { width: 1200, height: 630 };

// The headline is a list of parts. A part marked soft is drawn a little out
// of focus, as the first word of the page's own headline is. "\n" inside a
// part starts a new line.
export const WORDS = {
  name: 'Haze',
  label: 'In design. Not available yet.',
  headline: [{ text: 'Blur', soft: true }, { text: ' the profile they build on you.' }],
  button: 'Join the waitlist',
};

export const headlineText = (words = WORDS) =>
  words.headline.map((part) => part.text).join('').replace(/\s+/g, ' ').trim();
