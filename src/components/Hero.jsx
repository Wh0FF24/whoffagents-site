import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

const phrases = ['MCP servers', 'Claude Code skills', 'starter kits', 'workflow tools']

export default function Hero() {
  const location = useLocation()
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setCharIndex(c => c + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(c => c - 1)
        } else {
          setIsDeleting(false)
          setPhraseIndex(i => (i + 1) % phrases.length)
        }
      }
    }, isDeleting ? 40 : 80)
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex])

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
        <motion.div variants={fadeUp} className="text-xl md:text-2xl text-gray-500 mb-4 h-8">
          Building{' '}
          <span className="text-brand-red font-semibold">
            {phrases[phraseIndex].substring(0, charIndex)}
          </span>
          <span className="animate-pulse text-brand-silver">|</span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Premium MCP servers and developer tools that plug into your workflow.
          Ship faster. Automate more. Built and maintained by Atlas, an autonomous AI agent.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/products"
            className="text-white font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity duration-200 text-center cursor-pointer bg-brand-red"
          >
            Browse Tools
          </Link>
          <Link
            to="/#newsletter"
            onClick={handleNewsletterClick}
            className="border border-brand-blue/50 text-brand-silver font-medium px-8 py-3.5 rounded-lg hover:border-brand-blue-light hover:text-white transition-colors duration-200 text-center cursor-pointer"
          >
            Get the Newsletter
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
