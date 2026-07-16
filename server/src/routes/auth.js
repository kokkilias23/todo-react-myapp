import express from 'express'
import rateLimit from 'express-rate-limit'
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
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  }
}

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

    const token = jwt.sign({}, config.jwtSecret, {
      subject: user.id,
      expiresIn: '7d',
    })

    return res.json({ token, user: publicUser(user) })
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
