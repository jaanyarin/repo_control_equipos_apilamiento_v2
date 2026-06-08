import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'accessToken'
const API_URL_KEY = 'apiUrl'
//const FALLBACK_API_URL = 'http://192.168.18.229:8082/api/v1'
const FALLBACK_API_URL = 'http://10.13.18.134:8081/api/v1'
const BUILT_IN_API_URL = normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL || FALLBACK_API_URL)

let _cachedApiUrl = null
let _cachedToken = null

function normalizeApiUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '')
}

export async function loadApiUrl() {
  if (!_cachedApiUrl) {
    const stored = await SecureStore.getItemAsync(API_URL_KEY)
    _cachedApiUrl = normalizeApiUrl(stored || BUILT_IN_API_URL)
  }
  return _cachedApiUrl
}

export async function setApiUrl(url) {
  const normalized = normalizeApiUrl(url)
  await SecureStore.setItemAsync(API_URL_KEY, normalized)
  _cachedApiUrl = normalized
}

export async function getToken() {
  if (!_cachedToken) {
    _cachedToken = await SecureStore.getItemAsync(TOKEN_KEY)
  }
  return _cachedToken
}

export async function setToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
  _cachedToken = token
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
  _cachedToken = null
}

const api = axios.create({
  baseURL: BUILT_IN_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  if (_cachedApiUrl) config.baseURL = _cachedApiUrl
  if (_cachedToken) config.headers.Authorization = `Bearer ${_cachedToken}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      _cachedToken = null
      SecureStore.deleteItemAsync(TOKEN_KEY)
    }
    return Promise.reject(error)
  }
)

// Pre-load cached values on first import
loadApiUrl()
getToken()

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

export default api
