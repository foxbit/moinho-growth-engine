import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Empresas } from './pages/Empresas'
import { Eventos } from './pages/Eventos'
import { Login } from './pages/Login'
import { Metricas } from './pages/Metricas'

// Páginas com mapa (Leaflet) carregam sob demanda
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const MapaPublico = lazy(() => import('./pages/MapaPublico').then((m) => ({ default: m.MapaPublico })))
const EmpresaDetalhes = lazy(() => import('./pages/EmpresaDetalhes').then((m) => ({ default: m.EmpresaDetalhes })))

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
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route
            path="/empresas/:id"
            element={
              <Suspense fallback={<Carregando />}>
                <EmpresaDetalhes />
              </Suspense>
            }
          />
          <Route
            path="/mapa"
            element={
              <Suspense fallback={<Carregando />}>
                <MapaPublico />
              </Suspense>
            }
          />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/login" element={<Login />} />
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
