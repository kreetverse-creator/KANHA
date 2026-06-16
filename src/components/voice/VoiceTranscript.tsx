import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const VoiceTranscript: React.FC = () => {
  const [transcript, setTranscript] = useState<string[]>([])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-lg h-96 flex flex-col"
    >
      <h3 className="text-neural-cyan font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Orbitron' }}>TRANSCRIPT</h3>
      <div className="flex-1 overflow-y-auto space-y-2 text-sm font-mono">
        {transcript.length === 0 ? (
          <div className="text-neural-teal/50 text-xs">Awaiting voice input...</div>
        ) : (
          transcript.map((line, i) => (
            <div key={i} className="text-neural-teal/80">{line}</div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default VoiceTranscript
