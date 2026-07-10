const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
// require('dotenv').config()
const connectDB = require('./config/db')

const app = express()

// Connect database
connectDB()

// Production Security Middlewares
app.use(helmet())
app.use(cors({
  origin: [
    'https://rasa-beauty.vercel.app', // Add your actual Vercel domain here
    'http://localhost:3000', 
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json())

// Feature-First Routes API Mapping
app.use('/api/auth', require('./features/auth/auth.routes'))
app.use('/api/weather', require('./features/weather/weather.routes'))
app.use('/api/tips', require('./features/tips/tips.routes'))
app.use('/api/products', require('./features/products/products.routes'))
app.use('/api/payment', require('./features/payment/payment.routes'))

// Base root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Rasa API running 🌿' })
})

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message 
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
console.log("My MONGO_URI is:", process.env.MONGO_URI);