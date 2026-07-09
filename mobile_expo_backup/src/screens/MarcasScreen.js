import React from 'react'
import CatalogScreen from './CatalogScreen'

export default function MarcasScreen() {
  return (
    <CatalogScreen
      title="Marcas"
      endpoint="/marcas"
      searchPlaceholder="Buscar por nombre de marca"
      searchFields={['nombre', 'codigo']}
      emptyMessage="No hay marcas registradas"
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, primary: true },
        { key: 'codigo', label: 'Código', required: false },
      ]}
    />
  )
}
