import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, IconButton } from 'react-native-paper'
import AppButton from './AppButton'
import { theme } from '../theme'

export default function EmptyState({ icon = 'information', title, subtitle, actionLabel, onAction, tone = 'neutral' }) {
  const iconColor = tone === 'error' ? theme.colors.status.error : theme.colors.text.tertiary
  return (
    <View style={styles.container}>
      <IconButton icon={icon} size={56} iconColor={iconColor} accessibilityLabel={title} />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="bodySmall" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? <AppButton onPress={onAction} style={styles.action}>{actionLabel}</AppButton> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
  },
  title: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  action: { marginTop: theme.spacing[4] },
})
