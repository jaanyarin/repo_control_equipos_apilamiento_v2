import React from 'react'
import { render } from '@testing-library/react-native'
import LoadingScreen from '../components/LoadingScreen'

describe('LoadingScreen', () => {
  it('deberia renderizar el mensaje por defecto', () => {
    const { getByText } = render(<LoadingScreen />)
    expect(getByText('Cargando...')).toBeTruthy()
  })

  it('deberia renderizar un mensaje personalizado', () => {
    const { getByText } = render(<LoadingScreen message="Verificando sesion..." />)
    expect(getByText('Verificando sesion...')).toBeTruthy()
  })
})
