import axios from 'axios'

const API_BASE = '/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === 'object' && 'success' in res.data) {
      if (!res.data.success) {
        return Promise.reject(new Error(res.data.message || 'Error del servidor'))
      }
      res.data = res.data.data
    }
    return res
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function getToken() {
  return localStorage.getItem('accessToken')
}

export function parseToken() {
  const token = getToken()
  if (!token) return null
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const payload = JSON.parse(atob(padded))
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem('accessToken')
      return null
    }
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

export default api
