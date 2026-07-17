
import { useState } from 'react'
import { translations, type Language } from '../i18n'

type Props = {
    onAdd: (text: string, targetMonth?: string) => void
    language: Language
}

function TodoForm({ onAdd, language }: Props) {
    const [input, setInput] = useState('')
    const [targetMonth, setTargetMonth] = useState('')
    const t = translations[language]

    function handleClick() {
        if (input.trim() === '') return
        onAdd(input, targetMonth || undefined)
        setInput('')
        setTargetMonth('')
    }

    return (
        <div className="flex flex-col gap-3">
            <input
                type="text"
                placeholder={t.dreamPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                className="w-full border border-white/20 bg-white/10 text-white placeholder:text-indigo-100/45 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white/15 transition"
            />
            <div className="flex gap-2 items-end">
                <label className="flex-1 text-left">
                    <span className="block text-xs text-indigo-100/55 mb-1">{t.targetMonth}</span>
                    <input
                        type="month"
                        value={targetMonth}
                        onChange={(event) => setTargetMonth(event.target.value)}
                        className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 [color-scheme:dark] transition"
                    />
                </label>
                <button onClick={handleClick}
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-2 rounded-lg hover:from-violet-400 hover:to-fuchsia-400 shadow-lg shadow-purple-950/30 transition"
                >{t.save}</button>
            </div>
        </div>
    )
}

export default TodoForm
