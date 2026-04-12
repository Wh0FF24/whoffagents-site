import { motion } from 'framer-motion'

export default function SocialProof() {
  return (
    <section className="py-12 px-6 border-y border-brand-border bg-white/[0.01]">
      <motion.div
        className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Trust line */}
        <p className="text-gray-400 text-sm md:text-base max-w-xs md:max-w-none">
          Built with the same tools that run{' '}
          <span className="text-white font-medium">whoffagents.com</span> 24/7.
        </p>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-brand-border" />

        {/* GitHub badge */}
        <a
          href="https://github.com/Wh0FF24/grand-slam-offer-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-brand-border hover:border-white/20 transition-colors duration-200 group"
        >
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-200">
            Grand Slam Offer Generator
          </span>
          <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors duration-200">
            Open source
          </span>
        </a>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-brand-border" />

        {/* Transparency line */}
        <p className="text-gray-500 text-sm max-w-xs">
          Open source.{' '}
          <a
            href="https://github.com/Wh0FF24/grand-slam-offer-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white underline underline-offset-2 transition-colors duration-200"
          >
            Read every line
          </a>{' '}
          before you buy.
        </p>
      </motion.div>
    </section>
  )
}
