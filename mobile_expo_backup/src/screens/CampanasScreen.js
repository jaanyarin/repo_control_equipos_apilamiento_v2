import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native'
import { Card, Text, TextInput, Button, Searchbar, FAB, Chip, Surface, IconButton } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'

const statusColor = (estado) => {
  if (!estado) return '#888'
  const e = estado.toLowerCase()
  if (e === 'activo') return '#2e7d32'
  if (e === 'cerrado') return '#d32f2f'
  return '#e65100'
}

export default function CampanasScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const { data } = await api.get('/campanas')
      const list = data?.data || data || []
      setItems(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al cargar campañas')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(useCallback(() => { setLoading(true); fetch() }, [fetch]))

  const onRefresh = useCallback(() => { setRefreshing(true); fetch() }, [fetch])

  const handleActivar = (item) => {
    Alert.alert('Activar', `¿Activar campaña "${item.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Activar', onPress: async () => { try { await api.post(`/campanas/${item.id}/activar`); fetch() } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message) } } },
    ])
  }

  const handleCerrar = (item) => {
    Alert.alert('Cerrar', `¿Cerrar campaña "${item.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar', style: 'destructive', onPress: async () => { try { await api.post(`/campanas/${item.id}/cerrar`); fetch() } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message) } } },
    ])
  }

  const handleDelete = (item) => {
    Alert.alert('Eliminar', `¿Eliminar campaña "${item.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { try { await api.delete(`/campanas/${item.id}`); fetch() } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message) } } },
    ])
  }

  const filtered = items.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return (item.nombre || '').toLowerCase().includes(q) || (item.codigo || '').toLowerCase().includes(q)
  })

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text variant="titleMedium" style={styles.cardTitle}>{item.nombre || 'Sin nombre'}</Text>
            {item.codigo ? <Text variant="bodySmall" style={styles.cardMeta}>Código: {item.codigo}</Text> : null}
          </View>
          <Chip mode="flat" textStyle={{ color: '#fff', fontSize: 11, fontWeight: 600 }}
            style={{ backgroundColor: statusColor(item.estado) }}
          >
            {item.estado || 'DESCONOCIDO'}
          </Chip>
        </View>
        <View style={styles.dates}>
          <Text variant="bodySmall" style={styles.dateText}>
            Inicio: {item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString() : '-'}
          </Text>
          <Text variant="bodySmall" style={styles.dateText}>
            Fin: {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString() : '-'}
          </Text>
        </View>
        <View style={styles.actions}>
          {(item.estado === 'ACTIVO' || item.estado === 'activo') ? (
            <Button mode="outlined" textColor="#d32f2f" compact onPress={() => handleCerrar(item)}>
              Cerrar
            </Button>
          ) : (
            <Button mode="outlined" textColor="#2e7d32" compact onPress={() => handleActivar(item)}>
              Activar
            </Button>
          )}
          <IconButton icon="delete" iconColor="#d32f2f" size={20} onPress={() => handleDelete(item)} />
        </View>
      </Card.Content>
    </Card>
  )

  if (loading && items.length === 0) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Searchbar placeholder="Buscar por nombre o código" onChangeText={setSearch} value={search} style={styles.searchbar} />
        {error ? (
          <EmptyState icon="alert" title="Error" subtitle={error} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1565C0']} />}
            ListEmptyComponent={<EmptyState icon="calendar" title={search ? 'Sin resultados' : 'No hay campañas'} subtitle={search ? 'Intenta con otro término' : 'Aún no se han registrado campañas'} />}
          />
        )}
      </View>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchbar: { margin: 16, borderRadius: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: { borderRadius: 12, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardInfo: { flex: 1, marginRight: 8 },
  cardTitle: { fontWeight: 700 },
  cardMeta: { opacity: 0.5, marginTop: 2 },
  dates: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  dateText: { opacity: 0.6, fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
})
