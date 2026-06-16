/**
 * System telemetry fetcher
 */
export class SystemTelemetryService {
  /**
   * Get current system stats
   */
  static async getSystemStats(): Promise<any> {
    try {
      return await (window as any).electron.ipcRenderer.invoke('get-system-stats')
    } catch (error) {
      console.error('Failed to get system stats:', error)
      return null
    }
  }

  /**
   * Get battery status
   */
  static async getBatteryStatus(): Promise<any> {
    try {
      return await (window as any).electron.ipcRenderer.invoke('get-battery-status')
    } catch (error) {
      console.error('Failed to get battery status:', error)
      return null
    }
  }

  /**
   * Get network status
   */
  static async getNetworkStatus(): Promise<any> {
    try {
      return await (window as any).electron.ipcRenderer.invoke('get-network-status')
    } catch (error) {
      console.error('Failed to get network status:', error)
      return null
    }
  }
}

export default SystemTelemetryService
