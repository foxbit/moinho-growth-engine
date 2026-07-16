import type { Company } from '../types'
import { formatCnpj } from './format'

/** Gera e baixa um CSV com as empresas selecionadas */
export function exportarEmpresasCsv(companies: Company[], nomeArquivo = 'empresas-moinho.csv') {
  const cabecalho = [
    'CNPJ',
    'Razão Social',
    'Nome Fantasia',
    'Cidade',
    'Bairro',
    'Setor',
    'Porte',
    'Crescimento CAGED',
    'Score de Conversão',
    'Emails',
    'Telefones',
  ]
  const escapar = (v: string) => `"${v.replace(/"/g, '""')}"`
  const linhas = companies.map((c) =>
    [
      formatCnpj(c.cnpj),
      c.razaoSocial,
      c.nomeFantasia,
      c.cidade,
      c.bairro,
      c.setor,
      c.porte,
      c.crescimentoCAGED,
      String(c.scoreConversao),
      c.emails.join('; '),
      c.telefones.join('; '),
    ]
      .map(escapar)
      .join(','),
  )
  const csv = '﻿' + [cabecalho.map(escapar).join(','), ...linhas].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nomeArquivo
  a.click()
  URL.revokeObjectURL(url)
}
