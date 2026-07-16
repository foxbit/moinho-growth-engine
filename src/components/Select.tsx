interface SelectProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  id?: string
}

export function Select({ options, value, onChange, placeholder, label, id }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\W+/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
