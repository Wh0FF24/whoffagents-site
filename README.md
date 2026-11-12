# Whoff Agents

Whoff Agents LLC: AI-native engineering. Software, AI agents, systems integration, and research, plus the studio's websites, receptionist, and developer tools.

## Local redesign preview

This branch is a private design candidate. Will must see and approve it before production. Client screenshots under `public/work/` have not been cleared for publication. Do not push this branch to a public remote or deploy these assets without resolving that permission.

```powershell
npm ci
# Create .env.local containing VITE_PRIVATE_PREVIEW=true
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Preview mode is OPT-IN: it is on only when VITE_PRIVATE_PREVIEW is exactly `true`, which `.env.local` sets for local work and `playwright.config.js` sets for the test run. Any other value, including no env file at all, builds the live production transport — which is what the Amplify build produces, since Amplify carries no VITE_PRIVATE_PREVIEW variable and the old preview-by-default gate would have shipped a noindexed site with a dead form. Preview mode labels the page, injects noindex, disables PostHog initialization, and simulates inquiry submissions without sending. Localhost binding is the privacy boundary; noindex alone is not access control.

## Stack and checks

React 19, Vite 8, React Router, Tailwind 4, Lucide, and self-hosted fonts. Older detail pages use Framer Motion. JavaScript, not TypeScript or Next.js. Existing Amplify configuration builds and prerenders the site; this task does not deploy it.

```powershell
npm run build
node scripts/prerender.mjs
npx playwright test
```

The Playwright suite uses installed Chrome and automatically builds, prerenders, and starts its own isolated preview at port 4174. It checks core pages at four viewport sizes, automated accessibility, interactions, no-send preview inquiries, 21 routes, and the free download. `npm run lint` checks the entire repository; legacy source has findings outside this redesign's checked files.

## Structure

The current candidate is **Dimension**, an original Three.js scene. Its cube has two website faces (Spindle Creek and the private Island Airporter concept), two original illustrated capability faces, and a blue/silver studio lid. Desktop scrolling rotates the sculpture; phone visitors use direct controls in normal page flow. Reduced motion disables continuous motion and uses instant face changes. A still portfolio panel remains usable without WebGL. No client video or borrowed hero footage is included.

Each main page has a related original sculpture: the home/web cube, an agent signal core, a stack of tool modules, and the official interlocking W/A mark. The agent choices also select the illustrative transcript scenario; the tool choices filter the catalog. Supporting product, article, and policy pages share a quiet chapter frame without extra 3D.

The studio sculpture extrudes the official SVG paths, retaining the red/blue W and gold/silver A. Below the heroes, an original folded wireframe surface and paired ambient lighting continue through sections and supporting pages. This decoration stays behind content and adds no canvas. Its small scroll response stops under reduced motion, with no continuous idle animation. `scripts/generate-contour.mjs` reproduces the local SVG field.

Three.js loads asynchronously only on the five main routes and shares one runtime chunk. Scenes cap pixel density, stop rendering offscreen/in background tabs, and dispose resources on navigation. Every sculpture includes a static fallback, reduced-motion support, and a pause control. The browser checks verify rendered pixels, scrolling, pause, selections, catalog integration, fallback, context loss, mobile controls, and prerendered content. These checks establish behavior, not design quality.

- `src/pages/StudioPages.jsx`: shared studio pages and sections.
- `src/pages/StudioProducts.jsx`: searchable developer catalog.
- `src/components/StudioNav.jsx`, `StudioFooter.jsx`, `InquiryForm.jsx`: shared navigation and intake.
- `src/components/StudioShowcase.jsx`, `cubeScene.js`: accessible project explorer and original real-time sculpture.
- `src/components/StudioIdentity.jsx`, `identityScene.js`: agent, tools, and studio hero controls and original sculptures.
- `src/styles/studio-identities.css`: page identities and the supporting chapter frame.
- `src/components/StudioAtmosphere.jsx`, `src/styles/studio-atmosphere.css`: shared background depth and scroll response.
- `src/styles/studio-showcase.css`: Dimension composition, responsive layouts and section refinements.
- `src/styles/studio.css`: brand pairs, layouts, responsive and reduced-motion behavior.
- `src/data/products.js`: existing catalog prices and checkout URLs.
- `src/data/routeMeta.js`: shared client/prerender metadata for the existing 21 routes.
- `tests/redesign.spec.js`, `showcase.spec.js`, `identities.spec.js`: browser checks.
- `scripts/capture-identities.mjs <output-directory>`: desktop/mobile screenshots from the loopback dev preview on port 4173.
- `scripts/capture-atmosphere.mjs <output-directory>`: below-hero screenshots from the same preview.

## Haze page (unlisted draft)

`/haze` is a waitlist page for an app that is still in design. It is a draft: Will reviews it before it is published or shared.

- It stands on its own. `src/App.jsx` leaves out the site's header, navigation and footer on this route, and the page brings its own top bar and footer. Its only links are in-page anchors, one link to `/`, and one `mailto:`.
- It is unlisted. `routeMeta` marks the route `sitemap: false` and `robots: "noindex, nofollow"`, the prerender writes that tag into the page's own HTML in every build, and no page links to it. Keep it out of `robots.txt`: a crawler told not to fetch a page never sees its noindex tag, and the file would advertise the address.
- It keeps the promise printed in its footer. `src/main.jsx` runs neither the campaign capture nor analytics when the site is opened at `/haze`, so in a live build the page asks nothing of any other origin and keeps nothing in the browser. `node scripts/check-haze-privacy.mjs` proves it on a live build with a made-up analytics key, answering every outside request itself so nothing leaves the machine. Run it on its own, not beside the test suite: both build into `dist/`.
- `src/pages/HazePage.jsx` holds the copy. `src/components/haze/` holds the figures, each drawn finished in the HTML, and `hazeMotion.js`, which holds a scene in place while the scroll plays it on wide screens, plays it once as it comes into view on small ones, and runs nothing for a scene that is off screen. With reduced motion, without JavaScript, or if the motion cannot load, the page keeps the finished frames at normal height. `src/styles/haze.css` is imported as text and rendered into the page's own HTML, so it is not added to the stylesheet every other page loads.
- `src/components/haze/HazeWaitlistForm.jsx` is the page's own form. It shares nothing with `InquiryForm` or the lead pipeline. A preview build sends nothing. A live build shows the form only when `VITE_HAZE_WAITLIST_ENDPOINT` is set to a path on this same site, and then sends one JSON `POST` holding exactly `email`, `where`, `pay`, `note` and `website`. With no address set it shows one line saying the waitlist is not open.
- `tests/haze.spec.js` covers the page, including two small live builds it makes and serves from the local machine only. Its wording is pinned to `tests/fixtures/haze-copy.txt`. `node scripts/capture-haze.mjs <url> <screenshot directory> [video directory]` captures every scene, section and still frame, and `node scripts/measure-haze-frames.mjs <url>` times the page's frames with the processor slowed.
- Before publishing, check the host's rewrite rules. Where the host answers an address that has no file extension from its rules (one per prerendered route, then a catch-all), `/haze` and `/haze/` each need a rule to `/haze/index.html` ahead of the catch-all. Without them the host would answer with the home page's HTML, which carries neither this page's title nor its noindex tag. Signups need one more rule, for wherever they are to land.

## Production prerequisites

1. Will's design approval and public portfolio permission: given. Island Airporter and The Forge Gym are listed as client work (2026-09-28).
2. Lead delivery is wired. With no `VITE_CONTACT_ENDPOINT` set, a live build posts the inquiry to the Netlify lead form production already uses (`form-name=lead`, main's field names) with `mode: 'no-cors'`; the response is opaque, so the form reports "Sent", not "confirmed received". Setting `VITE_CONTACT_ENDPOINT` to a same-origin path switches to the stricter JSON transport, which only reports success on a 2xx carrying `{ "accepted": true }`.
3. Preserve the existing Luke lead pipeline: `https://whoff-web-studio.netlify.app/`, `form-name=lead`, and the field names documented in `src/components/studio/StudioSections.jsx`. A backend adapter must preserve this contract; the new form schema is not a drop-in replacement.
4. Any real voice demo needs a dedicated, approved integration. The present transcript is explicitly illustrative. Never expose Atlas's private personal-forward number or Iris's separate personal line.
5. Production smoke test and indexing/configuration review. Never treat turning off `VITE_PRIVATE_PREVIEW` as sufficient release preparation.

Blue pairs with silver; red pairs with gold. Do not include Will's last name in public content.

## Official logo

`public/brand/whoff-logo.svg` is the approved stacked "Whoff" / "Agents" wordmark for dark backgrounds; `whoff-logo-on-light.svg` is its light-background counterpart. Both preserve the original five mark paths and colors exactly. The words are outlined Oxanium (license: `public/brand/OFL-Oxanium.txt`), with no runtime font dependency. `whoff-official-original.svg` and `whoff-mark.svg` retain the supplied master and standalone symbol.

The header uses a 1.3-second assembly and word reveal once per page load, after the header entrance. Navigation does not replay it. Reduced motion and no JavaScript use the complete static logo. The footer remains static. `node scripts/build-stacked-logos.mjs` regenerates the two standalone animated SVGs from the approved static files without changing any path attributes. The light PNG is also used in the capability statement.

Eidolon is the public research-program name. `/research/persona-fleet` remains its existing URL for link compatibility; its page title, metadata, copy, and capability-statement references use Eidolon. Research maturity and effectiveness qualifiers are unchanged.

## Layered portfolio comparison

The approved cube remains the default. Open `/web?concept=layers` (or `/?concept=layers`) for the separate layered portfolio candidate: a compact stack opens into large project panels as visitors scroll. Numbered controls and previous/next buttons select projects directly. Mobile and reduced-motion visitors get a normal-flow presentation; a static screenshot preserves the links if WebGL fails. Will has not selected this alternative for production.

`src/components/StudioLayers.jsx`, `layerScene.js`, and `src/styles/studio-layers.css` implement the alternative. Both presentations share `src/data/showcaseProjects.js`. `tests/layers.spec.js` adds four checks to the existing 24; the complete 28-test suite passed. Run `node scripts/capture-layers.mjs <output-directory>` against the local dev preview to capture the comparison.

## Home and Websites now have distinct entrances

The current local design uses the cube on `/` and the layered portfolio by default on `/web`. Clicking the company logo returns to the home overview. Websites uses dedicated web-studio copy and continues into project details, process, full pricing, and website FAQs. `/web?concept=cube` retains the older comparison; `?concept=layers` remains supported. This supersedes the earlier comparison-only description above. Production approval is still required.

## Approved page direction: pyramid Home, layered Websites

Will selected a pyramid for the home screen and layered panels for Websites. `/` now uses StudioPyramid with an original Three.js three-sided pyramid, separating faces, paired metal finishes, pause/reduced-motion handling, and a static SVG fallback. `/web` retains StudioLayers. The cube remains available only with `?concept=cube`. This supersedes the earlier Home/cube description; production approval is still separate. Focused pyramid tests cover rendered opening, navigation, mobile accessibility, and context loss.

## Eidolon page (unlisted draft)

`/eidolon` shows what Eidolon does in scroll-driven instrument scenes and ends with the site's inquiry form. It is a draft: Will reviews it before it is published or shared.

- Unlisted. `routeMeta` marks the route `sitemap: false` and `robots: "noindex, nofollow"`. The prerender writes that tag into the page's own HTML in every build, and no page, navigation or footer links to it. Keep it out of `robots.txt`: a crawler told not to fetch a page never sees its noindex tag, and the file would advertise the address.
- `src/pages/EidolonPage.jsx` holds the copy. `src/components/eidolon/` holds the figures, each drawn finished in the HTML, and `eidolonMotion.js`, which plays each scene with the scroll and runs its loops only while that scene is on screen. With reduced motion, without JavaScript, or if the motion cannot load, the page keeps the finished frames at normal height. `src/styles/eidolon.css` styles it. The page imports that file as text and renders it into its own HTML, so it is not added to the stylesheet every other page loads.
- The form is `InquiryForm` with two request types. The type travels inside the existing `needs` field as `[Eidolon pilot]` or `[Eidolon updates]`. The field names the lead pipeline reads are unchanged. `node scripts/check-eidolon-request.mjs <local preview url>` shows what a live build would send without sending it.
- `tests/eidolon.spec.js` covers the page. `node scripts/capture-eidolon.mjs <url> <output-directory>` captures every scene at 1440x900 and 390x664, the opening at 375x548, and the reduced-motion still frames.
- Publishing needs two hosting rewrites, `/eidolon` and `/eidolon/` to `/eidolon/index.html`, placed before the catch-all rule. Without them the host answers with the home page's HTML, which carries neither this page's title nor its noindex tag.
