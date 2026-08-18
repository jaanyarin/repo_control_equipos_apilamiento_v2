import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Icon } from 'react-native-paper'
import { theme } from '../../../theme'
import { TIMELINE_EVENT_CONFIG } from './timeline.config'
import { formatCurrency, formatDowntime, formatHourMeter, formatDate } from './timeline.utils'

function Field({ label, value, style }) {
  if (!value) return null
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  )
}

// Detalle expandido de un evento: metadata, tiempo de parada, fotografías.
export default function TimelineEventDetails({ event, photosRenderer }) {
  const config = TIMELINE_EVENT_CONFIG[event.type]
  const md = event.metadata || {}
  const isAveria = event.type === 'AVERIA'
  const isReparacion = event.type === 'REPARACION'

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        {event.description ? (
          <Text style={styles.description}>{event.description}</Text>
        ) : null}

        {isAveria ? (
          <>
            {md.failure ? <Field label="Falla" value={md.failure} /> : null}
            {md.hourMeter != null ? <Field label="Horómetro" value={`${formatHourMeter(md.hourMeter)} h`} /> : null}
            {md.downtimeMinutes != null ? <Field label="Tiempo de parada" value={formatDowntime(md.downtimeMinutes)} /> : null}
            {md.userName ? <Field label="Reportado por" value={md.userName} /> : null}
          </>
        ) : null}

        {isReparacion ? (
          <>
            {md.action ? <Field label="Acción realizada" value={md.action} /> : null}
            {md.downtimeMinutes != null ? <Field label="Tiempo de parada" value={formatDowntime(md.downtimeMinutes)} /> : null}
            {md.hourMeter != null ? <Field label="Horómetro final" value={`${formatHourMeter(md.hourMeter)} h`} /> : null}
            {md.provider ? <Field label="Proveedor" value={md.provider} /> : null}
            {md.userName ? <Field label="Atendido por" value={md.userName} /> : null}
          </>
        ) : null}

        {event.type === 'PSR' || event.type === 'OSR' || event.type === 'INGRESO' || event.type === 'FINALIZACION' ? (
          <>
            {md.documentNumber ? <Field label="N° documento" value={md.documentNumber} /> : null}
            {event.type === 'OSR' && md.costPerMonth != null ? (
              <Field label="Costo mensual" value={formatCurrency(md.costPerMonth, md.currency)} />
            ) : null}
            {md.area ? <Field label="Área" value={md.area} /> : null}
            {md.campana ? <Field label="Campaña" value={md.campana} /> : null}
            {event.type === 'INGRESO' && md.hourMeter != null ? (
              <Field label="Horómetro inicial" value={`${formatHourMeter(md.hourMeter)} h`} />
            ) : null}
            {event.type === 'FINALIZACION' && md.hourMeter != null ? (
              <Field label="Horómetro final" value={`${formatHourMeter(md.hourMeter)} h`} />
            ) : null}
            {md.provider ? <Field label="Proveedor" value={md.provider} /> : null}
            {md.userName ? <Field label="Registrado por" value={md.userName} /> : null}
          </>
        ) : null}
      </View>

      {event.photos && event.photos.length > 0 ? (
        <View style={styles.photos}>
          <View style={styles.photosHeader}>
            <Icon source="camera" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.photosLabel}>
              {event.photos.length} {event.photos.length === 1 ? 'fotografía' : 'fotografías'}
            </Text>
          </View>
          {photosRenderer ? photosRenderer(event.photos) : null}
        </View>
      ) : null}

      {event.dateTime ? (
        <Text style={styles.timestamp}>
          {config?.category || ''} · {formatDate(event.dateTime)}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing[2],
    paddingLeft: theme.spacing[2],
  },
  details: {
    gap: theme.spacing[1],
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  field: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[2],
  },
  fieldLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    width: 110,
  },
  fieldValue: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'right',
    fontFamily: theme.fontFamily.medium,
  },
  photos: {
    marginTop: theme.spacing[2],
  },
  photosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    marginBottom: theme.spacing[2],
  },
  photosLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.medium,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[2],
  },
})
