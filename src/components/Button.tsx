import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  children: ReactNode
}

const VARIANTES = {
  primary: 'bg-primary text-white hover:bg-blue-800 disabled:bg-blue-300',
  secondary:
    'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  danger: 'bg-critical text-white hover:bg-red-600 disabled:bg-red-300',
  ghost: 'bg-transparent text-primary hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800',
}

const TAMANHOS = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed ${VARIANTES[variant]} ${TAMANHOS[size]} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
