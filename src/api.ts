import type { Task, User } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TOKEN_KEY = 'havetodo_token'

export const session = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = session.getToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) session.clear()
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Κάτι πήγε στραβά. Δοκίμασε ξανά.')
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

export const api = {
  register: (username: string, password: string) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  login: (username: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  googleLogin: (credential: string) =>
    request<{ token: string; user: User }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),
  currentUser: () => request<{ user: User }>('/auth/me'),
  getTasks: () => request<{ tasks: Task[] }>('/tasks'),
  createTask: (text: string, targetMonth?: string) =>
    request<{ task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ text, targetMonth }),
    }),
  updateTask: (id: string, updates: Partial<Pick<Task, 'text' | 'completed'>>) =>
    request<{ task: Task }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  deleteTask: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
}
