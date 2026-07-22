import React, { useState } from 'react'
import { View } from 'react-native'
import { HelperText, TextInput } from 'react-native-paper'
import { theme } from '../theme'

export default function AppInput({ label, error, errorMessage, secureTextEntry = false, style, contentStyle, ...props }) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const resolvedError = errorMessage || error
  return (
    <View style={[{ width: '100%' }, style]}>
      <TextInput
        {...props}
        label={label}
        mode="outlined"
        error={Boolean(resolvedError)}
        secureTextEntry={secureTextEntry && !passwordVisible}
        outlineColor={theme.colors.border.strong}
        activeOutlineColor={theme.colors.border.focus}
        textColor={theme.colors.text.primary}
        contentStyle={[theme.typography.body1, { minHeight: 52 }, contentStyle]}
        style={{ backgroundColor: theme.colors.background.paper }}
        right={secureTextEntry ? <TextInput.Icon icon={passwordVisible ? 'eye-off-outline' : 'eye-outline'} onPress={() => setPasswordVisible(value => !value)} accessibilityLabel={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'} /> : undefined}
      />
      {resolvedError ? <HelperText type="error" visible>{resolvedError}</HelperText> : null}
    </View>
  )
}
