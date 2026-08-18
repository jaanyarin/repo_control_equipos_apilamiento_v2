import React from 'react'
import { View, StyleSheet } from 'react-native'
import { theme } from '../../../theme'

// Línea vertical que conecta los eventos de la timeline.
// - isLast: no dibuja la línea hacia abajo (final de la lista).
// - color: color de la línea (estado del evento superior).
export default function TimelineConnector({ isLast = false, color = theme.colors.border.subtle, height = 40 }) {
  if (isLast) return null
  return (
    <View
      style={[
        styles.line,
        {
          height,
          backgroundColor: color,
        },
      ]}
      accessibilityLabel=""
    />
  )
}

const styles = StyleSheet.create({
  line: {
    width: 2,
    alignSelf: 'center',
    marginVertical: 2,
  },
})
