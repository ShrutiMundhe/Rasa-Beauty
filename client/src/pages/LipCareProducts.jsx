import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './LipCareProducts.css'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LIP_CATEGORIES = [
  { id: 'Balm', name: 'Step 1: Hydrating Balms 🧴', desc: 'Deeply moisturise, repair dry scales, and cure chapped lips' },
  { id: 'SPF', name: 'Step 2: Sun Protection (SPF) ☀️', desc: 'Prevent darkening, pigmentation, and UV damage on lips' }
]

const SKIN_TYPES = [
  { id: 'normal', label: 'Normal', desc: 'Balanced, comfortable' },
  { id: 'dry', label: 'Dry', desc: 'Flaky, tight feeling' },
  { id: 'oily', label: 'Oily', desc: 'Shiny, prone to breakouts' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Reacts easily, redness' }
]

const SKIN_CONCERNS = [
  { id: 'acne', label: 'Acne', emoji: '😣' },
  { id: 'pigmentation', label: 'Pigmentation', emoji: '🎭' },
  { id: 'dark_spots', label: 'Dark spots', emoji: '🌑' },
  { id: 'dullness', label: 'Dull Skin', emoji: '😔' },
  { id: 'wrinkles', label: 'Wrinkles', emoji: '🌊' },
  { id: 'pores', label: 'Open Pores', emoji: '🔬' },
  { id: 'whiteheads', label: 'Whiteheads', emoji: '⚪' },
  { id: 'blackheads', label: 'Blackheads', emoji: '⚫' },
  { id: 'tan', label: 'Sun Tan', emoji: '☀️' },
  { id: 'dryness', label: 'Dryness', emoji: '🌵' },
  { id: 'oiliness', label: 'Excess oil', emoji: '💧' },
  { id: 'sensitivity', label: 'Sensitivity', emoji: '🌸' },
  { id: 'dark_circles', label: 'Dark Circles', emoji: '👁️' },
  { id: 'puffy_eyes', label: 'Puffy Eyes', emoji: '😴' },
  { id: 'uneven_texture', label: 'Uneven Texture', emoji: '🗺️' },
  { id: 'redness', label: 'Redness', emoji: '🔴' },
  { id: 'melasma', label: 'Melasma', emoji: '🌫️' },
  { id: 'sagging', label: 'Sagging', emoji: '📉' }
]

function LipCareProducts() {
  const navigate = useNavigate()
  const [facialProfile, setFacialProfile] = useState({ skinType: 'normal', skinConcerns: [] })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [weather, setWeather] = useState(null)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('Balm')
  const [mamaTip, setMamaTip] = useState('')
  const [mamaTipLoading, setMamaTipLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [modalSkinType, setModalSkinType] = useState('normal')
  const [modalSkinConcerns, setModalSkinConcerns] = useState([])

  const openEditModal = () => {
    setModalSkinType(facialProfile.skinType)
    setModalSkinConcerns(facialProfile.skinConcerns)
    setShowEditModal(true)
  }

  const handleSaveProfile = () => {
    const updated = { skinType: modalSkinType, skinConcerns: modalSkinConcerns }
    localStorage.setItem('facialProfile', JSON.stringify(updated))
    setFacialProfile(updated)
    setShowEditModal(false)
    fetchWeatherAndRecommendations(updated)
  }

  // Load profile and cart
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('facialProfile') || '{"skinType":"normal","skinConcerns":[]}')
    setFacialProfile(profile)

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const fetchWeatherAndRecommendations = useCallback(async (profile) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userCity = JSON.parse(localStorage.getItem('userCity') || '{"name":"Mumbai"}')
      
      // Fetch current weather
      let weatherData
      try {
        const lat = userCity.lat
        const lon = userCity.lng
        let url = `${API_BASE_URL}/api/weather?city=${userCity.name}`
        if (lat !== undefined && lon !== undefined) {
          url += `&lat=${lat}&lon=${lon}`
        }
        const weatherRes = await axios.get(
          url,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        weatherData = weatherRes.data
        setWeather(weatherData)
      } catch (err) {
        weatherData = { temp: 30, humidity: 75, uvIndex: 6, description: 'Partly cloudy' }
        setWeather(weatherData)
      }

      // Fetch recommended products
      const productsRes = await axios.post(
        `${API_BASE_URL}/api/products/recommend`,
        {
          skinType: profile.skinType,
          skinConcerns: profile.skinConcerns,
          humidity: weatherData.humidity,
          uvIndex: weatherData.uvIndex,
          category: 'Lip Care'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Filter for Lip Care products
      const lipCareList = productsRes.data.products.filter(p => p.category === 'Lip Care')
      setProducts(lipCareList)

      // Fetch AI tip & mamaTip
      setMamaTipLoading(true)
      try {
        const tipRes = await axios.post(
          `${API_BASE_URL}/api/tips/generate`,
          {
            city: userCity.name,
            skinType: profile.skinType,
            skinConcerns: profile.skinConcerns,
            type: 'lip',
            weather: weatherData
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setMamaTip(tipRes.data.mamaTip)
      } catch (err) {
        console.error('Error fetching AI tips:', err)
        setMamaTip('Apply a tiny bit of fresh milk cream (malai) or pure ghee on your lips before sleeping to heal chapped lips today.')
      } finally {
        setMamaTipLoading(false)
      }
    } catch (err) {
      console.error('Error fetching lip care recommendations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('facialProfile') || '{"skinType":"normal","skinConcerns":[]}')
    fetchWeatherAndRecommendations(profile)
  }, [fetchWeatherAndRecommendations])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      let updated
      if (existing) {
        updated = prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      } else {
        updated = [...prev, { ...product, quantity: 1 }]
      }
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
    setCartOpen(true)
  }

  const updateQuantity = (productId, amount) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + amount
          return newQty > 0 ? { ...item, quantity: newQty } : item
        }
        return item
      }).filter(item => item.quantity > 0)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const handleCheckout = () => {
    localStorage.setItem('cart', JSON.stringify(cart))
    navigate('/checkout')
  }

  // Get product subcategory type
  const getProductSubcategory = (product) => {
    const name = product.name.toLowerCase()
    if (name.includes('spf') || name.includes('sun')) return 'SPF'
    return 'Balm' // fallback
  }

  // Generate personalized explanation of why product is good for user
  const getPersonalizedExplanation = (product) => {
    const explanationPoints = []

    // 1. Skin type suit
    const suitsType = product.suitability?.skinTypes?.includes('all') || product.suitability?.skinTypes?.includes(facialProfile.skinType)
    if (suitsType) {
      explanationPoints.push(
        <li key="skin-type">
          ✨ Formulated to suit your delicate lip skin under your <strong>{facialProfile.skinType}</strong> facial profile.
        </li>
      )
    }

    // 2. Concern matches
    const matchedConcerns = product.suitability?.concerns?.filter(c =>
      facialProfile.skinConcerns?.includes(c)
    ) || []

    if (matchedConcerns.length > 0) {
      explanationPoints.push(
        <li key="concerns">
          🎯 Directly targets your concern: <strong>{matchedConcerns.map(c => c.replace('_', ' ')).join(', ')}</strong>.
        </li>
      )
    }

    // 3. Ingredient benefits
    if (product.ingredients && product.ingredients.length > 0) {
      explanationPoints.push(
        <li key="ingredients">
          🔬 Contains <strong>{product.ingredients[0].name}</strong>: {product.ingredients[0].benefit}.
        </li>
      )
    }

    // 4. Weather recommendation
    if (product.whyToday) {
      explanationPoints.push(
        <li key="weather" className="weather-benefit">
          🌤️ <strong>Climate suitability:</strong> {product.whyToday}.
        </li>
      )
    }

    return (
      <ul className="personalized-explanation-list">
        {explanationPoints}
      </ul>
    )
  }

  // Filter products by active tab category
  const filteredProducts = products.filter(p => getProductSubcategory(p) === activeTab)

  return (
    <div className="lip-products-page">
      {/* Header navbar */}
      <header className="lip-products-header">
        <div className="header-back" onClick={() => navigate('/home')}>
          ← Back to Dashboard
        </div>
        <div className="header-title">
          <h2>RASA</h2>
          <span>LIP CARE 💋</span>
        </div>
        <div className="header-cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </div>
      </header>

      {/* Hero lip profile banner */}
      <section className="lip-profile-banner">
        <div className="banner-left">
          <span className="badge-profile">YOUR SKIN PROFILE</span>
          <h2>Personalised Lip Care Recommendations</h2>
          <p>
            We've analysed your profile: <strong>{facialProfile.skinType.toUpperCase()}</strong> skin type 
            {facialProfile.skinConcerns.length > 0 && (
              <>
                {' '}targeting <strong>{facialProfile.skinConcerns.map(c => c.replace('_', ' ')).join(', ')}</strong>
              </>
            )}
            {weather && (
              <>
                {' '}optimized for today's weather in {weather.city || 'your city'} (<strong>{weather.temp}°C, {weather.description}</strong>)
              </>
            )}
            .
          </p>
        </div>
        <div className="banner-right">
          <button className="btn-edit-profile" onClick={openEditModal}>
            ✏️ Edit Skin Profile
          </button>
        </div>
      </section>

      {/* Mama Tip Corner */}
      <section className="mama-tip-corner-section">
        <div className="mama-tip-corner-card">
          <div className="mama-tip-header">
            <span className="mama-tip-icon">👵</span>
            <div className="mama-tip-title-box">
              <h3>Dadi's Ayurvedic Remedy</h3>
              <p className="mama-tip-subtitle">AI-generated traditional care for your lips</p>
            </div>
          </div>
          <div className="mama-tip-content">
            {mamaTipLoading ? (
              <div className="mama-tip-loader">
                <span className="loading-leaf">🍃</span> Analysing herbal ingredients...
              </div>
            ) : (
              <p className="mama-tip-text">“ {mamaTip} ”</p>
            )}
          </div>
        </div>
      </section>

      {/* Main product navigation tabs */}
      <div className="category-tabs-container">
        <div className="category-tabs-scroll">
          {LIP_CATEGORIES.map(cat => {
            const count = products.filter(p => getProductSubcategory(p) === cat.id).length
            return (
              <button
                key={cat.id}
                className={`cat-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                <span className="tab-name">{cat.name}</span>
                <span className="tab-count">{count}</span>
              </button>
            )
          })}
        </div>
        <div className="active-tab-desc">
          <p>{LIP_CATEGORIES.find(c => c.id === activeTab)?.desc}</p>
        </div>
      </div>

      {/* Products Grid */}
      <main className="lip-products-main">
        {loading ? (
          <div className="lip-loading">
            <span className="loading-spinner">🌿</span>
            <p>Tailoring matching formulas to your lip profile...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="lip-no-products">
            <p className="no-p-emoji">🔍</p>
            <h4>No products found in this category</h4>
            <p>Try updating your skin concerns to see recommended lip care items.</p>
          </div>
        ) : (
          <div className="lip-grid">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="lip-product-card"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="card-image-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="card-emoji-fallback">🧴</div>
                  {product.score >= 5 && <span className="premium-badge">Highly Recommended</span>}
                </div>

                <div className="card-body">
                  <span className="card-brand">{product.brand}</span>
                  <h3 className="card-name">{product.name}</h3>
                  <div className="card-price-rating">
                    <span className="card-price">₹{product.price}</span>
                    <span className="card-rating">⭐ {product.rating}</span>
                  </div>

                  {/* Why this is good for user */}
                  <div className="personalized-explanation-box">
                    <h4 className="explanation-title">🌿 Why it suits your lips:</h4>
                    {getPersonalizedExplanation(product)}
                  </div>

                  <button
                    className="btn-card-add"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(product)
                    }}
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className="modal-img-wrap">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="modal-img"
                onError={e => e.target.style.display = 'none'}
              />
            </div>
            <div className="modal-body">
              <p className="modal-brand">{selectedProduct.brand}</p>
              <h3 className="modal-name">{selectedProduct.name}</h3>
              <p className="modal-desc">{selectedProduct.description}</p>
              <div className="modal-price-rating">
                <span className="modal-price">₹{selectedProduct.price}</span>
                <span className="modal-rating">⭐ {selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
              </div>

              <div className="modal-section">
                <p className="modal-section-title">✨ Suitability Check</p>
                {selectedProduct.matchedReasons?.map((r, i) => (
                  <p key={i} className="modal-reason">✓ {r}</p>
                ))}
                <p className="modal-reason">🌤️ {selectedProduct.weatherReason}</p>
              </div>

              <div className="modal-section">
                <p className="modal-section-title">🔬 Key Ingredients</p>
                {selectedProduct.ingredients.map((ing, i) => (
                  <div key={i} className="modal-ingredient">
                    <p className="modal-ing-name">{ing.name}</p>
                    <p className="modal-ing-benefit">{ing.benefit}</p>
                  </div>
                ))}
              </div>

              <div className="modal-mama">
                <p className="modal-mama-label">👵 Mama's Remedial Tip</p>
                <p className="modal-mama-text">{selectedProduct.mamaTip}</p>
              </div>

              <button
                className="modal-buy-btn"
                onClick={() => {
                  addToCart(selectedProduct)
                  setSelectedProduct(null)
                }}
              >
                Add to Cart 🌿
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Shopping Cart 🌿</h3>
              <button className="btn-close-cart" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <span className="cart-empty-icon">🛒</span>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h5>{item.name}</h5>
                      <p>₹{item.price}</p>
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span>Total:</span>
                  <strong>₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</strong>
                </div>
                <button className="btn-checkout" onClick={handleCheckout}>
                  PROCEED TO CHECKOUT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="profile-edit-modal-overlay">
          <div className="profile-edit-modal">
            <div className="modal-header">
              <h3>Edit Skin Profile</h3>
              <button className="close-modal-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <h4>Select Skin Type</h4>
              <div className="modal-skin-types-grid">
                {SKIN_TYPES.map(type => (
                  <button
                    key={type.id}
                    className={`modal-type-btn ${modalSkinType === type.id ? 'active' : ''}`}
                    onClick={() => setModalSkinType(type.id)}
                  >
                    <strong>{type.label}</strong>
                    <span>{type.desc}</span>
                  </button>
                ))}
              </div>
              
              <h4 style={{ marginTop: '20px' }}>Select Concerns</h4>
              <div className="modal-concerns-grid">
                {SKIN_CONCERNS.map(concern => (
                  <button
                    key={concern.id}
                    className={`modal-concern-btn ${modalSkinConcerns.includes(concern.id) ? 'active' : ''}`}
                    onClick={() => {
                      setModalSkinConcerns(prev =>
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
              <button className="btn-modal-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-modal-save" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LipCareProducts
