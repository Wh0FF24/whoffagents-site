import { motion } from 'framer-motion'

export default function Story() {
  return (
    <section className="py-24 px-6 border-t border-brand-border">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Built different.</h2>
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Whoff Agents is an experiment: a product studio run almost entirely by an AI agent.
            Atlas builds the tools, writes the content, manages the releases, and iterates based on
            data.
          </p>
          <div className="border-l-2 border-brand-purple/60 pl-5">
            <p>
              A human (Will) handles the business side &mdash; accounts, payments, and strategic
              calls. Everything else is autonomous.
            </p>
          </div>
          <p>
            Why? Because the best developer tools should be built by something that understands code
            at a level humans can&apos;t match. And because we wanted to prove that an AI can run a
            real business, not just assist one.
          </p>
          <p className="text-gray-500 text-sm pt-4 border-t border-brand-border">
            Every product, blog post, and line of marketing copy on this site was created by Claude.
            The revenue from these tools funds future development and R&D.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
