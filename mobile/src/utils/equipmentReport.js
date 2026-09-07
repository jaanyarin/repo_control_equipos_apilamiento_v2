import FileViewer from 'react-native-file-viewer'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { getToken, loadApiUrl } from '../api'

export async function generateEquipmentReport(equipmentId) {
  const [baseUrl, token] = await Promise.all([loadApiUrl(), getToken()])
  const url = `${baseUrl}/reportes/equipos/${equipmentId}/pdf`
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await ReactNativeBlobUtil.fetch('GET', url, headers)
  if (res.info().statusCode !== 200) {
    throw new Error(`Error descargando reporte: ${res.info().statusCode}`)
  }
  const { dirs } = ReactNativeBlobUtil.fs
  const filePath = `${dirs.CacheDir}/reporte_equipo_${equipmentId}.pdf`
  await ReactNativeBlobUtil.fs.writeFile(filePath, await res.base64(), 'base64')
  await FileViewer.open(filePath, { showOpenWithDialog: true, showAppsSuggestions: true })
  return filePath
}
