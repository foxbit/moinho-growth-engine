export type Porte = 'MICRO' | 'PEQUENA' | 'MÉDIA' | 'GRANDE'
export type Crescimento = 'ALTO' | 'MÉDIO' | 'BAIXO'
export type TipoInteracao =
  | 'EMAIL_ENVIADO'
  | 'DEMONSTRAÇÃO_AGENDADA'
  | 'VISITA_PRESENCIAL'
  | 'NOTA_INTERNA'
  | 'CONTRATO_ASSINADO'

export interface Interaction {
  id: string
  tipo: TipoInteracao
  data: string
  descricao: string
  usuario: string
}

export interface Company {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  cep: string
  latitude: number
  longitude: number
  cnae: string
  setor: string
  porte: Porte
  dataAbertura: string
  situacao: 'ATIVA' | 'INATIVA'
  emails: string[]
  telefones: string[]
  crescimentoCAGED: Crescimento
  scoreConversao: number
  interacoes: Interaction[]
}

export interface Event {
  id: string
  titulo: string
  descricao: string
  data: string
  horario: string
  local: string
  vagas: number
  inscritos: number
  categoria: 'BOOTCAMP' | 'WORKSHOP' | 'NETWORKING'
}

export interface Setor {
  id: string
  nome: string
  empresas: number
  cor: string
}

export interface Cidade {
  id: string
  nome: string
  empresas: number
  lat: number
  lng: number
}

export interface Usuario {
  id: string
  nome: string
  email: string
  role: 'VENDEDOR' | 'GERENTE' | 'ADMIN'
  departamento: string
  leadsAbordados: number
  demonstracoesAgendadas: number
  contratosAssinados: number
}

export interface Metricas {
  leadsQualificados: number
  demonstracoesAgendadas: number
  visitasPresenciais: number
  contratosAssinados: number
  taxaConversaoOutbound: number
  taxaConversaoEventos: number
  cicloVendasMedio: number
  ocupacaoMoinho: number
  receita: number
}

export interface MockData {
  companies: Company[]
  events: Event[]
  setores: Setor[]
  cidades: Cidade[]
  metricas: Metricas
  usuarios: Usuario[]
}
