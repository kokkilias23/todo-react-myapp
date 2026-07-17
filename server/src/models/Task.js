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
    targetMonth: {
      type: String,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },
    targetDate: {
      type: String,
      match: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    },
  },
  { timestamps: true },
)

taskSchema.index({ user: 1, createdAt: -1 })

export const Task = mongoose.model('Task', taskSchema)
