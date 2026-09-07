import React from 'react'
import CatalogScreen from './CatalogScreen'
import { useAuth } from '../AuthContext'
import { isAdminOrSuperAdmin } from '../utils/roles'

export default function AreasScreen() {
  const { user } = useAuth()
  return (
    <CatalogScreen
      title="Áreas"
      endpoint="/areas"
      searchPlaceholder="Buscar por nombre de área"
      searchFields={['nombre', 'codigo']}
      emptyMessage="No hay áreas registradas"
      canEdit={isAdminOrSuperAdmin(user)}
      fields={[{ key: 'nombre', label: 'Nombre', required: true, primary: true }]}
    />
  )
}