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
    { rotulo: 'Leads Qualificados', valor: metricas.leadsQualificados, cor: 'bg-[var(--color-primary-dark)]' },
    { rotulo: 'Demonstrações', valor: metricas.demonstracoesAgendadas, cor: 'bg-[var(--color-accent)]' },
    { rotulo: 'Visitas Presenciais', valor: metricas.visitasPresenciais, cor: 'bg-[var(--color-alert)]' },
    { rotulo: 'Contratos', valor: metricas.contratosAssinados, cor: 'bg-[var(--color-secondary)]' },
  ]
  const base = funil[0].valor

  const metaOcupacao = 85
  const diferenca = metricas.ocupacaoMoinho - metaOcupacao

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard de Métricas</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Funil de conversão e performance do time comercial do Moinho.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KPIS.map(({ chave, rotulo, variacao }) => (
          <Card key={chave} interactive>
            <p className="text-sm text-[var(--color-text-secondary)]">{rotulo}</p>
            <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums">{metricas[chave]}</p>
            <p
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                variacao >= 0
                  ? 'bg-[var(--color-success-bg)] text-[var(--color-success-ink)]'
                  : 'bg-[var(--color-critical-dark)]/10 text-[var(--color-critical-ink)]'
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
                  <span className="text-[var(--color-text-secondary)] tabular-nums">
                    {etapa.valor} · {pct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-5 w-full overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
                  <div
                    className={`h-full rounded-full ${etapa.cor} transition-[width] duration-500 ease-out`}
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
              <thead className="text-left text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                <tr>
                  <th className="py-2 font-semibold">Vendedor</th>
                  <th className="py-2 text-right font-semibold">Leads</th>
                  <th className="py-2 text-right font-semibold">Demos</th>
                  <th className="py-2 text-right font-semibold">Contratos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-light)]">
                {usuarios.map((u) => (
                  <tr key={u.id} className="transition-colors duration-150 hover:bg-[var(--color-bg-tertiary)]">
                    <td className="py-2.5">
                      {u.nome}
                      <span className="ml-1.5 text-xs text-[var(--color-text-tertiary)]">({u.role})</span>
                    </td>
                    <td className="py-2.5 text-right font-medium tabular-nums">{u.leadsAbordados}</td>
                    <td className="py-2.5 text-right font-medium tabular-nums">{u.demonstracoesAgendadas}</td>
                    <td className="py-2.5 text-right font-medium tabular-nums">{u.contratosAssinados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Ocupação do Moinho">
          <div className="flex items-center gap-6">
            <div
              className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full shadow-[var(--shadow-sm)]"
              style={{
                background: `conic-gradient(var(--color-secondary) ${metricas.ocupacaoMoinho * 3.6}deg, var(--color-bg-tertiary) 0deg)`,
              }}
              role="img"
              aria-label={`Ocupação atual de ${metricas.ocupacaoMoinho}%`}
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-2xl font-bold tracking-tight tabular-nums shadow-[var(--shadow-sm)]">
                {metricas.ocupacaoMoinho}%
              </div>
            </div>
            <div className="space-y-1 text-sm tabular-nums">
              <p>
                Meta: <strong>{metaOcupacao}%</strong>
              </p>
              <p className={diferenca >= 0 ? 'text-[var(--color-secondary)]' : 'text-[var(--color-critical-ink)]'}>
                Diferença: <strong>{diferenca}%</strong>
              </p>
              <p className="text-[var(--color-text-secondary)]">
                A esteira de eventos e bootcamps alimenta a ocupação do coworking.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-[var(--color-text-secondary)]">Receita Projetada</dt>
            <dd className="text-xl font-bold tracking-tight tabular-nums">{formatCurrency(metricas.receita)}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-secondary)]">Ciclo de Vendas Médio</dt>
            <dd className="text-xl font-bold tracking-tight tabular-nums">{metricas.cicloVendasMedio} dias</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-secondary)]">Conversão Outbound</dt>
            <dd className="text-xl font-bold tracking-tight tabular-nums">{metricas.taxaConversaoOutbound}%</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-secondary)]">Conversão Eventos</dt>
            <dd className="text-xl font-bold tracking-tight tabular-nums">{metricas.taxaConversaoEventos}%</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
