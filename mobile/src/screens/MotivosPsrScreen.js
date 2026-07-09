import React from 'react'
import CatalogScreen from './CatalogScreen'

export default function MotivosPsrScreen() {
  return (
    <CatalogScreen
      title="Motivos PSR"
      endpoint="/motivos-psr"
      searchPlaceholder="Buscar por nombre de motivo"
      searchFields={['nombreCorto', 'nombre', 'codigo']}
      emptyMessage="No hay motivos PSR registrados"
      fields={[
        { key: 'nombreCorto', label: 'Nombre corto', required: true, primary: true },
        { key: 'nombre', label: 'Nombre completo', required: true },
      ]}
    />
  )
}