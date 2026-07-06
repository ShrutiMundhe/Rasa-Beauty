const rateLimit = require('express-rate-limit')

// Limit sending OTPs (prevent email spam)
exports.otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many OTP requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Limit verifying OTPs (prevent brute force)
exports.otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 verification requests per windowMs
  message: {
    message: 'Too many verification attempts. Please try again after 10 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// General API rate limiter for auth requests (login, etc.)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 auth requests per windowMs
  message: {
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
