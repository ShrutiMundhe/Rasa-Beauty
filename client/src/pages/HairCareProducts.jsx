import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './HairCareProducts.css'

const API_BASE_URL = 'https://rasa-beauty.onrender.com';

const HAIR_CATEGORIES = [
  { id: 'Oil', name: 'Step 1: Prep & Oil 🌿', desc: 'Nourish scalp roots, stimulate follicles, and prevent hair fall' },
  { id: 'Shampoo', name: 'Step 2: Cleanse 🧼', desc: 'Clear away scalp sweat, product buildup, and excess oil' },
  { id: 'Conditioner', name: 'Step 3: Condition 🧴', desc: 'Hydrate hair strands, seal cuticles, and eliminate frizz' },
  { id: 'Serum', name: 'Step 4: Treat & Style ✨', desc: 'Rebuild cuticle structure, lock in hydration, and add mirror shine' }
]

const HAIR_TYPES = [
  { id: 'straight', label: 'Straight', desc: 'Sleek, flat' },
  { id: 'wavy', label: 'Wavy', desc: 'S-shape waves' },
  { id: 'curly', label: 'Curly', desc: 'Defined ringlets' },
  { id: 'coily', label: 'Coily', desc: 'Tight coils' }
]

const HAIR_POROSITY = [
  { id: 'low', label: 'Low', desc: 'Hard to wet' },
  { id: 'normal', label: 'Normal', desc: 'Holds moisture well' },
  { id: 'high', label: 'High', desc: 'Gets wet fast' }
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

function HairCareProducts() {
  const navigate = useNavigate()
  const [hairProfile, setHairProfile] = useState({ hairType: 'straight', hairPorosity: 'normal', hairConcerns: [] })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [weather, setWeather] = useState(null)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('Oil')
  const [mamaTip, setMamaTip] = useState('')
  const [mamaTipLoading, setMamaTipLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [modalHairType, setModalHairType] = useState('straight')
  const [modalHairPorosity, setModalHairPorosity] = useState('normal')
  const [modalHairConcerns, setModalHairConcerns] = useState([])

  const openEditModal = () => {
    setModalHairType(hairProfile.hairType)
    setModalHairPorosity(hairProfile.hairPorosity)
    setModalHairConcerns(hairProfile.hairConcerns)
    setShowEditModal(true)
  }

  const handleSaveProfile = () => {
    const updated = { hairType: modalHairType, hairPorosity: modalHairPorosity, hairConcerns: modalHairConcerns }
    localStorage.setItem('hairProfile', JSON.stringify(updated))
    setHairProfile(updated)
    setShowEditModal(false)
    fetchWeatherAndRecommendations(updated)
  }

  // Load profile and cart
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('hairProfile') || '{"hairType":"straight","hairPorosity":"normal","hairConcerns":[]}')
    setHairProfile(profile)

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
          hairType: profile.hairType,
          hairConcerns: profile.hairConcerns,
          humidity: weatherData.humidity,
          uvIndex: weatherData.uvIndex,
          category: 'Hair Care'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Filter for Hair Care products
      const hairCareList = productsRes.data.products.filter(p => p.category === 'Hair Care')
      setProducts(hairCareList)

      // Fetch AI tip & mamaTip
      setMamaTipLoading(true)
      try {
        const tipRes = await axios.post(
          `${API_BASE_URL}/api/tips/generate`,
          {
            city: userCity.name,
            hairType: profile.hairType,
            hairConcerns: profile.hairConcerns,
            weather: weatherData
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setMamaTip(tipRes.data.mamaTip)
      } catch (err) {
        console.error('Error fetching AI tips:', err)
        setMamaTip('Apply warm warm amla or bhringraj oil to nourish your scalp roots today.')
      } finally {
        setMamaTipLoading(false)
      }
    } catch (err) {
      console.error('Error fetching hair care recommendations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('hairProfile') || '{"hairType":"straight","hairPorosity":"normal","hairConcerns":[]}')
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
    if (name.includes('oil')) return 'Oil'
    if (name.includes('shampoo')) return 'Shampoo'
    if (name.includes('conditioner')) return 'Conditioner'
    if (name.includes('serum')) return 'Serum'
    return 'Shampoo' // fallback
  }

  // Generate personalized explanation of why product is good for user
  const getPersonalizedExplanation = (product) => {
    const explanationPoints = []

    // 1. Hair type suit
    explanationPoints.push(
      <li key="hair-type">
        ✨ Formulated for your <strong>{hairProfile.hairType}</strong> hair with <strong>{hairProfile.hairPorosity} porosity</strong> care.
      </li>
    )

    // 2. Concern matches
    const matchedConcerns = []
    product.suitability?.concerns?.forEach(c => {
      if (hairProfile.hairConcerns?.includes(c)) {
        matchedConcerns.push(c.replace('_', ' '))
      } else if (c === 'frizzy_hair' && hairProfile.hairConcerns?.includes('dryness_frizz')) {
        matchedConcerns.push('frizz')
      } else if (c === 'dry_hair' && hairProfile.hairConcerns?.includes('dryness_frizz')) {
        matchedConcerns.push('dryness')
      }
    })

    if (matchedConcerns.length > 0) {
      explanationPoints.push(
        <li key="concerns">
          🎯 Directly targets your concern: <strong>{matchedConcerns.join(', ')}</strong>.
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
    <div className="hair-products-page">
      {/* Header navbar */}
      <header className="hair-products-header">
        <div className="header-back" onClick={() => navigate('/home')}>
          ← Back to Dashboard
        </div>
        <div className="header-title">
          <h2>RASA</h2>
          <span>HAIR CARE 💆</span>
        </div>
        <div className="header-cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </div>
      </header>

      {/* Hero hair profile banner */}
      <section className="hair-profile-banner">
        <div className="banner-left">
          <span className="badge-profile">YOUR HAIR PROFILE</span>
          <h2>Personalised Hair Care Recommendations</h2>
          <p>
            We've analysed your profile: <strong>{hairProfile.hairType.toUpperCase()}</strong> Hair ({hairProfile.hairPorosity.toUpperCase()} Porosity) 
            {hairProfile.hairConcerns.length > 0 && (
              <>
                {' '}targeting <strong>{hairProfile.hairConcerns.map(c => c.replace('_', ' ')).join(', ')}</strong>
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
            ✏️ Edit Hair Profile
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
              <p className="mama-tip-subtitle">AI-generated traditional care for your {hairProfile.hairType} hair</p>
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
          {HAIR_CATEGORIES.map(cat => {
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
          <p>{HAIR_CATEGORIES.find(c => c.id === activeTab)?.desc}</p>
        </div>
      </div>

      {/* Products Grid */}
      <main className="hair-products-main">
        {loading ? (
          <div className="hair-loading">
            <span className="loading-spinner">🌿</span>
            <p>Tailoring matching formulas to your hair profile...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="hair-no-products">
            <p className="no-p-emoji">🔍</p>
            <h4>No products found in this category</h4>
            <p>Try updating your hair profile or concerns to see recommended items.</p>
          </div>
        ) : (
          <div className="hair-grid">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="hair-product-card"
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
                    <h4 className="explanation-title">🌿 Why it suits your hair:</h4>
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
              <h3>Edit Hair Profile</h3>
              <button className="close-modal-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <h4>Select Hair Type</h4>
              <div className="modal-skin-types-grid">
                {HAIR_TYPES.map(type => (
                  <button
                    key={type.id}
                    className={`modal-type-btn ${modalHairType === type.id ? 'active' : ''}`}
                    onClick={() => setModalHairType(type.id)}
                  >
                    <strong>{type.label}</strong>
                    <span>{type.desc}</span>
                  </button>
                ))}
              </div>

              <h4 style={{ marginTop: '20px' }}>Select Hair Porosity</h4>
              <div className="modal-hair-porosity-grid">
                {HAIR_POROSITY.map(por => (
                  <button
                    key={por.id}
                    className={`modal-type-btn ${modalHairPorosity === por.id ? 'active' : ''}`}
                    onClick={() => setModalHairPorosity(por.id)}
                  >
                    <strong>{por.label}</strong>
                    <span>{por.desc}</span>
                  </button>
                ))}
              </div>
              
              <h4 style={{ marginTop: '20px' }}>Select Concerns</h4>
              <div className="modal-concerns-grid">
                {HAIR_CONCERNS.map(concern => (
                  <button
                    key={concern.id}
                    className={`modal-concern-btn ${modalHairConcerns.includes(concern.id) ? 'active' : ''}`}
                    onClick={() => {
                      setModalHairConcerns(prev =>
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

export default HairCareProducts
