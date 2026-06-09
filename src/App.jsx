import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
import ScrollToTop from './components/ScrollToTop'
import ExitIntentPopup from './components/ExitIntentPopup'
import PHLaunchBanner from './components/PHLaunchBanner'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="noise-overlay" />
      <div className="vignette-overlay" />
      <ScrollToTop />
      <PHLaunchBanner />
      <Nav />
      <main className="flex-1">
        <AnimatePresence mode="wait">
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
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ExitIntentPopup />
    </div>
  )
}

export default App
