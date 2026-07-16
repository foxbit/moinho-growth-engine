import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  nome: string
  email: string
  role: 'VENDEDOR' | 'GERENTE' | 'ADMIN'
}

/** Credenciais simuladas (frontend only, para fins acadêmicos) */
const CREDENCIAIS: Array<{ email: string; senha: string; user: AuthUser }> = [
  {
    email: 'carlos@moinho.com.br',
    senha: 'senha123',
    user: { id: 'USR001', nome: 'Carlos Silva', email: 'carlos@moinho.com.br', role: 'VENDEDOR' },
  },
  {
    email: 'marina@moinho.com.br',
    senha: 'senha123',
    user: { id: 'USR002', nome: 'Marina Costa', email: 'marina@moinho.com.br', role: 'VENDEDOR' },
  },
  {
    email: 'roberto@moinho.com.br',
    senha: 'senha123',
    user: { id: 'USR003', nome: 'Roberto Oliveira', email: 'roberto@moinho.com.br', role: 'GERENTE' },
  },
]

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, senha: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, senha) => {
        const cred = CREDENCIAIS.find((c) => c.email === email.toLowerCase().trim() && c.senha === senha)
        if (!cred) return false
        set({ user: cred.user, isAuthenticated: true })
        return true
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'moinho-auth' },
  ),
)
