import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import StudioAtmosphere from "./components/StudioAtmosphere";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogPostBaselineWeek1 from "./pages/BlogPostBaselineWeek1";
import BlogPostWeek2Update from "./pages/BlogPostWeek2Update";
import BlogPostWeek3Update from "./pages/BlogPostWeek3Update";
import BlogPostWeek4Update from "./pages/BlogPostWeek4Update";
import CryptoDataMCP from "./pages/CryptoDataMCP";
import AiPromptPack from "./pages/AiPromptPack";
import BlogPostCryptoMCP from "./pages/BlogPostCryptoMCP";
import ThankYou from "./pages/ThankYou";
import LearnMore from "./pages/LearnMore";
import About from "./pages/About";
import RefundPolicy from "./pages/RefundPolicy";
import AtlasOps from "./pages/AtlasOps";
import ShipFast from "./pages/ShipFast";
import FreeSkill from "./pages/FreeSkill";
import AiSaasStarter from "./pages/AiSaasStarter";
import WebStudio from "./pages/WebStudio";
import AgentsPage from "./pages/AgentsPage";
import Receptionist from "./pages/Receptionist";
import TradingSignalsMCP from "./pages/TradingSignalsMCP";
import ProductsArchive from "./pages/ProductsArchive";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ScrollToTop from "./components/ScrollToTop";
import "./styles/studio.css";
import "./styles/studio-showcase.css";
import "./styles/studio-identities.css";
import "./styles/studio-atmosphere.css";
import { routeMeta } from "./data/routeMeta";

function App() {
  const location = useLocation();

  useEffect(() => {
    const meta = routeMeta[location.pathname];
    document.title = meta?.title || "Page not found | Whoff Agents";
    const description = document.querySelector('meta[name="description"]');
    if (description && meta) description.content = meta.description;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical)
      canonical.href = `https://whoffagents.com${location.pathname === "/" ? "" : location.pathname}`;
    if (import.meta.env.VITE_PRIVATE_PREVIEW !== "false") {
      let robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.appendChild(robots);
      }
      robots.content = "noindex, nofollow";
    }
  }, [location.pathname]);
  const corePage = ["/", "/web", "/agents", "/products", "/about"].includes(
    location.pathname,
  );

  return (
    <div className="studio-app">
      <StudioAtmosphere />
      <ScrollToTop />
      <Nav />
      <main
        id="main-content"
        className={corePage ? "" : "legacy-page dp-support-page"}
        data-page-family={
          location.pathname.startsWith("/products") ||
          ["/free-skill", "/learn-more", "/thank-you"].includes(
            location.pathname,
          )
            ? "tools"
            : "studio"
        }
      >
        {!corePage && (
          <div className="dp-page-rail">
            <a
              href={
                location.pathname.startsWith("/products") ||
                ["/free-skill", "/learn-more", "/thank-you"].includes(
                  location.pathname,
                )
                  ? "/products"
                  : "/about"
              }
            >
              {location.pathname.startsWith("/products") ||
              ["/free-skill", "/learn-more", "/thank-you"].includes(
                location.pathname,
              )
                ? "WHOFF / THE DEVELOPER COLLECTION"
                : "WHOFF / FROM THE STUDIO"}
            </a>
            <span>INDEPENDENT THINKING. EXTRA DIMENSION.</span>
          </div>
        )}
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/crypto-data-mcp" element={<CryptoDataMCP />} />
          <Route path="/products/ai-prompt-pack" element={<AiPromptPack />} />
          <Route path="/blog" element={<Blog />} />
          <Route
            path="/blog/why-an-ai-runs-this-business"
            element={<BlogPost />}
          />
          <Route
            path="/blog/baseline-week-1"
            element={<BlogPostBaselineWeek1 />}
          />
          <Route path="/blog/week-2-update" element={<BlogPostWeek2Update />} />
          <Route path="/blog/week-3-update" element={<BlogPostWeek3Update />} />
          <Route path="/blog/week-4-update" element={<BlogPostWeek4Update />} />
          <Route
            path="/blog/introducing-crypto-data-mcp"
            element={<BlogPostCryptoMCP />}
          />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/about" element={<About />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/atlas/ops" element={<AtlasOps />} />
          <Route path="/products/ship-fast-skill-pack" element={<ShipFast />} />
          <Route path="/products/ai-saas-starter" element={<AiSaasStarter />} />
          <Route path="/free-skill" element={<FreeSkill />} />
          <Route path="/web" element={<WebStudio />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/receptionist" element={<Receptionist />} />
          <Route
            path="/products/trading-signals-mcp"
            element={<TradingSignalsMCP />}
          />
          <Route path="/products/archive" element={<ProductsArchive />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route
            path="*"
            element={
              <section className="st-container st-section">
                <h1>That page isn’t here.</h1>
                <p>
                  <a href="/">Back to the studio →</a>
                </p>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
      {import.meta.env.VITE_PRIVATE_PREVIEW !== "false" && (
        <div className="st-preview-badge">
          PRIVATE DESIGN PREVIEW · NOT LIVE
        </div>
      )}
    </div>
  );
}

export default App;
