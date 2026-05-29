import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material'

export default function Login() {
  const [state, setState] = useState('loading')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('logout') === '1') {
      setState('logout')
      return
    }
    const error = params.get('error')
    if (error) {
      setState('error')
      return
    }
    window.location.href = `/api/v1/auth/login?redirect_uri=${encodeURIComponent(window.location.origin)}`
  }, [])

  const handleLogin = () => {
    window.location.href = `/api/v1/auth/login?redirect_uri=${encodeURIComponent(window.location.origin)}`
  }

  if (state === 'logout') {
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
            gap: 3,
            bgcolor: 'rgba(255,255,255,0.9)',
            p: 5,
            borderRadius: 3,
            boxShadow: 3,
            maxWidth: 380,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Sesión cerrada
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14, textAlign: 'center' }}>
            Has cerrado sesión correctamente.
          </Typography>
          <Button variant="contained" size="large" onClick={handleLogin} sx={{ mt: 1 }}>
            Iniciar sesión
          </Button>
        </Box>
      </Box>
    )
  }

  if (state === 'error') {
    const params = new URLSearchParams(window.location.search)
    const errorMsg = params.get('error') || 'Error desconocido'
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
            gap: 3,
            bgcolor: 'rgba(255,255,255,0.9)',
            p: 5,
            borderRadius: 3,
            boxShadow: 3,
            maxWidth: 400,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
            Error de autenticación
          </Typography>
          <Alert severity="error" sx={{ width: '100%' }}>
            {errorMsg}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, textAlign: 'center' }}>
            Si el problema persiste, contacta al administrador del sistema.
          </Typography>
          <Button variant="contained" size="large" onClick={handleLogin} sx={{ mt: 1 }}>
            Intentar de nuevo
          </Button>
        </Box>
      </Box>
    )
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
          gap: 2,
          bgcolor: 'rgba(255,255,255,0.85)',
          p: 5,
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 380,
        }}
      >
        <CircularProgress size={36} />
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14 }}>
          Redirigiendo a Microsoft...
        </Typography>
      </Box>
    </Box>
  )
}