import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { captureUTMs } from "./utils/utm";

captureUTMs();

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
if (POSTHOG_KEY && import.meta.env.VITE_PRIVATE_PREVIEW !== "true") {
  import("posthog-js").then(({ default: posthog }) =>
    posthog.init(POSTHOG_KEY, {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    }),
  );
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Keep the prerendered first paint in place while React attaches interactions.
// Query-only design comparisons have no matching static document.
const root = document.getElementById("root");
if (root.hasChildNodes() && !new URLSearchParams(window.location.search).has("concept")) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
