import React from 'react'
import CatalogScreen from './CatalogScreen'
import { useAuth } from '../AuthContext'
import { isAdminOrSuperAdmin } from '../utils/roles'

export default function MotivosPsrScreen() {
  const { user } = useAuth()
  const canEdit = isAdminOrSuperAdmin(user)
  return (
    <CatalogScreen
      title="Motivos PSR"
      endpoint="/motivos-psr"
      searchPlaceholder="Buscar por nombre de motivo"
      searchFields={['nombreCorto', 'nombre', 'codigo']}
      emptyMessage="No hay motivos PSR registrados"
      canEdit={canEdit}
      fields={[
        { key: 'nombre', label: 'Nombre completo', required: true, primary: true, uppercase: true },
        { key: 'nombreCorto', label: 'Nombre corto', required: true, uppercase: true },
      ]}
    />
  )
}