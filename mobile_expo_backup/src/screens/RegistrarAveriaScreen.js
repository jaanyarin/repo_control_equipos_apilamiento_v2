import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { Text, TextInput, Button, Surface, ActivityIndicator } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../api'
import ErrorBoundary from '../components/ErrorBoundary'

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      descripcionFalla: '',
      fechaHoraAveria: currentDate,
    },
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
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Surface style={styles.formCard}>
          <Text variant="titleMedium" style={styles.title}>
            Registrar Avería
          </Text>

          <Controller
            control={control}
            name="descripcionFalla"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Descripción de la falla"
                mode="outlined"
                multiline
                numberOfLines={4}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.descripcionFalla}
                style={styles.input}
              />
            )}
          />
          {errors.descripcionFalla && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.descripcionFalla.message}
            </Text>
          )}

          <Controller
            control={control}
            name="fechaHoraAveria"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Fecha y hora de la avería"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.fechaHoraAveria}
                style={styles.input}
              />
            )}
          />
          {errors.fechaHoraAveria && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.fechaHoraAveria.message}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
            style={styles.button}
            contentStyle={{ height: 48 }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              'Registrar Avería'
            )}
          </Button>
        </Surface>
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
  },
  formCard: {
    padding: 24,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontWeight: 700,
    marginBottom: 20,
  },
  input: {
    marginBottom: 4,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
})
