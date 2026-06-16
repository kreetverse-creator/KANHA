import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const SystemTelemetry: React.FC = () => {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await window.electron.ipcRenderer.invoke('get-system-stats')
        setStats(result)
      } catch (error) {
        console.error('Failed to fetch system stats:', error)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return null

  const TelemetryCard = ({ label, value, unit, max = 100 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-lg"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-neural-teal/70 font-mono text-xs uppercase tracking-wider">{label}</span>
        <span className="text-neural-cyan font-bold text-lg">{value}{unit}</span>
      </div>
      <div className="w-full h-2 bg-neural-darker/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neural-teal to-neural-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )

  return (
    <div className="glass-panel p-8 rounded-2xl space-y-6">
      <h2 className="text-xl font-bold text-neural-cyan uppercase tracking-wider" style={{ fontFamily: 'Orbitron' }}>SYSTEM TELEMETRY</h2>
      <div className="grid grid-cols-2 gap-6">
        <TelemetryCard
          label="CPU Usage"
          value={stats.cpu}
          unit="%"
          max={100}
        />
        <TelemetryCard
          label="Memory"
          value={Math.round(stats.memory.percentage)}
          unit="%"
          max={100}
        />
        <div className="glass-panel p-6 rounded-lg">
          <div className="text-neural-teal/70 font-mono text-xs uppercase tracking-wider mb-2">Platform</div>
          <div className="text-neural-cyan font-mono text-sm">{stats.platform.toUpperCase()}</div>
        </div>
        <div className="glass-panel p-6 rounded-lg">
          <div className="text-neural-teal/70 font-mono text-xs uppercase tracking-wider mb-2">Architecture</div>
          <div className="text-neural-cyan font-mono text-sm">{stats.arch.toUpperCase()}</div>
        </div>
      </div>
    </div>
  )
}

export default SystemTelemetry
