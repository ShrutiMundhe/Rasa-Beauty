const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middleware/auth')
const { authLimiter, otpSendLimiter, otpVerifyLimiter } = require('../../middleware/rateLimiter')
const {
  validateSendOtp,
  validateVerifyOtp,
  validateResendOtp,
  validateLogin
} = require('./auth.validation')
const {
  signup,
  login,
  getProfile,
  updateProfile,
  sendOtp,
  verifyOtp,
  resendOtp
} = require('./auth.controller')

// Legacy standard signup (rate limited)
router.post('/signup', authLimiter, signup)

// Secure Login (rate limited + sanitized)
router.post('/login', authLimiter, validateLogin, login)

// Profile endpoints
router.get('/profile', authMiddleware, getProfile)
router.put('/profile', authMiddleware, updateProfile)

// OTP Verification endpoints
router.post('/send-otp', otpSendLimiter, validateSendOtp, sendOtp)
router.post('/verify-otp', otpVerifyLimiter, validateVerifyOtp, verifyOtp)
router.post('/resend-otp', otpSendLimiter, validateResendOtp, resendOtp)

module.exports = router
