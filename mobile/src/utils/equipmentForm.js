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
  ['GUIA_REMISION', 'Guía de remisión'],
  ['HOROMETRO_INICIAL', 'Horómetro inicial'],
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
  ['DETALLE_1', 'Detalle 1'],
  ['DETALLE_2', 'Detalle 2'],
  ['DETALLE_3', 'Detalle 3'],
].map(([key, label]) => ({ key, label }))

export const baseRequiredEvidence = [
  'GUIA_REMISION',
  'HOROMETRO_INICIAL',
]

// Retorna el conjunto de tipos de evidencia obligatorios según los accesorios del equipo.
// Si equipment es null/undefined, retorna solo las evidencias base (no crashea).
export function requiredEvidenceFor(equipment) {
  const required = new Set(baseRequiredEvidence)
  if (!equipment) return required
  accessoryFields.forEach(item => {
    if (item.serial && equipment[item.key]) required.add(item.evidence)
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
  horometroInicio: '',
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
  horometroInicio: z.string().regex(/^\d{1,6}\.\d$/, 'Formato: hasta 6 enteros y 1 decimal (ej. 1234.5)'),
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
    horometroInicio: data.horometroInicio ? Number(data.horometroInicio) : null,
    estadoOperativo: 'OPERATIVO',
    estadoActivo: true,
  }
}

// Filtra la lista de equipos según el modo de navegación.
// - mode 'select' y 'manage': oculta equipos DEVUELTO o ya devueltos (fechaDevolucion seteada).
// - mode 'view': muestra todos (OPERATIVO, AVERIADO y DEVUELTO).
// - filterEstado: si se define, solo equipos con ese estadoOperativo.
export function filterEquiposByMode(equipos, { mode = 'manage', filterEstado } = {}) {
  return equipos.filter(item => {
    if (mode !== 'view' && (item.estadoOperativo === 'DEVUELTO' || item.fechaDevolucion)) return false
    if (filterEstado && item.estadoOperativo !== filterEstado) return false
    return true
  })
}
