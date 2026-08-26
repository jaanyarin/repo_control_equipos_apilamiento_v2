import { Platform, PermissionsAndroid } from 'react-native'

let messagingApi = null
let notifeeApi = null

try {
  messagingApi = require('@react-native-firebase/messaging')
} catch (error) {
  // Se permite que la app funcione sin FCM si la lib no está enlazada (modo dev / mocks).
}

try {
  notifeeApi = require('@notifee/react-native')
} catch (error) {
  // Se permite que la app funcione sin notifee en modo dev / tests.
}

const DEVICE_PLATFORM = 'ANDROID'
const CHANNEL_ID = 'apilamiento-alertas'

let backgroundHandlerRegistered = false
let notificationChannelCreated = false

function getMessaging() {
  return messagingApi ? messagingApi.getMessaging() : null
}

async function ensureChannel() {
  if (Platform.OS !== 'android' || notificationChannelCreated) return
  try {
    if (notifeeApi) {
      const { default: notifeeInstance, AndroidImportance: Importance } = notifeeApi
      await notifeeInstance.createChannel({
        id: CHANNEL_ID,
        name: 'Alertas operativas',
        importance: Importance.HIGH,
        vibration: true,
        sound: 'default',
      })
      notificationChannelCreated = true
    }
  } catch (_e) {
    // Tests / entorno sin módulo nativo
  }
}

export async function requestNotificationPermission() {
  if (Platform.OS !== 'android') return true
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Permiso de notificaciones',
        message: '¿Permitir que la app envíe notificaciones de nuevos ingresos de equipo?',
        buttonPositive: 'Permitir',
        buttonNegative: 'Cancelar',
      }
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  } catch (err) {
    return false
  }
}

export async function getFcmToken() {
  const messaging = getMessaging()
  if (!messaging) return null
  try {
    await ensureChannel()
    const permissionGranted =
      Platform.OS === 'android' ? await requestNotificationPermission() : true
    if (!permissionGranted) return null
    await messagingApi.requestPermission(messaging)
    const token = await messagingApi.getToken(messaging)
    return token || null
  } catch (err) {
    return null
  }
}

export async function displayLocalNotification(remoteMessage) {
  if (!notifeeApi || !remoteMessage) return
  try {
    const { default: notifeeInstance } = notifeeApi
    const notification = remoteMessage.notification || {}
    const title = notification.title || 'Notificación'
    const body = notification.body || ''
    await notifeeInstance.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNEL_ID,
        sound: 'default',
        pressAction: { id: 'default' },
      },
    })
  } catch (_e) {
    // best-effort
  }
}

export async function deleteFcmToken() {
  const messaging = getMessaging()
  if (!messaging) return
  try {
    await messagingApi.deleteToken(messaging)
  } catch (err) {
    // best-effort
  }
}

export function registerBackgroundMessageHandler(handler) {
  const messaging = getMessaging()
  if (!messaging || backgroundHandlerRegistered) return
  try {
    messagingApi.setBackgroundMessageHandler(messaging, handler)
    backgroundHandlerRegistered = true
  } catch (err) {
    // best-effort
  }
}

export function onMessage(handler) {
  const messaging = getMessaging()
  if (!messaging) return () => {}
  try {
    return messagingApi.onMessage(messaging, handler)
  } catch (err) {
    return () => {}
  }
}

export function onMessageOpenedApp(handler) {
  const messaging = getMessaging()
  if (!messaging) return () => {}
  try {
    return messagingApi.onNotificationOpenedApp(messaging, handler)
  } catch (err) {
    return () => {}
  }
}

export async function getInitialNotification() {
  const messaging = getMessaging()
  if (!messaging) return null
  try {
    const message = await messagingApi.getInitialNotification(messaging)
    return message || null
  } catch (err) {
    return null
  }
}

export function onTokenRefresh(handler) {
  const messaging = getMessaging()
  if (!messaging) return () => {}
  try {
    return messagingApi.onTokenRefresh(messaging, handler)
  } catch (err) {
    return () => {}
  }
}

export function getDevicePlatform() {
  return DEVICE_PLATFORM
}

export function isPushAvailable() {
  return messagingApi != null
}
