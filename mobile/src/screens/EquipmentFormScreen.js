import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Divider, Text, TouchableRipple } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '../api'
import AppButton from '../components/AppButton'
import AppCard from '../components/AppCard'
import AppCheckboxField from '../components/AppCheckboxField'
import AppInput from '../components/AppInput'
import AppSelect from '../components/AppSelect'
import AppTextArea from '../components/AppTextArea'
import ErrorState from '../components/ErrorState'
import LoadingScreen from '../components/LoadingScreen'
import { theme } from '../theme'
import { accessoryFields, equipmentDefaults, equipmentSchema, toEquipmentPayload } from '../utils/equipmentForm'
import { formatApiDate, formatDisplayDate, parseApiDate } from '../utils/psrForm'

function DateField({ value, onChange, error, disabled }) {
  const [visible, setVisible] = useState(false)
  return (
    <View>
      <TouchableRipple
        onPress={disabled ? undefined : () => setVisible(true)}
        disabled={disabled}
        accessibilityLabel="Seleccionar fecha de ingreso"
      >
        <View pointerEvents="none">
          <AppInput label="Fecha de ingreso *" value={formatDisplayDate(value)} editable={false} errorMessage={error} />
        </View>
      </TouchableRipple>
      {visible ? (
        <DateTimePicker
          value={parseApiDate(value)}
          mode="datetime"
          display={Platform.OS === 'android' ? 'default' : 'spinner'}
          maximumDate={new Date()}
          onChange={(event, date) => {
            setVisible(false)
            if (event.type !== 'dismissed' && date) onChange(formatApiDate(date))
          }}
        />
      ) : null}
    </View>
  )
}

function catalogOptions(items, label) {
  return items
    .filter(item => item.estadoActivo !== false)
    .map(item => ({ value: String(item.id), label: label(item) }))
}

export default function EquipmentFormScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const psr = route.params?.psr
  const editing = route.params?.equipo
  const isEdit = route.params?.mode === 'edit'
  const [catalogs, setCatalogs] = useState({ providers: [], brands: [], types: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const defaults = useMemo(() => editing ? {
    ...equipmentDefaults,
    ...editing,
    proveedorId: String(editing.proveedorId || ''),
    marcaId: String(editing.marcaId || ''),
    tipoEquipoId: String(editing.tipoEquipoId || ''),
    horometroInicio: editing.horometroInicio != null ? String(editing.horometroInicio) : '',
  } : equipmentDefaults, [editing])

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: defaults,
  })

  const values = watch()

  const loadCatalogs = useCallback(async (silent = false) => {
    try {
      if (!silent) setError('')
      const [providers, brands, types] = await Promise.all([
        api.get('/proveedores'),
        api.get('/marcas'),
        api.get('/tipos-equipo'),
      ])
      setCatalogs({
        providers: providers.data?.data || providers.data || [],
        brands: brands.data?.data || brands.data || [],
        types: types.data?.data || types.data || [],
      })
    } catch (e) {
      if (!silent) setError(e.response?.data?.error || e.message || 'No se pudieron cargar los catálogos')
    } finally {
      if (!silent) setLoading(false)
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

  const submit = async data => {
    if (saving) return
    setSaving(true)
    try {
      const payload = toEquipmentPayload(data)
      if (isEdit) {
        await api.put(`/equipos/${editing.id}`, payload)
        Alert.alert('Éxito', 'Equipo actualizado correctamente', [
          { text: 'Aceptar', onPress: () => navigation.goBack() },
        ])
      } else {
        const response = await api.post('/ingresos-equipo/borradores', {
          psrId: psr.psrId,
          equipo: payload,
        })
        const created = response.data?.data || response.data
        navigation.replace('EquipmentPhotos', {
          equipoId: created.id,
          psr,
        })
      }
    } catch (e) {
      Alert.alert('No se pudo guardar', e.response?.data?.error || e.message || 'Error al guardar el equipo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingScreen message="Cargando catálogos" />
  if (error) return <ErrorState title="Catálogos no disponibles" message={error} onRetry={() => loadCatalogs()} />
  if (!isEdit && !psr) return <ErrorState title="PSR no disponible" message="Seleccione una PSR antes de registrar el equipo." />

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: theme.spacing[8] }]}
        keyboardShouldPersistTaps="handled"
      >
        {!isEdit ? (
          <AppCard style={styles.summary}>
            <Text style={styles.title}>{psr.numeroPsr} · {psr.numeroOsr}</Text>
            <Text style={styles.meta}>{psr.motivo || 'Sin descripción'} · {psr.meses ?? '-'} meses</Text>
          </AppCard>
        ) : null}

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Información requerida</Text>
          <Divider style={styles.divider} />
          <Controller control={control} name="proveedorId" render={({ field }) => (
            <AppSelect
              label="Proveedor *"
              value={field.value}
              onChange={field.onChange}
              options={catalogOptions(catalogs.providers, item => item.razonSocial || item.nombre)}
              error={errors.proveedorId?.message}
              onOpen={() => loadCatalogs(true)}
            />
          )} />
          <Controller control={control} name="marcaId" render={({ field }) => (
            <AppSelect
              label="Marca *"
              value={field.value}
              onChange={field.onChange}
              options={catalogOptions(catalogs.brands, item => item.nombre)}
              error={errors.marcaId?.message}
              onOpen={() => loadCatalogs(true)}
            />
          )} />
          <Controller control={control} name="tipoEquipoId" render={({ field }) => (
            <AppSelect
              label="Tipo de equipo *"
              value={field.value}
              onChange={field.onChange}
              options={catalogOptions(catalogs.types, item => item.nombre)}
              error={errors.tipoEquipoId?.message}
              onOpen={() => loadCatalogs(true)}
            />
          )} />
          {[
            ['modelo', 'Modelo *'],
            ['codigo', 'Código *'],
            ['numeroSerie', 'Número de serie *'],
            ['numeroGuiaRemision', 'Nro. guía de remisión *'],
          ].map(([name, label]) => (
            <Controller key={name} control={control} name={name} render={({ field }) => (
              <AppInput
                label={label}
                value={field.value}
                onChangeText={text => field.onChange(text.toUpperCase())}
                onBlur={field.onBlur}
                errorMessage={errors[name]?.message}
                autoCapitalize="characters"
                style={styles.input}
              />
            )} />
          ))}
          <Controller control={control} name="fechaIngreso" render={({ field }) => (
            <View style={{ marginTop: 10 }}>
              <DateField value={field.value} onChange={field.onChange} error={errors.fechaIngreso?.message} />
            </View>
          )} />
          <Controller control={control} name="horometroInicio" render={({ field }) => (
            <AppInput
              label="Horómetro Inicio *"
              value={field.value}
              onChangeText={v => field.onChange(v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
              onBlur={field.onBlur}
              errorMessage={errors.horometroInicio?.message}
              keyboardType="numeric"
              placeholder="Ej: 1234.5"
              style={styles.input}
            />
          )} />
        </AppCard>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Equipo y accesorios</Text>
          <Divider style={styles.divider} />
          {accessoryFields.map(item => (
            <View key={item.key}>
              <Controller control={control} name={item.key} render={({ field }) => (
                <AppCheckboxField label={item.label} value={field.value} onChange={field.onChange} />
              )} />
              {item.serial && values[item.key] ? (
                <Controller control={control} name={item.serial} render={({ field }) => (
                  <AppInput
                    label={`Serie de ${item.label.toLowerCase()} *`}
                    value={field.value}
                    onChangeText={text => field.onChange(text.toUpperCase())}
                    onBlur={field.onBlur}
                    errorMessage={errors[item.serial]?.message}
                    autoCapitalize="characters"
                    style={styles.input}
                  />
                )} />
              ) : null}
            </View>
          ))}
        </AppCard>

        <AppCard style={styles.section}>
          <Controller control={control} name="observaciones" render={({ field }) => (
            <AppTextArea
              label="Observaciones"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors.observaciones?.message}
            />
          )} />
        </AppCard>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) }]}>
        <AppButton onPress={handleSubmit(submit)} loading={saving} disabled={saving} fullWidth>
          {isEdit ? 'Actualizar equipo' : 'Guardar e ingresar fotos'}
        </AppButton>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  content: { padding: theme.spacing[4] },
  summary: { marginBottom: theme.spacing[3] },
  title: { ...theme.typography.subtitle1, color: theme.colors.text.primary },
  meta: { ...theme.typography.body2, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  section: { marginBottom: theme.spacing[3] },
  sectionTitle: { ...theme.typography.subtitle1, color: theme.colors.text.primary },
  divider: { marginVertical: theme.spacing[3], backgroundColor: theme.colors.border.subtle },
  input: { marginTop: theme.spacing[3] },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[3],
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1, borderTopColor: theme.colors.border.subtle,
  },
})
