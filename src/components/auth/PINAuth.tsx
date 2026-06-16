import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

interface PINAuthProps {
  onSuccess: () => void
}

const PINAuth: React.FC<PINAuthProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [isSetup, setIsSetup] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkPinExists = async () => {
      try {
        // Check if PIN already exists
        const result = await window.electron.ipcRenderer.invoke('verify-vault-pin', '0000')
        setShowSetup(!result.success)
      } catch (e) {
        setShowSetup(true)
      }
    }
    checkPinExists()
  }, [])

  const handlePinEntry = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit)
    }
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
  }

  const handleVerify = async () => {
    try {
      if (showSetup && !isSetup) {
        // Setup mode
        if (pin.length !== 6) {
          triggerError('PIN must be 6 digits')
          return
        }
        await window.electron.ipcRenderer.invoke('setup-vault-pin', pin)
        setIsSetup(true)
        setPin('')
        triggerSuccess('PIN Setup Complete')
        setTimeout(onSuccess, 800)
      } else if (showSetup && isSetup) {
        // Verify mode after setup
        const result = await window.electron.ipcRenderer.invoke('verify-vault-pin', pin)
        if (result.unlocked) {
          onSuccess()
        } else {
          triggerError('PIN Incorrect')
          setPin('')
        }
      }
    } catch (e) {
      triggerError('Authentication Failed')
    }
  }

  const triggerError = (msg: string) => {
    setError(true)
    if (errorRef.current) {
      gsap.fromTo(errorRef.current, { x: 0 }, { x: 10, yoyo: true, repeat: 5, duration: 0.1 })
    }
    setTimeout(() => setError(false), 3000)
  }

  const triggerSuccess = (msg: string) => {
    // Success animation
  }

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  return (
    <motion.div className="space-y-6">
      {/* Status message */}
      {showSetup && !isSetup ? (
        <div className="text-center text-neural-teal text-sm font-mono mb-6">
          INITIAL SETUP - CREATE 6-DIGIT PIN
        </div>
      ) : showSetup && isSetup ? (
        <div className="text-center text-neural-teal text-sm font-mono mb-6">
          VERIFY PIN
        </div>
      ) : null}

      {/* PIN display */}
      <div
        ref={errorRef}
        className={`flex justify-center gap-2 mb-8 ${
          error ? 'text-red-500' : 'text-neural-cyan'
        }`}
      >
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              className="w-10 h-10 border-2 border-current rounded-lg flex items-center justify-center font-mono font-bold"
              animate={{
                boxShadow: i < pin.length ? '0 0 10px currentColor' : 'none',
              }}
            >
              {i < pin.length ? '●' : ''}
            </motion.div>
          ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3">
        {digits.map((digit) => (
          <motion.button
            key={digit}
            onClick={() => handlePinEntry(digit)}
            className="py-3 bg-neural-darker hover:bg-neural-cyan/20 border border-neural-cyan/30 rounded text-neural-cyan font-bold transition-all"
            whileHover={{ borderColor: 'rgb(56, 189, 248)' }}
            whileTap={{ scale: 0.95 }}
          >
            {digit}
          </motion.button>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleBackspace}
          className="flex-1 py-2 bg-neural-darker hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm font-mono transition-all"
          whileTap={{ scale: 0.95 }}
        >
          BACKSPACE
        </motion.button>
        <motion.button
          onClick={handleVerify}
          disabled={pin.length === 0}
          className="flex-1 py-2 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan font-bold transition-all disabled:opacity-50"
          whileTap={{ scale: 0.95 }}
        >
          {isSetup ? 'CONFIRM' : 'VERIFY'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PINAuth
