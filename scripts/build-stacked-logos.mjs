/** Add a finite CSS entrance to the approved, fully outlined stacked logos.
 * The five mark paths and both word paths stay byte-for-byte unchanged.
 * Run: node scripts/build-stacked-logos.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const brand = new URL('../public/brand/', import.meta.url);
const motion = `<style>
@media (prefers-reduced-motion: no-preference) {
  .whoff-stacked-motion #original-mark > g > path { transform-box: fill-box; transform-origin: center; }
  .whoff-stacked-motion #original-mark > g > path:nth-child(3) { animation: whoff-crimson-in .76s cubic-bezier(.2,.7,.2,1) backwards; }
  .whoff-stacked-motion #original-mark > g > path:nth-child(-n+2) { animation: whoff-blue-in .9s .08s cubic-bezier(.2,.7,.2,1) backwards; }
  .whoff-stacked-motion #original-mark > g > path:nth-child(5) { animation: whoff-gold-in .7s .18s cubic-bezier(.2,.7,.2,1) backwards; }
  .whoff-stacked-motion #original-mark > g > path:nth-child(4) { animation: whoff-silver-in .7s .28s cubic-bezier(.2,.7,.2,1) backwards; }
  /* Opacity preserves the word paths' original placement transforms. */
  .whoff-stacked-motion #Whoff { animation: whoff-word-in .6s .5s ease-out backwards; }
  .whoff-stacked-motion #Agents { animation: whoff-word-in .65s .65s ease-out backwards; }
}
@keyframes whoff-crimson-in { from { opacity: 0; transform: translate(-24px, -12px); } to { opacity: 1; transform: none; } }
@keyframes whoff-blue-in { from { opacity: 0; transform: translate(24px, -12px); } to { opacity: 1; transform: none; } }
@keyframes whoff-gold-in { from { opacity: 0; transform: translate(-12px, 24px); } to { opacity: 1; transform: none; } }
@keyframes whoff-silver-in { from { opacity: 0; transform: translate(12px, 24px); } to { opacity: 1; transform: none; } }
@keyframes whoff-word-in { from { opacity: 0; } to { opacity: 1; } }
</style>`;

for (const theme of ['dark', 'light']) {
  const source = readFileSync(new URL(theme === 'dark' ? 'whoff-logo.svg' : 'whoff-logo-on-light.svg', brand), 'utf8');
  const animated = source.replace('<svg ', '<svg class="whoff-stacked-motion" ').replace('</desc>', `</desc>\n${motion}`);
  writeFileSync(new URL(`whoff-agents-stacked-animated-on-${theme}.svg`, brand), animated);
}
