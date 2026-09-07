import { generatePDF } from 'react-native-html-to-pdf'
import FileViewer from 'react-native-file-viewer'
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

function calcularMeses(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) return '-'
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  const diffMs = fin - inicio
  if (diffMs <= 0) return '-'
  const diffDias = diffMs / (1000 * 60 * 60 * 24)
  return `${(diffDias / 30.44).toFixed(2)} meses`
}

function calcularTotalHorometro(inicio, fin) {
  if (inicio == null || fin == null) return '-'
  const total = Number(fin) - Number(inicio)
  return total >= 0 ? formatNumber(total) : '-'
}

function section(title, content) {
  return `<section><h2>${display(title)}</h2>${content}</section>`
}

function row(label, content) {
  return `<div class="row"><strong>${display(label)}</strong><span>${content}</span></div>`
}

function pageHeader(title, subtitle) {
  return `<header><div class="brand">VANGUARD</div><div><h1>${display(title)}</h1>${subtitle ? `<p>${display(subtitle)}</p>` : ''}</div></header>`
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

const TEMP_PHOTOS_DIR = 'equipment_report_photos'

async function photoData(photo, baseUrl, token) {
  if (!photo.url) return null
  try {
    const url = `${baseUrl}${photo.url}`
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await ReactNativeBlobUtil.fetch('GET', url, headers)
    const status = response.info().statusCode
    if (status !== 200) {
      console.warn('[equipmentReport] Foto no disponible:', photo.url, 'status:', status)
      return null
    }
    const base64 = await response.base64()
    const { dirs, writeFile } = ReactNativeBlobUtil.fs
    const photoDir = `${dirs.CacheDir}/${TEMP_PHOTOS_DIR}`
    await ReactNativeBlobUtil.fs.mkdir(photoDir).catch(() => {})
    const safeName = (photo.id || `photo_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_')
    const filePath = `${photoDir}/${safeName}.jpg`
    await writeFile(filePath, base64, 'base64')
    return `${safeName}.jpg`
  } catch (e) {
    console.warn('[equipmentReport] Error descargando foto:', photo.url, e.message)
    return null
  }
}

async function photoMarkup(photos, baseUrl, token) {
  const items = await Promise.all(photos.map(async photo => ({ photo, data: await photoData(photo, baseUrl, token) })))
  const valid = items.filter(item => item.data)
  if (valid.length === 0) return '<p class="empty">Sin fotografías registradas.</p>'
  return `<div class="photos">${valid.map(({ photo, data }) => `<figure><img src="${data}" /><figcaption>${display(photo.description || photo.type || 'Evidencia')}</figcaption></figure>`).join('')}</div>`
}

function failureRows(timeline) {
  const failures = (timeline?.events || []).filter(event => event.type === 'AVERIA')
  if (failures.length === 0) return '<tr><td colspan="5">Sin averías registradas</td></tr>'
  return failures.map(event => {
    const reparacion = (timeline?.events || []).find(e => e.type === 'REPARACION' && e.relatedId === event.relatedId)
    const downtimeMinutes = reparacion?.metadata?.downtimeMinutes || 0
    const downtime = downtimeMinutes > 0 ? `${formatNumber(downtimeMinutes / 1440)} días` : '-'
    return `<tr><td>${display(event.metadata?.failure || event.description)}</td><td>${display(formatDate(event.dateTime))}</td><td>${display(formatNumber(event.metadata?.hourMeter))}</td><td>${display(formatDate(reparacion?.dateTime))}</td><td>${display(formatNumber(reparacion?.metadata?.hourMeter))}</td><td>${display(downtime)}</td></tr>`
  }).join('')
}

function buildHtml(equipment, psrDetails, timeline, photoSections, page1Title, page2Title) {
  const summary = timeline?.summary || {}
  const psrRaw = psrDetails || equipment.psrOsr || {}
  const psr = { ...psrRaw, numeroOsr: psrRaw.osr?.numeroOsr || psrRaw.osrs?.[0]?.numeroOsr }
  const general = section('Información general', [
    row('Proveedor', display(equipment.proveedorNombre)),
    row('Marca', display(equipment.marcaNombre)),
    row('Modelo', display(equipment.modelo)),
    row('Código', display(equipment.codigo)),
    row('Nro Serie', display(equipment.numeroSerie)),
    row('Guía Remisión', display(equipment.numeroGuiaRemision)),
  ].join(''))
  const accessories = section('Información de accesorios', `<table><thead><tr><th>Accesorio</th><th>Incluido</th><th>Número de serie</th></tr></thead><tbody>${accessoryFields.map(item => `<tr><td>${display(item.label)}</td><td>${equipment[item.key] ? 'Sí' : 'No'}</td><td>${display(item.serial ? equipment[item.serial] : '-')}</td></tr>`).join('')}</tbody></table>`)
  const service = section('Información del servicio', [
    row('PSR asociada', display(psr.numeroPsr)),
    row('OSR asociada', display(psr.numeroOsr)),
    row('Fecha Inicio de Servicio', display(formatDate(psr.fechaInicioUso || summary.entryDate))),
    row('Fecha Final de Servicio', display(formatDate(psr.fechaFinUso))),
    row('Tiempo de Servicio', display(calcularMeses(psr.fechaInicioUso, psr.fechaFinUso))),
    row('Fecha Ingreso de Máquina', display(formatDate(summary.entryDate))),
    row('Fecha Devolución de Máquina', display(formatDate(summary.finalDate))),
    row('Tiempo de Uso de Máquina', display(calcularMeses(summary.entryDate, summary.finalDate))),
    row('Horómetro Inicial', display(formatNumber(summary.initialHourMeter))),
    row('Horómetro Final', display(formatNumber(summary.finalHourMeter))),
    row('Total Horómetro', display(calcularTotalHorometro(summary.initialHourMeter, summary.finalHourMeter))),
  ].join(''))
  const failures = section('Información de averías', `<table><thead><tr><th>Descripción de la Falla</th><th>Fecha Inicio</th><th>Horómetro (avería)</th><th>Fecha Reparación</th><th>Horómetro (reparación)</th><th>Tiempo de paro</th></tr></thead><tbody>${failureRows(timeline)}</tbody></table>`)
  const photos = ['received', 'accessories', 'delivered'].map(key => section(photoSections[key].title, photoSections[key].markup)).join('')

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 18mm 14mm; } * { box-sizing: border-box; } body { font-family: Arial, sans-serif; color: ${colors.dark}; font-size: 10px; margin: 0; }
    header { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid ${colors.primary}; padding-bottom: 10px; margin-bottom: 12px; } .brand { color: ${colors.primary}; font-size: 18px; font-weight: 700; letter-spacing: 1px; } h1 { margin: 0; font-size: 17px; } header p { margin: 4px 0 0; color: ${colors.muted}; }
    section { margin-bottom: 10px; border: 1px solid ${colors.border}; } h2 { background: ${colors.primary}; color: #fff; font-size: 11px; margin: 0; padding: 5px 8px; text-align: center; } .row { display: flex; border-bottom: 1px solid ${colors.soft}; padding: 4px 7px; min-height: 20px; } .row:last-child { border-bottom: 0; } .row strong { width: 34%; } .row span { flex: 1; }
    table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid ${colors.border}; padding: 5px; text-align: left; } th { background: ${colors.soft}; }
    .page-break { page-break-before: always; } .photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 8px; } figure { margin: 0; border: 1px solid ${colors.border}; page-break-inside: avoid; } img { display: block; width: 100%; height: 145px; object-fit: cover; } figcaption { padding: 4px; text-align: center; color: ${colors.muted}; } .empty { padding: 12px; color: ${colors.muted}; text-align: center; }
  </style></head><body>${pageHeader(page1Title)}${general}${accessories}${service}${failures}<div class="page-break"></div>${pageHeader(page2Title, `${display(equipment.codigo)} · ${display(equipment.modelo)}`)}${photos}</body></html>`
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
  const psrRaw = psrDetails || equipment.psrOsr || {}
  const psr = { ...psrRaw, numeroOsr: psrRaw.osr?.numeroOsr || psrRaw.osrs?.[0]?.numeroOsr }
  const grouped = { received: [], accessories: [], delivered: [] }
  getPhotos(timeline).forEach(photo => grouped[classifyPhoto(photo)].push(photo))
  const photoSections = {}
  for (const [key, photos] of Object.entries(grouped)) {
    photoSections[key] = {
      title: key === 'received' ? 'Fotografías del equipo recepcionado' : key === 'accessories' ? 'Fotografías de accesorios' : 'Fotografías del equipo entregado',
      markup: await photoMarkup(photos, baseUrl, token),
    }
  }
  const page1Title = `Reporte Detallado de Equipo - PSR: ${psr.numeroPsr || '-'} - OSR: ${psr.numeroOsr || '-'} - GRR: ${equipment.numeroGuiaRemision || '-'}`
  const page2Title = 'Reporte Fotográfico de Equipo'
  const html = buildHtml(equipment, psrDetails, timeline, photoSections, page1Title, page2Title)
  const safePsr = (psr.numeroPsr || 'PSR').replace(/[^a-zA-Z0-9_-]/g, '')
  const safeOsr = (psr.numeroOsr || 'OSR').replace(/[^a-zA-Z0-9_-]/g, '')
  const safeGrr = (equipment.numeroGuiaRemision || 'GRR').replace(/[^a-zA-Z0-9_-]/g, '')
  const fileName = `Reporte_detalle_equipo_psr_${safePsr}_osr_${safeOsr}_grr_${safeGrr}`
  const { dirs } = ReactNativeBlobUtil.fs
  const photoDir = `${dirs.CacheDir}/${TEMP_PHOTOS_DIR}`
  const baseURL = `file://${photoDir}/`
  const file = await generatePDF({ html, fileName, directory: 'Documents', baseURL })
  await ReactNativeBlobUtil.fs.unlink(photoDir).catch(() => {})
  await FileViewer.open(file.filePath, { showOpenWithDialog: true, showAppsSuggestions: true })
  return file.filePath
}
