export const formatDateTime = (date) => {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`
}

export const parseToISO = (displayDate) => {
  if (!displayDate || !displayDate.includes(' - ')) return new Date().toISOString()
  const [datePart, timePart] = displayDate.split(' - ')
  if (!datePart || !timePart) return new Date().toISOString()
  const [day, month, year] = datePart.split('/')
  const [hours, minutes, seconds] = timePart.split(':')
  return `${year}-${month}-${day}T${hours || '00'}:${minutes || '00'}:${seconds || '00'}-05:00`
}