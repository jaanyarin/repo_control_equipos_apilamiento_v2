import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { Text, Surface, Button, Avatar, IconButton, Divider, Dialog } from 'react-native-paper'
import { useAuth } from '../AuthContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { removeToken } from '../api'
import ErrorBoundary from '../components/ErrorBoundary'
import { APP_VERSION } from '../constants/appVersion'
import { VERSION_HISTORY } from '../constants/versionHistory'
import { theme } from '../theme'

export default function PerfilScreen() {
  const { user, logout } = useAuth()
  const insets = useSafeAreaInsets()
  const [showHistory, setShowHistory] = useState(false)

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await removeToken()
          await logout()
        },
      },
    ])
  }

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom + 68 }]}>
        <Surface style={styles.profileCard}>
          <Avatar.Icon size={72} icon="account" color={theme.colors.text.inverse} style={styles.avatar} />
          <Text variant="titleLarge" style={styles.name}>
            {user?.nombre || 'Usuario'}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user?.correo || 'Sin correo registrado'}
          </Text>
          <Text variant="bodySmall" style={styles.rol}>
            {user?.rol || 'Sin rol asignado'}
          </Text>
        </Surface>

        <Surface style={styles.infoCard}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Información de la Cuenta
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Nombre</Text>
            <Text variant="bodyMedium" style={styles.value}>{user?.nombre || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Correo</Text>
            <Text variant="bodyMedium" style={styles.value}>{user?.correo || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Rol</Text>
            <Text variant="bodyMedium" style={styles.value}>{user?.rol || '-'}</Text>
          </View>
        </Surface>

        <Surface style={styles.infoCard}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Aplicación
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Versión</Text>
            <View style={styles.versionRight}>
              <Text variant="bodyMedium" style={styles.value}>{APP_VERSION}</Text>
              <IconButton
                icon="history"
                size={20}
                iconColor={theme.colors.action.primary}
                style={styles.historyBtn}
                accessibilityLabel="Historial de versiones"
                onPress={() => setShowHistory(true)}
              />
            </View>
          </View>
        </Surface>

        <Button
          mode="contained"
          buttonColor={theme.colors.status.error}
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={{ height: 48 }}
        >
          Cerrar Sesión
        </Button>
      </ScrollView>

      <Dialog visible={showHistory} onDismiss={() => setShowHistory(false)} style={styles.dialog}>
        <Dialog.Title>Historial de versiones</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            {VERSION_HISTORY.map((entry, index) => (
              <View key={entry.version}>
                {index > 0 ? <Divider style={styles.historyDivider} /> : null}
                <View style={styles.historyHeader}>
                  <Text variant="titleSmall" style={styles.historyVersion}>v{entry.version}</Text>
                  <Text variant="bodySmall" style={styles.historyDate}>{entry.fecha}</Text>
                </View>
                <Text variant="bodySmall" style={styles.historyTitulo}>{entry.titulo}</Text>
                {entry.cambios.map((cambio, i) => (
                  <Text key={i} variant="bodySmall" style={styles.historyItem}>• {cambio}</Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowHistory(false)}>Cerrar</Button>
        </Dialog.Actions>
      </Dialog>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.page,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  avatar: {
    backgroundColor: theme.colors.action.primary,
    marginBottom: 12,
  },
  name: {
    fontWeight: 700,
    marginBottom: 4,
  },
  email: {
    opacity: 0.7,
    marginBottom: 4,
  },
  rol: {
    opacity: 0.5,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    opacity: 0.6,
    flex: 1,
  },
  value: {
    fontWeight: 600,
    flex: 1,
    textAlign: 'right',
  },
  versionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  historyBtn: {
    margin: 0,
    marginLeft: 4,
  },
  dialog: {
    borderRadius: 20,
  },
  historyDivider: {
    marginVertical: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  historyVersion: {
    fontWeight: 700,
    color: theme.colors.action.primary,
  },
  historyDate: {
    opacity: 0.6,
  },
  historyTitulo: {
    fontWeight: 600,
    opacity: 0.8,
    marginBottom: 4,
  },
  historyItem: {
    opacity: 0.7,
    marginBottom: 2,
    lineHeight: 18,
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 8,
  },
})
