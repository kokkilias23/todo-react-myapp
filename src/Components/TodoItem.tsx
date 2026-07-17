import { translations, type Language } from '../i18n'

type Props = {
    text: string
    done: boolean
    targetMonth?: string
    targetDate?: string
    onToggle: () => void
    onDelete: () => void
    language: Language
}

function formatTargetMonth(value: string, language: Language) {
    const [year, month] = value.split('-').map(Number)
    if (!year || !month) return value

    const formatted = new Intl.DateTimeFormat(language === 'el' ? 'el-GR' : 'en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, 1)))

    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function TodoItem({ text, done, targetMonth, targetDate, onToggle, onDelete, language }: Props) {
    const t = translations[language]
    return (
        <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-4 py-3 shadow-sm transition">
            <button
                type="button"
                onClick={onToggle}
                aria-label={done ? t.markUnfulfilled : t.markFulfilled}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 cursor-pointer transition ${
                    done ? 'bg-amber-300 text-slate-900 shadow-md shadow-amber-300/20' : 'bg-violet-300/20 text-violet-100'
                }`}
            >
                {done ? '✓' : '-'}
            </button>
            <div className="flex-1 min-w-0">
                <p className={`break-words ${done ? 'line-through text-indigo-100/40' : 'text-white/90'}`}>
                    {text}
                </p>
                {(targetDate || targetMonth) && (
                    <span className="inline-flex items-center mt-2 rounded-full bg-violet-300/15 border border-violet-200/15 px-2.5 py-1 text-xs text-violet-100/80">
                        🎯 {t.target}: {formatTargetMonth(
                            targetMonth || targetDate!.slice(0, 7),
                            language,
                        )}
                    </span>
                )}
            </div>
            <button
                type="button"
                onClick={onDelete}
                aria-label={t.deleteDream}
                className="text-white/35 hover:text-rose-300 px-1 text-xl transition"
            >
                ×
            </button>
        </div>
    )
}

export default TodoItem
