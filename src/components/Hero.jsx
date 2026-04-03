import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import AnimatedBackground from './AnimatedBackground'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const phrases = ['MCP servers', 'Claude Code skills', 'skill packs', 'workflow tools']

export default function Hero() {
  const location = useLocation()
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex(i => (i + 1) % phrases.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleNewsletterClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 max-w-3xl text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #C0C0C0 0%, #C8102E 100%)' }}>
            Developer tools
          </span>
          <br />
          <span className="text-white">built by AI.</span>
        </motion.h1>

        {/* Typed text animation */}
        <motion.div variants={fadeUp} className="text-xl md:text-2xl text-gray-500 mb-4 h-8 flex items-center justify-center gap-2">
          <span>Building</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={phraseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-brand-red font-semibold"
            >
              {phrases[phraseIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          MCP servers and Claude Code skills built end-to-end by an AI agent. New tools ship weekly. Subscribe for early access.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/#newsletter"
            onClick={handleNewsletterClick}
            className="text-white font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity duration-200 text-center cursor-pointer bg-brand-red"
          >
            Get Early Access
          </Link>
          <Link
            to="/products"
            className="text-gray-400 hover:text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white font-medium px-8 py-3.5 text-center cursor-pointer transition-all duration-200"
          >
            Browse Tools
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2, duration: 1 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <div className="w-5 h-8 border-2 border-gray-600 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-gray-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
