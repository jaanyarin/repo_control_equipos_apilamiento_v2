import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, StyleSheet, ScrollView, Alert } from 'react-native'
import { Text, Searchbar, FAB, Portal, Dialog } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'
import AppCard from '../components/AppCard'
import AppInput from '../components/AppInput'
import AppTextArea from '../components/AppTextArea'
import AppButton from '../components/AppButton'
import AppIconButton from '../components/AppIconButton'
import ErrorState from '../components/ErrorState'
import { theme } from '../theme'

export default function CatalogScreen({ title, endpoint, searchPlaceholder, searchFields, emptyMessage, fields }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})

  const fetchItems = useCallback(async () => {
    try {
      setError(null)
      const { data } = await api.get(endpoint)
      const list = data?.data || data || []
      setItems(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e.response?.data?.error || e.message || `Error al cargar ${title.toLowerCase()}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [endpoint, title])

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      fetchItems()
    }, [fetchItems])
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchItems()
  }, [fetchItems])

  const openCreate = () => {
    const initial = {}
    fields.forEach(f => { initial[f.key] = '' })
    setFormData(initial)
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (item) => {
    const data = {}
    fields.forEach(f => { data[f.key] = item[f.key] || '' })
    setFormData(data)
    setEditing(item)
    setShowForm(true)
  }

  const handleSave = async () => {
    const missing = fields.find(f => f.required && !formData[f.key]?.trim())
    if (missing) {
      Alert.alert('Validación', `El campo "${missing.label}" es obligatorio`)
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await api.put(`${endpoint}/${editing.id}`, formData)
      } else {
        await api.post(endpoint, formData)
      }
      setShowForm(false)
      fetchItems()
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (item) => {
    Alert.alert('Confirmar', `¿Eliminar "${item[fields[0]?.key] || item.nombre || item.id}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`${endpoint}/${item.id}`)
            fetchItems()
          } catch (e) {
            Alert.alert('Error', e.response?.data?.error || e.message || 'Error al eliminar')
          }
        },
      },
    ])
  }

  const filtered = items.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return searchFields.some(f => (item[f] || '').toLowerCase().includes(q))
  })

  const renderItem = ({ item }) => (
    <AppCard style={styles.card} onPress={() => openEdit(item)} accessibilityLabel={`Editar ${title}: ${item[fields[0]?.key] || item.nombre || item.id}`}>
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <View style={styles.cardInfo}>
            {fields.map(f => (
              <Text key={f.key} variant={f.primary ? 'titleMedium' : 'bodyMedium'} style={f.primary ? styles.primaryText : styles.secondaryText}>
                {f.prefix || ''}{item[f.key] || '-'}
              </Text>
            ))}
          </View>
          <AppIconButton icon="delete-outline" iconColor={theme.colors.status.error} size={20} accessibilityLabel={`Eliminar ${item[fields[0]?.key] || item.nombre || item.id}`} onPress={() => handleDelete(item)} />
        </View>
      </View>
    </AppCard>
  )

  if (loading && items.length === 0) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Searchbar
          placeholder={searchPlaceholder}
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
        {error ? (
          <ErrorState title={`Error al cargar ${title.toLowerCase()}`} message={error} onRetry={fetchItems} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.action.primary]} />
            }
            ListEmptyComponent={
              <EmptyState
                icon="database"
                title={search ? 'Sin resultados' : emptyMessage}
                subtitle={search ? 'Intenta con otro término' : `No hay ${title.toLowerCase()} registrados`}
              />
            }
          />
        )}
        <FAB icon="plus" style={styles.fab} onPress={openCreate} label={`Agregar ${title.slice(0, -1)}`} />

        <Portal>
          <Dialog visible={showForm} onDismiss={() => setShowForm(false)} style={styles.dialog}>
            <Dialog.Title>{editing ? `Editar ${title.slice(0, -1)}` : `Nuevo ${title.slice(0, -1)}`}</Dialog.Title>
            <Dialog.ScrollArea>
              <ScrollView>
                {fields.map(f => (
                  f.multiline ? (
                    <AppTextArea key={f.key} label={f.label} value={formData[f.key] || ''} onChangeText={(v) => setFormData(prev => ({ ...prev, [f.key]: v }))} style={styles.dialogInput} />
                  ) : (
                    <AppInput key={f.key} label={f.label} value={formData[f.key] || ''} onChangeText={(v) => setFormData(prev => ({ ...prev, [f.key]: v }))} style={styles.dialogInput} />
                  )
                ))}
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <AppButton variant="text" onPress={() => setShowForm(false)}>Cancelar</AppButton>
              <AppButton variant="primary" onPress={handleSave} disabled={saving} loading={saving}>{editing ? 'Actualizar' : 'Crear'}</AppButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
    paddingBottom: theme.spacing[8] + theme.spacing[12],
  },
  card: {
    marginBottom: theme.spacing[2],
  },
  cardContent: {
    padding: 0,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  primaryText: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
  },
  secondaryText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  fab: {
    position: 'absolute',
    right: theme.spacing[4],
    bottom: theme.spacing[4],
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.action.primary,
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogInput: {
    marginBottom: theme.spacing[3],
  },
})
