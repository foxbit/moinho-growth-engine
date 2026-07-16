import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Calendar, Map as MapIcon, Search, Tags } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EventInscricaoModal } from '../components/EventInscricaoModal'
import type { Event } from '../types'
import { formatDateTime } from '../utils/format'

export function Home() {
  const { companies, cidades, setores, events } = useAppStore()
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [eventoSelecionado, setEventoSelecionado] = useState<Event | null>(null)

  const buscar = () => navigate(busca.trim() ? `/empresas?q=${encodeURIComponent(busca.trim())}` : '/empresas')

  const proximosEventos = [...events].sort((a, b) => a.data.localeCompare(b.data))

  return (
    <div className="space-y-10">
      <section className="pt-8 text-center sm:pt-16">
        <h1 className="text-3xl font-bold sm:text-4xl">
          MOINHO — <span className="text-primary dark:text-blue-400">Ecossistema de Inovação</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-300">
          Descubra empresas da região de Juiz de Fora, conecte-se ao ecossistema e cresça junto.
        </p>

        <form
          className="mx-auto mt-6 flex max-w-xl gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            buscar()
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar empresas por nome, setor ou bairro..."
              aria-label="Buscar empresas"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icone: Building2, valor: companies.length, rotulo: 'Empresas Cadastradas' },
          { icone: MapIcon, valor: cidades.length, rotulo: 'Cidades Atendidas' },
          { icone: Tags, valor: setores.length, rotulo: 'Setores Representados' },
        ].map(({ icone: Icone, valor, rotulo }) => (
          <Card key={rotulo} className="text-center">
            <Icone className="mx-auto h-6 w-6 text-primary dark:text-blue-400" />
            <p className="mt-2 text-3xl font-bold">{valor}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{rotulo}</p>
          </Card>
        ))}
      </section>

      <section>
        <Card title="Próximos Eventos" subtitle="Bootcamps, workshops e encontros de networking no Moinho">
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {proximosEventos.map((evento) => (
              <li key={evento.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-blue-400" />
                  <div>
                    <p className="font-medium">{evento.titulo}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(evento.data)} · Vagas: {evento.vagas} · Inscritos: {evento.inscritos}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={evento.inscritos >= evento.vagas ? 'secondary' : 'primary'}
                  disabled={evento.inscritos >= evento.vagas}
                  onClick={() => setEventoSelecionado(evento)}
                >
                  {evento.inscritos >= evento.vagas ? 'Esgotado' : 'Inscrever-se'}
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="flex flex-wrap justify-center gap-3 pb-6">
        <Link to="/mapa"><Button variant="secondary">Explorar Mapa</Button></Link>
        <Link to="/empresas"><Button variant="secondary">Ver Todas as Empresas</Button></Link>
        <Link to="/eventos"><Button variant="ghost">Ver Eventos</Button></Link>
      </section>

      <EventInscricaoModal event={eventoSelecionado} onClose={() => setEventoSelecionado(null)} />
    </div>
  )
}
