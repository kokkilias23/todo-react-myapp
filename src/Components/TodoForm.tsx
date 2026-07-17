
import { useState } from 'react'
import { translations, type Language } from '../i18n'

type Props = {
    onAdd: (text: string) => void
    language: Language
}

function TodoForm({ onAdd, language }: Props) {
    const [input, setInput] = useState('')
    const t = translations[language]

    function handleClick() {
        if (input.trim() === '') return
        onAdd(input)
        setInput('')
    }

    return (
        <div className="flex gap-2">
            <input
                type="text"
                placeholder={t.dreamPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                className="w-80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >{t.save}</button>
        </div>
    )
}

export default TodoForm
