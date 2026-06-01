import React, { useState } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import { Button, Text, Surface, Avatar, ActivityIndicator } from 'react-native-paper'
import * as Linking from 'expo-linking'
import api, { setToken, removeToken, loadApiUrl } from './api'
import { useAuth } from './AuthContext'

export default function LoginScreen() {
  const { user, refreshUser, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const waitForRedirect = (expectedPrefix, timeoutMs = 120000) => {
    return new Promise((resolve, reject) => {
      let finished = false
      let subscription
      const timeoutId = setTimeout(() => {
        cleanup()
        reject(new Error('Tiempo de espera agotado esperando la redireccion.'))
      }, timeoutMs)

      const cleanup = () => {
        if (finished) return
        finished = true
        clearTimeout(timeoutId)
        if (subscription) {
          subscription.remove()
        }
      }

      subscription = Linking.addEventListener('url', ({ url }) => {
        if (!url || !url.startsWith(expectedPrefix)) return
        cleanup()
        resolve(url)
      })
    })
  }

  const openUrlAndWait = async (targetUrl, expectedPrefix) => {
    const redirectPromise = waitForRedirect(expectedPrefix)
    await Linking.openURL(targetUrl)
    return redirectPromise
  }

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const apiUrl = await loadApiUrl()
      const redirectUri = Linking.createURL('callback/')

      const { data } = await api.get('/auth/mobile-login-url', {
        params: { redirect_uri: redirectUri },
      })
      const loginUrl = data?.authUrl
      if (!loginUrl) {
        setError('No se pudo obtener la URL de Microsoft.')
        return
      }

      const loginResultUrl = await openUrlAndWait(loginUrl, redirectUri)
      const { queryParams } = Linking.parse(loginResultUrl)
      const code = queryParams?.code
      const authError = queryParams?.error

      if (authError) {
        setError(String(authError))
        return
      }

      if (!code) {
        setError('No se recibio codigo de autorizacion.')
        return
      }

      const exchangeUrl = `${apiUrl}/auth/exchange-redirect?code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`
      const tokenResultUrl = await openUrlAndWait(exchangeUrl, redirectUri)
      const { queryParams: params2 } = Linking.parse(tokenResultUrl)
      const token = params2?.token
      const tokenError = params2?.error

      if (tokenError) {
        setError(String(tokenError))
        return
      }

      if (!token) {
        setError('No se recibio token de autenticacion.')
        return
      }

      await setToken(String(token))
      await refreshUser()
    } catch (e) {
      setError(e.message || 'No se pudo conectar con Microsoft. Verifica la conexion y la URL del backend.')
    } finally {
      setLoading(false)
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
            Control de Equipos
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Sistema de Apilamiento
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
    marginBottom: 4,
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
