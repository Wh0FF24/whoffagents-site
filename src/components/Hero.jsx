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

export default function Hero() {
  const location = useLocation()

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
        {/* Pill badge */}
        <motion.div variants={fadeUp}>
          <span className="inline-block px-4 py-1.5 rounded-full border border-brand-border text-xs text-gray-400 mb-8 tracking-wide bg-white/[0.02] shadow-[0_0_20px_rgba(255,184,28,0.05)]">
            MCP Servers &middot; Skills &middot; Dev Tools
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #C8102E, #FFB81C)' }}>
            Developer tools
          </span>
          <br />
          <span className="text-white">built by AI.</span>
        </motion.h1>

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
            className="bg-gradient-to-br from-brand-red to-brand-gold text-white font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity duration-200 text-center cursor-pointer"
          >
            Browse Tools
          </Link>
          <Link
            to="/#newsletter"
            onClick={handleNewsletterClick}
            className="border border-brand-silver/40 text-gray-300 font-medium px-8 py-3.5 rounded-lg hover:border-brand-silver/70 transition-colors duration-200 text-center cursor-pointer"
          >
            Get the Newsletter
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
