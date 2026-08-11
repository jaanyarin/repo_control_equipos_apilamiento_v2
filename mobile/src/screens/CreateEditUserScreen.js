import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
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
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView'
import LoadingScreen from '../components/LoadingScreen'
import { theme } from '../theme'

const schema = z.object({
  nombre: z.string().trim().min(1, 'Ingrese el nombre'),
  rolId: z.string().optional(),
  ubicacion: z.string().optional(),
})

function extractList(response, catalogName) {
  const body = response?.data ?? response

  if (body && typeof body === 'object' && body.success === false) {
    throw new Error(body.message || `No se pudo cargar ${catalogName}`)
  }

  const list = body && typeof body === 'object' && 'data' in body ? body.data : body

  if (!Array.isArray(list)) {
    throw new Error(`La respuesta de ${catalogName} no contiene un listado válido`)
  }

  return list
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
  const isProtectedSuperAdmin = isEditing && editing.id === 1

  const [roles, setRoles] = useState([])
  const [sedes, setSedes] = useState([])
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
      rolId: isProtectedSuperAdmin ? '1' : (editing?.rolId != null ? String(editing.rolId) : ''),
      ubicacion: editing?.ubicacion || '',
    },
  })

  const loadCatalogs = useCallback(async (silent = false) => {
    if (!silent) {
      setCatalogLoading(true)
      setCatalogError('')
    }

    try {
      const [rolesResponse, sedesResponse] = await Promise.all([
        api.get('/roles'),
        api.get('/sedes'),
      ])

      const rolesList = extractList(rolesResponse, 'roles')
      const sedesList = extractList(sedesResponse, 'sedes')

      if (rolesList.length === 0) {
        throw new Error('No existen roles registrados')
      }

      setRoles(rolesList)
      setSedes(sedesList)
    } catch (error) {
      if (!silent) setCatalogError(getRequestError(error, 'No se pudieron cargar los catálogos'))
    } finally {
      if (!silent) setCatalogLoading(false)
    }
  }, [])

  const loadedRef = useRef(false)
  useFocusEffect(useCallback(() => {
    if (!loadedRef.current) {
      loadedRef.current = true
      loadCatalogs()
    } else {
      loadCatalogs(true)
    }
  }, [loadCatalogs]))

  const roleOptions = useMemo(() => {
    const filtered = roles.filter(
      item => item.estadoActivo !== false && !String(item.nombre || '').toLowerCase().includes('super admin'),
    ).map(item => ({
      value: String(item.id),
      label: item.nombre,
    }))

    if (isProtectedSuperAdmin) {
      return [{ value: '1', label: 'Super Admin' }, ...filtered]
    }
    return filtered
  }, [roles, isProtectedSuperAdmin])

  const sedeOptions = useMemo(
    () => sedes
      .filter(item => item.estadoActivo !== false)
      .map(item => ({
        value: item.nombre,
        label: item.codigo ? `${item.nombre} (${item.codigo})` : item.nombre,
      })),
    [sedes],
  )

  const onSubmit = async formData => {
    if (submitting) return
    setSubmitting(true)

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        rolId: isProtectedSuperAdmin ? 1 : (formData.rolId ? Number(formData.rolId) : null),
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
        title="No se pudieron cargar los catálogos"
        message={catalogError}
        onRetry={() => loadCatalogs()}
      />
    )
  }

  return (
    <ErrorBoundary>
      <KeyboardAwareScrollView
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
            name="rolId"
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <AppSelect
                  label="Rol"
                  placeholder="Seleccione un rol (opcional)"
                  value={value}
                  options={roleOptions}
                  onChange={onChange}
                  error={errors.rolId?.message}
                  disabled={isProtectedSuperAdmin}
                  onOpen={() => loadCatalogs(true)}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="ubicacion"
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <AppSelect
                  label="Ubicación"
                  placeholder="Seleccione la ubicación (opcional)"
                  value={value}
                  options={sedeOptions}
                  onChange={onChange}
                  error={errors.ubicacion?.message}
                  onOpen={() => loadCatalogs(true)}
                />
              </View>
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
      </KeyboardAwareScrollView>
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
