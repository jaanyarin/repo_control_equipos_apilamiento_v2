// Utilidades de formato de la timeline.
// El backend entrega los cálculos (tiempos de parada); aquí solo se formatean.

export function formatDateTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function formatDate(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatHourMeter(value) {
  if (value == null) return null
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatCurrency(costPerMonth, currency) {
  if (costPerMonth == null) return null
  const symbol = currency === 'USD' ? 'US$' : currency === 'PEN' ? 'S/' : (currency || '').toUpperCase() || 'US$'
  const amount = Number(costPerMonth).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${symbol} ${amount}`
}

// Convierte minutos a un texto compacto: "2d 03h 45m"
export function formatDowntime(totalMinutes) {
  if (totalMinutes == null) return null
  const minutes = Math.max(0, Math.round(Number(totalMinutes)))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0 || days > 0) parts.push(`${String(hours).padStart(2, '0')}h`)
  parts.push(`${String(mins).padStart(2, '0')}m`)
  return parts.join(' ')
}

export function formatDowntimeLong(totalMinutes) {
  if (totalMinutes == null) return null
  const minutes = Math.max(0, Math.round(Number(totalMinutes)))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  const parts = []
  if (days > 0) parts.push(`${days} ${days === 1 ? 'día' : 'días'}`)
  if (hours > 0) parts.push(`${hours} h`)
  if (mins > 0) parts.push(`${mins} min`)
  if (parts.length === 0) parts.push('0 min')
  return parts.join(' ')
}
