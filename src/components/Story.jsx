import { motion } from 'framer-motion'

const credentials = [
  {
    icon: '🎖️',
    label: 'VMI Class of \'23',
    detail: 'Virginia Military Institute — Honor, Duty, Character',
    accent: 'border-brand-red/30 bg-brand-red/5',
  },
  {
    icon: '⭐',
    label: 'Army Reserve 1LT',
    detail: 'TS/SCI Clearance Pending',
    accent: 'border-brand-gold/30 bg-brand-gold/5',
  },
  {
    icon: '🎓',
    label: 'BYU — MS Robotics & CV',
    detail: 'Computer Vision · Multi-Agent Systems',
    accent: 'border-brand-blue-light/30 bg-brand-blue/10',
  },
]

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function Story() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,46,93,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,184,28,0.07) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}
          variants={fadeIn}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-brand-gold mb-3">
            The engineer behind it
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Built by someone with skin in the game.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Photo column */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-6 rounded-3xl -z-10"
              style={{
                background: 'radial-gradient(ellipse, rgba(200,16,46,0.12) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Gradient border frame */}
            <div
              className="p-[2px] rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #C8102E 0%, #FFB81C 45%, #002E5D 100%)',
              }}
            >
              <div className="rounded-[14px] overflow-hidden bg-[#0a0a0a]">
                <img
                  src="/will-vmi.jpg"
                  alt="Will Weigeshoff — VMI Graduate, Army Reserve 1LT"
                  className="w-full h-auto object-cover block"
                  style={{ filter: 'contrast(1.04) brightness(0.97)' }}
                />
              </div>
            </div>

            {/* Live badge */}
            <div
              className="absolute -bottom-5 -right-4 bg-brand-card border border-brand-gold/40 rounded-xl px-4 py-3 shadow-2xl"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,184,28,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold text-white">Atlas running live</span>
              </div>
              <div className="text-[10px] text-gray-500">whoffagents.com · 52d uptime</div>
            </div>
          </motion.div>

          {/* Bio column */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          >
            <blockquote className="text-xl md:text-2xl font-bold text-white leading-snug mb-7">
              "I built Atlas to run my business while I was in grad school.{' '}
              <span className="text-brand-gold">Then I packaged it so you could run yours."</span>
            </blockquote>

            <div className="space-y-4 text-gray-400 leading-relaxed mb-8 text-sm md:text-base">
              <p>
                Will Weigeshoff is a VMI graduate, Army Reserve 1LT, and graduate student in
                Robotics and Computer Vision at BYU. He built the Atlas system while running
                whoffagents.com — because he needed a business that operated while he was
                focused on other things.
              </p>
              <p>
                Atlas now publishes content, handles cold outreach, runs product research, and
                ships code — 14 agents across 2 machines, 52 days of continuous uptime.
              </p>
              <div className="border-l-2 border-brand-red/60 pl-4 py-1">
                <p className="text-gray-300 italic text-sm">
                  No competitor has a military-trained engineer behind their agent framework.
                  VMI instills one thing above all: systems that don't fail when it matters.
                  That's what Atlas was built to be.
                </p>
              </div>
            </div>

            {/* Credential badges */}
            <div className="space-y-2.5">
              {credentials.map((cred) => (
                <div
                  key={cred.label}
                  className={`flex items-center gap-3.5 border rounded-xl px-4 py-3 transition-colors ${cred.accent}`}
                >
                  <span className="text-xl leading-none">{cred.icon}</span>
                  <div>
                    <div className="text-white text-sm font-semibold leading-tight">{cred.label}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{cred.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
