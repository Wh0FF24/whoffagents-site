// The size of the /haze link-preview picture and the words drawn on it.
// scripts/make-haze-card.mjs draws them, and tests/haze.spec.js checks that
// each one is still on the page, so the picture cannot say more than the
// page does.
export const CARD = { width: 1200, height: 630 };

// The headline is a list of parts. A part marked soft is drawn a little out
// of focus, as the same words are in the page's own headline. A line feed
// inside a part starts a new line.
export const WORDS = {
  name: 'Haze',
  label: 'In design. Not available yet.',
  headline: [{ text: 'Stay online.' + String.fromCharCode(10) + 'Stay ' }, { text: 'out of focus', soft: true }, { text: '.' }],
  button: 'Join the waitlist',
};

export const headlineText = (words = WORDS) =>
  words.headline.map((part) => part.text).join('').replace(/\s+/g, ' ').trim();
