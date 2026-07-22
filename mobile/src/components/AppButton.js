import React from 'react'
import { Button } from 'react-native-paper'
import { theme } from '../theme'

const toneConfig = {
  primary: { mode: 'contained', buttonColor: theme.colors.action.primary, textColor: theme.colors.text.inverse },
  secondary: { mode: 'outlined', buttonColor: theme.colors.background.paper, textColor: theme.colors.action.secondary },
  destructive: { mode: 'contained', buttonColor: theme.colors.status.error, textColor: theme.colors.text.inverse },
  text: { mode: 'text', textColor: theme.colors.text.link },
}

export default function AppButton({ children, tone, variant, loading = false, disabled = false, fullWidth = false, style, contentStyle, accessibilityLabel, ...props }) {
  const config = toneConfig[tone || variant || 'primary'] || toneConfig.primary
  return (
    <Button
      {...props}
      {...config}
      loading={loading}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      style={[{ borderRadius: theme.radius.sm }, fullWidth && { width: '100%' }, style]}
      contentStyle={[{ minHeight: 48, paddingHorizontal: theme.spacing[2] }, contentStyle]}
      labelStyle={theme.typography.button}
    >
      {children}
    </Button>
  )
}
