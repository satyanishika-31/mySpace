import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Calendar, Lock, Image as ImageIcon, Plus, ArrowRight } from 'lucide-react'
import './LandingPage.css'

const LandingPage = () => {
    const [greeting, setGreeting] = useState('')
    const [time, setTime] = useState('')
    const [upcomingEvents, setUpcomingEvents] = useState([])

    useEffect(() => {
        const saved = localStorage.getItem('personal_dashboard_events')
        if (saved) {
            const parsed = JSON.parse(saved)
            const future = parsed.filter(e => new Date(e.date) >= new Date().setHours(0, 0, 0, 0))
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3)
            setUpcomingEvents(future)
        }
        const updateTime = () => {
            const now = new Date()
            const hour = now.getHours()

            if (hour < 12) setGreeting('Good morning')
            else if (hour < 18) setGreeting('Good afternoon')
            else setGreeting('Good evening')

            setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }))
        }

        updateTime()
        const int = setInterval(updateTime, 1000)
        return () => clearInterval(int)
    }, [])

    const widgets = [
        { title: 'Notes', desc: 'Jot down your thoughts', icon: FileText, color: 'var(--accent-yellow)', path: '/notes' },
        { title: 'Schedule', desc: 'Plan your important events', icon: Calendar, color: 'var(--accent-pink)', path: '/schedule' },
        { title: 'Passwords', desc: 'Securely manage credentials', icon: Lock, color: 'var(--accent-green)', path: '/passwords' },
        { title: 'Album', desc: 'Relive your favorite memories', icon: ImageIcon, color: 'var(--accent-blue)', path: '/album' }
    ]

    return (
        <div className="landing-page animate-fade-in">
            <header className="hero-section glass-panel">
                <div className="hero-content">
                    <h1>{greeting}, <span className="highlight">Beautiful</span></h1>
                    <p className="hero-time">It's currently {time}</p>
                    <p className="hero-subtitle">What would you like to focus on today?</p>
                </div>
                <div className="hero-actions">
                    <Link to="/notes" className="btn btn-primary">
                        <Plus size={18} /> New Note
                    </Link>
                </div>
            </header>

            <section className="widgets-grid">
                {widgets.map((widget, index) => {
                    const Icon = widget.icon
                    return (
                        <Link
                            to={widget.path}
                            key={index}
                            className="widget-card glass-panel"
                            style={{ "--widget-color": widget.color }}
                        >
                            <div className="widget-icon" style={{ backgroundColor: widget.color }}>
                                <Icon size={24} />
                            </div>
                            <div className="widget-info">
                                <h3>{widget.title}</h3>
                                <p>{widget.desc}</p>
                            </div>
                            <div className="widget-action">
                                <ArrowRight size={20} className="arrow-icon" />
                            </div>
                        </Link>
                    )
                })}
            </section>

            {upcomingEvents.length > 0 && (
                <section className="dashboard-events glass-panel">
                    <div className="dashboard-events-header">
                        <h2>Upcoming Events</h2>
                        <Link to="/schedule" className="text-link">View Calendar</Link>
                    </div>
                    <div className="dashboard-events-list">
                        {upcomingEvents.map(event => {
                            const d = new Date(event.date)
                            return (
                                <div key={event.id} className="dashboard-event-item" style={{ '--event-color': event.color }}>
                                    <div className="event-color-bar"></div>
                                    <div className="event-details">
                                        <h4 className="event-title">{event.title}</h4>
                                        <span className="event-date">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}
        </div>
    )
}

export default LandingPage
