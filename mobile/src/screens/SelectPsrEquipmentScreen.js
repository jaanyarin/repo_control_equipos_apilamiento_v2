import React, { useCallback, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { RadioButton, Text, TouchableRipple } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import api from '../api'
import AppButton from '../components/AppButton'
import AppCard from '../components/AppCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingScreen from '../components/LoadingScreen'
import StatusChip from '../components/StatusChip'
import { theme } from '../theme'

export default function SelectPsrEquipmentScreen() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setError('')
      const { data } = await api.get('/ingresos-equipo/psr-pendientes')
      const list = data?.data || data || []
      setItems(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'No se pudieron cargar las PSR pendientes')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(useCallback(() => {
    setLoading(true)
    load()
  }, [load]))

  const selected = items.find(item => String(item.psrId) === selectedId)
  const continueFlow = () => {
    if (!selected) return
    if (selected.borradorEquipoId) {
      navigation.navigate('EquipmentPhotos', {
        equipoId: selected.borradorEquipoId,
        psr: selected,
      })
    } else {
      navigation.navigate('EquipmentForm', { psr: selected, mode: 'create' })
    }
  }

  if (loading && items.length === 0) return <LoadingScreen message="Buscando PSR pendientes" />

  return (
    <View style={styles.container}>
      {error ? <ErrorState title="No se pudieron cargar las PSR" message={error} onRetry={load} /> : (
        <FlatList
          data={items}
          keyExtractor={item => String(item.psrId)}
          contentContainerStyle={[styles.list, { paddingBottom: 100 + insets.bottom }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} />}
          ListHeaderComponent={<Text style={styles.title}>PSR con OSR sin equipo finalizado</Text>}
          ListEmptyComponent={<EmptyState icon="clipboard-check-outline" title="Sin PSR pendientes" subtitle="Todas las OSR disponibles ya tienen un equipo asignado." />}
          renderItem={({ item }) => {
            const value = String(item.psrId)
            return (
              <TouchableRipple onPress={() => setSelectedId(value)} style={styles.cardWrapper}>
                <AppCard style={styles.card}>
                  <View style={styles.header}>
                    <View style={styles.heading}>
                      <Text style={styles.psr}>{item.numeroPsr}</Text>
                      <Text style={styles.osr}>{item.numeroOsr}</Text>
                    </View>
                    <StatusChip
                      status={item.borradorEquipoId ? 'pending' : 'active'}
                      label={item.borradorEquipoId ? 'En proceso' : 'Disponible'}
                    />
                    <RadioButton value={value} status={selectedId === value ? 'checked' : 'unchecked'} />
                  </View>
                  <Text style={styles.meta}>{item.motivo || 'Sin descripción'} · {item.meses ?? '-'} meses</Text>
                </AppCard>
              </TouchableRipple>
            )
          }}
        />
      )}
      <View style={styles.footer}>
        <AppButton onPress={continueFlow} disabled={!selected} fullWidth>
          {selected?.borradorEquipoId ? 'Continuar ingreso' : 'Seleccionar e ingresar equipo'}
        </AppButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  list: { padding: theme.spacing[4], paddingBottom: 100 },
  title: { ...theme.typography.subtitle1, color: theme.colors.text.primary, marginBottom: theme.spacing[3] },
  cardWrapper: { borderRadius: theme.radius.md, marginBottom: theme.spacing[3] },
  card: { padding: theme.spacing[4] },
  header: { flexDirection: 'row', alignItems: 'center' },
  heading: { flex: 1 },
  psr: { ...theme.typography.subtitle1, color: theme.colors.text.primary },
  osr: { ...theme.typography.body2, color: theme.colors.text.secondary },
  meta: { ...theme.typography.caption, color: theme.colors.text.tertiary, marginTop: theme.spacing[2] },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: theme.spacing[4], backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1, borderTopColor: theme.colors.border.subtle,
  },
})
