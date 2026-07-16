import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export function requireAuth(req, res, next) {
  const authorization = req.get('authorization')
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    req.userId = payload.sub
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' })
  }
}
