import { useState } from 'react'
import { Calendar, MapPin, Users } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { EventInscricaoModal } from '../components/EventInscricaoModal'
import type { Event } from '../types'
import { formatDateTime } from '../utils/format'

const CATEGORIA_VARIANTE = { BOOTCAMP: 'info', WORKSHOP: 'warning', NETWORKING: 'success' } as const

export function Eventos() {
  const events = useAppStore((s) => s.events)
  const [eventoSelecionado, setEventoSelecionado] = useState<Event | null>(null)

  const ordenados = [...events].sort((a, b) => a.data.localeCompare(b.data))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Eventos e Bootcamps</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Participe dos encontros do Moinho e conecte-se ao ecossistema de inovação da região.
        </p>
      </div>

      <div className="space-y-4">
        {ordenados.map((evento) => {
          const restantes = evento.vagas - evento.inscritos
          const ocupacao = Math.round((evento.inscritos / evento.vagas) * 100)
          return (
            <div
              key={evento.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#111827]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{evento.titulo}</h2>
                    <Badge label={evento.categoria} variant={CATEGORIA_VARIANTE[evento.categoria]} />
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{evento.descricao}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> {formatDateTime(evento.data)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {evento.local}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4" /> {evento.inscritos}/{evento.vagas} inscritos
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full ${ocupacao >= 90 ? 'bg-critical' : ocupacao >= 60 ? 'bg-alert' : 'bg-secondary'}`}
                      style={{ width: `${ocupacao}%` }}
                    />
                  </div>
                </div>
                <Button
                  disabled={restantes <= 0}
                  variant={restantes <= 0 ? 'secondary' : 'primary'}
                  onClick={() => setEventoSelecionado(evento)}
                >
                  {restantes <= 0 ? 'Esgotado' : 'Inscrever-se'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <EventInscricaoModal event={eventoSelecionado} onClose={() => setEventoSelecionado(null)} />
    </div>
  )
}
