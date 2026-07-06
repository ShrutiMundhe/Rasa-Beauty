const express = require('express')
const router = express.Router()
const axios = require('axios')
const auth = require('../../middleware/auth')

router.get('/', auth, async (req, res) => {
  const { city, lat, lon } = req.query
  try {
    let weatherUrl
    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    }

    const weatherRes = await axios.get(weatherUrl)
    let uvIndex = 5
    try {
      const uvRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherRes.data.coord.lat}&lon=${weatherRes.data.coord.lon}&appid=${process.env.OPENWEATHER_API_KEY}`
      )
      uvIndex = Math.round(uvRes.data.value || 0)
    } catch (uvErr) {
      // Fallback based on temperature if deprecated UV API fails
      uvIndex = weatherRes.data.main.temp > 30 ? 7 : 4
    }

    res.json({
      city: weatherRes.data.name,
      temp: Math.round(weatherRes.data.main.temp),
      humidity: weatherRes.data.main.humidity,
      description: weatherRes.data.weather[0].description,
      uvIndex: uvIndex,
      aqi: 65
    })
  } catch (err) {
    console.error('Weather API error:', err.message)
    res.status(500).json({ message: 'Weather fetch failed' })
  }
})

module.exports = router