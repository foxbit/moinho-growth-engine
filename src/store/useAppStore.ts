import { create } from 'zustand'
import mockData from '../data/mock_data.json'
import type { Company, Event, Interaction, MockData, TipoInteracao } from '../types'

const data = mockData as unknown as MockData

interface AppState {
  companies: Company[]
  events: Event[]
  setores: MockData['setores']
  cidades: MockData['cidades']
  metricas: MockData['metricas']
  usuarios: MockData['usuarios']
  addInteraction: (companyId: string, tipo: TipoInteracao, descricao: string, usuario: string) => void
  inscreverEvento: (eventId: string) => void
}

let interactionSeq = 5000

export const useAppStore = create<AppState>((set) => ({
  companies: data.companies,
  events: data.events,
  setores: data.setores,
  cidades: data.cidades,
  metricas: data.metricas,
  usuarios: data.usuarios,

  addInteraction: (companyId, tipo, descricao, usuario) =>
    set((state) => {
      const nova: Interaction = {
        id: `INT${++interactionSeq}`,
        tipo,
        data: new Date().toISOString().slice(0, 19),
        descricao,
        usuario,
      }
      return {
        companies: state.companies.map((c) =>
          c.id === companyId ? { ...c, interacoes: [...c.interacoes, nova] } : c,
        ),
      }
    }),

  inscreverEvento: (eventId) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId && e.inscritos < e.vagas ? { ...e, inscritos: e.inscritos + 1 } : e,
      ),
    })),
}))
