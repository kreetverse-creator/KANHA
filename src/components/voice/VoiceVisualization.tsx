import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

interface VoiceVisualizationProps {
  state: 'sleeping' | 'wake-detected' | 'listening' | 'thinking' | 'speaking'
}

const ParticleSystem: React.FC<{ state: VoiceVisualizationProps['state'] }> = ({ state }) => {
  const pointsRef = useRef<any>(null)
  const particlesRef = useRef<THREE.Points>(null)

  useEffect(() => {
    if (!particlesRef.current) return

    const particles = particlesRef.current
    const positionAttribute = particles.geometry.getAttribute('position')

    if (state === 'sleeping') {
      // Slow pulsing blue waves
      const positions = positionAttribute.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        const x = (Math.random() - 0.5) * 4
        const y = (Math.random() - 0.5) * 4
        const z = (Math.random() - 0.5) * 4
        positions[i] = x
        positions[i + 1] = y
        positions[i + 2] = z
      }
      positionAttribute.needsUpdate = true
    }
  }, [state])

  useFrame(() => {
    if (!particlesRef.current) return

    particlesRef.current.rotation.x += 0.0005
    particlesRef.current.rotation.y += 0.001

    const positions = particlesRef.current.geometry.getAttribute('position').array as Float32Array

    if (state === 'listening' || state === 'speaking') {
      // Expand rings
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]
        const dist = Math.sqrt(x * x + y * y + z * z)
        if (dist > 0) {
          const scale = 1 + Math.sin(Date.now() * 0.001 + dist) * 0.3
          positions[i] = (x / dist) * scale
          positions[i + 1] = (y / dist) * scale
          positions[i + 2] = (z / dist) * scale
        }
      }
      particlesRef.current.geometry.getAttribute('position').needsUpdate = true
    }
  })

  const positions = new Float32Array(
    Array.from({ length: 1000 }, () => (
      [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4]
    )).flat()
  )

  const colors = new Float32Array(
    Array.from({ length: 1000 }, () => {
      if (state === 'speaking') return [1, 0.6, 0.2] // Sea blue to orange
      if (state === 'listening') return [0.2, 0.8, 1] // Cyan
      return [0.2, 0.5, 0.8] // Dark blue
    }).flat()
  )

  return (
    <Points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1000} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={1000} array={colors} itemSize={3} />
      </bufferGeometry>
      <PointMaterial size={0.1} vertexColors transparent sizeAttenuation depthWrite={false} />
    </Points>
  )
}

const VoiceVisualization: React.FC<VoiceVisualizationProps> = ({ state }) => {
  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={['#020817']} />
        <ParticleSystem state={state} />
      </Canvas>

      {/* State indicator overlay */}
      <motion.div
        className="absolute bottom-4 left-4 font-mono text-sm uppercase tracking-wider"
        animate={{
          textShadow: state === 'speaking' ? '0 0 20px rgba(56, 189, 248, 0.8)' : '0 0 10px rgba(20, 184, 166, 0.5)',
        }}
      >
        <span className={${
          state === 'sleeping' ? 'text-neural-teal' :
          state === 'wake-detected' ? 'text-yellow-400' :
          state === 'listening' ? 'text-neural-cyan' :
          state === 'thinking' ? 'text-purple-400' :
          'text-orange-400'
        }}>
          {state.toUpperCase()}
        </span>
      </motion.div>
    </div>
  )
}

export default VoiceVisualization
