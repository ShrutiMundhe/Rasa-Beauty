import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AgeSelect.css'

function AgeSelect() {
  const navigate = useNavigate()
  const [age, setAge] = useState('')
  const [bracket, setBracket] = useState('')

  const handleBracketClick = (minAge, maxAge, label) => {
    setBracket(label)
    // Default to the middle of the bracket
    setAge(Math.floor((minAge + maxAge) / 2))
  }

  const handleContinue = () => {
    const ageNum = parseInt(age)
    if (ageNum > 0 && ageNum < 120) {
      localStorage.setItem('userAge', ageNum)
      navigate('/onboarding/city')
    } else {
      alert('Please enter a valid age between 1 and 120')
    }
  }

  return (
    <div className="age-page">
      {/* Header */}
      <div className="age-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '80%' }}></div>
        </div>
        <p className="progress-text">Step 4 of 5</p>
      </div>

      <div className="age-section">
        <h2 className="age-title">How old are you?</h2>
        <p className="age-sub">Your skin's cell turnover rate changes with age — we use this to fine-tune your recommendations 🌿</p>

        {/* Option cards */}
        <div className="age-grid">
          <div 
            className={`age-card ${bracket === 'teen' ? 'selected' : ''}`}
            onClick={() => handleBracketClick(13, 19, 'teen')}
          >
            <div className="age-card-emoji-wrap">✨</div>
            <div>
              <p className="age-card-label">Under 20</p>
              <p className="age-card-desc">Teen skin, prone to hormonal breakouts & grease</p>
            </div>
          </div>

          <div 
            className={`age-card ${bracket === 'young' ? 'selected' : ''}`}
            onClick={() => handleBracketClick(20, 29, 'young')}
          >
            <div className="age-card-emoji-wrap">🧴</div>
            <div>
              <p className="age-card-label">20 - 29</p>
              <p className="age-card-desc">Prevention, hydration, and maintaining natural glow</p>
            </div>
          </div>

          <div 
            className={`age-card ${bracket === 'mid' ? 'selected' : ''}`}
            onClick={() => handleBracketClick(30, 39, 'mid')}
          >
            <div className="age-card-emoji-wrap">🧬</div>
            <div>
              <p className="age-card-label">30 - 39</p>
              <p className="age-card-desc">Revitalization, targeting fine lines & initial elasticity drop</p>
            </div>
          </div>

          <div 
            className={`age-card ${bracket === 'mature' ? 'selected' : ''}`}
            onClick={() => handleBracketClick(40, 60, 'mature')}
          >
            <div className="age-card-emoji-wrap">👑</div>
            <div>
              <p className="age-card-label">40+</p>
              <p className="age-card-desc">Deep restoration, wrinkle care, and structural nourishment</p>
            </div>
          </div>
        </div>

        {/* Input box */}
        <div className="age-input-section">
          <label>Or enter your exact age:</label>
          <input 
            type="number" 
            min="1" 
            max="120"
            value={age}
            onChange={(e) => {
              setAge(e.target.value)
              setBracket('')
            }}
            placeholder="e.g. 26"
            className="age-number-input"
          />
        </div>

        <button 
          className={`btn-primary age-continue-btn ${!age ? 'disabled' : ''}`}
          disabled={!age}
          onClick={handleContinue}
        >
          Continue to Location →
        </button>
      </div>
    </div>
  )
}

export default AgeSelect
