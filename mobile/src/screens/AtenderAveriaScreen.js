import React, { useState, useEffect } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
              <StatusChip status={averia.estadoAveria === 'ATENDIDA' ? 'approved' : averia.estadoAveria === 'PENDIENTE' ? 'pending' : 'cancelled'} label={averia.estadoAveria || 'PENDIENTE'} />
            </View>
          </AppCard>
        ) : null}

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
          <AppButton variant="primary" onPress={handleSubmit(onSubmit)} disabled={submitting} loading={submitting} style={styles.button} fullWidth>
            Marcar como Atendida
          </AppButton>
        </AppCard>
      </ScrollView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  content: { padding: theme.spacing[4], paddingBottom: theme.spacing[8] },
  infoCard: { marginBottom: theme.spacing[3] },
  formCard: { padding: theme.spacing[6] },
  sectionTitle: { ...theme.typography.subtitle, color: theme.colors.text.primary, marginBottom: theme.spacing[2] },
  divider: { marginBottom: theme.spacing[3], backgroundColor: theme.colors.border.subtle },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: theme.spacing[2] },
  label: { ...theme.typography.caption, color: theme.colors.text.secondary, flex: 1 },
  value: { ...theme.typography.body, fontFamily: theme.fontFamily.semiBold, color: theme.colors.text.primary, flex: 2, textAlign: 'right' },
  input: { marginBottom: theme.spacing[3] },
  button: { marginTop: theme.spacing[2] },
})
