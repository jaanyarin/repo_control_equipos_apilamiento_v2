import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { Text, TouchableRipple, Searchbar } from 'react-native-paper'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'
import AppCard from '../components/AppCard'
import StatusChip from '../components/StatusChip'
import ErrorState from '../components/ErrorState'
import { theme } from '../theme'

export default function EquiposListScreen() {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const navigation = useNavigation()

  const fetchEquipos = useCallback(async () => {
    try {
      setError(null)
      const { data } = await api.get('/equipos')
      const list = data?.data || data || []
      setEquipos(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al cargar equipos')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      fetchEquipos()
    }, [fetchEquipos])
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchEquipos()
  }, [fetchEquipos])

  const filteredEquipos = equipos.filter((e) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (e.codigo || '').toLowerCase().includes(q) ||
      (e.modelo || '').toLowerCase().includes(q)
    )
  })

  const statusType = (estado) => estado === 'OPERATIVO' ? 'active' : estado === 'AVERIADO' ? 'fault' : 'cancelled'

  const renderItem = ({ item }) => (
    <TouchableRipple
      onPress={() => navigation.navigate('EquipoDetail', { id: item.id })}
      style={styles.cardWrapper}
    >
      <AppCard style={styles.card} accessibilityLabel={`Equipo ${item.codigo || 'sin código'}`}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {item.codigo || 'Sin código'}
            </Text>
            <StatusChip status={statusType(item.estadoOperativo)} label={item.estadoOperativo || 'DESCONOCIDO'} />
          </View>
          <Text variant="bodyMedium" style={styles.cardModel}>
            {item.modelo || 'Sin modelo'}
          </Text>
          {item.tipoEquipo?.nombre ? (
            <Text variant="bodySmall" style={styles.cardMeta}>
              {item.tipoEquipo.nombre}
            </Text>
          ) : null}
        </View>
      </AppCard>
    </TouchableRipple>
  )

  if (loading && equipos.length === 0) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Searchbar
          placeholder="Buscar por código o modelo"
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
        {error ? (
          <ErrorState title="Error al cargar equipos" message={error} onRetry={fetchEquipos} />
        ) : (
          <FlatList
            data={filteredEquipos}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.action.primary]} />
            }
            ListEmptyComponent={
              <EmptyState
                icon="warehouse"
                title={search ? 'Sin resultados' : 'No hay equipos'}
                subtitle={search ? 'Intenta con otro término de búsqueda' : 'Aún no se han registrado equipos'}
              />
            }
          />
        )}
      </View>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.page,
  },
  searchbar: {
    margin: theme.spacing[4],
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background.paper,
  },
  list: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[6],
  },
  cardWrapper: {
    marginBottom: theme.spacing[3],
    borderRadius: theme.radius.md,
  },
  card: {
    padding: 0,
  },
  cardContent: {
    padding: theme.spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  cardTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing[2],
  },
  cardModel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  cardMeta: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[1],
  },
})
