import React, { useCallback, useState } from 'react'
import { Alert, Image, Modal, Pressable, StatusBar, StyleSheet, View } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { useRoute, useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import api, { getToken, loadApiUrl } from '../api'
import { theme } from '../theme'
import AppCard from '../components/AppCard'
import AppButton from '../components/AppButton'
import LoadingScreen from '../components/LoadingScreen'
import ErrorBoundary from '../components/ErrorBoundary'
import EmptyState from '../components/EmptyState'
import StatusChip from '../components/StatusChip'
import ZoomableImage from '../components/ZoomableImage'
import EquipmentTimeline from '../components/equipment/timeline/EquipmentTimeline'
import { formatDate, formatDowntimeLong, formatHourMeter } from '../components/equipment/timeline/timeline.utils'

function statusType(estado) {
  if (estado === 'OPERATIVO') return 'active'
  if (estado === 'AVERIADO') return 'fault'
  if (estado === 'DEVUELTO') return 'approved'
  return 'cancelled'
}

function SummaryCell({ label, value, last = false }) {
  return (
    <View style={[styles.summaryCell, !last && styles.summaryCellBorder]}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  )
}

// Segunda pantalla: Historial (timeline) del equipo.
// EquipoDetailScreen se mantiene como pantalla principal de detalle.
export default function EquipoTimelineScreen() {
  const route = useRoute()
  const insets = useSafeAreaInsets()
  const { id } = route.params
  const [equipo, setEquipo] = useState(null)
  const [timeline, setTimeline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [imageAuth, setImageAuth] = useState(null)
  const [viewer, setViewer] = useState(null)

  const fetchTimeline = useCallback(async () => {
    try {
      setError(null)
      const [equipmentRes, timelineRes] = await Promise.all([
        api.get(`/equipos/${id}`),
        api.get(`/equipos/${id}/timeline`),
      ])
      setEquipo(equipmentRes.data?.data || equipmentRes.data)
      setTimeline(timelineRes.data?.data || timelineRes.data)
      const [baseUrl, token] = await Promise.all([loadApiUrl(), getToken()])
      setImageAuth({ baseUrl, token })
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al cargar el historial')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [id])

  useFocusEffect(useCallback(() => { fetchTimeline() }, [fetchTimeline]))

  const photosRenderer = useCallback((photos) => (
    <View style={styles.photoRow}>
      {photos.slice(0, 5).map((photo) => (
        <Pressable
          key={photo.id}
          onPress={() => {
            if (!imageAuth) return
            setViewer({ uri: `${imageAuth.baseUrl}${photo.url}`, headers: imageAuth.token ? { Authorization: `Bearer ${imageAuth.token}` } : {} })
          }}
          accessibilityRole="button"
          accessibilityLabel={`Ver fotografía ${photo.description || photo.type || ''}`}
          style={styles.photoItem}
        >
          <Image
            style={styles.photo}
            source={{
              uri: `${imageAuth?.baseUrl}${photo.url}`,
              headers: imageAuth?.token ? { Authorization: `Bearer ${imageAuth.token}` } : {},
            }}
            resizeMode="cover"
          />
        </Pressable>
      ))}
    </View>
  ), [imageAuth])

  if (loading) return <LoadingScreen message="Cargando historial" />
  if (error && !equipo) {
    return (
      <ErrorBoundary>
        <EmptyState icon="timeline" title="No fue posible cargar el historial"
          subtitle={error} />
        <View style={styles.retry}>
          <AppButton variant="secondary" icon="refresh" onPress={fetchTimeline} fullWidth>
            Reintentar
          </AppButton>
        </View>
      </ErrorBoundary>
    )
  }

  const summary = timeline?.summary || {}
  const events = timeline?.events || []
  const currentStatus = timeline?.currentStatus || equipo?.estadoOperativo || 'OPERATIVO'
  const inicial = summary.initialHourMeter != null ? `${formatHourMeter(summary.initialHourMeter)} h` : '-'
  const downtime = summary.totalDowntimeMinutes > 0 ? formatDowntimeLong(summary.totalDowntimeMinutes) : '0 min'

  return (
    <ErrorBoundary>
      <View style={styles.root}>
        <EquipmentTimeline
          events={events}
          loading={false}
          error={error}
          onRetry={fetchTimeline}
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchTimeline() }}
          photosRenderer={photosRenderer}
          ListHeaderComponent={(
            <>
              <AppCard style={styles.section}>
                <View style={styles.header}>
                  <View style={styles.headerText}>
                    <Text variant="titleMedium" style={styles.title}>
                      {equipo?.marcaNombre ? `${equipo.marcaNombre} ${equipo.modelo || ''}` : (equipo?.modelo || 'Equipo')}
                    </Text>
                    <Text style={styles.subtitle}>Código: {equipo?.codigo || '-'}</Text>
                    <Text style={styles.subtitle}>Serie: {equipo?.numeroSerie || '-'}</Text>
                  </View>
                  <StatusChip status={statusType(currentStatus)} label={currentStatus || 'DESCONOCIDO'} />
                </View>
              </AppCard>

              <AppCard style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Resumen operativo</Text>
                <Divider style={styles.divider} />
                <View style={styles.summaryRow}>
                  <SummaryCell label="F. ingreso" value={formatDate(summary.entryDate)} />
                  <SummaryCell label="Nro. averías" value={String(summary.failureCount || 0)} />
                  <SummaryCell label="F. finalización" value={summary.finalDate ? formatDate(summary.finalDate) : 'Pendiente'} />
                </View>
                <View style={styles.summaryRow}>
                  <SummaryCell label="Horómetro inicio" value={inicial} />
                  <SummaryCell label="T. inactividad" value={downtime} />
                  <SummaryCell label="Horómetro fin" value={summary.finalHourMeter != null ? `${formatHourMeter(summary.finalHourMeter)} h` : '-'} />
                </View>
              </AppCard>

              {events.length === 0 ? (
                <Text style={styles.emptyHistorial}>No existen eventos registrados.</Text>
              ) : null}
            </>
          )}
          testID="equipment-timeline"
        />

        <Modal visible={!!viewer} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setViewer(null)}>
          <StatusBar hidden />
          <View style={styles.viewerRoot}>
            <View style={[styles.viewerHeader, { paddingTop: insets.top + 8 }]}>
              <Pressable onPress={() => setViewer(null)} style={styles.viewerBack}>
                <Text style={styles.viewerBackIcon}>{'‹'}</Text>
              </Pressable>
              <View style={{ flex: 1 }} />
              <View style={{ width: 44 }} />
            </View>
            <ZoomableImage uri={viewer?.uri} headers={viewer?.headers} />
            <View style={[styles.viewerFooter, { paddingBottom: insets.bottom + 8 }]}>
              <AppButton icon="close" onPress={() => setViewer(null)} fullWidth>
                Cerrar
              </AppButton>
            </View>
          </View>
        </Modal>
      </View>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background.page },
  section: { marginHorizontal: theme.spacing[4], marginBottom: theme.spacing[3] },
  header: { flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1, marginRight: theme.spacing[2] },
  title: { ...theme.typography.title, color: theme.colors.text.primary },
  subtitle: { ...theme.typography.body2, color: theme.colors.text.secondary, marginTop: 2 },
  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  divider: {
    marginBottom: theme.spacing[3],
    backgroundColor: theme.colors.border.subtle,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[2],
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing[1],
  },
  summaryCellBorder: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.subtle,
  },
  summaryValue: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  emptyHistorial: {
    ...theme.typography.body2,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: theme.spacing[4],
  },
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  photoItem: { width: '30%' },
  photo: {
    width: '100%',
    aspectRatio: 1.25,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background.neutral,
  },
  retry: {
    paddingHorizontal: theme.spacing[4],
    marginTop: theme.spacing[2],
  },
  // Visor a pantalla completa
  viewerRoot: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewerBack: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  viewerBackIcon: { fontSize: 28, color: '#fff' },
  viewerFooter: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})