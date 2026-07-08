import React, { useState, useCallback } from 'react'
import { View, FlatList, RefreshControl, Modal, StyleSheet, ScrollView, Alert } from 'react-native'
import { Card, Text, TextInput, Button, Searchbar, FAB, Portal, Dialog, Surface, IconButton, ActivityIndicator } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import api from '../api'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ErrorBoundary from '../components/ErrorBoundary'

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
    <Card style={styles.card} onPress={() => openEdit(item)}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardRow}>
          <View style={styles.cardInfo}>
            {fields.map(f => (
              <Text key={f.key} variant={f.primary ? 'titleMedium' : 'bodyMedium'} style={f.primary ? styles.primaryText : styles.secondaryText}>
                {f.prefix || ''}{item[f.key] || '-'}
              </Text>
            ))}
          </View>
          <IconButton icon="delete" iconColor="#d32f2f" size={20} onPress={() => handleDelete(item)} />
        </View>
      </Card.Content>
    </Card>
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
          <EmptyState icon="alert" title="Error" subtitle={error} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1565C0']} />
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
                  <TextInput
                    key={f.key}
                    label={f.label}
                    mode="outlined"
                    value={formData[f.key] || ''}
                    onChangeText={(v) => setFormData(prev => ({ ...prev, [f.key]: v }))}
                    style={styles.dialogInput}
                    multiline={f.multiline}
                    numberOfLines={f.multiline ? 3 : 1}
                  />
                ))}
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setShowForm(false)}>Cancelar</Button>
              <Button mode="contained" onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" size="small" /> : editing ? 'Actualizar' : 'Crear'}
              </Button>
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
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    borderRadius: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    borderRadius: 12,
    marginBottom: 8,
  },
  cardContent: {
    paddingVertical: 12,
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
    fontWeight: 700,
  },
  secondaryText: {
    opacity: 0.7,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
    backgroundColor: '#1565C0',
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogInput: {
    marginBottom: 12,
  },
})
