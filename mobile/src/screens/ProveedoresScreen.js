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
      searchPlaceholder="Buscar por razón social"
      searchFields={['razonSocial', 'ruc', 'codigo']}
      emptyMessage="No hay proveedores registrados"
      canEdit={canEdit}
      fields={[
        { key: 'razonSocial', label: 'Razón Social', required: true, primary: true },
        { key: 'codigo', label: 'Código', required: false, autoFrom: 'razonSocial' },
      ]}
    />
  )
}
