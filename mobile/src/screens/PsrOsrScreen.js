import React, { useCallback, useState } from 'react'
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import { Searchbar, Text } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
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
import { currencyCode, hasPsrAdminRole } from '../utils/roles'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const [year, month, day] = dateStr.split('-')
  return year && month && day ? `${day}/${month}/${year}` : dateStr
}

function formatCost(osr) {
  if (osr?.costoUnitario == null) return '-'
  return `${currencyCode(osr.tipoMoneda)} ${Number(osr.costoUnitario).toFixed(2)}`
}

function formatMonths(months) {
  if (months == null || Number.isNaN(Number(months))) return '-'
  return Number(months).toFixed(2)
}

export default function PsrOsrScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  const canManage = hasPsrAdminRole(user)
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
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
        || requestError.response?.data?.error
        || requestError.message
        || 'Error al cargar PSR',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      fetch()
    }, [fetch]),
  )

  const handleEdit = item => {
    navigation.navigate('CreatePsr', { psr: item })
  }

  const handleAddOsr = item => {
    navigation.navigate('CreatePsr', { psr: item, mode: 'osr' })
  }

  const handleDelete = item => {
    Alert.alert('Eliminar', `¿Eliminar PSR "${item.numeroPsr}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/psr/${item.id}`)
            fetch()
          } catch (requestError) {
            Alert.alert(
              'Error',
              requestError.response?.data?.message
              || requestError.response?.data?.error
              || requestError.message,
            )
          }
        },
      },
    ])
  }

  const filtered = items.filter(item => {
    if (!search) return true
    const term = search.toLowerCase()
    return (item.numeroPsr || '').toLowerCase().includes(term)
      || (item.osr?.numeroOsr || '').toLowerCase().includes(term)
  })

  const renderItem = ({ item }) => {
    const title = item.osr?.numeroOsr
      ? `${item.numeroPsr} - ${item.osr.numeroOsr}`
      : item.numeroPsr || 'Sin PSR'

    return (
      <AppCard
        style={styles.card}
        accessibilityLabel={`PSR ${item.numeroPsr || 'sin número'}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              {title}
            </Text>
            {item.motivoNombreCorto ? (
              <Text variant="bodySmall" style={styles.cardMeta}>
                Motivo: {item.motivoNombreCorto}
              </Text>
            ) : null}
          </View>
          <StatusChip
            status={item.estadoActivo ? 'active' : 'cancelled'}
            label={item.estadoActivo ? 'ACTIVO' : 'INACTIVO'}
          />
        </View>

        <View style={styles.details}>
          <Text variant="bodySmall" style={styles.detailText}>
            Fecha PSR: {formatDate(item.fechaPsr)}
          </Text>
          <Text variant="bodySmall" style={styles.detailText}>
            Inicio uso: {formatDate(item.fechaInicioUso)} - Fin: {formatDate(item.fechaFinUso)}
          </Text>
          <Text variant="bodySmall" style={styles.detailText}>
            Meses: {formatMonths(item.meses)} | Campaña: {item.campanaNombre || '-'} | Sede: {item.sedeNombre || '-'}
          </Text>
          {item.marca || item.modelo || item.grr ? (
            <Text variant="bodySmall" style={styles.detailText}>
              Marca: {item.marca || '-'} | Modelo: {item.modelo || '-'} | GRR: {item.grr || '-'}
            </Text>
          ) : null}
          {item.osr ? (
            <View style={styles.osrInfo}>
              <Text variant="bodySmall" style={styles.osrText}>
                OSR: {item.osr.numeroOsr}
              </Text>
              <Text variant="bodySmall" style={styles.osrText}>
                Costo Unitario: {formatCost(item.osr)}
              </Text>
            </View>
          ) : null}
        </View>

        {item.observaciones ? (
          <Text variant="bodySmall" style={styles.obsText}>
            {item.observaciones}
          </Text>
        ) : null}

        {canManage ? (
          <View style={styles.actions}>
            {!item.osr ? (
              <AppButton
                tone="secondary"
                icon="file-plus-outline"
                compact
                contentStyle={styles.osrButtonContent}
                onPress={() => handleAddOsr(item)}
              >
                Agregar OSR
              </AppButton>
            ) : null}
            <AppIconButton
              icon="pencil-outline"
              iconColor={theme.colors.action.primary}
              size={20}
              accessibilityLabel={`Editar PSR ${item.numeroPsr || ''}`}
              onPress={() => handleEdit(item)}
            />
            <AppIconButton
              icon="delete-outline"
              iconColor={theme.colors.status.error}
              size={20}
              accessibilityLabel={`Eliminar PSR ${item.numeroPsr || ''}`}
              onPress={() => handleDelete(item)}
            />
          </View>
        ) : null}
      </AppCard>
    )
  }

  if (loading && items.length === 0) return <LoadingScreen />

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Searchbar
          placeholder="Buscar por número PSR u OSR"
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
        {error ? (
          <ErrorState
            title="Error al cargar PSR"
            message={error}
            onRetry={fetch}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true)
                  fetch()
                }}
                colors={[theme.colors.action.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="file-document"
                title={search ? 'Sin resultados' : 'No hay PSR'}
                subtitle={search ? 'Intenta con otro término' : 'Aún no se han registrado PSR'}
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
  card: {
    marginBottom: theme.spacing[3],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[2],
  },
  cardInfo: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  cardTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
  },
  cardMeta: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[1],
  },
  details: {
    marginBottom: theme.spacing[1],
  },
  detailText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },
  osrInfo: {
    marginTop: theme.spacing[2],
    padding: theme.spacing[3],
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.status.infoBackground,
  },
  osrText: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  obsText: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: theme.spacing[1],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  osrButtonContent: {
    minHeight: 40,
  },
})
