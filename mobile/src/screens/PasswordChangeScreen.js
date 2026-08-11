import React, { useState } from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import { Button, Text, Surface, TextInput, ActivityIndicator } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import api, { setToken } from '../api'
import { useAuth } from '../AuthContext'
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView'
import { theme } from '../theme'

export default function PasswordChangeScreen() {
  const { user, refreshUser, logout } = useAuth()
  const insets = useSafeAreaInsets()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChangePassword = async () => {
    if (!/^\d{8}$/.test(newPassword)) {
      setError('La contraseña debe tener exactamente 8 dígitos numéricos')
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
        newPassword,
      })
      await setToken(data.token)
      setSuccess(true)
      await refreshUser(data.token)
    } catch (e) {
      const errMsg = e.response?.data?.error || e.message || 'Error al cambiar contraseña'
      console.error('[PasswordChange]', e?.response?.status, errMsg)
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    logout().catch(() => {})
  }

  return (
    <ImageBackground
      source={require('../../assets/fondo_login.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.overlay,
          { paddingTop: Math.max(insets.top, theme.spacing[6]), paddingBottom: Math.max(insets.bottom, theme.spacing[6]) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>
            Cambiar contraseña
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            Bienvenido, {user?.nombre}. Debe cambiar su contraseña predeterminada.
          </Text>
          <Text variant="bodySmall" style={styles.hintText}>
            Use su número de DNI (8 dígitos) como nueva contraseña.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            label="Nueva contraseña"
            value={newPassword}
            onChangeText={value => setNewPassword(value.replace(/[^0-9]/g, '').slice(0, 8))}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={8}
            mode="outlined"
            style={styles.input}
            disabled={success}
          />
          <TextInput
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={value => setConfirmPassword(value.replace(/[^0-9]/g, '').slice(0, 8))}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={8}
            mode="outlined"
            style={styles.input}
            disabled={success}
          />
          <Button
            mode="contained"
            onPress={handleChangePassword}
            style={styles.button}
            contentStyle={{ height: 48 }}
            disabled={loading || success}
          >
            {loading ? <ActivityIndicator color={theme.colors.text.inverse} /> : 'Cambiar contraseña'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={styles.cancelButton}
            contentStyle={{ height: 48 }}
            disabled={loading || success}
          >
            Cancelar
          </Button>
          {success && (
            <Text style={styles.successText}>
              Contraseña actualizada. Redirigiendo...
            </Text>
          )}
        </Surface>
      </KeyboardAwareScrollView>
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
    width: '100%', maxWidth: 360, padding: 32, borderRadius: 16,
    alignItems: 'center', elevation: 4,
  },
  title: { fontWeight: '700', marginBottom: 16 },
  infoText: { textAlign: 'center', marginBottom: 8, opacity: 0.8 },
  hintText: { textAlign: 'center', marginBottom: 16, color: theme.colors.action.primary, fontFamily: theme.fontFamily.medium },
  input: { width: '100%', marginBottom: 12 },
  button: { width: '100%', borderRadius: 8 },
  cancelButton: { width: '100%', borderRadius: 8, marginTop: 8 },
  errorText: { width: '100%', color: theme.colors.status.error, textAlign: 'center', marginBottom: 12 },
  successText: { width: '100%', color: theme.colors.status.success, textAlign: 'center', marginTop: 12 },
})
