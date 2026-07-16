interface CheckboxGroupProps {
  label: string
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function CheckboxGroup({ label, options, selected, onChange }: CheckboxGroupProps) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold text-[var(--color-text-primary)]">{label}</legend>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 text-sm transition-colors hover:text-[var(--color-primary)]">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] cursor-pointer accent-[var(--color-primary)] transition-all"
            />
            <span className="leading-tight text-[var(--color-text-secondary)]">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
