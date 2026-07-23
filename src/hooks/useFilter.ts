import { useMemo, useState } from 'react'
import type { Company } from '../types'

export interface Filters {
  cidade: string
  setores: string[]
  portes: string[]
  crescimento: string[]
  busca: string
}

export const FILTROS_INICIAIS: Filters = {
  cidade: '',
  setores: [],
  portes: [],
  crescimento: [],
  busca: '',
}

export function useFilter(companies: Company[]) {
  const [filters, setFilters] = useState<Filters>(FILTROS_INICIAIS)

  const filtered = useMemo(() => {
    const busca = filters.busca.trim().toLowerCase()
    return companies.filter((company) => {
      if (filters.cidade && company.cidade !== filters.cidade) return false
      if (filters.setores.length > 0 && !filters.setores.includes(company.setor)) return false
      if (filters.portes.length > 0 && !filters.portes.includes(company.porte)) return false
      if (filters.crescimento.length > 0 && !filters.crescimento.includes(company.crescimentoCAGED)) return false
      if (busca) {
        const alvo = `${company.razaoSocial} ${company.nomeFantasia} ${company.cnpj} ${company.bairro}`.toLowerCase()
        if (!alvo.includes(busca)) return false
      }
      return true
    })
  }, [companies, filters])

  const limpar = () => setFilters(FILTROS_INICIAIS)

  return { filters, setFilters, filtered, limpar }
}
