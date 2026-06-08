import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  TextField, Button, CircularProgress, Alert,
} from '@mui/material'
import api from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [selectedRolId, setSelectedRolId] = useState('')
  const [selectedUsuarioId, setSelectedUsuarioId] = useState('')
  const [password, setPassword] = useState('12345')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('roles')

  useEffect(() => {
    api.get('/auth/roles')
      .then(r => setRoles(r.data))
      .catch(e => setError('Error al cargar roles'))
  }, [])

  useEffect(() => {
    if (selectedRolId) {
      setStep('usuarios')
      setSelectedUsuarioId('')
      api.get(`/auth/usuarios-by-rol/${selectedRolId}`)
        .then(r => setUsuarios(r.data))
        .catch(e => setError('Error al cargar usuarios'))
    }
  }, [selectedRolId])

  useEffect(() => {
    if (selectedUsuarioId) setStep('password')
  }, [selectedUsuarioId])

  const handleLogin = async () => {
    if (!selectedUsuarioId || !password) return
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/local-login', {
        usuarioId: selectedUsuarioId,
        password,
      })
      localStorage.setItem('accessToken', data.token)
      if (data.passwordResetRequired) {
        navigate('/cambiar-contrasena', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedRolId('')
    setSelectedUsuarioId('')
    setPassword('12345')
    setError('')
    setStep('roles')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/fondo_login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.5,
          bgcolor: 'rgba(255,255,255,0.9)',
          p: 5,
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Control de Equipos de Apilamiento
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

        <FormControl fullWidth>
          <InputLabel>Perfil</InputLabel>
          <Select
            value={selectedRolId}
            label="Perfil"
            onChange={e => { setSelectedRolId(e.target.value); setStep('usuarios') }}
          >
            {roles.map(r => (
              <MenuItem key={r.id} value={r.id}>{r.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {step !== 'roles' && (
          <FormControl fullWidth>
            <InputLabel>Usuario</InputLabel>
            <Select
              value={selectedUsuarioId}
              label="Usuario"
              onChange={e => { setSelectedUsuarioId(e.target.value); setStep('password') }}
            >
              {usuarios.map(u => (
                <MenuItem key={u.id} value={u.id}>
                  {u.nombre} {u.area ? `(${u.area})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {step === 'password' && (
          <>
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
            </Button>
            <Button variant="text" size="small" onClick={handleReset}>
              Cambiar usuario
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}
