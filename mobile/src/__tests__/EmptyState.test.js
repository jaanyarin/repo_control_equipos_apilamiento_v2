import React from 'react'
import { render } from '@testing-library/react-native'
import EmptyState from '../components/EmptyState'

describe('EmptyState', () => {
  it('deberia renderizar titulo y subtitulo', () => {
    const { getByText } = render(
      <EmptyState icon="alert" title="Sin datos" subtitle="No hay registros disponibles" />
    )
    expect(getByText('Sin datos')).toBeTruthy()
    expect(getByText('No hay registros disponibles')).toBeTruthy()
  })
})
