import FileViewer from 'react-native-file-viewer'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { getToken, loadApiUrl } from '../api'

export async function generateEquipmentReport(equipmentId) {
  const [baseUrl, token] = await Promise.all([loadApiUrl(), getToken()])
  const url = `${baseUrl}/reportes/equipos/${equipmentId}/pdf`

  let res
  try {
    res = await ReactNativeBlobUtil.fetch('GET', url, {
      Authorization: `Bearer ${token}`,
    })
  } catch (netErr) {
    const msg = netErr?.message || String(netErr)
    throw new Error(`Error de red: ${msg} — URL: ${url}`)
  }

  const b64 = await res.base64()
  const PDF_MAGIC = 'JVBER' // %PDF en base64
  if (!b64 || !b64.startsWith(PDF_MAGIC)) {
    let detail = ''
    try { detail = atob(b64).substring(0, 300) } catch (_) {}
    throw new Error(
      detail
        ? `Error del servidor: ${detail}`
        : `Respuesta vacía del servidor — URL: ${url}`
    )
  }

  const { dirs } = ReactNativeBlobUtil.fs
  const filePath = `${dirs.CacheDir}/reporte_equipo_${equipmentId}.pdf`
  await ReactNativeBlobUtil.fs.writeFile(filePath, b64, 'base64')
  await FileViewer.open(filePath, { showOpenWithDialog: true, showAppsSuggestions: true })
  return filePath
}
