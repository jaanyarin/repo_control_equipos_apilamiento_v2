import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native'
import { Card, Text, Chip, Searchbar, IconButton } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'

export default function PsrOsrScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const { data } = await api.get('/psr')
      const list = data?.data || data || []
      setItems(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al cargar PSR')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(useCallback(() => { setLoading(true); fetch() }, [fetch]))

  const onRefresh = useCallback(() => { setRefreshing(true); fetch() }, [fetch])

  const handleDelete = (item) => {
    Alert.alert('Eliminar', `¿Eliminar PSR "${item.numeroPsr}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { try { await api.delete(`/psr/${item.id}`); fetch() } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message) } } },
    ])
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try { return new Date(dateStr + 'T00:00:00').toLocaleDateString() } catch { return dateStr }
  }

  const filtered = items.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return (item.numeroPsr || '').toLowerCase().includes(q)
  })

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text variant="titleMedium" style={styles.cardTitle}>{item.numeroPsr || 'Sin PSR'}</Text>
            {item.motivoNombreCorto ? <Text variant="bodySmall" style={styles.cardMeta}>Motivo: {item.motivoNombreCorto}</Text> : null}
          </View>
          <Chip mode="flat" textStyle={{ color: '#fff', fontSize: 11, fontWeight: 600 }}
            style={{ backgroundColor: item.estadoActivo ? '#2e7d32' : '#888' }}
          >
            {item.estadoActivo ? 'ACTIVO' : 'INACTIVO'}
          </Chip>
        </View>
        <View style={styles.details}>
          <Text variant="bodySmall" style={styles.detailText}>
            Fecha PSR: {formatDate(item.fechaPsr)}
          </Text>
          <Text variant="bodySmall" style={styles.detailText}>
            Inicio uso: {formatDate(item.fechaInicioUso)} - Fin: {formatDate(item.fechaFinUso)}
          </Text>
          <Text variant="bodySmall" style={styles.detailText}>
            Meses: {item.meses || '-'} | Campaña: {item.campanaId} | Sede: {item.sedeId}
          </Text>
        </View>
        {item.observaciones ? (
          <Text variant="bodySmall" style={styles.obsText}>{item.observaciones}</Text>
        ) : null}
        <View style={styles.actions}>
          <IconButton icon="delete" iconColor="#d32f2f" size={20} onPress={() => handleDelete(item)} />
        </View>
      </Card.Content>
    </Card>
  )

  if (loading && items.length === 0) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Searchbar placeholder="Buscar por número PSR" onChangeText={setSearch} value={search} style={styles.searchbar} />
        {error ? (
          <EmptyState icon="alert" title="Error" subtitle={error} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1565C0']} />}
            ListEmptyComponent={<EmptyState icon="file-document" title={search ? 'Sin resultados' : 'No hay PSR'} subtitle={search ? 'Intenta con otro término' : 'Aún no se han registrado PSR'} />}
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
  details: { marginBottom: 4 },
  detailText: { opacity: 0.6, fontSize: 12, marginBottom: 2 },
  obsText: { opacity: 0.5, fontSize: 11, fontStyle: 'italic', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
})