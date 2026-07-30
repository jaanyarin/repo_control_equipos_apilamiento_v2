import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Alert, View, Image } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { launchCamera } from 'react-native-image-picker'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import ErrorBoundary from '../components/ErrorBoundary'
import AppCard from '../components/AppCard'
import AppTextArea from '../components/AppTextArea'
import AppButton from '../components/AppButton'
import StatusChip from '../components/StatusChip'
import { theme } from '../theme'

const schema = z.object({
  accionRealizada: z.string().min(10, 'La acción debe tener al menos 10 caracteres'),
})

export default function AtenderAveriaScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { averiaId } = route.params
  const [averia, setAveria] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [localPhotoUri, setLocalPhotoUri] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get(`/averias/${averiaId}`)
        setAveria(res.data?.data || res.data)
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
      if (localPhotoUri) {
        const form = new FormData()
        form.append('archivo', {
          uri: localPhotoUri,
          type: 'image/jpeg',
          name: `foto_1_${Date.now()}.jpg`,
        })
        await api.put(`/averias/${averiaId}/evidencias/1`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        })
      }
      await api.put(`/averias/${averiaId}`, {
        equipoId: averia.equipoId,
        descripcionFalla: averia.descripcionFalla,
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

  const takePhoto = async () => {
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
    setLocalPhotoUri(asset.uri)
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
            <Text variant="titleMedium" style={styles.sectionTitle}>Evidencia Fotográfica</Text>
            <Divider style={styles.divider} />
            <Text style={styles.hint}>Tome 1 fotografía como evidencia del servicio realizado.</Text>
            <View style={styles.photoSlot}>
              {localPhotoUri ? (
                <Image source={{ uri: localPhotoUri }} style={styles.photoThumb} resizeMode="cover" />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>Evidencia</Text>
                </View>
              )}
              <AppButton
                variant={localPhotoUri ? 'secondary' : 'primary'}
                icon={'camera'}
                onPress={takePhoto}
                disabled={false}
                fullWidth
                style={styles.photoBtn}
              >
                {localPhotoUri ? 'Cambiar foto' : 'Tomar foto'}
              </AppButton>
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
              Finalizar Servicio
            </AppButton>
          )}
        </AppCard>
      </ScrollView>
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
