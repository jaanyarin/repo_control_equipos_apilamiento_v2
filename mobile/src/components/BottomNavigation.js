import React from 'react'
import { View } from 'react-native'
import AppButton from './AppButton'
import { theme } from '../theme'

export default function BottomNavigation({ actions = [], style }) {
  return (
    <View style={[{ flexDirection: 'row', minHeight: 64, padding: theme.spacing[2], backgroundColor: theme.colors.background.paper, borderTopWidth: 1, borderTopColor: theme.colors.border.subtle }, style]}>
      {actions.map(action => <AppButton key={action.label} tone="text" icon={action.icon} onPress={action.onPress} style={{ flex: 1 }}>{action.label}</AppButton>)}
    </View>
  )
}
