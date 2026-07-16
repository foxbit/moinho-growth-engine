import type { Crescimento, Porte } from '../types'

export const CORES_SETOR: Record<string, string> = {
  'Informação e Comunicação': '#3B82F6',
  'Atividades Profissionais, Científicas e Técnicas': '#10B981',
  'Educação': '#F59E0B',
  'Atividades Financeiras, de Seguros e Serviços Relacionados': '#EF4444',
  'Atividades Administrativas e Serviços Complementares': '#8B5CF6',
}

export const CORES_PORTE: Record<Porte, string> = {
  MICRO: '#3B82F6',
  PEQUENA: '#10B981',
  'MÉDIA': '#F59E0B',
  GRANDE: '#EF4444',
}

export const CORES_CRESCIMENTO: Record<Crescimento, string> = {
  ALTO: '#10B981',
  'MÉDIO': '#F59E0B',
  BAIXO: '#EF4444',
}

export function corDoSetor(setor: string): string {
  return CORES_SETOR[setor] ?? '#6B7280'
}

/** Nome curto do setor para legendas e badges */
export function setorCurto(setor: string): string {
  const curtos: Record<string, string> = {
    'Informação e Comunicação': 'TI & Comunicação',
    'Atividades Profissionais, Científicas e Técnicas': 'Ativ. Profissionais',
    'Educação': 'Educação',
    'Atividades Financeiras, de Seguros e Serviços Relacionados': 'Financeiras',
    'Atividades Administrativas e Serviços Complementares': 'Administrativas',
  }
  return curtos[setor] ?? setor
}
