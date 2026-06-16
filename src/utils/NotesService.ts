/**
 * Notes manager
 */
export class NotesService {
  /**
   * Save or update note
   */
  static async saveNote(title: string, content: string, id?: string): Promise<string | null> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke('save-note', {
        id,
        title,
        content,
        timestamp: Date.now(),
      })
      return result.success ? result.id : null
    } catch (error) {
      console.error('Failed to save note:', error)
      return null
    }
  }

  /**
   * Get all notes
   */
  static async getNotes(): Promise<any[]> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke('get-notes')
      return result.success ? result.notes : []
    } catch (error) {
      console.error('Failed to get notes:', error)
      return []
    }
  }

  /**
   * Delete note
   */
  static async deleteNote(id: string): Promise<boolean> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke('delete-note', id)
      return result.success
    } catch (error) {
      console.error('Failed to delete note:', error)
      return false
    }
  }
}

export default NotesService
