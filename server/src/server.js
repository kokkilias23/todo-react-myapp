import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import { config } from './config.js'
import { requireAuth } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'

const app = express()

app.set('trust proxy', 1)
app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.frontendOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Origin is not allowed by CORS'))
    },
  }),
)
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/tasks', requireAuth, taskRoutes)

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))
app.use((error, _req, res, _next) => {
  console.error(error)
  const status = error.message === 'Origin is not allowed by CORS' ? 403 : 500
  res.status(status).json({ message: status === 500 ? 'Internal server error' : error.message })
})

await mongoose.connect(config.mongoUri)
app.listen(config.port, () => {
  console.log(`HaveToDo API listening on port ${config.port}`)
})
