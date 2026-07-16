
import { useCallback, useEffect, useState } from 'react'
import TodoForm from './Components/TodoForm'
import TodoItem from './Components/TodoItem'
import Footer from './Components/Footer.tsx'
import GoogleLoginButton from './Components/GoogleLoginButton.tsx'
import { api, session } from './api.ts'
import type { Task, User } from './types.ts'

function App() {
    const [user, setUser] = useState<User | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadTasks = useCallback(async () => {
        const { tasks: savedTasks } = await api.getTasks()
        setTasks(savedTasks)
    }, [])

    useEffect(() => {
        async function restoreSession() {
            if (!session.getToken()) {
                setLoading(false)
                return
            }

            try {
                const { user: savedUser } = await api.currentUser()
                setUser(savedUser)
                await loadTasks()
            } catch {
                session.clear()
            } finally {
                setLoading(false)
            }
        }

        void restoreSession()
    }, [loadTasks])

    async function handleGoogleCredential(credential: string) {
        setError('')
        setLoading(true)
        try {
            const result = await api.googleLogin(credential)
            session.setToken(result.token)
            setUser(result.user)
            await loadTasks()
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : 'Η σύνδεση απέτυχε.')
        } finally {
            setLoading(false)
        }
    }

    async function handleAdd(text: string) {
        setError('')
        try {
            const { task } = await api.createTask(text)
            setTasks((current) => [task, ...current])
        } catch (taskError) {
            setError(taskError instanceof Error ? taskError.message : 'Το task δεν αποθηκεύτηκε.')
        }
    }

    async function handleToggle(task: Task) {
        try {
            const { task: updatedTask } = await api.updateTask(task._id, {
                completed: !task.completed,
            })
            setTasks((current) =>
                current.map((item) => (item._id === updatedTask._id ? updatedTask : item)),
            )
        } catch (taskError) {
            setError(taskError instanceof Error ? taskError.message : 'Η αλλαγή δεν αποθηκεύτηκε.')
        }
    }

    async function handleDelete(id: string) {
        try {
            await api.deleteTask(id)
            setTasks((current) => current.filter((task) => task._id !== id))
        } catch (taskError) {
            setError(taskError instanceof Error ? taskError.message : 'Το task δεν διαγράφηκε.')
        }
    }

    function handleLogout() {
        session.clear()
        setUser(null)
        setTasks([])
        setError('')
    }

    return (
        <div className="min-h-screen bg-amber-200 flex flex-col items-center px-4 pt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-3">My Todo App</h1>
                <p className="text-center text-gray-400 text-sm mb-6">Διαχειρίσου τις καθημερινές σου υποχρεώσεις εύκολα και γρήγορα!</p>

                {loading && <p className="text-center text-gray-500">Φόρτωση...</p>}

                {!loading && !user && (
                    <div className="text-center">
                        <p className="text-gray-600 mb-5">Συνδέσου για να αποθηκεύεται η πρόοδός σου.</p>
                        <GoogleLoginButton onCredential={handleGoogleCredential} />
                    </div>
                )}

                {!loading && user && (
                    <>
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 min-w-0">
                                {user.avatar && <img src={user.avatar} alt="" className="w-9 h-9 rounded-full" />}
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-700 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="text-sm text-blue-600 hover:underline ml-3">
                                Έξοδος
                            </button>
                        </div>

                        <TodoForm onAdd={handleAdd} />
                        <div className="mt-6 flex flex-col gap-3">
                            {tasks.length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-4">Δεν έχεις tasks ακόμη.</p>
                            )}
                            {tasks.map((task) => (
                                <TodoItem
                                    key={task._id}
                                    text={task.text}
                                    done={task.completed}
                                    onToggle={() => void handleToggle(task)}
                                    onDelete={() => void handleDelete(task._id)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
            </div>
            <Footer/>
        </div>
    )
}



export default App
