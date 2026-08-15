import { Platform, PermissionsAndroid } from 'react-native'

let messagingApi = null

try {
  messagingApi = require('@react-native-firebase/messaging')
} catch (error) {
  // Se permite que la app funcione sin FCM si la lib no está enlazada (modo dev / mocks).
}

const DEVICE_PLATFORM = 'ANDROID'

let backgroundHandlerRegistered = false
let notificationChannel = null

function getMessaging() {
  return messagingApi ? messagingApi.getMessaging() : null
}

function ensureChannel() {
  if (Platform.OS !== 'android' || notificationChannel) return notificationChannel
  try {
    const { Notifications } = require('react-native')
    if (Notifications && typeof Notifications.createChannel === 'function') {
      notificationChannel = 'ingreso-equipos'
      try {
        Notifications.createChannel(notificationChannel, {
          name: 'Ingresos de equipo',
          description: 'Notificaciones de nuevos ingresos de equipo',
          importance: 4,
          vibrate: true,
        })
      } catch (e) {
        // Si no hay módulo nativo de notificaciones (p.ej. tests), se ignora silenciosamente.
      }
    }
  } catch (e) {
    // Sin react-native-push-notification ni equivalente; el canal lo gestiona FCM por defecto.
  }
  return notificationChannel
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
    ensureChannel()
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
