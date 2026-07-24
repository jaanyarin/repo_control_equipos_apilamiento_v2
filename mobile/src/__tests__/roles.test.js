import { currencyCode, hasPsrAdminRole } from '../utils/roles'

describe('roles y monedas PSR/OSR', () => {
  it('permite administrar a Admin y Super Admin', () => {
    expect(hasPsrAdminRole({ rolNombre: 'Admin' })).toBe(true)
    expect(hasPsrAdminRole({ rolNombre: 'Super Admin' })).toBe(true)
    expect(hasPsrAdminRole({ rolNombre: 'Usuario' })).toBe(false)
  })

  it('normaliza los códigos de moneda esperados', () => {
    expect(currencyCode('pen')).toBe('PEN')
    expect(currencyCode('USD')).toBe('USD')
    expect(currencyCode(' eur ')).toBe('EUR')
  })
})
