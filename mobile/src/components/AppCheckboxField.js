import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Checkbox, Text, TouchableRipple } from 'react-native-paper'
import { theme } from '../theme'

export default function AppCheckboxField({ label, value, onChange, disabled = false }) {
  return (
    <TouchableRipple
      onPress={disabled ? undefined : () => onChange(!value)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: Boolean(value), disabled }}
      style={styles.wrapper}
    >
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Checkbox
          status={value ? 'checked' : 'unchecked'}
          onPress={disabled ? undefined : () => onChange(!value)}
          disabled={disabled}
        />
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    flex: 1,
  },
})
