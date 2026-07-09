import React from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { Text, Surface, Button, Avatar, IconButton, Divider } from 'react-native-paper'
import { useAuth } from '../AuthContext'
import { removeToken } from '../api'
import ErrorBoundary from '../components/ErrorBoundary'

export default function PerfilScreen() {
  const { user, logout } = useAuth()

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
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Surface style={styles.profileCard}>
          <Avatar.Icon size={72} icon="account" color="#fff" style={styles.avatar} />
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
            <Text variant="bodyMedium" style={styles.value}>1.0.0</Text>
          </View>
        </Surface>

        <Button
          mode="contained"
          buttonColor="#d32f2f"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={{ height: 48 }}
        >
          Cerrar Sesión
        </Button>
      </ScrollView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#1565C0',
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
  logoutButton: {
    marginTop: 8,
    borderRadius: 8,
  },
})
