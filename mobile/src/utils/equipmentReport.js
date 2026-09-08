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
      'Content-Type': 'application/json',
    })
  } catch (netErr) {
    const msg = netErr?.message || String(netErr)
    throw new Error(`Error de red: ${msg} — URL: ${url}`)
  }

  const info = res.info()
  const status = info?.statusCode

  if (!status || status !== 200) {
    let body = ''
    try { body = await res.text() } catch (_) {}
    throw new Error(
      `HTTP ${status || 'sin respuesta'} al descargar reporte. ` +
      (body ? `Detalle: ${body.substring(0, 200)}` : `URL: ${url}`)
    )
  }

  const { dirs } = ReactNativeBlobUtil.fs
  const filePath = `${dirs.CacheDir}/reporte_equipo_${equipmentId}.pdf`
  await ReactNativeBlobUtil.fs.writeFile(filePath, await res.base64(), 'base64')
  await FileViewer.open(filePath, { showOpenWithDialog: true, showAppsSuggestions: true })
  return filePath
}
