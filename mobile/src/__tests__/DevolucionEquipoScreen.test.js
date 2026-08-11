import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import DevolucionEquipoScreen from '../screens/DevolucionEquipoScreen'

const mockGet = jest.fn()
const mockPut = jest.fn()
const mockPost = jest.fn()
const mockLaunchCamera = jest.fn()
const mockLoadApiUrl = jest.fn()
const mockGetToken = jest.fn()
const mockPopTo = jest.fn()

const TIPOS = [
  'DEVOLUCION_FRONTAL',
  'DEVOLUCION_LATERAL_IZQUIERDO',
  'DEVOLUCION_LATERAL_DERECHO',
  'DEVOLUCION_POSTERIOR',
]

const EQUIPO = {
  id: 5,
  codigo: 'EQ-01',
  modelo: 'MOD-X',
  marcaNombre: 'TCM',
  tipoEquipoNombre: 'Apilador',
  horometroInicio: 1234.5,
}

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    put: (...args) => mockPut(...args),
    post: (...args) => mockPost(...args),
  },
  loadApiUrl: (...args) => mockLoadApiUrl(...args),
  getToken: (...args) => mockGetToken(...args),
}))

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { id: 5 } }),
  useNavigation: () => ({ popTo: mockPopTo, goBack: jest.fn() }),
}))

jest.mock('react-native-image-picker', () => ({
  launchCamera: (...args) => mockLaunchCamera(...args),
}))

jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    fs: { dirs: { PictureDir: '/pics', DownloadDir: '/downloads' } },
    config: jest.fn(() => ({
      fetch: jest.fn().mockResolvedValue({ info: () => ({ statusCode: 200 }) }),
    })),
  },
}))

jest.mock('../theme', () => ({
  theme: {
    colors: {
      background: { page: '#fff', paper: '#fff', neutral: '#eee' },
      text: { primary: '#111', secondary: '#555', tertiary: '#888', inverse: '#fff', link: '#006' },
      border: { subtle: '#ddd', strong: '#ccc', focus: '#006' },
      action: { primary: '#006', secondary: '#006' },
      status: { warning: '#f90', error: '#d00' },
    },
    radius: { sm: 4, md: 8 },
    spacing: [0, 4, 8, 12, 16, 20, 24, 28, 32],
    typography: { title: {}, subtitle1: {}, body2: {}, caption: {}, button: {} },
  },
}))

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

jest.mock('../components/AppButton', () => {
  const React = require('react')
  const { View, Text } = require('react-native')
  return ({ children, onPress, disabled }) => (
    <View testID={`btn-${children}`} onPress={onPress} disabled={disabled}>
      <Text>{children}</Text>
    </View>
  )
})

jest.mock('../components/ZoomableImage', () => () => null)
jest.mock('../components/ErrorState', () => () => null)
jest.mock('../components/LoadingScreen', () => () => null)

jest.mock('react-native-paper', () => {
  const React = require('react')
  const { Text: NativeText } = require('react-native')
  return {
    Text: ({ children }) => <NativeText>{children}</NativeText>,
    Icon: () => null,
  }
})

describe('DevolucionEquipoScreen', () => {
  const renderScreen = () =>
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 360, height: 640 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <DevolucionEquipoScreen />
      </SafeAreaProvider>
    )

  const pathToRoot = instance => {
    const path = []
    let node = instance
    while (node) {
      path.unshift(node)
      node = node.parent
    }
    return path
  }

  const mockAllEvidencias = () => {
    mockGet.mockImplementation(url => {
      if (String(url).includes('/evidencias')) {
        return Promise.resolve({ data: { success: true, data: TIPOS.map(tipo => ({ tipo })) } })
      }
      return Promise.resolve({ data: { success: true, data: EQUIPO } })
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockImplementation(url => {
      if (String(url).includes('/evidencias')) {
        return Promise.resolve({ data: { success: true, data: [] } })
      }
      return Promise.resolve({ data: { success: true, data: EQUIPO } })
    })
    mockPost.mockResolvedValue({ data: { success: true, data: {} } })
    mockPut.mockResolvedValue({ data: { success: true } })
    mockLaunchCamera.mockResolvedValue({
      didCancel: false,
      errorCode: null,
      assets: [{ uri: 'file:///tmp/foto.jpg', type: 'image/jpeg', fileName: 'foto.jpg' }],
    })
  })

  it('muestra el horómetro inicial de solo lectura y el campo final', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByTestId('input-Horómetro final *')).toBeTruthy()
    })

    const inicial = screen.getByTestId('input-Horómetro inicial')
    expect(inicial.props.value).toBe('1234.5')
    expect(inicial.props.editable).toBe(false)
  })

  it('el horómetro final aparece debajo del inicial', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByTestId('input-Horómetro final *')).toBeTruthy()
    })

    const inicial = screen.getByTestId('input-Horómetro inicial')
    const final = screen.getByTestId('input-Horómetro final *')
    const pathInicial = pathToRoot(inicial)
    const pathFinal = pathToRoot(final)
    let i = 0
    while (i < pathInicial.length && i < pathFinal.length && pathInicial[i] === pathFinal[i]) i += 1
    const commonAncestor = pathInicial[i - 1]
    const idxInicial = commonAncestor.children.indexOf(pathInicial[i])
    const idxFinal = commonAncestor.children.indexOf(pathFinal[i])
    expect(idxInicial).toBeGreaterThan(-1)
    expect(idxFinal).toBeGreaterThan(-1)
    expect(idxInicial).toBeLessThan(idxFinal)
  })

  it('bloquea finalizar si el horómetro final no cumple el formato', async () => {
    mockAllEvidencias()
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByTestId('input-Horómetro final *')).toBeTruthy()
    })

    fireEvent.changeText(screen.getByTestId('input-Horómetro final *'), '1234')
    expect(screen.getByTestId('btn-Finalizar y devolver equipo').props.disabled).toBe(true)
  })

  it('bloquea finalizar si faltan fotos aunque el horómetro sea válido', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByTestId('input-Horómetro final *')).toBeTruthy()
    })

    fireEvent.changeText(screen.getByTestId('input-Horómetro final *'), '1234.5')
    expect(screen.getByTestId('btn-Finalizar y devolver equipo').props.disabled).toBe(true)
  })

  it('envía el horómetro final como número al finalizar', async () => {
    mockAllEvidencias()
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByTestId('input-Horómetro final *')).toBeTruthy()
    })

    fireEvent.changeText(screen.getByTestId('input-Horómetro final *'), '1234.5')

    await waitFor(() => {
      expect(screen.getByTestId('btn-Finalizar y devolver equipo').props.disabled).toBe(false)
    })

    fireEvent.press(screen.getByTestId('btn-Finalizar y devolver equipo'))

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/devolucion-equipos/5/finalizar', { horometroFin: 1234.5 })
    })
  })
})
