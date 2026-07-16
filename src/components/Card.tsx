import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function Card({ title, subtitle, children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
