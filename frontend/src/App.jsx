import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './store'
import Layout from './components/Layout'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Roles from './pages/Roles'
import Sedes from './pages/Sedes'
import Campanas from './pages/Campanas'
import ThemePreview from './pages/ThemePreview'

function PrivateRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { user } = useApp()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="roles" element={<Roles />} />
        <Route path="sedes" element={<Sedes />} />
        <Route path="campanas" element={<Campanas />} />
        <Route path="theme-preview" element={<ThemePreview />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
