import React from 'react'
import CatalogScreen from './CatalogScreen'

export default function SedesScreen() {
  return (
    <CatalogScreen
      title="Sedes"
      endpoint="/sedes"
      searchPlaceholder="Buscar por nombre, código o dirección"
      searchFields={['nombre', 'codigo', 'direccion']}
      emptyMessage="No hay sedes registradas"
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, primary: true },
        { key: 'codigo', label: 'Código', required: false },
        { key: 'direccion', label: 'Dirección', required: false, multiline: true },
      ]}
    />
  )
}
