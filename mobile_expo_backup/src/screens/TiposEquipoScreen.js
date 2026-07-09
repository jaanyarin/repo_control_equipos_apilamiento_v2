import React from 'react'
import CatalogScreen from './CatalogScreen'

export default function TiposEquipoScreen() {
  return (
    <CatalogScreen
      title="Tipos de Equipo"
      endpoint="/tipos-equipo"
      searchPlaceholder="Buscar por nombre o código"
      searchFields={['nombre', 'codigo', 'descripcion']}
      emptyMessage="No hay tipos de equipo registrados"
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, primary: true },
        { key: 'codigo', label: 'Código', required: false },
        { key: 'descripcion', label: 'Descripción', required: false, multiline: true },
      ]}
    />
  )
}
