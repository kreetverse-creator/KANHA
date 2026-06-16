import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

interface FaceAuthProps {
  onSuccess: () => void
}

const FaceAuth: React.FC<FaceAuthProps> = ({ onSuccess }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanPhase, setScanPhase] = useState<'idle' | 'setup' | 'scanning' | 'verifying'>('idle')
  const [isEnrolled, setIsEnrolled] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Check if face is already enrolled
    const checkEnrollment = async () => {
      try {
        const stored = localStorage.getItem('vault-face-enrolled')
        setIsEnrolled(!!stored)
      } catch (e) {
        setIsEnrolled(false)
      }
    }
    checkEnrollment()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (e) {
      console.error('Camera access denied:', e)
    }
  }

  const handleEnroll = async () => {
    setScanPhase('setup')
    setIsScanning(true)
    await startCamera()

    setTimeout(async () => {
      setScanPhase('scanning')
      // Simulate face capture and enrollment
      setTimeout(async () => {
        try {
          const mockFaceDescriptor = Array(128).fill(0).map(() => Math.random())
          await window.electron.ipcRenderer.invoke('setup-vault-face', mockFaceDescriptor)
          localStorage.setItem('vault-face-enrolled', 'true')
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
      }, 3000)
    }, 1000)
  }

  const handleVerify = async () => {
    setScanPhase('scanning')
    setIsScanning(true)
    await startCamera()

    setTimeout(async () => {
      try {
        const mockFaceDescriptor = Array(128).fill(0).map(() => Math.random())
        const result = await window.electron.ipcRenderer.invoke('verify-vault-face', mockFaceDescriptor)
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
    }, 3000)
  }

  return (
    <motion.div className="space-y-6">
      {/* Camera preview */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neural-darker border border-neural-cyan/20">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Scan overlay */}
        {isScanning && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <motion.div
              className="w-32 h-32 border-2 border-neural-cyan rounded-lg"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(56, 189, 248, 0.3)',
                  '0 0 40px rgba(56, 189, 248, 0.8)',
                  '0 0 20px rgba(56, 189, 248, 0.3)',
                ],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </div>

      {/* Status text */}
      <div className="text-center text-neural-teal text-sm font-mono">
        {scanPhase === 'idle' && 'READY FOR SCAN'}
        {scanPhase === 'setup' && 'POSITIONING FACE...'}
        {scanPhase === 'scanning' && 'SCANNING FACIAL FEATURES...'}
        {scanPhase === 'verifying' && 'VERIFYING IDENTITY...'}
      </div>

      {/* Action button */}
      <motion.button
        onClick={isEnrolled ? handleVerify : handleEnroll}
        disabled={isScanning}
        className="w-full py-3 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan font-bold uppercase tracking-wider transition-all disabled:opacity-50"
        whileTap={{ scale: 0.95 }}
      >
        {isScanning ? 'SCANNING...' : isEnrolled ? 'VERIFY FACE' : 'ENROLL FACE'}
      </motion.button>
    </motion.div>
  )
}

export default FaceAuth
