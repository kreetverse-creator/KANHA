import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

interface BootScreenProps {
  onBootComplete: () => void
}

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [bootPhase, setBootPhase] = useState(0)
  const [greeting, setGreeting] = useState('INITIALIZING KANHA NEURAL CORE')

  const bootMessages = [
    'INITIALIZING KANHA NEURAL CORE',
    'SYNCING HARDWARE MATRIX',
    'SCANNING LOCAL SYSTEM TELEMETRY',
    'VOICE UPLINK READY',
    'NEURAL PATHWAYS ACTIVE',
    'BOOT SEQUENCE COMPLETE',
  ]

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'GOOD MORNING'
      if (hour < 17) return 'GOOD AFTERNOON'
      if (hour < 21) return 'GOOD EVENING'
      return 'GOOD NIGHT'
    }

    // Animate boot sequence
    const bootInterval = setInterval(() => {
      setBootPhase((prev) => {
        if (prev < bootMessages.length - 1) {
          setGreeting(bootMessages[prev + 1])
          return prev + 1
        } else {
          clearInterval(bootInterval)
          setTimeout(() => {
            setGreeting(getTimeBasedGreeting())
            setTimeout(onBootComplete, 1500)
          }, 500)
          return prev
        }
      })
    }, 800)

    return () => clearInterval(bootInterval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full bg-neural-dark flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated background orb */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <motion.div
          className="w-96 h-96 rounded-full bg-gradient-to-br from-neural-cyan to-neural-teal blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Boot content */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center space-y-12"
      >
        {/* KANHA Logo/Title */}
        <motion.div
          animate={{
            textShadow: [
              '0 0 20px rgba(56, 189, 248, 0.5)',
              '0 0 40px rgba(56, 189, 248, 0.8)',
              '0 0 20px rgba(56, 189, 248, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl font-black tracking-widest"
          style={{
            fontFamily: 'Orbitron, monospace',
            color: '#38bdf8',
            letterSpacing: '0.2em',
          }}
        >
          K A N H A
        </motion.div>

        {/* Boot message */}
        <motion.div
          key={greeting}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-mono tracking-widest text-neural-cyan"
        >
          {greeting}
        </motion.div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2">
          {bootMessages.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor: i <= bootPhase ? '#38bdf8' : '#041b2d',
                boxShadow: i <= bootPhase ? '0 0 10px rgba(56, 189, 248, 0.8)' : 'none',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none scan-lines" />
    </motion.div>
  )
}

export default BootScreen
