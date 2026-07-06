import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BodyCare.css'

const bodyTypes = [
  { id: 'normal', label: 'Normal', desc: 'Balanced, smooth texture', emoji: '🧴' },
  { id: 'dry', label: 'Dry / Flaky', desc: 'Ashey appearance, tight feeling', emoji: '🌵' },
  { id: 'oily', label: 'Oily', desc: 'Prone to body acne or bacne', emoji: '💧' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Reacts to fragrances or shaving', emoji: '🌸' }
]

const bodyConcerns = [
  { id: 'tanning', label: 'Sun Tanning', emoji: '☀️', desc: 'UV exposure darkening' },
  { id: 'strawberry_legs', label: 'Strawberry Legs / Arms', emoji: '🍓', desc: 'Dark pores, keratosis pilaris' },
  { id: 'pigmentation', label: 'Pigmentation', emoji: '🎭', desc: 'Dark elbows, knees, or neck' },
  { id: 'body_acne', label: 'Body Acne (Bacne)', emoji: '😣', desc: 'Pimples on back or chest' },
  { id: 'dryness_roughness', label: 'Dryness & Roughness', emoji: '🍂', desc: 'Rough skin, scales' },
  { id: 'stretch_marks', label: 'Stretch Marks', emoji: '〰️', desc: 'Lines from skin stretching' },
  { id: 'ingrown_hair', label: 'Ingrown Hair', emoji: '🪒', desc: 'Hair trapped under skin' }
]

function BodyCare() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)
  const [selectedConcerns, setSelectedConcerns] = useState([])

  const toggleConcern = (concern) => {
    setSelectedConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  const handleContinue = () => {
    if (selectedType) {
      const profile = { bodyType: selectedType, bodyConcerns: selectedConcerns }
      localStorage.setItem('bodyProfile', JSON.stringify(profile))
      navigate('/onboarding/age')
    }
  }

  return (
    <div className="body-page">

      {/* Header */}
      <div className="body-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '60%' }}></div>
        </div>
        <p className="progress-text">Step 3 of 5</p>
      </div>

      {/* Section 1: Body Type Selection */}
      <div className="body-section">
        <h2 className="body-title">Select your body skin type</h2>
        <p className="body-sub">This helps us personalise your body care routine 🌸</p>

        <div className="body-type-grid">
          {bodyTypes.map(type => (
            <div
              key={type.id}
              className={`body-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="body-card-emoji-wrap">
                <span className="body-card-emoji">{type.emoji}</span>
              </div>
              <div className="body-card-info">
                <p className="body-card-label">{type.label}</p>
                <p className="body-card-desc">{type.desc}</p>
              </div>
              {selectedType === type.id && (
                <div className="selected-tick">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Body Concerns Selection */}
      <div className="body-section" style={{ marginTop: '48px' }}>
        <h2 className="body-title">What are your main concerns?</h2>
        <p className="body-sub">Select all that apply — we'll suggest targeted body care products 🌿</p>

        <div className="concerns-grid">
          {bodyConcerns.map((concern, index) => (
            <div
              key={concern.id}
              className={`concern-card ${selectedConcerns.includes(concern.id) ? 'selected' : ''}`}
              onClick={() => toggleConcern(concern.id)}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="concern-emoji">{concern.emoji}</div>
              <div className="concern-info">
                <p className="concern-label">{concern.label}</p>
                <p className="concern-desc">{concern.desc}</p>
              </div>
              {selectedConcerns.includes(concern.id) && (
                <div className="concern-tick">✓</div>
              )}
            </div>
          ))}
        </div>

        {selectedConcerns.length > 0 && (
          <div className="selected-summary">
            <p className="summary-text">
              ✨ {selectedConcerns.length} concern{selectedConcerns.length > 1 ? 's' : ''} selected — we'll customize your body care tips
            </p>
          </div>
        )}
      </div>

      {/* Footer / Continue Actions */}
      <div className="body-footer">
        <button
          className={`btn-next ${!selectedType ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selectedType}
        >
          Continue to City →
        </button>
        <button className="skip-btn" onClick={() => navigate('/onboarding/city')} style={{ marginTop: '12px', display: 'block', width: '100%', textAlign: 'center' }}>
          Skip for now
        </button>
      </div>

    </div>
  )
}

export default BodyCare
