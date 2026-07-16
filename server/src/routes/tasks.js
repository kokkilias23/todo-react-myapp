import express from 'express'
import mongoose from 'mongoose'
import { Task } from '../models/Task.js'

const router = express.Router()

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

    const task = await Task.create({ user: req.userId, text })
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
