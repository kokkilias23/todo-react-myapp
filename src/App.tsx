
import { useCallback, useEffect, useState } from 'react'
import TodoForm from './Components/TodoForm'
import TodoItem from './Components/TodoItem'
import Footer from './Components/Footer.tsx'
import GoogleLoginButton from './Components/GoogleLoginButton.tsx'
import CredentialsForm from './Components/CredentialsForm.tsx'
import { api, session } from './api.ts'
import type { Task, User } from './types.ts'
import { localizeApiError, translations, type Language } from './i18n.ts'

const LANGUAGE_KEY = 'dreambox_language'

function initialLanguage(): Language {
    const saved = localStorage.getItem(LANGUAGE_KEY)
    if (saved === 'el' || saved === 'en') return saved
    return navigator.language.toLowerCase().startsWith('el') ? 'el' : 'en'
}

function App() {
    const [user, setUser] = useState<User | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [language, setLanguage] = useState<Language>(initialLanguage)
    const t = translations[language]

    function changeLanguage(nextLanguage: Language) {
        setLanguage(nextLanguage)
        localStorage.setItem(LANGUAGE_KEY, nextLanguage)
        setError('')
    }

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
            setError(localizeApiError(loginError, language, t.authError))
        } finally {
            setLoading(false)
        }
    }

    async function handleCredentials(
        mode: 'login' | 'register',
        username: string,
        password: string,
    ) {
        setError('')
        try {
            const result = mode === 'register'
                ? await api.register(username, password)
                : await api.login(username, password)
            session.setToken(result.token)
            setUser(result.user)
            await loadTasks()
        } catch (authError) {
            setError(localizeApiError(authError, language, t.authError))
            throw authError
        }
    }

    async function handleAdd(text: string) {
        setError('')
        try {
            const { task } = await api.createTask(text)
            setTasks((current) => [task, ...current])
        } catch (taskError) {
            setError(localizeApiError(taskError, language, t.saveError))
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
            setError(localizeApiError(taskError, language, t.updateError))
        }
    }

    async function handleDelete(id: string) {
        try {
            await api.deleteTask(id)
            setTasks((current) => current.filter((task) => task._id !== id))
        } catch (taskError) {
            setError(localizeApiError(taskError, language, t.deleteError))
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
                <div className="flex justify-center items-center gap-2 mb-5 text-sm">
                    <button
                        type="button"
                        onClick={() => changeLanguage('el')}
                        className={language === 'el' ? 'font-semibold text-blue-600' : 'text-gray-500 hover:text-blue-600'}
                    >
                        🇬🇷 Ελληνικά
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        type="button"
                        onClick={() => changeLanguage('en')}
                        className={language === 'en' ? 'font-semibold text-blue-600' : 'text-gray-500 hover:text-blue-600'}
                    >
                        🇬🇧 English
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-3">{t.title}</h1>
                <p className="text-center text-gray-400 text-sm mb-6">{t.tagline}</p>

                {loading && <p className="text-center text-gray-500">{t.loading}</p>}

                {!loading && !user && (
                    <div className="text-center">
                        <p className="text-gray-600 mb-5">{t.loginIntro}</p>
                        <CredentialsForm onSubmit={handleCredentials} language={language} />
                        <div className="flex items-center gap-3 my-5">
                            <div className="h-px bg-gray-200 flex-1" />
                            <span className="text-xs text-gray-400">{t.or}</span>
                            <div className="h-px bg-gray-200 flex-1" />
                        </div>
                        <GoogleLoginButton onCredential={handleGoogleCredential} language={language} />
                    </div>
                )}

                {!loading && user && (
                    <>
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 min-w-0">
                                {user.avatar && <img src={user.avatar} alt="" className="w-9 h-9 rounded-full" />}
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-700 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {user.email || `@${user.username}`}
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="text-sm text-blue-600 hover:underline ml-3">
                                {t.logout}
                            </button>
                        </div>

                        <TodoForm onAdd={handleAdd} language={language} />
                        <div className="mt-6 flex flex-col gap-3">
                            {tasks.length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-4">{t.emptyBox}</p>
                            )}
                            {tasks.map((task) => (
                                <TodoItem
                                    key={task._id}
                                    text={task.text}
                                    done={task.completed}
                                    onToggle={() => void handleToggle(task)}
                                    onDelete={() => void handleDelete(task._id)}
                                    language={language}
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
