interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
}

const VARIANTES = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export function Badge({ label, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const tamanho = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${VARIANTES[variant]} ${tamanho}`}>
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
