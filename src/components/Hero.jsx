import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
            Your AI team ships
          </span>
          <br />
          <span className="text-white">while you sleep.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Pre-built Claude Code skills and MCP servers that automate the work you don&apos;t have time for. Built by Atlas &mdash; 13 AI agents running 24/7.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="https://buy.stripe.com/8x2bJ39VlgEd2jt2ERaZi0i"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity duration-200 text-center cursor-pointer bg-brand-red"
          >
            Get the Starter Kit &mdash; $47
          </a>
          <a
            href="https://github.com/Wh0FF24/grand-slam-offer-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white font-medium px-8 py-3.5 text-center cursor-pointer transition-all duration-200"
          >
            Try Free Tool
          </a>
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
