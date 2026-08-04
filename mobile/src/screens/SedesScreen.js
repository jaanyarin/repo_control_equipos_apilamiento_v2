import React from 'react'
import CatalogScreen from './CatalogScreen'
import { useAuth } from '../AuthContext'
import { isAdminOrSuperAdmin } from '../utils/roles'

export default function SedesScreen() {
  const { user } = useAuth()
  const canEdit = isAdminOrSuperAdmin(user)
  return (
    <CatalogScreen
      title="Sedes"
      endpoint="/sedes"
      searchPlaceholder="Buscar por nombre, código o dirección"
      searchFields={['nombre', 'codigo', 'direccion']}
      emptyMessage="No hay sedes registradas"
      canEdit={canEdit}
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, primary: true },
        { key: 'codigo', label: 'Código', required: false },
        { key: 'direccion', label: 'Dirección', required: false, multiline: true },
      ]}
    />
  )
}
