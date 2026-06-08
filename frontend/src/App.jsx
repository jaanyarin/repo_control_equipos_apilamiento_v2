import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useApp } from './store'
import api from './api'
import Layout from './components/Layout'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Roles from './pages/Roles'
import Sedes from './pages/Sedes'
import Campanas from './pages/Campanas'
import TiposEquipo from './pages/TiposEquipo'
import Proveedores from './pages/Proveedores'
import Marcas from './pages/Marcas'
import Equipos from './pages/Equipos'
import Averias from './pages/Averias'
import ThemePreview from './pages/ThemePreview'

function PrivateRoute({ children }) {
  const { user, logout } = useApp()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    if (!user) {
      setVerifying(false)
      return
    }
    let cancelled = false
    api.get('/auth/me').then((res) => {
      if (cancelled) return
      if (!res.data?.estadoActivo) {
        logout()
      }
    }).catch(() => {
      if (cancelled) return
      logout()
    }).finally(() => {
      if (!cancelled) setVerifying(false)
    })
    return () => { cancelled = true }
  }, [user, logout])

  if (!user) return <Navigate to="/login" replace />
  if (verifying) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  )
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
        <Route path="tipos-equipo" element={<TiposEquipo />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="marcas" element={<Marcas />} />
        <Route path="equipos" element={<Equipos />} />
        <Route path="averias" element={<Averias />} />
        <Route path="theme-preview" element={<ThemePreview />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
