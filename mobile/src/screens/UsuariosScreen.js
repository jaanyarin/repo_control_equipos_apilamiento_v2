import React, { useState, useCallback, useLayoutEffect } from 'react'
import { View, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native'
import { Card, Text, Searchbar, Chip, IconButton } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import api from '../api'
import { useAuth } from '../AuthContext'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'
import { theme } from '../theme'
import { isSuperAdmin } from '../utils/roles'

export default function UsuariosScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          iconColor={theme.colors.text.inverse}
          size={24}
          onPress={() => navigation.navigate('CreateEditUser')}
        />
      ),
    })
  }, [navigation])

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

  const handleEdit = (item) => {
    navigation.navigate('CreateEditUser', { user: item })
  }

  const rolColor = (rol) => {
    const r = (rol || '').toLowerCase()
    if (r.includes('super admin')) return theme.secondaryColors.wine
    if (r.includes('admin')) return theme.colors.action.primary
    return theme.colors.status.success
  }

  const filtered = items.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return (item.nombre || '').toLowerCase().includes(q) || (item.correo || '').toLowerCase().includes(q)
  })

  const isTargetSuperAdmin = (item) => {
    const r = (item.rolNombre || item.rol || '').toLowerCase()
    return r.includes('super admin')
  }

  const canModify = (item) => {
    if (item?.id === 1) return false
    return isSuperAdmin(user) || !isTargetSuperAdmin(item)
  }

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
          {canModify(item) ? (
            <View style={styles.actions}>
              <IconButton icon="pencil" iconColor={theme.colors.action.primary} size={20} onPress={() => handleEdit(item)} />
              <IconButton icon="delete" iconColor={theme.colors.status.error} size={20} onPress={() => handleDelete(item)} />
            </View>
          ) : null}
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
  list: { paddingHorizontal: 16, paddingBottom: 96 },
  card: { borderRadius: 12, marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1, marginRight: 8 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  nameText: { fontWeight: 700 },
  emailText: { opacity: 0.6, marginTop: 2 },
})
