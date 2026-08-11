import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import CreateEditUserScreen from '../screens/CreateEditUserScreen'

const mockGet = jest.fn()
const mockPost = jest.fn()
const mockPut = jest.fn()
const mockPopTo = jest.fn()
let mockRouteParams = {}

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
    put: (...args) => mockPut(...args),
  },
}))

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: mockRouteParams }),
  useNavigation: () => ({
    popTo: mockPopTo,
    navigate: jest.fn(),
  }),
  useFocusEffect: (callback) => {
    const reactModule = require('react')
    reactModule.useEffect(() => {
      return callback()
    }, [callback])
  },
}))

jest.mock('../theme', () => ({
  theme: {
    colors: {
      background: { page: '#fff', neutral: '#eee' },
      text: { primary: '#111', secondary: '#555' },
    },
    radius: { sm: 4 },
    spacing: [0, 4, 8, 12, 16, 20, 24, 28, 32],
    typography: { title: {}, subtitle: {}, caption: {} },
  },
}))

jest.mock('react-native-paper', () => {
  const React = require('react')
  const { Text: NativeText } = require('react-native')
  return {
    Text: ({ children }) => <NativeText>{children}</NativeText>,
    HelperText: ({ children }) => <NativeText>{children}</NativeText>,
  }
})

jest.mock('../components/AppCard', () => {
  const React = require('react')
  const { View } = require('react-native')
  return ({ children }) => <View>{children}</View>
})

jest.mock('../components/AppInput', () => {
  const React = require('react')
  const { TextInput } = require('react-native')
  return ({ label, ...props }) => <TextInput testID={`input-${label}`} {...props} />
})

jest.mock('../components/AppSelect', () => {
  const React = require('react')
  const { Pressable, Text } = require('react-native')
  return ({ label, onChange, options, value, disabled }) => {
    const selected = options.find(option => option.value === value)
    return (
      <Pressable
        testID={`select-${label}`}
        disabled={disabled}
        onPress={() => {
          if (!disabled) onChange(options[0].value)
        }}
      >
        <Text>{selected?.label || 'Seleccionar'}</Text>
        <Text>{options.map(option => option.label).join('|')}</Text>
      </Pressable>
    )
  }
})

jest.mock('../components/AppButton', () => {
  const React = require('react')
  const { Pressable, Text } = require('react-native')
  return ({ children, onPress }) => (
    <Pressable testID="submit-user" onPress={onPress}>
      <Text>{children}</Text>
    </Pressable>
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

jest.mock('../components/ErrorState', () => {
  const React = require('react')
  const { Text } = require('react-native')
  return ({ message }) => <Text>{message}</Text>
})

describe('CreateEditUserScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRouteParams = {}
    mockPost.mockResolvedValue({ data: { success: true } })
    mockPut.mockResolvedValue({ data: { success: true } })
    mockGet.mockImplementation(endpoint => {
      const responses = {
        '/roles': {
          data: {
            success: true,
            data: [
              { id: 1, nombre: 'Super Admin', estadoActivo: true },
              { id: 2, nombre: 'Admin', estadoActivo: true },
              { id: 3, nombre: 'Usuario', estadoActivo: true },
            ],
          },
        },
        '/sedes': {
          data: {
            success: true,
            data: [
              { id: 10, nombre: 'Packing Uva', codigo: 'PACKING_UVA', estadoActivo: true },
              { id: 11, nombre: 'Packing Arándano', codigo: 'PACKING_ARANDANO', estadoActivo: true },
            ],
          },
        },
      }
      return Promise.resolve(responses[endpoint])
    })
  })

  it('muestra solo Nombre, Rol y Ubicación', async () => {
    const screen = render(<CreateEditUserScreen />)

    await waitFor(() => {
      expect(screen.getByTestId('input-Nombre')).toBeTruthy()
      expect(screen.getByTestId('select-Rol')).toBeTruthy()
      expect(screen.getByTestId('select-Ubicación')).toBeTruthy()
    })

    expect(screen.queryByTestId('input-Correo')).toBeNull()
    expect(screen.queryByTestId('input-Área')).toBeNull()
    expect(screen.queryByTestId('input-Puesto')).toBeNull()
    expect(screen.queryByTestId('input-Empresa')).toBeNull()
    expect(screen.queryByTestId('input-Departamento')).toBeNull()
  })

  it('crea el usuario solo con el nombre (rol y ubicación opcionales)', async () => {
    const screen = render(<CreateEditUserScreen />)

    await waitFor(() => {
      expect(screen.getByTestId('input-Nombre')).toBeTruthy()
    })

    fireEvent.changeText(screen.getByTestId('input-Nombre'), 'Juan Pérez')
    fireEvent.press(screen.getByTestId('submit-user'))

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/usuarios', {
        nombre: 'Juan Pérez',
        rolId: null,
        ubicacion: null,
      })
      expect(mockPopTo).toHaveBeenCalledWith('Usuarios')
    })
  })

  it('crea el usuario seleccionando rol y ubicación desde los catálogos', async () => {
    const screen = render(<CreateEditUserScreen />)

    await waitFor(() => {
      expect(screen.getByTestId('select-Rol')).toBeTruthy()
    })

    fireEvent.changeText(screen.getByTestId('input-Nombre'), 'Ana López')
    fireEvent.press(screen.getByTestId('select-Rol'))
    fireEvent.press(screen.getByTestId('select-Ubicación'))
    fireEvent.press(screen.getByTestId('submit-user'))

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/usuarios', {
        nombre: 'Ana López',
        rolId: 2,
        ubicacion: 'Packing Uva',
      })
    })
  })

  it('edita el usuario preservando sus valores', async () => {
    mockRouteParams = {
      user: { id: 5, nombre: 'Pepe', rolId: 2, ubicacion: 'Packing Uva' },
    }

    const screen = render(<CreateEditUserScreen />)

    await waitFor(() => {
      expect(screen.getByTestId('input-Nombre')).toBeTruthy()
    })

    expect(screen.getByTestId('input-Nombre').props.value).toBe('Pepe')
    fireEvent.changeText(screen.getByTestId('input-Nombre'), 'Pepe Actualizado')
    fireEvent.press(screen.getByTestId('submit-user'))

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/usuarios/5', {
        nombre: 'Pepe Actualizado',
        rolId: 2,
        ubicacion: 'Packing Uva',
      })
    })
  })

  it('editar al Super Admin protegido (id=1) fuerza rolId=1 y no lo cambia', async () => {
    mockRouteParams = {
      user: { id: 1, nombre: 'Super Admin', rolId: 1, ubicacion: '' },
    }

    const screen = render(<CreateEditUserScreen />)

    await waitFor(() => {
      expect(screen.getByTestId('input-Nombre')).toBeTruthy()
    })

    expect(screen.getByText('Super Admin')).toBeTruthy()

    fireEvent.changeText(screen.getByTestId('input-Nombre'), 'Super Admin Editado')
    fireEvent.press(screen.getByTestId('select-Rol'))
    fireEvent.press(screen.getByTestId('submit-user'))

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/usuarios/1', {
        nombre: 'Super Admin Editado',
        rolId: 1,
        ubicacion: null,
      })
    })
  })
})
