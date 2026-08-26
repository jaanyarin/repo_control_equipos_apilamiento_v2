import React, { useState } from 'react'
import { StyleSheet, Alert, View, Image } from 'react-native'
import { Text } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { launchCamera } from 'react-native-image-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import api from '../api'
import ErrorBoundary from '../components/ErrorBoundary'
import AppCard from '../components/AppCard'
import AppTextArea from '../components/AppTextArea'
import AppInput from '../components/AppInput'
import AppButton from '../components/AppButton'
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView'
import { theme } from '../theme'
import { formatDateTime, parseToISO } from '../utils/dateTime'

const schema = z.object({
  horometro: z.string().regex(/^\d{1,6}\.\d$/, 'Formato: hasta 6 enteros y 1 decimal (ej. 1234.5)'),
  descripcionFalla: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  fechaHoraAveria: z.string().min(1, 'La fecha es requerida'),
})

const PHOTO_SLOTS = [
  { numero: 3, label: 'Horómetro', required: true },
  { numero: 1, label: 'Foto 1', required: true },
  { numero: 2, label: 'Foto 2', required: false },
]

const photoLabel = ({ label, required }) => (required ? `* ${label}` : label)

export default function RegistrarAveriaScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { equipoId } = route.params
  const [submitting, setSubmitting] = useState(false)
  const [averiaId, setAveriaId] = useState(null)
  const [uploading, setUploading] = useState({})
  const [evidencias, setEvidencias] = useState({})
  const currentDate = formatDateTime(new Date())

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { horometro: '', descripcionFalla: '', fechaHoraAveria: currentDate },
  })

  const onSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const res = await api.post('/averias', {
        equipoId,
        horometro: formData.horometro ? Number(formData.horometro) : null,
        descripcionFalla: formData.descripcionFalla,
        fechaHoraAveria: parseToISO(formData.fechaHoraAveria),
      })
      const created = res.data?.data || res.data
      setAveriaId(created.id || created)
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message || 'Error al registrar avería')
    } finally {
      setSubmitting(false)
    }
  }

  const takePhoto = async (numero) => {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.7,
      maxWidth: 1600, maxHeight: 1600,
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
      setEvidencias(current => ({ ...current, [numero]: { uri: asset.uri } }))
    } catch (e) {
      Alert.alert('No se guardó la foto', e.response?.data?.error || e.message || 'Intente nuevamente')
    } finally {
      setUploading(current => ({ ...current, [numero]: false }))
    }
  }

  const allPhotosDone = PHOTO_SLOTS.every(slot => !slot.required || evidencias[slot.numero])

  if (!averiaId) {
    return (
      <ErrorBoundary>
        <KeyboardAwareScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: theme.spacing[8] + insets.bottom }]} keyboardShouldPersistTaps="handled">
          <AppCard style={styles.formCard} accessibilityLabel="Formulario para registrar avería">
            <Text variant="titleMedium" style={styles.title}>Registrar Avería</Text>

            <Controller
              control={control}
              name="horometro"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Horómetro *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={v => onChange(v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
                  errorMessage={errors.horometro?.message}
                  keyboardType="numeric"
                  placeholder="Ej: 1234.5"
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="descripcionFalla"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextArea
                  label="Descripción de la falla"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  errorMessage={errors.descripcionFalla?.message}
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="fechaHoraAveria"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Fecha y hora de la avería"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  errorMessage={errors.fechaHoraAveria?.message}
                  style={styles.input}
                />
              )}
            />

            <AppButton variant="primary" onPress={handleSubmit(onSubmit)} disabled={submitting} loading={submitting} style={styles.button} fullWidth>
              Registrar Avería
            </AppButton>
          </AppCard>
        </KeyboardAwareScrollView>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <KeyboardAwareScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: theme.spacing[8] + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <AppCard style={styles.formCard}>
          <Text variant="titleMedium" style={styles.title}>Fotografías de la Avería</Text>
          <Text style={styles.hint}>Tome la foto del horómetro y 2 fotografías de la falla. El horómetro y la Foto 1 son obligatorios; la Foto 2 es opcional. Se guardan automáticamente.</Text>
          <View style={styles.photoGrid}>
            {PHOTO_SLOTS.map(({ numero, label, required }) => (
              <View key={numero} style={styles.photoSlot}>
                {evidencias[numero] ? (
                  <Image source={{ uri: evidencias[numero].uri }} style={styles.photoThumb} resizeMode="cover" />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderText}>{photoLabel({ label, required })}</Text>
                  </View>
                )}
                <AppButton
                  mode="contained"
                  tone={evidencias[numero] ? undefined : 'primary'}
                  icon={uploading[numero] ? 'progress-clock' : 'camera'}
                  onPress={() => takePhoto(numero)}
                  loading={Boolean(uploading[numero])}
                  disabled={Object.values(uploading).some(Boolean)}
                  fullWidth
                  style={styles.photoBtn}
                >
                  {evidencias[numero] ? 'Retomar' : 'Tomar foto'}
                </AppButton>
              </View>
            ))}
          </View>
          <AppButton variant="primary" onPress={async () => {
            try {
              await api.put(`/averias/${averiaId}/confirmar`)
            } catch (_) {}
            navigation.goBack()
          }} fullWidth style={styles.button} disabled={!allPhotosDone}>
            {allPhotosDone ? 'Finalizar' : 'Tome la foto del horómetro y la Foto 1 para finalizar'}
          </AppButton>
        </AppCard>
      </KeyboardAwareScrollView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  content: { padding: theme.spacing[4] },
  formCard: { padding: theme.spacing[6] },
  title: { ...theme.typography.title, color: theme.colors.text.primary, marginBottom: theme.spacing[2] },
  hint: { ...theme.typography.caption, color: theme.colors.text.tertiary, marginBottom: theme.spacing[4] },
  input: { marginBottom: theme.spacing[3] },
  button: { marginTop: theme.spacing[2] },
  photoGrid: { gap: theme.spacing[3], marginBottom: theme.spacing[4] },
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
})
