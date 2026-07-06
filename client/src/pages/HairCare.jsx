import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HairCare.css'

const hairTypes = [
  { id: 'straight', label: 'Straight', desc: 'Sleek, shiny, lays flat', emoji: '👩‍🦰' },
  { id: 'wavy', label: 'Wavy', desc: 'Gentle S-shape, volume, frizz-prone', emoji: '👩‍🦱' },
  { id: 'curly', label: 'Curly', desc: 'Defined loops or springy ringlets', emoji: '👩‍🏾‍🦱' },
  { id: 'coily', label: 'Coily / Kinky', desc: 'Tight corkscrews or Z-patterns', emoji: '👩🏿‍🦱' }
]

const hairConcerns = [
  { id: 'dandruff', label: 'Dandruff', emoji: '❄️', desc: 'Itchy, flaky scalp' },
  { id: 'hair_fall', label: 'Hair Fall', emoji: '📉', desc: 'Thinning, breakage' },
  { id: 'dryness_frizz', label: 'Dryness & Frizz', emoji: '🌵', desc: 'Rough, unmanageable' },
  { id: 'oily_scalp', label: 'Oily Scalp', emoji: '💧', desc: 'Greasy roots quickly' },
  { id: 'split_ends', label: 'Split Ends', emoji: '✂️', desc: 'Brittle, damaged ends' },
  { id: 'premature_greying', label: 'Premature Greying', emoji: '👵', desc: 'Early loss of pigment' },
  { id: 'slow_growth', label: 'Slow Growth', emoji: '🌱', desc: 'Wants length/volume' }
]

const hairTestSteps = [
  { step: '1. Wash & Air Dry', desc: 'Wash your hair with a gentle shampoo, do not apply conditioner or styling products, and let it air dry naturally.' },
  { step: '2. Check the Shape', desc: 'Observe a strand or section of your dry hair. Does it fall straight down, make a wave, form curls, or create tight coils?' },
  { step: '3. Feel the Texture', desc: 'Straight hair feels smooth; wavy/curly has texture and frizz; coily hair feels dense and fragile.' }
]

const hairPorosityOptions = [
  { id: 'low', label: 'Low Porosity', desc: 'Sits on top of water, takes long to wet/dry', emoji: '💧' },
  { id: 'normal', label: 'Normal Porosity', desc: 'Sinks slowly, absorbs and holds moisture well', emoji: '✨' },
  { id: 'high', label: 'High Porosity', desc: 'Sinks immediately, gets wet fast but loses moisture easily', emoji: '🌪️' }
]

function HairCare() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)
  const [selectedPorosity, setSelectedPorosity] = useState(null)
  const [selectedConcerns, setSelectedConcerns] = useState([])

  const toggleConcern = (concern) => {
    setSelectedConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  const handleContinue = () => {
    if (selectedType && selectedPorosity) {
      // Save to localStorage
      const profile = { 
        hairType: selectedType, 
        hairPorosity: selectedPorosity,
        hairConcerns: selectedConcerns 
      }
      localStorage.setItem('hairProfile', JSON.stringify(profile))
      navigate('/onboarding/body')
    }
  }

  return (
    <div className="hair-page">

      {/* Header */}
      <div className="hair-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '50%' }}></div>
        </div>
        <p className="progress-text">Step 2 of 4</p>
      </div>

      {/* Section 1: Hair Type Selection */}
      <div className="hair-section">
        <h2 className="hair-title">Select your hair type</h2>
        <p className="hair-sub">This helps us personalise your hair care routine 🌸</p>

        <div className="hair-type-grid">
          {hairTypes.map(type => (
            <div
              key={type.id}
              className={`hair-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="hair-card-emoji-wrap">
                <span className="hair-card-emoji">{type.emoji}</span>
              </div>
              <div className="hair-card-info">
                <p className="hair-card-label">{type.label}</p>
                <p className="hair-card-desc">{type.desc}</p>
              </div>
              {selectedType === type.id && (
                <div className="selected-tick">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Don't know helper */}
      <div className="helper-section">
        <h3 className="helper-heading">
          Don't know your hair type?
        </h3>

        <div className="helper-content">
          <p className="helper-title">Determine it at home —</p>
          
          <div className="helper-layout-simple">
            <div className="helper-steps-wrap-simple">
              {hairTestSteps.map((item, i) => (
                <div key={i} className="helper-step">
                  <p className="helper-step-title">{item.step}</p>
                  <p className="helper-step-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2.5: Don't know hair porosity helper */}
      <div className="helper-section">
        <h3 className="helper-heading">
          Don't know your hair porosity?
        </h3>

        <div className="helper-content">
          <p className="helper-title">Let me help you out (Float Test) —</p>
          
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
                <source src="/videos/porosity-test.mp4" type="video/mp4" />
              </video>
              <p className="helper-video-caption">Watch how to do the glass water float test</p>
            </div>

            {/* Right — Written steps */}
            <div className="helper-steps-wrap">
              <div className="helper-step">
                <p className="helper-step-title">1. Drop in Water</p>
                <p className="helper-step-desc">Fill a glass with room-temperature water and drop a clean strand of hair in it.</p>
              </div>
              <div className="helper-step">
                <p className="helper-step-title">2. Observe</p>
                <p className="helper-step-desc">Wait for 3–5 minutes and watch where the strand settles.</p>
              </div>
              <div className="helper-step">
                <p className="helper-step-title">3. Read results</p>
                <div className="helper-results">
                  <div className="helper-result-row">
                    <span className="result-type">Low Porosity:</span>
                    <span className="result-sign"> Hair floats on the surface. Cuticles are tight and resist moisture.</span>
                  </div>
                  <div className="helper-result-row">
                    <span className="result-type">Normal Porosity:</span>
                    <span className="result-sign"> Hair drifts in the middle. Cuticles are balanced and healthy.</span>
                  </div>
                  <div className="helper-result-row">
                    <span className="result-type">High Porosity:</span>
                    <span className="result-sign"> Hair sinks to the bottom. Cuticles are open and dry fast.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Section 2.6: Hair Porosity Selection */}
      <div className="hair-section" style={{ marginTop: '24px' }}>
        <h2 className="hair-title" style={{ fontSize: '28px' }}>Select your hair porosity</h2>
        <p className="hair-sub">Based on your float test results above 🌸</p>

        <div className="porosity-grid">
          {hairPorosityOptions.map(option => (
            <div
              key={option.id}
              className={`hair-card ${selectedPorosity === option.id ? 'selected' : ''}`}
              onClick={() => setSelectedPorosity(option.id)}
            >
              <div className="hair-card-emoji-wrap" style={{ background: 'var(--blush)' }}>
                <span className="hair-card-emoji">{option.emoji}</span>
              </div>
              <div className="hair-card-info">
                <p className="hair-card-label" style={{ fontSize: '18px' }}>{option.label}</p>
                <p className="hair-card-desc">{option.desc}</p>
              </div>
              {selectedPorosity === option.id && (
                <div className="selected-tick">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Hair Concerns Selection */}
      <div className="hair-section" style={{ marginTop: '48px' }}>
        <h2 className="hair-title">What are your main concerns?</h2>
        <p className="hair-sub">Select all that apply — we'll suggest targeted treatments 🌿</p>

        <div className="concerns-grid">
          {hairConcerns.map((concern, index) => (
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
              ✨ {selectedConcerns.length} concern{selectedConcerns.length > 1 ? 's' : ''} selected — we'll customize your tips accordingly
            </p>
          </div>
        )}
      </div>

      {/* Footer / Continue Actions */}
      <div className="hair-footer">
        <button
          className={`btn-next ${(!selectedType || !selectedPorosity) ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={!selectedType || !selectedPorosity}
        >
          Continue to Body Care →
        </button>
        <button className="skip-btn" onClick={() => navigate('/onboarding/body')} style={{ marginTop: '12px', display: 'block', width: '100%', textAlign: 'center' }}>
          Skip for now
        </button>
      </div>

    </div>
  )
}

export default HairCare
