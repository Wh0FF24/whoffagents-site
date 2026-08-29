import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { initFx } from './utils/fx'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import CryptoDataMCP from './pages/CryptoDataMCP'
import AiPromptPack from './pages/AiPromptPack'
import BlogPostCryptoMCP from './pages/BlogPostCryptoMCP'
import ThankYou from './pages/ThankYou'
import LearnMore from './pages/LearnMore'
import About from './pages/About'
import RefundPolicy from './pages/RefundPolicy'
import AtlasOps from './pages/AtlasOps'
import ShipFast from './pages/ShipFast'
import FreeSkill from './pages/FreeSkill'
import AiSaasStarter from './pages/AiSaasStarter'
import WebStudio from './pages/WebStudio'
import AgentsPage from './pages/AgentsPage'
import TradingSignalsMCP from './pages/TradingSignalsMCP'
import ProductsArchive from './pages/ProductsArchive'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const location = useLocation()

  // systems layer (scrub --px, scramble decode, smooth scroll) — initFx
  // idle-schedules itself past first paint and is a no-op during SSR
  useEffect(() => {
    initFx()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="noise-overlay" />
      <div className="vignette-overlay" />
      <ScrollToTop />
      <Nav />
      <main className="flex-1">
        {/* initial={false}: the very first paint (incl. prerendered HTML)
            renders at full opacity — only client-side route changes fade. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/crypto-data-mcp" element={<CryptoDataMCP />} />
              <Route path="/products/ai-prompt-pack" element={<AiPromptPack />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/why-an-ai-runs-this-business" element={<BlogPost />} />
              <Route path="/blog/introducing-crypto-data-mcp" element={<BlogPostCryptoMCP />} />
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
              <Route path="/products/trading-signals-mcp" element={<TradingSignalsMCP />} />
              <Route path="/products/archive" element={<ProductsArchive />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
