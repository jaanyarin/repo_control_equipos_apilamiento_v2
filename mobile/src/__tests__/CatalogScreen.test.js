import React from 'react'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { Alert } from 'react-native'
import CatalogScreen from '../screens/CatalogScreen'

const mockGet = jest.fn()
const mockPost = jest.fn()
const mockPut = jest.fn()
const mockSetOptions = jest.fn()

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
    put: (...args) => mockPut(...args),
  },
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ setOptions: mockSetOptions, navigate: jest.fn() }),
  useFocusEffect: (callback) => {
    const reactModule = require('react')
    reactModule.useEffect(() => callback(), [callback])
  },
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

const props = {
  title: 'Marcas',
  endpoint: '/marcas',
  searchPlaceholder: 'Buscar por nombre de marca',
  searchFields: ['nombre', 'codigo'],
  emptyMessage: 'No hay marcas registradas',
  canEdit: true,
  fields: [
    { key: 'nombre', label: 'Nombre', required: true, primary: true },
    { key: 'codigo', label: 'Código', required: false },
  ],
}

describe('CatalogScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPost.mockResolvedValue({ data: { success: true } })
    mockPut.mockResolvedValue({ data: { success: true } })
    mockGet.mockResolvedValue({
      data: { success: true, data: [{ id: 1, nombre: 'Toyota', codigo: 'TOY', estadoActivo: true }] },
    })
  })

  it('muestra los campos del formulario al crear un nuevo registro', async () => {
    const screen = render(<CatalogScreen {...props} />)

    await waitFor(() => {
      expect(screen.getByText('Toyota')).toBeTruthy()
    })

    const headerOptions = mockSetOptions.mock.calls[0][0]
    const headerRight = typeof headerOptions.headerRight === 'function' ? headerOptions.headerRight() : headerOptions.headerRight
    act(() => { headerRight.props.onPress() })

    await waitFor(() => {
      expect(screen.getByTestId('input-Nombre')).toBeTruthy()
      expect(screen.getByTestId('input-Código')).toBeTruthy()
    })
  })

  it('muestra los campos del formulario al editar un registro existente', async () => {
    const screen = render(<CatalogScreen {...props} />)

    await waitFor(() => {
      expect(screen.getByText('Toyota')).toBeTruthy()
    })

    fireEvent.press(screen.getByLabelText('Editar Marcas: Toyota'))

    await waitFor(() => {
      expect(screen.getByTestId('input-Nombre')).toBeTruthy()
      expect(screen.getByTestId('input-Código').props.value).toBe('TOY')
    })
  })

  it('oculta el campo derivado y autocompleta su valor desde el campo base al guardar', async () => {
    const marcasyProps = {
      ...props,
      fields: [
        { key: 'nombre', label: 'Nombre', required: true, primary: true },
        { key: 'codigo', label: 'Código', required: false, autoFrom: 'nombre' },
      ],
    }
    const screen = render(<CatalogScreen {...marcasyProps} />)

    await waitFor(() => {
      expect(screen.getByText('Toyota')).toBeTruthy()
    })

    const headerOptions = mockSetOptions.mock.calls[0][0]
    const headerRight = typeof headerOptions.headerRight === 'function' ? headerOptions.headerRight() : headerOptions.headerRight
    act(() => { headerRight.props.onPress() })

    await waitFor(() => {
      expect(screen.getByTestId('input-Nombre')).toBeTruthy()
    })
    expect(screen.queryByTestId('input-Código')).toBeNull()

    fireEvent.changeText(screen.getByTestId('input-Nombre'), 'Hyundai')
    fireEvent.press(screen.getByTestId('button-Crear'))

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/marcas', { nombre: 'Hyundai', codigo: 'Hyundai' })
    })
  })

  it('desactiva un catálogo enviando PUT con estadoActivo=false', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    const screen = render(<CatalogScreen {...props} />)

    await waitFor(() => {
      expect(screen.getByText('Toyota')).toBeTruthy()
    })

    fireEvent.press(screen.getByLabelText('Desactivar Toyota'))
    expect(alertSpy).toHaveBeenCalled()
    const buttons = alertSpy.mock.calls[0][2]
    const confirm = buttons.find(b => b.text === 'Desactivar')
    await act(async () => { confirm.onPress() })

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/marcas/1', { nombre: 'Toyota', codigo: 'TOY', estadoActivo: false })
    })
    alertSpy.mockRestore()
  })

  it('reactiva un catálogo mostrando "Inactivo" y enviando PUT con estadoActivo=true', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: true, data: [{ id: 1, nombre: 'Toyota', codigo: 'TOY', estadoActivo: false }] },
    })
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {})
    const screen = render(<CatalogScreen {...props} />)

    await waitFor(() => {
      expect(screen.getByText('Toyota')).toBeTruthy()
      expect(screen.getByText('Inactivo')).toBeTruthy()
    })

    fireEvent.press(screen.getByLabelText('Activar Toyota'))
    const buttons = alertSpy.mock.calls[0][2]
    const confirm = buttons.find(b => b.text === 'Activar')
    await act(async () => { confirm.onPress() })

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/marcas/1', { nombre: 'Toyota', codigo: 'TOY', estadoActivo: true })
    })
    alertSpy.mockRestore()
  })
})
