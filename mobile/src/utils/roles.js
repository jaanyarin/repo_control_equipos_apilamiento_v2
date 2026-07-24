export function hasPsrAdminRole(user) {
  const role = String(user?.rolNombre || user?.rol || '').trim().toLowerCase()
  return role === 'admin' || role === 'super admin'
}

export function isSuperAdmin(user) {
  return String(user?.rolNombre || user?.rol || '').trim().toLowerCase() === 'super admin'
}

export function isAdminOrSuperAdmin(user) {
  const role = String(user?.rolNombre || user?.rol || '').trim().toLowerCase()
  return role === 'admin' || role === 'super admin'
}

export function currencyCode(currency) {
  return String(currency || '').trim().toUpperCase()
}
