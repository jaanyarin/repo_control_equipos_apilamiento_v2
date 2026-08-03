import React, { useCallback, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { Searchbar, Text, TouchableRipple } from 'react-native-paper'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import api from '../api'
import { useAuth } from '../AuthContext'
import AppButton from '../components/AppButton'
import AppCard from '../components/AppCard'
import AppIconButton from '../components/AppIconButton'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'
import ErrorState from '../components/ErrorState'
import LoadingScreen from '../components/LoadingScreen'
import StatusChip from '../components/StatusChip'
import { theme } from '../theme'
import { isAdminOrSuperAdmin } from '../utils/roles'

export default function EquiposListScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const filterEstado = route.params?.filterEstado
  const mode = route.params?.mode ?? 'manage'
  const esDevolucion = route.params?.devolucion === true
  const isManage = mode === 'manage'
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const canEdit = isAdminOrSuperAdmin(user)

  const fetchEquipos = useCallback(async () => {
    try {
      setError('')
      const { data } = await api.get('/equipos')
      const list = data?.data || data || []
      const arr = Array.isArray(list) ? list : []
      setEquipos(esDevolucion
        ? arr.filter(item => item.estadoOperativo !== 'DEVUELTO')
        : filterEstado
          ? arr.filter(item => item.estadoOperativo === filterEstado)
          : arr)
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al cargar equipos')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [esDevolucion, filterEstado])

  useFocusEffect(useCallback(() => {
    setLoading(true)
    fetchEquipos()
  }, [fetchEquipos]))

  const filtered = equipos.filter(item => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return [item.codigo, item.modelo, item.marcaNombre, item.proveedorNombre]
      .some(value => String(value || '').toLowerCase().includes(query))
  })

  const statusType = estado => estado === 'OPERATIVO'
    ? 'active'
    : estado === 'AVERIADO' ? 'fault' : 'cancelled'

  if (loading && equipos.length === 0) return <LoadingScreen message="Cargando equipos" />

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.title}>{esDevolucion
            ? 'Equipos para devolución'
            : filterEstado === 'AVERIADO'
              ? 'Equipos averiados'
              : isManage
                ? 'Equipos ingresados'
                : mode === 'select' ? 'Seleccionar equipo' : 'Consulta de equipos'}</Text>
          {isManage ? (
            <AppButton icon="plus" onPress={() => navigation.navigate('SelectPsrEquipment')}>
              Nuevo ingreso
            </AppButton>
          ) : null}
        </View>
        <Searchbar
          placeholder="Buscar por código, modelo o proveedor"
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
        {error ? <ErrorState title="Error al cargar equipos" message={error} onRetry={fetchEquipos} /> : (
          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={[styles.list, { paddingBottom: theme.spacing[6] + insets.bottom + 68 }]}
            refreshControl={(
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => { setRefreshing(true); fetchEquipos() }}
                colors={[theme.colors.action.primary]}
              />
            )}
            ListEmptyComponent={(
              <EmptyState
                icon="warehouse"
                title={search ? 'Sin resultados' : esDevolucion ? 'No hay equipos por devolver' : filterEstado === 'AVERIADO' ? 'No hay equipos averiados' : 'No hay equipos'}
                subtitle={search ? 'Intenta con otro término' : esDevolucion ? 'Todos los equipos ya fueron devueltos' : filterEstado === 'AVERIADO' ? 'Todos los equipos están operativos' : 'Aún no se han registrado equipos'}
              />
            )}
            renderItem={({ item }) => (
              <AppCard style={styles.card}>
                <TouchableRipple onPress={() => esDevolucion || (filterEstado === 'AVERIADO' && mode === 'select')
                  ? navigation.navigate('DevolucionEquipo', { id: item.id })
                  : navigation.navigate('EquipoDetail', { id: item.id })}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View style={styles.heading}>
                        <Text style={styles.cardTitle}>{item.codigo || 'Sin código'}</Text>
                        <Text style={styles.cardModel}>{item.marcaNombre || 'Sin marca'} · {item.modelo || 'Sin modelo'}</Text>
                      </View>
                      <StatusChip status={statusType(item.estadoOperativo)} label={item.estadoOperativo || 'DESCONOCIDO'} />
                    </View>
                    <Text style={styles.cardMeta}>{item.proveedorNombre || 'Sin proveedor'} · {item.tipoEquipoNombre || 'Sin tipo'}</Text>
                  </View>
                </TouchableRipple>
                {isManage && canEdit ? (
                  <View style={styles.actions}>
                    <AppIconButton
                      icon="pencil-outline"
                      accessibilityLabel={`Editar equipo ${item.codigo}`}
                      onPress={() => navigation.navigate('EquipmentForm', { mode: 'edit', equipo: item })}
                    />
                  </View>
                ) : null}
              </AppCard>
            )}
          />
        )}
      </View>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: theme.spacing[4], gap: theme.spacing[2],
  },
  title: { ...theme.typography.subtitle1, color: theme.colors.text.primary, flex: 1 },
  searchbar: {
    marginHorizontal: theme.spacing[4], marginBottom: theme.spacing[4],
    borderRadius: theme.radius.md, backgroundColor: theme.colors.background.paper,
  },
  list: { paddingHorizontal: theme.spacing[4], paddingBottom: theme.spacing[6] },
  card: { padding: 0, marginBottom: theme.spacing[3], overflow: 'hidden' },
  cardContent: { padding: theme.spacing[4], paddingBottom: theme.spacing[6] },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing[2] },
  heading: { flex: 1, marginRight: theme.spacing[2] },
  cardTitle: { ...theme.typography.subtitle1, color: theme.colors.text.primary },
  cardModel: { ...theme.typography.body2, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  cardMeta: { ...theme.typography.caption, color: theme.colors.text.tertiary },
  actions: { position: 'absolute', right: theme.spacing[2], bottom: theme.spacing[1] },
})
