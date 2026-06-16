import { execSync } from 'child_process'
import { BrowserWindow, ipcMain } from 'electron'

let connectedDevices: Map<string, any> = new Map()

export function initializeADB() {
  // ADB initialization
  try {
    execSync('adb start-server')
  } catch (e) {
    console.error('ADB not available:', e)
  }
}

export function setupADBIPC(mainWindow: BrowserWindow) {
  // ===== ADB: Connection =====
  ipcMain.handle('adb-connect-wifi', async (event, ip: string, port: number = 5555) => {
    try {
      const result = execSync(`adb connect ${ip}:${port}`, { encoding: 'utf-8' })
      connectedDevices.set(ip, { ip, port, connected: true })
      return { success: true, message: result }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-disconnect', async (event, ip: string) => {
    try {
      execSync(`adb disconnect ${ip}`)
      connectedDevices.delete(ip)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-telemetry', async (event, ip: string) => {
    try {
      const model = execSync(`adb -s ${ip} shell getprop ro.product.model`, { encoding: 'utf-8' }).trim()
      const battery = execSync(`adb -s ${ip} shell dumpsys battery`, { encoding: 'utf-8' })
      const batteryLevel = parseInt(battery.match(/level: (\d+)/)?.[1] || '0')
      const isCharging = battery.includes('state: Charging')
      return {
        success: true,
        device: {
          model,
          battery: batteryLevel,
          isCharging,
          connected: true,
        },
      }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-screenshot', async (event, ip: string) => {
    try {
      const screenshotPath = '/sdcard/kanha_screenshot.png'
      execSync(`adb -s ${ip} shell screencap -p ${screenshotPath}`)
      const result = execSync(`adb -s ${ip} pull ${screenshotPath}`, { encoding: 'utf-8' })
      return { success: true, path: screenshotPath }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-open-app', async (event, ip: string, packageName: string) => {
    try {
      execSync(`adb -s ${ip} shell monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-close-app', async (event, ip: string, packageName: string) => {
    try {
      execSync(`adb -s ${ip} shell am force-stop ${packageName}`)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-tap', async (event, ip: string, x: number, y: number) => {
    try {
      execSync(`adb -s ${ip} shell input tap ${x} ${y}`)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-swipe', async (event, ip: string, x1: number, y1: number, x2: number, y2: number, duration: number = 500) => {
    try {
      execSync(`adb -s ${ip} shell input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-push-file', async (event, ip: string, localPath: string, remotePath: string) => {
    try {
      execSync(`adb -s ${ip} push ${localPath} ${remotePath}`)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-pull-file', async (event, ip: string, remotePath: string, localPath: string) => {
    try {
      execSync(`adb -s ${ip} pull ${remotePath} ${localPath}`)
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle('adb-get-notifications', async (event, ip: string) => {
    try {
      // Requires notification listener service
      return { success: true, notifications: [] }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })
}
