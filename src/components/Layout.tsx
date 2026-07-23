import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-container flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-text-tertiary)]">
        Moinho — Growth Engine · Projeto acadêmico FIAP · Dados demonstrativos
      </footer>
    </div>
  )
}
