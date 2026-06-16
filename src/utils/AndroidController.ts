/**
 * ADB / Android device controller
 */
export class AndroidController {
  private deviceIP: string
  private devicePort: number

  constructor(deviceIP: string, devicePort: number = 5555) {
    this.deviceIP = deviceIP
    this.devicePort = devicePort
  }

  /**
   * Get device telemetry
   */
  async getTelemetry(): Promise<any> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'adb-telemetry',
        this.deviceIP
      )
      return result
    } catch (error) {
      console.error('Failed to get telemetry:', error)
      return null
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(): Promise<string | null> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'adb-screenshot',
        this.deviceIP
      )
      return result.success ? result.path : null
    } catch (error) {
      console.error('Screenshot failed:', error)
      return null
    }
  }

  /**
   * Open app by package name
   */
  async openApp(packageName: string): Promise<boolean> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'adb-open-app',
        this.deviceIP,
        packageName
      )
      return result.success
    } catch (error) {
      console.error('Failed to open app:', error)
      return false
    }
  }

  /**
   * Close app
   */
  async closeApp(packageName: string): Promise<boolean> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'adb-close-app',
        this.deviceIP,
        packageName
      )
      return result.success
    } catch (error) {
      console.error('Failed to close app:', error)
      return false
    }
  }

  /**
   * Tap at coordinates
   */
  async tap(x: number, y: number): Promise<boolean> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'adb-tap',
        this.deviceIP,
        x,
        y
      )
      return result.success
    } catch (error) {
      console.error('Tap failed:', error)
      return false
    }
  }

  /**
   * Swipe gesture
   */
  async swipe(x1: number, y1: number, x2: number, y2: number, duration?: number): Promise<boolean> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'adb-swipe',
        this.deviceIP,
        x1,
        y1,
        x2,
        y2,
        duration || 500
      )
      return result.success
    } catch (error) {
      console.error('Swipe failed:', error)
      return false
    }
  }

  /**
   * Push file to device
   */
  async pushFile(localPath: string, remotePath: string): Promise<boolean> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'adb-push-file',
        this.deviceIP,
        localPath,
        remotePath
      )
      return result.success
    } catch (error) {
      console.error('Push failed:', error)
      return false
    }
  }

  /**
   * Pull file from device
   */
  async pullFile(remotePath: string, localPath: string): Promise<boolean> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'adb-pull-file',
        this.deviceIP,
        remotePath,
        localPath
      )
      return result.success
    } catch (error) {
      console.error('Pull failed:', error)
      return false
    }
  }
}

export default AndroidController
