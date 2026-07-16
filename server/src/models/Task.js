import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: { type: String, required: true, trim: true, maxlength: 300 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
)

taskSchema.index({ user: 1, createdAt: -1 })

export const Task = mongoose.model('Task', taskSchema)
