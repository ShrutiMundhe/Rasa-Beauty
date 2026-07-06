import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FacialCare.css'

const skinTypes = [
  { id: 'normal', label: 'Normal', desc: 'Balanced, comfortable', image: '/images/skin-normal.png' },
  { id: 'dry', label: 'Dry', desc: 'Flaky, tight feeling', image: '/images/skin-dry.png' },
  { id: 'oily', label: 'Oily', desc: 'Shiny, prone to breakouts', image: '/images/skin-oily.png' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, dry cheeks', image: '/images/skin-combination.png' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Reacts easily, redness', image: '/images/skin-sensitive.png' }
]

const skinConcerns = [
  { id: 'acne', label: 'Acne', emoji: '😣', desc: 'Pimples, breakouts' },
  { id: 'pigmentation', label: 'Pigmentation', emoji: '🎭', desc: 'Uneven skin tone' },
  { id: 'dark_spots', label: 'Dark Spots', emoji: '🌑', desc: 'Post-acne marks' },
  { id: 'dullness', label: 'Dull Skin', emoji: '😔', desc: 'Lack of glow' },
  { id: 'wrinkles', label: 'Wrinkles', emoji: '🌊', desc: 'Fine lines, ageing' },
  { id: 'pores', label: 'Open Pores', emoji: '🔬', desc: 'Enlarged pores' },
  { id: 'whiteheads', label: 'Whiteheads', emoji: '⚪', desc: 'Clogged pores' },
  { id: 'blackheads', label: 'Blackheads', emoji: '⚫', desc: 'Oxidised pores' },
  { id: 'tan', label: 'Sun Tan', emoji: '☀️', desc: 'UV damage' },
  { id: 'dryness', label: 'Dryness', emoji: '🌵', desc: 'Flaky, tight skin' },
  { id: 'oiliness', label: 'Excess Oil', emoji: '💧', desc: 'Shiny, greasy skin' },
  { id: 'sensitivity', label: 'Sensitivity', emoji: '🌸', desc: 'Redness, reactions' },
  { id: 'dark_circles', label: 'Dark Circles', emoji: '👁️', desc: 'Under eye darkness' },
  { id: 'puffy_eyes', label: 'Puffy Eyes', emoji: '😴', desc: 'Eye area swelling' },
  { id: 'uneven_texture', label: 'Uneven Texture', emoji: '🗺️', desc: 'Rough, bumpy skin' },
  { id: 'redness', label: 'Redness', emoji: '🔴', desc: 'Flushing, irritation' },
  { id: 'melasma', label: 'Melasma', emoji: '🌫️', desc: 'Hormonal patches' },
  { id: 'sagging', label: 'Sagging', emoji: '📉', desc: 'Loss of firmness' }
]

const skinTestSteps = [
  { step: '1. Cleanse', desc: 'Wash your face with a gentle cleanser and pat dry' },
  { step: '2. Wait', desc: 'Do not apply any serums, moisturizers, or makeup for 1–2 hours' },
  { step: '3. Observe', desc: 'Press a blotting paper or tissue on different areas of your face' },
  { step: '4. Read results', desc: null, results: [
    { type: 'Dry', sign: 'Tissue remains dry and skin feels tight' },
    { type: 'Oily', sign: 'Tissue sticks or shows oil from all over face' },
    { type: 'Combination', sign: 'Tissue picks up oil only from the T-zone' },
    { type: 'Normal', sign: 'Skin feels comfortable, no significant oil' }
  ]}
]

function FacialCare() {
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
      // Save to localStorage
      const profile = { skinType: selectedType, skinConcerns: selectedConcerns }
      localStorage.setItem('facialProfile', JSON.stringify(profile))
      navigate('/onboarding/hair')
    }
  }

  return (
    <div className="facial-page">

      {/* Header */}
      <div className="facial-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '25%' }}></div>
        </div>
        <p className="progress-text">Step 1 of 4</p>
      </div>

      {/* Section 1: Skin Type Selection */}
      <div className="facial-section">
        <h2 className="facial-title">Select your skin type</h2>
        <p className="facial-sub">This helps us personalise your daily tips 🌸</p>

        <div className="skin-type-grid">
          {skinTypes.map(type => (
            <div
              key={type.id}
              className={`skin-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="skin-card-img">
                <img
                  src={type.image}
                  alt={type.label}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <div className="skin-card-overlay"></div>
              </div>
              <div className="skin-card-info">
                <p className="skin-card-label">{type.label}</p>
                <p className="skin-card-desc">{type.desc}</p>
              </div>
              {selectedType === type.id && (
                <div className="selected-tick">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Don't know skin type helper */}
      <div className="helper-section">
        <h3 className="helper-heading">
          Don't know your skin type?
        </h3>

        <div className="helper-content">
          <p className="helper-title">Let me help you out —</p>
          
          {/* Video + Steps side by side */}
          <div className="helper-layout">
            
            {/* Left — Video */}
            <div className="helper-video-wrap">
              <video
                className="helper-video"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/videos/skin-test.mp4" type="video/mp4" />
              </video>
              <p className="helper-video-caption">Watch how to do the blotting paper test</p>
            </div>

            {/* Right — Written steps */}
            <div className="helper-steps-wrap">
              {skinTestSteps.map((item, i) => (
                <div key={i} className="helper-step">
                  <p className="helper-step-title">{item.step}</p>
                  {item.desc && (
                    <p className="helper-step-desc">{item.desc}</p>
                  )}
                  {item.results && (
                    <div className="helper-results">
                      {item.results.map((r, j) => (
                        <div key={j} className="helper-result-row">
                          <span className="result-type">{r.type}:</span>
                          <span className="result-sign"> {r.sign}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Section 3: Skin Concerns Selection */}
      <div className="facial-section" style={{ marginTop: '48px' }}>
        <h2 className="facial-title">What is your main concern?</h2>
        <p className="facial-sub">Select all that apply — we'll target these specifically 🌿</p>

        <div className="concerns-grid">
          {skinConcerns.map((concern, index) => (
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
              🌸 {selectedConcerns.length} concern{selectedConcerns.length > 1 ? 's' : ''} selected — we'll personalise your tips accordingly
            </p>
          </div>
        )}
      </div>

      {/* Footer / Continue Actions */}
      <div className="facial-footer" style={{ position: 'relative', marginTop: '60px', padding: '24px 0', background: 'transparent', borderTop: '1px solid var(--border)' }}>
        <button
          className={`btn-next ${!selectedType ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selectedType}
        >
          Continue to Hair Care →
        </button>
        <button className="skip-btn" onClick={() => navigate('/onboarding/hair')} style={{ marginTop: '12px', display: 'block', width: '100%', textAlign: 'center' }}>
          Skip for now
        </button>
      </div>

    </div>
  )
}

export default FacialCare