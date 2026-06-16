import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

interface FingerprintAuthProps {
  onSuccess: () => void
}

const FingerprintAuth: React.FC<FingerprintAuthProps> = ({ onSuccess }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanPhase, setScanPhase] = useState<'idle' | 'setup' | 'scanning' | 'verifying'>('idle')
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const scanCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const checkEnrollment = async () => {
      const enrolled = localStorage.getItem('vault-fingerprint-enrolled')
      setIsEnrolled(!!enrolled)
    }
    checkEnrollment()
  }, [])

  const drawFingerprint = (canvas: HTMLCanvasElement, intensity: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = `rgba(56, 189, 248, ${0.3 + intensity * 0.4})`

    // Draw mock fingerprint lines
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const angle = Math.random() * Math.PI
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillRect(-3, -15 - intensity * 10, 6, 30 + intensity * 20)
      ctx.restore()
    }
  }

  const handleEnroll = async () => {
    setScanPhase('setup')
    setIsScanning(true)

    // Multi-pass enrollment
    for (let pass = 0; pass < 3; pass++) {
      setScanCount(pass + 1)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (scanCanvasRef.current) {
        drawFingerprint(scanCanvasRef.current, (pass + 1) / 3)
      }

      setScanPhase('scanning')
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    try {
      const mockTemplate = {
        points: Array(20).fill(0).map(() => ({ x: Math.random() * 256, y: Math.random() * 256 })),
        quality: 0.92,
        timestamp: Date.now(),
      }
      await window.electron.ipcRenderer.invoke('setup-vault-fingerprint', mockTemplate)
      localStorage.setItem('vault-fingerprint-enrolled', 'true')
      setScanPhase('verifying')
      setTimeout(() => {
        setIsScanning(false)
        setIsEnrolled(true)
        onSuccess()
      }, 800)
    } catch (e) {
      console.error('Enrollment failed:', e)
      setScanPhase('idle')
      setIsScanning(false)
    }
  }

  const handleVerify = async () => {
    setScanPhase('scanning')
    setIsScanning(true)

    // Single scan for verification
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (scanCanvasRef.current) {
      drawFingerprint(scanCanvasRef.current, 1)
    }

    try {
      const mockScan = {
        points: Array(20).fill(0).map(() => ({ x: Math.random() * 256, y: Math.random() * 256 })),
        quality: 0.88,
      }
      const result = await window.electron.ipcRenderer.invoke('verify-vault-fingerprint', mockScan)
      setScanPhase('verifying')
      setTimeout(() => {
        setIsScanning(false)
        if (result.unlocked) {
          onSuccess()
        } else {
          setScanPhase('idle')
        }
      }, 800)
    } catch (e) {
      console.error('Verification failed:', e)
      setScanPhase('idle')
      setIsScanning(false)
    }
  }

  return (
    <motion.div className="space-y-6">
      {/* Fingerprint scanner visualization */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden bg-neural-darker border border-neural-cyan/20 flex items-center justify-center">
        <canvas
          ref={scanCanvasRef}
          width={256}
          height={256}
          className="w-full h-full"
        />

        {/* Scan rings */}
        {isScanning && (
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute border-2 border-neural-cyan rounded-full"
                  animate={{
                    width: ['0px', '150px'],
                    height: ['0px', '150px'],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
          </motion.div>
        )}
      </div>

      {/* Status text */}
      <div className="text-center space-y-2">
        <div className="text-neural-teal text-sm font-mono">
          {scanPhase === 'idle' && 'READY FOR SCAN'}
          {scanPhase === 'setup' && `SCAN ${scanCount}/3`}
          {scanPhase === 'scanning' && 'SCANNING FINGERPRINT...'}
          {scanPhase === 'verifying' && 'VERIFYING MATCH...'}
        </div>
        {isEnrolled && !isScanning && (
          <div className="text-neural-cyan text-xs font-mono text-opacity-70">
            Enrolled on {new Date(localStorage.getItem('vault-fingerprint-date') || Date.now()).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Action button */}
      <motion.button
        onClick={isEnrolled ? handleVerify : handleEnroll}
        disabled={isScanning}
        className="w-full py-3 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan font-bold uppercase tracking-wider transition-all disabled:opacity-50"
        whileTap={{ scale: 0.95 }}
      >
        {isScanning ? `SCANNING...` : isEnrolled ? 'VERIFY FINGERPRINT' : 'ENROLL FINGERPRINT'}
      </motion.button>
    </motion.div>
  )
}

export default FingerprintAuth
