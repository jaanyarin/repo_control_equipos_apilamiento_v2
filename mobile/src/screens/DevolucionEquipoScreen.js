import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, Modal, PermissionsAndroid, Platform, Pressable, StatusBar, StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import { launchCamera } from 'react-native-image-picker'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ReactNativeBlobUtil from 'react-native-blob-util'
import api, { loadApiUrl, getToken } from '../api'
import AppButton from '../components/AppButton'
import AppCard from '../components/AppCard'
import ZoomableImage from '../components/ZoomableImage'
import ErrorState from '../components/ErrorState'
import LoadingScreen from '../components/LoadingScreen'
import { theme } from '../theme'

const DEVOLUCION_EVIDENCES = [
  ['DEVOLUCION_FRONTAL', 'Frontal'],
  ['DEVOLUCION_LATERAL_IZQUIERDO', 'Lateral izquierdo'],
  ['DEVOLUCION_LATERAL_DERECHO', 'Lateral derecho'],
  ['DEVOLUCION_POSTERIOR', 'Posterior'],
].map(([key, label]) => ({ key, label }))

export default function DevolucionEquipoScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const equipoId = route.params?.id
  const [equipment, setEquipment] = useState(null)
  const [evidence, setEvidence] = useState({})
  const [uploading, setUploading] = useState({})
  const [loading, setLoading] = useState(true)
  const [finishing, setFinishing] = useState(false)
  const [error, setError] = useState('')
  const [viewer, setViewer] = useState(null)

  const load = useCallback(async () => {
    try {
      setError('')
      const [equipmentResponse, evidenceResponse] = await Promise.all([
        api.get(`/equipos/${equipoId}`),
        api.get(`/devolucion-equipos/${equipoId}/evidencias`),
      ])
      setEquipment(equipmentResponse.data?.data || equipmentResponse.data)
      const list = evidenceResponse.data?.data || evidenceResponse.data || []
      setEvidence(Object.fromEntries(list.map(item => [item.tipo, item])))
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'No se pudo recuperar la devolución')
    } finally {
      setLoading(false)
    }
  }, [equipoId])

  useEffect(() => { load() }, [load])

  const missing = DEVOLUCION_EVIDENCES.filter(item => !evidence[item.key])

  const handleView = async (tipo) => {
    try {
      const baseUrl = await loadApiUrl()
      const token = await getToken()
      const uri = `${baseUrl}/devolucion-equipos/${equipoId}/evidencias/${tipo}/archivo`
      setViewer({ tipo, uri, headers: token ? { Authorization: `Bearer ${token}` } : {} })
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo abrir la fotografía')
    }
  }

  const handleDownload = async (tipo) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          { title: 'Permiso de almacenamiento', message: 'Necesitamos acceso al almacenamiento para guardar la foto' }
        )
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'No se puede guardar la foto sin permiso de almacenamiento.')
          return
        }
      }
      const baseUrl = await loadApiUrl()
      const token = await getToken()
      const uri = `${baseUrl}/devolucion-equipos/${equipoId}/evidencias/${tipo}/archivo`
      const { dirs } = ReactNativeBlobUtil.fs
      const destPath = `${dirs.PictureDir || dirs.DownloadDir}/devolucion_${tipo}_${Date.now()}.jpg`
      const res = await ReactNativeBlobUtil
        .config({
          path: destPath,
          addAndroidDownloads: { useDownloadManager: true, notification: true, path: destPath },
        })
        .fetch('GET', uri, token ? { Authorization: `Bearer ${token}` } : {})
      if (res.info().statusCode === 200) {
        Alert.alert('Foto guardada', `Se guardó en: ${destPath}`)
      } else {
        Alert.alert('Error', 'No se pudo descargar la foto. Código: ' + res.info().statusCode)
      }
    } catch (e) {
      Alert.alert('Error al descargar', e.message || 'Intente nuevamente')
    }
  }

  const takePhoto = async item => {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.7,
      maxWidth: 1600,
      maxHeight: 1600,
      saveToPhotos: false,
    })
    if (result.didCancel) return
    if (result.errorCode || !result.assets?.[0]) {
      Alert.alert('Cámara no disponible', result.errorMessage || 'No se pudo tomar la fotografía')
      return
    }
    const asset = result.assets[0]
    const form = new FormData()
    form.append('archivo', {
      uri: asset.uri,
      type: asset.type || 'image/jpeg',
      name: asset.fileName || `${item.key}.jpg`,
    })
    setUploading(current => ({ ...current, [item.key]: true }))
    try {
      const response = await api.put(
        `/devolucion-equipos/${equipoId}/evidencias/${item.key}`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 }
      )
      const saved = response.data?.data || response.data
      setEvidence(current => ({ ...current, [item.key]: saved }))
    } catch (e) {
      Alert.alert('No se guardó la foto', e.response?.data?.error || e.message || 'Intente nuevamente')
    } finally {
      setUploading(current => ({ ...current, [item.key]: false }))
    }
  }

  const finish = async () => {
    if (missing.length > 0) {
      Alert.alert('Fotografías pendientes', 'Complete todas las evidencias de devolución (*) antes de finalizar.')
      return
    }
    setFinishing(true)
    try {
      await api.post(`/devolucion-equipos/${equipoId}/finalizar`)
      Alert.alert(
        'Equipo devuelto',
        'El equipo fue marcado como DEVUELTO y la finalización del servicio quedó registrada.',
        [{ text: 'Aceptar', onPress: () => navigation.popTo('MainTabs') }]
      )
    } catch (e) {
      Alert.alert('No se pudo finalizar', e.response?.data?.error || e.message || 'Revise las evidencias')
    } finally {
      setFinishing(false)
    }
  }

  if (!equipoId) return <ErrorState title="Devolución no disponible" message="No se recibió el equipo en proceso." />
  if (loading) return <LoadingScreen message="Recuperando devolución" />
  if (error) return <ErrorState title="No se pudo abrir la devolución" message={error} onRetry={load} />

  return (
    <View style={styles.container}>
      <FlatList
        data={DEVOLUCION_EVIDENCES}
        keyExtractor={item => item.key}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={[styles.list, { paddingBottom: 142 + insets.bottom }]}
        ListHeaderComponent={(
          <AppCard style={styles.summary}>
            <Text style={styles.title}>{equipment?.codigo} · {equipment?.modelo}</Text>
            <Text style={styles.meta}>{equipment?.marcaNombre} · {equipment?.tipoEquipoNombre}</Text>
            <Text style={styles.help}>Tome las fotografías de devolución, tal como se recepcionó el equipo. Todas son obligatorias y se guardan inmediatamente.</Text>
          </AppCard>
        )}
        renderItem={({ item }) => {
          const saved = Boolean(evidence[item.key])
          return (
            <AppButton
              tone={saved ? 'secondary' : 'primary'}
              icon={uploading[item.key] ? 'progress-clock' : saved ? 'check-circle-outline' : 'camera'}
              onPress={() => saved ? handleView(item.key) : takePhoto(item)}
              loading={Boolean(uploading[item.key])}
              disabled={Object.values(uploading).some(Boolean) && !saved}
              style={styles.photoButton}
            >
              {item.label} *
            </AppButton>
          )
        }}
        ListFooterComponent={missing.length ? (
          <View style={styles.pending}>
            <Icon source="alert-circle-outline" size={20} color={theme.colors.status.warning} />
            <Text style={styles.pendingText}>{missing.length} fotografía(s) pendiente(s)</Text>
          </View>
        ) : null}
      />
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) }]}>
        <AppButton onPress={finish} loading={finishing} disabled={finishing || missing.length > 0} fullWidth>
          Finalizar y devolver equipo
        </AppButton>
      </View>
      <Modal visible={!!viewer} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setViewer(null)}>
        <StatusBar hidden />
        <View style={styles.viewerRoot}>
          <View style={[styles.viewerHeader, { paddingTop: insets.top + theme.spacing[1] }]}>
            <Pressable onPress={() => setViewer(null)} style={styles.viewerBack}>
              <Icon source="arrow-left" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.viewerTitle}>{viewer?.tipo || ''}</Text>
            <View style={{ width: 44 }} />
          </View>
          <ZoomableImage uri={viewer?.uri} headers={viewer?.headers} />
          <View style={[styles.viewerFooter, { paddingBottom: insets.bottom + theme.spacing[2] }]}>
            <AppButton icon="download" onPress={() => viewer && handleDownload(viewer.tipo)} fullWidth>
              Descargar al dispositivo
            </AppButton>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  list: { padding: theme.spacing[4] },
  summary: { marginBottom: theme.spacing[4] },
  title: { ...theme.typography.subtitle1, color: theme.colors.text.primary },
  meta: { ...theme.typography.body2, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  help: { ...theme.typography.caption, color: theme.colors.text.tertiary, marginTop: theme.spacing[3] },
  columns: { gap: theme.spacing[2] },
  photoButton: { flex: 1, marginBottom: theme.spacing[2] },
  pending: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2], marginTop: theme.spacing[3] },
  pendingText: { ...theme.typography.body2, color: theme.colors.status.warning },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[3],
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1, borderTopColor: theme.colors.border.subtle,
  },
  viewerRoot: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  viewerHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: theme.spacing[2],
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewerBack: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  viewerTitle: { flex: 1, textAlign: 'center', ...theme.typography.subtitle1, color: '#fff' },
  viewerFooter: {
    paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[2],
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})