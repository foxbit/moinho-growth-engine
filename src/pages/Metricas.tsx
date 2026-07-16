import { TrendingDown, TrendingUp } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/Card'
import { formatCurrency } from '../utils/format'

/** Variações vs. mês anterior (mockadas, conforme PRD) */
const KPIS = [
  { chave: 'leadsQualificados', rotulo: 'Leads Qualificados', variacao: 12 },
  { chave: 'demonstracoesAgendadas', rotulo: 'Demonstrações', variacao: 8 },
  { chave: 'visitasPresenciais', rotulo: 'Visitas Presenciais', variacao: -5 },
  { chave: 'contratosAssinados', rotulo: 'Contratos', variacao: 33 },
] as const

export function Metricas() {
  const { metricas, usuarios } = useAppStore()

  const funil = [
    { rotulo: 'Leads Qualificados', valor: metricas.leadsQualificados, cor: 'bg-primary' },
    { rotulo: 'Demonstrações', valor: metricas.demonstracoesAgendadas, cor: 'bg-blue-400' },
    { rotulo: 'Visitas Presenciais', valor: metricas.visitasPresenciais, cor: 'bg-alert' },
    { rotulo: 'Contratos', valor: metricas.contratosAssinados, cor: 'bg-secondary' },
  ]
  const base = funil[0].valor

  const metaOcupacao = 85
  const diferenca = metricas.ocupacaoMoinho - metaOcupacao

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard de Métricas</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Funil de conversão e performance do time comercial do Moinho.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KPIS.map(({ chave, rotulo, variacao }) => (
          <Card key={chave}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{rotulo}</p>
            <p className="mt-1 text-3xl font-bold">{metricas[chave]}</p>
            <p
              className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                variacao >= 0 ? 'text-secondary' : 'text-critical'
              }`}
            >
              {variacao >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {variacao >= 0 ? '+' : ''}
              {variacao}% vs mês anterior
            </p>
          </Card>
        ))}
      </div>

      <Card title="Funil de Conversão" subtitle="Da qualificação do lead até o contrato assinado">
        <div className="space-y-3">
          {funil.map((etapa) => {
            const pct = (etapa.valor / base) * 100
            return (
              <div key={etapa.rotulo}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="font-medium">{etapa.rotulo}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {etapa.valor} · {pct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-5 w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded ${etapa.cor} transition-all duration-500`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Performance por Vendedor">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-2 font-semibold">Vendedor</th>
                  <th className="py-2 text-right font-semibold">Leads</th>
                  <th className="py-2 text-right font-semibold">Demos</th>
                  <th className="py-2 text-right font-semibold">Contratos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2.5">
                      {u.nome}
                      <span className="ml-1.5 text-xs text-gray-400">({u.role})</span>
                    </td>
                    <td className="py-2.5 text-right font-medium">{u.leadsAbordados}</td>
                    <td className="py-2.5 text-right font-medium">{u.demonstracoesAgendadas}</td>
                    <td className="py-2.5 text-right font-medium">{u.contratosAssinados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Ocupação do Moinho">
          <div className="flex items-center gap-6">
            <div
              className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#0052CC ${metricas.ocupacaoMoinho * 3.6}deg, #E5E7EB 0deg)`,
              }}
              role="img"
              aria-label={`Ocupação atual de ${metricas.ocupacaoMoinho}%`}
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-2xl font-bold dark:bg-[#111827]">
                {metricas.ocupacaoMoinho}%
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                Meta: <strong>{metaOcupacao}%</strong>
              </p>
              <p className={diferenca >= 0 ? 'text-secondary' : 'text-critical'}>
                Diferença: <strong>{diferenca}%</strong>
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                A esteira de eventos e bootcamps alimenta a ocupação do coworking.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Receita Projetada</dt>
            <dd className="text-xl font-bold">{formatCurrency(metricas.receita)}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Ciclo de Vendas Médio</dt>
            <dd className="text-xl font-bold">{metricas.cicloVendasMedio} dias</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Conversão Outbound</dt>
            <dd className="text-xl font-bold">{metricas.taxaConversaoOutbound}%</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Conversão Eventos</dt>
            <dd className="text-xl font-bold">{metricas.taxaConversaoEventos}%</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
