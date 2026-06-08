import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'accessToken'
const API_URL_KEY = 'apiUrl'
const FALLBACK_API_URL = 'http://192.168.18.229:8082/api/v1'
const BUILT_IN_API_URL = normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL || FALLBACK_API_URL)
const BUILT_IN_ORIGIN = extractOrigin(BUILT_IN_API_URL)

function extractOrigin(url) {
  try { return new URL(url).origin } catch { return '' }
}

function normalizeApiUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '')
}

function isLegacyApiUrl(url) {
  return typeof url === 'string' && ['10.13.18.115', '10.13.18.144:8082', '192.168.18.229:8080'].some(ip => url.includes(ip))
}

function originChanged(storedUrl) {
  if (!storedUrl) return true
  return extractOrigin(storedUrl) !== BUILT_IN_ORIGIN
}

async function resolveApiUrl() {
  const stored = await SecureStore.getItemAsync(API_URL_KEY)
  if (!stored || isLegacyApiUrl(stored) || originChanged(stored)) {
    await SecureStore.setItemAsync(API_URL_KEY, BUILT_IN_API_URL)
    return BUILT_IN_API_URL
  }
  return normalizeApiUrl(stored)
}

export async function loadApiUrl() {
  return resolveApiUrl()
}

export async function setApiUrl(url) {
  await SecureStore.setItemAsync(API_URL_KEY, normalizeApiUrl(url))
}

const api = axios.create({
  baseURL: BUILT_IN_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use(async (config) => {
  config.baseURL = await resolveApiUrl()
  const token = await SecureStore.getItemAsync(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
    }
    return Promise.reject(error)
  }
)

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function setToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
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

export default api
