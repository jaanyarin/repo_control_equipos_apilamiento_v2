import { VERSION_HISTORY } from '../constants/versionHistory'
import { APP_VERSION } from '../constants/appVersion'

const toTuple = v => v.split('.').map(Number)

describe('versionHistory', () => {
  test('no está vacío y cada entrada tiene datos válidos', () => {
    expect(VERSION_HISTORY.length).toBeGreaterThan(0)
    VERSION_HISTORY.forEach(entry => {
      expect(entry.version).toMatch(/^\d+\.\d+\.\d+$/)
      expect(entry.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(entry.titulo.length).toBeGreaterThan(0)
      expect(entry.cambios.length).toBeGreaterThan(0)
    })
  })

  test('las versiones son únicas y están ordenadas de la más reciente a la más antigua', () => {
    const versions = VERSION_HISTORY.map(e => e.version)
    expect(new Set(versions).size).toBe(versions.length)
    const sorted = [...versions].sort((a, b) => {
      const [am, ai, ap] = toTuple(a)
      const [bm, bi, bp] = toTuple(b)
      return bm - am || bi - ai || bp - ap
    })
    expect(versions).toEqual(sorted)
  })

  test('la versión actual de la app existe en el historial', () => {
    expect(VERSION_HISTORY.some(e => e.version === APP_VERSION)).toBe(true)
  })
})
