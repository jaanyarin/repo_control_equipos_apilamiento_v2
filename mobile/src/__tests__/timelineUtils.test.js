import { formatDateTime, formatDate, formatHourMeter, formatCurrency, formatDowntime, formatDowntimeLong } from '../components/equipment/timeline/timeline.utils'

describe('timeline.utils', () => {
  describe('formatDateTime', () => {
    it('formatea ISO a dd/mm/yyyy hh:mm', () => {
      expect(formatDateTime('2026-08-15T10:35:00')).toBe('15/08/2026 10:35')
    })

    it('devuelve "-" cuando no hay valor o es inválido', () => {
      expect(formatDateTime(null)).toBe('-')
      expect(formatDateTime('no-valido')).toBe('-')
    })
  })

  describe('formatDate', () => {
    it('formatea ISO a dd/mm/yyyy', () => {
      expect(formatDate('2026-05-02T08:15:00')).toBe('02/05/2026')
    })

    it('devuelve "-" sin valor', () => {
      expect(formatDate(undefined)).toBe('-')
    })
  })

  describe('formatHourMeter', () => {
    it('formatea con 2 decimales', () => {
      expect(formatHourMeter(1245)).toBe('1,245.00')
    })

    it('devuelve null sin valor', () => {
      expect(formatHourMeter(null)).toBeNull()
    })
  })

  describe('formatCurrency', () => {
    it('formatea USD', () => {
      expect(formatCurrency(850, 'USD')).toBe('US$ 850.00')
    })

    it('formatea PEN', () => {
      expect(formatCurrency(1200.5, 'PEN')).toBe('S/ 1,200.50')
    })

    it('devuelve null sin monto', () => {
      expect(formatCurrency(null, 'USD')).toBeNull()
    })
  })

  describe('formatDowntime', () => {
    it('formato compacto: 2d 03h 45m', () => {
      expect(formatDowntime(3105)).toBe('2d 03h 45m')
    })

    it('solo horas y minutos', () => {
      expect(formatDowntime(270)).toBe('04h 30m')
    })

    it('solo minutos', () => {
      expect(formatDowntime(45)).toBe('45m')
    })

    it('devuelve null sin valor', () => {
      expect(formatDowntime(null)).toBeNull()
    })
  })

  describe('formatDowntimeLong', () => {
    it('formato largo con días', () => {
      expect(formatDowntimeLong(3105)).toBe('2 días 3 h 45 min')
    })

    it('devuelve null sin valor', () => {
      expect(formatDowntimeLong(null)).toBeNull()
    })
  })
})