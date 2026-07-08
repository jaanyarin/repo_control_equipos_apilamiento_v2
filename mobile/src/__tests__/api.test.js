import { parseToken } from '../api'

describe('parseToken', () => {
  it('deberia retornar null cuando el token es vacio', () => {
    const result = parseToken('')
    expect(result).toBeNull()
  })

  it('deberia decodificar un token valido', () => {
    const payload = { nombre: 'Admin', correo: 'admin@test.com', groups: ['Super Admin'] }
    const base64Payload = btoa(JSON.stringify(payload))
    const token = `header.${base64Payload}.signature`

    const result = parseToken(token)

    expect(result).not.toBeNull()
    expect(result.nombre).toBe('Admin')
    expect(result.correo).toBe('admin@test.com')
  })

  it('deberia extraer rolNombre del groups', () => {
    const payload = { nombre: 'User', groups: ['Admin', 'Usuario'] }
    const base64Payload = btoa(JSON.stringify(payload))
    const token = `header.${base64Payload}.signature`

    const result = parseToken(token)

    expect(result.rolNombre).toBe('Admin')
  })

  it('deberia manejar passwordResetRequired', () => {
    const payload = { passwordResetRequired: true }
    const base64Payload = btoa(JSON.stringify(payload))
    const token = `header.${base64Payload}.signature`

    const result = parseToken(token)

    expect(result.passwordResetRequired).toBe(true)
  })
})
