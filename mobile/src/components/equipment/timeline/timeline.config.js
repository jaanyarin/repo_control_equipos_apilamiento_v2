import { colors } from '../../../theme'

// Catálogo centralizado de tipos de evento de la timeline.
// No usar strings dispersos por los componentes.
export const TIMELINE_EVENT_TYPES = ['PSR', 'OSR', 'INGRESO', 'AVERIA', 'REPARACION', 'FINALIZACION']

export const TIMELINE_STATUS = {
  COMPLETADO: 'COMPLETADO',
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
}

export const TIMELINE_EVENT_CONFIG = {
  PSR: {
    title: 'PSR registrada',
    icon: 'file-document-outline',
    category: 'DOCUMENTO',
    color: colors.action.secondary,
  },
  OSR: {
    title: 'OSR registrada',
    icon: 'file-document-check-outline',
    category: 'DOCUMENTO',
    color: colors.action.secondary,
  },
  INGRESO: {
    title: 'Equipo ingresado',
    icon: 'package-variant-closed',
    category: 'OPERACION',
    color: colors.status.info,
  },
  AVERIA: {
    title: 'Avería reportada',
    icon: 'alert-circle-outline',
    category: 'AVERIA',
    color: colors.status.error,
  },
  REPARACION: {
    title: 'Reparación finalizada',
    icon: 'wrench',
    category: 'OPERACION',
    color: colors.status.success,
  },
  FINALIZACION: {
    title: 'Finalización del servicio',
    icon: 'check-circle-outline',
    category: 'CIERRE',
    color: colors.status.neutral,
  },
}

export const TIMELINE_STATUS_STYLE = {
  [TIMELINE_STATUS.COMPLETADO]: { color: colors.status.success, label: 'Completado' },
  [TIMELINE_STATUS.EN_PROCESO]: { color: colors.status.warning, label: 'En proceso' },
  [TIMELINE_STATUS.PENDIENTE]: { color: colors.status.neutral, label: 'Pendiente' },
}
