import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'

jest.mock('../theme', () => ({
  theme: {
    colors: {
      text: { primary: '#000', secondary: '#666', tertiary: '#999' },
      border: { error: 'red', strong: '#ccc', subtle: '#eee' },
      background: { paper: '#fff', neutral: '#f0f0f0', backdrop: 'rgba(0,0,0,0.4)' },
      action: { primary: '#333' },
    },
    radius: { sm: 8, md: 12 },
    spacing: { 1: 4, 3: 12, 4: 16 },
    typography: { body1: { fontSize: 14 }, body2: { fontSize: 13 } },
  },
}))

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 24, bottom: 32 }),
}))

jest.mock('react-native-paper', () => {
  const { Pressable, Text: NativeText, View } = require('react-native')
  return {
    Button: (props) => (
      <Pressable {...props} testID={`select-${props.accessibilityLabel}`}>
        <NativeText>{props.children}</NativeText>
      </Pressable>
    ),
    HelperText: ({ children }) => <NativeText>{children}</NativeText>,
    Portal: ({ children }) => <View>{children}</View>,
    Text: ({ children }) => <NativeText>{children}</NativeText>,
  }
})

import AppSelect from '../components/AppSelect'

describe('AppSelect', () => {
  it('llama onOpen al presionar', () => {
    const onOpen = jest.fn()
    const { getByTestId } = render(
      <AppSelect
        label="Marca"
        value=""
        options={[{ value: '1', label: 'Marca A' }, { value: '2', label: 'Marca B' }]}
        onChange={() => {}}
        onOpen={onOpen}
      />,
    )
    fireEvent.press(getByTestId('select-Marca'))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('no llama onOpen si no se provee', () => {
    const onOpen = jest.fn()
    const { getByTestId } = render(
      <AppSelect
        label="Rol"
        value=""
        options={[{ value: '1', label: 'Admin' }]}
        onChange={() => {}}
      />,
    )
    fireEvent.press(getByTestId('select-Rol'))
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('muestra todas las opciones al abrir el menu', () => {
    const { getByTestId, getByText } = render(
      <AppSelect
        label="Marca"
        value=""
        options={[
          { value: '1', label: 'Marca A' },
          { value: '2', label: 'Marca B' },
          { value: '3', label: 'Ultima Marca' },
        ]}
        onChange={() => {}}
      />,
    )
    fireEvent.press(getByTestId('select-Marca'))
    expect(getByText('Marca A')).toBeTruthy()
    expect(getByText('Ultima Marca')).toBeTruthy()
  })

  it('selecciona una opcion y cierra el menu', () => {
    const onChange = jest.fn()
    const { getByTestId, getByText, queryByTestId } = render(
      <AppSelect
        label="Marca"
        value=""
        options={[{ value: '1', label: 'Marca A' }, { value: '2', label: 'Marca B' }]}
        onChange={onChange}
      />,
    )
    fireEvent.press(getByTestId('select-Marca'))
    fireEvent.press(getByText('Marca B'))
    expect(onChange).toHaveBeenCalledWith('2', expect.anything())
    expect(queryByTestId('select-menu')).toBeNull()
  })

  it('muestra el label seleccionado en el boton', () => {
    const { getByTestId, getByText } = render(
      <AppSelect
        label="Sede"
        value="2"
        options={[{ value: '1', label: 'Sede A' }, { value: '2', label: 'Sede B' }]}
        onChange={() => {}}
      />,
    )
    expect(getByTestId('select-Sede')).toBeTruthy()
    expect(getByText('Sede B')).toBeTruthy()
  })
})
