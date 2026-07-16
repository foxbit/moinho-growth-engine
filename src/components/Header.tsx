import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Moon, Sun, Wind, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'

const LINKS_PUBLICOS = [
  { to: '/', label: 'Início' },
  { to: '/empresas', label: 'Empresas' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/eventos', label: 'Eventos' },
]

const LINKS_INTERNOS = [
  { to: '/dashboard', label: 'Dashboard', roles: ['VENDEDOR', 'GERENTE', 'ADMIN'] },
  { to: '/metricas', label: 'Métricas', roles: ['GERENTE', 'ADMIN'] },
]

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  const linksInternos = LINKS_INTERNOS.filter((l) => user && l.roles.includes(user.role))

  const sair = () => {
    logout()
    setMenuAberto(false)
    navigate('/')
  }

  const linkClasse = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-tertiary)]'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 backdrop-blur supports-[backdrop-filter]:bg-opacity-80">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary)]">
          <Wind className="h-6 w-6" />
          MOINHO
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {LINKS_PUBLICOS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClasse} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
          {linksInternos.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClasse}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-all duration-200 hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated && user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.nome.split(' ')[0]} <span className="text-xs text-gray-400">({user.role})</span>
              </span>
              <button
                onClick={sair}
                aria-label="Sair"
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-critical dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 md:block"
            >
              Entrar
            </Link>
          )}

          <button
            className="rounded-lg p-2 text-gray-600 md:hidden dark:text-gray-300"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir menu"
          >
            {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav className="border-t border-gray-200 px-4 py-2 md:hidden dark:border-gray-700" aria-label="Menu móvel">
          {[...LINKS_PUBLICOS, ...linksInternos].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setMenuAberto(false)}
            >
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              onClick={sair}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-critical hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Sair ({user?.nome.split(' ')[0]})
            </button>
          ) : (
            <NavLink
              to="/login"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-primary dark:text-blue-400"
              onClick={() => setMenuAberto(false)}
            >
              Entrar
            </NavLink>
          )}
        </nav>
      )}
    </header>
  )
}
