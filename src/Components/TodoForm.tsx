
import { useState } from 'react'

type Props = {
    onAdd: (text: string) => void
}

function TodoForm({ onAdd }: Props) {
    const [input, setInput] = useState('')

    function handleClick() {
        if (input.trim() === '') return
        onAdd(input)
        setInput('')
    }

    return (
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="Γράψε ένα όνειρο..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                className="w-80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >Αποθήκευση</button>
        </div>
    )
}

export default TodoForm
