import React from 'react'
import { Chip } from 'react-native-paper'
import { theme } from '../theme'

export default function StatusChip({ status = 'info', label, style }) {
  const config = theme.statusStyles[status] || theme.statusStyles.info
  return (
    <Chip compact style={[{ height: 28, borderRadius: theme.radius.pill, backgroundColor: config.backgroundColor }, style]} textStyle={[theme.typography.caption, { color: config.color, fontFamily: theme.fontFamily.medium }]}>
      {label || config.label}
    </Chip>
  )
}
