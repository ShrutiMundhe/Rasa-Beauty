import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

// Support Vite, Create React App, and fall back to the deployed Render backend
const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_URL ||
  'https://rasa-beauty.onrender.com';

function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 = Signup Form, 2 = OTP Verification
  const [form, setForm] = useState({
    name: '', email: '', password: ''
  })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showPassword, setShowPassword] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOtpChange = (e, index) => {
    const value = e.target.value
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('')
      const newOtp = [...otp]
      for (let i = 0; i < 6; i++) {
        if (pasted[i]) newOtp[i] = pasted[i]
      }
      setOtp(newOtp)
      const focusIndex = Math.min(pasted.length - 1, 5)
      document.getElementById(`otp-input-${focusIndex}`)?.focus()
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value !== '' && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        document.getElementById(`otp-input-${index - 1}`)?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(text)) {
      const digits = text.split('')
      setOtp(digits)
      document.getElementById('otp-input-5')?.focus()
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setStep(2)
        setCooldown(30)
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits')
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: otpCode })
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        }))
        navigate('/onboarding/facial')
      } else {
        setError(data.message || 'Verification failed')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (cooldown > 0) return
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      })
      const data = await res.json()
      if (res.ok) {
        setCooldown(30)
        setOtp(['', '', '', '', '', ''])
        setTimeout(() => {
          document.getElementById('otp-input-0')?.focus()
        }, 50)
      } else {
        setError(data.message || 'Failed to resend OTP')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      {step === 1 ? (
        <>
          <div className="auth-top">
            <span className="auth-logo">🌿</span>
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-sub">Your personalised care journey starts here 🌿</p>
          </div>

          <form className="auth-form" onSubmit={handleSendOtp}>
            {error && <div className="auth-error-msg">{error}</div>}
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Shruti Mundhe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
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
                  placeholder="min. 6 characters"
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
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Create Account'}
            </button>
            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Login</Link>
            </p>
          </form>
        </>
      ) : (
        <>
          <div className="auth-top">
            <span className="auth-logo">✉️</span>
            <h2 className="auth-title">Verify your email</h2>
            <p className="auth-sub">
              We have sent a 6-digit OTP code to <br />
              <strong>{form.email}</strong>.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleVerifyOtp}>
            {error && <div className="auth-error-msg">{error}</div>}
            
            <div className="otp-wrapper">
              <label className="otp-label">Verification Code</label>
              <div className="otp-inputs" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    pattern="\d*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="otp-input-field"
                    required
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Sign Up'}
            </button>

            <div className="otp-resend-row">
              {cooldown > 0 ? (
                <span className="otp-cooldown-text">Resend code in {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="btn-resend-otp"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              className="btn-back-to-email"
              onClick={() => {
                setStep(1)
                setError('')
              }}
            >
              Change Email
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default Signup