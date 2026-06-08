import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Text, Surface, Button, IconButton } from 'react-native-paper'
import { useAuth } from '../AuthContext'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingScreen from '../components/LoadingScreen'
import { useNavigation } from '@react-navigation/native'

export default function HomeScreen() {
  const { user, loading } = useAuth()
  const navigation = useNavigation()

  if (loading) return <LoadingScreen />

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
        </Surface>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Resumen
        </Text>

        <View style={styles.cardsRow}>
          <Surface style={styles.summaryCard}>
            <IconButton icon="warehouse" size={32} iconColor="#1565C0" />
            <Text variant="headlineMedium" style={styles.cardValue}>
              -
            </Text>
            <Text variant="bodySmall" style={styles.cardLabel}>
              Equipos
            </Text>
          </Surface>
          <Surface style={styles.summaryCard}>
            <IconButton icon="alert" size={32} iconColor="#e65100" />
            <Text variant="headlineMedium" style={styles.cardValue}>
              -
            </Text>
            <Text variant="bodySmall" style={styles.cardLabel}>
              Averías Reportadas
            </Text>
          </Surface>
          <Surface style={styles.summaryCard}>
            <IconButton icon="check" size={32} iconColor="#2e7d32" />
            <Text variant="headlineMedium" style={styles.cardValue}>
              -
            </Text>
            <Text variant="bodySmall" style={styles.cardLabel}>
              Averías Atendidas
            </Text>
          </Surface>
        </View>

        <Button
          mode="contained"
          icon="warehouse"
          onPress={() => navigation.navigate('EquiposList')}
          style={styles.actionButton}
          contentStyle={{ height: 48 }}
        >
          Ver Equipos
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
  },
  headerCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  welcomeText: {
    fontWeight: 700,
    marginTop: 8,
  },
  roleText: {
    opacity: 0.6,
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 1,
  },
  cardValue: {
    fontWeight: 700,
    color: '#1565C0',
    marginVertical: 4,
  },
  cardLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  actionButton: {
    borderRadius: 8,
  },
})
