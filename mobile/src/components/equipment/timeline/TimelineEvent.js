import React, { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import { Text, Icon } from 'react-native-paper'
import { theme } from '../../../theme'
import { TIMELINE_EVENT_CONFIG, TIMELINE_STATUS_STYLE } from './timeline.config'
import { formatDateTime } from './timeline.utils'
import TimelineConnector from './TimelineConnector'
import TimelineEventDetails from './TimelineEventDetails'

const NODE_SIZE = 36

function StatusBadge({ status }) {
  const style = TIMELINE_STATUS_STYLE[status]
  if (!style) return null
  return (
    <Text style={[styles.statusLabel, { color: style.color }]}>
      {style.label}
    </Text>
  )
}

// Evento individual de la timeline. Renderiza fecha/hora, icono, título,
// resumen y permite expandir el detalle (metadata + fotografías).
export default function TimelineEvent({ event, isLast = false, photosRenderer, testID }) {
  const config = TIMELINE_EVENT_CONFIG[event.type] || {}
  const statusStyle = TIMELINE_STATUS_STYLE[event.status] || TIMELINE_STATUS_STYLE.PENDIENTE
  const [expanded, setExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const anim = useRef(new Animated.Value(0)).current
  const showDetailsRef = useRef(false)
  showDetailsRef.current = showDetails

  useEffect(() => {
    if (expanded && !showDetails) {
      setShowDetails(true)
      Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start()
    } else if (!expanded && showDetails) {
      Animated.timing(anim, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
        if (!showDetailsRef.current) setShowDetails(false)
      })
    }
  }, [expanded, anim, showDetails])

  const hasDetails = !!event.description || !!(event.metadata && Object.keys(event.metadata).length)
    || (event.photos && event.photos.length > 0)
  const expandable = hasDetails && event.status !== 'PENDIENTE'

  const toggle = () => {
    if (expandable) setExpanded(prev => !prev)
  }

  const nodeIcon = event.status === 'COMPLETADO'
    ? 'check'
    : event.status === 'PENDIENTE'
      ? 'circle-outline'
      : (config.icon || 'circle')

  const nodeBg = event.status === 'COMPLETADO'
    ? theme.colors.background.paper
    : statusStyle.color

  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.timeline}>
        <View style={styles.nodeColumn}>
          <Pressable
            onPress={toggle}
            accessibilityRole={expandable ? 'button' : 'none'}
            accessibilityLabel={`${config.title || event.type} ${formatDateTime(event.dateTime)}. ${statusStyle.label}`}
            style={[
              styles.node,
              { borderColor: statusStyle.color, backgroundColor: nodeBg },
            ]}
          >
            <Icon
              source={nodeIcon}
              size={event.status === 'PENDIENTE' ? 18 : 16}
              color={event.status === 'PENDIENTE' ? statusStyle.color : theme.colors.text.inverse}
            />
          </Pressable>
          <TimelineConnector isLast={isLast} color={statusStyle.color} />
        </View>
        <Pressable
          onPress={toggle}
          accessibilityRole={expandable ? 'button' : 'none'}
          accessibilityLabel={`${config.title || event.type} ${formatDateTime(event.dateTime)}. ${statusStyle.label}. ${expandable ? (expanded ? 'Colapsar detalle' : 'Expandir detalle') : ''}`}
          style={styles.contentPressable}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title} numberOfLines={2}>
                {config.title || event.type || 'Evento'}
              </Text>
              <Text style={styles.date}>{formatDateTime(event.dateTime)}</Text>
            </View>
            <View style={styles.badgeColumn}>
              <StatusBadge status={event.status} />
              {expandable ? (
                <Icon source={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={theme.colors.text.tertiary} />
              ) : null}
            </View>
          </View>
          <Text style={styles.summary} numberOfLines={2}>
            {event.description || 'Sin detalles adicionales'}
          </Text>

          {showDetails ? (
            <Animated.View
              style={{ opacity: anim, transform: [{ translateY: Animated.multiply(anim, -4) }] }}
            >
              <TimelineEventDetails event={event} photosRenderer={photosRenderer} />
            </Animated.View>
          ) : null}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: theme.spacing[1],
  },
  timeline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nodeColumn: {
    alignItems: 'center',
    width: NODE_SIZE + theme.spacing[2],
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentPressable: {
    flex: 1,
    paddingLeft: theme.spacing[3],
    paddingRight: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    minHeight: 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  badgeColumn: {
    alignItems: 'flex-end',
    gap: theme.spacing[1],
  },
  statusLabel: {
    ...theme.typography.caption,
    fontFamily: theme.fontFamily.medium,
    textAlign: 'right',
  },
  summary: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
})