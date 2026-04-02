import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating red blob */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200, 16, 46, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '-10%',
          left: '-10%',
        }}
        animate={{
          x: [0, 120, 60, 0],
          y: [0, 80, 160, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Floating gold blob */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 184, 28, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: '-5%',
          right: '-5%',
        }}
        animate={{
          x: [0, -100, -50, 0],
          y: [0, -60, -120, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Smaller blue accent blob */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 46, 93, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '40%',
          right: '20%',
        }}
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 60, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
