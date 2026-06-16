/**
 * Hardware permissions manager
 */
export class HardwarePermissionService {
  /**
   * Get all hardware permissions
   */
  static async getPermissions(): Promise<any> {
    try {
      return await (window as any).electron.ipcRenderer.invoke('get-hardware-permissions')
    } catch (error) {
      console.error('Failed to get permissions:', error)
      return {}
    }
  }

  /**
   * Set a specific permission
   */
  static async setPermission(permName: string, value: boolean): Promise<boolean> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(
        'set-hardware-permission',
        permName,
        value
      )
      return result.success
    } catch (error) {
      console.error('Failed to set permission:', error)
      return false
    }
  }

  /**
   * Check if permission is enabled
   */
  static async hasPermission(permName: string): Promise<boolean> {
    try {
      const perms = await this.getPermissions()
      return perms[permName] === true
    } catch (error) {
      return false
    }
  }
}

export default HardwarePermissionService
