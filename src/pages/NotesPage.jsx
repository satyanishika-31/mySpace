import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import './NotesPage.css'

const NotesPage = () => {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('personal_dashboard_notes')
        return saved ? JSON.parse(saved) : []
    })

    const [isAdding, setIsAdding] = useState(false)
    const [currentNote, setCurrentNote] = useState({ title: '', content: '', color: 'var(--accent-yellow)' })

    useEffect(() => {
        localStorage.setItem('personal_dashboard_notes', JSON.stringify(notes))
    }, [notes])

    const colorOptions = [
        'var(--accent-yellow)',
        'var(--accent-blue)',
        'var(--accent-pink)',
        'var(--accent-green)'
    ]

    const handleSave = () => {
        if (!currentNote.title.trim() && !currentNote.content.trim()) return

        if (currentNote.id) {
            setNotes(notes.map(n => n.id === currentNote.id ? { ...currentNote, date: new Date().toISOString() } : n))
        } else {
            setNotes([{ ...currentNote, id: Date.now().toString(), date: new Date().toISOString() }, ...notes])
        }

        setIsAdding(false)
        setCurrentNote({ title: '', content: '', color: 'var(--accent-yellow)' })
    }

    const handleDelete = (id) => {
        setNotes(notes.filter(n => n.id !== id))
    }

    const handleEdit = (note) => {
        setCurrentNote(note)
        setIsAdding(true)
    }

    const formatDate = (isoString) => {
        const d = new Date(isoString)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="notes-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>My Notes</h1>
                    <p className="subtitle">{notes.length} notes captured</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                    <Plus size={18} /> New Note
                </button>
            </div>

            {isAdding && (
                <div className="note-editor glass-panel" style={{ '--note-color': currentNote.color }}>
                    <div className="editor-header">
                        <input
                            type="text"
                            placeholder="Note Title..."
                            value={currentNote.title}
                            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                            autoFocus
                        />
                        <button className="icon-btn close-btn" onClick={() => {
                            setIsAdding(false)
                            setCurrentNote({ title: '', content: '', color: 'var(--accent-yellow)' })
                        }}>
                            <X size={20} />
                        </button>
                    </div>

                    <textarea
                        placeholder="Write your thoughts here..."
                        value={currentNote.content}
                        onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                    />

                    <div className="editor-footer">
                        <div className="color-picker">
                            {colorOptions.map(c => (
                                <button
                                    key={c}
                                    className={`color-swatch ${currentNote.color === c ? 'active' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setCurrentNote({ ...currentNote, color: c })}
                                />
                            ))}
                        </div>
                        <button className="btn btn-primary btn-save" onClick={handleSave}>
                            <Check size={18} /> Save Note
                        </button>
                    </div>
                </div>
            )}

            <div className="notes-grid">
                {notes.map(note => (
                    <div
                        key={note.id}
                        className="note-card glass-panel"
                        style={{ '--note-color': note.color }}
                    >
                        <div className="note-card-header">
                            <h3>{note.title || 'Untitled'}</h3>
                            <div className="note-actions">
                                <button className="icon-btn edit-btn" onClick={() => handleEdit(note)}>
                                    <Edit2 size={16} />
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => handleDelete(note.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="note-content">{note.content}</p>
                        <div className="note-footer">
                            <span>{formatDate(note.date)}</span>
                        </div>
                    </div>
                ))}
                {notes.length === 0 && !isAdding && (
                    <div className="empty-state glass-panel">
                        <div className="empty-icon">📝</div>
                        <h3>No notes yet</h3>
                        <p>Jot down your first thought using the button above.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotesPage
