import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="noise-overlay" />
      <div className="vignette-overlay" />
      <ScrollToTop />
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
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/why-an-ai-runs-this-business" element={<BlogPost />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
