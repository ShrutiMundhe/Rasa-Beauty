const mongoose = require('mongoose')

const connectDB = async () => {
  // This line will print the actual value in your Render logs
  console.log("DEBUG - Attempting to connect with MONGO_URI:", process.env.MONGO_URI)
  
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected ✅')
  } catch (err) {
    // This will print exactly why it failed (e.g., Auth error, wrong URL, etc.)
    console.error("DEBUG - Connection failed:", err.message)
    process.exit(1)
  }
}

module.exports = connectDB