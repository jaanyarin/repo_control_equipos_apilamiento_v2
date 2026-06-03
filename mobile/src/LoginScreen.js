import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import { Button, Text, Surface, Avatar, ActivityIndicator } from 'react-native-paper'
import { buildCodeAsync } from 'expo-auth-session/build/PKCE'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import api, { setToken, removeToken } from './api'
import { useAuth } from './AuthContext'

function resolveRedirectUri() {
  return 'com.apilamiento://callback/'
}

export default function LoginScreen() {
  const { user, refreshUser, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const loginInProgress = useRef(false)
  const redirectHandled = useRef(false)
  const pkceRef = useRef(null)
  const redirectUri = resolveRedirectUri()

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url && !redirectHandled.current) {
        redirectHandled.current = true
        handleRedirectUrl(url)
      }
    })

    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (!url || redirectHandled.current) return
      redirectHandled.current = true
      handleRedirectUrl(url)
    })
    return () => subscription.remove()
  }, [])

  const handleRedirectUrl = async (url) => {
    try {
      const { queryParams } = Linking.parse(url)
      const token = queryParams?.token
      const code = queryParams?.code
      const authError = queryParams?.error

      if (authError) {
        setError(String(authError))
        return
      }

      if (token) {
        await setToken(String(token))
        await refreshUser()
        return
      }

      if (!code) {
        setError('No se recibio codigo de autorizacion.')
        return
      }

      const codeVerifier = pkceRef.current?.codeVerifier
      if (!codeVerifier) {
        setError('No se pudo validar la sesion de autenticacion.')
        return
      }

      const { data: tokenData } = await api.post('/auth/mobile-token', {
        code,
        redirectUri,
        codeVerifier,
      })

      if (tokenData?.error) {
        setError(String(tokenData.error))
        return
      }

      if (!tokenData?.token) {
        setError('No se recibio token de autenticacion.')
        return
      }

      await setToken(String(tokenData.token))
      await refreshUser()
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al procesar la autenticacion.')
    } finally {
      setLoading(false)
      loginInProgress.current = false
    }
  }

  const handleLogin = async () => {
    if (loginInProgress.current) return
    loginInProgress.current = true
    redirectHandled.current = false
    setLoading(true)
    setError('')

    try {
      pkceRef.current = await buildCodeAsync()
      const { data } = await api.get('/auth/mobile-login-url', {
        params: {
          redirect_uri: redirectUri,
          code_challenge: pkceRef.current.codeChallenge,
          code_challenge_method: 'S256',
        },
      })
      const loginUrl = data?.authUrl
      if (!loginUrl) {
        setError('No se pudo obtener la URL de Microsoft.')
        return
      }

      const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri)
      if (result.type === 'success') {
        if (result.url) {
          await handleRedirectUrl(result.url)
        } else {
          setError('No se recibio URL de redireccion.')
        }
      } else if (result.type === 'cancel') {
        setError('Autenticacion cancelada.')
      } else {
        setError('Error en la autenticacion.')
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'No se pudo conectar con Microsoft.')
    } finally {
      setLoading(false)
      loginInProgress.current = false
    }
  }

  const handleLogout = async () => {
    await removeToken()
    await logout()
  }

  if (user) {
    return (
      <ImageBackground
        source={require('../assets/fondo_login.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Surface style={styles.card}>
            <Avatar.Icon size={64} icon="check-circle" color="#fff" style={styles.successIcon} />
            <Text variant="titleLarge" style={styles.successTitle}>
              Ingresaste de forma correcta
            </Text>
            <Text variant="bodyLarge" style={styles.userName}>
              {user.nombre}
            </Text>
            <Text variant="bodySmall" style={styles.userEmail}>
              {user.correo}
            </Text>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              textColor="#d32f2f"
            >
              Cerrar sesion
            </Button>
          </Surface>
        </View>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground
      source={require('../assets/fondo_login.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Surface style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>
            Control de Equipos de Apilamiento Packing
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Aplicativo Android
          </Text>

          {error ? (
            <Text variant="bodySmall" style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={{ height: 48 }}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : 'Iniciar sesion con Microsoft'}
          </Button>
        </Surface>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    opacity: 0.6,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    borderRadius: 8,
  },
  errorText: {
    width: '100%',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  successIcon: {
    backgroundColor: '#2e7d32',
    marginBottom: 16,
  },
  successTitle: {
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 8,
  },
  userName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.6,
    marginBottom: 24,
  },
  logoutButton: {
    width: '100%',
    borderRadius: 8,
    borderColor: '#d32f2f',
  },
})
