import React, { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './AuthPage.css'

const AuthPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        const savedUser = localStorage.getItem('personal_dashboard_user')

        if (isLogin) {
            if (savedUser) {
                const user = JSON.parse(savedUser)
                if (user.email === email && user.password === password) {
                    onLogin()
                    navigate('/')
                } else {
                    setError('Invalid email or password')
                }
            } else {
                setError('No account found. Please sign up first.')
            }
        } else {
            // Sign up flow
            const newUser = { email, password }
            localStorage.setItem('personal_dashboard_user', JSON.stringify(newUser))
            onLogin()
            navigate('/')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container glass-panel animate-fade-in">
                <div className="auth-header">
                    <h2>My<span style={{ color: 'var(--text-secondary)' }}>Space</span></h2>
                    <p>{isLogin ? 'Welcome back' : 'Create your account'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="btn btn-primary auth-submit">
                        {isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Sign Up</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            className="text-link"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError('')
                            }}
                        >
                            {isLogin ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
