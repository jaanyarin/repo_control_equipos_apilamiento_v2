import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'accessToken'
const API_URL_KEY = 'apiUrl'

const DEFAULT_API_URL = 'http://10.13.18.115/api/v1'

export async function loadApiUrl() {
  const stored = await SecureStore.getItemAsync(API_URL_KEY)
  return stored || DEFAULT_API_URL
}

export async function setApiUrl(url) {
  await SecureStore.setItemAsync(API_URL_KEY, url)
}

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use(async (config) => {
  const storedUrl = await SecureStore.getItemAsync(API_URL_KEY)
  if (storedUrl) config.baseURL = storedUrl
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
      rolId: payload.rolId || null,
      sub: payload.sub || null,
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
