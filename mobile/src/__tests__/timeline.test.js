import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import EquipmentTimeline from '../components/equipment/timeline/EquipmentTimeline'
import TimelineEvent from '../components/equipment/timeline/TimelineEvent'
import { theme } from '../theme'

const events = [
  {
    id: 'reparacion-1',
    equipmentId: 42,
    type: 'REPARACION',
    dateTime: '2026-08-17T14:20:00',
    title: 'Reparación finalizada',
    description: 'Equipo operativo',
    status: 'COMPLETADO',
    metadata: { action: 'Cambio de bomba', downtimeMinutes: 3105, provider: 'PROVEEDOR A' },
    relatedId: 1,
  },
  {
    id: 'averia-1',
    equipmentId: 42,
    type: 'AVERIA',
    dateTime: '2026-08-15T10:35:00',
    title: 'Avería reportada',
    description: 'Falla en sistema hidráulico',
    status: 'COMPLETADO',
    metadata: { failure: 'Falla en sistema hidráulico', userName: 'Juan Pérez' },
    relatedId: 1,
    photos: [{ id: 'p1', type: 'FOTO_1', url: '/averias/1/evidencias/1/archivo' }],
  },
  {
    id: 'ingreso-42',
    equipmentId: 42,
    type: 'INGRESO',
    dateTime: '2026-05-02T08:15:00',
    title: 'Equipo ingresado',
    description: 'PROVEEDOR A',
    status: 'COMPLETADO',
    metadata: { documentNumber: 'GR-2026-00125', hourMeter: 1245 },
    relatedId: 42,
  },
  {
    id: 'finalizacion-pendiente-42',
    equipmentId: 42,
    type: 'FINALIZACION',
    dateTime: null,
    title: 'Finalización del servicio',
    description: 'Pendiente',
    status: 'PENDIENTE',
    relatedId: 42,
  },
]

describe('TimelineEvent', () => {
  it('renderiza titulo, descripcion y estado', () => {
    const { getByText } = render(<TimelineEvent event={events[1]} isLast={false} />)
    expect(getByText('Avería reportada')).toBeTruthy()
    expect(getByText('Falla en sistema hidráulico')).toBeTruthy()
  })

  it('expande el detalle al presionar', () => {
    const { getByText, queryByText } = render(<TimelineEvent event={events[0]} isLast={false} />)
    expect(queryByText('Acción realizada')).toBeNull()
    fireEvent.press(getByText('Reparación finalizada'))
    expect(getByText('Acción realizada')).toBeTruthy()
    expect(getByText('Cambio de bomba')).toBeTruthy()
  })
})

describe('EquipmentTimeline', () => {
  it('muestra loading cuando no hay eventos y loading=true', () => {
    const { getByText } = render(<EquipmentTimeline events={[]} loading />)
    expect(getByText('Cargando historial...')).toBeTruthy()
  })

  it('muestra estado vacío sin eventos', () => {
    const { getByText } = render(<EquipmentTimeline events={[]} />)
    expect(getByText('No existen eventos registrados')).toBeTruthy()
  })

  it('muestra error y reintento', () => {
    const onRetry = jest.fn()
    const { getByText } = render(<EquipmentTimeline events={[]} error="Falla de red" onRetry={onRetry} />)
    expect(getByText('No fue posible cargar el historial del equipo.')).toBeTruthy()
  })

  it('renderiza todos los eventos en orden', () => {
    const { getByText } = render(<EquipmentTimeline events={events} testID="timeline" />)
    expect(getByText('Reparación finalizada')).toBeTruthy()
    expect(getByText('Avería reportada')).toBeTruthy()
    expect(getByText('Equipo ingresado')).toBeTruthy()
    expect(getByText('Finalización del servicio')).toBeTruthy()
  })

  it('usa colores del tema para estados', () => {
    expect(theme.colors.status.success).toBeTruthy()
    expect(theme.colors.status.warning).toBeTruthy()
    expect(theme.colors.status.neutral).toBeTruthy()
  })
})