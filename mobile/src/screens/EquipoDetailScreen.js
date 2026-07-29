import React, { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native'
import api, { getToken, loadApiUrl } from '../api'
import LoadingScreen from '../components/LoadingScreen'
import ErrorBoundary from '../components/ErrorBoundary'
import EmptyState from '../components/EmptyState'
import AppCard from '../components/AppCard'
import AppButton from '../components/AppButton'
import AppIconButton from '../components/AppIconButton'
import StatusChip from '../components/StatusChip'
import ErrorState from '../components/ErrorState'
import { theme } from '../theme'
import { accessoryFields } from '../utils/equipmentForm'

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
  const [evidencias, setEvidencias] = useState([])
  const [imageAuth, setImageAuth] = useState(null)

  const fetchEquipo = useCallback(async () => {
    try {
      setError(null)
      const [equipmentResponse, evidenceResponse] = await Promise.all([
        api.get(`/equipos/${id}`),
        api.get(`/ingresos-equipo/${id}/evidencias`),
      ])
      setEquipo(equipmentResponse.data?.data || equipmentResponse.data)
      const evidenceList = evidenceResponse.data?.data || evidenceResponse.data || []
      setEvidencias(Array.isArray(evidenceList) ? evidenceList : [])
      const [baseUrl, token] = await Promise.all([loadApiUrl(), getToken()])
      setImageAuth({ baseUrl, token })
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

  if (loading) return <LoadingScreen />
  if (error) return <ErrorState title="Error al cargar el equipo" message={error} onRetry={fetchEquipo} />
  if (!equipo) return <EmptyState icon="information" title="Equipo no encontrado" />

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <AppCard style={styles.section}>
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
            <Text variant="bodySmall" style={styles.label}>Fecha de ingreso</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.fechaIngreso || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Guía de remisión</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.numeroGuiaRemision || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Capacidad</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {equipo.capacidad != null ? `${equipo.capacidad} ${equipo.unidadCapacidad || ''}` : '-'}
            </Text>
          </View>
        </AppCard>

        <AppCard style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Estado
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Estado Operativo</Text>
            <StatusChip status={equipo.estadoOperativo === 'OPERATIVO' ? 'active' : equipo.estadoOperativo === 'AVERIADO' ? 'fault' : 'cancelled'} label={equipo.estadoOperativo || 'DESCONOCIDO'} />
          </View>
        </AppCard>

        <AppCard style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Proveedor / Marca / Tipo
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Proveedor</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.proveedorNombre || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Marca</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.marcaNombre || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Tipo</Text>
            <Text variant="bodyMedium" style={styles.value}>{equipo.tipoEquipoNombre || '-'}</Text>
          </View>
        </AppCard>

        <AppCard style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Accesorios</Text>
          <Divider style={styles.divider} />
          {accessoryFields.map(item => (
            <View key={item.key} style={styles.accesorioRow}>
              <AppIconButton
                icon={equipo[item.key] ? 'check-circle' : 'close-circle'}
                size={20}
                iconColor={equipo[item.key] ? theme.colors.status.success : theme.colors.text.tertiary}
                accessibilityLabel={`${item.label}: ${equipo[item.key] ? 'incluido' : 'no incluido'}`}
              />
              <Text variant="bodyMedium">{item.label}</Text>
            </View>
          ))}
        </AppCard>

        {evidencias.length > 0 && imageAuth ? (
          <AppCard style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Evidencias de ingreso</Text>
            <Divider style={styles.divider} />
            <View style={styles.gallery}>
              {evidencias.map(item => (
                <View key={item.tipo} style={styles.photoItem}>
                  <Image
                    style={styles.photo}
                    source={{
                      uri: `${imageAuth.baseUrl}/ingresos-equipo/${id}/evidencias/${item.tipo}/archivo`,
                      headers: { Authorization: `Bearer ${imageAuth.token}` },
                    }}
                    resizeMode="cover"
                  />
                  <Text style={styles.photoLabel}>{item.tipo.replaceAll('_', ' ')}</Text>
                </View>
              ))}
            </View>
          </AppCard>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            variant="primary"
            icon="alert"
            onPress={() => navigation.navigate('RegistrarAveria', { equipoId: equipo.id })}
            style={styles.actionButton}
            fullWidth
          >
            Registrar Avería
          </AppButton>
          <AppButton
            variant="secondary"
            icon="file-document"
            onPress={fetchAverias}
            style={styles.actionButton}
            loading={loadingAverias}
            fullWidth
          >
            {showAverias ? 'Ocultar Averías' : 'Ver Averías'}
          </AppButton>
        </View>

        {showAverias && (
          <AppCard style={styles.section}>
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
                    <StatusChip status={av.estadoAveria === 'ATENDIDA' ? 'approved' : av.estadoAveria === 'PENDIENTE' ? 'pending' : 'cancelled'} label={av.estadoAveria || 'PENDIENTE'} />
                  </View>
                  <Text variant="bodySmall" style={styles.averiaDesc}>
                    {av.descripcionFalla || av.descripcion || '-'}
                  </Text>
                  {av.estadoAveria === 'PENDIENTE' && (
                    <AppButton
                      variant="text"
                      onPress={() => navigation.navigate('AtenderAveria', { averiaId: av.id })}
                    >
                      Atender
                    </AppButton>
                  )}
                </View>
              ))
            )}
          </AppCard>
        )}
      </ScrollView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.page,
  },
  content: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[8],
  },
  section: {
    marginBottom: theme.spacing[3],
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  divider: {
    marginBottom: theme.spacing[3],
    backgroundColor: theme.colors.border.subtle,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  value: {
    ...theme.typography.body,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  accesorioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[1],
  },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },
  photoItem: { width: '48%' },
  photo: { width: '100%', aspectRatio: 1.25, borderRadius: theme.radius.sm, backgroundColor: theme.colors.background.page },
  photoLabel: { ...theme.typography.caption, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  actions: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  actionButton: {
    marginBottom: theme.spacing[2],
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
    paddingVertical: theme.spacing[4],
  },
  averiaItem: {
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  averiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  averiaDate: {
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.text.primary,
  },
  averiaDesc: {
    color: theme.colors.text.secondary,
  },
})
