import React from 'react'
import CatalogScreen from './CatalogScreen'
import { useAuth } from '../AuthContext'
import { isAdminOrSuperAdmin } from '../utils/roles'

export default function TiposEquipoScreen() {
  const { user } = useAuth()
  const canEdit = isAdminOrSuperAdmin(user)
  return (
    <CatalogScreen
      title="Tipos de Equipo"
      endpoint="/tipos-equipo"
      searchPlaceholder="Buscar por nombre"
      searchFields={['nombre', 'codigo', 'descripcion']}
      emptyMessage="No hay tipos de equipo registrados"
      canEdit={canEdit}
      fields={[
        { key: 'nombre', label: 'Nombre', required: true, primary: true },
        { key: 'codigo', label: 'Código', required: false, autoFrom: 'nombre' },
      ]}
    />
  )
}
