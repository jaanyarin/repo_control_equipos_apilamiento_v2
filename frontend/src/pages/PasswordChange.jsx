import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
} from '@mui/material'
import api, { parseToken } from '../api'

export default function PasswordChange() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const user = parseToken()

  useEffect(() => {
    if (!user || !user.sub) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/change-password', {
        usuarioId: user.sub,
        newPassword,
      })
      localStorage.setItem('accessToken', data.token)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } catch (e) {
      setError(e.response?.data?.error || 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
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
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Cambiar contraseña
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          Bienvenido, {user?.nombre}. Debe cambiar su contraseña predeterminada.
        </Typography>

        <Alert severity="info" sx={{ width: '100%' }}>
          Use su número de DNI como nueva contraseña.
        </Alert>

        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%' }}>Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...</Alert>}

        <TextField
          fullWidth
          label="Nueva contraseña"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          disabled={success}
        />
        <TextField
          fullWidth
          label="Confirmar contraseña"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={success}
        />
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleChangePassword}
          disabled={loading || success}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Cambiar contraseña'}
        </Button>
      </Box>
    </Box>
  )
}
