import { X } from 'lucide-react'
import { Input } from './Input'

interface FilterBarProps {
  busca: string
  setBusca: (value: string) => void
  cidades: string[]
  cidadesSelecionadas: string[]
  setCidades: (cidades: string[]) => void
  setores: string[]
  setoresSelecionados: string[]
  setSetores: (setores: string[]) => void
  onClear: () => void
  temFiltrosAtivos: boolean
}

export function FilterBar({
  busca,
  setBusca,
  cidades,
  cidadesSelecionadas,
  setCidades,
  setores,
  setoresSelecionados,
  setSetores,
  onClear,
  temFiltrosAtivos,
}: FilterBarProps) {
  const toggleCidade = (cidade: string) => {
    setCidades(
      cidadesSelecionadas.includes(cidade)
        ? cidadesSelecionadas.filter((c) => c !== cidade)
        : [...cidadesSelecionadas, cidade]
    )
  }

  const toggleSetor = (setor: string) => {
    setSetores(
      setoresSelecionados.includes(setor)
        ? setoresSelecionados.filter((s) => s !== setor)
        : [...setoresSelecionados, setor]
    )
  }

  return (
    <div className="space-y-4 rounded-lg bg-[var(--color-bg-secondary)] p-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar empresas por nome, CNPJ, bairro..."
            value={busca}
            onChange={setBusca}
          />
        </div>
        {temFiltrosAtivos && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-tertiary)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-primary)] hover:text-white"
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
            Limpar
          </button>
        )}
      </div>

      {/* Cidades */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Cidades</p>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setCidades([])}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              cidadesSelecionadas.length === 0
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-tertiary)]/20'
            }`}
          >
            Todas
          </button>
          {cidades.map((cidade) => (
            <button
              key={cidade}
              onClick={() => toggleCidade(cidade)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                cidadesSelecionadas.includes(cidade)
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-tertiary)]/20'
              }`}
            >
              {cidade}
            </button>
          ))}
        </div>
      </div>

      {/* Setores */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Setores</p>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSetores([])}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              setoresSelecionados.length === 0
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-tertiary)]/20'
            }`}
          >
            Todos
          </button>
          {setores.map((setor) => (
            <button
              key={setor}
              onClick={() => toggleSetor(setor)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                setoresSelecionados.includes(setor)
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-tertiary)]/20'
              }`}
            >
              {setor.substring(0, 20)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
