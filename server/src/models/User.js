import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true, index: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: { type: String, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    passwordHash: { type: String, select: false },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)
