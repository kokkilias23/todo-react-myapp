export type User = {
  id: string
  username: string
  email: string
  name: string
  avatar: string
}

export type Task = {
  _id: string
  text: string
  completed: boolean
  targetMonth?: string
  targetDate?: string
  createdAt: string
  updatedAt: string
}
