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

Each main page has a related original sculpture: the home/web cube, an agent signal core, a stack of tool modules, and a two-part studio W. The agent choices also select the illustrative transcript scenario; the tool choices filter the catalog. Supporting product, article, and policy pages share a quiet chapter frame without extra 3D.

Three.js loads asynchronously only on the five main routes and shares one runtime chunk. Scenes cap pixel density, stop rendering offscreen/in background tabs, and dispose resources on navigation. Every sculpture includes a static fallback, reduced-motion support, and a pause control. The browser checks verify rendered pixels, scrolling, pause, selections, catalog integration, fallback, context loss, mobile controls, and prerendered content. These checks establish behavior, not design quality.

- `src/pages/StudioPages.jsx`: shared studio pages and sections.
- `src/pages/StudioProducts.jsx`: searchable developer catalog.
- `src/components/StudioNav.jsx`, `StudioFooter.jsx`, `InquiryForm.jsx`: shared navigation and intake.
- `src/components/StudioShowcase.jsx`, `cubeScene.js`: accessible project explorer and original real-time sculpture.
- `src/components/StudioIdentity.jsx`, `identityScene.js`: agent, tools, and studio hero controls and original sculptures.
- `src/styles/studio-identities.css`: page identities and the supporting chapter frame.
- `src/styles/studio-showcase.css`: Dimension composition, responsive layouts and section refinements.
- `src/styles/studio.css`: brand pairs, layouts, responsive and reduced-motion behavior.
- `src/data/products.js`: existing catalog prices and checkout URLs.
- `src/data/routeMeta.js`: shared client/prerender metadata for the existing 21 routes.
- `tests/redesign.spec.js`, `showcase.spec.js`, `identities.spec.js`: browser checks.
- `scripts/capture-identities.mjs <output-directory>`: desktop/mobile screenshots from the loopback dev preview on port 4173.

## Production prerequisites

1. Will's design approval and public portfolio permission, especially for the unpublished Island Airporter build.
2. Wire and verify lead delivery. `VITE_CONTACT_ENDPOINT` currently expects a same-origin JSON endpoint that returns `{ "accepted": true }` after confirmed acceptance. No endpoint is implemented or configured here. Missing configuration gives an honest error and mailto fallback.
3. Preserve the existing Luke lead pipeline: `https://whoff-web-studio.netlify.app/`, `form-name=lead`, and the field names documented in `src/components/studio/StudioSections.jsx`. A backend adapter must preserve this contract; the new form schema is not a drop-in replacement.
4. Any real voice demo needs a dedicated, approved integration. The present transcript is explicitly illustrative. Never expose Atlas's private personal-forward number or Iris's separate personal line.
5. Production smoke test and indexing/configuration review. Never treat turning off `VITE_PRIVATE_PREVIEW` as sufficient release preparation.

Blue pairs with silver; red pairs with gold. Do not include Will's last name in public content.
