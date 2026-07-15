import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Profile.css'
import './Home.css'

// This will now correctly pull the URL from Vercel in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const skinTypes = [
  { id: 'normal', label: 'Normal', desc: 'Balanced, comfortable' },
  { id: 'dry', label: 'Dry', desc: 'Flaky, tight feeling' },
  { id: 'oily', label: 'Oily', desc: 'Shiny, prone to breakouts' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Reacts easily, redness' }
]

const SKIN_CONCERNS = [
  { id: 'acne', label: 'Acne', emoji: '😣' },
  { id: 'pigmentation', label: 'Pigmentation', emoji: '🎭' },
  { id: 'dark_spots', label: 'Dark Spots', emoji: '🌑' },
  { id: 'dullness', label: 'Dull Skin', emoji: '😔' },
  { id: 'wrinkles', label: 'Wrinkles', emoji: '🌊' },
  { id: 'pores', label: 'Open Pores', emoji: '🔬' },
  { id: 'whiteheads', label: 'Whiteheads', emoji: '⚪' },
  { id: 'blackheads', label: 'Blackheads', emoji: '⚫' },
  { id: 'tan', label: 'Sun Tan', emoji: '☀️' },
  { id: 'dryness', label: 'Dryness', emoji: '🌵' },
  { id: 'oiliness', label: 'Excess Oil', emoji: '💧' },
  { id: 'sensitivity', label: 'Sensitivity', emoji: '🌸' },
  { id: 'dark_circles', label: 'Dark Circles', emoji: '👁️' },
  { id: 'puffy_eyes', label: 'Puffy Eyes', emoji: '😴' },
  { id: 'uneven_texture', label: 'Uneven Texture', emoji: '🗺️' },
  { id: 'redness', label: 'Redness', emoji: '🔴' },
  { id: 'melasma', label: 'Melasma', emoji: '🌫️' },
  { id: 'sagging', label: 'Sagging', emoji: '📉' }
]

const HAIR_CONCERNS = [
  { id: 'dandruff', label: 'Dandruff', emoji: '❄️' },
  { id: 'hair_fall', label: 'Hair Fall', emoji: '📉' },
  { id: 'dryness_frizz', label: 'Dryness & Frizz', emoji: '🌵' },
  { id: 'oily_scalp', label: 'Oily Scalp', emoji: '💧' },
  { id: 'split_ends', label: 'Split Ends', emoji: '✂️' },
  { id: 'premature_greying', label: 'Premature Greying', emoji: '👵' },
  { id: 'slow_growth', label: 'Slow Growth', emoji: '🌱' }
]

const BODY_CONCERNS = [
  { id: 'tanning', label: 'Sun Tanning', emoji: '☀️' },
  { id: 'strawberry_legs', label: 'Strawberry Legs / Arms', emoji: '🍓' },
  { id: 'pigmentation', label: 'Pigmentation', emoji: '🎭' },
  { id: 'body_acne', label: 'Body Acne (Bacne)', emoji: '😣' },
  { id: 'dryness_roughness', label: 'Dryness & Roughness', emoji: '🍂' },
  { id: 'stretch_marks', label: 'Stretch Marks', emoji: '〰️' },
  { id: 'ingrown_hair', label: 'Ingrown Hair', emoji: '🪒' }
]

function Profile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        localStorage.setItem('profilePic', base64String)
        setProfilePic(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedConcerns, setSelectedConcerns] = useState([])
  
  // Custom Profile states
  const [facialProfile, setFacialProfile] = useState({ skinType: 'normal', skinConcerns: [] })
  const [hairProfile, setHairProfile] = useState({ hairType: 'straight', hairPorosity: 'normal', hairConcerns: [] })
  const [bodyProfile, setBodyProfile] = useState({ bodyType: 'normal', bodyConcerns: [] })

  // Inline Concerns Edit Modal states
  const [editModalType, setEditModalType] = useState(null) // 'face', 'hair', 'body' or null
  const [tempConcerns, setTempConcerns] = useState([])

  const openInlineEditModal = (type) => {
    setEditModalType(type)
    if (type === 'face') {
      setTempConcerns(facialProfile.skinConcerns || [])
    } else if (type === 'hair') {
      setTempConcerns(hairProfile.hairConcerns || [])
    } else if (type === 'body') {
      setTempConcerns(bodyProfile.bodyConcerns || [])
    }
  }

  const handleSaveInlineConcerns = () => {
    if (editModalType === 'face') {
      const updated = { ...facialProfile, skinConcerns: tempConcerns }
      localStorage.setItem('facialProfile', JSON.stringify(updated))
      setFacialProfile(updated)
      setSelectedConcerns(tempConcerns) // keep form sync
    } else if (editModalType === 'hair') {
      const updated = { ...hairProfile, hairConcerns: tempConcerns }
      localStorage.setItem('hairProfile', JSON.stringify(updated))
      setHairProfile(updated)
    } else if (editModalType === 'body') {
      const updated = { ...bodyProfile, bodyConcerns: tempConcerns }
      localStorage.setItem('bodyProfile', JSON.stringify(updated))
      setBodyProfile(updated)
    }
    setEditModalType(null)
  }

  // City search states
  const [cityInput, setCityInput] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  // Orders & Tracking states
  const [orders, setOrders] = useState([])
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Load local storage values
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const city = JSON.parse(localStorage.getItem('userCity') || '{}')
    const facial = JSON.parse(localStorage.getItem('facialProfile') || '{"skinType":"normal","skinConcerns":[]}')
    const hair = JSON.parse(localStorage.getItem('hairProfile') || '{"hairType":"straight","hairPorosity":"normal","hairConcerns":[]}')
    const body = JSON.parse(localStorage.getItem('bodyProfile') || '{"bodyType":"normal","bodyConcerns":[]}')
    const savedOrders = JSON.parse(localStorage.getItem('rasa_orders') || '[]')
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const count = savedCart.reduce((sum, item) => sum + (item.quantity || 1), 0)

    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }

    setName(user.name || '')
    setEmail(user.email || '')
    setFacialProfile(facial)
    setHairProfile(hair)
    setBodyProfile(body)
    setSelectedType(facial.skinType || '')
    setSelectedConcerns(facial.skinConcerns || [])
    setSelectedCity(city.name ? city : null)
    setCityInput(city.name || '')
    setOrders(savedOrders)
    setCartCount(count)
    setProfilePic(localStorage.getItem('profilePic') || '')
  }, [navigate])

  // Search cities using OpenStreetMap Nominatim API
  useEffect(() => {
    if (cityInput.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${cityInput}+india&format=json&limit=5&addressdetails=1`
        )
        const data = await res.json()
        const cities = data.filter(item =>
          item.type === 'city' ||
          item.type === 'town' ||
          item.type === 'village' ||
          item.class === 'place'
        ).map(item => ({
          name: item.display_name.split(',')[0],
          fullName: item.display_name,
          state: item.address?.state || '',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }))
        setSearchResults(cities)
      } catch (err) {
        console.error('Search error:', err)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [cityInput])

  const toggleConcern = (concernId) => {
    setSelectedConcerns(prev =>
      prev.includes(concernId)
        ? prev.filter(id => id !== concernId)
        : [...prev, concernId]
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userCity')
    localStorage.removeItem('facialProfile')
    navigate('/login')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg('')
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        {
          name,
          city: selectedCity,
          skinType: selectedType,
          skinConcerns: selectedConcerns
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.user) {
        const updated = response.data.user
        // Update local storage
        localStorage.setItem('user', JSON.stringify({
          id: updated.id,
          name: updated.name,
          email: updated.email
        }))
        localStorage.setItem('userCity', JSON.stringify(updated.city || {}))
        localStorage.setItem('facialProfile', JSON.stringify({
          skinType: updated.skinType,
          skinConcerns: updated.skinConcerns
        }))

        setSuccessMsg('Profile updated successfully! 🌿')
        setIsEditing(false)
        setTimeout(() => setSuccessMsg(''), 4000)
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const activeSkinTypeInfo = skinTypes.find(t => t.id === selectedType)

  return (
    <div className="profile-page">
      {/* Professional Desktop Header */}
      <header className="desktop-header">
        <div className="header-logo" onClick={() => navigate('/home')}>
          <span className="logo-icon">🌿</span>
          <span className="logo-text">RASA <span className="logo-sub">SKINCARE</span></span>
        </div>
        <nav className="header-nav">
          <a href="/home#hero-section" className="nav-link">Home</a>
          <a href="/home#climate-section" className="nav-link">Weather Tips</a>
          <a href="/home#routine-section" className="nav-link">Routines</a>
          <a href="/home#products-section" className="nav-link">Bestsellers</a>
        </nav>
        <div className="header-actions">
          <button className="btn-shop-now" onClick={() => navigate('/home')}>Shop Now</button>
          
          <button className="btn-cart" onClick={() => navigate('/home')} title="View Cart">
            🛒 Cart <span className="cart-count">{cartCount}</span>
          </button>
          
          <div className="header-avatar-wrap" onClick={() => navigate('/profile')} title="View Profile">
            <div className="header-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {profilePic ? (
                <img src={profilePic} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                name?.[0]?.toUpperCase() || 'R'
              )}
            </div>
            <span className="avatar-name">{name || 'Profile'}</span>
          </div>
        </div>
      </header>

      <div className="profile-container">

      {successMsg && (
        <div className="profile-toast">
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="profile-card main-card animate-fade">
        <div className="avatar-large-wrapper" style={{ position: 'relative', marginBottom: '16px' }}>
          <div className="avatar-large" onClick={() => fileInputRef.current.click()} title="Upload profile picture" style={{ margin: 0 }}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              name?.[0]?.toUpperCase() || 'R'
            )}
            <div className="avatar-upload-overlay">
              <span>📷</span>
            </div>
          </div>
          {profilePic && (
            <button
              type="button"
              className="btn-delete-avatar"
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm("Remove profile picture?")) {
                  localStorage.removeItem('profilePic')
                  setProfilePic('')
                }
              }}
              title="Delete profile picture"
            >
              🗑️
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageUpload}
        />
        <h3 className="profile-name-text">{name || 'Beautiful User'}</h3>
        <p className="profile-email-text">{email}</p>
        
        {!isEditing && (
          <button 
            className="btn-edit-toggle"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Profile Settings
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="profile-edit-form animate-slide" onSubmit={handleSave}>
          <div className="profile-section">
            <h4 className="section-heading">Personal Details</h4>
            <div className="input-group-profile">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
            
            <div className="input-group-profile select-city-group">
              <label>Location / City</label>
              <input
                type="text"
                value={cityInput}
                onChange={e => {
                  setCityInput(e.target.value)
                  if (!e.target.value) setSelectedCity(null)
                }}
                placeholder="Search for your city..."
              />
              {searchResults.length > 0 && (
                <ul className="city-search-dropdown">
                  {searchResults.map((city, idx) => (
                    <li 
                      key={idx} 
                      onClick={() => {
                        setSelectedCity(city)
                        setCityInput(city.name)
                        setSearchResults([])
                      }}
                    >
                      📍 {city.name}, <span className="city-state">{city.state}</span>
                    </li>
                  ))}
                </ul>
              )}
              {selectedCity && (
                <p className="selected-city-badge">
                  Selected: 📍 {selectedCity.name}, {selectedCity.state}
                </p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h4 className="section-heading">Skin Profile</h4>
            <label className="section-label">Skin Type</label>
            <div className="skin-type-picker">
              {skinTypes.map(type => (
                <div
                  key={type.id}
                  className={`skin-picker-card ${selectedType === type.id ? 'active' : ''}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <p className="skin-picker-title">{type.label}</p>
                  <p className="skin-picker-desc">{type.desc}</p>
                </div>
              ))}
            </div>

            <label className="section-label" style={{ marginTop: '20px', display: 'block' }}>
              Concerns
            </label>
            <div className="concerns-picker">
              {SKIN_CONCERNS.map(concern => (
                <button
                  key={concern.id}
                  type="button"
                  className={`concern-chip-edit ${selectedConcerns.includes(concern.id) ? 'active' : ''}`}
                  onClick={() => toggleConcern(concern.id)}
                >
                  <span>{concern.emoji}</span> {concern.label}
                </button>
              ))}
            </div>
          </div>

          <div className="profile-action-buttons">
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Saving...' : '✓ Save Profile'}
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => {
                // Revert to local storage values
                const user = JSON.parse(localStorage.getItem('user') || '{}')
                const city = JSON.parse(localStorage.getItem('userCity') || '{}')
                const facialProfile = JSON.parse(localStorage.getItem('facialProfile') || '{}')
                setName(user.name || '')
                setSelectedType(facialProfile.skinType || '')
                setSelectedConcerns(facialProfile.skinConcerns || [])
                setSelectedCity(city.name ? city : null)
                setCityInput(city.name || '')
                setIsEditing(false)
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details-display animate-fade">
          {/* Location Badge */}
          <div className="profile-detail-row">
            <span className="row-icon">📍</span>
            <div className="row-content">
              <p className="row-label">Location</p>
              <p className="row-value">{selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : 'Not set'}</p>
            </div>
          </div>

          {/* Skin Type Badge */}
          <div className="profile-detail-row">
            <span className="row-icon">🌸</span>
            <div className="row-content">
              <p className="row-label">Skin Type</p>
              <p className="row-value" style={{ textTransform: 'capitalize' }}>
                {activeSkinTypeInfo ? activeSkinTypeInfo.label : 'Not set'}
              </p>
              {activeSkinTypeInfo && (
                <p className="row-sub">{activeSkinTypeInfo.desc}</p>
              )}
            </div>
          </div>

          {/* Face Concerns */}
          <div className="profile-detail-row">
            <span className="row-icon">🌸</span>
            <div className="row-content" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p className="row-label" style={{ margin: 0 }}>Face Concerns</p>
                <button type="button" className="btn-edit-inline" onClick={() => openInlineEditModal('face')}>✏️ Edit</button>
              </div>
              {facialProfile.skinConcerns?.length > 0 ? (
                <div className="concerns-display-list">
                  {facialProfile.skinConcerns.map(cid => {
                    const matched = SKIN_CONCERNS.find(c => c.id === cid)
                    return matched ? (
                      <span key={cid} className="display-concern-tag">
                        {matched.emoji} {matched.label}
                      </span>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="row-value">No face concerns selected</p>
              )}
            </div>
          </div>

          {/* Hair Concerns */}
          <div className="profile-detail-row">
            <span className="row-icon">💆</span>
            <div className="row-content" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p className="row-label" style={{ margin: 0 }}>Hair Concerns</p>
                <button type="button" className="btn-edit-inline" onClick={() => openInlineEditModal('hair')}>✏️ Edit</button>
              </div>
              {hairProfile.hairConcerns?.length > 0 ? (
                <div className="concerns-display-list">
                  {hairProfile.hairConcerns.map(cid => {
                    const matched = HAIR_CONCERNS.find(c => c.id === cid)
                    return matched ? (
                      <span key={cid} className="display-concern-tag">
                        {matched.emoji} {matched.label}
                      </span>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="row-value">No hair concerns selected</p>
              )}
            </div>
          </div>

          {/* Body Concerns */}
          <div className="profile-detail-row">
            <span className="row-icon">🧴</span>
            <div className="row-content" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p className="row-label" style={{ margin: 0 }}>Body Concerns</p>
                <button type="button" className="btn-edit-inline" onClick={() => openInlineEditModal('body')}>✏️ Edit</button>
              </div>
              {bodyProfile.bodyConcerns?.length > 0 ? (
                <div className="concerns-display-list">
                  {bodyProfile.bodyConcerns.map(cid => {
                    const matched = BODY_CONCERNS.find(c => c.id === cid)
                    return matched ? (
                      <span key={cid} className="display-concern-tag">
                        {matched.emoji} {matched.label}
                      </span>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="row-value">No body concerns selected</p>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div className="orders-section" style={{ marginTop: '28px', borderTop: '1px solid #FDF1EB', paddingTop: '20px' }}>
            <h4 className="section-heading" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '12px' }}>
              My Orders & Tracking 📦
            </h4>
            {orders.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#888888', fontStyle: 'italic', margin: '0 0 10px 10px' }}>
                No orders placed yet. Start shopping! 🌿
              </p>
            ) : (
              <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.map(order => (
                  <div key={order.id} className="order-item-card">
                    <div className="order-item-header">
                      <div>
                        <p className="order-id-label">Order #{order.id}</p>
                        <p className="order-date">{order.date}</p>
                      </div>
                      <span className="order-status-badge">{order.status}</span>
                    </div>
                    <div className="order-item-details">
                      <p className="order-total">Total: <strong>₹{order.total}</strong> ({order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''})</p>
                      <button 
                        type="button"
                        className="btn-track-order"
                        onClick={() => setActiveTrackingOrder(order)}
                      >
                        📍 Track Delivery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div style={{ marginTop: '40px', padding: '0 10px' }}>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Logout from Rasa
            </button>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {activeTrackingOrder && (
        <div className="tracking-modal-overlay" onClick={() => setActiveTrackingOrder(null)}>
          <div className="tracking-modal-content animate-slide" onClick={e => e.stopPropagation()}>
            <div className="tracking-modal-header">
              <h3>Track Delivery 📍</h3>
              <button type="button" className="close-modal-btn" onClick={() => setActiveTrackingOrder(null)}>×</button>
            </div>
            
            <div className="order-summary-box-profile">
              <p><strong>Tracking ID:</strong> {activeTrackingOrder.id}</p>
              <p><strong>Deliver to:</strong> {activeTrackingOrder.address?.name}</p>
              <p><strong>Address:</strong> {activeTrackingOrder.address?.street}, {activeTrackingOrder.address?.city} - {activeTrackingOrder.address?.pincode}</p>
              <p><strong>Payment Mode:</strong> {activeTrackingOrder.paymentOption?.toUpperCase()}</p>
              <p><strong>Total Amount:</strong> ₹{activeTrackingOrder.total}</p>
            </div>

            <div className="tracking-timeline-profile">
              <div className="tracking-step done">
                <div className="tracking-dot-profile"></div>
                <span className="tracking-label-profile">Order Confirmed</span>
                <span className="tracking-time-profile">Today, Just now</span>
              </div>
              <div className="tracking-step active">
                <div className="tracking-dot-profile"></div>
                <span className="tracking-label-profile">Packed & Dispatched</span>
                <span className="tracking-time-profile">Processing at hub</span>
              </div>
              <div className="tracking-step">
                <div className="tracking-dot-profile"></div>
                <span className="tracking-label-profile">Shipped</span>
                <span className="tracking-time-profile">In Transit via Rasa Express</span>
              </div>
              <div className="tracking-step">
                <div className="tracking-dot-profile"></div>
                <span className="tracking-label-profile">Out for Delivery</span>
                <span className="tracking-time-profile">Pending courier assignment</span>
              </div>
              <div className="tracking-step">
                <div className="tracking-dot-profile"></div>
                <span className="tracking-label-profile">Delivered</span>
                <span className="tracking-time-profile">Expected {activeTrackingOrder.deliveryOption === 'express' ? 'Tomorrow' : 'in 3-5 days'}</span>
              </div>
            </div>
            
            <button type="button" className="btn-close-tracking" onClick={() => setActiveTrackingOrder(null)}>Close Track Window</button>
          </div>
        </div>
      )}
      {editModalType && (
        <div className="profile-edit-modal-overlay">
          <div className="profile-edit-modal">
            <div className="modal-header">
              <h3>
                Edit {editModalType === 'face' ? 'Face' : editModalType === 'hair' ? 'Hair' : 'Body'} Concerns
              </h3>
              <button type="button" className="close-modal-btn" onClick={() => setEditModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <h4 style={{ marginBottom: '16px' }}>Select Concerns</h4>
              <div className="modal-concerns-grid">
                {(editModalType === 'face' ? SKIN_CONCERNS : editModalType === 'hair' ? HAIR_CONCERNS : BODY_CONCERNS).map(concern => (
                  <button
                    key={concern.id}
                    type="button"
                    className={`modal-concern-btn ${tempConcerns.includes(concern.id) ? 'active' : ''}`}
                    onClick={() => {
                      setTempConcerns(prev =>
                        prev.includes(concern.id)
                          ? prev.filter(c => c !== concern.id)
                          : [...prev, concern.id]
                      )
                    }}
                  >
                    <span>{concern.emoji} {concern.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-modal-cancel" onClick={() => setEditModalType(null)}>Cancel</button>
              <button type="button" className="btn-modal-save" onClick={handleSaveInlineConcerns}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Profile
