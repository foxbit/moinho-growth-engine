import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  children: ReactNode
}

const VARIANTES = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-dark)] hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  danger:
    'bg-[var(--color-critical)] text-[var(--color-text-inverse)] hover:bg-red-600 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
}

const TAMANHOS = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-full',
  md: 'px-4 py-2.5 text-sm font-medium rounded-full',
  lg: 'px-6 py-3 text-base font-medium rounded-full',
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  loading,
  onClick,
  className = '',
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out ${VARIANTES[variant]} ${TAMANHOS[size]} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
