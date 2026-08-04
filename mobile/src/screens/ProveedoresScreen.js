import React from 'react'
import CatalogScreen from './CatalogScreen'
import { useAuth } from '../AuthContext'
import { isAdminOrSuperAdmin } from '../utils/roles'

export default function ProveedoresScreen() {
  const { user } = useAuth()
  const canEdit = isAdminOrSuperAdmin(user)
  return (
    <CatalogScreen
      title="Proveedores"
      endpoint="/proveedores"
      searchPlaceholder="Buscar por razón social o RUC"
      searchFields={['razonSocial', 'ruc', 'codigo']}
      emptyMessage="No hay proveedores registrados"
      canEdit={canEdit}
      fields={[
        { key: 'razonSocial', label: 'Razón Social', required: true, primary: true },
        { key: 'ruc', label: 'RUC', required: true },
        { key: 'codigo', label: 'Código', required: false },
      ]}
    />
  )
}
