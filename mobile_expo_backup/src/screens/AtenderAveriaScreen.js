import React, { useState, useEffect } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { Text, TextInput, Button, Surface, Chip, ActivityIndicator, Divider } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import ErrorBoundary from '../components/ErrorBoundary'

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

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get(`/averias/${averiaId}`)
        setAveria(data?.data || data)
      } catch (e) {
        Alert.alert('Error', e.response?.data?.error || e.message || 'Error al cargar avería')
      } finally {
        setLoading(false)
      }
    })()
  }, [averiaId])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      accionRealizada: '',
    },
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

  if (loading) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {averia ? (
          <Surface style={styles.infoCard}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Información de la Avería
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.label}>Descripción</Text>
              <Text variant="bodyMedium" style={styles.value}>{averia.descripcionFalla || '-'}</Text>
            </View>
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.label}>Fecha</Text>
              <Text variant="bodyMedium" style={styles.value}>
                {averia.fechaHoraAveria ? new Date(averia.fechaHoraAveria).toLocaleString() : '-'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.label}>Estado</Text>
              <Chip
                mode="flat"
                textStyle={{ color: '#fff', fontSize: 12, fontWeight: 600 }}
                style={{
                  backgroundColor:
                    averia.estadoAveria === 'ATENDIDA' ? '#2e7d32' : averia.estadoAveria === 'PENDIENTE' ? '#e65100' : '#888',
                }}
              >
                {averia.estadoAveria || 'PENDIENTE'}
              </Chip>
            </View>
          </Surface>
        ) : null}

        <Surface style={styles.formCard}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Atender Avería
          </Text>
          <Divider style={styles.divider} />

          <Controller
            control={control}
            name="accionRealizada"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Acción realizada"
                mode="outlined"
                multiline
                numberOfLines={4}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.accionRealizada}
                style={styles.input}
              />
            )}
          />
          {errors.accionRealizada && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.accionRealizada.message}
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
              'Marcar como Atendida'
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
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  formCard: {
    padding: 24,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  label: {
    opacity: 0.6,
    flex: 1,
  },
  value: {
    fontWeight: 600,
    flex: 2,
    textAlign: 'right',
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
