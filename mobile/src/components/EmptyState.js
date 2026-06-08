import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, IconButton } from 'react-native-paper'

export default function EmptyState({ icon = 'information', title, subtitle }) {
  return (
    <View style={styles.container}>
      <IconButton icon={icon} size={64} iconColor="#888" />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="bodySmall" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
  },
})
