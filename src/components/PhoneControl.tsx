import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PhoneControl: React.FC = () => {
  const [devices, setDevices] = useState<any[]>([])
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [connectIP, setConnectIP] = useState('')
  const [connectPort, setConnectPort] = useState('5555')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!connectIP) return
    setIsConnecting(true)

    try {
      const result = await window.electron.ipcRenderer.invoke('adb-connect-wifi', connectIP, parseInt(connectPort))
      if (result.success) {
        const telemetry = await window.electron.ipcRenderer.invoke('adb-telemetry', connectIP)
        if (telemetry.success) {
          const device = { ip: connectIP, port: connectPort, ...telemetry.device }
          setDevices([...devices, device])
          setSelectedDevice(device)
          setConnectIP('')
          setConnectPort('5555')
        }
      }
    } catch (e) {
      console.error('Connection failed:', e)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!selectedDevice) return
    try {
      await window.electron.ipcRenderer.invoke('adb-disconnect', selectedDevice.ip)
      setDevices(devices.filter(d => d.ip !== selectedDevice.ip))
      setSelectedDevice(null)
    } catch (e) {
      console.error('Disconnect failed:', e)
    }
  }

  const handleOpenApp = async (packageName: string) => {
    if (!selectedDevice) return
    try {
      await window.electron.ipcRenderer.invoke('adb-open-app', selectedDevice.ip, packageName)
    } catch (e) {
      console.error('Failed to open app:', e)
    }
  }

  const handleTap = async (x: number, y: number) => {
    if (!selectedDevice) return
    try {
      await window.electron.ipcRenderer.invoke('adb-tap', selectedDevice.ip, x, y)
    } catch (e) {
      console.error('Tap failed:', e)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <h2 className="text-2xl font-bold text-neural-cyan uppercase" style={{ fontFamily: 'Orbitron' }}>PHONE CONTROL</h2>

      {/* Connection panel */}
      <motion.div className="glass-panel p-6 rounded-lg space-y-4">
        <h3 className="text-neural-cyan font-bold uppercase">CONNECT DEVICE</h3>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Device IP"
            value={connectIP}
            onChange={(e) => setConnectIP(e.target.value)}
            className="px-4 py-2 bg-neural-darker border border-neural-cyan/30 rounded text-neural-cyan placeholder-neural-teal/50 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Port"
            value={connectPort}
            onChange={(e) => setConnectPort(e.target.value)}
            className="px-4 py-2 bg-neural-darker border border-neural-cyan/30 rounded text-neural-cyan placeholder-neural-teal/50 focus:outline-none"
          />
          <motion.button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-6 py-2 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan font-bold uppercase disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
          >
            {isConnecting ? 'CONNECTING...' : 'CONNECT'}
          </motion.button>
        </div>
      </motion.div>

      {/* Connected devices */}
      {devices.length > 0 && (
        <motion.div className="glass-panel p-6 rounded-lg space-y-4">
          <h3 className="text-neural-cyan font-bold uppercase">CONNECTED DEVICES</h3>
          <div className="space-y-3">
            {devices.map((device) => (
              <motion.div
                key={device.ip}
                onClick={() => setSelectedDevice(device)}
                className={`p-4 rounded border cursor-pointer transition-all ${
                  selectedDevice?.ip === device.ip
                    ? 'bg-neural-cyan/20 border-neural-cyan'
                    : 'bg-neural-darker/50 border-neural-cyan/20 hover:border-neural-cyan'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-neural-cyan font-bold">{device.model}</div>
                    <div className="text-neural-teal/70 text-sm font-mono">{device.ip}:{device.port}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-neural-cyan text-sm">{device.battery}%</div>
                    <div className="text-neural-teal/50 text-xs">{device.isCharging ? 'Charging' : 'Battery'}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Device controls */}
      {selectedDevice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-lg space-y-6"
        >
          <h3 className="text-neural-cyan font-bold uppercase">DEVICE CONTROLS</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => handleOpenApp('com.google.android.youtube')}
              className="px-4 py-3 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan font-bold uppercase text-sm"
              whileTap={{ scale: 0.95 }}
            >
              Open YouTube
            </motion.button>
            <motion.button
              onClick={() => handleOpenApp('com.android.chrome')}
              className="px-4 py-3 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan font-bold uppercase text-sm"
              whileTap={{ scale: 0.95 }}
            >
              Open Chrome
            </motion.button>
            <motion.button
              onClick={handleDisconnect}
              className="col-span-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded text-red-400 font-bold uppercase"
              whileTap={{ scale: 0.95 }}
            >
              DISCONNECT
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PhoneControl
