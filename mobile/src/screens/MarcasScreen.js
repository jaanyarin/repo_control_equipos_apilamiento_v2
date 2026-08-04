import React from 'react'
import CatalogScreen from './CatalogScreen'
import { useAuth } from '../AuthContext'
import { isAdminOrSuperAdmin } from '../utils/roles'

export default function MarcasScreen() {
  const { user } = useAuth()
  const canEdit = isAdminOrSuperAdmin(user)
  return (
    <CatalogScreen
      title="Marcas"
      endpoint="/marcas"
      searchPlaceholder="Buscar por nombre de marca"
      searchFields={['nombre', 'codigo']}
      emptyMessage="No hay marcas registradas"
      canEdit={canEdit}
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, primary: true },
        { key: 'codigo', label: 'Código', required: false },
      ]}
    />
  )
}
