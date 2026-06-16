import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    wakeWord: 'Hey Kanha',
    userName: 'User',
    personality: 'professional',
    voiceProfile: 'default',
  })
  const [apiKeys, setApiKeys] = useState<any>({})
  const [showApiKeyInput, setShowApiKeyInput] = useState('')

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
    localStorage.setItem(`setting-${key}`, JSON.stringify(value))
  }

  const handleSaveApiKey = async (keyName: string, keyValue: string) => {
    try {
      const newKeys = { ...apiKeys, [keyName]: keyValue }
      await window.electron.ipcRenderer.invoke('secure-save-keys', newKeys)
      setApiKeys(newKeys)
      setShowApiKeyInput('')
    } catch (e) {
      console.error('Failed to save API key:', e)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <h2 className="text-2xl font-bold text-neural-cyan uppercase" style={{ fontFamily: 'Orbitron' }}>SETTINGS</h2>

      {/* Voice & Identity */}
      <motion.div className="glass-panel p-6 rounded-lg space-y-4">
        <h3 className="text-neural-cyan font-bold uppercase tracking-wider">VOICE & IDENTITY</h3>
        <div className="space-y-4">
          <div>
            <label className="text-neural-teal/70 text-sm uppercase tracking-wider block mb-2">Wake Word</label>
            <input
              type="text"
              value={settings.wakeWord}
              onChange={(e) => handleSettingChange('wakeWord', e.target.value)}
              className="w-full px-4 py-2 bg-neural-darker border border-neural-cyan/30 rounded text-neural-cyan placeholder-neural-teal/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-neural-teal/70 text-sm uppercase tracking-wider block mb-2">User Name</label>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => handleSettingChange('userName', e.target.value)}
              className="w-full px-4 py-2 bg-neural-darker border border-neural-cyan/30 rounded text-neural-cyan placeholder-neural-teal/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-neural-teal/70 text-sm uppercase tracking-wider block mb-2">Personality</label>
            <select
              value={settings.personality}
              onChange={(e) => handleSettingChange('personality', e.target.value)}
              className="w-full px-4 py-2 bg-neural-darker border border-neural-cyan/30 rounded text-neural-cyan focus:outline-none"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* API Keys */}
      <motion.div className="glass-panel p-6 rounded-lg space-y-4">
        <h3 className="text-neural-cyan font-bold uppercase tracking-wider">API KEYS (ENCRYPTED)</h3>
        <motion.button
          onClick={() => setShowApiKeyInput('gemini')}
          className="w-full px-4 py-3 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan font-bold uppercase"
          whileTap={{ scale: 0.95 }}
        >
          Add Gemini API Key
        </motion.button>
        {showApiKeyInput === 'gemini' && (
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Enter Gemini API Key"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveApiKey('gemini', (e.target as HTMLInputElement).value)
                }
              }}
              className="w-full px-4 py-2 bg-neural-darker border border-neural-cyan/30 rounded text-neural-cyan placeholder-neural-teal/50 focus:outline-none"
            />
          </div>
        )}
      </motion.div>

      {/* About */}
      <motion.div className="glass-panel p-6 rounded-lg space-y-4">
        <h3 className="text-neural-cyan font-bold uppercase tracking-wider">ABOUT</h3>
        <div className="space-y-2 text-neural-teal/70 font-mono text-sm">
          <div>KANHA Neural OS v1.0.0</div>
          <div>Electron + React + TypeScript</div>
          <div>Deep Sea Neural Architecture</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Settings
