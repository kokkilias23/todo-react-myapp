import express from 'express'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { requireAuth } from '../middleware/auth.js'
import { User } from '../models/User.js'

const router = express.Router()
const googleClient = new OAuth2Client(config.googleClientId)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

function publicUser(user) {
  return {
    id: user.id,
    username: user.username || '',
    email: user.email || '',
    name: user.name,
    avatar: user.avatar,
  }
}

function signSession(user) {
  return jwt.sign({}, config.jwtSecret, {
    subject: user.id,
    expiresIn: '7d',
  })
}

function normalizeUsername(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function validUsername(username) {
  return /^[\p{L}\p{N}_]{3,30}$/u.test(username)
}

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body?.username)
    const password = typeof req.body?.password === 'string' ? req.body.password : ''

    if (!validUsername(username)) {
      return res.status(400).json({
        message: 'Το username πρέπει να έχει 3-30 γράμματα, αριθμούς ή κάτω παύλα.',
      })
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: 'Ο κωδικός πρέπει να έχει 8-128 χαρακτήρες.' })
    }

    const existingUser = await User.exists({ username })
    if (existingUser) {
      return res.status(409).json({ message: 'Αυτό το username χρησιμοποιείται ήδη.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ username, name: username, passwordHash })
    return res.status(201).json({ token: signSession(user), user: publicUser(user) })
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Αυτό το username χρησιμοποιείται ήδη.' })
    }
    return next(error)
  }
})

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body?.username)
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const user = await User.findOne({ username }).select('+passwordHash')

    if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Λάθος username ή κωδικός.' })
    }

    return res.json({ token: signSession(user), user: publicUser(user) })
  } catch (error) {
    return next(error)
  }
})

router.post('/google', authLimiter, async (req, res, next) => {
  try {
    const credential = req.body?.credential

    if (typeof credential !== 'string' || !credential) {
      return res.status(400).json({ message: 'Google credential is required' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    })
    const payload = ticket.getPayload()

    if (!payload?.sub || !payload.email || !payload.email_verified) {
      return res.status(401).json({ message: 'Google account could not be verified' })
    }

    const user = await User.findOneAndUpdate(
      { googleId: payload.sub },
      {
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        avatar: payload.picture || '',
      },
      { new: true, upsert: true, runValidators: true },
    )

    return res.json({ token: signSession(user), user: publicUser(user) })
  } catch (error) {
    return next(error)
  }
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(401).json({ message: 'User no longer exists' })
    return res.json({ user: publicUser(user) })
  } catch (error) {
    return next(error)
  }
})

export default router
