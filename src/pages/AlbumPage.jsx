import React, { useState, useEffect, useRef } from 'react'
import { Image as ImageIcon, Upload, Trash2, X } from 'lucide-react'
import './AlbumPage.css'

const AlbumPage = () => {
    const [photos, setPhotos] = useState(() => {
        const saved = localStorage.getItem('personal_dashboard_photos')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        try {
            localStorage.setItem('personal_dashboard_photos', JSON.stringify(photos))
        } catch (e) {
            console.error("Storage limit exceeded or another error occurred:", e)
            alert("Storage limit reached! Please delete some photos before adding more.")
        }
    }, [photos])

    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const fileInputRef = useRef(null)

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            alert("Please upload images smaller than 2MB to ensure local storage works correctly.")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const base64Data = event.target.result
            setPhotos([{
                id: Date.now().toString(),
                data: base64Data,
                name: file.name,
                date: new Date().toISOString(),
                note: ''
            }, ...photos])
        }
        reader.readAsDataURL(file)
    }

    const handleDelete = (id, event) => {
        event.stopPropagation()
        setPhotos(photos.filter(p => p.id !== id))
        if (selectedPhoto && selectedPhoto.id === id) {
            setSelectedPhoto(null)
        }
    }

    const handleUpdateNote = (id, newNote) => {
        setPhotos(photos.map(p => p.id === id ? { ...p, note: newNote } : p))
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="album-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Memories</h1>
                    <p className="subtitle">Your favorite moments, captured forever</p>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
                <button className="btn btn-primary" onClick={triggerFileInput}>
                    <Upload size={18} /> Import Photo
                </button>
            </div>

            <div className="album-gallery">
                {photos.length === 0 ? (
                    <div className="empty-state glass-panel">
                        <div className="empty-icon"><ImageIcon size={48} opacity={0.5} /></div>
                        <h3>No photos yet</h3>
                        <p>Import your first memory using the button above.</p>
                    </div>
                ) : (
                    <div className="polaroid-grid">
                        {photos.map(photo => (
                            <div
                                key={photo.id}
                                className="polaroid-card"
                            >
                                <div className="polaroid-image-container" onClick={() => setSelectedPhoto(photo)}>
                                    <img src={photo.data} alt={photo.name} className="polaroid-image" />
                                    <div className="photo-overlay">
                                        <button
                                            className="icon-btn delete-btn"
                                            onClick={(e) => handleDelete(photo.id, e)}
                                            title="Delete Photo"
                                        >
                                            <Trash2 size={18} color="white" />
                                        </button>
                                    </div>
                                </div>
                                <div className="polaroid-note-area">
                                    <textarea
                                        placeholder="Write a memory..."
                                        className="polaroid-input"
                                        value={photo.note || ''}
                                        rows={1}
                                        onChange={(e) => handleUpdateNote(photo.id, e.target.value)}
                                        ref={(el) => {
                                            if (el) {
                                                el.style.height = 'auto';
                                                el.style.height = el.scrollHeight + 'px';
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedPhoto && (
                <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
                    <button className="icon-btn close-modal-btn" onClick={() => setSelectedPhoto(null)}>
                        <X size={32} color="white" />
                    </button>
                    <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedPhoto.data}
                            alt={selectedPhoto.name}
                            className="modal-image"
                        />
                        {selectedPhoto.note && (
                            <p className="modal-note handwriting">{selectedPhoto.note}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AlbumPage
