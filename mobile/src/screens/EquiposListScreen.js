import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { Card, Text, TextInput, Chip, TouchableRipple, Searchbar } from 'react-native-paper'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'

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

  const chipColor = (estado) => {
    switch (estado) {
      case 'OPERATIVO':
        return '#2e7d32'
      case 'AVERIADO':
        return '#d32f2f'
      default:
        return '#888'
    }
  }

  const renderItem = ({ item }) => (
    <TouchableRipple
      onPress={() => navigation.navigate('EquipoDetail', { id: item.id })}
      style={styles.cardWrapper}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {item.codigo || 'Sin código'}
            </Text>
            <Chip
              mode="flat"
              textStyle={{ color: '#fff', fontSize: 12, fontWeight: 600 }}
              style={{ backgroundColor: chipColor(item.estadoOperativo) }}
            >
              {item.estadoOperativo || 'DESCONOCIDO'}
            </Chip>
          </View>
          <Text variant="bodyMedium" style={styles.cardModel}>
            {item.modelo || 'Sin modelo'}
          </Text>
          {item.tipoEquipo?.nombre ? (
            <Text variant="bodySmall" style={styles.cardMeta}>
              {item.tipoEquipo.nombre}
            </Text>
          ) : null}
        </Card.Content>
      </Card>
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
          <EmptyState icon="alert" title="Error al cargar" subtitle={error} />
        ) : (
          <FlatList
            data={filteredEquipos}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1565C0']} />
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
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    borderRadius: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardWrapper: {
    marginBottom: 8,
    borderRadius: 12,
  },
  card: {
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: 700,
    flex: 1,
    marginRight: 8,
  },
  cardModel: {
    opacity: 0.7,
  },
  cardMeta: {
    opacity: 0.5,
    marginTop: 2,
  },
})
