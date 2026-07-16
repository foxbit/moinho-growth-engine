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
      <legend className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">{label}</legend>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="h-4 w-4 rounded border-gray-300 text-primary accent-[#0052CC]"
            />
            <span className="leading-tight">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
