import React, { useState } from 'react'
import { ScrollView, StyleSheet, Alert, View, Image, Pressable } from 'react-native'
import { Text } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { launchCamera } from 'react-native-image-picker'
import api from '../api'
import ErrorBoundary from '../components/ErrorBoundary'
import AppCard from '../components/AppCard'
import AppTextArea from '../components/AppTextArea'
import AppInput from '../components/AppInput'
import AppButton from '../components/AppButton'
import { theme } from '../theme'

const schema = z.object({
  descripcionFalla: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  fechaHoraAveria: z.string().min(1, 'La fecha es requerida'),
})

const FOTO_LABELS = { 1: 'Foto 1', 2: 'Foto 2', 3: 'Foto 3' }

export default function RegistrarAveriaScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { equipoId } = route.params
  const [submitting, setSubmitting] = useState(false)
  const [averiaId, setAveriaId] = useState(null)
  const [uploading, setUploading] = useState({})
  const [evidencias, setEvidencias] = useState({})
  const currentDate = new Date().toISOString().slice(0, 16)

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { descripcionFalla: '', fechaHoraAveria: currentDate },
  })

  const onSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const res = await api.post('/averias', {
        equipoId,
        descripcionFalla: formData.descripcionFalla,
        fechaHoraAveria: formData.fechaHoraAveria,
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
      const saved = res.data?.data || res.data
      setEvidencias(current => ({ ...current, [numero]: saved }))
    } catch (e) {
      Alert.alert('No se guardó la foto', e.response?.data?.error || e.message || 'Intente nuevamente')
    } finally {
      setUploading(current => ({ ...current, [numero]: false }))
    }
  }

  if (!averiaId) {
    return (
      <ErrorBoundary>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppCard style={styles.formCard} accessibilityLabel="Formulario para registrar avería">
            <Text variant="titleMedium" style={styles.title}>Registrar Avería</Text>

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
        </ScrollView>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppCard style={styles.formCard}>
          <Text variant="titleMedium" style={styles.title}>Fotografías de la Avería</Text>
          <Text style={styles.hint}>Tome hasta 3 fotografías como evidencia de la falla.</Text>
          <View style={styles.photoGrid}>
            {[1, 2, 3].map(num => (
              <View key={num} style={styles.photoSlot}>
                {evidencias[num] ? (
                  <Image source={{ uri: evidencias[num].uri }} style={styles.photoThumb} resizeMode="cover" />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderText}>{FOTO_LABELS[num]}</Text>
                  </View>
                )}
                <AppButton
                  variant={evidencias[num] ? 'secondary' : 'primary'}
                  tone={evidencias[num] ? 'secondary' : undefined}
                  icon={uploading[num] ? 'progress-clock' : evidencias[num] ? 'camera' : 'camera'}
                  onPress={() => takePhoto(num)}
                  loading={Boolean(uploading[num])}
                  disabled={Object.values(uploading).some(Boolean)}
                  fullWidth
                  style={styles.photoBtn}
                >
                  {evidencias[num] ? 'Retomar' : 'Tomar foto'}
                </AppButton>
              </View>
            ))}
          </View>
          <AppButton variant="primary" onPress={() => navigation.goBack()} fullWidth style={styles.button}>
            Finalizar
          </AppButton>
        </AppCard>
      </ScrollView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  content: { padding: theme.spacing[4], paddingBottom: theme.spacing[8] },
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
