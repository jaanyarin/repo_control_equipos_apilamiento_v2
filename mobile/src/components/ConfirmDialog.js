import React from 'react'
import { Dialog, Portal, Text } from 'react-native-paper'
import AppButton from './AppButton'

export default function ConfirmDialog({ visible, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', tone = 'primary', loading = false, onConfirm, onCancel }) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={loading ? undefined : onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content><Text variant="bodyMedium">{message}</Text></Dialog.Content>
        <Dialog.Actions>
          <AppButton tone="text" onPress={onCancel} disabled={loading}>{cancelLabel}</AppButton>
          <AppButton tone={tone} onPress={onConfirm} loading={loading}>{confirmLabel}</AppButton>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
