import {
  equipmentDefaults,
  equipmentSchema,
  requiredEvidenceFor,
  toEquipmentPayload,
} from '../utils/equipmentForm'

describe('flujo de ingreso de equipo', () => {
  it('exige las dos evidencias base y las de accesorios con nro de serie seleccionados', () => {
    const required = requiredEvidenceFor({
      bateria: true,
      cargador: true,
      extintor: true,
      botiquin: false,
    })

    expect([...required]).toEqual(expect.arrayContaining([
      'GUIA_REMISION',
      'HOROMETRO_INICIAL',
      'BATERIA_1',
      'CARGADOR',
    ]))
    expect(required.has('BOTIQUIN')).toBe(false)
    expect(required.has('EXTINTOR')).toBe(false)
  })

  it('valida la serie cuando un componente está presente', () => {
    const result = equipmentSchema.safeParse({
      ...equipmentDefaults,
      proveedorId: '1',
      marcaId: '2',
      tipoEquipoId: '3',
      modelo: 'P20',
      codigo: 'her180',
      numeroSerie: 'TH123',
      numeroGuiaRemision: 'T001',
      bateria: true,
      serieBateria: '',
    })

    expect(result.success).toBe(false)
    expect(result.error.issues.some(issue => issue.path[0] === 'serieBateria')).toBe(true)
  })

  it('normaliza IDs y código antes de crear el borrador', () => {
    const payload = toEquipmentPayload({
      ...equipmentDefaults,
      proveedorId: '1',
      marcaId: '2',
      tipoEquipoId: '3',
      modelo: ' P20 ',
      codigo: ' her180 ',
      numeroSerie: ' TH123 ',
      numeroGuiaRemision: ' T001 ',
    })

    expect(payload).toMatchObject({
      proveedorId: 1,
      marcaId: 2,
      tipoEquipoId: 3,
      modelo: 'P20',
      codigo: 'HER180',
      numeroSerie: 'TH123',
      numeroGuiaRemision: 'T001',
    })
  })
})
