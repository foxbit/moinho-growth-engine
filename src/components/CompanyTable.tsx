import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, CalendarPlus, Download, Eye } from 'lucide-react'
import type { Company } from '../types'
import { Badge, badgeCrescimento, badgePorte } from './Badge'
import { Button } from './Button'
import { setorCurto } from '../utils/colors'
import { exportarEmpresasCsv } from '../utils/csv'

const POR_PAGINA = 10

type ColunaOrdenavel = 'razaoSocial' | 'cidade' | 'setor' | 'porte' | 'crescimentoCAGED' | 'scoreConversao'

const COLUNAS: Array<{ key: ColunaOrdenavel; label: string; ocultaMobile?: boolean }> = [
  { key: 'razaoSocial', label: 'Razão Social' },
  { key: 'cidade', label: 'Cidade', ocultaMobile: true },
  { key: 'setor', label: 'Setor' },
  { key: 'porte', label: 'Porte', ocultaMobile: true },
  { key: 'crescimentoCAGED', label: 'Crescimento', ocultaMobile: true },
  { key: 'scoreConversao', label: 'Score' },
]

interface CompanyTableProps {
  companies: Company[]
  onVerDetalhes: (company: Company) => void
  onAgendar: (company: Company) => void
}

export function CompanyTable({ companies, onVerDetalhes, onAgendar }: CompanyTableProps) {
  const [ordem, setOrdem] = useState<{ coluna: ColunaOrdenavel; asc: boolean }>({
    coluna: 'scoreConversao',
    asc: false,
  })
  const [pagina, setPagina] = useState(1)
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set())

  const ordenadas = useMemo(() => {
    const lista = [...companies]
    lista.sort((a, b) => {
      const va = a[ordem.coluna]
      const vb = b[ordem.coluna]
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'pt-BR')
      return ordem.asc ? cmp : -cmp
    })
    return lista
  }, [companies, ordem])

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = ordenadas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  const ordenar = (coluna: ColunaOrdenavel) => {
    setOrdem((o) => (o.coluna === coluna ? { coluna, asc: !o.asc } : { coluna, asc: true }))
    setPagina(1)
  }

  const alternarSelecao = (id: string) => {
    setSelecionadas((s) => {
      const novo = new Set(s)
      if (novo.has(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }

  const todasVisiveisSelecionadas = visiveis.length > 0 && visiveis.every((c) => selecionadas.has(c.id))
  const alternarTodas = () => {
    setSelecionadas((s) => {
      const novo = new Set(s)
      if (todasVisiveisSelecionadas) visiveis.forEach((c) => novo.delete(c.id))
      else visiveis.forEach((c) => novo.add(c.id))
      return novo
    })
  }

  const exportar = () => {
    const alvo = selecionadas.size > 0 ? companies.filter((c) => selecionadas.has(c.id)) : ordenadas
    exportarEmpresasCsv(alvo)
  }

  const iconeOrdem = (coluna: ColunaOrdenavel) => {
    if (ordem.coluna !== coluna) return <ArrowUpDown className="h-3 w-3 opacity-40" />
    return ordem.asc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {companies.length} empresa{companies.length === 1 ? '' : 's'} encontrada{companies.length === 1 ? '' : 's'}
          {selecionadas.size > 0 && (
            <span className="ml-2 text-gray-500 dark:text-gray-400">· {selecionadas.size} selecionada(s)</span>
          )}
        </p>
        <Button variant="secondary" size="sm" onClick={exportar}>
          <Download className="h-4 w-4" />
          Exportar CSV {selecionadas.size > 0 ? `(${selecionadas.size})` : '(todas)'}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-[600px] bg-white text-sm dark:bg-[#111827]">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={todasVisiveisSelecionadas}
                  onChange={alternarTodas}
                  aria-label="Selecionar todas da página"
                  className="h-4 w-4 accent-[#0052CC]"
                />
              </th>
              {COLUNAS.map((col) => (
                <th key={col.key} className={`px-3 py-2.5 ${col.ocultaMobile ? 'hidden lg:table-cell' : ''}`}>
                  <button
                    className="inline-flex items-center gap-1 font-semibold hover:text-primary"
                    onClick={() => ordenar(col.key)}
                  >
                    {col.label} {iconeOrdem(col.key)}
                  </button>
                </th>
              ))}
              <th className="px-3 py-2.5 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {visiveis.map((company) => (
              <tr key={company.id} className="transition-colors hover:bg-blue-50/50 dark:hover:bg-gray-800/60">
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selecionadas.has(company.id)}
                    onChange={() => alternarSelecao(company.id)}
                    aria-label={`Selecionar ${company.razaoSocial}`}
                    className="h-4 w-4 accent-[#0052CC]"
                  />
                </td>
                <td className="max-w-[240px] px-3 py-2.5">
                  <button
                    onClick={() => onVerDetalhes(company)}
                    className="block truncate text-left font-medium text-primary hover:underline dark:text-blue-400"
                    title={company.razaoSocial}
                  >
                    {company.razaoSocial}
                  </button>
                </td>
                <td className="hidden px-3 py-2.5 lg:table-cell">{company.cidade}</td>
                <td className="px-3 py-2.5">{setorCurto(company.setor)}</td>
                <td className="hidden px-3 py-2.5 lg:table-cell">
                  <Badge label={company.porte} variant={badgePorte(company.porte)} />
                </td>
                <td className="hidden px-3 py-2.5 lg:table-cell">
                  <Badge label={company.crescimentoCAGED} variant={badgeCrescimento(company.crescimentoCAGED)} />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 font-semibold">{company.scoreConversao.toFixed(1)}</span>
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${company.scoreConversao * 10}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onVerDetalhes(company)}
                      title="Ver detalhes"
                      aria-label={`Ver detalhes de ${company.razaoSocial}`}
                      className="rounded p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onAgendar(company)}
                      title="Agendar demonstração"
                      aria-label={`Agendar demonstração com ${company.razaoSocial}`}
                      className="rounded p-1.5 text-gray-500 transition-colors hover:bg-green-50 hover:text-secondary dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visiveis.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-gray-400">
                  Nenhuma empresa encontrada com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={paginaAtual === 1} onClick={() => setPagina(paginaAtual - 1)}>
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPagina(paginaAtual + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
