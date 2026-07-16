import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Building2, MapPin } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useDebounce } from '../hooks/useDebounce'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { CheckboxGroup } from '../components/CheckboxGroup'
import { Select } from '../components/Select'
import { corDoSetor, setorCurto } from '../utils/colors'

const POR_PAGINA = 12

export function Empresas() {
  const { companies, cidades, setores } = useAppStore()
  const [params, setParams] = useSearchParams()
  const [busca, setBusca] = useState(params.get('q') ?? '')
  const [cidade, setCidade] = useState('')
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>([])
  const [pagina, setPagina] = useState(1)
  const buscaDebounced = useDebounce(busca, 300)

  const filtradas = useMemo(() => {
    const q = buscaDebounced.trim().toLowerCase()
    return companies.filter((c) => {
      if (cidade && c.cidade !== cidade) return false
      if (setoresSelecionados.length > 0 && !setoresSelecionados.includes(c.setor)) return false
      if (q && !`${c.razaoSocial} ${c.nomeFantasia} ${c.bairro} ${c.setor}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [companies, cidade, setoresSelecionados, buscaDebounced])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = filtradas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Empresas do Ecossistema</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Conheça as {companies.length} empresas mapeadas na região de Juiz de Fora.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#111827]">
          <input
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setPagina(1)
              if (params.get('q')) setParams({}, { replace: true })
            }}
            placeholder="Buscar por nome ou bairro..."
            aria-label="Buscar empresas"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800"
          />
          <Select
            label="Cidade"
            placeholder="Todas as cidades"
            value={cidade}
            onChange={(v) => {
              setCidade(v)
              setPagina(1)
            }}
            options={cidades.map((c) => ({ label: c.nome, value: c.nome }))}
          />
          <CheckboxGroup
            label="Setor"
            options={setores.map((s) => ({ label: setorCurto(s.nome), value: s.nome }))}
            selected={setoresSelecionados}
            onChange={(sel) => {
              setSetoresSelecionados(sel)
              setPagina(1)
            }}
          />
        </aside>

        <div>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{filtradas.length} empresa(s) encontrada(s)</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visiveis.map((company) => (
              <div
                key={company.id}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-[#111827]"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${corDoSetor(company.setor)}20` }}
                >
                  <Building2 className="h-5 w-5" style={{ color: corDoSetor(company.setor) }} />
                </div>
                <h3 className="mt-3 line-clamp-2 font-semibold leading-snug" title={company.razaoSocial}>
                  {company.razaoSocial}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge label={setorCurto(company.setor)} variant="info" />
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5" /> {company.bairro}, {company.cidade}
                </p>
                <div className="mt-auto pt-4">
                  <Link to={`/empresas/${company.id}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Ver Perfil
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {visiveis.length === 0 && (
            <p className="py-12 text-center text-gray-400">Nenhuma empresa encontrada com os filtros atuais.</p>
          )}

          {totalPaginas > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm">
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
      </div>
    </div>
  )
}
