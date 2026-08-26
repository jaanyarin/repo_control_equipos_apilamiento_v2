import React, { useState, useEffect } from 'react'
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../theme'
import AppCard from '../components/AppCard'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

async function checkPermissionsAlreadyGranted() {
  try {
    const camera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
    if (Platform.OS >= 33) {
      const notif = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
      return camera && notif
    }
    return camera
  } catch {
    return false
  }
}

async function requestAllPermissions() {
  const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA]
  if (Platform.OS >= 33) {
    permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
  }
  await PermissionsAndroid.requestMultiple(permissions)
}

export default function PermissionsScreen({ onReady }) {
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    (async () => {
      const already = await checkPermissionsAlreadyGranted()
      if (already) {
        onReady()
        return
      }
      setChecking(false)
    })()
  }, [onReady])

  const handleGrant = async () => {
    await requestAllPermissions()
    onReady()
  }

  if (checking) return null

  return (
    <SafeAreaView style={styles.container}>
      <AppCard style={styles.card}>
        <Icon name="shield-lock-outline" size={64} color={theme.colors.action.primary} style={styles.icon} />
        <Text variant="headlineSmall" style={styles.title}>Permisos necesarios</Text>
        <Text variant="bodyMedium" style={styles.description}>
          La aplicación necesita acceso a la cámara para tomar fotografías de evidencia y a las notificaciones para alertarte de actividades importantes.
        </Text>
        <Button
          mode="contained"
          onPress={handleGrant}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Otorgar permisos
        </Button>
        <Button
          mode="text"
          onPress={onReady}
          style={styles.skipButton}
        >
          Continuar sin permisos
        </Button>
      </AppCard>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page, justifyContent: 'center', padding: theme.spacing[4] },
  card: { padding: theme.spacing[6], alignItems: 'center' },
  icon: { marginBottom: theme.spacing[4] },
  title: { ...theme.typography.title, color: theme.colors.text.primary, textAlign: 'center', marginBottom: theme.spacing[2] },
  description: { color: theme.colors.text.secondary, textAlign: 'center', marginBottom: theme.spacing[6], lineHeight: 22 },
  button: { width: '100%', marginBottom: theme.spacing[2] },
  buttonContent: { paddingVertical: theme.spacing[2] },
  skipButton: { width: '100%' },
})
