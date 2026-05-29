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
  (res) => res,
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
    const payload = JSON.parse(atob(token.split('.')[1]))
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

export default api
