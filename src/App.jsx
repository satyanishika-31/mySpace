import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import NotesPage from './pages/NotesPage'
import CalendarPage from './pages/CalendarPage'
import PasswordsPage from './pages/PasswordsPage'
import AlbumPage from './pages/AlbumPage'
import AuthPage from './pages/AuthPage'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Basic session persistence simulation
        const session = sessionStorage.getItem('personal_dashboard_session')
        if (session) {
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    const handleLogin = () => {
        setIsAuthenticated(true)
        sessionStorage.setItem('personal_dashboard_session', 'active')
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        sessionStorage.removeItem('personal_dashboard_session')
    }

    if (loading) return null

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/auth"
                    element={!isAuthenticated ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" />}
                />

                <Route path="/" element={isAuthenticated ? <Layout onLogout={handleLogout} /> : <Navigate to="/auth" />}>
                    <Route index element={<LandingPage />} />
                    <Route path="notes" element={<NotesPage />} />
                    <Route path="schedule" element={<CalendarPage />} />
                    <Route path="passwords" element={<PasswordsPage />} />
                    <Route path="album" element={<AlbumPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
