import React from 'react'
import { Surface, TouchableRipple } from 'react-native-paper'
import { theme } from '../theme'

export default function AppCard({ children, style, accessibilityLabel, onPress, ...props }) {
  const card = (
    <Surface {...props} accessibilityLabel={accessibilityLabel} elevation={0} style={[theme.cardStyle, theme.shadows.z1, style]}>
      {children}
    </Surface>
  )

  if (!onPress) return card

  return (
    <TouchableRipple onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} borderless style={{ borderRadius: theme.radius.md }}>
      {card}
    </TouchableRipple>
  )
}
