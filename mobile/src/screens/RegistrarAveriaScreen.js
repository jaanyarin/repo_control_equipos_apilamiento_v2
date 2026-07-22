import React, { useState } from 'react'
import { ScrollView, StyleSheet, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

export default function RegistrarAveriaScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { equipoId } = route.params
  const [submitting, setSubmitting] = useState(false)
  const currentDate = new Date().toISOString().slice(0, 16)

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { descripcionFalla: '', fechaHoraAveria: currentDate },
  })

  const onSubmit = async (formData) => {
    setSubmitting(true)
    try {
      await api.post('/averias', {
        equipoId,
        descripcionFalla: formData.descripcionFalla,
        fechaHoraAveria: formData.fechaHoraAveria,
      })
      Alert.alert('Éxito', 'Avería registrada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message || 'Error al registrar avería')
    } finally {
      setSubmitting(false)
    }
  }

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  content: { padding: theme.spacing[4], paddingBottom: theme.spacing[8] },
  formCard: { padding: theme.spacing[6] },
  title: { ...theme.typography.title, color: theme.colors.text.primary, marginBottom: theme.spacing[5] },
  input: { marginBottom: theme.spacing[3] },
  button: { marginTop: theme.spacing[2] },
})
