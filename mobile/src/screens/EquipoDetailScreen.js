import React, { useCallback, useRef, useState } from 'react'
import { Alert, Image, Modal, PermissionsAndroid, Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ReactNativeBlobUtil from 'react-native-blob-util'
import api, { getToken, loadApiUrl } from '../api'
import LoadingScreen from '../components/LoadingScreen'
import ErrorBoundary from '../components/ErrorBoundary'
import EmptyState from '../components/EmptyState'
import AppCard from '../components/AppCard'
import AppButton from '../components/AppButton'
import ZoomableImage from '../components/ZoomableImage'
import AppIconButton from '../components/AppIconButton'
import StatusChip from '../components/StatusChip'
import ErrorState from '../components/ErrorState'
import { theme } from '../theme'
import { accessoryFields } from '../utils/equipmentForm'

function formatAveriaDateTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

function formatAveriaHorometro(value) {
  if (value == null) return '-'
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function EquipoDetailScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { id } = route.params
  const [equipo, setEquipo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [averias, setAverias] = useState([])
  const [showAverias, setShowAverias] = useState(false)
  const showAveriasRef = useRef(false)
  showAveriasRef.current = showAverias
  const [loadingAverias, setLoadingAverias] = useState(false)
  const [evidencias, setEvidencias] = useState([])
  const [imageAuth, setImageAuth] = useState(null)
  const [viewer, setViewer] = useState(null)

  const handleView = async (tipo) => {
    const baseUrl = await loadApiUrl()
    const token = await getToken()
    const uri = `${baseUrl}/ingresos-equipo/${id}/evidencias/${tipo}/archivo`
    setViewer({ tipo, uri, headers: token ? { Authorization: `Bearer ${token}` } : {} })
  }

  const handleDownload = async (tipo) => {
    try {
      const baseUrl = await loadApiUrl()
      const token = await getToken()
      const uri = `${baseUrl}/ingresos-equipo/${id}/evidencias/${tipo}/archivo`
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const { dirs, writeFile } = ReactNativeBlobUtil.fs
      const fileName = `evidencia_${tipo}_${Date.now()}.jpg`

      // Descarga en memoria (base64). Evita el flujo FileStorage del nativo que
      // lanza "Download interrupted." cuando isDownloadComplete() falla.
      const res = await ReactNativeBlobUtil.fetch('GET', uri, headers)
      if (res.info().statusCode !== 200) {
        Alert.alert('Error', 'No se pudo descargar la foto. Código: ' + res.info().statusCode)
        return
      }
      const base64Data = await res.base64()

      // Android 10+ (API >= 29): MediaStore guarda en Galería sin permiso de almacenamiento.
      const androidVersion = Platform.OS === 'android' ? Number(Platform.Version) : 0
      if (Platform.OS === 'android' && androidVersion >= 29) {
        const cachePath = `${dirs.CacheDir}/${fileName}`
        await writeFile(cachePath, base64Data, 'base64')
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          { name: fileName, parentFolder: '', mimeType: 'image/jpeg' },
          'Image',
          cachePath,
        )
        Alert.alert('Foto guardada', 'La foto se guardó en la galería del dispositivo.')
        return
      }

      // Android 9 y anteriores: permiso de escritura explícito.
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          { title: 'Permiso de almacenamiento', message: 'Necesitamos acceso al almacenamiento para guardar la foto' },
        )
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'No se puede guardar la foto sin permiso de almacenamiento.')
          return
        }
      }
      const destPath = `${dirs.PictureDir || dirs.DownloadDir}/${fileName}`
      await writeFile(destPath, base64Data, 'base64')
      Alert.alert('Foto guardada', `Se guardó en: ${destPath}`)
    } catch (e) {
      Alert.alert('Error al descargar', e.message || 'Intente nuevamente')
    }
  }

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

  useFocusEffect(useCallback(() => { fetchEquipo() }, [fetchEquipo]))

  const loadAverias = useCallback(async () => {
    setLoadingAverias(true)
    try {
      const { data } = await api.get(`/averias/por-equipo/${id}`)
      const list = data?.data || data || []
      setAverias(Array.isArray(list) ? list : [])
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message || 'Error al cargar averías')
    } finally {
      setLoadingAverias(false)
    }
  }, [id])

  const toggleAverias = useCallback(() => {
    if (showAveriasRef.current) {
      setShowAverias(false)
      return
    }
    setShowAverias(true)
    loadAverias()
  }, [loadAverias])

  useFocusEffect(useCallback(() => {
    if (showAveriasRef.current) {
      loadAverias()
    }
  }, [loadAverias]))

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
            PSR / OSR
          </Text>
          <Divider style={styles.divider} />
          {equipo.psrOsr ? (
            <>
              <View style={styles.row}>
                <Text variant="bodySmall" style={styles.label}>PSR</Text>
                <Text variant="bodyMedium" style={styles.value}>{equipo.psrOsr.numeroPsr || '-'}</Text>
              </View>
              <View style={styles.row}>
                <Text variant="bodySmall" style={styles.label}>OSR</Text>
                <Text variant="bodyMedium" style={styles.value}>{equipo.psrOsr.numeroOsr || '-'}</Text>
              </View>
              <View style={styles.row}>
                <Text variant="bodySmall" style={styles.label}>Sede</Text>
                <Text variant="bodyMedium" style={styles.value}>{equipo.psrOsr.sedeNombre || '-'}</Text>
              </View>
              <View style={styles.row}>
                <Text variant="bodySmall" style={styles.label}>Campaña</Text>
                <Text variant="bodyMedium" style={styles.value}>{equipo.psrOsr.campanaNombre || '-'}</Text>
              </View>
            </>
          ) : (
            <Text variant="bodyMedium" style={styles.emptyText}>
              Sin PSR/OSR vinculada
            </Text>
          )}
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
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Horómetro Inicio</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {equipo.horometroInicio != null ? Number(equipo.horometroInicio).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>Horómetro Final</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {equipo.horometroFin != null ? Number(equipo.horometroFin).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
            </Text>
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
                <Pressable key={item.tipo} onPress={() => handleView(item.tipo)} style={styles.photoItem}>
                  <Image
                    style={styles.photo}
                    source={{
                      uri: `${imageAuth.baseUrl}/ingresos-equipo/${id}/evidencias/${item.tipo}/archivo`,
                      headers: { Authorization: `Bearer ${imageAuth.token}` },
                    }}
                    resizeMode="cover"
                  />
                  <Text style={styles.photoLabel}>{item.tipo.replaceAll('_', ' ')}</Text>
                </Pressable>
              ))}
            </View>
          </AppCard>
        ) : null}

        <View style={styles.actions}>
          {equipo.estadoOperativo === 'AVERIADO' ? (
            <AppButton
              variant="primary"
              icon="wrench"
              onPress={async () => {
                try {
                  const { data } = await api.get(`/averias/por-equipo/${equipo.id}`)
                  const list = data?.data || data || []
                  const pendiente = Array.isArray(list) ? list.find(a => a.estadoAveria === 'REPORTADA') : null
                  if (pendiente) {
                    navigation.navigate('AtenderAveria', { averiaId: pendiente.id })
                  } else {
                    Alert.alert('Sin averías pendientes', 'No hay averías pendientes para este equipo.')
                  }
                } catch (e) {
                  Alert.alert('Error', e.response?.data?.error || e.message || 'Error al buscar averías')
                }
              }}
              style={styles.actionButton}
              fullWidth
            >
              Registrar Reparación
            </AppButton>
          ) : equipo.estadoOperativo === 'DEVUELTO' ? (
            <View style={styles.devueltoInfo}>
              <Text variant="bodyMedium" style={styles.devueltoText}>
                Equipo devuelto y fuera de servicio. No se pueden registrar averías para este equipo.
              </Text>
            </View>
          ) : (
            <AppButton
              variant="primary"
              icon="alert"
              onPress={() => navigation.navigate('RegistrarAveria', { equipoId: equipo.id })}
              style={styles.actionButton}
              fullWidth
            >
              Registrar Avería
            </AppButton>
          )}
          <AppButton
            variant="secondary"
            icon="file-document"
            onPress={toggleAverias}
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
                      {formatAveriaDateTime(av.fechaHoraAveria)} — {formatAveriaDateTime(av.fechaHoraAtencion)}
                    </Text>
                    <StatusChip status={av.estadoAveria === 'ATENDIDA' ? 'approved' : av.estadoAveria === 'PENDIENTE' ? 'pending' : 'cancelled'} label={av.estadoAveria || 'PENDIENTE'} />
                  </View>
                  <Text variant="bodySmall" style={styles.averiaHorometro}>
                    Horómetro: {formatAveriaHorometro(av.horometro)} — {formatAveriaHorometro(av.horometroAtencion)}
                  </Text>
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
      {/*
       * Visor de imagen a pantalla completa (Modal).
       * - Barra superior: botón de retroceso + nombre del tipo de evidencia
       * - Centro: ZoomableImage con soporte pinza, arrastre y doble tap
       * - Barra inferior: botón para descargar la imagen al dispositivo
       */}
      <Modal visible={!!viewer} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setViewer(null)}>
        <StatusBar hidden />
        <View style={styles.viewerRoot}>
          <View style={[styles.viewerHeader, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => setViewer(null)} style={styles.viewerBack}>
              <Text style={{ fontSize: 28, color: '#fff' }}>{'‹'}</Text>
            </Pressable>
            <Text style={styles.viewerTitle}>{viewer?.tipo?.replaceAll('_', ' ') || ''}</Text>
            <View style={{ width: 44 }} />
          </View>
          <ZoomableImage uri={viewer?.uri} headers={viewer?.headers} />
          <View style={[styles.viewerFooter, { paddingBottom: insets.bottom + 8 }]}>
            <AppButton icon="download" onPress={() => viewer && handleDownload(viewer.tipo)} fullWidth>
              Descargar al dispositivo
            </AppButton>
          </View>
        </View>
      </Modal>
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
  devueltoInfo: {
    marginBottom: theme.spacing[2],
    padding: theme.spacing[3],
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.status.infoBackground,
  },
  devueltoText: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
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
  averiaHorometro: {
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  averiaDesc: {
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  // Visor a pantalla completa — fondo negro translúcido con barras semitransparentes
  viewerRoot: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  viewerHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewerBack: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  viewerTitle: { flex: 1, textAlign: 'center', fontSize: 16, color: '#fff' },
  viewerFooter: {
    paddingHorizontal: 16, paddingTop: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})
