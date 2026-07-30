/**
 * ZoomableImage.js — Visor de imagen con zoom y desplazamiento.
 *
 * Soportes:
 *  - Zoom por pinza (2 dedos): escala de 1× a 5×
 *  - Arrastre (1 dedo): desplazamiento suave cuando la imagen está expandida (>1.05×)
 *  - Doble tap: alterna entre 1× y 2.5×, centrando el zoom en el punto tocado
 *  - Reseteo automático: si la escala final es < 1.3×, regresa animadamente a 1×
 *
 * Props:
 *  - uri: string — URL de la imagen
 *  - headers: object — cabeceras HTTP (p. ej. Authorization Bearer token)
 */
import React, { useRef } from 'react'
import { Animated, Dimensions, Image, View } from 'react-native'

// Dimensiones de pantalla usadas para centrar la imagen y calcular transformaciones
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')
const IMG_H = SCREEN_H * 0.72
const CX = SCREEN_W / 2
const CY = SCREEN_H / 2

export default function ZoomableImage({ uri, headers }) {
  // Valores animados (native driver) para escala y desplazamiento
  const scale = useRef(new Animated.Value(1)).current
  const offsetX = useRef(new Animated.Value(0)).current
  const offsetY = useRef(new Animated.Value(0)).current

  // Estado mutable (no causa re-render) para tracking de gestos táctiles
  const s = useRef({
    lastScale: 1,   // escala al inicio del gesto actual
    lastX: 0,       // offsetX al inicio del gesto actual
    lastY: 0,       // offsetY al inicio del gesto actual
    startDist: 0,   // distancia entre dedos al inicio del pinza
    tx: 0,          // pageX del toque inicial (1 dedo)
    ty: 0,          // pageY del toque inicial (1 dedo)
    pinching: false, // true mientras hay 2+ dedos en pantalla
  })

  // Último tap registrado para detección de doble tap
  const lastTap = useRef({ t: 0, x: 0, y: 0 })

  // Anima escala + desplazamiento en paralelo con spring (nativo)
  const anim = (toScale, toX, toY) =>
    Animated.parallel([
      Animated.spring(scale, { toValue: toScale, useNativeDriver: true }),
      Animated.spring(offsetX, { toValue: toX, useNativeDriver: true }),
      Animated.spring(offsetY, { toValue: toY, useNativeDriver: true }),
    ])

  // Resetea a 1× centrado
  const reset = () => anim(1, 0, 0).start()

  // Al tocar: captura estado actual según número de dedos
  const onTouchStart = (e) => {
    const touches = e.nativeEvent.touches
    if (touches.length >= 2) {
      // Pinza incipiente — guarda distancia inicial y escala actual
      const dx = touches[0].pageX - touches[1].pageX
      const dy = touches[0].pageY - touches[1].pageY
      s.current.startDist = Math.sqrt(dx * dx + dy * dy)
      s.current.lastScale = scale.__getValue()
      s.current.pinching = true
    } else {
      // Toque simple — guarda posición actual de desplazamiento y punto de inicio
      s.current.lastX = offsetX.__getValue()
      s.current.lastY = offsetY.__getValue()
      s.current.tx = touches[0].pageX
      s.current.ty = touches[0].pageY
    }
  }

  // Al mover: aplica escala (pinza) o desplazamiento (arrastre)
  const onTouchMove = (e) => {
    const touches = e.nativeEvent.touches
    const cur = s.current
    if (touches.length >= 2) {
      // Pinza: recalcula escala proporcional a la distancia actual vs inicial (rango 1×–5×)
      const dx = touches[0].pageX - touches[1].pageX
      const dy = touches[0].pageY - touches[1].pageY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (cur.startDist > 0) {
        scale.setValue(Math.min(Math.max(cur.lastScale * (dist / cur.startDist), 1), 5))
      }
    } else if (touches.length === 1 && !cur.pinching) {
      // Arrastre: solo cuando ya está expandido (>1.05×)
      const curScale = scale.__getValue()
      if (curScale > 1.05) {
        offsetX.setValue(cur.lastX + (touches[0].pageX - cur.tx))
        offsetY.setValue(cur.lastY + (touches[0].pageY - cur.ty))
      }
    }
  }

  // Al soltar: detecta doble tap o resetea si escala < 1.3×
  const onTouchEnd = (e) => {
    const cur = s.current
    if (cur.pinching) {
      // Finalizó pinza — limpia estado y resetea si queda cerca de 1×
      cur.pinching = false
      cur.startDist = 0
      const curScale = scale.__getValue()
      if (curScale < 1.3) reset()
      return
    }
    cur.startDist = 0
    const ct = e.nativeEvent.changedTouches
    if (ct && ct.length === 1) {
      // Doble tap: dos toques en <300ms y <40px de distancia
      const now = Date.now()
      const t = ct[0]
      const dt = now - lastTap.current.t
      const ddx = Math.abs(t.pageX - lastTap.current.x)
      const ddy = Math.abs(t.pageY - lastTap.current.y)
      const dist = Math.sqrt(ddx * ddx + ddy * ddy)
      lastTap.current = { t: now, x: t.pageX, y: t.pageY }
      if (dt < 300 && dist < 40) {
        const curScale = scale.__getValue()
        if (curScale > 1.3) {
          // Ya expandido → contraer
          reset()
        } else {
          // Contraído → expandir a 2.5× centrando en el punto tocado
          const tx = (1 - 2.5) * (t.pageX - CX)
          const ty = (1 - 2.5) * (t.pageY - CY)
          anim(2.5, tx, ty).start()
        }
        lastTap.current = { t: 0, x: 0, y: 0 }
        return
      }
    }
    // Reseteo automático si escala final < 1.3×
    const curScale = scale.__getValue()
    if (curScale < 1.3) reset()
  }

  if (!uri) return null
  const source = headers?.Authorization ? { uri, headers } : { uri }

  return (
    <View
      style={{ flex: 1, overflow: 'hidden' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/*
       * Animated.View con pointerEvents="box-none" para que los eventos táctiles
       * pasen a través hacia el contenedor padre que maneja los gestos.
       * Las transformaciones se aplican en orden: escala → desplazamiento X → desplazamiento Y.
       */}
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          justifyContent: 'center', alignItems: 'center',
          transform: [{ scale }, { translateX: offsetX }, { translateY: offsetY }],
        }}
      >
        <Image source={source} style={{ width: SCREEN_W, height: IMG_H }} resizeMode="contain" />
      </Animated.View>
    </View>
  )
}
