import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react'
import './CalendarPage.css'

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('personal_dashboard_events')
        return saved ? JSON.parse(saved) : []
    })

    const [isAddingEvent, setIsAddingEvent] = useState(false)
    const [selectedDay, setSelectedDay] = useState(null)
    const [newEvent, setNewEvent] = useState({ title: '', color: 'var(--accent-pink)' })

    useEffect(() => {
        localStorage.setItem('personal_dashboard_events', JSON.stringify(events))
    }, [events])

    const colorOptions = [
        'var(--accent-pink)',
        'var(--accent-blue)',
        'var(--accent-green)',
        'var(--accent-yellow)'
    ]

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const handleDayClick = (day) => {
        setSelectedDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
        setIsAddingEvent(true)
    }

    const handleAddEvent = () => {
        if (!newEvent.title.trim() || !selectedDay) return

        const eventToAdd = {
            id: Date.now().toString(),
            title: newEvent.title,
            date: selectedDay.toISOString(),
            color: newEvent.color
        }

        setEvents([...events, eventToAdd])
        setIsAddingEvent(false)
        setNewEvent({ title: '', color: 'var(--accent-pink)' })
    }

    const handleDeleteEvent = (id) => {
        setEvents(events.filter(e => e.id !== id))
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const blanks = Array.from({ length: firstDay }, (_, i) => i)

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const getEventsForDay = (day) => {
        const dStr = new Date(year, month, day).toDateString()
        return events.filter(e => new Date(e.date).toDateString() === dStr)
    }

    return (
        <div className="calendar-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Schedule</h1>
                    <p className="subtitle">Plan your days with clarity</p>
                </div>
            </div>

            <div className="calendar-layout">
                <div className="calendar-container glass-panel">
                    <div className="calendar-header">
                        <h2>{monthNames[month]} {year}</h2>
                        <div className="calendar-nav">
                            <button className="icon-btn" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                            <button className="icon-btn" onClick={handleNextMonth}><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="weekday-header">{day}</div>
                        ))}

                        {blanks.map(blank => (
                            <div key={`blank-${blank}`} className="calendar-day empty"></div>
                        ))}

                        {days.map(day => {
                            const hasEvents = getEventsForDay(day).length > 0
                            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()
                            return (
                                <div
                                    key={day}
                                    className={`calendar-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
                                    onClick={() => handleDayClick(day)}
                                >
                                    <span className="day-number">{day}</span>
                                    {hasEvents && (
                                        <div className="event-indicators">
                                            {getEventsForDay(day).slice(0, 3).map(e => (
                                                <span key={e.id} className="event-dot" style={{ backgroundColor: e.color }}></span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="events-sidebar">
                    {isAddingEvent && selectedDay ? (
                        <div className="add-event-panel glass-panel">
                            <div className="panel-header">
                                <h3>Add Event for {selectedDay.getDate()} {monthNames[selectedDay.getMonth()]}</h3>
                                <button className="icon-btn" onClick={() => setIsAddingEvent(false)}><X size={18} /></button>
                            </div>
                            <input
                                type="text"
                                placeholder="Event Title..."
                                value={newEvent.title}
                                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="event-input"
                                autoFocus
                            />
                            <div className="color-picker" style={{ margin: '16px 0' }}>
                                {colorOptions.map(c => (
                                    <button
                                        key={c}
                                        className={`color-swatch ${newEvent.color === c ? 'active' : ''}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setNewEvent({ ...newEvent, color: c })}
                                    />
                                ))}
                            </div>
                            <button className="btn btn-primary" onClick={handleAddEvent} style={{ width: '100%' }}>
                                Save Event
                            </button>
                        </div>
                    ) : (
                        <div className="upcoming-events glass-panel">
                            <h3>Upcoming Events</h3>
                            {events.length === 0 ? (
                                <p className="no-events-text">No events planned</p>
                            ) : (
                                <div className="events-list">
                                    {events
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map(event => {
                                            const d = new Date(event.date)
                                            return (
                                                <div key={event.id} className="event-item" style={{ '--event-color': event.color }}>
                                                    <div className="event-color-bar"></div>
                                                    <div className="event-details">
                                                        <h4 className="event-title">{event.title}</h4>
                                                        <span className="event-date">{d.getDate()} {monthNames[d.getMonth()]} {d.getFullYear()}</span>
                                                    </div>
                                                    <button className="icon-btn delete-event-btn" onClick={() => handleDeleteEvent(event.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CalendarPage
