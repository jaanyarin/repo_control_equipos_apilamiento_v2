import React, { useState, useEffect } from 'react'
import { View, ScrollView, StyleSheet, ImageBackground } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Text, Surface, TextInput, ActivityIndicator, Menu, Divider } from 'react-native-paper'
import api, { setToken, parseToken, loadApiUrl, setApiUrl, BUILT_IN_API_URL } from './api'
import { useAuth } from './AuthContext'

export default function LoginScreen() {
  const insets = useSafeAreaInsets()
  const { refreshUser } = useAuth()
  const [roles, setRoles] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [selectedRolId, setSelectedRolId] = useState(null)
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null)
  const [selectedUsuarioLabel, setSelectedUsuarioLabel] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRolMenu, setShowRolMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
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
      setSelectedUsuarioLabel('')
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
      const parsed = parseToken(data.token)
      if (parsed?.passwordResetRequired) {
        refreshUser()
      } else {
        await refreshUser()
      }
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
      setSelectedUsuarioLabel('')
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

  const selectedRolName = selectedRolId && Array.isArray(roles)
    ? roles.find(r => r.id === selectedRolId)?.nombre || ''
    : ''

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
        <Surface style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>
            Control de Equipos de Apilamiento Packing
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Aplicativo Android
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Menu
            visible={showRolMenu}
            onDismiss={() => setShowRolMenu(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setShowRolMenu(true)}
                style={styles.dropdown}
              >
                {selectedRolName || 'Seleccionar Perfil'}
              </Button>
            }
          >
            {(roles || []).map(r => (
              <Menu.Item
                key={r.id}
                title={r.nombre}
                onPress={() => { setSelectedRolId(r.id); setShowRolMenu(false) }}
              />
            ))}
          </Menu>

          {step !== 'roles' && (
            <Menu
              visible={showUserMenu}
              onDismiss={() => setShowUserMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowUserMenu(true)}
                  style={styles.dropdown}
                >
                  {selectedUsuarioLabel || 'Seleccionar Usuario'}
                </Button>
              }
            >
              {(usuarios || []).map(u => (
                <Menu.Item
                  key={u.id}
                  title={`${u.nombre}${u.area ? ` (${u.area})` : ''}`}
                  onPress={() => { setSelectedUsuarioId(u.id); setSelectedUsuarioLabel(`${u.nombre}${u.area ? ` (${u.area})` : ''}`); setShowUserMenu(false) }}
                />
              ))}
            </Menu>
          )}

          {step === 'password' && (
            <>
              <TextInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
              />
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                contentStyle={{ height: 48 }}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : 'Iniciar sesión'}
              </Button>
              <Button
                mode="text"
                onPress={() => { setSelectedRolId(null); setStep('roles') }}
                style={styles.resetButton}
              >
                Cambiar usuario
              </Button>
            </>
          )}
          <Divider style={styles.divider} />
          <Button
            mode="text"
            onPress={() => setShowServerConfig(!showServerConfig)}
            style={styles.resetButton}
          >
            Configurar servidor
          </Button>
          {showServerConfig && (
            <>
              <TextInput
                label="URL de la API"
                value={apiUrl}
                onChangeText={setApiUrlState}
                mode="outlined"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="http://servidor:8082/api/v1"
                style={styles.input}
              />
              <View style={styles.serverButtons}>
                <Button mode="outlined" onPress={handleResetApiUrl} style={styles.serverButton}>
                  Restablecer
                </Button>
                <Button mode="contained" onPress={handleSaveApiUrl} loading={savingApiUrl} disabled={savingApiUrl} style={styles.serverButton}>
                  Guardar
                </Button>
              </View>
            </>
          )}
        </Surface>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', padding: 24,
  },
  card: {
    width: '100%', maxWidth: 360, padding: 32, borderRadius: 16,
    alignItems: 'center', elevation: 4,
  },
  title: { fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  subtitle: { opacity: 0.6, marginBottom: 24 },
  dropdown: { width: '100%', marginBottom: 12 },
  input: { width: '100%', marginBottom: 12 },
  button: { width: '100%', borderRadius: 8, marginBottom: 8 },
  resetButton: { width: '100%' },
  divider: { width: '100%', marginVertical: 8 },
  serverButtons: { width: '100%', flexDirection: 'row', gap: 8 },
  serverButton: { flex: 1, borderRadius: 8 },
  errorText: { width: '100%', color: '#d32f2f', textAlign: 'center', marginBottom: 16 },
})
