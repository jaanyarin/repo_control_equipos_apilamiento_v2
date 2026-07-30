import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Alert, View, Image, Pressable, Modal, StatusBar } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { launchCamera } from 'react-native-image-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import api, { loadApiUrl, getToken } from '../api'
import LoadingScreen from '../components/LoadingScreen'
import ErrorBoundary from '../components/ErrorBoundary'
import AppCard from '../components/AppCard'
import AppTextArea from '../components/AppTextArea'
import AppButton from '../components/AppButton'
import ZoomableImage from '../components/ZoomableImage'
import StatusChip from '../components/StatusChip'
import { theme } from '../theme'

const schema = z.object({
  accionRealizada: z.string().min(10, 'La acción debe tener al menos 10 caracteres'),
})

const FOTO_LABELS = { 1: 'Foto 1', 2: 'Foto 2', 3: 'Foto 3' }

export default function AtenderAveriaScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { averiaId } = route.params
  const [averia, setAveria] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [evidencias, setEvidencias] = useState({})
  const [uploading, setUploading] = useState({})
  const [imageAuth, setImageAuth] = useState(null)
  const [viewer, setViewer] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [averiaRes, evRes, baseUrl, token] = await Promise.all([
          api.get(`/averias/${averiaId}`),
          api.get(`/averias/${averiaId}/evidencias`),
          loadApiUrl(),
          getToken(),
        ])
        setAveria(averiaRes.data?.data || averiaRes.data)
        const list = evRes.data?.data || evRes.data || []
        setEvidencias(Object.fromEntries(list.map(item => [item.numeroFoto, item])))
        setImageAuth({ baseUrl, token })
      } catch (e) {
        Alert.alert('Error', e.response?.data?.error || e.message || 'Error al cargar avería')
      } finally {
        setLoading(false)
      }
    })()
  }, [averiaId])

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { accionRealizada: '' },
  })

  const onSubmit = async (formData) => {
    setSubmitting(true)
    try {
      await api.put(`/averias/${averiaId}`, {
        estadoAveria: 'ATENDIDA',
        accionRealizada: formData.accionRealizada,
      })
      Alert.alert('Éxito', 'Avería atendida correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message || 'Error al atender avería')
    } finally {
      setSubmitting(false)
    }
  }

  const takePhoto = async (numero) => {
    const result = await launchCamera({
      mediaType: 'photo', cameraType: 'back',
      quality: 0.7, maxWidth: 1600, maxHeight: 1600,
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
      name: asset.fileName || `foto_${numero}.jpg`,
    })
    setUploading(current => ({ ...current, [numero]: true }))
    try {
      const res = await api.put(`/averias/${averiaId}/evidencias/${numero}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })
      const saved = res.data?.data || res.data
      setEvidencias(current => ({ ...current, [numero]: saved }))
    } catch (e) {
      Alert.alert('No se guardó la foto', e.response?.data?.error || e.message || 'Intente nuevamente')
    } finally {
      setUploading(current => ({ ...current, [numero]: false }))
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {averia ? (
          <AppCard style={styles.infoCard} accessibilityLabel="Información de la avería">
            <Text variant="titleMedium" style={styles.sectionTitle}>Información de la Avería</Text>
            <Divider style={styles.divider} />
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.label}>Descripción</Text>
              <Text variant="bodyMedium" style={styles.value}>{averia.descripcionFalla || '-'}</Text>
            </View>
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.label}>Fecha</Text>
              <Text variant="bodyMedium" style={styles.value}>{averia.fechaHoraAveria ? new Date(averia.fechaHoraAveria).toLocaleString() : '-'}</Text>
            </View>
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.label}>Estado</Text>
              <StatusChip status={averia.estadoAveria === 'ATENDIDA' ? 'approved' : 'pending'} label={averia.estadoAveria || 'PENDIENTE'} />
            </View>
          </AppCard>
        ) : null}

        {averia && averia.estadoAveria !== 'ATENDIDA' && (
          <AppCard style={styles.photoCard}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Evidencias Fotográficas</Text>
            <Divider style={styles.divider} />
            <Text style={styles.hint}>Tome hasta 3 fotografías de la avería atendida.</Text>
            <View style={styles.photoGrid}>
              {[1, 2, 3].map(num => {
                const ev = evidencias[num]
                const uri = ev && imageAuth
                  ? `${imageAuth.baseUrl}/averias/${averiaId}/evidencias/${num}/archivo`
                  : null
                return (
                  <View key={num} style={styles.photoSlot}>
                    {uri ? (
                      <Pressable onPress={() => setViewer({
                        tipo: FOTO_LABELS[num], uri,
                        headers: imageAuth?.token ? { Authorization: `Bearer ${imageAuth.token}` } : {},
                      })}>
                        <Image source={{ uri, headers: imageAuth?.token ? { Authorization: `Bearer ${imageAuth.token}` } : {} }} style={styles.photoThumb} resizeMode="cover" />
                      </Pressable>
                    ) : (
                      <View style={styles.photoPlaceholder}>
                        <Text style={styles.photoPlaceholderText}>{FOTO_LABELS[num]}</Text>
                      </View>
                    )}
                    <AppButton
                      variant={ev ? 'secondary' : 'primary'}
                      icon={uploading[num] ? 'progress-clock' : 'camera'}
                      onPress={() => takePhoto(num)}
                      loading={Boolean(uploading[num])}
                      disabled={Object.values(uploading).some(Boolean)}
                      fullWidth
                      style={styles.photoBtn}
                    >
                      {ev ? 'Retomar' : 'Tomar foto'}
                    </AppButton>
                  </View>
                )
              })}
            </View>
          </AppCard>
        )}

        <AppCard style={styles.formCard} accessibilityLabel="Formulario para atender avería">
          <Text variant="titleMedium" style={styles.sectionTitle}>Atender Avería</Text>
          <Divider style={styles.divider} />
          <Controller
            control={control}
            name="accionRealizada"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextArea
                label="Acción realizada"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errorMessage={errors.accionRealizada?.message}
                style={styles.input}
              />
            )}
          />
          {averia?.estadoAveria !== 'ATENDIDA' && (
            <AppButton variant="primary" onPress={handleSubmit(onSubmit)} disabled={submitting} loading={submitting} style={styles.button} fullWidth>
              Marcar como Atendida
            </AppButton>
          )}
        </AppCard>
      </ScrollView>

      <Modal visible={!!viewer} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setViewer(null)}>
        <StatusBar hidden />
        <View style={styles.viewerRoot}>
          <View style={[styles.viewerHeader, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => setViewer(null)} style={styles.viewerBack}>
              <Text style={{ fontSize: 28, color: '#fff' }}>{'‹'}</Text>
            </Pressable>
            <Text style={styles.viewerTitle}>{viewer?.tipo || ''}</Text>
            <View style={{ width: 44 }} />
          </View>
          <ZoomableImage uri={viewer?.uri} headers={viewer?.headers} />
        </View>
      </Modal>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  content: { padding: theme.spacing[4], paddingBottom: theme.spacing[8] },
  infoCard: { marginBottom: theme.spacing[3] },
  photoCard: { padding: theme.spacing[4], marginBottom: theme.spacing[3] },
  formCard: { padding: theme.spacing[6] },
  sectionTitle: { ...theme.typography.subtitle, color: theme.colors.text.primary, marginBottom: theme.spacing[2] },
  divider: { marginBottom: theme.spacing[3], backgroundColor: theme.colors.border.subtle },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: theme.spacing[2] },
  label: { ...theme.typography.caption, color: theme.colors.text.secondary, flex: 1 },
  value: { ...theme.typography.body, fontFamily: theme.fontFamily.semiBold, color: theme.colors.text.primary, flex: 2, textAlign: 'right' },
  input: { marginBottom: theme.spacing[3] },
  button: { marginTop: theme.spacing[2] },
  hint: { ...theme.typography.caption, color: theme.colors.text.tertiary, marginBottom: theme.spacing[3] },
  photoGrid: { gap: theme.spacing[3] },
  photoSlot: { alignItems: 'center' },
  photoThumb: { width: '100%', height: 160, borderRadius: theme.radius.sm, marginBottom: theme.spacing[1] },
  photoPlaceholder: {
    width: '100%', height: 160, borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background.page,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: theme.colors.border.subtle, borderStyle: 'dashed',
    marginBottom: theme.spacing[1],
  },
  photoPlaceholderText: { ...theme.typography.body2, color: theme.colors.text.tertiary },
  photoBtn: { marginTop: 0 },
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
