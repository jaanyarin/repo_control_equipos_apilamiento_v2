import React from 'react'
import { IconButton } from 'react-native-paper'
import { theme } from '../theme'

export default function AppIconButton({ icon, accessibilityLabel, iconColor = theme.colors.text.primary, size = 24, style, ...props }) {
  return (
    <IconButton
      {...props}
      icon={icon}
      size={size}
      iconColor={iconColor}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[{ width: 44, height: 44, margin: 0 }, style]}
    />
  )
}
