import React, { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Copy, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import './PasswordsPage.css'

const PasswordsPage = () => {
    const [passwords, setPasswords] = useState(() => {
        const saved = localStorage.getItem('personal_dashboard_passwords')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('personal_dashboard_passwords', JSON.stringify(passwords))
    }, [passwords])

    const [isAdding, setIsAdding] = useState(false)
    const [newEntry, setNewEntry] = useState({ service: '', username: '', password: '' })
    const [visiblePasswords, setVisiblePasswords] = useState({})
    const [copiedId, setCopiedId] = useState(null)

    const handleSave = (e) => {
        e.preventDefault()
        if (!newEntry.service || !newEntry.password) return

        setPasswords([...passwords, { ...newEntry, id: Date.now().toString() }])
        setIsAdding(false)
        setNewEntry({ service: '', username: '', password: '' })
    }

    const handleDelete = (id) => {
        setPasswords(passwords.filter(p => p.id !== id))
        // Clean up visibility state if deleted
        const newVisible = { ...visiblePasswords }
        delete newVisible[id]
        setVisiblePasswords(newVisible)
    }

    const toggleVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const copyToClipboard = (id, password) => {
        navigator.clipboard.writeText(password)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="passwords-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Passwords</h1>
                    <p className="subtitle">Securely manage your credentials locally</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                    <Plus size={18} /> Add Credential
                </button>
            </div>

            {isAdding && (
                <form className="password-form glass-panel animate-fade-in" onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Service / Website</label>
                        <input
                            type="text"
                            placeholder="e.g. Netflix, Email, Bank..."
                            value={newEntry.service}
                            onChange={e => setNewEntry({ ...newEntry, service: e.target.value })}
                            autoFocus
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Username / Email</label>
                            <input
                                type="text"
                                placeholder="email@example.com"
                                value={newEntry.username}
                                onChange={e => setNewEntry({ ...newEntry, username: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="text"
                                placeholder="Secret password..."
                                value={newEntry.password}
                                onChange={e => setNewEntry({ ...newEntry, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
                        <button type="submit" className="btn btn-accent-green">Save Credential</button>
                    </div>
                </form>
            )}

            <div className="passwords-list">
                {passwords.length === 0 && !isAdding ? (
                    <div className="empty-state glass-panel">
                        <div className="empty-icon"><Lock size={48} opacity={0.5} /></div>
                        <h3>No passwords saved</h3>
                        <p>Your vault is empty. Add a credential to get started.</p>
                    </div>
                ) : (
                    passwords.map(entry => (
                        <div key={entry.id} className="password-card glass-panel">
                            <div className="pwd-info">
                                <h3>{entry.service}</h3>
                                {entry.username && <p className="pwd-user">{entry.username}</p>}
                                <div className="pwd-value-container">
                                    <div className="pwd-dots">
                                        {visiblePasswords[entry.id] ? entry.password : '••••••••••••'}
                                    </div>
                                    <button className="icon-btn" onClick={() => toggleVisibility(entry.id)}>
                                        {visiblePasswords[entry.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="pwd-actions">
                                <button
                                    className={`btn-icon-only copy-btn ${copiedId === entry.id ? 'copied' : ''}`}
                                    onClick={() => copyToClipboard(entry.id, entry.password)}
                                    title="Copy password"
                                >
                                    {copiedId === entry.id ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                </button>
                                <button
                                    className="btn-icon-only delete-btn"
                                    onClick={() => handleDelete(entry.id)}
                                    title="Delete entry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default PasswordsPage
