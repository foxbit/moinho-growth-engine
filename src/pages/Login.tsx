import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import logoIconWhite from '../assets/moinho-logo-icon-white.svg'

export function Login() {
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const entrar = () => {
    if (login(email, senha)) {
      const destino = (location.state as { from?: string } | null)?.from ?? '/dashboard'
      navigate(destino, { replace: true })
    } else {
      setErro('Email ou senha inválidos. Tente as credenciais de demonstração abaixo.')
    }
  }

  return (
    <div className="mx-auto max-w-md pt-10 sm:pt-20">
      <Card>
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]">
            <img src={logoIconWhite} alt="" className="h-5 w-auto" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Acesso Interno</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Dashboard de Inteligência Comercial do Moinho
            </p>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            entrar()
          }}
        >
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="voce@moinho.com.br" required />
          <Input label="Senha" type="password" value={senha} onChange={setSenha} placeholder="••••••••" required />
          {erro && <p className="text-sm text-[var(--color-critical-ink)]">{erro}</p>}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="mt-6 rounded-xl bg-[var(--color-bg-tertiary)] p-4 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          <p className="mb-1 font-semibold text-[var(--color-text-primary)]">Credenciais de demonstração:</p>
          <p>Vendedor: carlos@moinho.com.br · senha123</p>
          <p>Vendedora: marina@moinho.com.br · senha123</p>
          <p>Gerente: roberto@moinho.com.br · senha123</p>
        </div>
      </Card>
    </div>
  )
}
