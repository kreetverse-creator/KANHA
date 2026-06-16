import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardNav from '../components/DashboardNav'
import VoiceVisualization from '../components/voice/VoiceVisualization'
import SystemTelemetry from '../components/SystemTelemetry'
import VoiceTranscript from '../components/voice/VoiceTranscript'
import Notes from '../components/Notes'
import PhoneControl from '../components/PhoneControl'
import Hardware from '../components/Hardware'
import Settings from '../components/Settings'

type DashboardTab = 'dashboard' | 'notes' | 'phone' | 'hardware' | 'settings'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard')
  const [voiceState, setVoiceState] = useState<'sleeping' | 'wake-detected' | 'listening' | 'thinking' | 'speaking'>('sleeping')

  useEffect(() => {
    // Listen for voice state updates
    const handleVoiceStateChange = (event: any) => {
      setVoiceState(event.detail?.state || 'sleeping')
    }

    window.addEventListener('voice-state-changed', handleVoiceStateChange)
    return () => window.removeEventListener('voice-state-changed', handleVoiceStateChange)
  }, [])

  return (
    <div className="w-full h-full bg-neural-dark overflow-hidden flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-neural-cyan/20 bg-neural-darker/50 backdrop-blur-xl px-8 py-4"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-neural-cyan" style={{ fontFamily: 'Orbitron' }}>KANHA</h1>
          <div className="text-sm font-mono text-neural-teal/80">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation */}
        <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content area */}
        <div className="flex-1 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {activeTab === 'dashboard' && (
              <div className="p-8 space-y-8">
                {/* Voice visualization */}
                <div className="glass-panel p-8 rounded-2xl">
                  <VoiceVisualization state={voiceState} />
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-3 gap-8">
                  {/* Telemetry */}
                  <div className="col-span-2">
                    <SystemTelemetry />
                  </div>

                  {/* Transcript */}
                  <div>
                    <VoiceTranscript />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && <Notes />}
            {activeTab === 'phone' && <PhoneControl />}
            {activeTab === 'hardware' && <Hardware />}
            {activeTab === 'settings' && <Settings />}
          </motion.div>
        </div>
      </div>

      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none scan-lines" />
    </div>
  )
}

export default Dashboard
