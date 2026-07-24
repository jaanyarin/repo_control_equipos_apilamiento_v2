import React, { useState, useEffect } from 'react'
import { View, ScrollView, StyleSheet, ImageBackground, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, Divider } from 'react-native-paper'
import api, { setToken, loadApiUrl, setApiUrl, BUILT_IN_API_URL } from './api'
import { useAuth } from './AuthContext'
import AppButton from './components/AppButton'
import AppCard from './components/AppCard'
import AppInput from './components/AppInput'
import AppSelect from './components/AppSelect'
import { theme } from './theme'

export default function LoginScreen() {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const { refreshUser } = useAuth()
  const [roles, setRoles] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [selectedRolId, setSelectedRolId] = useState(null)
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showServerConfig, setShowServerConfig] = useState(false)
  const [apiUrl, setApiUrlState] = useState(BUILT_IN_API_URL)
  const [savingApiUrl, setSavingApiUrl] = useState(false)
  const [step, setStep] = useState('roles')

  useEffect(() => {
    loadApiUrl().then(url => setApiUrlState(url || BUILT_IN_API_URL))
    api.get('/auth/roles')
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : (r.data?.data || [])
        setRoles(data)
      })
      .catch(e => {
        setError('Error al cargar roles: ' + (e.message || 'red'))
      })
  }, [])

  useEffect(() => {
    if (selectedRolId) {
      setStep('usuarios')
      setSelectedUsuarioId(null)
      api.get(`/auth/usuarios-by-rol/${selectedRolId}`)
        .then(r => {
          const data = Array.isArray(r.data) ? r.data : (r.data?.data || [])
          setUsuarios(data)
        })
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
      await setToken(data.token)
      await refreshUser(data.token)
    } catch (e) {
      setError(e.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveApiUrl = async () => {
    if (!apiUrl.trim()) {
      setError('La URL de la API es obligatoria')
      return
    }
    setSavingApiUrl(true)
    setError('')
    try {
      await setApiUrl(apiUrl.trim())
      const { data } = await api.get('/auth/roles')
      setRoles(Array.isArray(data) ? data : (data?.data || []))
      setSelectedRolId(null)
      setSelectedUsuarioId(null)
      setUsuarios([])
      setStep('roles')
    } catch (e) {
      setError(e.message || 'Error al guardar servidor')
    } finally {
      setSavingApiUrl(false)
    }
  }

  const handleResetApiUrl = () => {
    setApiUrlState(BUILT_IN_API_URL)
  }

  return (
    <ImageBackground
      source={require('../assets/fondo_login.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.overlay,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <AppCard style={[styles.card, { width: Math.min(width - theme.spacing[12], 420) }]}>
          <Text variant="headlineSmall" style={styles.title}>
            Control de Equipos de Apilamiento Packing
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Aplicativo Android
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <AppSelect
            label="Perfil"
            placeholder="Seleccionar perfil"
            value={selectedRolId}
            options={(roles || []).map(role => ({ value: role.id, label: role.nombre }))}
            onChange={setSelectedRolId}
          />

          {step !== 'roles' && (
            <AppSelect
              label="Usuario"
              placeholder="Seleccionar usuario"
              value={selectedUsuarioId}
              options={(usuarios || []).map(usuario => ({ value: usuario.id, label: `${usuario.nombre}${usuario.area ? ` (${usuario.area})` : ''}` }))}
              onChange={setSelectedUsuarioId}
            />
          )}

          {step === 'password' && (
            <>
            <AppInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <AppButton
              onPress={handleLogin}
              style={styles.button}
              loading={loading}
            >
              Iniciar sesión
            </AppButton>
            <AppButton
              tone="text"
              onPress={() => { setSelectedRolId(null); setStep('roles') }}
              style={styles.resetButton}
            >
              Cambiar usuario
            </AppButton>
            </>
          )}
          <Divider style={styles.divider} />
          <AppButton
            tone="text"
            onPress={() => setShowServerConfig(!showServerConfig)}
            style={styles.resetButton}
          >
            Configurar servidor
          </AppButton>
          {showServerConfig && (
            <>
              <AppInput
                label="URL de la API"
                value={apiUrl}
                onChangeText={setApiUrlState}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="http://servidor:8082/api/v1"
                style={styles.input}
              />
              <View style={styles.serverButtons}>
                <AppButton tone="secondary" onPress={handleResetApiUrl} style={styles.serverButton}>
                  Restablecer
                </AppButton>
                <AppButton onPress={handleSaveApiUrl} loading={savingApiUrl} style={styles.serverButton}>
                  Guardar
                </AppButton>
              </View>
            </>
          )}
        </AppCard>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: theme.colors.background.backdrop, padding: theme.spacing[6],
  },
  card: {
    padding: theme.spacing[6], borderRadius: theme.radius.lg,
    alignItems: 'center', backgroundColor: theme.colors.background.authOverlay,
    ...theme.shadows.z2,
  },
  title: { ...theme.typography.h3, color: theme.colors.text.primary, marginBottom: theme.spacing[2], textAlign: 'center' },
  subtitle: { ...theme.typography.body1, color: theme.colors.text.secondary, marginBottom: theme.spacing[6] },
  input: { width: '100%', marginTop: theme.spacing[4] },
  button: { width: '100%', marginTop: theme.spacing[4], marginBottom: theme.spacing[2] },
  resetButton: { width: '100%' },
  divider: { width: '100%', marginVertical: theme.spacing[2], backgroundColor: theme.colors.border.subtle },
  serverButtons: { width: '100%', flexDirection: 'row', gap: theme.spacing[2] },
  serverButton: { flex: 1, borderRadius: 8 },
  errorText: { ...theme.typography.body2, width: '100%', color: theme.colors.status.error, textAlign: 'center', marginBottom: theme.spacing[4] },
})
