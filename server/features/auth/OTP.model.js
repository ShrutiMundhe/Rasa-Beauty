const mongoose = require('mongoose')

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600
  },
  lastSentAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('OTP', OTPSchema)
