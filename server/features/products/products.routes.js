const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const products = require('../../data/products')
const User = require('../auth/User.model')

// Get all products with smart scoring
router.post('/recommend', auth, async (req, res) => {
  const { skinType, skinConcerns, hairType, hairConcerns, bodyType, bodyConcerns, humidity, uvIndex, search, category } = req.body
  let age = req.body.age
  if (age === undefined && req.user) {
    try {
      const user = await User.findById(req.user.id)
      if (user) age = user.age
    } catch (e) {}
  }

  try {
    const humidityLevel = humidity > 70 ? 'high' : humidity > 40 ? 'medium' : 'low'
    const uvLevel = uvIndex > 6 ? 'high' : uvIndex > 3 ? 'medium' : 'low'

    let filtered = products

    // Filter by search query
    if (search && search.trim() !== '') {
      const query = search.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.subcategory.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.ingredients.some(i => i.name.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category)
    }

    // Filter by age compatibility
    if (age) {
      const ageNum = parseInt(age)
      if (ageNum < 20) {
        filtered = filtered.filter(p => {
          const isAntiAging = p.name.toLowerCase().includes('retinol') ||
                              p.description.toLowerCase().includes('aging') ||
                              p.description.toLowerCase().includes('ageing') ||
                              p.description.toLowerCase().includes('wrinkle') ||
                              p.ingredients.some(ing => 
                                ing.name.toLowerCase().includes('retinol') || 
                                ing.name.toLowerCase().includes('peptide') ||
                                ing.name.toLowerCase().includes('collagen')
                              )
          return !isAntiAging
        })
      }
    }

    // Score each product
    const scored = filtered.map(product => {
      let score = 0
      const c = product.suitability
      const matchedReasons = []

      // Type match (skin, hair, or body)
      if (product.category === 'Hair Care') {
        if (hairType) {
          score += 3
          matchedReasons.push(`Suitable for ${hairType} hair`)
        }
      } else if (product.category === 'Body Care') {
        if (bodyType) {
          score += 3
          matchedReasons.push(`Suitable for ${bodyType} body skin`)
        }
      } else {
        if (c.skinTypes?.includes('all') || c.skinTypes?.includes(skinType)) {
          score += 3
          matchedReasons.push(`Suitable for ${skinType} skin`)
        }
      }

      // Concern match (combine skin, hair, and body concerns)
      const allConcerns = [...(skinConcerns || []), ...(hairConcerns || []), ...(bodyConcerns || [])]
      // Normalize some concerns (e.g. dryness_frizz -> frizzy_hair / dry_hair)
      const normalizedConcerns = []
      allConcerns.forEach(concern => {
        normalizedConcerns.push(concern)
        if (concern === 'dryness_frizz') {
          normalizedConcerns.push('frizzy_hair')
          normalizedConcerns.push('dry_hair')
        }
        if (concern === 'tanning') {
          normalizedConcerns.push('tan')
          normalizedConcerns.push('dullness')
        }
        if (concern === 'strawberry_legs') {
          normalizedConcerns.push('uneven_texture')
        }
        if (concern === 'dryness_roughness') {
          normalizedConcerns.push('dryness')
          normalizedConcerns.push('uneven_texture')
        }
      })

      const matchedConcerns = normalizedConcerns.filter(concern =>
        c.concerns?.includes(concern)
      )
      score += matchedConcerns.length * 2
      if (matchedConcerns.length > 0) {
        matchedReasons.push(`Targets your hair/skin concerns`)
      }

      // Weather match
      if (c.humidity === 'any' || c.humidity === humidityLevel) {
        score += 2
        matchedReasons.push(`Good for today's ${humidityLevel} humidity`)
      }
      if (c.uvIndex === 'any' || c.uvIndex === uvLevel) {
        score += 2
        if (uvLevel === 'high') matchedReasons.push('Recommended for high UV today')
      }

      // Age match
      if (age) {
        const ageNum = parseInt(age)
        if (ageNum >= 30) {
          const isAntiAging = product.name.toLowerCase().includes('retinol') ||
                              product.description.toLowerCase().includes('aging') ||
                              product.description.toLowerCase().includes('wrinkle') ||
                              product.ingredients.some(ing => 
                                ing.name.toLowerCase().includes('retinol') || 
                                ing.name.toLowerCase().includes('peptide') ||
                                ing.name.toLowerCase().includes('collagen')
                              )
          if (isAntiAging) {
            score += 3
            matchedReasons.push('Optimised for age 30+ cell renewal')
          }
        }
        if (ageNum < 20) {
          const isGentleOrAcne = product.category === 'Cleanser' ||
                                 product.category === 'Sunscreen' ||
                                 product.name.toLowerCase().includes('salicylic') ||
                                 product.ingredients.some(ing =>
                                   ing.name.toLowerCase().includes('salicylic') ||
                                   ing.name.toLowerCase().includes('zinc') ||
                                   ing.name.toLowerCase().includes('aloe')
                                 )
          if (isGentleOrAcne) {
            score += 2
            matchedReasons.push('Gentle & suitable for younger skin')
          }
        }
      }

      return {
        ...product,
        score,
        matchedReasons,
        whyToday: matchedReasons[0] || product.weatherReason
      }
    })

    // Sort by score
    const sorted = scored
      .sort((a, b) => b.score - a.score)

    res.json({
      products: sorted,
      total: sorted.length
    })

  } catch (err) {
    console.error('Product recommendation error:', err)
    res.status(500).json({ message: 'Recommendation failed' })
  }
})

// Get single product
router.get('/:id', auth, async (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
})

// Get all categories
router.get('/meta/categories', auth, (req, res) => {
  const categories = ['All', ...new Set(products.map(p => p.category))]
  res.json({ categories })
})

module.exports = router