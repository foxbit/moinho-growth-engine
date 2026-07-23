import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  /** Realce de hover (elevação + leve subida) para cards clicáveis/destacados. */
  interactive?: boolean
}

export function Card({ title, subtitle, children, className = '', interactive = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] p-6 shadow-[var(--shadow-md)] transition-[box-shadow,transform,background-color] duration-300 ${
        interactive ? 'hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]' : ''
      } ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
