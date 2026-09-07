import { generatePDF } from 'react-native-html-to-pdf'
import Share from 'react-native-share'
import ReactNativeBlobUtil from 'react-native-blob-util'
import api, { getToken, loadApiUrl } from '../api'
import { theme } from '../theme'
import { accessoryFields } from './equipmentForm'

const colors = {
  primary: theme.colors.action.primary,
  dark: theme.colors.text.primary,
  muted: theme.colors.text.secondary,
  border: theme.colors.border.strong,
  soft: theme.colors.background.neutral,
}

function escapeHtml(input) {
  return String(input ?? '-').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]))
}

function display(input) {
  return escapeHtml(input == null || input === '' ? '-' : input)
}

function formatDate(date) {
  if (!date) return '-'
  const raw = String(date).split('T')[0]
  const [year, month, day] = raw.split('-')
  return year && month && day ? `${day}/${month}/${year}` : raw
}

function formatNumber(number) {
  return number == null ? '-' : Number(number).toLocaleString('es-PE', { maximumFractionDigits: 2 })
}

function section(title, content) {
  return `<section><h2>${display(title)}</h2>${content}</section>`
}

function row(label, content) {
  return `<div class="row"><strong>${display(label)}</strong><span>${content}</span></div>`
}

function pageHeader(title, equipment) {
  return `<header><div class="brand">VANGUARD</div><div><h1>${display(title)}</h1><p>${display(equipment.codigo)} · ${display(equipment.modelo)}</p></div></header>`
}

function getPhotos(timeline) {
  return (timeline?.events || []).flatMap(event => (event.photos || []).map(photo => ({ ...photo, eventType: event.type })))
}

function classifyPhoto(photo) {
  const descriptor = `${photo.type || ''} ${photo.description || ''} ${photo.eventType || ''}`.toLowerCase()
  if (descriptor.includes('acces') || descriptor.includes('bater') || descriptor.includes('cable') || descriptor.includes('extintor')) return 'accessories'
  if (descriptor.includes('final') || descriptor.includes('devol') || descriptor.includes('entreg')) return 'delivered'
  return 'received'
}

async function photoData(photo, baseUrl, token) {
  if (!photo.url) return null
  const response = await ReactNativeBlobUtil.fetch('GET', `${baseUrl}${photo.url}`, token ? { Authorization: `Bearer ${token}` } : {})
  if (response.info().statusCode !== 200) return null
  return `data:image/jpeg;base64,${await response.base64()}`
}

async function photoMarkup(photos, baseUrl, token) {
  const items = await Promise.all(photos.map(async photo => ({ photo, data: await photoData(photo, baseUrl, token) })))
  const valid = items.filter(item => item.data)
  if (valid.length === 0) return '<p class="empty">Sin fotografías registradas.</p>'
  return `<div class="photos">${valid.map(({ photo, data }) => `<figure><img src="${data}" /><figcaption>${display(photo.description || photo.type || 'Evidencia')}</figcaption></figure>`).join('')}</div>`
}

function failureRows(timeline) {
  const failures = (timeline?.events || []).filter(event => event.type === 'AVERIA')
  if (failures.length === 0) return '<tr><td colspan="4">Sin averías registradas</td></tr>'
  return failures.map(event => `<tr><td>${display(event.description || event.title || 'Avería')}</td><td>${display(formatDate(event.dateTime))}</td><td>${display(formatDate(event.metadata?.attentionDate))}</td><td>${display(event.metadata?.downtimeMinutes ? `${formatNumber(event.metadata.downtimeMinutes / 1440)} días` : '-')}</td></tr>`).join('')
}

function buildHtml(equipment, psrDetails, timeline, photoSections) {
  const summary = timeline?.summary || {}
  const psr = psrDetails || equipment.psrOsr || {}
  const general = section('Información general', [
    row('Proveedor', display(equipment.proveedorNombre)),
    row('Marca', display(equipment.marcaNombre)),
    row('Modelo', display(equipment.modelo)),
    row('Código', display(equipment.codigo)),
    row('N° serie', display(equipment.numeroSerie)),
    row('Guía de remisión', display(equipment.numeroGuiaRemision)),
  ].join(''))
  const accessories = section('Información de accesorios', `<table><thead><tr><th>Accesorio</th><th>Incluido</th><th>Número de serie</th></tr></thead><tbody>${accessoryFields.map(item => `<tr><td>${display(item.label)}</td><td>${equipment[item.key] ? 'Sí' : 'No'}</td><td>${display(item.serial ? equipment[item.serial] : '-')}</td></tr>`).join('')}</tbody></table>`)
  const service = section('Información del servicio', [
    row('PSR asociada', display(psr.numeroPsr)),
    row('OSR asociada', display(psr.numeroOsr)),
    row('Fecha inicio', display(formatDate(psr.fechaInicioUso || summary.entryDate))),
    row('Fecha fin', display(formatDate(psr.fechaFinUso))),
    row('Tiempo de servicio', display(summary.serviceMonths ? `${summary.serviceMonths} meses` : '-')),
    row('Tiempo de paros', display(summary.totalDowntimeMinutes ? `${formatNumber(summary.totalDowntimeMinutes / 1440)} días` : '0 días')),
  ].join(''))
  const failures = section('Información de averías', `<table><thead><tr><th>Falla</th><th>Fecha inicio</th><th>Fecha fin</th><th>Tiempo paro</th></tr></thead><tbody>${failureRows(timeline)}</tbody></table>`)
  const totals = section('Resumen operativo', `<div class="totals"><div><strong>${display(formatDate(summary.entryDate))}</strong><span>Fecha ingreso</span></div><div><strong>${display(summary.failureCount || 0)}</strong><span>Averías</span></div><div><strong>${display(formatDate(summary.finalDate))}</strong><span>Fecha devolución</span></div></div>`)
  const photos = ['received', 'accessories', 'delivered'].map(key => section(photoSections[key].title, photoSections[key].markup)).join('')

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 18mm 14mm; } * { box-sizing: border-box; } body { font-family: Arial, sans-serif; color: ${colors.dark}; font-size: 10px; margin: 0; }
    header { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid ${colors.primary}; padding-bottom: 10px; margin-bottom: 12px; } .brand { color: ${colors.primary}; font-size: 18px; font-weight: 700; letter-spacing: 1px; } h1 { margin: 0; font-size: 17px; } header p { margin: 4px 0 0; color: ${colors.muted}; }
    section { margin-bottom: 10px; border: 1px solid ${colors.border}; } h2 { background: ${colors.primary}; color: #fff; font-size: 11px; margin: 0; padding: 5px 8px; text-align: center; } .row { display: flex; border-bottom: 1px solid ${colors.soft}; padding: 4px 7px; min-height: 20px; } .row:last-child { border-bottom: 0; } .row strong { width: 34%; } .row span { flex: 1; }
    table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid ${colors.border}; padding: 5px; text-align: left; } th { background: ${colors.soft}; } .totals { display: flex; } .totals div { flex: 1; text-align: center; padding: 8px; border-right: 1px solid ${colors.border}; } .totals div:last-child { border-right: 0; } .totals strong, .totals span { display: block; } .totals span { color: ${colors.muted}; margin-top: 3px; }
    .page-break { page-break-before: always; } .photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 8px; } figure { margin: 0; border: 1px solid ${colors.border}; page-break-inside: avoid; } img { display: block; width: 100%; height: 145px; object-fit: cover; } figcaption { padding: 4px; text-align: center; color: ${colors.muted}; } .empty { padding: 12px; color: ${colors.muted}; text-align: center; }
  </style></head><body>${pageHeader('Reporte de equipo devuelto', equipment)}${general}${accessories}${service}${failures}${totals}<div class="page-break"></div>${pageHeader('Registro fotográfico', equipment)}${photos}</body></html>`
}

export async function generateEquipmentReport(equipmentId) {
  const equipmentResponse = await api.get(`/equipos/${equipmentId}`)
  const equipment = equipmentResponse.data?.data || equipmentResponse.data
  const psrId = equipment?.psrOsr?.psrId
  const [timelineResponse, baseUrl, token, psrResponse] = await Promise.all([
    api.get(`/equipos/${equipmentId}/timeline`),
    loadApiUrl(),
    getToken(),
    psrId ? api.get(`/psr/${psrId}`).catch(() => null) : Promise.resolve(null),
  ])
  const psrDetails = psrResponse?.data?.data || psrResponse?.data || null
  const timeline = timelineResponse.data?.data || timelineResponse.data
  const grouped = { received: [], accessories: [], delivered: [] }
  getPhotos(timeline).forEach(photo => grouped[classifyPhoto(photo)].push(photo))
  const photoSections = {}
  for (const [key, photos] of Object.entries(grouped)) {
    photoSections[key] = {
      title: key === 'received' ? 'Fotografías del equipo recepcionado' : key === 'accessories' ? 'Fotografías de accesorios' : 'Fotografías del equipo entregado',
      markup: await photoMarkup(photos, baseUrl, token),
    }
  }
  const file = await generatePDF({ html: buildHtml(equipment, psrDetails, timeline, photoSections), fileName: `reporte_${equipment.codigo || equipmentId}_${Date.now()}`, directory: 'Documents' })
  await Share.open({ url: file.filePath, type: 'application/pdf', title: 'Reporte de equipo', failOnCancel: false })
  return file.filePath
}
