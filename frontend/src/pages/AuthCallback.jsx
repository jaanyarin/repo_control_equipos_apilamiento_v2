import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Typography, CircularProgress } from '@mui/material'
import { useApp } from '../store'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { refreshUser } = useApp()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (window.opener) {
      if (token) {
        localStorage.setItem('accessToken', token)
      }
      window.close()
      return
    }

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true })
      return
    }

    if (token) {
      localStorage.setItem('accessToken', token)
      refreshUser()
      navigate('/dashboard', { replace: true })
      return
    }

    navigate('/login', { replace: true })
  }, [navigate, searchParams, refreshUser])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <CircularProgress />
      <Typography color="text.secondary">Procesando autenticación...</Typography>
    </Box>
  )
}
