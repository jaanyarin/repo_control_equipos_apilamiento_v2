import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import AppIconButton from './AppIconButton'
import { theme } from '../theme'

export default function AppHeader({ title, showBack = false, onBack, actions = [] }) {
  return (
    <View style={{ height: 56, paddingHorizontal: theme.spacing[4], flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.action.primary }}>
      {showBack ? <AppIconButton icon="arrow-left" iconColor={theme.colors.text.inverse} accessibilityLabel="Volver" onPress={onBack} /> : null}
      <Text numberOfLines={1} style={[theme.typography.h4, { color: theme.colors.text.inverse, flex: 1, marginLeft: showBack ? theme.spacing[2] : 0 }]}>{title}</Text>
      {actions.slice(0, 2).map(action => <AppIconButton key={action.icon} {...action} iconColor={theme.colors.text.inverse} />)}
    </View>
  )
}
