import React from 'react'
import CatalogScreen from './CatalogScreen'

export default function ProveedoresScreen() {
  return (
    <CatalogScreen
      title="Proveedores"
      endpoint="/proveedores"
      searchPlaceholder="Buscar por razón social o RUC"
      searchFields={['razonSocial', 'ruc', 'codigo']}
      emptyMessage="No hay proveedores registrados"
      fields={[
        { key: 'razonSocial', label: 'Razón Social', required: true, primary: true },
        { key: 'ruc', label: 'RUC', required: true },
        { key: 'codigo', label: 'Código', required: false },
      ]}
    />
  )
}
