import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, HelperText, Menu, Text } from 'react-native-paper'
import { theme } from '../theme'

export default function AppSelect({ label, placeholder = 'Seleccionar', value, options = [], onChange, error, disabled = false, accessibilityLabel }) {
  const [visible, setVisible] = useState(false)
  const selected = options.find(option => option.value === value)
  return (
    <View style={{ width: '100%' }}>
      <Text style={[theme.typography.body2, { color: theme.colors.text.secondary, marginBottom: theme.spacing[1] }]}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            icon="chevron-down"
            contentStyle={{ minHeight: 52, flexDirection: 'row-reverse', justifyContent: 'space-between' }}
            textColor={selected ? theme.colors.text.primary : theme.colors.text.tertiary}
            style={{ borderRadius: theme.radius.sm, borderColor: error ? theme.colors.border.error : theme.colors.border.strong }}
            disabled={disabled}
            accessibilityLabel={accessibilityLabel || label}
            onPress={() => setVisible(true)}
          >
            {selected?.label || placeholder}
          </Button>
        }
      >
        {options.map(option => (
          <Menu.Item key={String(option.value)} title={option.label} onPress={() => { onChange(option.value, option); setVisible(false) }} />
        ))}
      </Menu>
      {error ? <HelperText type="error" visible>{error}</HelperText> : null}
    </View>
  )
}
