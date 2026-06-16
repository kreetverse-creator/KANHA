import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Hardware: React.FC = () => {
  const [permissions, setPermissions] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-hardware-permissions')
      setPermissions(result)
      setLoading(false)
    } catch (e) {
      console.error('Failed to fetch permissions:', e)
      setLoading(false)
    }
  }

  const handleTogglePermission = async (permName: string) => {
    try {
      const newValue = !permissions[permName]
      await window.electron.ipcRenderer.invoke('set-hardware-permission', permName, newValue)
      setPermissions({ ...permissions, [permName]: newValue })
    } catch (e) {
      console.error('Failed to update permission:', e)
    }
  }

  const permissionItems = [
    { key: 'microphone', label: 'Microphone', icon: '🎤' },
    { key: 'camera', label: 'Camera', icon: '📷' },
    { key: 'screen', label: 'Screen Capture', icon: '📺' },
    { key: 'location', label: 'Location', icon: '📍' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'filesystem', label: 'File System', icon: '📁' },
    { key: 'terminal', label: 'Terminal Access', icon: '⌨️' },
    { key: 'android', label: 'Android Control', icon: '📱' },
  ]

  if (loading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <h2 className="text-2xl font-bold text-neural-cyan uppercase" style={{ fontFamily: 'Orbitron' }}>HARDWARE ACCESS</h2>

      <motion.div className="glass-panel p-6 rounded-lg space-y-4">
        <p className="text-neural-teal/70 text-sm font-mono mb-6">
          Control which hardware resources KANHA can access
        </p>
        <div className="grid grid-cols-2 gap-6">
          {permissionItems.map((item) => (
            <motion.div
              key={item.key}
              className="flex items-center justify-between p-4 bg-neural-darker/50 rounded border border-neural-cyan/20 hover:border-neural-cyan/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-neural-cyan font-mono text-sm">{item.label}</span>
              </div>
              <motion.button
                onClick={() => handleTogglePermission(item.key)}
                className={`w-12 h-6 rounded-full transition-all ${
                  permissions[item.key]
                    ? 'bg-neural-cyan/40'
                    : 'bg-neural-cyan/10'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-neural-cyan"
                  animate={{
                    x: permissions[item.key] ? 24 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Hardware
