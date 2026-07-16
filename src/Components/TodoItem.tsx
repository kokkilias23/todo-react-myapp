type Props = {
    text: string
    done: boolean
    onToggle: () => void
    onDelete: () => void
}

function TodoItem({ text, done, onToggle, onDelete }: Props) {
    return (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <button
                type="button"
                onClick={onToggle}
                aria-label={done ? 'Σήμανση ως μη ολοκληρωμένο' : 'Σήμανση ως ολοκληρωμένο'}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 cursor-pointer transition ${
                    done ? 'bg-green-500' : 'bg-gray-400'
                }`}
            >
                {done ? '✓' : '-'}
            </button>
            <p className={`flex-1 break-words text-gray-700 ${done ? 'line-through text-gray-400' : ''}`}>
                {text}
            </p>
            <button
                type="button"
                onClick={onDelete}
                aria-label="Διαγραφή task"
                className="text-gray-400 hover:text-red-600 px-1 text-xl transition"
            >
                ×
            </button>
        </div>
    )
}

export default TodoItem
