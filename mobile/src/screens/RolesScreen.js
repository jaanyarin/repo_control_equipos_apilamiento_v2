import React from 'react'
import CatalogScreen from './CatalogScreen'
import { useAuth } from '../AuthContext'
import { isAdminOrSuperAdmin } from '../utils/roles'

export default function RolesScreen() {
  const { user } = useAuth()
  const canEdit = isAdminOrSuperAdmin(user)
  return (
    <CatalogScreen
      title="Roles"
      endpoint="/roles"
      searchPlaceholder="Buscar por nombre de rol"
      searchFields={['nombre', 'descripcion']}
      emptyMessage="No hay roles registrados"
      canEdit={canEdit}
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, primary: true },
        { key: 'descripcion', label: 'Descripción', required: false, multiline: true },
      ]}
    />
  )
}
