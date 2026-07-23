import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface MultiSelectDropdownProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function MultiSelectDropdown({ label, options, selected, onChange }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    document.addEventListener('mousedown', onClickOutside)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const toggleOption = (option: string) => {
    onChange(selected.includes(option) ? selected.filter((v) => v !== option) : [...selected, option])
  }

  const buttonLabel = selected.length === 0 ? label : `${label} (${selected.length})`

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
          selected.length > 0
            ? 'bg-[var(--color-primary-dark)] text-white'
            : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-tertiary)]/20'
        }`}
      >
        {buttonLabel}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 z-20 mt-2 max-h-72 w-64 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-2 shadow-lg animate-scale-in"
        >
          <button
            type="button"
            onClick={() => onChange([])}
            className="mb-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
          >
            Limpar seleção
          </button>
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--color-bg-tertiary)]"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="h-4 w-4 shrink-0 rounded border-[var(--color-border)] text-[var(--color-primary)] accent-[var(--color-primary)]"
              />
              <span className="truncate text-[var(--color-text-primary)]" title={option}>
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
