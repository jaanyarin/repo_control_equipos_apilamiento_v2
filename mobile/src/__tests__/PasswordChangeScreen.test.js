import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import PasswordChangeScreen from '../screens/PasswordChangeScreen'

const mockPost = jest.fn()
const mockSetToken = jest.fn()
const mockRefreshUser = jest.fn()

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    post: (...args) => mockPost(...args),
  },
  setToken: (...args) => mockSetToken(...args),
}))

jest.mock('../AuthContext', () => ({
  useAuth: () => ({
    user: { sub: '15', nombre: 'Usuario Prueba', passwordResetRequired: true },
    refreshUser: mockRefreshUser,
    logout: jest.fn(),
  }),
}))

jest.mock('../theme', () => ({
  theme: {
    colors: {
      background: { backdrop: 'rgba(0,0,0,0.5)' },
      action: { primary: '#123' },
      text: { inverse: '#fff' },
      status: { error: '#f00', success: '#0a0' },
    },
    fontFamily: { medium: 'System' },
    spacing: [0, 4, 8, 12, 16, 20, 24],
  },
}))

jest.mock('react-native-paper', () => {
  const React = require('react')
  const { Pressable, Text: NativeText, TextInput: NativeInput, View } = require('react-native')
  return {
    Text: ({ children, ...props }) => <NativeText {...props}>{children}</NativeText>,
    Surface: ({ children }) => <View>{children}</View>,
    TextInput: ({ label, onChangeText, ...props }) => (
      <NativeInput testID={`input-${label}`} onChangeText={onChangeText} {...props} />
    ),
    Button: ({ children, onPress, disabled }) => (
      <Pressable testID={`button-${typeof children === 'string' ? children : 'loading'}`} onPress={onPress} disabled={disabled}>
        <NativeText>{children}</NativeText>
      </Pressable>
    ),
    ActivityIndicator: () => <NativeText>Cargando</NativeText>,
  }
})

describe('PasswordChangeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPost.mockResolvedValue({ data: { token: 'token-definitivo' } })
  })

  it('envía solo la nueva contraseña y actualiza la sesión', async () => {
    const screen = render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 360, height: 640 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <PasswordChangeScreen />
      </SafeAreaProvider>
    )

    fireEvent.changeText(screen.getByTestId('input-Nueva contraseña'), 'NuevaClave2026')
    fireEvent.changeText(screen.getByTestId('input-Confirmar contraseña'), 'NuevaClave2026')
    fireEvent.press(screen.getByTestId('button-Cambiar contraseña'))

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/auth/change-password', {
        newPassword: 'NuevaClave2026',
      })
      expect(mockSetToken).toHaveBeenCalledWith('token-definitivo')
      expect(mockRefreshUser).toHaveBeenCalledWith('token-definitivo')
    })
  })
})
