import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Text, Surface, Button, IconButton } from 'react-native-paper'
import { useAuth } from '../AuthContext'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingScreen from '../components/LoadingScreen'
import { useNavigation } from '@react-navigation/native'

const menuActions = [
  { label: 'Ingreso de PSR y OSR', icon: 'file-document', screen: 'EquiposList', roles: ['Super Admin', 'Admin'] },
  { label: 'Ingreso de Equipo', icon: 'warehouse', screen: 'EquiposList', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Registro de Avería', icon: 'alert', screen: 'RegistrarAveria', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Detalles de Equipo', icon: 'information', screen: 'EquiposList', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Finalización del Servicio', icon: 'check-circle', screen: 'AtenderAveria', roles: ['Super Admin', 'Admin', 'Usuario'] },
]

const iconColors = ['#1565C0', '#e65100', '#d32f2f', '#2e7d32', '#6a1b9a']

export default function HomeScreen() {
  const { user, loading } = useAuth()
  const navigation = useNavigation()

  if (loading) return <LoadingScreen />

  const userRole = user?.rol || ''
  const visibleActions = menuActions.filter(a => a.roles.includes(userRole))

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Surface style={styles.headerCard}>
          <IconButton icon="account-circle" size={48} iconColor="#1565C0" />
          <Text variant="titleLarge" style={styles.welcomeText}>
            Bienvenido, {user?.nombre || 'Usuario'}
          </Text>
          <Text variant="bodySmall" style={styles.roleText}>
            {user?.rol || 'Sin rol asignado'}
          </Text>
          {user?.area ? (
            <Text variant="bodySmall" style={styles.areaText}>
              {user.area}
            </Text>
          ) : null}
        </Surface>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Menú Principal
        </Text>

        {visibleActions.map((action, index) => (
          <Button
            key={action.label}
            mode="contained"
            icon={action.icon}
            onPress={() => navigation.navigate(action.screen)}
            style={[styles.menuButton, { backgroundColor: iconColors[index % iconColors.length] }]}
            contentStyle={{ height: 56 }}
            labelStyle={{ fontSize: 15, fontWeight: 600 }}
          >
            {action.label}
          </Button>
        ))}
      </ScrollView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  headerCard: {
    padding: 24, borderRadius: 16, alignItems: 'center',
    marginBottom: 16, elevation: 2,
  },
  welcomeText: { fontWeight: 700, marginTop: 8 },
  roleText: { opacity: 0.6, marginTop: 4 },
  areaText: { opacity: 0.5, marginTop: 2, fontSize: 12 },
  sectionTitle: { fontWeight: 600, marginBottom: 12 },
  menuButton: {
    borderRadius: 12, marginBottom: 12, elevation: 2,
  },
})
