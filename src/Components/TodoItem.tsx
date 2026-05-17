import { useState } from 'react'

type Props = {
    text: string
}

function TodoItem({ text }: Props) {
    const [done, setDone] = useState(false)

    return (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <div
                onClick={() => setDone(!done)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 cursor-pointer transition ${
                    done ? 'bg-green-500' : 'bg-gray-400'
                }`}
            >
                {done ? '✓' : '-'}
            </div>
            <p className={`text-gray-700 ${done ? 'line-through text-gray-400' : ''}`}>
                {text}
            </p>
        </div>
    )
}

export default TodoItem