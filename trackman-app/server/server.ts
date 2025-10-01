import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import activityRoutes from './routes/activities'
import taskRoutes from './routes/tasks'
import healthRoutes from './routes/health'
import workRoutes from './routes/work'
import { initializeDatabase } from './database/init'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use(morgan('combined'))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/work', workRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase()
    console.log('✅ Database initialized successfully')
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
