import React from 'react'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import ProveedoresScreen from '../screens/ProveedoresScreen'
import TiposEquipoScreen from '../screens/TiposEquipoScreen'
import SedesScreen from '../screens/SedesScreen'
import MotivosPsrScreen from '../screens/MotivosPsrScreen'

const mockGet = jest.fn()
const mockPost = jest.fn()
const mockSetOptions = jest.fn()

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ setOptions: mockSetOptions, navigate: jest.fn() }),
  useFocusEffect: (callback) => {
    const reactModule = require('react')
    reactModule.useEffect(() => callback(), [callback])
  },
}))

jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { rolNombre: 'Super Admin' } }),
}))

jest.mock('../theme', () => ({
  theme: {
    colors: {
      background: { page: '#fff', paper: '#fff', neutral: '#eee' },
      text: { primary: '#111', secondary: '#555', inverse: '#fff', tertiary: '#999' },
      action: { primary: '#1976d2' },
      status: { error: '#f00' },
    },
    radius: { sm: 4, md: 8 },
    spacing: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
    typography: { title: {}, subtitle: {}, body: {}, body2: {} },
  },
}))

jest.mock('react-native-paper', () => {
  const React = require('react')
  const { Pressable, Text: NativeText, TextInput: NativeInput, View } = require('react-native')
  const Dialog = ({ visible, children }) => (visible ? <View>{children}</View> : null)
  Dialog.Title = ({ children }) => <NativeText>{children}</NativeText>
  Dialog.ScrollArea = ({ children }) => <View>{children}</View>
  Dialog.Actions = ({ children }) => <View>{children}</View>
  return {
    Text: ({ children }) => <NativeText>{children}</NativeText>,
    Searchbar: ({ placeholder, onChangeText, value }) => (
      <NativeInput testID="search" placeholder={placeholder} value={value} onChangeText={onChangeText} />
    ),
    IconButton: ({ accessibilityLabel, onPress }) => (
      <Pressable testID={`icon-${accessibilityLabel}`} accessibilityLabel={accessibilityLabel} onPress={onPress} />
    ),
    Portal: ({ children }) => <>{children}</>,
    Dialog,
  }
})

jest.mock('../components/AppCard', () => {
  const React = require('react')
  const { View } = require('react-native')
  return ({ children, ...props }) => <View {...props}>{children}</View>
})

jest.mock('../components/AppInput', () => {
  const React = require('react')
  const { TextInput } = require('react-native')
  return ({ label, ...props }) => <TextInput testID={`input-${label}`} {...props} />
})

jest.mock('../components/AppTextArea', () => {
  const React = require('react')
  const { TextInput } = require('react-native')
  return ({ label, ...props }) => <TextInput testID={`input-${label}`} {...props} />
})

jest.mock('../components/AppButton', () => {
  const React = require('react')
  const { Pressable, Text } = require('react-native')
  return ({ children, onPress }) => (
    <Pressable testID={`button-${children}`} onPress={onPress}>
      <Text>{children}</Text>
    </Pressable>
  )
})

jest.mock('../components/AppIconButton', () => {
  const React = require('react')
  const { Pressable } = require('react-native')
  return ({ accessibilityLabel, onPress }) => (
    <Pressable testID={`icon-btn-${accessibilityLabel}`} accessibilityLabel={accessibilityLabel} onPress={onPress} />
  )
})

jest.mock('../components/ErrorBoundary', () => {
  const React = require('react')
  return ({ children }) => <>{children}</>
})

jest.mock('../components/LoadingScreen', () => {
  const React = require('react')
  const { Text } = require('react-native')
  return () => <Text>Cargando</Text>
})

jest.mock('../components/EmptyState', () => {
  const React = require('react')
  const { Text } = require('react-native')
  return ({ title }) => <Text>{title}</Text>
})

jest.mock('../components/ErrorState', () => {
  const React = require('react')
  const { Text } = require('react-native')
  return ({ message }) => <Text>{message}</Text>
})

const endpoints = {
  proveedores: '/proveedores',
  'tipos-equipo': '/tipos-equipo',
  sedes: '/sedes',
  'motivos-psr': '/motivos-psr',
}

async function openCreateDialog(component) {
  const screen = render(component)
  await waitFor(() => {
    expect(mockSetOptions.mock.calls.length).toBeGreaterThan(0)
  })
  const headerOptions = mockSetOptions.mock.calls[0][0]
  const headerRight = typeof headerOptions.headerRight === 'function' ? headerOptions.headerRight() : headerOptions.headerRight
  act(() => { headerRight.props.onPress() })
  return screen
}

describe('Formularios simplificados de catálogos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPost.mockResolvedValue({ data: { success: true } })
    mockGet.mockImplementation(endpoint => ({
      data: { success: true, data: [{ id: 1, nombre: `Item ${endpoint}`, razonSocial: `Item ${endpoint}`, codigo: 'ITM1' }] },
    }))
  })

  it('Proveedor: solo Razón Social obligatoria, RUC y Código ocultos, codigo = razonSocial', async () => {
    const screen = await openCreateDialog(<ProveedoresScreen />)
    await waitFor(() => expect(screen.getByTestId('input-Razón Social')).toBeTruthy())
    expect(screen.queryByTestId('input-RUC')).toBeNull()
    expect(screen.queryByTestId('input-Código')).toBeNull()

    fireEvent.changeText(screen.getByTestId('input-Razón Social'), 'Distribuidora Andina')
    fireEvent.press(screen.getByTestId('button-Crear'))
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(endpoints.proveedores, { razonSocial: 'Distribuidora Andina', codigo: 'Distribuidora Andina' })
    })
  })

  it('Tipo de equipo: solo Nombre obligatorio, Descripción y Código ocultos, codigo = nombre', async () => {
    const screen = await openCreateDialog(<TiposEquipoScreen />)
    await waitFor(() => expect(screen.getByTestId('input-Nombre')).toBeTruthy())
    expect(screen.queryByTestId('input-Descripción')).toBeNull()
    expect(screen.queryByTestId('input-Código')).toBeNull()

    fireEvent.changeText(screen.getByTestId('input-Nombre'), 'Montacargas Eléctrico')
    fireEvent.press(screen.getByTestId('button-Crear'))
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(endpoints['tipos-equipo'], { nombre: 'Montacargas Eléctrico', codigo: 'Montacargas Eléctrico' })
    })
  })

  it('Sede: solo Nombre obligatorio, Dirección y Código ocultos, codigo = nombre', async () => {
    const screen = await openCreateDialog(<SedesScreen />)
    await waitFor(() => expect(screen.getByTestId('input-Nombre')).toBeTruthy())
    expect(screen.queryByTestId('input-Dirección')).toBeNull()
    expect(screen.queryByTestId('input-Código')).toBeNull()

    fireEvent.changeText(screen.getByTestId('input-Nombre'), 'Packing Uva')
    fireEvent.press(screen.getByTestId('button-Crear'))
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(endpoints.sedes, { nombre: 'Packing Uva', codigo: 'Packing Uva' })
    })
  })

  it('Motivo PSR: Nombre completo y Nombre corto obligatorios y en mayúsculas, guarda ambos', async () => {
    const screen = await openCreateDialog(<MotivosPsrScreen />)
    await waitFor(() => expect(screen.getByTestId('input-Nombre completo')).toBeTruthy())
    expect(screen.getByTestId('input-Nombre corto')).toBeTruthy()

    fireEvent.changeText(screen.getByTestId('input-Nombre completo'), 'Daño por manipulación')
    expect(screen.getByTestId('input-Nombre completo').props.value).toBe('DAÑO POR MANIPULACIÓN')
    fireEvent.changeText(screen.getByTestId('input-Nombre corto'), 'Daño')
    expect(screen.getByTestId('input-Nombre corto').props.value).toBe('DAÑO')
    fireEvent.press(screen.getByTestId('button-Crear'))
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(endpoints['motivos-psr'], { nombre: 'DAÑO POR MANIPULACIÓN', nombreCorto: 'DAÑO' })
    })
  })
})
