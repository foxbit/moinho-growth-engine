interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'
  size?: 'sm' | 'md'
}

const VARIANTES = {
  success: 'bg-[#D1FAE5] text-[#065F46] dark:bg-[#064E3B] dark:text-[#86EFAC]',
  warning: 'bg-[#FEF3C7] text-[#92400E] dark:bg-[#78350F] dark:text-[#FDE047]',
  danger: 'bg-[#FEE2E2] text-[#991B1B] dark:bg-[#7F1D1D] dark:text-[#FCA5A5]',
  info: 'bg-[#E8EFFF] text-[#003BA3] dark:bg-[#1E3A8A] dark:text-[#93C5FD]',
  primary: 'bg-[#E8EFFF] text-[#0052CC] dark:bg-[#1E3A8A] dark:text-[#60A5FA]',
  neutral: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
}

export function Badge({ label, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const tamanho = size === 'sm' ? 'px-2.5 py-1 text-xs font-medium' : 'px-3 py-1.5 text-sm font-medium'
  return (
    <span className={`inline-flex items-center rounded-full transition-colors ${VARIANTES[variant]} ${tamanho}`}>
      {label}
    </span>
  )
}

export function badgePorte(porte: string): BadgeProps['variant'] {
  return ({ MICRO: 'info', PEQUENA: 'success', 'MÉDIA': 'warning', GRANDE: 'danger' } as const)[porte] ?? 'neutral'
}

export function badgeCrescimento(cresc: string): BadgeProps['variant'] {
  return ({ ALTO: 'success', 'MÉDIO': 'warning', BAIXO: 'danger' } as const)[cresc] ?? 'neutral'
}
