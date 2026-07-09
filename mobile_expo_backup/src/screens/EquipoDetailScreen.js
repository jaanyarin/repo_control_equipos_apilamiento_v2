import React, { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { Text, Surface, Chip, Button, IconButton, ActivityIndicator, Divider } from 'react-native-paper'
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import ErrorBoundary from '../components/ErrorBoundary'
import EmptyState from '../components/EmptyState'

export default function EquipoDetailScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { id } = route.params
  const [equipo, setEquipo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [averias, setAverias] = useState([])
  const [showAverias, setShowAverias] = useState(false)
  const [loadingAverias, setLoadingAverias] = useState(false)

  const fetchEquipo = useCallback(async () => {
    try {
      setError(null)
      const { data } = await api.get(`/equipos/${id}`)
      setEquipo(data?.data || data)
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al cargar equipo')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEquipo()
  }, [fetchEquipo])

  const fetchAverias = async () => {
    if (showAverias) {
      setShowAverias(false)
      return
    }
    setLoadingAverias(true)
    try {
      const { data } = await api.get(`/averias/por-equipo/${id}`)
      const list = data?.data || data || []
      setAverias(Array.isArray(list) ? list : [])
      setShowAverias(true)
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message || 'Error al cargar averías')
    } finally {
      setLoadingAverias(false)
    }
  }

  const chipColor = (estado) => {
    switch (estado) {
      case 'OPERATIVO':
        return '#2e7d32'
      case 'AVERIADO':
        return '#d32f2f'
      default:
        return '#888'
    }
  }

  if (loading) return <LoadingScreen />
  if (error) return <EmptyState icon="alert" title="Error" subtitle={error} />
  if (!equipo) return <EmptyState icon="information" title="Equipo no encontrado" />

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Información General
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Modelo</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.modelo || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Código</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.codigo || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Serie</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.numeroSerie || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Capacidad</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {equipo.capacidad != null ? `${equipo.capacidad} ${equipo.unidadCapacidad || ''}` : '-'}
            </Text>
          </View>
        </Surface>

        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Estado
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Estado Operativo</Text>
            <Chip
              mode="flat"
              textStyle={{ color: '#fff', fontSize: 12, fontWeight: 600 }}
              style={{ backgroundColor: chipColor(equipo.estadoOperativo) }}
            >
              {equipo.estadoOperativo || 'DESCONOCIDO'}
            </Chip>
          </View>
        </Surface>

        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Proveedor / Marca / Tipo
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Proveedor</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.proveedor?.nombre || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Marca</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.marca?.nombre || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Tipo</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.tipoEquipo?.nombre || '-'}</Text>
          </View>
        </Surface>

        {equipo.accesorios && equipo.accesorios.length > 0 ? (
          <Surface style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Accesorios
            </Text>
            <Divider style={styles.divider} />
            {equipo.accesorios.map((acc, index) => (
              <View key={index} style={styles.accesorioRow}>
                <IconButton
                  icon={acc.tiene ? 'check-circle' : 'close-circle'}
                  size={20}
                  iconColor={acc.tiene ? '#2e7d32' : '#d32f2f'}
                />
                <Text variant="bodyMedium">{acc.nombre || acc.accesorio?.nombre || '-'}</Text>
              </View>
            ))}
          </Surface>
        ) : null}

        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="alert"
            onPress={() => navigation.navigate('RegistrarAveria', { equipoId: equipo.id })}
            style={styles.actionButton}
            contentStyle={{ height: 48 }}
          >
            Registrar Avería
          </Button>
          <Button
            mode="outlined"
            icon="file-document"
            onPress={fetchAverias}
            style={styles.actionButton}
            contentStyle={{ height: 48 }}
            loading={loadingAverias}
          >
            {showAverias ? 'Ocultar Averías' : 'Ver Averías'}
          </Button>
        </View>

        {showAverias && (
          <Surface style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Averías del Equipo
            </Text>
            <Divider style={styles.divider} />
            {averias.length === 0 ? (
              <Text variant="bodyMedium" style={styles.emptyText}>
                No hay averías registradas
              </Text>
            ) : (
              averias.map((av, index) => (
                <View key={index} style={styles.averiaItem}>
                  <View style={styles.averiaHeader}>
                    <Text variant="bodyMedium" style={styles.averiaDate}>
                      {av.fechaHoraAveria ? new Date(av.fechaHoraAveria).toLocaleDateString() : '-'}
                    </Text>
                    <Chip
                      mode="flat"
                      textStyle={{ color: '#fff', fontSize: 11, fontWeight: 600 }}
                      style={{
                        backgroundColor:
                          av.estadoAveria === 'ATENDIDA' ? '#2e7d32' : av.estadoAveria === 'PENDIENTE' ? '#e65100' : '#888',
                      }}
                    >
                      {av.estadoAveria || 'PENDIENTE'}
                    </Chip>
                  </View>
                  <Text variant="bodySmall" style={styles.averiaDesc}>
                    {av.descripcionFalla || av.descripcion || '-'}
                  </Text>
                  {av.estadoAveria === 'PENDIENTE' && (
                    <Button
                      mode="text"
                      compact
                      onPress={() => navigation.navigate('AtenderAveria', { averiaId: av.id })}
                    >
                      Atender
                    </Button>
                  )}
                </View>
              ))
            )}
          </Surface>
        )}
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
  section: {
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
  accesorioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actions: {
    marginTop: 8,
    marginBottom: 12,
  },
  actionButton: {
    marginBottom: 8,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    paddingVertical: 16,
  },
  averiaItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  averiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  averiaDate: {
    fontWeight: 600,
  },
  averiaDesc: {
    opacity: 0.7,
  },
})
