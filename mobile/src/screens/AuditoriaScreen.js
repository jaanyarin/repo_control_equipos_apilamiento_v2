import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { Card, Text, Searchbar, Chip, Divider } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'

const typeColor = (tipo) => {
  const t = (tipo || '').toLowerCase()
  if (t.includes('error') || t.includes('delete')) return '#d32f2f'
  if (t.includes('create') || t.includes('alta')) return '#2e7d32'
  if (t.includes('update') || t.includes('modificacion')) return '#e65100'
  return '#1565C0'
}

export default function AuditoriaScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const { data } = await api.get('/auditoria/recientes?limite=100')
      const list = data?.data || data || []
      setItems(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al cargar eventos')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(useCallback(() => { setLoading(true); fetch() }, [fetch]))

  const onRefresh = useCallback(() => { setRefreshing(true); fetch() }, [fetch])

  const filtered = items.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return (item.tipoEvento || '').toLowerCase().includes(q) ||
      (item.entidad || '').toLowerCase().includes(q) ||
      (item.accion || '').toLowerCase().includes(q) ||
      (item.usuarioNombre || '').toLowerCase().includes(q)
  })

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Chip mode="flat" textStyle={{ color: '#fff', fontSize: 10, fontWeight: 600 }}
            style={{ backgroundColor: typeColor(item.tipoEvento) }}
          >
            {item.tipoEvento || 'EVENTO'}
          </Chip>
          <Text variant="bodySmall" style={styles.date}>
            {item.fechaEvento ? new Date(item.fechaEvento).toLocaleString() : ''}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text variant="bodySmall" style={styles.label}>Entidad:</Text>
          <Text variant="bodyMedium" style={styles.value}>{item.entidad || '-'} #{item.entidadId || ''}</Text>
        </View>
        <View style={styles.detail}>
          <Text variant="bodySmall" style={styles.label}>Acción:</Text>
          <Text variant="bodyMedium" style={styles.value}>{item.accion || '-'}</Text>
        </View>
        <View style={styles.detail}>
          <Text variant="bodySmall" style={styles.label}>Usuario:</Text>
          <Text variant="bodyMedium" style={styles.value}>{item.usuarioNombre || '-'}</Text>
        </View>
        {item.detalle ? (
          <>
            <Divider style={styles.divider} />
            <Text variant="bodySmall" style={styles.detailText}>{item.detalle}</Text>
          </>
        ) : null}
      </Card.Content>
    </Card>
  )

  if (loading && items.length === 0) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Searchbar placeholder="Buscar por tipo, entidad, acción o usuario" onChangeText={setSearch} value={search} style={styles.searchbar} />
        {error ? (
          <EmptyState icon="alert" title="Error" subtitle={error} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1565C0']} />}
            ListEmptyComponent={<EmptyState icon="history" title={search ? 'Sin resultados' : 'No hay eventos'} subtitle={search ? 'Intenta con otro término' : 'Aún no se han registrado eventos de auditoría'} />}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { opacity: 0.5, fontSize: 11 },
  detail: { flexDirection: 'row', paddingVertical: 2 },
  label: { opacity: 0.6, width: 70 },
  value: { fontWeight: 600, flex: 1 },
  divider: { marginVertical: 6 },
  detailText: { opacity: 0.7, fontStyle: 'italic', fontSize: 12, lineHeight: 16 },
})
