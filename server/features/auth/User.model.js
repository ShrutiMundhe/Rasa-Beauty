const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: ''
  },
  skinType: {
    type: String,
    default: ''
  },
  skinTone: {
    type: String,
    default: ''
  },
  skinConcern: {
    type: String,
    default: ''
  },
  hairType: {
    type: String,
    default: ''
  },
  hairPorosity: {
    type: String,
    default: ''
  },
  hairConcern: {
    type: String,
    default: ''
  },
  bodyType: {
    type: String,
    default: ''
  },
  bodyConcern: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)
