interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'date' | 'time'
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

export function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  required,
  id,
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\W+/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
          {label} {required && <span className="text-critical">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary disabled:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-900 ${
          error ? 'border-critical' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {error && <p className="mt-1 text-xs text-critical">{error}</p>}
    </div>
  )
}
