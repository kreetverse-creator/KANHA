import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => {
      // Whitelist allowed channels
      const allowedChannels = [
        'secure-save-keys',
        'secure-get-keys',
        'get-system-stats',
        'get-battery-status',
        'get-network-status',
        'get-hardware-permissions',
        'set-hardware-permission',
        'setup-vault-pin',
        'verify-vault-pin',
        'setup-vault-face',
        'verify-vault-face',
        'setup-vault-fingerprint',
        'verify-vault-fingerprint',
        'wake-word-detected',
        'voice-state-change',
        'adb-connect-wifi',
        'adb-disconnect',
        'adb-telemetry',
        'adb-screenshot',
        'adb-open-app',
        'adb-close-app',
        'adb-tap',
        'adb-swipe',
        'adb-push-file',
        'adb-pull-file',
        'adb-get-notifications',
        'read-file',
        'write-file',
        'read-directory',
        'file-ops',
        'save-note',
        'get-notes',
        'delete-note',
        'run-shell-command',
        'take-screenshot',
      ]

      if (!allowedChannels.includes(channel)) {
        throw new Error(`IPC channel "${channel}" is not allowed`)
      }

      return ipcRenderer.invoke(channel, ...args)
    },
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => {
      const allowedChannels = ['voice-state-change', 'wake-word-detected']
      if (!allowedChannels.includes(channel)) {
        throw new Error(`IPC channel "${channel}" is not allowed for listening`)
      }
      ipcRenderer.on(channel, listener)
    },
  },
}

contextBridge.exposeInMainWorld('electron', electronAPI)

declare global {
  interface Window {
    electron: typeof electronAPI
  }
}
