import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../api'
import AppButton from '../components/AppButton'
import AppCard from '../components/AppCard'
import AppInput from '../components/AppInput'
import AppSelect from '../components/AppSelect'
import ErrorBoundary from '../components/ErrorBoundary'
import ErrorState from '../components/ErrorState'
import LoadingScreen from '../components/LoadingScreen'
import { theme } from '../theme'

const schema = z.object({
  nombre: z.string().trim().min(1, 'Ingrese el nombre'),
  correo: z.string().trim().min(1, 'Ingrese el correo').email('Correo inválido'),
  rolId: z.string().min(1, 'Seleccione un rol'),
  area: z.string().optional(),
  puesto: z.string().optional(),
  empresa: z.string().optional(),
  departamento: z.string().optional(),
  ubicacion: z.string().optional(),
})

function extractRolesList(response) {
  const body = response?.data ?? response
  const list = body && typeof body === 'object' && 'data' in body ? body.data : body
  return Array.isArray(list) ? list : []
}

function getRequestError(error, fallback) {
  return error.response?.data?.message
    || error.response?.data?.error
    || error.message
    || fallback
}

export default function CreateEditUserScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const editing = route.params?.user || null
  const isEditing = Boolean(editing)

  const [roles, setRoles] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: editing?.nombre || '',
      correo: editing?.correo || '',
      rolId: editing?.rolId != null ? String(editing.rolId) : '',
      area: editing?.area || '',
      puesto: editing?.puesto || '',
      empresa: editing?.empresa || '',
      departamento: editing?.departamento || '',
      ubicacion: editing?.ubicacion || '',
    },
  })

  const loadRoles = useCallback(async () => {
    setCatalogLoading(true)
    setCatalogError('')
    try {
      const response = await api.get('/roles')
      const list = extractRolesList(response)
      if (list.length === 0) {
        throw new Error('No existen roles registrados')
      }
      setRoles(list)
    } catch (error) {
      setCatalogError(getRequestError(error, 'No se pudieron cargar los roles'))
    } finally {
      setCatalogLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  const roleOptions = useMemo(
    () => roles
      .filter(item => item.estadoActivo !== false && !String(item.nombre || '').toLowerCase().includes('super admin'))
      .map(item => ({
        value: String(item.id),
        label: item.nombre,
      })),
    [roles],
  )

  const onSubmit = async formData => {
    if (submitting) return
    setSubmitting(true)

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        rolId: Number(formData.rolId),
        area: formData.area?.trim() || null,
        puesto: formData.puesto?.trim() || null,
        empresa: formData.empresa?.trim() || null,
        departamento: formData.departamento?.trim() || null,
        ubicacion: formData.ubicacion?.trim() || null,
      }

      if (isEditing) {
        await api.put(`/usuarios/${editing.id}`, payload)
      } else {
        await api.post('/usuarios', payload)
      }

      if (typeof navigation.popTo === 'function') {
        navigation.popTo('Usuarios')
      } else {
        navigation.navigate('Usuarios')
      }
      Alert.alert('Éxito', `Usuario ${isEditing ? 'actualizado' : 'creado'} correctamente`)
    } catch (error) {
      Alert.alert(
        'Error',
        getRequestError(error, `No se pudo ${isEditing ? 'actualizar' : 'crear'} el usuario`),
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (catalogLoading) {
    return <LoadingScreen message="Cargando catálogos..." />
  }

  if (catalogError) {
    return (
      <ErrorState
        title="No se pudieron cargar los roles"
        message={catalogError}
        onRetry={loadRoles}
      />
    )
  }

  return (
    <ErrorBoundary>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <AppCard style={styles.formCard}>
          <Controller
            control={control}
            name="nombre"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                label="Nombre"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errorMessage={errors.nombre?.message}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="correo"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                label="Correo"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errorMessage={errors.correo?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="rolId"
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <AppSelect
                  label="Rol"
                  value={value}
                  options={roleOptions}
                  onChange={onChange}
                  error={errors.rolId?.message}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="area"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                label="Área"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errorMessage={errors.area?.message}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="puesto"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                label="Puesto"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errorMessage={errors.puesto?.message}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="empresa"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                label="Empresa"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errorMessage={errors.empresa?.message}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="departamento"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                label="Departamento"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errorMessage={errors.departamento?.message}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="ubicacion"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                label="Ubicación"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errorMessage={errors.ubicacion?.message}
                style={styles.input}
              />
            )}
          />

          <AppButton
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
            loading={submitting}
            style={styles.button}
            fullWidth
          >
            {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
          </AppButton>
        </AppCard>
      </ScrollView>
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
  formCard: {
    padding: theme.spacing[6],
  },
  input: {
    marginBottom: theme.spacing[3],
  },
  button: {
    marginTop: theme.spacing[2],
  },
})
