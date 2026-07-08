import { parseToken } from '../api'

describe('parseToken', () => {
  it('deberia retornar null cuando no hay token', () => {
    const result = parseToken()
    expect(result).toBeNull()
  })

  it('deberia decodificar un token valido', () => {
    const payload = { nombre: 'Admin', correo: 'admin@test.com', groups: ['Super Admin'] }
    const base64Payload = btoa(JSON.stringify(payload))
    const token = `header.${base64Payload}.signature`
    localStorage.setItem('accessToken', token)

    const result = parseToken()

    expect(result).not.toBeNull()
    expect(result.nombre).toBe('Admin')
    expect(result.correo).toBe('admin@test.com')
    localStorage.removeItem('accessToken')
  })

  it('deberia extraer el nombre del rol correctamente', () => {
    const payload = { nombre: 'User', groups: ['Admin'] }
    const base64Payload = btoa(JSON.stringify(payload))
    const token = `header.${base64Payload}.signature`
    localStorage.setItem('accessToken', token)

    const result = parseToken()

    expect(result.rolNombre).toBe('Admin')
    localStorage.removeItem('accessToken')
  })
})
