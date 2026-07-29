import { z } from 'zod'

export const accessoryFields = [
  { key: 'bateria', label: 'Batería', serial: 'serieBateria', evidence: 'BATERIA_1' },
  { key: 'bateriaAdicional', label: 'Batería adicional', serial: 'serieBateriaAdicional', evidence: 'BATERIA_2' },
  { key: 'cargador', label: 'Cargador', serial: 'serieCargador', evidence: 'CARGADOR' },
  { key: 'transformador', label: 'Transformador', serial: 'serieTransformador', evidence: 'TRANSFORMADOR' },
  { key: 'extintor', label: 'Extintor' },
  { key: 'botiquin', label: 'Botiquín', evidence: 'BOTIQUIN' },
  { key: 'elevadorBateria', label: 'Elevador de batería', evidence: 'ELEVADOR_BATERIA' },
  { key: 'conectorAdicional', label: 'Conector adicional', evidence: 'CONECTOR_ADICIONAL' },
  { key: 'conoSeguridad', label: 'Cono de seguridad', evidence: 'CONO' },
  { key: 'mesaRodillos', label: 'Mesa de rodillos', evidence: 'MESA_RODILLOS' },
  { key: 'cableAdicional', label: 'Cable adicional', evidence: 'CABLE_ADICIONAL' },
]

export const evidenceTypes = [
  ['LATERAL_IZQUIERDO', 'Lateral izquierdo'],
  ['FRONTAL', 'Frontal'],
  ['LATERAL_DERECHO', 'Lateral derecho'],
  ['POSTERIOR', 'Posterior'],
  ['BATERIA_1', 'Batería 1'],
  ['BATERIA_2', 'Batería 2'],
  ['CONO', 'Cono'],
  ['BOTIQUIN', 'Botiquín'],
  ['CARGADOR', 'Cargador'],
  ['TRANSFORMADOR', 'Transformador'],
  ['CABLE_ADICIONAL', 'Cable adicional'],
  ['MESA_RODILLOS', 'Mesa de rodillos'],
  ['ELEVADOR_BATERIA', 'Elevador de batería'],
  ['CONECTOR_ADICIONAL', 'Conector adicional'],
  ['GUIA_REMISION', 'Guía de remisión'],
  ['DETALLE_1', 'Detalle 1'],
  ['DETALLE_2', 'Detalle 2'],
  ['DETALLE_3', 'Detalle 3'],
].map(([key, label]) => ({ key, label }))

export const baseRequiredEvidence = [
  'LATERAL_IZQUIERDO', 'LATERAL_DERECHO', 'FRONTAL', 'POSTERIOR', 'GUIA_REMISION',
]

export function requiredEvidenceFor(equipment = {}) {
  const required = new Set(baseRequiredEvidence)
  accessoryFields.forEach(item => {
    if (item.evidence && equipment[item.key]) required.add(item.evidence)
  })
  return required
}

export const equipmentDefaults = {
  proveedorId: '',
  marcaId: '',
  tipoEquipoId: '',
  modelo: '',
  codigo: '',
  numeroSerie: '',
  fechaIngreso: new Date().toISOString().slice(0, 10),
  numeroGuiaRemision: '',
  bateria: false,
  serieBateria: '',
  bateriaAdicional: false,
  serieBateriaAdicional: '',
  cargador: false,
  serieCargador: '',
  transformador: false,
  serieTransformador: '',
  extintor: false,
  botiquin: false,
  elevadorBateria: false,
  conectorAdicional: false,
  conoSeguridad: false,
  mesaRodillos: false,
  cableAdicional: false,
  observaciones: '',
}

export const equipmentSchema = z.object({
  proveedorId: z.string().min(1, 'Seleccione un proveedor'),
  marcaId: z.string().min(1, 'Seleccione una marca'),
  tipoEquipoId: z.string().min(1, 'Seleccione un tipo de equipo'),
  modelo: z.string().trim().min(1, 'Ingrese el modelo'),
  codigo: z.string().trim().min(1, 'Ingrese el código'),
  numeroSerie: z.string().trim().min(1, 'Ingrese el número de serie'),
  fechaIngreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Seleccione una fecha válida'),
  numeroGuiaRemision: z.string().trim().min(1, 'Ingrese la guía de remisión'),
  bateria: z.boolean(),
  serieBateria: z.string(),
  bateriaAdicional: z.boolean(),
  serieBateriaAdicional: z.string(),
  cargador: z.boolean(),
  serieCargador: z.string(),
  transformador: z.boolean(),
  serieTransformador: z.string(),
  extintor: z.boolean(),
  botiquin: z.boolean(),
  elevadorBateria: z.boolean(),
  conectorAdicional: z.boolean(),
  conoSeguridad: z.boolean(),
  mesaRodillos: z.boolean(),
  cableAdicional: z.boolean(),
  observaciones: z.string().max(500, 'Máximo 500 caracteres'),
}).superRefine((data, context) => {
  accessoryFields.filter(item => item.serial).forEach(item => {
    if (data[item.key] && !data[item.serial].trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [item.serial],
        message: `Ingrese la serie de ${item.label.toLowerCase()}`,
      })
    }
  })
})

export function toEquipmentPayload(data) {
  return {
    ...data,
    proveedorId: Number(data.proveedorId),
    marcaId: Number(data.marcaId),
    tipoEquipoId: Number(data.tipoEquipoId),
    codigo: data.codigo.trim().toUpperCase(),
    numeroSerie: data.numeroSerie.trim(),
    modelo: data.modelo.trim(),
    numeroGuiaRemision: data.numeroGuiaRemision.trim(),
    estadoOperativo: 'OPERATIVO',
    estadoActivo: true,
  }
}
