import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Avatar, Icon, Text, TouchableRipple } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../AuthContext'
import AppCard from '../components/AppCard'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingScreen from '../components/LoadingScreen'
import { theme } from '../theme'

const menuActions = [
  { label: 'Ingreso de PSR', description: 'Registra y consulta movimientos PSR.', icon: 'file-document-outline', screen: 'PsrOsr', roles: ['Super Admin', 'Admin'] },
  { label: 'Ingreso de Equipo', description: 'Gestiona los equipos de apilamiento.', icon: 'warehouse', screen: 'EquiposList', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Registro de Avería', description: 'Reporta incidencias operativas.', icon: 'alert-outline', screen: 'RegistrarAveria', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Detalles de Equipo', description: 'Consulta información e historial.', icon: 'information-outline', screen: 'EquiposList', roles: ['Super Admin', 'Admin', 'Usuario'] },
  { label: 'Finalización del Servicio', description: 'Atiende y finaliza averías pendientes.', icon: 'check-circle-outline', screen: 'AtenderAveria', roles: ['Super Admin', 'Admin', 'Usuario'] },
]

export default function HomeScreen() {
  const { user, loading } = useAuth()
  const navigation = useNavigation()

  if (loading) return <LoadingScreen />

  const visibleActions = menuActions.filter(action => action.roles.includes(user?.rol || ''))

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <AppCard style={styles.headerCard}>
          <Avatar.Icon size={56} icon="account" color={theme.colors.text.inverse} style={styles.avatar} />
          <Text style={styles.welcomeText}>Bienvenido, {user?.nombre || 'Usuario'}</Text>
          <Text style={styles.roleText}>{user?.rol || 'Sin rol asignado'}</Text>
          {user?.area ? <Text style={styles.areaText}>{user.area}</Text> : null}
        </AppCard>

        <Text style={styles.sectionTitle}>Menú principal</Text>

        {visibleActions.map(action => (
          <TouchableRipple
            key={action.label}
            onPress={() => navigation.navigate(action.screen)}
            accessibilityRole="button"
            accessibilityLabel={`${action.label}. ${action.description}`}
            style={styles.actionWrapper}
          >
            <AppCard style={styles.menuCard}>
              <View style={styles.iconContainer}>
                <Icon source={action.icon} size={28} color={theme.colors.action.secondary} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{action.label}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Icon source="chevron-right" size={24} color={theme.colors.text.tertiary} />
            </AppCard>
          </TouchableRipple>
        ))}
      </ScrollView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  content: { padding: theme.spacing[4], paddingBottom: theme.spacing[6] },
  headerCard: { padding: theme.spacing[6], borderRadius: theme.radius.lg, alignItems: 'center', marginBottom: theme.spacing[6] },
  avatar: { backgroundColor: theme.colors.action.secondary, marginBottom: theme.spacing[3] },
  welcomeText: { ...theme.typography.h3, color: theme.colors.text.primary, textAlign: 'center' },
  roleText: { ...theme.typography.body1, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  areaText: { ...theme.typography.caption, color: theme.colors.text.tertiary, marginTop: theme.spacing[1] },
  sectionTitle: { ...theme.typography.subtitle1, color: theme.colors.text.primary, marginBottom: theme.spacing[3] },
  actionWrapper: { borderRadius: theme.radius.md, marginBottom: theme.spacing[3] },
  menuCard: { minHeight: 80, flexDirection: 'row', alignItems: 'center', padding: theme.spacing[4] },
  iconContainer: { width: 48, height: 48, borderRadius: theme.radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primaryColors.blueLighter, marginRight: theme.spacing[3] },
  actionText: { flex: 1, marginRight: theme.spacing[2] },
  actionTitle: { ...theme.typography.subtitle1, color: theme.colors.text.primary },
  actionDescription: { ...theme.typography.body2, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
})
