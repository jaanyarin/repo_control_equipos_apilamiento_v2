import React from 'react'
import { Pressable, Text } from 'react-native'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { AuthProvider, useAuth } from '../AuthContext'

const mockGetToken = jest.fn()
const mockParseToken = jest.fn()

jest.mock('../api', () => ({
  getToken: (...args) => mockGetToken(...args),
  parseToken: (...args) => mockParseToken(...args),
  removeToken: jest.fn(),
}))

function AuthStateProbe() {
  const { user, loading, refreshUser } = useAuth()

  if (loading) return <Text>Cargando</Text>

  return (
    <>
      <Text>{user?.passwordResetRequired ? 'Cambiar contraseña' : 'Login'}</Text>
      <Pressable testID="complete-login" onPress={() => refreshUser('jwt-primer-acceso')}>
        <Text>Completar login</Text>
      </Pressable>
    </>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetToken.mockResolvedValue(null)
    mockParseToken.mockImplementation(token => token
      ? { sub: '15', nombre: 'Usuario nuevo', passwordResetRequired: true }
      : null)
  })

  it('publica inmediatamente el usuario de primer acceso usando el JWT del login', async () => {
    const screen = render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText('Login')).toBeTruthy())

    await act(async () => {
      fireEvent.press(screen.getByTestId('complete-login'))
    })

    await waitFor(() => expect(screen.getByText('Cambiar contraseña')).toBeTruthy())
    expect(mockParseToken).toHaveBeenCalledWith('jwt-primer-acceso')
    expect(mockGetToken).toHaveBeenCalledTimes(1)
  }, 15000)
})
