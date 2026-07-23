import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Moon, Sun, Wind, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'

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
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary-ink)] hover:bg-[var(--color-bg-tertiary)]'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)]/95 backdrop-blur supports-[backdrop-filter]:bg-opacity-80">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary)]">
          <Wind className="h-6 w-6" />
          MOINHO
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
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
            className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors duration-200 hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated && user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {user.nome.split(' ')[0]}{' '}
                <span className="text-xs text-[var(--color-text-tertiary)]">({user.role})</span>
              </span>
              <button
                onClick={sair}
                aria-label="Sair"
                className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-critical-ink)]"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/"
              className="hidden rounded-full bg-[var(--color-primary-dark)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-darker)] md:block"
            >
              Entrar
            </Link>
          )}

          <button
            className="rounded-lg p-2 text-[var(--color-text-secondary)] md:hidden"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir menu"
          >
            {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav className="border-t border-[var(--color-border)] px-4 py-2 md:hidden" aria-label="Menu móvel">
          {linksInternos.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
              onClick={() => setMenuAberto(false)}
            >
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              onClick={sair}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--color-critical-ink)] hover:bg-[var(--color-bg-tertiary)]"
            >
              Sair ({user?.nome.split(' ')[0]})
            </button>
          ) : (
            <NavLink
              to="/"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-primary-ink)]"
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
