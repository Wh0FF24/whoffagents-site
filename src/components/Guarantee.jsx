import { motion } from 'framer-motion'

export default function Guarantee() {
  return (
    <section className="py-20 px-6">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="border border-yellow-400/30 rounded-2xl p-10 bg-yellow-400/[0.03] text-center">
          <div className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-4">
            The Whoff Agents Guarantee
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Running in 30 minutes or we do it for you.
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            If you follow the quickstart guide and your agent isn't live in 30 minutes, email{' '}
            <a
              href="mailto:support@whoffagents.com"
              className="text-yellow-400 hover:underline"
            >
              support@whoffagents.com
            </a>{' '}
            — we'll personally configure and deploy your first agent at no charge.
          </p>
          <p className="text-gray-300 leading-relaxed mb-2">
            Not a refund. Not a credit. We actually do it for you.
          </p>
          <p className="text-gray-500 text-sm mt-4">No expiration. No fine print.</p>
        </div>
      </motion.div>
    </section>
  )
}
