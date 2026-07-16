import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { MapView } from '../components/MapView'
import { MapLegend } from '../components/MapLegend'
import { CheckboxGroup } from '../components/CheckboxGroup'
import { Badge, badgePorte } from '../components/Badge'
import { setorCurto } from '../utils/colors'

export function MapaPublico() {
  const { companies, setores } = useAppStore()
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>([])

  const filtradas = useMemo(
    () =>
      setoresSelecionados.length === 0
        ? companies
        : companies.filter((c) => setoresSelecionados.includes(c.setor)),
    [companies, setoresSelecionados],
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Mapa do Ecossistema</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          {filtradas.length} empresas na região de Juiz de Fora. Clique em um marcador para conhecer a empresa.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#111827]">
          <CheckboxGroup
            label="Filtrar por setor"
            options={setores.map((s) => ({ label: setorCurto(s.nome), value: s.nome }))}
            selected={setoresSelecionados}
            onChange={setSetoresSelecionados}
          />
        </aside>

        <div className="space-y-2">
          <MapView
            companies={filtradas}
            height="h-[540px]"
            renderPopup={(company) => (
              <div className="min-w-[180px] space-y-1.5 text-sm">
                <p className="font-semibold leading-snug">{company.razaoSocial}</p>
                <p className="text-xs text-gray-500">
                  {setorCurto(company.setor)} · {company.bairro}, {company.cidade}
                </p>
                <Badge label={company.porte} variant={badgePorte(company.porte)} />
                <div className="pt-1">
                  <Link
                    to={`/empresas/${company.id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Ver perfil completo →
                  </Link>
                </div>
              </div>
            )}
          />
          <MapLegend setores={setores.map((s) => s.nome)} />
        </div>
      </div>
    </div>
  )
}
