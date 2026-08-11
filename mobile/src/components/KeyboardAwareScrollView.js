import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native'

/**
 * Contenedor que evita que el teclado cubra los inputs.
 * - Android: behavior="height" (ajusta la altura del contenedor al teclado).
 * - iOS: behavior="padding" (agrega padding inferior igual a la altura del teclado).
 *
 * Props adicionales:
 * - `behavior`: anula el behavior por plataforma.
 * - `keyboardVerticalOffset`: desplazamiento vertical del teclado (útil en iOS
 *   para descontar la altura del header). Por defecto 0.
 */
export default function KeyboardAwareScrollView({
  children,
  style,
  contentContainerStyle,
  behavior,
  keyboardVerticalOffset = 0,
  keyboardShouldPersistTaps = 'handled',
  ...props
}) {
  const resolvedBehavior = behavior || (Platform.OS === 'ios' ? 'padding' : 'height')

  return (
    <KeyboardAvoidingView
      style={[styles.flex, style]}
      behavior={resolvedBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        {...props}
        style={styles.flex}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
})
