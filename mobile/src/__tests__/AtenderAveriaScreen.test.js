import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AtenderAveriaScreen from '../screens/AtenderAveriaScreen'

const mockGet = jest.fn()
const mockPut = jest.fn()
const mockLaunchCamera = jest.fn()
const mockGoBack = jest.fn()

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    put: (...args) => mockPut(...args),
  },
}))

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { averiaId: 5 } }),
  useNavigation: () => ({
    goBack: mockGoBack,
    popTo: jest.fn(),
  }),
}))

jest.mock('react-native-image-picker', () => ({
  launchCamera: (...args) => mockLaunchCamera(...args),
}))

jest.mock('../theme', () => ({
  theme: {
    colors: {
      background: { page: '#fff', neutral: '#eee' },
      text: { primary: '#111', secondary: '#555', tertiary: '#888' },
      border: { subtle: '#ddd' },
      action: { secondary: '#fff' },
    },
    radius: { sm: 4 },
    spacing: [0, 4, 8, 12, 16, 20, 24, 28, 32],
    typography: { title: {}, subtitle: {}, caption: {}, body2: {} },
    fontFamily: { semiBold: 'sans-serif' },
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

jest.mock('../components/AppTextArea', () => {
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

jest.mock('../components/KeyboardAwareScrollView', () => {
  const React = require('react')
  const { ScrollView } = require('react-native')
  return ({ children, ...props }) => <ScrollView {...props}>{children}</ScrollView>
})

jest.mock('../components/ErrorBoundary', () => {
  const React = require('react')
  return ({ children }) => <>{children}</>
})

jest.mock('../components/LoadingScreen', () => {
  const React = require('react')
  const { View } = require('react-native')
  return () => <View />
})

jest.mock('../components/StatusChip', () => {
  const React = require('react')
  const { Text } = require('react-native')
  return ({ label }) => <Text>{label}</Text>
})

jest.mock('react-native-paper', () => {
  const React = require('react')
  const { Text: NativeText, View } = require('react-native')
  return {
    Text: ({ children }) => <NativeText>{children}</NativeText>,
    Divider: () => <View />,
  }
})

const averiaReportada = {
  id: 5,
  equipoId: 7,
  descripcionFalla: 'Falla en la horquilla del montacargas',
  horometro: 100.5,
  estadoAveria: 'REPORTADA',
}

describe('AtenderAveriaScreen', () => {
  const renderScreen = () =>
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 360, height: 640 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <AtenderAveriaScreen />
      </SafeAreaProvider>
    )

  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockResolvedValue({ data: { success: true, data: averiaReportada } })
    mockPut.mockResolvedValue({ data: { success: true } })
    mockLaunchCamera.mockResolvedValue({
      didCancel: false,
      errorCode: null,
      assets: [{ uri: 'file:///tmp/foto.jpg', type: 'image/jpeg', fileName: 'foto.jpg' }],
    })
  })

  const clickFotoSlot = async (screen) => {
    const botones = screen.getAllByTestId('btn-Tomar foto')
    for (const boton of botones) {
      fireEvent.press(boton)
      await waitFor(() => {
        expect(mockPut).toHaveBeenCalledWith(expect.stringMatching(/\/averias\/5\/evidencias\/[45]$/), expect.anything(), expect.anything())
      })
    }
  }

  it('envía el horómetro de atención y la acción al finalizar el servicio', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/averias/5')
    })

    fireEvent.changeText(screen.getByTestId('input-Horómetro de atención *'), '150.5')
    fireEvent.changeText(screen.getByTestId('input-Acción realizada'), 'Cambio de rodamiento y lubricación del mástil')
    await clickFotoSlot(screen)
    await waitFor(() => {
      expect(screen.getByTestId('btn-Finalizar Servicio')).toBeTruthy()
    })
    fireEvent.press(screen.getByTestId('btn-Finalizar Servicio'))

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/averias/5', expect.objectContaining({
        estadoAveria: 'ATENDIDA',
        horometroAtencion: 150.5,
        accionRealizada: 'Cambio de rodamiento y lubricación del mástil',
        fechaHoraAtencion: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
      }))
    })
  })

  it('permite editar la fecha y hora de atención (default = ahora)', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByTestId('input-Fecha y hora de atención')).toBeTruthy()
    })

    fireEvent.changeText(screen.getByTestId('input-Horómetro de atención *'), '150.5')
    fireEvent.changeText(screen.getByTestId('input-Fecha y hora de atención'), '15/08/2026 - 10:30:00')
    fireEvent.changeText(screen.getByTestId('input-Acción realizada'), 'Cambio de rodamiento y lubricación del mástil')
    await clickFotoSlot(screen)
    await waitFor(() => {
      expect(screen.getByTestId('btn-Finalizar Servicio')).toBeTruthy()
    })
    fireEvent.press(screen.getByTestId('btn-Finalizar Servicio'))

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/averias/5', expect.objectContaining({
        fechaHoraAtencion: '2026-08-15T10:30:00-05:00',
      }))
    })
  })

  it('bloquea finalizar si el horómetro de atención no tiene el formato válido', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByTestId('input-Horómetro de atención *')).toBeTruthy()
    })

    fireEvent.changeText(screen.getByTestId('input-Horómetro de atención *'), 'abc')
    fireEvent.changeText(screen.getByTestId('input-Acción realizada'), 'Cambio de rodamiento y lubricación del mástil')
    await clickFotoSlot(screen)
    await waitFor(() => {
      expect(screen.getByTestId('btn-Finalizar Servicio')).toBeTruthy()
    })
    fireEvent.press(screen.getByTestId('btn-Finalizar Servicio'))

    await waitFor(() => {
      expect(mockPut).not.toHaveBeenCalledWith('/averias/5', expect.objectContaining({
        estadoAveria: 'ATENDIDA',
      }))
    })
  })

  it('bloquea finalizar si faltan las 2 fotografías obligatorias', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByTestId('input-Horómetro de atención *')).toBeTruthy()
    })

    fireEvent.changeText(screen.getByTestId('input-Horómetro de atención *'), '150.5')
    fireEvent.changeText(screen.getByTestId('input-Acción realizada'), 'Cambio de rodamiento y lubricación del mástil')

    expect(screen.getByTestId('btn-Tome las 2 fotografías para finalizar').props.disabled).toBe(true)
  })

  it('sube las 2 evidencias de atención a los slots 4 y 5', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/averias/5')
    })

    await clickFotoSlot(screen)

    expect(mockPut).toHaveBeenCalledWith('/averias/5/evidencias/4', expect.anything(), expect.anything())
    expect(mockPut).toHaveBeenCalledWith('/averias/5/evidencias/5', expect.anything(), expect.anything())
  })

  it('muestra trazabilidad de horómetro de atención y días de inactividad', async () => {
    const screen = renderScreen()

    await waitFor(() => {
      expect(screen.getByText('Horómetro atención')).toBeTruthy()
      expect(screen.getByText('Días inactivo')).toBeTruthy()
      expect(screen.getByTestId('input-Horómetro de atención *')).toBeTruthy()
    })
  })
})
