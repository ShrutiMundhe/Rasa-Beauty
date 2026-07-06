const User = require('./User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const OTP = require('./OTP.model')
const { sendOTP } = require('../../config/mailer')

// SIGNUP (Fallback for legacy signup flow if needed, otherwise verifyOtp handles user creation)
exports.signup = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    let parsedCity = user.city
    try {
      if (user.city && (user.city.startsWith('{') || user.city.startsWith('['))) {
        parsedCity = JSON.parse(user.city)
      }
    } catch (e) {}

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: parsedCity,
        skinType: user.skinType,
        skinConcerns: user.skinConcern ? user.skinConcern.split(',').filter(Boolean) : [],
        hairType: user.hairType,
        hairPorosity: user.hairPorosity,
        hairConcerns: user.hairConcern ? user.hairConcern.split(',').filter(Boolean) : [],
        bodyType: user.bodyType,
        bodyConcerns: user.bodyConcern ? user.bodyConcern.split(',').filter(Boolean) : []
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    let parsedCity = user.city
    try {
      if (user.city && (user.city.startsWith('{') || user.city.startsWith('['))) {
        parsedCity = JSON.parse(user.city)
      }
    } catch (e) {}

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: parsedCity,
        skinType: user.skinType,
        skinConcerns: user.skinConcern ? user.skinConcern.split(',').filter(Boolean) : [],
        hairType: user.hairType,
        hairPorosity: user.hairPorosity,
        hairConcerns: user.hairConcern ? user.hairConcern.split(',').filter(Boolean) : [],
        bodyType: user.bodyType,
        bodyConcerns: user.bodyConcern ? user.bodyConcern.split(',').filter(Boolean) : []
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    let parsedCity = user.city
    try {
      if (user.city && (user.city.startsWith('{') || user.city.startsWith('['))) {
        parsedCity = JSON.parse(user.city)
      }
    } catch (e) {}

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      city: parsedCity,
      skinType: user.skinType,
      skinConcerns: user.skinConcern ? user.skinConcern.split(',').filter(Boolean) : [],
      hairType: user.hairType,
      hairPorosity: user.hairPorosity,
      hairConcerns: user.hairConcern ? user.hairConcern.split(',').filter(Boolean) : [],
      bodyType: user.bodyType,
      bodyConcerns: user.bodyConcern ? user.bodyConcern.split(',').filter(Boolean) : [],
      age: user.age
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateProfile = async (req, res) => {
  const { name, city, skinType, skinConcerns, hairType, hairPorosity, hairConcerns, bodyType, bodyConcerns, age } = req.body

  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (name) user.name = name
    if (city !== undefined) {
      user.city = typeof city === 'object' ? JSON.stringify(city) : city
    }
    if (skinType !== undefined) user.skinType = skinType
    if (skinConcerns !== undefined) {
      user.skinConcern = Array.isArray(skinConcerns) ? skinConcerns.join(',') : skinConcerns
    }
    if (hairType !== undefined) user.hairType = hairType
    if (hairPorosity !== undefined) user.hairPorosity = hairPorosity
    if (hairConcerns !== undefined) {
      user.hairConcern = Array.isArray(hairConcerns) ? hairConcerns.join(',') : hairConcerns
    }
    if (bodyType !== undefined) user.bodyType = bodyType
    if (bodyConcerns !== undefined) {
      user.bodyConcern = Array.isArray(bodyConcerns) ? bodyConcerns.join(',') : bodyConcerns
    }
    if (age !== undefined) {
      user.age = age
    }

    await user.save()

    let parsedCity = user.city
    try {
      if (user.city && (user.city.startsWith('{') || user.city.startsWith('['))) {
        parsedCity = JSON.parse(user.city)
      }
    } catch (e) {}

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: parsedCity,
        skinType: user.skinType,
        skinConcerns: user.skinConcern ? user.skinConcern.split(',').filter(Boolean) : [],
        hairType: user.hairType,
        hairPorosity: user.hairPorosity,
        hairConcerns: user.hairConcern ? user.hairConcern.split(',').filter(Boolean) : [],
        bodyType: user.bodyType,
        bodyConcerns: user.bodyConcern ? user.bodyConcern.split(',').filter(Boolean) : [],
        age: user.age
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// SEND OTP
exports.sendOtp = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await OTP.deleteOne({ email })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const newOtp = new OTP({
      name,
      email,
      password: hashedPassword,
      otp,
      createdAt: new Date(),
      lastSentAt: new Date()
    })

    await newOtp.save()
    await sendOTP(email, otp, name)

    res.status(200).json({ message: 'OTP sent successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body

  try {
    const otpRecord = await OTP.findOne({ email })
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' })
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' })
    }

    const user = new User({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password
    })

    await user.save()
    await OTP.deleteOne({ email })

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    let parsedCity = user.city
    try {
      if (user.city && (user.city.startsWith('{') || user.city.startsWith('['))) {
        parsedCity = JSON.parse(user.city)
      }
    } catch (e) {}

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: parsedCity,
        skinType: user.skinType,
        skinConcerns: user.skinConcern ? user.skinConcern.split(',').filter(Boolean) : [],
        hairType: user.hairType,
        hairPorosity: user.hairPorosity,
        hairConcerns: user.hairConcern ? user.hairConcern.split(',').filter(Boolean) : [],
        bodyType: user.bodyType,
        bodyConcerns: user.bodyConcern ? user.bodyConcern.split(',').filter(Boolean) : [],
        age: user.age
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// RESEND OTP
exports.resendOtp = async (req, res) => {
  const { email } = req.body

  try {
    const otpRecord = await OTP.findOne({ email })
    if (!otpRecord) {
      return res.status(400).json({ message: 'No pending registration found for this email.' })
    }

    const now = new Date()
    const diffInSeconds = (now - new Date(otpRecord.lastSentAt)) / 1000
    if (diffInSeconds < 30) {
      const remaining = Math.ceil(30 - diffInSeconds)
      return res.status(429).json({ message: `Please wait ${remaining} seconds before requesting a new OTP.` })
    }

    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString()

    otpRecord.otp = newOtpCode
    otpRecord.createdAt = now
    otpRecord.lastSentAt = now

    await otpRecord.save()
    await sendOTP(email, newOtpCode, otpRecord.name)

    res.status(200).json({ message: 'OTP resent successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
