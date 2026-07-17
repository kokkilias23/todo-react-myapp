import express from 'express'
import mongoose from 'mongoose'
import { Task } from '../models/Task.js'

const router = express.Router()
const targetMonthPattern = /^\d{4}-(0[1-9]|1[0-2])$/
const targetDatePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

function isRealDate(value) {
  if (!targetDatePattern.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
}

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 })
    return res.json({ tasks })
  } catch (error) {
    return next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
    if (!text) return res.status(400).json({ message: 'Task text is required' })
    if (text.length > 300) {
      return res.status(400).json({ message: 'Task must be 300 characters or fewer' })
    }

    const targetMonth = typeof req.body?.targetMonth === 'string'
      ? req.body.targetMonth.trim()
      : ''
    if (targetMonth && !targetMonthPattern.test(targetMonth)) {
      return res.status(400).json({ message: 'Target month must use YYYY-MM format' })
    }
    const targetDate = typeof req.body?.targetDate === 'string'
      ? req.body.targetDate.trim()
      : ''
    if (targetDate && !isRealDate(targetDate)) {
      return res.status(400).json({ message: 'Target date must use a valid YYYY-MM-DD format' })
    }

    const task = await Task.create({
      user: req.userId,
      text,
      ...(targetMonth ? { targetMonth } : {}),
      ...(targetDate ? { targetDate } : {}),
    })
    return res.status(201).json({ task })
  } catch (error) {
    return next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const updates = {}
    if (typeof req.body?.completed === 'boolean') updates.completed = req.body.completed
    if (typeof req.body?.text === 'string') {
      const text = req.body.text.trim()
      if (!text || text.length > 300) {
        return res.status(400).json({ message: 'Task text must be 1-300 characters' })
      }
      updates.text = text
    }
    if (typeof req.body?.targetMonth === 'string') {
      const targetMonth = req.body.targetMonth.trim()
      if (!targetMonthPattern.test(targetMonth)) {
        return res.status(400).json({ message: 'Target month must use YYYY-MM format' })
      }
      updates.targetMonth = targetMonth
    }
    if (typeof req.body?.targetDate === 'string') {
      const targetDate = req.body.targetDate.trim()
      if (!isRealDate(targetDate)) {
        return res.status(400).json({ message: 'Target date must use a valid YYYY-MM-DD format' })
      }
      updates.targetDate = targetDate
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid task changes supplied' })
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true, runValidators: true },
    )

    if (!task) return res.status(404).json({ message: 'Task not found' })
    return res.json({ task })
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
})

export default router
