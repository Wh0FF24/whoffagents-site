# Whoff Agents

Websites, custom AI agents, and developer tools from an independent studio in Provo, Utah.

## Local redesign preview

This branch is a private design candidate. Will must see and approve it before production. Client screenshots under `public/work/` have not been cleared for publication. Do not push this branch to a public remote or deploy these assets without resolving that permission.

```powershell
npm ci
# Create .env.local containing VITE_PRIVATE_PREVIEW=true
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Preview mode is the default, including when no env file exists. Only explicitly setting VITE_PRIVATE_PREVIEW=false enables the production transport. Preview mode labels the page, injects noindex, disables PostHog initialization, and simulates inquiry submissions without sending. Localhost binding is the privacy boundary; noindex alone is not access control.

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

## Production prerequisites

1. Will's design approval and public portfolio permission, especially for the unpublished Island Airporter build.
2. Wire and verify lead delivery. `VITE_CONTACT_ENDPOINT` currently expects a same-origin JSON endpoint that returns `{ "accepted": true }` after confirmed acceptance. No endpoint is implemented or configured here. Missing configuration gives an honest error and mailto fallback.
3. Preserve the existing Luke lead pipeline: `https://whoff-web-studio.netlify.app/`, `form-name=lead`, and the field names documented in `src/components/studio/StudioSections.jsx`. A backend adapter must preserve this contract; the new form schema is not a drop-in replacement.
4. Any real voice demo needs a dedicated, approved integration. The present transcript is explicitly illustrative. Never expose Atlas's private personal-forward number or Iris's separate personal line.
5. Production smoke test and indexing/configuration review. Never treat turning off `VITE_PRIVATE_PREVIEW` as sufficient release preparation.

Blue pairs with silver; red pairs with gold. Do not include Will's last name in public content.

## Official logo

Will supplied `updated.svg` as the official company logo. `public/brand/whoff-official-original.svg` preserves that file byte-for-byte. `whoff-logo.svg` and `whoff-mark.svg` retain its original vector paths and colors, with the background removed and the viewBox cropped for placement. The header/footer use the supplied wordmark; the favicon, studio fallback, and 3D sculpture use its symbol. Do not substitute the former invented W.

## Layered portfolio comparison

The approved cube remains the default. Open `/web?concept=layers` (or `/?concept=layers`) for the separate layered portfolio candidate: a compact stack opens into large project panels as visitors scroll. Numbered controls and previous/next buttons select projects directly. Mobile and reduced-motion visitors get a normal-flow presentation; a static screenshot preserves the links if WebGL fails. Will has not selected this alternative for production.

`src/components/StudioLayers.jsx`, `layerScene.js`, and `src/styles/studio-layers.css` implement the alternative. Both presentations share `src/data/showcaseProjects.js`. `tests/layers.spec.js` adds four checks to the existing 24; the complete 28-test suite passed. Run `node scripts/capture-layers.mjs <output-directory>` against the local dev preview to capture the comparison.

## Home and Websites now have distinct entrances

The current local design uses the cube on `/` and the layered portfolio by default on `/web`. Clicking the company logo returns to the home overview. Websites uses dedicated web-studio copy and continues into project details, process, full pricing, and website FAQs. `/web?concept=cube` retains the older comparison; `?concept=layers` remains supported. This supersedes the earlier comparison-only description above. Production approval is still required.

## Approved page direction: pyramid Home, layered Websites

Will selected a pyramid for the home screen and layered panels for Websites. `/` now uses StudioPyramid with an original Three.js three-sided pyramid, separating faces, paired metal finishes, pause/reduced-motion handling, and a static SVG fallback. `/web` retains StudioLayers. The cube remains available only with `?concept=cube`. This supersedes the earlier Home/cube description; production approval is still separate. Focused pyramid tests cover rendered opening, navigation, mobile accessibility, and context loss.
