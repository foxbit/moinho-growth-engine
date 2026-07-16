import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface ProtectedRouteProps {
  roles: Array<'VENDEDOR' | 'GERENTE' | 'ADMIN'>
  children: ReactNode
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  if (!roles.includes(user.role)) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Acesso restrito</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Seu perfil ({user.role}) não tem permissão para acessar esta página.
        </p>
      </div>
    )
  }
  return <>{children}</>
}
