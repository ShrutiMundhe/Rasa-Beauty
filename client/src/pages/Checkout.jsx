import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Checkout.css'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const COUPONS = [
  { code: 'RASA20', discount: 0.20, desc: 'Flat 20% off on your purchase' },
  { code: 'GLOW50', discount: 0.05, desc: 'Extra 5% off for glowing skin' },
  { code: 'FREESHIP', discount: 0.00, freeShipping: true, desc: 'Free Delivery on order' }
]

function Checkout() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState({
    name: '', phone: '', pincode: '', locality: '', street: '', city: '', state: '', landmark: ''
  })
  const [paymentOption, setPaymentOption] = useState('upi')
  const [deliveryOption, setDeliveryOption] = useState('standard')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isOrdered, setIsOrdered] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [showMockPaymentModal, setShowMockPaymentModal] = useState(false)
  const [mockPaymentData, setMockPaymentData] = useState(null)

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userCity = JSON.parse(localStorage.getItem('userCity') || '{}')
    setAddress(prev => ({
      ...prev,
      name: user.name || '',
      city: userCity.name || '',
      state: userCity.state || ''
    }))
  }, [])

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const applyCoupon = () => {
    const coupon = COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase())
    if (coupon) {
      setAppliedCoupon(coupon)
      alert(`Coupon "${coupon.code}" applied successfully! 🎉`)
    } else {
      alert('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
  }

  // Calculations
  const itemsPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Delivery cost
  let deliveryCost = 40
  if (deliveryOption === 'express') deliveryCost = 100
  if (appliedCoupon?.freeShipping || itemsPrice > 500) deliveryCost = 0

  // Discount
  const discountAmount = appliedCoupon ? Math.round(itemsPrice * appliedCoupon.discount) : 0
  const finalPrice = itemsPrice - discountAmount + deliveryCost

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!address.name || !address.phone || !address.street || !address.pincode) {
      alert('Please fill out the delivery address')
      return
    }

    // COD order flows immediately without payment gateway
    if (paymentOption === 'cod') {
      const generatedId = `RASA${Math.floor(100000 + Math.random() * 900000)}IN`
      setOrderId(generatedId)
      completeOrderPlacement(generatedId)
      return
    }

    try {
      // 1. Create order on server
      const response = await fetch(`${API_BASE_URL}/api/payment/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalPrice })
      })
      const data = await response.json()
      
      if (!data || !data.order_id) {
        alert('Could not initiate Razorpay payment. Please try again.')
        return
      }

      // If mock payment, trigger simulated sandbox modal
      if (data.mock) {
        setMockPaymentData(data)
        setShowMockPaymentModal(true)
        return
      }

      // 2. Load real Razorpay SDK for real credentials
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.')
        return
      }

      // 3. Launch Razorpay modal
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Rasa Skincare',
        description: 'Complete your order payment 🌿',
        image: 'https://cdn-icons-png.flaticon.com/512/194/194279.png',
        order_id: data.order_id,
        handler: async function (paymentResponse) {
          // Verify signature on backend
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                is_mock: false
              })
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              setOrderId(paymentResponse.razorpay_order_id)
              completeOrderPlacement(paymentResponse.razorpay_order_id)
            } else {
              alert('Payment verification failed: ' + verifyData.message)
            }
          } catch (err) {
            console.error(err)
            alert('Verification request failed. Order could not be placed.')
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone
        },
        theme: {
          color: '#C4714A'
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (err) {
      console.error(err)
      alert('Error initiating checkout payment flow.')
    }
  }

  const handleMockPaymentSuccess = async () => {
    setShowMockPaymentModal(false)
    try {
      const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: mockPaymentData.order_id,
          razorpay_payment_id: `pay_mock_${Math.floor(100000 + Math.random() * 900000)}`,
          razorpay_signature: 'mock_signature_value',
          is_mock: true
        })
      })
      const verifyData = await verifyRes.json()
      if (verifyData.success) {
        const finalOrderId = `RASA${Math.floor(100000 + Math.random() * 900000)}IN`
        setOrderId(finalOrderId)
        completeOrderPlacement(finalOrderId)
      } else {
        alert('Payment verification failed: ' + verifyData.message)
      }
    } catch (err) {
      console.error(err)
      alert('Verification request failed. Order could not be placed.')
    }
  }

  const completeOrderPlacement = (id) => {
    // Save order details to localStorage
    const newOrder = {
      id: id,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: cart,
      address: { ...address },
      deliveryOption,
      paymentOption,
      total: finalPrice,
      status: 'Packed & Dispatched'
    }
    const existingOrders = JSON.parse(localStorage.getItem('rasa_orders') || '[]')
    localStorage.setItem('rasa_orders', JSON.stringify([newOrder, ...existingOrders]))

    // Success state
    setIsOrdered(true)
    localStorage.removeItem('cart')
  }

  if (isOrdered) {
    return (
      <div className="order-success-page">
        <div className="success-card">
          <span className="success-emoji">🎉</span>
          <h2>Order Placed Successfully!</h2>
          <p className="success-sub">Thank you for shopping with Rasa Skincare 🌿</p>
          <div className="order-summary-box">
            <p><strong>Deliver to:</strong> {address.name}</p>
            <p><strong>Address:</strong> {address.street}, {address.city} - {address.pincode}</p>
            <p><strong>Estimated Delivery:</strong> {deliveryOption === 'express' ? 'Tomorrow' : '3-5 business days'}</p>
            <p><strong>Total Amount:</strong> ₹{finalPrice}</p>
            <p><strong>Payment Mode:</strong> {paymentOption.toUpperCase()}</p>
          </div>

          {showTracking ? (
            <div className="tracking-timeline-box" style={{ borderTop: '1px dashed var(--border)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '18px', textAlign: 'left', fontFamily: 'Poppins', fontWeight: 600, color: 'var(--terracotta-dark)', margin: '0 0 16px' }}>
                Delivery Tracking timeline 📍
              </h3>
              <p style={{ fontSize: '11px', textAlign: 'left', color: 'var(--grey)', margin: '-10px 0 16px' }}>
                Tracking ID: <strong>{orderId}</strong>
              </p>
              
              <div className="tracking-timeline">
                <div className="tracking-step done">
                  <div className="tracking-dot"></div>
                  <span className="tracking-label">Order Confirmed</span>
                  <span className="tracking-time">Today, Just now</span>
                </div>
                <div className="tracking-step active">
                  <div className="tracking-dot"></div>
                  <span className="tracking-label">Packed & Dispatched</span>
                  <span className="tracking-time">Processing at Mumbai hub</span>
                </div>
                <div className="tracking-step">
                  <div className="tracking-dot"></div>
                  <span className="tracking-label">Shipped</span>
                  <span className="tracking-time">In Transit via Rasa Express</span>
                </div>
                <div className="tracking-step">
                  <div className="tracking-dot"></div>
                  <span className="tracking-label">Out for Delivery</span>
                  <span className="tracking-time">Pending courier assignment</span>
                </div>
                <div className="tracking-step">
                  <div className="tracking-dot"></div>
                  <span className="tracking-label">Delivered</span>
                  <span className="tracking-time">Expected {deliveryOption === 'express' ? 'Tomorrow' : 'in 3-5 days'}</span>
                </div>
              </div>

              <button className="btn-track-success" onClick={() => setShowTracking(false)} style={{ marginBottom: '12px' }}>
                ← View Summary
              </button>
            </div>
          ) : (
            <div className="success-buttons">
              <button className="btn-track-success" onClick={() => setShowTracking(true)}>
                📍 Track Delivery
              </button>
              <button className="btn-home-success" onClick={() => navigate('/home')}>
                Go to Home
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div className="checkout-header-content">
          <span className="back-link" onClick={() => navigate(-1)}>← Back to Home</span>
          <h3>Checkout 🌿</h3>
        </div>
      </header>

      <div className="checkout-container">
        
        {/* Left Column: Flow */}
        <div className="checkout-left">
          
          {/* Section 1: Delivery Address */}
          <div className="checkout-section">
            <div className="section-hdr">
              <span className="section-num">1</span>
              <h4>DELIVERY ADDRESS</h4>
            </div>
            <form className="address-form">
              <div className="input-row">
                <input type="text" name="name" placeholder="Name" value={address.name} onChange={handleAddressChange} required />
                <input type="text" name="phone" placeholder="10-digit mobile number" value={address.phone} onChange={handleAddressChange} required />
              </div>
              <div className="input-row">
                <input type="text" name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleAddressChange} required />
                <input type="text" name="locality" placeholder="Locality" value={address.locality} onChange={handleAddressChange} />
              </div>
              <div className="input-full">
                <textarea name="street" placeholder="Address (Area and Street)" value={address.street} onChange={handleAddressChange} rows="3" required></textarea>
              </div>
              <div className="input-row">
                <input type="text" name="city" placeholder="City/District/Town" value={address.city} onChange={handleAddressChange} required />
                <input type="text" name="state" placeholder="State" value={address.state} onChange={handleAddressChange} required />
              </div>
            </form>
          </div>

          {/* Section 2: Delivery Speed Options */}
          <div className="checkout-section">
            <div className="section-hdr">
              <span className="section-num">2</span>
              <h4>DELIVERY OPTIONS</h4>
            </div>
            <div className="delivery-options-grid">
              <label className={`delivery-opt-label ${deliveryOption === 'standard' ? 'selected' : ''}`}>
                <input type="radio" name="delivery" checked={deliveryOption === 'standard'} onChange={() => setDeliveryOption('standard')} />
                <div>
                  <span className="opt-title">Standard Delivery</span>
                  <span className="opt-desc">Delivered in 3-5 business days (Free above ₹500)</span>
                </div>
                <span className="opt-price">₹40</span>
              </label>
              <label className={`delivery-opt-label ${deliveryOption === 'express' ? 'selected' : ''}`}>
                <input type="radio" name="delivery" checked={deliveryOption === 'express'} onChange={() => setDeliveryOption('express')} />
                <div>
                  <span className="opt-title">Express Delivery</span>
                  <span className="opt-desc">Delivered in 24 hours (Climate-smart priority delivery)</span>
                </div>
                <span className="opt-price">₹100</span>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Options */}
          <div className="checkout-section">
            <div className="section-hdr">
              <span className="section-num">3</span>
              <h4>PAYMENT OPTIONS</h4>
            </div>
            <div className="payment-options-list">
              <label className={`payment-opt-item ${paymentOption === 'upi' ? 'selected' : ''}`}>
                <input type="radio" name="payment" checked={paymentOption === 'upi'} onChange={() => setPaymentOption('upi')} />
                <div>
                  <span className="opt-title">UPI (GPay / PhonePe / Paytm)</span>
                  <span className="opt-desc">Pay instantly using any UPI app</span>
                </div>
              </label>
              <label className={`payment-opt-item ${paymentOption === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="payment" checked={paymentOption === 'card'} onChange={() => setPaymentOption('card')} />
                <div>
                  <span className="opt-title">Credit / Debit / ATM Card</span>
                  <span className="opt-desc">Visa, Mastercard, RuPay, Maestro</span>
                </div>
              </label>
              <label className={`payment-opt-item ${paymentOption === 'cod' ? 'selected' : ''}`}>
                <input type="radio" name="payment" checked={paymentOption === 'cod'} onChange={() => setPaymentOption('cod')} />
                <div>
                  <span className="opt-title">Cash on Delivery (COD)</span>
                  <span className="opt-desc">Pay at your doorstep with Cash or UPI</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Price Details & Coupons */}
        <div className="checkout-right">
          
          {/* Coupon Offers */}
          <div className="checkout-sidebar-box">
            <h4>APPLY COUPONS</h4>
            <div className="coupon-input-row">
              <input 
                type="text" 
                placeholder="Enter Code (e.g. RASA20)" 
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value)} 
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <button className="btn-coupon-action remove" onClick={removeCoupon}>Remove</button>
              ) : (
                <button className="btn-coupon-action" onClick={applyCoupon} disabled={!couponCode}>Apply</button>
              )}
            </div>
            {appliedCoupon && (
              <div className="applied-coupon-pill">
                <span>🏷️ Applied: <strong>{appliedCoupon.code}</strong></span>
                <span className="coupon-desc-pill">{appliedCoupon.desc}</span>
              </div>
            )}
            <div className="coupons-hints">
              <p>💡 Tip: Use <strong>RASA20</strong> for 20% discount on order</p>
            </div>
          </div>

          {/* Price Details */}
          <div className="checkout-sidebar-box">
            <h4 className="price-details-title">PRICE DETAILS</h4>
            <div className="price-row">
              <span>Price ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
              <span>₹{itemsPrice}</span>
            </div>
            {discountAmount > 0 && (
              <div className="price-row discount">
                <span>Discount</span>
                <span>−₹{discountAmount}</span>
              </div>
            )}
            <div className="price-row">
              <span>Delivery Charges</span>
              <span>{deliveryCost === 0 ? <span className="free-tag">FREE</span> : `₹${deliveryCost}`}</span>
            </div>
            <div className="price-row total">
              <span>Total Payable</span>
              <span>₹{finalPrice}</span>
            </div>
            <button className="btn-place-order" onClick={handlePlaceOrder}>
              PLACE ORDER
            </button>
          </div>

        </div>

      </div>

      {showMockPaymentModal && (
        <div className="mock-payment-overlay">
          <div className="mock-payment-modal">
            <div className="mock-modal-header">
              <span className="mock-modal-icon">🌿</span>
              <h3>Rasa Payment Sandbox</h3>
            </div>
            <p className="mock-modal-description">
              You are using placeholder credentials. We've intercepted the real Razorpay modal to prevent loading errors, letting you simulate a test transaction safely.
            </p>
            <div className="mock-payment-details">
              <div className="mock-detail-row">
                <span>Merchant:</span>
                <strong>Rasa Skincare Ltd.</strong>
              </div>
              <div className="mock-detail-row">
                <span>Order ID:</span>
                <strong>{mockPaymentData?.order_id}</strong>
              </div>
              <div className="mock-detail-row">
                <span>Amount:</span>
                <strong className="mock-amount">₹{finalPrice}</strong>
              </div>
            </div>
            <div className="mock-modal-buttons">
              <button className="btn-pay-mock" onClick={handleMockPaymentSuccess}>
                Simulate Successful Payment
              </button>
              <button className="btn-cancel-mock" onClick={() => setShowMockPaymentModal(false)}>
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
