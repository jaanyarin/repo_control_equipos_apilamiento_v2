import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import AppButton from './AppButton'
import { theme } from '../theme'

export default function PhotoPicker({ photos = [], minimum = 0, onTakePhoto, onSelectFile, disabled = false }) {
  return (
    <View style={{ gap: theme.spacing[3] }}>
      <Text style={theme.typography.subtitle2}>Evidencias fotográficas ({photos.length}{minimum ? `/${minimum} mínimo` : ''})</Text>
      <View style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
        <AppButton icon="camera" onPress={onTakePhoto} disabled={disabled} style={{ flex: 1 }}>Tomar foto</AppButton>
        {onSelectFile ? <AppButton tone="secondary" icon="image" onPress={onSelectFile} disabled={disabled} style={{ flex: 1 }}>Seleccionar</AppButton> : null}
      </View>
    </View>
  )
}
