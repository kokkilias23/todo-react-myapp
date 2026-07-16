import { useState } from 'react'

type Props = {
  onSubmit: (mode: 'login' | 'register', username: string, password: string) => Promise<void>
}

function CredentialsForm({ onSubmit }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!username.trim() || !password) return

    setSubmitting(true)
    try {
      await onSubmit(mode, username, password)
    } finally {
      setSubmitting(false)
    }
  }

  function changeMode(nextMode: 'login' | 'register') {
    setMode(nextMode)
    setPassword('')
  }

  return (
    <div>
      <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1 mb-4">
        <button
          type="button"
          onClick={() => changeMode('login')}
          className={`rounded-md py-2 text-sm font-medium transition ${
            mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          Σύνδεση
        </button>
        <button
          type="button"
          onClick={() => changeMode('register')}
          className={`rounded-md py-2 text-sm font-medium transition ${
            mode === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          Εγγραφή
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-left">
          <span className="text-sm text-gray-600">Username</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            minLength={3}
            maxLength={30}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="block text-left">
          <span className="text-sm text-gray-600">Κωδικός</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            minLength={8}
            maxLength={128}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {submitting ? 'Παρακαλώ περιμένετε...' : mode === 'login' ? 'Σύνδεση' : 'Δημιουργία λογαριασμού'}
        </button>
      </form>
    </div>
  )
}

export default CredentialsForm
