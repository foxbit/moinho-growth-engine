import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Wind } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'

export function Login() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

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
        <div className="mb-6 text-center">
          <Wind className="mx-auto h-10 w-10 text-primary dark:text-blue-400" />
          <h1 className="mt-2 text-2xl font-bold">Acesso Interno</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dashboard de Inteligência Comercial do Moinho
          </p>
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
          {erro && <p className="text-sm text-critical">{erro}</p>}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <p className="mb-1 font-semibold">Credenciais de demonstração:</p>
          <p>Vendedor: carlos@moinho.com.br · senha123</p>
          <p>Vendedora: marina@moinho.com.br · senha123</p>
          <p>Gerente: roberto@moinho.com.br · senha123</p>
        </div>
      </Card>
    </div>
  )
}
