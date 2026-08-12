import { Platform, PermissionsAndroid } from 'react-native'

let messaging = null
let notificationChannel = null

try {
  messaging = require('@react-native-firebase/messaging').default
} catch (error) {
  // Se permite que la app funcione sin FCM si la lib no está enlazada (modo dev / mocks).
}

const DEVICE_PLATFORM = 'ANDROID'

let backgroundHandlerRegistered = false

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
  if (!messaging) return null
  try {
    ensureChannel()
    const permissionGranted =
      Platform.OS === 'android' ? await requestNotificationPermission() : true
    if (!permissionGranted) return null
    await messaging().requestPermission()
    const token = await messaging().getToken()
    return token || null
  } catch (err) {
    return null
  }
}

export async function deleteFcmToken() {
  if (!messaging) return
  try {
    await messaging().deleteToken()
  } catch (err) {
    // best-effort
  }
}

export function registerBackgroundMessageHandler(handler) {
  if (!messaging || backgroundHandlerRegistered) return
  try {
    messaging().setBackgroundMessageHandler(handler)
    backgroundHandlerRegistered = true
  } catch (err) {
    // best-effort
  }
}

export function onMessage(handler) {
  if (!messaging) return () => {}
  try {
    return messaging().onMessage(handler)
  } catch (err) {
    return () => {}
  }
}

export function onMessageOpenedApp(handler) {
  if (!messaging) return () => {}
  try {
    return messaging().onNotificationOpenedApp(handler)
  } catch (err) {
    return () => {}
  }
}

export async function getInitialNotification() {
  if (!messaging) return null
  try {
    const message = await messaging().getInitialNotification()
    return message || null
  } catch (err) {
    return null
  }
}

export function onTokenRefresh(handler) {
  if (!messaging) return () => {}
  try {
    return messaging().onTokenRefresh(handler)
  } catch (err) {
    return () => {}
  }
}

export function getDevicePlatform() {
  return DEVICE_PLATFORM
}

export function isPushAvailable() {
  return messaging != null
}
