import { useMemo, useState, useCallback } from 'react'
import { MapPin, TrendingUp } from 'lucide-react'
import type { Company } from '../types'
import { useAppStore } from '../store/useAppStore'
import { useDebounce } from '../hooks/useDebounce'
import { Card } from '../components/Card'
import { Badge, badgePorte, badgeCrescimento } from '../components/Badge'
import { Button } from '../components/Button'
import { FilterBar } from '../components/FilterBar'
import { CompanyDrawer } from '../components/CompanyDrawer'
import { MapView } from '../components/MapView'
import { MapLegend } from '../components/MapLegend'
import { formatCurrency } from '../utils/format'
import { corDoSetor } from '../utils/colors'

export function OperationalDashboard() {
  const { companies, cidades, setores } = useAppStore()

  // Filter state
  const [buscaLocal, setBuscaLocal] = useState('')
  const busca = useDebounce(buscaLocal, 300)
  const [cidadesSelecionadas, setCidades] = useState<string[]>([])
  const [setoresSelecionados, setSetores] = useState<string[]>([])
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Company | null>(null)

  // Filtragem
  const filtradas = useMemo(() => {
    let resultado = companies

    if (cidadesSelecionadas.length > 0) {
      resultado = resultado.filter((c) => cidadesSelecionadas.includes(c.cidade))
    }
    if (setoresSelecionados.length > 0) {
      resultado = resultado.filter((c) => setoresSelecionados.includes(c.setor))
    }
    if (busca.trim()) {
      const buscaLower = busca.toLowerCase()
      resultado = resultado.filter((c) =>
        c.razaoSocial.toLowerCase().includes(buscaLower) ||
        c.nomeFantasia.toLowerCase().includes(buscaLower) ||
        c.bairro.toLowerCase().includes(buscaLower) ||
        c.cnpj.includes(busca)
      )
    }

    return resultado.sort((a, b) => b.scoreConversao - a.scoreConversao)
  }, [companies, busca, cidadesSelecionadas, setoresSelecionados])

  const temFiltrosAtivos = busca.trim() !== '' || cidadesSelecionadas.length > 0 || setoresSelecionados.length > 0

  const limpar = useCallback(() => {
    setBuscaLocal('')
    setCidades([])
    setSetores([])
  }, [])

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-3xl font-bold text-[var(--color-primary)]">{companies.length}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Empresas no Moinho</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-[var(--color-secondary)]">{setores.length}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Setores representados</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-[var(--color-accent)]">{cidades.length}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Cidades</p>
        </Card>
      </div>

      {/* Filtros */}
      <FilterBar
        busca={buscaLocal}
        setBusca={setBuscaLocal}
        cidades={cidades.map((c) => c.nome)}
        cidadesSelecionadas={cidadesSelecionadas}
        setCidades={setCidades}
        setores={setores.map((s) => s.nome)}
        setoresSelecionados={setoresSelecionados}
        setSetores={setSetores}
        onClear={limpar}
        temFiltrosAtivos={temFiltrosAtivos}
      />

      {/* Mapa + Lista */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Mapa — coloca na esquerda, ocupa 1.5 colunas */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <MapView
              companies={filtradas}
              height="h-[500px]"
              renderPopup={(company) => (
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{company.razaoSocial}</p>
                  <p className="text-xs text-gray-600">{company.setor}</p>
                  <p className="text-xs text-gray-600">{company.cidade}</p>
                  <div className="mt-2 flex gap-1">
                    <Badge label={company.porte} variant={badgePorte(company.porte)} size="sm" />
                    <Badge label={company.crescimentoCAGED} variant={badgeCrescimento(company.crescimentoCAGED)} size="sm" />
                  </div>
                </div>
              )}
            />
            <div className="border-t border-[var(--color-bg-tertiary)] p-3">
              <MapLegend setores={setoresSelecionados.length > 0 ? setoresSelecionados : setores.map((s) => s.nome)} />
            </div>
          </Card>
        </div>

        {/* Lista de Empresas — direita, ocupa 2 colunas */}
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {filtradas.length} empresa{filtradas.length !== 1 ? 's' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filtradas.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[var(--color-text-tertiary)]">Nenhuma empresa encontrada com os filtros atuais.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filtradas.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setEmpresaSelecionada(company)}
                    className="w-full rounded-md bg-[var(--color-bg-tertiary)] p-3 text-left transition-all hover:bg-[var(--color-primary)]/10 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text-primary)] truncate">{company.razaoSocial}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] truncate">{company.nomeFantasia}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge label={company.setor.substring(0, 15)} variant="info" size="sm" />
                          <Badge label={company.cidade} variant="neutral" size="sm" />
                          <Badge label={company.porte} variant={badgePorte(company.porte)} size="sm" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-[var(--color-accent)]" />
                          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {company.scoreConversao.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--color-text-tertiary)]">{company.cidade}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Drawer de detalhe */}
      <CompanyDrawer
        company={empresaSelecionada}
        isOpen={empresaSelecionada !== null}
        onClose={() => setEmpresaSelecionada(null)}
      />
    </div>
  )
}
