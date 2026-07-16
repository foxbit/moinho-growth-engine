import { CalendarCheck, FileSignature, Mail, MapPin, StickyNote } from 'lucide-react'
import type { Interaction, TipoInteracao } from '../types'
import { formatDateTime } from '../utils/format'

const ICONES: Record<TipoInteracao, { icon: typeof Mail; cor: string; rotulo: string }> = {
  EMAIL_ENVIADO: { icon: Mail, cor: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30', rotulo: 'Email enviado' },
  'DEMONSTRAÇÃO_AGENDADA': {
    icon: CalendarCheck,
    cor: 'text-green-600 bg-green-50 dark:bg-green-900/30',
    rotulo: 'Demonstração agendada',
  },
  VISITA_PRESENCIAL: { icon: MapPin, cor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30', rotulo: 'Visita presencial' },
  NOTA_INTERNA: { icon: StickyNote, cor: 'text-gray-500 bg-gray-100 dark:bg-gray-800', rotulo: 'Nota interna' },
  CONTRATO_ASSINADO: {
    icon: FileSignature,
    cor: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30',
    rotulo: 'Contrato assinado',
  },
}

export function InteractionTimeline({ interacoes }: { interacoes: Interaction[] }) {
  if (interacoes.length === 0) {
    return <p className="text-sm text-gray-400">Nenhuma interação registrada ainda.</p>
  }

  const ordenadas = [...interacoes].sort((a, b) => b.data.localeCompare(a.data))

  return (
    <ol className="space-y-3">
      {ordenadas.map((int) => {
        const meta = ICONES[int.tipo] ?? ICONES.NOTA_INTERNA
        const Icone = meta.icon
        return (
          <li key={int.id} className="flex gap-3">
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.cor}`}>
              <Icone className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {meta.rotulo}
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {formatDateTime(int.data)} · {int.usuario}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{int.descricao}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
