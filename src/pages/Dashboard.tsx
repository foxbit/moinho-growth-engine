import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useFilter } from '../hooks/useFilter'
import { useDebounce } from '../hooks/useDebounce'
import { Badge, badgeCrescimento, badgePorte } from '../components/Badge'
import { Button } from '../components/Button'
import { CheckboxGroup } from '../components/CheckboxGroup'
import { CompanyDetail } from '../components/CompanyDetail'
import { CompanyTable } from '../components/CompanyTable'
import { MapLegend } from '../components/MapLegend'
import { MapView } from '../components/MapView'
import { Select } from '../components/Select'
import type { Company } from '../types'
import { setorCurto } from '../utils/colors'

const PORTES = ['MICRO', 'PEQUENA', 'MÉDIA', 'GRANDE']
const CRESCIMENTOS = ['ALTO', 'MÉDIO', 'BAIXO']

export function Dashboard() {
  const { companies, cidades, setores } = useAppStore()
  const { filters, setFilters, filtered, limpar } = useFilter(companies)
  const [buscaLocal, setBuscaLocal] = useState('')
  const buscaDebounced = useDebounce(buscaLocal, 300)
  const [detalhe, setDetalhe] = useState<{ company: Company; agendar?: boolean } | null>(null)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)

  // Aplica a busca com debounce sobre os demais filtros
  const resultado = useMemo(() => {
    const q = buscaDebounced.trim().toLowerCase()
    if (!q) return filtered
    return filtered.filter((c) =>
      `${c.razaoSocial} ${c.nomeFantasia} ${c.cnpj} ${c.bairro}`.toLowerCase().includes(q),
    )
  }, [filtered, buscaDebounced])

  // Mantém o painel de detalhes sincronizado com o estado global (novas interações)
  const companyDetalhe = detalhe ? companies.find((c) => c.id === detalhe.company.id) : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard de Inteligência Comercial</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Encontre, qualifique e ative empresas da região em minutos.
          </p>
        </div>
        <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setFiltrosAbertos(!filtrosAbertos)}>
          <SlidersHorizontal className="h-4 w-4" /> Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <aside
          className={`h-fit space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#111827] ${
            filtrosAbertos ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={buscaLocal}
              onChange={(e) => setBuscaLocal(e.target.value)}
              placeholder="Razão social, CNPJ ou bairro..."
              aria-label="Buscar empresas"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800"
            />
          </div>

          <Select
            label="Cidade"
            placeholder="Todas as cidades"
            value={filters.cidade}
            onChange={(cidade) => setFilters({ ...filters, cidade })}
            options={cidades.map((c) => ({ label: `${c.nome} (${c.empresas})`, value: c.nome }))}
          />

          <CheckboxGroup
            label="Setor"
            options={setores.map((s) => ({ label: setorCurto(s.nome), value: s.nome }))}
            selected={filters.setores}
            onChange={(sel) => setFilters({ ...filters, setores: sel })}
          />

          <CheckboxGroup
            label="Porte"
            options={PORTES.map((p) => ({ label: p.charAt(0) + p.slice(1).toLowerCase(), value: p }))}
            selected={filters.portes}
            onChange={(sel) => setFilters({ ...filters, portes: sel })}
          />

          <CheckboxGroup
            label="Crescimento CAGED"
            options={CRESCIMENTOS.map((c) => ({ label: c.charAt(0) + c.slice(1).toLowerCase(), value: c }))}
            selected={filters.crescimento}
            onChange={(sel) => setFilters({ ...filters, crescimento: sel })}
          />

          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              limpar()
              setBuscaLocal('')
            }}
          >
            Limpar Filtros
          </Button>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="space-y-2">
            <MapView
              companies={resultado}
              height="h-[380px]"
              renderPopup={(company) => (
                <div className="min-w-[190px] space-y-1.5 text-sm">
                  <p className="font-semibold leading-snug">{company.razaoSocial}</p>
                  <p className="text-xs text-gray-500">
                    {setorCurto(company.setor)} · {company.cidade}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge label={company.porte} variant={badgePorte(company.porte)} />
                    <Badge label={company.crescimentoCAGED} variant={badgeCrescimento(company.crescimentoCAGED)} />
                  </div>
                  <p className="text-xs">
                    Score: <strong>{company.scoreConversao.toFixed(1)}/10</strong>
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={() => setDetalhe({ company })}
                    >
                      Ver Detalhes
                    </button>
                    <button
                      className="text-xs font-medium text-secondary hover:underline"
                      onClick={() => setDetalhe({ company, agendar: true })}
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              )}
            />
            <MapLegend setores={setores.map((s) => s.nome)} />
          </div>

          <CompanyTable
            companies={resultado}
            onVerDetalhes={(company) => setDetalhe({ company })}
            onAgendar={(company) => setDetalhe({ company, agendar: true })}
          />
        </div>
      </div>

      {companyDetalhe && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-fade-in"
          onClick={() => setDetalhe(null)}
        >
          <div className="h-full w-full max-w-2xl p-3" onClick={(e) => e.stopPropagation()}>
            <CompanyDetail
              company={companyDetalhe}
              onClose={() => setDetalhe(null)}
              acaoInicial={detalhe?.agendar ? 'demonstracao' : null}
            />
          </div>
        </div>
      )}
    </div>
  )
}
