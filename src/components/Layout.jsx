import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, FileText, Calendar, Lock, Image as ImageIcon, LogOut } from 'lucide-react'
import './Layout.css'

const Layout = ({ onLogout }) => {
    const location = useLocation()

    const navItems = [
        { name: 'Dashboard', path: '/', icon: Home, color: 'var(--accent-blue)' },
        { name: 'Notes', path: '/notes', icon: FileText, color: 'var(--accent-yellow)' },
        { name: 'Schedule', path: '/schedule', icon: Calendar, color: 'var(--accent-pink)' },
        { name: 'Passwords', path: '/passwords', icon: Lock, color: 'var(--accent-green)' },
        { name: 'Album', path: '/album', icon: ImageIcon, color: 'var(--accent-blue-hover)' },
    ]

    return (
        <div className="layout-container">
            <aside className="sidebar glass-panel">
                <div className="logo">
                    <h2>My<span style={{ color: 'var(--text-secondary)' }}>Space</span></h2>
                </div>
                <nav className="nav-menu">
                    {navItems.map(item => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                style={{ "--hover-color": item.color }}
                            >
                                <div className="icon-wrapper" style={{ backgroundColor: isActive ? item.color : 'transparent' }}>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="nav-text">{item.name}</span>
                            </NavLink>
                        )
                    })}
                </nav>
                <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
                    <button className="nav-link logout-btn" onClick={onLogout} style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px' }}>
                        <div className="icon-wrapper">
                            <LogOut size={20} strokeWidth={2} />
                        </div>
                        <span className="nav-text">Sign Out</span>
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
