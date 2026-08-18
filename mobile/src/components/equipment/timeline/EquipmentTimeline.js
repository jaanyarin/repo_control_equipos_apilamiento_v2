import React, { memo, useCallback } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { Text, ActivityIndicator } from 'react-native-paper'
import { theme } from '../../../theme'
import TimelineEvent from './TimelineEvent'
import EmptyState from '../../EmptyState'
import ErrorState from '../../ErrorState'

const TimelineEventMemo = memo(TimelineEvent)

// Timeline vertical del detalle de equipo.
// - Recibe eventos ya ordenados por el backend (descendente).
// - Maneja estado de carga (skeleton), vacío y error con reintento.
export default function EquipmentTimeline({
  events = [],
  loading = false,
  error = null,
  onRetry,
  refreshing = false,
  onRefresh,
  photosRenderer,
  ListHeaderComponent,
  testID,
}) {
  const renderItem = useCallback(({ item, index }) => (
    <TimelineEventMemo
      event={item}
      isLast={index === events.length - 1}
      photosRenderer={photosRenderer}
      testID={`timeline-event-${item.id}`}
    />
  ), [events.length, photosRenderer])

  const keyExtractor = useCallback((item) => String(item.id), [])

  if (loading && events.length === 0) {
    return (
      <View style={styles.center} testID="timeline-loading">
        <ActivityIndicator color={theme.colors.action.primary} size="large" />
        <Text style={styles.loadingLabel}>Cargando historial...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="No fue posible cargar el historial del equipo."
        message={error}
        onRetry={onRetry}
      />
    )
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon="timeline"
        title="No existen eventos registrados"
        subtitle="Este equipo aún no tiene historial."
      />
    )
  }

  return (
    <FlatList
      testID={testID}
      data={events}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent || (
        events.length > 0
          ? <Text style={styles.historialLabel}>Historial del equipo</Text>
          : null
      )}
      refreshControl={onRefresh ? (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.action.primary]}
        />
      ) : undefined}
    />
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[6],
    gap: theme.spacing[3],
  },
  loadingLabel: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  list: {
    paddingHorizontal: theme.spacing[3],
    paddingTop: theme.spacing[2],
    paddingBottom: theme.spacing[8],
  },
  historialLabel: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[2],
  },
})