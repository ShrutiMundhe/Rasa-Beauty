const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

router.post('/generate', auth, async (req, res) => {
  const { city, skinType, skinConcerns, weather, hairType, hairConcerns, bodyType, bodyConcerns, type } = req.body

  try {
    let prompt = ''
    if (type === 'hair' || hairType) {
      prompt = `You are Rasa — a warm, knowledgeable Indian beauty assistant like a trusted big sister.

User profile:
- City: ${city}
- Hair type: ${hairType}
- Hair concerns: ${hairConcerns?.join(', ') || 'general care'}
- Current weather: ${weather?.temp}°C, humidity ${weather?.humidity}%, UV index ${weather?.uvIndex}
- Today's Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Give TWO things:
1. A personalised hair care tip for today based on the weather and hair type (2-3 sentences, warm and friendly tone)
2. A traditional Indian home remedy (Mama Tip) for hair care using Ayurvedic ingredients that helps with today's weather conditions and hair issues (1-2 sentences)

Respond in this exact JSON format with no extra text:
{
  "tip": "your hair care tip here",
  "mamaTip": "your traditional remedy here"
}

Be specific, practical, and warm. Mention the weather condition. Vary your recommendation based on the current day so that the user receives a unique remedy each time they visit on a different day.`
    } else if (type === 'body' || bodyType) {
      prompt = `You are Rasa — a warm, knowledgeable Indian beauty assistant like a trusted big sister.

User profile:
- City: ${city}
- Body skin type: ${bodyType || 'normal'}
- Body concerns: ${bodyConcerns?.join(', ') || 'general body care'}
- Current weather: ${weather?.temp}°C, humidity ${weather?.humidity}%, UV index ${weather?.uvIndex}
- Today's Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Give TWO things:
1. A personalised body skincare tip for today based on the weather (2-3 sentences, warm and friendly tone)
2. A traditional Indian home remedy (Mama Tip) for body care/scrubs using Ayurvedic ingredients that helps with today's weather conditions (1-2 sentences)

Respond in this exact JSON format with no extra text:
{
  "tip": "your body care tip here",
  "mamaTip": "your traditional remedy here"
}

Be specific, practical, and warm. Mention the weather condition. Vary your recommendation based on the current day so that the user receives a unique remedy each time they visit on a different day.`
    } else if (type === 'eye') {
      prompt = `You are Rasa — a warm, knowledgeable Indian beauty assistant like a trusted big sister.

User profile:
- City: ${city}
- Skin concerns: under-eye puffiness, dark circles, tired eyes
- Current weather: ${weather?.temp}°C, humidity ${weather?.humidity}%, UV index ${weather?.uvIndex}
- Today's Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Give TWO things:
1. A personalised eye care tip for today (under-eye care, puffiness, dark circles, hydration) (2-3 sentences, warm and friendly tone)
2. A traditional Indian home remedy (Mama Tip) for eye care using natural/Ayurvedic ingredients (e.g. cucumber, rose water, tea bags) (1-2 sentences)

Respond in this exact JSON format with no extra text:
{
  "tip": "your eye care tip here",
  "mamaTip": "your traditional remedy here"
}

Be specific, practical, and warm. Mention the weather condition. Vary your recommendation based on the current day so that the user receives a unique remedy each time they visit on a different day.`
    } else if (type === 'lip') {
      prompt = `You are Rasa — a warm, knowledgeable Indian beauty assistant like a trusted big sister.

User profile:
- City: ${city}
- Skin concerns: lip dryness, chapped lips, lip pigmentation
- Current weather: ${weather?.temp}°C, humidity ${weather?.humidity}%, UV index ${weather?.uvIndex}
- Today's Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Give TWO things:
1. A personalised lip care tip for today (lip hydration, SPF protection, chapping prevention) (2-3 sentences, warm and friendly tone)
2. A traditional Indian home remedy (Mama Tip) for lips using Ayurvedic/natural kitchen ingredients (e.g. ghee, honey, rose petals, cream) (1-2 sentences)

Respond in this exact JSON format with no extra text:
{
  "tip": "your lip care tip here",
  "mamaTip": "your traditional remedy here"
}

Be specific, practical, and warm. Mention the weather condition. Vary your recommendation based on the current day so that the user receives a unique remedy each time they visit on a different day.`
    } else {
      prompt = `You are Rasa — a warm, knowledgeable Indian beauty assistant like a trusted big sister.

User profile:
- City: ${city}
- Skin type: ${skinType}
- Skin concerns: ${skinConcerns?.join(', ') || 'general care'}
- Current weather: ${weather?.temp}°C, humidity ${weather?.humidity}%, UV index ${weather?.uvIndex}
- Today's Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Give TWO things:
1. A personalised skincare tip for today based on the weather and skin type (2-3 sentences, warm and friendly tone)
2. A traditional Indian home remedy (Mama Tip) that helps with today's weather conditions (1-2 sentences)

Respond in this exact JSON format with no extra text:
{
  "tip": "your skincare tip here",
  "mamaTip": "your traditional remedy here"
}

Be specific, practical, and warm. Mention the weather condition. Vary your recommendation based on the current day so that the user receives a unique remedy each time they visit on a different day.`
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    })

    const content = response.text
    const clean = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    res.json({
      tip: parsed.tip,
      mamaTip: parsed.mamaTip
    })

  } catch (err) {
    console.error('Gemini API error (using local personalized fallback):', err.message)
    if (type === 'hair' || hairType) {
      res.json(getFallbackHairTips(hairType, hairConcerns, weather))
    } else if (type === 'body' || bodyType) {
      res.json(getFallbackBodyTips(bodyType, bodyConcerns, weather))
    } else if (type === 'eye') {
      res.json(getFallbackEyeTips(skinType, skinConcerns, weather))
    } else if (type === 'lip') {
      res.json(getFallbackLipTips(skinType, skinConcerns, weather))
    } else {
      res.json(getFallbackTips(skinType, skinConcerns, weather))
    }
  }
})

function getFallbackTips(skinType, skinConcerns, weather) {
  const temp = weather?.temp || 30
  const humidity = weather?.humidity || 65
  const uvIndex = weather?.uvIndex || 5

  let tip = ''
  let mamaTip = ''

  if (skinType === 'dry') {
    if (humidity < 50) {
      tip = `It's dry and low humidity (${humidity}%) today. Your dry skin needs intense moisture. Layer a nourishing cream over damp skin to seal in hydration. 🌿`
      mamaTip = `Mash a ripe banana with a teaspoon of honey and apply for 15 minutes to deeply moisturize your skin.`
    } else {
      tip = `With comfortable humidity (${humidity}%) today, your dry skin is in a good place. Use a light hyaluronic acid serum followed by a mild moisturizer. 🌿`
      mamaTip = `Gently massage a few drops of pure cold-pressed coconut oil or almond oil onto your face before bed.`
    }
  } else if (skinType === 'oily') {
    if (humidity > 70) {
      tip = `High humidity (${humidity}%) today will increase sebum production. Avoid heavy creams; instead, opt for a gel-based moisturizer containing salicylic acid. 🌿`
      mamaTip = `Mix multani mitti (Fuller's earth) with a splash of rose water and apply as a pack to absorb excess grease.`
    } else {
      tip = `The weather is pleasant today. A simple niacinamide serum will keep your oily skin balanced and control shine without drying it out. 🌿`
      mamaTip = `Rinse your face with green tea water to reduce inflammation and keep pores clear.`
    }
  } else if (skinType === 'combination') {
    tip = `With current humidity at ${humidity}%, balance is key. Spot-moisturize your dry cheeks and use a clay-based cleanser only on your oily T-zone. 🌿`
    mamaTip = `Apply yogurt (dahi) on dry areas and a drop of lemon juice mixed with honey on oily patches.`
  } else if (skinType === 'sensitive') {
    tip = `Your sensitive skin requires care today. With a temperature of ${temp}°C, steer clear of harsh exfoliants and stick to a soothing centella or aloe vera gel. 🌿`
    mamaTip = `Soothe skin irritation by applying chilled raw milk with a cotton pad for a cooling, anti-inflammatory effect.`
  } else {
    // Normal skin
    tip = `The weather in your city is at ${temp}°C. Keep it simple with a balanced cleanser, a vitamin C serum for brightness, and a lightweight moisturizer. 🌿`
    mamaTip = `A simple splash of pure rose water (gulab jal) will keep your skin refreshed and glowing throughout the day.`
  }

  // UV index override
  if (uvIndex >= 6) {
    tip += ` The UV Index is high (${uvIndex}) today. Don't step out without applying SPF 50 sunscreen!`
  }

  return { tip, mamaTip }
}

// Generate Routine endpoint
router.post('/routine', auth, async (req, res) => {
  const { 
    purchasedProducts = [], 
    customProducts = '', 
    skinType = 'normal', 
    skinConcerns = [],
    hairType = 'normal',
    hairConcerns = [],
    weather = {}
  } = req.body

  try {
    const prompt = `You are Rasa — a skincare expert AI assistant.
Generate a highly personalized morning (AM) and evening (PM) routine for a user based on their profile, purchases, and custom products.

User Profile:
- Skin Type: ${skinType}
- Skin Concerns: ${skinConcerns.join(', ') || 'general'}
- Hair Type: ${hairType}, Concerns: ${hairConcerns.join(', ') || 'none'}
- Weather: ${weather.temp || 30}°C, Humidity: ${weather.humidity || 70}%, UV Index: ${weather.uvIndex || 5}
- Products Purchased from our Store: ${purchasedProducts.join(', ') || 'none'}
- Products the user already uses/entered: ${customProducts || 'none'}

Instructions:
1. Distribute these products logically into a Morning (AM) Routine and an Evening (PM) Routine.
2. Outline clear steps (Step 1, Step 2, etc.) for both AM and PM.
3. For each step, provide:
   - "step": Number (e.g., 1)
   - "action": What type of step it is (e.g., Cleanse, Treat, Moisturise, Protect)
   - "product": The product name to use
   - "instruction": A short tip on how to apply it, keeping in mind their skin type and weather.
4. If some essential steps are missing (e.g., no sunscreen purchased/entered, but UV index is high), suggest adding a placeholder step indicating they should use one.

Respond in this exact JSON format with no markdown blocks, no extra text:
{
  "am": [
    { "step": 1, "action": "Cleanse", "product": "product name", "instruction": "instruction" }
  ],
  "pm": [
    { "step": 1, "action": "Cleanse", "product": "product name", "instruction": "instruction" }
  ]
}
`

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    })

    const content = response.text
    const clean = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    res.json(parsed)

  } catch (err) {
    console.error('Gemini routine generation failed, using fallback:', err.message)
    res.json(getFallbackRoutine(req.body))
  }
})

function getFallbackRoutine(body) {
  const { purchasedProducts = [], customProducts = '', skinType = 'normal' } = body
  const allProducts = [...purchasedProducts]
  if (customProducts) {
    customProducts.split(',').forEach(p => {
      if (p.trim()) allProducts.push(p.trim())
    })
  }

  if (allProducts.length === 0) {
    allProducts.push('Mild Cleanser', 'Light Moisturiser', 'SPF 50 Sunscreen')
  }

  const am = []
  const pm = []

  let stepAm = 1
  let stepPm = 1

  const cleanser = allProducts.find(p => p.toLowerCase().includes('cleanse') || p.toLowerCase().includes('wash') || p.toLowerCase().includes('face wash')) || 'Gentle Cleanser'
  am.push({
    step: stepAm++,
    action: 'Cleanse',
    product: cleanser,
    instruction: 'Wash face with lukewarm water to remove overnight oil build-up.'
  })
  pm.push({
    step: stepPm++,
    action: 'Cleanse',
    product: cleanser,
    instruction: 'Double cleanse if needed to remove dirt, sunscreen, and pollutants.'
  })

  const treatments = allProducts.filter(p => p.toLowerCase().includes('serum') || p.toLowerCase().includes('toner') || p.toLowerCase().includes('acid') || p.toLowerCase().includes('treat'))
  treatments.forEach(t => {
    if (t.toLowerCase().includes('vit') || t.toLowerCase().includes('vitamin c') || t.toLowerCase().includes('glow') || t.toLowerCase().includes('bright')) {
      am.push({
        step: stepAm++,
        action: 'Treat',
        product: t,
        instruction: 'Apply 3-4 drops to dry skin. Promotes antioxidant protection against UV rays.'
      })
    } else {
      pm.push({
        step: stepPm++,
        action: 'Treat',
        product: t,
        instruction: 'Apply gently to face and neck. Promotes overnight repair.'
      })
    }
  })

  const moist = allProducts.find(p => p.toLowerCase().includes('moistur') || p.toLowerCase().includes('cream') || p.toLowerCase().includes('gel') || p.toLowerCase().includes('lotion')) || 'Light Moisturiser'
  am.push({
    step: stepAm++,
    action: 'Moisturise',
    product: moist,
    instruction: 'Apply a dime-sized amount to lock in hydration.'
  })
  pm.push({
    step: stepPm++,
    action: 'Moisturise',
    product: moist,
    instruction: 'Apply slightly more generously to support skin barrier restoration while sleeping.'
  })

  const sun = allProducts.find(p => p.toLowerCase().includes('sunscreen') || p.toLowerCase().includes('spf') || p.toLowerCase().includes('block')) || 'Broad Spectrum Sunscreen SPF 50'
  am.push({
    step: stepAm++,
    action: 'Protect',
    product: sun,
    instruction: 'Apply 2-finger lengths at least 15 minutes before sun exposure.'
  })

  return { am, pm }
}

function getFallbackHairTips(hairType, hairConcerns, weather) {
  const temp = weather?.temp || 30
  const humidity = weather?.humidity || 65

  let tip = ''
  let mamaTip = ''

  if (hairType === 'oily' || hairConcerns?.includes('oily_scalp')) {
    if (humidity > 70) {
      tip = `High humidity (${humidity}%) today might make your scalp feel extra greasy. Use a clarifying shampoo and avoid applying heavy hair oils directly to the scalp. 🌿`
      mamaTip = `Rinse your hair with warm water infused with neem and lemon juice to control sebum and keep the scalp fresh.`
    } else {
      tip = `With comfortable weather today, a mild shampoo will keep your oily scalp balanced. Keep your hair dry to prevent sweat build-up. 🌿`
      mamaTip = `Apply a pack of hibiscus powder and curd for 20 minutes before washing to regulate scalp oiliness.`
    }
  } else if (hairType === 'dry' || hairConcerns?.includes('dryness_frizz') || hairConcerns?.includes('split_ends')) {
    tip = `The weather today is dry. Your hair needs extra moisture to combat frizz. Use a leave-in serum and protect your hair ends from damage. 🌿`
    mamaTip = `Massage warm coconut oil mixed with a spoonful of aloe vera gel into your hair to deeply nourish dry strands.`
  } else {
    // Normal / straight / wavy default
    tip = `Today's temperature is ${temp}°C with ${humidity}% humidity. Keep your hair healthy with regular hydration and a lightweight hair serum. 🌿`
    mamaTip = `A weekly amla and bhringraj oil massage will strengthen your hair roots and maintain natural shine.`
  }

  return { tip, mamaTip }
}

function getFallbackBodyTips(bodyType, bodyConcerns, weather) {
  const temp = weather?.temp || 30
  const humidity = weather?.humidity || 65
  let tip = `Today's temperature is ${temp}°C. Keep your body skin hydrated and moisturised.`
  let mamaTip = `Use a gentle body scrub made of chickpea flour (besan) and turmeric to cleanse and exfoliate.`
  if (bodyType === 'dry' || bodyConcerns?.includes('dry_skin')) {
    tip = `Low humidity can dry out body skin. Apply a rich body lotion right after showering to seal in moisture.`
    mamaTip = `Massage warm sesame oil or coconut oil before bathing to soothe and hydrate dry body skin.`
  }
  return { tip, mamaTip }
}

function getFallbackEyeTips(skinType, skinConcerns, weather) {
  return {
    tip: `Ensure you hydrate the delicate skin around your eyes today. Use a cooling eye cream.`,
    mamaTip: `Place chilled cucumber slices or wet green tea bags over your eyes for 10 minutes to reduce puffiness and dark circles.`
  }
}

function getFallbackLipTips(skinType, skinConcerns, weather) {
  return {
    tip: `Protect your lips from dryness or UV damage today by wearing a hydrating lip balm with SPF.`,
    mamaTip: `Apply a tiny bit of fresh milk cream (malai) or pure ghee on your lips before sleeping to heal chapped lips.`
  }
}

module.exports = router