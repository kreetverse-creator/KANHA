import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import PINAuth from '../components/auth/PINAuth'
import FaceAuth from '../components/auth/FaceAuth'
import FingerprintAuth from '../components/auth/FingerprintAuth'

interface LockScreenProps {
  onAuthenticated: () => void
}

type AuthMethod = 'pin' | 'face' | 'fingerprint'

const LockScreen: React.FC<LockScreenProps> = ({ onAuthenticated }) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('pin')
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (unlocked) {
      setTimeout(onAuthenticated, 800)
    }
  }, [unlocked, onAuthenticated])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full bg-neural-dark flex items-center justify-center relative overflow-hidden"
    >
      {/* Background neural grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Main lock container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <motion.div className="text-center mb-12">
          <h1 className="text-4xl font-black text-neural-cyan mb-2" style={{ fontFamily: 'Orbitron' }}>KANHA</h1>
          <p className="text-neural-teal font-mono text-sm tracking-wider">VAULT AUTHENTICATION REQUIRED</p>
        </motion.div>

        {/* Auth method selector */}
        <div className="flex gap-3 mb-8 justify-center">
          {(['pin', 'face', 'fingerprint'] as AuthMethod[]).map((method) => (
            <motion.button
              key={method}
              onClick={() => setAuthMethod(method)}
              className={`px-6 py-2 font-mono text-sm uppercase tracking-wider rounded border transition-all ${
                authMethod === method
                  ? 'bg-neural-cyan/20 border-neural-cyan text-neural-cyan'
                  : 'bg-neural-darker border-neural-cyan/30 text-neural-cyan/60 hover:border-neural-cyan/60'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {method === 'pin' && '🔢 PIN'}
              {method === 'face' && '👤 FACE'}
              {method === 'fingerprint' && '👆 PRINT'}
            </motion.button>
          ))}
        </div>

        {/* Auth component */}
        <motion.div
          key={authMethod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {authMethod === 'pin' && (
            <PINAuth onSuccess={() => setUnlocked(true)} />
          )}
          {authMethod === 'face' && (
            <FaceAuth onSuccess={() => setUnlocked(true)} />
          )}
          {authMethod === 'fingerprint' && (
            <FingerprintAuth onSuccess={() => setUnlocked(true)} />
          )}
        </motion.div>
      </motion.div>

      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none scan-lines" />
    </motion.div>
  )
}

export default LockScreen
