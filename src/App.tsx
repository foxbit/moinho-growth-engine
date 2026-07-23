import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Metricas } from './pages/Metricas'

// Páginas com mapa (Leaflet) carregam sob demanda
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))

function Carregando() {
  return (
    <div className="flex justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['VENDEDOR', 'GERENTE', 'ADMIN']}>
                <Suspense fallback={<Carregando />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/metricas"
            element={
              <ProtectedRoute roles={['GERENTE', 'ADMIN']}>
                <Metricas />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="py-16 text-center">
                <h1 className="text-2xl font-bold">Página não encontrada</h1>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
