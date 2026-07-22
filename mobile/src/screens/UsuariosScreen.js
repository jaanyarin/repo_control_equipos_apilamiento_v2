import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native'
import { Card, Text, TextInput, Button, Searchbar, FAB, Chip, Surface, IconButton, ActivityIndicator } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'
import { theme } from '../theme'

export default function UsuariosScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const { data } = await api.get('/usuarios')
      const list = data?.data || data || []
      setItems(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(useCallback(() => { setLoading(true); fetch() }, [fetch]))

  const onRefresh = useCallback(() => { setRefreshing(true); fetch() }, [fetch])

  const handleDelete = (item) => {
    Alert.alert('Eliminar', `¿Eliminar usuario "${item.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { try { await api.delete(`/usuarios/${item.id}`); fetch() } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message) } } },
    ])
  }

  const rolColor = (rol) => {
    const r = (rol || '').toLowerCase()
    if (r.includes('super admin')) return theme.colors.secondary.wine
    if (r === 'admin') return theme.colors.action.primary
    return theme.colors.status.success
  }

  const filtered = items.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return (item.nombre || '').toLowerCase().includes(q) || (item.correo || '').toLowerCase().includes(q)
  })

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardRow}>
          <View style={styles.cardInfo}>
            <Text variant="titleMedium" style={styles.nameText}>{item.nombre || 'Sin nombre'}</Text>
            <Text variant="bodySmall" style={styles.emailText}>{item.correo || '-'}</Text>
            <Chip mode="flat" textStyle={{ color: theme.colors.text.inverse, fontSize: 11, fontWeight: 600 }}
              style={{ backgroundColor: rolColor(item.rolNombre || item.rol), marginTop: 6, alignSelf: 'flex-start' }}
            >
              {item.rolNombre || item.rol || 'Sin rol'}
            </Chip>
          </View>
          <IconButton icon="delete" iconColor={theme.colors.status.error} size={20} onPress={() => handleDelete(item)} />
        </View>
      </Card.Content>
    </Card>
  )

  if (loading && items.length === 0) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Searchbar placeholder="Buscar por nombre o correo" onChangeText={setSearch} value={search} style={styles.searchbar} />
        {error ? (
          <EmptyState icon="alert" title="Error" subtitle={error} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.action.primary]} />}
            ListEmptyComponent={<EmptyState icon="account-group" title={search ? 'Sin resultados' : 'No hay usuarios'} subtitle={search ? 'Intenta con otro término' : 'Aún no se han registrado usuarios'} />}
          />
        )}
      </View>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  searchbar: { margin: 16, borderRadius: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: { borderRadius: 12, marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1, marginRight: 8 },
  nameText: { fontWeight: 700 },
  emailText: { opacity: 0.6, marginTop: 2 },
})
