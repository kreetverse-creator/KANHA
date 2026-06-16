import { BrowserWindow, ipcMain, safeStorage } from 'electron'
import Store from 'electron-store'
import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'
import { getSystemStats, getBatteryStatus, getNetworkStatus } from './system-monitor'

const store = new Store()
const ENCRYPTION_SALT = 10

export function setupIPC(mainWindow: BrowserWindow) {
  // ===== SECURITY: Key Management =====
  ipcMain.handle('secure-save-keys', async (event, keyData: Record<string, string>) => {
    try {
      const encrypted = safeStorage.encryptString(JSON.stringify(keyData))
      store.set('encrypted-keys', encrypted.toString('base64'))
      return { success: true }
    } catch (error) {
      console.error('Key save error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('secure-get-keys', async () => {
    try {
      const encrypted = store.get('encrypted-keys') as string
      if (!encrypted) return { success: false, error: 'No keys stored' }
      const decrypted = safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
      return { success: true, keys: JSON.parse(decrypted) }
    } catch (error) {
      console.error('Key retrieval error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // ===== VAULT: PIN Authentication =====
  ipcMain.handle('setup-vault-pin', async (event, pin: string) => {
    try {
      const hashed = await bcrypt.hash(pin, ENCRYPTION_SALT)
      store.set('vault-pin', hashed)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('verify-vault-pin', async (event, pin: string) => {
    try {
      const hashed = store.get('vault-pin') as string
      if (!hashed) return { success: false, error: 'PIN not set' }
      const match = await bcrypt.compare(pin, hashed)
      return { success: match, unlocked: match }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // ===== VAULT: Face Authentication =====
  ipcMain.handle('setup-vault-face', async (event, faceDescriptor: any) => {
    try {
      store.set('vault-face', JSON.stringify(faceDescriptor))
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('verify-vault-face', async (event, faceDescriptor: any) => {
    try {
      const stored = store.get('vault-face') as string
      if (!stored) return { success: false, error: 'Face not enrolled' }
      const storedDesc = JSON.parse(stored)
      // Simple Euclidean distance comparison (production should use ML-based matching)
      const distance = calculateEuclideanDistance(faceDescriptor, storedDesc)
      const match = distance < 0.6 // Threshold for face match
      return { success: match, distance, unlocked: match }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // ===== VAULT: Fingerprint Authentication =====
  ipcMain.handle('setup-vault-fingerprint', async (event, fingerprintTemplate: any) => {
    try {
      store.set('vault-fingerprint', JSON.stringify(fingerprintTemplate))
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('verify-vault-fingerprint', async (event, fingerprintScan: any) => {
    try {
      const stored = store.get('vault-fingerprint') as string
      if (!stored) return { success: false, error: 'Fingerprint not enrolled' }
      const storedTemplate = JSON.parse(stored)
      // Mock fingerprint matching (production uses biometric SDK)
      const match = calculateFingerprintMatch(fingerprintScan, storedTemplate) > 0.85
      return { success: match, unlocked: match }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // ===== SYSTEM TELEMETRY =====
  ipcMain.handle('get-system-stats', async () => {
    return getSystemStats()
  })

  ipcMain.handle('get-battery-status', async () => {
    return getBatteryStatus()
  })

  ipcMain.handle('get-network-status', async () => {
    return getNetworkStatus()
  })

  // ===== HARDWARE PERMISSIONS =====
  ipcMain.handle('get-hardware-permissions', async () => {
    return {
      microphone: store.get('perm-microphone', true),
      camera: store.get('perm-camera', false),
      screen: store.get('perm-screen', false),
      location: store.get('perm-location', false),
      notifications: store.get('perm-notifications', true),
      filesystem: store.get('perm-filesystem', true),
      terminal: store.get('perm-terminal', false),
      android: store.get('perm-android', true),
    }
  })

  ipcMain.handle('set-hardware-permission', async (event, permName: string, value: boolean) => {
    try {
      store.set(`perm-${permName}`, value)
      mainWindow.webContents.send('hardware-permission-changed', { permName, value })
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // ===== NOTES =====
  ipcMain.handle('save-note', async (event, note: { id?: string; title: string; content: string; timestamp: number }) => {
    try {
      const notes = (store.get('notes', []) as any[]) || []
      const id = note.id || Date.now().toString()
      const index = notes.findIndex(n => n.id === id)
      if (index > -1) {
        notes[index] = { ...note, id }
      } else {
        notes.push({ ...note, id })
      }
      store.set('notes', notes)
      return { success: true, id }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('get-notes', async () => {
    try {
      const notes = (store.get('notes', []) as any[]) || []
      return { success: true, notes }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('delete-note', async (event, noteId: string) => {
    try {
      let notes = (store.get('notes', []) as any[]) || []
      notes = notes.filter(n => n.id !== noteId)
      store.set('notes', notes)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // ===== FILE OPERATIONS =====
  ipcMain.handle('read-file', async (event, filePath: string) => {
    try {
      const perms = await new Promise((resolve) => {
        ipcMain.handleOnce('get-hardware-permissions', async () => resolve(await ipcMain.handle('get-hardware-permissions', new Event('get'))))
      })
      const content = fs.readFileSync(filePath, 'utf-8')
      return { success: true, content }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('write-file', async (event, filePath: string, content: string) => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8')
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('read-directory', async (event, dirPath: string) => {
    try {
      const files = fs.readdirSync(dirPath)
      return { success: true, files }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('take-screenshot', async () => {
    try {
      const { nativeImage } = require('electron')
      const image = await mainWindow.webContents.capturePage()
      const png = image.toPNG()
      return { success: true, data: png.toString('base64') }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })
}

function calculateEuclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0))
}

function calculateFingerprintMatch(scan: any, template: any): number {
  // Mock fingerprint scoring
  return Math.random() * 0.2 + 0.85
}
