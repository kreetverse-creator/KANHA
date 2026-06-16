import React from 'react'
import { motion } from 'framer-motion'

interface DashboardNavProps {
  activeTab: string
  onTabChange: (tab: any) => void
}

const DashboardNav: React.FC<DashboardNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'phone', label: 'Phone Control', icon: '📱' },
    { id: 'hardware', label: 'Hardware', icon: '⚙️' },
    { id: 'settings', label: 'Settings', icon: '🔧' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-48 border-r border-neural-cyan/20 bg-neural-darker/50 backdrop-blur-xl p-4 space-y-2"
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full px-4 py-3 rounded-lg text-left font-mono text-sm transition-all ${
            activeTab === tab.id
              ? 'bg-neural-cyan/20 border border-neural-cyan text-neural-cyan'
              : 'text-neural-teal/70 hover:bg-neural-cyan/10 border border-transparent'
          }`}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </motion.button>
      ))}
    </motion.nav>
  )
}

export default DashboardNav
