import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { theme } from '../theme'

export default function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.action.secondary} />
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.page,
  },
  message: {
    ...theme.typography.body1,
    marginTop: theme.spacing[4],
    color: theme.colors.text.secondary,
  },
})
