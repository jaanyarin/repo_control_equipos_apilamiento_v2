import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RegistrarAveriaScreen from '../screens/RegistrarAveriaScreen'

const mockPost = jest.fn()
const mockPut = jest.fn()
const mockLaunchCamera = jest.fn()
const mockGoBack = jest.fn()

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    post: (...args) => mockPost(...args),
    put: (...args) => mockPut(...args),
  },
}))

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { equipoId: 7 } }),
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
    },
    radius: { sm: 4 },
    spacing: [0, 4, 8, 12, 16, 20, 24, 28, 32],
    typography: { title: {}, subtitle: {}, caption: {}, body2: {} },
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
  const { Pressable, Text } = require('react-native')
  return ({ children, onPress, disabled }) => (
    <Pressable testID={`btn-${children}`} onPress={onPress} disabled={disabled}>
      <Text>{children}</Text>
    </Pressable>
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

jest.mock('react-native-paper', () => {
  const React = require('react')
  const { Text: NativeText } = require('react-native')
  return { Text: ({ children }) => <NativeText>{children}</NativeText> }
})

describe('RegistrarAveriaScreen', () => {
  const renderScreen = () =>
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 360, height: 640 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <RegistrarAveriaScreen />
      </SafeAreaProvider>
    )

  beforeEach(() => {
    jest.clearAllMocks()
    mockPost.mockResolvedValue({ data: { success: true, data: { id: 99 } } })
    mockPut.mockResolvedValue({ data: { success: true } })
    mockLaunchCamera.mockResolvedValue({
      didCancel: false,
      errorCode: null,
      assets: [{ uri: 'file:///tmp/foto.jpg', type: 'image/jpeg', fileName: 'foto.jpg' }],
    })
  })

  it('valida el horómetro antes de crear la avería', async () => {
    const screen = renderScreen()

    fireEvent.changeText(screen.getByTestId('input-Horómetro *'), 'abc')
    fireEvent.changeText(screen.getByTestId('input-Descripción de la falla'), 'Falla de prueba en la horquilla del equipo')
    fireEvent.press(screen.getByTestId('btn-Registrar Avería'))

    await waitFor(() => {
      expect(mockPost).not.toHaveBeenCalled()
    })
  })

  it('crea la avería enviando el horómetro como número', async () => {
    const screen = renderScreen()

    fireEvent.changeText(screen.getByTestId('input-Horómetro *'), '1234.5')
    fireEvent.changeText(screen.getByTestId('input-Descripción de la falla'), 'Falla de prueba en la horquilla del equipo')
    fireEvent.press(screen.getByTestId('btn-Registrar Avería'))

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/averias', expect.objectContaining({
        equipoId: 7,
        horometro: 1234.5,
        descripcionFalla: 'Falla de prueba en la horquilla del equipo',
      }))
    })
  })

  it('el horómetro aparece por encima de la descripción de la falla', () => {
    const screen = renderScreen()

    const json = JSON.stringify(screen.toJSON())
    const idxHorometro = json.indexOf('input-Horómetro *')
    const idxDescripcion = json.indexOf('input-Descripción de la falla')
    expect(idxHorometro).toBeGreaterThan(-1)
    expect(idxDescripcion).toBeGreaterThan(-1)
    expect(idxHorometro).toBeLessThan(idxDescripcion)
  })

  it('requiere foto de horómetro y foto 1, pero la foto 2 es opcional', async () => {
    const screen = renderScreen()

    fireEvent.changeText(screen.getByTestId('input-Horómetro *'), '1234.5')
    fireEvent.changeText(screen.getByTestId('input-Descripción de la falla'), 'Falla de prueba en la horquilla del equipo')
    fireEvent.press(screen.getByTestId('btn-Registrar Avería'))

    await waitFor(() => {
      expect(screen.getByText('Tome la foto del horómetro y la Foto 1 para finalizar')).toBeTruthy()
    })

    expect(screen.getByText('Horómetro *')).toBeTruthy()
    expect(screen.getByText('Foto 1 *')).toBeTruthy()
    expect(screen.getByText('Foto 2')).toBeTruthy()
  })

  it('sube foto de horómetro con numero 3 y desbloquea finalizar con foto 1', async () => {
    const screen = renderScreen()

    fireEvent.changeText(screen.getByTestId('input-Horómetro *'), '1234.5')
    fireEvent.changeText(screen.getByTestId('input-Descripción de la falla'), 'Falla de prueba en la horquilla del equipo')
    fireEvent.press(screen.getByTestId('btn-Registrar Avería'))

    await waitFor(() => {
      expect(screen.getAllByText('Tomar foto').length).toBe(3)
    })

    fireEvent.press(screen.getAllByText('Tomar foto')[0])
    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/averias/99/evidencias/3', expect.anything(), expect.anything())
    })

    fireEvent.press(screen.getAllByText('Tomar foto')[0])
    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/averias/99/evidencias/1', expect.anything(), expect.anything())
    })

    await waitFor(() => {
      expect(screen.getByText('Finalizar')).toBeTruthy()
    })
  })
})
