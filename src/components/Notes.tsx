import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([])
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')n  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-notes')
      if (result.success) {
        setNotes(result.notes)
      }
    } catch (e) {
      console.error('Failed to fetch notes:', e)
    }
  }

  const handleSaveNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return

    try {
      const result = await window.electron.ipcRenderer.invoke('save-note', {
        id: editingId,
        title: newNoteTitle,
        content: newNoteContent,
        timestamp: Date.now(),
      })

      if (result.success) {
        setNewNoteTitle('')
        setNewNoteContent('')
        setEditingId(null)
        fetchNotes()
      }
    } catch (e) {
      console.error('Failed to save note:', e)
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('delete-note', id)
      fetchNotes()
    } catch (e) {
      console.error('Failed to delete note:', e)
    }
  }

  const handleEditNote = (note: any) => {
    setEditingId(note.id)
    setNewNoteTitle(note.title)
    setNewNoteContent(note.content)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <h2 className="text-2xl font-bold text-neural-cyan uppercase" style={{ fontFamily: 'Orbitron' }}>NOTES</h2>

      {/* Create/Edit note */}
      <motion.div className="glass-panel p-6 rounded-lg space-y-4">
        <input
          type="text"
          placeholder="Note title..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="w-full px-4 py-2 bg-neural-darker border border-neural-cyan/30 rounded text-neural-cyan placeholder-neural-teal/50 focus:outline-none focus:border-neural-cyan"
        />
        <textarea
          placeholder="Note content..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="w-full px-4 py-2 bg-neural-darker border border-neural-cyan/30 rounded text-neural-cyan placeholder-neural-teal/50 focus:outline-none focus:border-neural-cyan h-32 resize-none"
        />
        <motion.button
          onClick={handleSaveNote}
          className="px-6 py-2 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan font-bold uppercase"
          whileTap={{ scale: 0.95 }}
        >
          {editingId ? 'UPDATE' : 'SAVE'}
        </motion.button>
      </motion.div>

      {/* Notes list */}
      <div className="grid grid-cols-3 gap-6">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-lg space-y-3"
          >
            <h3 className="text-neural-cyan font-bold text-lg">{note.title}</h3>
            <p className="text-neural-teal/70 text-sm line-clamp-3">{note.content}</p>
            <div className="flex gap-2 pt-4">
              <motion.button
                onClick={() => handleEditNote(note)}
                className="flex-1 px-3 py-2 bg-neural-cyan/20 hover:bg-neural-cyan/40 border border-neural-cyan rounded text-neural-cyan text-xs font-mono uppercase"
                whileTap={{ scale: 0.95 }}
              >
                EDIT
              </motion.button>
              <motion.button
                onClick={() => handleDeleteNote(note.id)}
                className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded text-red-400 text-xs font-mono uppercase"
                whileTap={{ scale: 0.95 }}
              >
                DELETE
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default Notes
