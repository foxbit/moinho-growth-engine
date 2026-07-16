import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatCnpj(cnpj: string): string {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function formatCep(cep: string): string {
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
