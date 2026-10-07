import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI || MONGO_URI.includes('<')) {
  console.error('')
  console.error('MONGO_URI set nahi hai.')
  console.error('backend/.env kholen aur apna Atlas connection string paste karein.')
  console.error('Misal ke liye backend/.env.example dekhein.')
  console.error('')
  process.exit(1)
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connect failed:', err.message)
    process.exit(1)
  })
