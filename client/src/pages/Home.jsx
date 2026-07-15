import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Home.css'

// Support Vite, Create React App, and fall back to the deployed Render backend
const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_URL ||
  'https://rasa-beauty.onrender.com';

const CATEGORIES = [
  'All', 'Serum', 'Moisturiser', 'Sunscreen',
  'Cleanser', 'Mask', 'Toner', 'Eye Care', 'Lip Care',
  'Body Care', 'Hair Care'
]

const FOCUS_CATEGORIES = [
  {
    id: 'facial',
    label: 'Facial Care',
    emoji: '🌸',
    image: '/images/facial.png',
    categoryFilter: 'All',
    actionType: 'facial-care-page'
  },
  {
    id: 'hair',
    label: 'Hair Care',
    emoji: '💆',
    image: '/images/hair.png',
    categoryFilter: 'Hair Care',
    actionType: 'hair-care-page'
  },
  {
    id: 'body',
    label: 'Body Care',
    emoji: '🧴',
    image: '/images/body.png',
    categoryFilter: 'Body Care',
    actionType: 'body-care-page'
  },
  {
    id: 'eye',
    label: 'Eye Care',
    emoji: '👁️',
    image: '/images/eye.png',
    categoryFilter: 'Eye Care',
    actionType: 'eye-care-page'
  },
  {
    id: 'lip',
    label: 'Lip Care',
    emoji: '💋',
    image: '/images/lip.png',
    categoryFilter: 'Lip Care',
    actionType: 'lip-care-page'
  }
]

function Home() {
  const navigate = useNavigate()
  const [weather, setWeather] = useState(null)
  const [tip, setTip] = useState(null)
  const [mamaTip, setMamaTip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tipLoading, setTipLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  // AI Custom Routine States
  const [routineModalOpen, setRoutineModalOpen] = useState(false)
  const [customRoutineProducts, setCustomRoutineProducts] = useState('')
  const [generatedRoutine, setGeneratedRoutine] = useState(null)
  const [generatingRoutine, setGeneratingRoutine] = useState(false)

  // Confetti feedback states
  const [confetti, setConfetti] = useState([])

  const triggerConfetti = (emoji) => {
    const newConfetti = []
    const count = 20
    for (let i = 0; i < count; i++) {
      newConfetti.push({
        id: Math.random(),
        emoji: emoji,
        left: Math.random() * 100 + 'vw',
        top: Math.random() * 50 + 20 + 'vh',
        size: Math.floor(Math.random() * 16 + 18) + 'px',
        delay: Math.random() * 0.25 + 's',
        duration: Math.random() * 0.6 + 0.5 + 's',
        angle: Math.random() * 360 + 'deg',
        floatDistance: -(Math.random() * 150 + 100) + 'px'
      })
    }
    setConfetti(newConfetti)
    setTimeout(() => {
      setConfetti([])
    }, 1100)
  }

  const handleGenerateRoutine = async () => {
    setGeneratingRoutine(true)
    try {
      const token = localStorage.getItem('token')
      const savedOrders = JSON.parse(localStorage.getItem('rasa_orders') || '[]')
      const purchasedProducts = []
      savedOrders.forEach(order => {
        order.items?.forEach(item => {
          if (item.name && !purchasedProducts.includes(item.name)) {
            purchasedProducts.push(item.name)
          }
        })
      })

      const res = await axios.post(
        `${API_BASE_URL}/api/tips/routine`,
        {
          purchasedProducts,
          customProducts: customRoutineProducts,
          skinType: facialProfile?.skinType || 'normal',
          skinConcerns: facialProfile?.skinConcerns || [],
          hairType: hairProfile?.hairType || 'straight',
          hairConcerns: hairProfile?.hairConcerns || [],
          weather: weather
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setGeneratedRoutine(res.data)
    } catch (err) {
      console.error(err)
      alert('Could not generate routine. Please try again.')
    } finally {
      setGeneratingRoutine(false)
    }
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (productId, amount) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + amount
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const handleCheckout = () => {
    localStorage.setItem('cart', JSON.stringify(cart))
    navigate('/checkout')
  }

  const handleFocusAreaClick = (cat) => {
    if (cat.actionType === 'facial-care-page') {
      navigate('/facial-care')
    } else if (cat.actionType === 'hair-care-page') {
      navigate('/hair-care')
    } else if (cat.actionType === 'body-care-page') {
      navigate('/body-care')
    } else if (cat.actionType === 'eye-care-page') {
      navigate('/eye-care')
    } else if (cat.actionType === 'lip-care-page') {
      navigate('/lip-care')
    } else if (cat.actionType === 'onboarding') {
      navigate('/onboarding/facial')
    } else {
      setActiveCategory(cat.categoryFilter)
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const city = JSON.parse(localStorage.getItem('userCity') || '{}')
  const facialProfile = JSON.parse(localStorage.getItem('facialProfile') || '{}')
  const hairProfile = JSON.parse(localStorage.getItem('hairProfile') || '{}')
  const bodyProfile = JSON.parse(localStorage.getItem('bodyProfile') || '{}')



  const fetchWeather = async () => {
    try {
      const token = localStorage.getItem('token')
      const cityName = city?.name || 'Mumbai'
      const lat = city?.lat
      const lon = city?.lng
      let url = `${API_BASE_URL}/api/weather?city=${cityName}`
      if (lat !== undefined && lon !== undefined) {
        url += `&lat=${lat}&lon=${lon}`
      }
      const res = await axios.get(
        url,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setWeather(res.data)
      return res.data
    } catch (err) {
      const fallback = {
        city: city?.name || 'Mumbai',
        temp: 32, humidity: 78,
        uvIndex: 7, aqi: 64,
        description: 'Partly cloudy'
      }
      setWeather(fallback)
      return fallback
    }
  }

  const fetchTip = async (weatherData) => {
    setTipLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${API_BASE_URL}/api/tips/generate`,
        {
          city: city?.name || 'Mumbai',
          skinType: facialProfile?.skinType || 'normal',
          skinConcerns: facialProfile?.skinConcerns || [],
          weather: weatherData
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTip(res.data.tip)
      setMamaTip(res.data.mamaTip)
    } catch (err) {
      setTip('Stay hydrated today and use a light moisturiser 🌿')
      setMamaTip('Mix rose water with aloe vera and apply as a toner before stepping out.')
    } finally {
      setTipLoading(false)
    }
  }

  const fetchProducts = useCallback(async (weatherData, searchQuery = '', category = 'All') => {
    setProductsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const age = localStorage.getItem('userAge')
      const res = await axios.post(
        `${API_BASE_URL}/api/products/recommend`,
        {
          skinType: facialProfile?.skinType || 'normal',
          skinConcerns: facialProfile?.skinConcerns || [],
          hairType: hairProfile?.hairType || 'straight',
          hairConcerns: hairProfile?.hairConcerns || [],
          bodyType: bodyProfile?.bodyType || 'normal',
          bodyConcerns: bodyProfile?.bodyConcerns || [],
          humidity: weatherData?.humidity || 70,
          uvIndex: weatherData?.uvIndex || 5,
          search: searchQuery,
          category,
          age: age ? parseInt(age) : null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProducts(res.data.products)
    } catch (err) {
      console.error('Products error:', err)
    } finally {
      setProductsLoading(false)
    }
  }, [facialProfile?.skinType, facialProfile?.skinConcerns, hairProfile?.hairType, hairProfile?.hairConcerns, bodyProfile?.bodyType, bodyProfile?.bodyConcerns])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const weatherData = await fetchWeather()
      await fetchTip(weatherData)
      await fetchProducts(weatherData)
      setLoading(false)
    }
    init()
  }, [])

  // Search with debounce
  useEffect(() => {
    if (!weather) return
    const timer = setTimeout(() => {
      fetchProducts(weather, search, activeCategory)
    }, 400)
    return () => clearTimeout(timer)
  }, [search, activeCategory, weather])

  const getWeatherIcon = () => {
    if (!weather) return '🌤️'
    if (weather.humidity > 80) return '🌧️'
    if (weather.humidity > 60) return '⛅'
    if (weather.uvIndex > 8) return '☀️'
    return '🌤️'
  }

  const getAQILabel = (aqi) => {
    if (!aqi) return { label: 'Good', color: '#2D5A3D' }
    if (aqi <= 50) return { label: 'Good', color: '#2D5A3D' }
    if (aqi <= 100) return { label: 'Moderate', color: '#BA7517' }
    if (aqi <= 150) return { label: 'Unhealthy', color: '#C4714A' }
    return { label: 'Very Unhealthy', color: '#A32D2D' }
  }

  if (loading) {
    return (
      <div className="home-loading">
        <span className="loading-logo" style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}>🌿</span>
        <div className="loading-dots">
          <span></span><span></span><span></span>
        </div>
        <p className="loading-text">Personalising Rasa for you 🌿</p>
      </div>
    )
  }

  const aqiInfo = getAQILabel(weather?.aqi)

  return (
    <div className="home-page-container">

      {/* Professional Desktop Header */}
      <header className="desktop-header">
        <div className="header-logo" onClick={() => navigate('/home')}>
          <span className="logo-icon">🌿</span>
          <span className="logo-text">RASA <span className="logo-sub">SKINCARE</span></span>
        </div>
        <nav className="header-nav">
          <a href="#hero-section" className="nav-link">Home</a>
          <a href="#climate-section" className="nav-link">Weather Tips</a>
          <a href="#routine-section" className="nav-link">Routines</a>
          <a href="#products-section" className="nav-link">Bestsellers</a>
        </nav>
        <div className="header-actions">
          <button className="btn-shop-now" onClick={() => {
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
          }}>Shop Now</button>
          
          <button className="btn-cart" onClick={() => setCartOpen(true)} title="View Cart">
            🛒 Cart <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </button>
          
          <div className="header-avatar-wrap" onClick={() => navigate('/profile')} title="View Profile">
            <div className="header-avatar">
              {user?.name?.[0]?.toUpperCase() || 'R'}
            </div>
            <span className="avatar-name">{user?.name || 'Profile'}</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="hero-section">
        <div className="hero-left">
          <span className="badge-science">🔬 Science-Backed Skincare</span>
          <h1 className="hero-main-title">
            Healthy Skin. <br />
            <span className="italic-title">Confident You.</span>
          </h1>
          <p className="hero-main-desc">
            Clean, effective, and cruelty-free skincare crafted for real results. Custom-tailored to protect your skin from your local real-time weather conditions.
          </p>
          <div className="hero-cta-buttons">
            <button className="btn-hero-primary" onClick={() => {
              document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
            }}>Shop Best Sellers →</button>
          </div>
          <div className="hero-trust-indicator">
            <div className="trust-stars">⭐⭐⭐⭐⭐ <span className="rating-text">4.9/5</span></div>
            <p className="trust-users">Trusted by 10,000+ skincare enthusiasts</p>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-main-img-wrap">
            <img 
              src="/images/hero_skincare_bottle.png" 
              alt="Skincare Bottle" 
              className="hero-main-img" 
            />
            <div className="floating-percent-badge">
              <p className="badge-pct">20% OFF</p>
              <p className="badge-sub">For climate-smart routines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Trust Row */}
      <section className="features-row">
        <div className="feature-item">
          <div className="feat-icon">🍃</div>
          <div className="feat-content">
            <h4>Clean & Safe</h4>
            <p>Thoughtfully chosen active ingredients</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feat-icon">🩺</div>
          <div className="feat-content">
            <h4>Dermatologist Tested</h4>
            <p>Clinically proven, safe on sensitive skin</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feat-icon">🐰</div>
          <div className="feat-content">
            <h4>Cruelty Free</h4>
            <p>We love animals and never test on them</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feat-icon">♻️</div>
          <div className="feat-content">
            <h4>Sustainable Beauty</h4>
            <p>Eco-friendly packaging and formulation</p>
          </div>
        </div>
      </section>

      {/* Focus Area Selection Section */}
      <section className="focus-area-section">
        <div className="focus-header">
          <h2 className="focus-title">Choose your focus area and we'll personalise your daily care 🌿</h2>
        </div>
        
        <div className="focus-list">
          {FOCUS_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="focus-card"
              onClick={() => handleFocusAreaClick(cat)}
            >
              <div className="focus-card-left">
                <span className="focus-emoji">{cat.emoji}</span>
                <span className="focus-label">{cat.label}</span>
              </div>
              <div className="focus-card-right">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="focus-img"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Climate & Weather Personalisation Dashboard */}
      <section className="climate-section" id="climate-section">
        <div className="climate-grid-container">
          {/* Left: Weather report */}
          <div className="climate-weather-widget">
            <div className="widget-header">
              <span className="widget-badge">LIVE CLIMATE TRACKER</span>
              <h3>📍 {weather?.city || city?.name || 'Mumbai, IN'}</h3>
              <p className="weather-desc">{weather?.description || 'Partly cloudy'}</p>
            </div>
            
            <div className="widget-temperature-row">
              <span className="temp-icon">{getWeatherIcon()}</span>
              <span className="temp-num">{weather?.temp || '32'}°C</span>
            </div>

            <div className="widget-stats-grid">
              <div className="w-stat">
                <span className="w-stat-icon">💧</span>
                <div>
                  <p className="w-stat-val">{weather?.humidity || '78'}%</p>
                  <p className="w-stat-lbl">Humidity</p>
                </div>
              </div>
              <div className="w-stat">
                <span className="w-stat-icon">☀️</span>
                <div>
                  <p className="w-stat-val">{weather?.uvIndex || '7'}</p>
                  <p className="w-stat-lbl">UV Index</p>
                </div>
              </div>
              <div className="w-stat">
                <span className="w-stat-icon">🌫️</span>
                <div>
                  <p className="w-stat-val" style={{ color: aqiInfo.color }}>{aqiInfo.label}</p>
                  <p className="w-stat-lbl">AQI Status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI smart suggestions */}
          <div className="climate-tips-widget">
            <span className="widget-badge green">AI WEATHER INSIGHTS</span>
            <h4>Personalised for your {facialProfile?.skinType || 'normal'} skin:</h4>
            
            <div className="insights-tips-container">
              <div className="insight-card">
                <p className="insight-label">💡 Daily Skin Tip</p>
                {tipLoading ? (
                  <div className="loading-dots small"><span></span><span></span><span></span></div>
                ) : (
                  <>
                    <p className="insight-text">{tip}</p>
                    <div className="tip-feedback">
                      <button
                        className={`feedback-btn ${feedback === 'yes' ? 'active-yes' : ''}`}
                        onClick={() => {
                          setFeedback('yes')
                          triggerConfetti('👍')
                        }}
                      >👍 Helpful</button>
                      <button
                        className={`feedback-btn ${feedback === 'no' ? 'active-no' : ''}`}
                        onClick={() => {
                          setFeedback('no')
                          triggerConfetti('👎')
                        }}
                      >👎 Unhelpful</button>
                    </div>
                  </>
                )}
              </div>

              <div className="insight-card mama">
                <p className="insight-label">🌿 Herbal Mama Remedy</p>
                {tipLoading ? (
                  <div className="loading-dots small"><span></span><span></span><span></span></div>
                ) : (
                  <p className="insight-text">{mamaTip}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Routine Section */}
      <section className="routine-section" id="routine-section">
        <div className="routine-left">
          <h2>Your Routine. <br />Your Results.</h2>
          <p>We recommend a simple 3-step routine tailored dynamically to your skin type and weather conditions for maximum product absorption.</p>
          <button className="btn-routine-link" onClick={() => setRoutineModalOpen(true)}>Personalise Routine →</button>
        </div>
        
        <div className="routine-right-grid">
          <div className="routine-card">
            <span className="step-num">1</span>
            <div className="routine-card-icon">🧼</div>
            <h4>Cleanse</h4>
            <p>Remove environmental pollutants, dust, and excess sebum without stripping the skin barrier.</p>
          </div>
          <div className="routine-card">
            <span className="step-num">2</span>
            <div className="routine-card-icon">🧪</div>
            <h4>Treat</h4>
            <p>Apply climate-specific active serums to target active breakouts, pigmentation, or dark spots.</p>
          </div>
          <div className="routine-card">
            <span className="step-num">3</span>
            <div className="routine-card-icon">🧴</div>
            <h4>Moisturise</h4>
            <p>Lock in hydration and shield against high humidity or harsh dry air depending on your city's UV.</p>
          </div>
        </div>
      </section>

      {/* Promo Banner middle */}
      <section className="middle-offer-banner">
        <div className="offer-left">
          <h3>Skincare That Loves You Back</h3>
          <p>Flat 20% off on our entire dermatologist-recommended collection. Unlock glowing skin today!</p>
          <button className="btn-shop-offer" onClick={() => {
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
          }}>Unlock Offer</button>
        </div>
      </section>

      {/* Bestsellers Products Header & Filter */}
      <section className="products-listing-section" id="products-section">
        <div className="products-section-header">
          <div>
            <h2 className="section-title-desktop">Our Bestsellers</h2>
            <p className="section-subtitle-desktop">Curated essentials for every skin type.</p>
          </div>
          <div className="desktop-search-filter-row">
            {/* Search */}
            <div className="desktop-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search serums, moisturisers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="clear-search-btn" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>
        </div>

        {/* Desktop Category Tabs */}
        <div className="desktop-category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`desktop-cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="products-loading">
            <div className="loading-dots"><span></span><span></span><span></span></div>
            <p>Finding climate-smart skincare for you...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <p className="no-products-emoji">🔍</p>
            <p className="no-products-text">No products found</p>
            <p className="no-products-sub">Try searching for another skincare item or select a different category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="product-card"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="product-emoji-fallback">
                    {product.category === 'Serum' ? '💧' :
                     product.category === 'Sunscreen' ? '☀️' :
                     product.category === 'Moisturiser' ? '🌿' :
                     product.category === 'Cleanser' ? '✨' :
                     product.category === 'Mask' ? '🌸' :
                     product.category === 'Hair Care' ? '💆' : '🌺'}
                  </div>
                  <span className="product-category-tag">{product.category}</span>
                  {product.score >= 7 && (
                    <span className="product-top-pick">Top Pick</span>
                  )}
                </div>
                <div className="product-info">
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-name">{product.name}</p>
                  <p className="product-why">
                    🌤️ {product.whyToday}
                  </p>
                  <div className="product-ingredients-preview">
                    {product.ingredients.slice(0, 2).map((ing, i) => (
                      <span key={i} className="ingredient-chip">
                        {ing.name.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                  <div className="product-bottom">
                    <div>
                      <span className="product-price">₹{product.price}</span>
                    </div>
                    
                    <div className="product-card-actions">
                      <button
                        className="product-buy-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Buy →
                      </button>
                      <button className="product-cart-btn" onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }} title="Add to Cart">
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title-desktop text-center">Real People. Real Results.</h2>
        <p className="section-subtitle-desktop text-center">See how Rasa is transforming skincare routines based on local climates.</p>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="test-stars">⭐⭐⭐⭐⭐</div>
            <p className="test-text">"My active breakouts have cleared up completely. The daily weather tips helped me realize high humidity was triggering my oily skin!"</p>
            <div className="test-user">
              <div className="user-avatar-placeholder">SM</div>
              <div>
                <h5>Shruti M.</h5>
                <p>Verified Buyer</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="test-stars">⭐⭐⭐⭐⭐</div>
            <p className="test-text">"I love how lightweight and climate-smart the recommended moisturisers are. The sunscreen doesn't leave a white cast even on hot humid days."</p>
            <div className="test-user">
              <div className="user-avatar-placeholder">PK</div>
              <div>
                <h5>Priya K.</h5>
                <p>Verified Buyer</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="test-stars">⭐⭐⭐⭐⭐</div>
            <p className="test-text">"The customization tips are unmatched. Entering my city and getting live recommendations matches what my skin actually needs each morning!"</p>
            <div className="test-user">
              <div className="user-avatar-placeholder">JL</div>
              <div>
                <h5>Jessica L.</h5>
                <p>Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Footer Club */}
      <footer className="desktop-footer">
        <div className="footer-top-signup">
          <h3>Join the Rasa Club</h3>
          <p>Receive skincare tips, custom recipes, and first access to new climate-smart product launches.</p>
          <div className="footer-signup-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="footer-signup-btn">Subscribe →</button>
          </div>
        </div>
        <div className="footer-bottom-copyright">
          <p>© {new Date().getFullYear()} Rasa Skincare. All rights reserved. Clean, Climate-Smart formulations.</p>
        </div>
      </footer>

      {/* Product Detail Modal */}
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

              <div className="modal-rating">
                ₹{selectedProduct.price}
              </div>

              {/* Why for your skin */}
              <div className="modal-section">
                <p className="modal-section-title">✨ Why it suits your skin</p>
                {selectedProduct.matchedReasons?.map((r, i) => (
                  <p key={i} className="modal-reason">✓ {r}</p>
                ))}
                <p className="modal-reason">🌤️ {selectedProduct.weatherReason}</p>
              </div>

              {/* Ingredients */}
              <div className="modal-section">
                <p className="modal-section-title">🔬 Key ingredients</p>
                {selectedProduct.ingredients.map((ing, i) => (
                  <div key={i} className="modal-ingredient">
                    <p className="modal-ing-name">{ing.name}</p>
                    <p className="modal-ing-benefit">{ing.benefit}</p>
                  </div>
                ))}
              </div>

              {/* Mama Tip */}
              <div className="modal-mama">
                <p className="modal-mama-label">🌿 Mama Tip</p>
                <p className="modal-mama-text">{selectedProduct.mamaTip}</p>
              </div>

               <button
                 className="modal-buy-btn"
                 onClick={() => {
                   addToCart(selectedProduct);
                   setSelectedProduct(null);
                 }}
               >
                 Add to Cart 🌿
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Slider Overlay */}
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
                    <div className="cart-item-img-wrap">
                      <img src={item.image} alt={item.name} className="cart-item-img" onError={e => { e.target.style.display = 'none' }} />
                    </div>
                    <div className="cart-item-details">
                      <p className="cart-item-brand">{item.brand}</p>
                      <p className="cart-item-name">{item.name}</p>
                      <div className="cart-item-price-row">
                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                        <div className="cart-item-qty">
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                          <span className="qty-val">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                        <button className="btn-remove-item" onClick={() => removeFromCart(item.id)} title="Remove Item">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-summary-row">
                <span>Subtotal:</span>
                <span className="cart-summary-total">₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
              </div>
              <button className="btn-checkout" disabled={cart.length === 0} onClick={handleCheckout}>
                Purchase Now 🌿
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Personalised Routine Modal */}
      {routineModalOpen && (
        <div className="routine-modal-overlay" onClick={() => setRoutineModalOpen(false)}>
          <div className="routine-modal-content animate-slide" onClick={e => e.stopPropagation()}>
            <div className="routine-modal-header">
              <h3>AI Personalised Routine 🌿</h3>
              <button className="routine-modal-close" onClick={() => setRoutineModalOpen(false)}>✕</button>
            </div>

            <div className="routine-modal-body">
              {!generatedRoutine ? (
                <div className="routine-input-view">
                  <p className="routine-intro-text">
                    Let Rasa's AI build a customized step-by-step Morning & Night routine based on the products you purchased from us and other cosmetics you currently use.
                  </p>
                  
                  {/* Purchased list */}
                  <div className="routine-purchases-box">
                    <h5>🛍️ Products Purchased from Rasa:</h5>
                    {(() => {
                      const savedOrders = JSON.parse(localStorage.getItem('rasa_orders') || '[]')
                      const purchasedList = []
                      savedOrders.forEach(o => o.items?.forEach(item => {
                        if (item.name && !purchasedList.includes(item.name)) purchasedList.push(item.name)
                      }))
                      
                      return purchasedList.length === 0 ? (
                        <p className="no-purchases-lbl">No store purchases found. We will build a routine around your custom entry!</p>
                      ) : (
                        <ul className="purchased-list-chips">
                          {purchasedList.map((p, idx) => (
                            <li key={idx} className="purchase-chip">🌿 {p}</li>
                          ))}
                        </ul>
                      )
                    })()}
                  </div>

                  {/* Custom products inputs */}
                  <div className="routine-custom-input-group">
                    <label>📝 Enter other products you currently use:</label>
                    <textarea
                      placeholder="e.g. CeraVe Foaming Cleanser, The Ordinary Niacinamide, Retinol 0.5%, SPF 50 sunscreen..."
                      value={customRoutineProducts}
                      onChange={e => setCustomRoutineProducts(e.target.value)}
                      rows="4"
                    />
                    <span className="input-hint">Separate items with commas to help the AI map each step accurately.</span>
                  </div>

                  <button 
                    className="btn-generate-ai-routine"
                    onClick={handleGenerateRoutine}
                    disabled={generatingRoutine}
                  >
                    {generatingRoutine ? 'Generating your Routine... ⌛' : 'Generate Personalised AI Routine ✨'}
                  </button>
                </div>
              ) : (
                <div className="routine-output-view">
                  <div className="routine-output-intro">
                    <p>Generated for your <strong>{facialProfile?.skinType || 'normal'} skin</strong> under today's weather conditions: <strong>{weather?.temp || 32}°C, {weather?.humidity || 78}% humidity</strong>. 🌤️</p>
                  </div>

                  <div className="routine-split-grid">
                    {/* AM Routine */}
                    <div className="routine-column">
                      <h4 className="column-title am">☀️ Morning (AM) Routine</h4>
                      <div className="routine-steps-list">
                        {generatedRoutine.am?.map((step, idx) => (
                          <div key={idx} className="routine-step-item">
                            <div className="step-badge-wrap">
                              <span className="step-number-tag">{step.step}</span>
                              <span className={`step-action-tag ${step.action?.toLowerCase()}`}>{step.action}</span>
                            </div>
                            <p className="step-product-name">{step.product}</p>
                            <p className="step-instruction-desc">{step.instruction}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PM Routine */}
                    <div className="routine-column">
                      <h4 className="column-title pm">🌙 Evening (PM) Routine</h4>
                      <div className="routine-steps-list">
                        {generatedRoutine.pm?.map((step, idx) => (
                          <div key={idx} className="routine-step-item">
                            <div className="step-badge-wrap">
                              <span className="step-number-tag">{step.step}</span>
                              <span className={`step-action-tag ${step.action?.toLowerCase()}`}>{step.action}</span>
                            </div>
                            <p className="step-product-name">{step.product}</p>
                            <p className="step-instruction-desc">{step.instruction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn-reset-routine"
                    onClick={() => {
                      setGeneratedRoutine(null)
                    }}
                  >
                    ← Edit Products & Re-Generate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confetti Container */}
      <div className="confetti-container">
        {confetti.map(item => (
          <span
            key={item.id}
            className="confetti-item"
            style={{
              left: item.left,
              top: item.top,
              fontSize: item.size,
              animationDelay: item.delay,
              animationDuration: item.duration,
              '--float-dist': item.floatDistance,
              '--rotate-angle': item.angle
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

    </div>
  )
}

export default Home