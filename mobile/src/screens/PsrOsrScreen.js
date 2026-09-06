import React, { useCallback, useState } from 'react'
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import { Divider, Searchbar, Text } from 'react-native-paper'
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

function getOsrs(item) {
  if (Array.isArray(item.osrs) && item.osrs.length > 0) return item.osrs
  if (item.osr) return [item.osr]
  return []
}

function getPsrStatus(item) {
  if (item.estadoPsr) return item.estadoPsr
  if (item.finalizado) return 'FINALIZADO'
  return item.estadoActivo ? 'ACTIVO' : 'INACTIVO'
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
    if (item.finalizado || item.estadoPsr === 'FINALIZADO') return
    navigation.navigate('CreatePsr', { psr: item })
  }

  const handleAddOsr = item => {
    if (item.finalizado || item.estadoPsr === 'FINALIZADO') return
    navigation.navigate('CreatePsr', { psr: item, mode: 'osr' })
  }

  const handleEditOsr = (psr, osr) => {
    if (osr.finalizado) return
    navigation.navigate('CreatePsr', { psr, osr, mode: 'editOsr' })
  }

  const handleDeleteOsr = (psr, osr) => {
    if (osr.finalizado || osr.equipoId) return
    Alert.alert('Eliminar OSR', `¿Eliminar OSR "${osr.numeroOsr}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/osr/${osr.id}`)
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

  const handleDelete = item => {
    if (item.finalizado || item.estadoPsr === 'FINALIZADO') return
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

  const filtered = items
    .filter(item => {
      if (!search) return true
      const term = search.toLowerCase()
      const osrs = getOsrs(item)
      return (item.numeroPsr || '').toLowerCase().includes(term)
        || osrs.some(o => (o.numeroOsr || '').toLowerCase().includes(term))
    })
    .sort((a, b) => Number(b.id) - Number(a.id))

  const renderItem = ({ item }) => {
    const osrs = getOsrs(item)
    const status = getPsrStatus(item)
    const isFinalizado = status === 'FINALIZADO'
    const isParcial = status === 'PARCIAL'
    const title = item.numeroPsr || 'Sin PSR'
    const osrsTotal = item.osrsTotal ?? osrs.length
    const osrsFinalizadas = item.osrsFinalizadas ?? osrs.filter(o => o.finalizado).length

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
            status={isFinalizado ? 'cancelled' : isParcial ? 'pending' : item.estadoActivo ? 'active' : 'cancelled'}
            label={isFinalizado ? 'FINALIZADO' : isParcial ? `${osrsFinalizadas}/${osrsTotal} FINALIZADAS` : item.estadoActivo ? 'ACTIVO' : 'INACTIVO'}
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
        </View>

        {osrs.length > 0 ? (
          <View style={styles.osrList}>
            <Text variant="labelSmall" style={styles.osrListTitle}>
              OSRs ({osrs.length}){osrsTotal > 0 ? ` · ${osrsFinalizadas} finalizadas` : ''}
            </Text>
            {osrs.map(osr => {
              const osrFinalizado = Boolean(osr.finalizado)
              const tieneEquipo = Boolean(osr.equipoId)
              return (
                <View key={String(osr.id)} style={[styles.osrCard, osrFinalizado && styles.osrCardFinalizado]}>
                  <View style={styles.osrHeader}>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" style={styles.osrNumero}>
                        {osr.numeroOsr}
                      </Text>
                      <Text variant="bodySmall" style={styles.osrCost}>
                        Costo: {formatCost(osr)}
                      </Text>
                      {osr.marca || osr.modelo || osr.grr ? (
                        <Text variant="bodySmall" style={styles.osrMeta}>
                          {osr.marca || '-'} | {osr.modelo || '-'} | GRR: {osr.grr || '-'}
                        </Text>
                      ) : null}
                      {tieneEquipo ? (
                        <Text variant="bodySmall" style={styles.osrEquipo}>
                          Equipo: {osr.estadoEquipo || 'asignado'}{osrFinalizado ? ' · DEVUELTO' : ''}
                        </Text>
                      ) : null}
                    </View>
                    <StatusChip
                      status={osrFinalizado ? 'cancelled' : tieneEquipo ? 'pending' : 'active'}
                      label={osrFinalizado ? 'DEVUELTO' : tieneEquipo ? 'CON EQUIPO' : 'DISPONIBLE'}
                    />
                  </View>
                  {canManage ? (
                    <View style={styles.osrActions}>
                      <AppIconButton
                        icon="pencil-outline"
                        iconColor={osrFinalizado ? theme.colors.text.disabled : theme.colors.action.primary}
                        size={18}
                        disabled={osrFinalizado}
                        accessibilityLabel={`Editar OSR ${osr.numeroOsr}`}
                        onPress={() => handleEditOsr(item, osr)}
                      />
                      <AppIconButton
                        icon="delete-outline"
                        iconColor={osrFinalizado || tieneEquipo ? theme.colors.text.disabled : theme.colors.status.error}
                        size={18}
                        disabled={osrFinalizado || tieneEquipo}
                        accessibilityLabel={`Eliminar OSR ${osr.numeroOsr}`}
                        onPress={() => handleDeleteOsr(item, osr)}
                      />
                    </View>
                  ) : null}
                </View>
              )
            })}
          </View>
        ) : (
          <Text variant="bodySmall" style={styles.noOsrText}>
            Sin OSRs — use “Agregar OSR” para crear la primera.
          </Text>
        )}

        {item.observaciones ? (
          <Text variant="bodySmall" style={styles.obsText}>
            {item.observaciones}
          </Text>
        ) : null}

        {canManage ? (
          <View style={styles.actions}>
            {!isFinalizado ? (
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
              iconColor={isFinalizado ? theme.colors.text.disabled : theme.colors.action.primary}
              size={20}
              disabled={isFinalizado}
              accessibilityLabel={`Editar PSR ${item.numeroPsr || ''}`}
              onPress={() => handleEdit(item)}
            />
            <AppIconButton
              icon="delete-outline"
              iconColor={isFinalizado ? theme.colors.text.disabled : theme.colors.status.error}
              size={20}
              disabled={isFinalizado}
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
  osrList: {
    marginTop: theme.spacing[2],
  },
  osrListTitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
    fontWeight: '600',
  },
  osrCard: {
    marginBottom: theme.spacing[2],
    padding: theme.spacing[3],
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.status.infoBackground,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  osrCardFinalizado: {
    opacity: 0.7,
  },
  osrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  osrNumero: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  osrCost: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
  osrMeta: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },
  osrEquipo: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  osrActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing[1],
    marginTop: theme.spacing[1],
  },
  noOsrText: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: theme.spacing[2],
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
