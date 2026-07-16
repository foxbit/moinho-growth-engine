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
        <label htmlFor={inputId} className="mb-2 block text-xs font-semibold text-[var(--color-text-primary)]">
          {label} {required && <span className="text-[var(--color-critical)]">*</span>}
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
        className={`w-full rounded-md bg-[var(--color-bg-tertiary)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'ring-2 ring-[var(--color-critical)]' : ''
        }`}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-[var(--color-critical)]">{error}</p>}
    </div>
  )
}
