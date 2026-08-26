import axios from 'axios'
import * as Keychain from 'react-native-keychain'

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN CONGELADA — NO MODIFICAR sin autorización del arquitecto
// LAN_API_URL y DEBUG_API_URL validados y funcionando. Ver AGENTS.md sección 13.
// ═══════════════════════════════════════════════════════════════════════════════

const TOKEN_KEY = 'accessToken'
const API_URL_KEY = 'apiUrl'
const LAN_API_URL = 'http://10.13.10.24:82/control_equipos/api/v1'
const DEBUG_API_URL = 'http://127.0.0.1:8082/api/v1'
const IS_DEVELOPMENT = typeof __DEV__ !== 'undefined' && __DEV__
const FALLBACK_API_URL = IS_DEVELOPMENT ? DEBUG_API_URL : LAN_API_URL
export const BUILT_IN_API_URL = normalizeApiUrl(process.env.API_URL || FALLBACK_API_URL)

let _cachedApiUrl = null
let _cachedToken = null

function normalizeApiUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '')
}

export async function loadApiUrl() {
  if (!_cachedApiUrl) {
    const stored = await getSecureValue(API_URL_KEY)
    _cachedApiUrl = normalizeApiUrl(stored || BUILT_IN_API_URL)
  }
  return _cachedApiUrl
}

export async function setApiUrl(url) {
  const normalized = normalizeApiUrl(url)
  await setSecureValue(API_URL_KEY, normalized)
  _cachedApiUrl = normalized
}

export async function getToken() {
  if (!_cachedToken) {
    _cachedToken = await getSecureValue(TOKEN_KEY)
  }
  return _cachedToken
}

export async function setToken(token) {
  await setSecureValue(TOKEN_KEY, token)
  _cachedToken = token
}

export async function removeToken() {
  await removeSecureValue(TOKEN_KEY)
  _cachedToken = null
}

const api = axios.create({
  baseURL: BUILT_IN_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use(async (config) => {
  const [apiUrl, token] = await Promise.all([loadApiUrl(), getToken()])
  config.baseURL = apiUrl
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      _cachedToken = null
      void removeToken()
    }
    return Promise.reject(error)
  }
)

// Pre-load cached values on first import
void loadApiUrl().catch(() => null)
void getToken().catch(() => null)

async function getSecureValue(key) {
  const credentials = await Keychain.getGenericPassword({ service: key })
  return credentials ? credentials.password : null
}

async function setSecureValue(key, value) {
  await Keychain.setGenericPassword('apilamiento-mobile', String(value), { service: key })
}

async function removeSecureValue(key) {
  await Keychain.resetGenericPassword({ service: key })
}

export function parseToken(token) {
  if (!token) return null
  try {
    const payload = JSON.parse(decodeJwtPayload(token))
    return {
      nombre: payload.nombre || 'Usuario',
      correo: payload.correo || payload.upn || '',
      rol: (payload.groups || [])[0] || '',
      rolNombre: (payload.groups || [])[0] || '',
      rolId: payload.rolId || null,
      sub: payload.sub || null,
      area: payload.area || '',
      dni: payload.dni || '',
      passwordResetRequired: payload.passwordResetRequired !== false,
    }
  } catch {
    return null
  }
}

function decodeJwtPayload(token) {
  const payload = token.split('.')[1]
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const decoded = atob(padded)
  const bytes = Array.from(decoded, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
  return decodeURIComponent(bytes.join(''))
}

export async function registrarTokenPush(token, plataforma) {
  return api.post('/push/token', { token, plataforma })
}

export async function eliminarTokenPush(token) {
  return api.delete('/push/token', { params: { token } })
}

export default api
