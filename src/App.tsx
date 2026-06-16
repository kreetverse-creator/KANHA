import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import BootScreen from './screens/BootScreen'
import LockScreen from './screens/LockScreen'
import Dashboard from './screens/Dashboard'
import './App.css'

type AppState = 'boot' | 'lock' | 'authenticated'

function App() {
  const [appState, setAppState] = useState<AppState>('boot')
  const [isFirstBoot, setIsFirstBoot] = useState(true)

  useEffect(() => {
    // Check if user has completed initial setup
    const hasPin = localStorage.getItem('vault-pin-set')
    if (!hasPin && isFirstBoot) {
      setAppState('boot')
    }
  }, [])

  const handleBootComplete = () => {
    setAppState('lock')
    setIsFirstBoot(false)
  }

  const handleAuthenticated = () => {
    setAppState('authenticated')
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-neural-dark">
      <AnimatePresence mode="wait">
        {appState === 'boot' && (
          <BootScreen key="boot" onBootComplete={handleBootComplete} />
        )}
        {appState === 'lock' && (
          <LockScreen key="lock" onAuthenticated={handleAuthenticated} />
        )}
        {appState === 'authenticated' && (
          <Dashboard key="dashboard" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
