import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    // Use the environment variable for production, or localhost for local testing
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        // ... rest of your code remains the same
            const data = await res.json()
            if (data.token) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email
                }))
                
                // Populate user inputs in local storage if they exist in the database
                if (data.user.city) {
                    localStorage.setItem('userCity', JSON.stringify(data.user.city))
                }
                if (data.user.skinType) {
                    localStorage.setItem('facialProfile', JSON.stringify({
                        skinType: data.user.skinType,
                        skinConcerns: data.user.skinConcerns || []
                    }))
                }
                if (data.user.hairType) {
                    localStorage.setItem('hairProfile', JSON.stringify({
                        hairType: data.user.hairType,
                        hairPorosity: data.user.hairPorosity || 'normal',
                        hairConcerns: data.user.hairConcerns || []
                    }))
                }
                if (data.user.bodyType) {
                    localStorage.setItem('bodyProfile', JSON.stringify({
                        bodyType: data.user.bodyType,
                        bodyConcerns: data.user.bodyConcerns || []
                    }))
                }

                // Check if they already have completed onboarding (city name and skinType exists)
                if (data.user.city && data.user.city.name && data.user.skinType) {
                    navigate('/home')
                } else {
                    navigate('/onboarding/facial')
                }
            } else {
                alert(data.message || 'Login failed')
            }
        } catch (err) {
            alert('Something went wrong')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-top">
                <span className="auth-logo">🌿</span>
                <h2 className="auth-title">Welcome back 🌿</h2>
                <p className="auth-sub">Your skin missed you</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', paddingRight: '46px' }}
                        />
                        <button
                            type="button"
                            className="btn-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#888888',
                                padding: '4px'
                            }}
                            title={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn-primary">
                    Login
                </button>
                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">Sign up</Link>
                </p>
            </form>
        </div>
    )
}

export default Login