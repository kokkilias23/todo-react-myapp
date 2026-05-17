
import { useState } from 'react'
import TodoForm from './Components/TodoForm'
import TodoItem from './Components/TodoItem'
import Footer from "./Components/Footer.tsx";

function App() {
    const [todos, setTodos] = useState<string[]>([])

    function handleAdd(text: string) {
        setTodos([...todos, text])
    }

    return (
        <div className="min-h-screen bg-amber-200 flex flex-col items-center pt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"><h1 className="text-3xl font-bold text-center text-blue-600 mb-3">My Todo App</h1>
                <p className="text-center text-gray-400 text-sm mb-6">Διαχειρίσου τις καθημερινές σου υποχρεώσεις εύκολα και γρήγορα!</p>
                <TodoForm onAdd={handleAdd} />
                <div className="mt-6 flex flex-col gap-3">
                    {todos.map((todo, index) => (
                        <TodoItem key={index} text={todo} />
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
}



export default App