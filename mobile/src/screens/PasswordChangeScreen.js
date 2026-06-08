import React, { useState } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import { Button, Text, Surface, TextInput, ActivityIndicator, Alert } from 'react-native-paper'
import api, { setToken, parseToken, getToken } from '../api'
import { useAuth } from '../AuthContext'

export default function PasswordChangeScreen({ navigation }) {
  const { user, refreshUser } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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
      await setToken(data.token)
      setSuccess(true)
      await refreshUser()
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
    } catch (e) {
      setError(e.response?.data?.error || 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/fondo_login.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Surface style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>
            Cambiar contraseña
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            Bienvenido, {user?.nombre}. Debe cambiar su contraseña predeterminada.
          </Text>
          <Text variant="bodySmall" style={styles.hintText}>
            Use su número de DNI como nueva contraseña.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            label="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            disabled={success}
          />
          <TextInput
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
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
            {loading ? <ActivityIndicator color="#fff" /> : 'Cambiar contraseña'}
          </Button>
          {success && (
            <Text style={styles.successText}>
              Contraseña actualizada. Redirigiendo...
            </Text>
          )}
        </Surface>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', padding: 24,
  },
  card: {
    width: '100%', maxWidth: 360, padding: 32, borderRadius: 16,
    alignItems: 'center', elevation: 4,
  },
  title: { fontWeight: '700', marginBottom: 16 },
  infoText: { textAlign: 'center', marginBottom: 8, opacity: 0.8 },
  hintText: { textAlign: 'center', marginBottom: 16, color: '#1565C0', fontWeight: '500' },
  input: { width: '100%', marginBottom: 12 },
  button: { width: '100%', borderRadius: 8 },
  errorText: { width: '100%', color: '#d32f2f', textAlign: 'center', marginBottom: 12 },
  successText: { width: '100%', color: '#2e7d32', textAlign: 'center', marginTop: 12 },
})
