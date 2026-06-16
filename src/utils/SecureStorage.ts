/**
 * Utility for managing local encrypted storage
 */
export class SecureStorage {
  private storageKey = 'kanha-secure-store'

  /**
   * Save encrypted data
   */
  async saveEncrypted(key: string, data: any): Promise<void> {
    try {
      const encrypted = await (window as any).electron.ipcRenderer.invoke(
        'secure-save-keys',
        { [key]: JSON.stringify(data) }
      )
      if (!encrypted.success) {
        throw new Error('Failed to save encrypted data')
      }
    } catch (error) {
      console.error('Secure save error:', error)
      throw error
    }
  }

  /**
   * Retrieve encrypted data
   */
  async getEncrypted(key: string): Promise<any> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke('secure-get-keys')
      if (result.success && result.keys) {
        return JSON.parse(result.keys[key] || 'null')
      }
      return null
    } catch (error) {
      console.error('Secure get error:', error)
      return null
    }
  }
}

export default SecureStorage
