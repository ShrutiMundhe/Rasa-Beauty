import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Splash.css'

function Splash() {
  const navigate = useNavigate()

  return (
    <div className="splash">
      <div className="splash-content">
        <span className="logo-emoji">🌿</span>
        <div className="splash-bottom">
          <button className="btn-primary" onClick={() => navigate('/signup')}>
            Get Started
          </button>
          <button className="btn-outline" onClick={() => navigate('/login')}>
            I Already have an Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Splash