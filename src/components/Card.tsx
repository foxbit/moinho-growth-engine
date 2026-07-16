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
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#111827] ${className}`}
    >
      {title && (
        <div className="mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
