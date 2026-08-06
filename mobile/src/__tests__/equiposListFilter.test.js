import { filterEquiposByMode } from '../utils/equipmentForm'

const equipos = [
  { id: 1, codigo: 'EQ-001', estadoOperativo: 'OPERATIVO' },
  { id: 2, codigo: 'EQ-002', estadoOperativo: 'AVERIADO' },
  { id: 3, codigo: 'EQ-003', estadoOperativo: 'DEVUELTO' },
]

describe('filterEquiposByMode', () => {
  it('oculta DEVUELTO en modo select (Registro de Avería)', () => {
    const result = filterEquiposByMode(equipos, { mode: 'select' })
    expect(result.map(e => e.codigo)).toEqual(['EQ-001', 'EQ-002'])
  })

  it('oculta DEVUELTO en modo manage (Ingreso de Equipo)', () => {
    const result = filterEquiposByMode(equipos, { mode: 'manage' })
    expect(result.map(e => e.codigo)).toEqual(['EQ-001', 'EQ-002'])
  })

  it('oculta DEVUELTO en modo select con devolución', () => {
    const result = filterEquiposByMode(equipos, { mode: 'select' })
    expect(result.some(e => e.estadoOperativo === 'DEVUELTO')).toBe(false)
  })

  it('muestra todos en modo view (Detalles de Equipo)', () => {
    const result = filterEquiposByMode(equipos, { mode: 'view' })
    expect(result.map(e => e.codigo)).toEqual(['EQ-001', 'EQ-002', 'EQ-003'])
  })

  it('aplica filterEstado exacto cuando se define', () => {
    const result = filterEquiposByMode(equipos, { mode: 'select', filterEstado: 'AVERIADO' })
    expect(result.map(e => e.codigo)).toEqual(['EQ-002'])
  })

  it('no oculta DEVUELTO en modo view con filterEstado DEVUELTO', () => {
    const result = filterEquiposByMode(equipos, { mode: 'view', filterEstado: 'DEVUELTO' })
    expect(result.map(e => e.codigo)).toEqual(['EQ-003'])
  })

  it('usa manage por defecto cuando no se pasa mode', () => {
    const result = filterEquiposByMode(equipos)
    expect(result.some(e => e.estadoOperativo === 'DEVUELTO')).toBe(false)
  })

  it('maneja listas vacías sin errores', () => {
    expect(filterEquiposByMode([], { mode: 'view' })).toEqual([])
  })
})
