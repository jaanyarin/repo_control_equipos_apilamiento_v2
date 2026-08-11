# HDT-009 — Teclado móvil no cubre los inputs (UX)

| Campo | Valor |
|---|---|
| Estado | Implementado y validado |
| Fecha | 2026-08-06 |
| Responsable de desarrollo | Codex |
| Alcance | Aplicación Android (mobile) |

## Objetivo

Eliminar el hallazgo de UX (G-MOB-UI) por el cual el teclado virtual del celular **cubría los campos de texto** (contraseña, nombre, observaciones), impidiendo ver lo que se escribe. La solución debe ser consistente en todas las pantallas con inputs y en los diálogos.

## Problema

- `mobile/android/app/src/main/AndroidManifest.xml:24` ya tenía `android:windowSoftInputMode="adjustResize"` (correcto).
- Sin embargo, las pantallas usaban `ScrollView` plano (sin `KeyboardAvoidingView`) o `View` sin scroll (`PasswordChangeScreen`), por lo que el teclado tapaba el campo enfocado.
- El perfil de auditor registró el hallazgo de adaptación a tamaños de pantalla (G-MOB-UI).

## Solución

### Componente reutilizable — `mobile/src/components/KeyboardAwareScrollView.js`

| Aspecto | Detalle |
|---|---|
| Estructura | `KeyboardAvoidingView` (Android `behavior="height"`, iOS `behavior="padding"`) envolviendo un `ScrollView` con `keyboardShouldPersistTaps="handled"`. |
| Props | `behavior` (anula el default por plataforma), `keyboardVerticalOffset` (default `0`; en iOS se usa para descontar el header), `contentContainerStyle`, `style`, resto de props pasan al `ScrollView`. |

**Decisión de diseño**: una primera versión usó `useHeaderHeight` de `@react-navigation/elements`, pero ese hook lanza error fuera de un navigator y rompía los tests que renderizan pantallas aisladas. La versión final no lo usa y configura `keyboardVerticalOffset` vía prop.

### Pantallas migradas

| Pantalla | Antes | Después |
|---|---|---|
| `LoginScreen.js` | `ScrollView` | `KeyboardAwareScrollView` |
| `PasswordChangeScreen.js` | `View` sin scroll, `flex: 1` | `KeyboardAwareScrollView` + `flexGrow: 1` en `contentContainerStyle` |
| `CreateEditUserScreen.js` | `ScrollView` | `KeyboardAwareScrollView` |
| `CreatePsrScreen.js` | `ScrollView` | `KeyboardAwareScrollView` |
| `RegistrarAveriaScreen.js` | `ScrollView` | `KeyboardAwareScrollView` (formulario y fotos) |
| `AtenderAveriaScreen.js` | `ScrollView` | `KeyboardAwareScrollView` |
| `SettingsScreen.js` | `ScrollView` | `KeyboardAwareScrollView` |

### Excepción `EquipmentFormScreen.js`

Tiene un footer sticky (botón de guardado) que debe quedar **por encima del teclado** pero **fuera del scroll**. Se reestructuró con `KeyboardAvoidingView` + `ScrollView` interno, dejando el footer como hermano (se eleva con el teclado sin moverse del viewport).

### Diálogos con inputs

En `CampanasScreen.js` y `CatalogScreen.js` el `ScrollView` interno de `Dialog.ScrollArea` se envolvió en `KeyboardAvoidingView` (`padding` iOS / `height` Android) con `keyboardShouldPersistTaps="handled"`, evitando que el teclado tape los campos del diálogo.

## Corrección de tests pre-existentes

| Test | Problema | Corrección |
|---|---|---|
| `PasswordChangeScreen.test.js` | "No safe area value available" (la pantalla usa `useSafeAreaInsets` y el test no envolvía en `SafeAreaProvider`) | Render envuelto en `SafeAreaProvider` con `initialMetrics` |
| `AuthContext.test.js` | Flaky por timing: timeout de 5s excedido bajo carga paralela | Timeout del test elevado a 15s |

## Archivos Modificados/Creados

| Archivo | Acción |
|---|---|
| `mobile/src/components/KeyboardAwareScrollView.js` | Nuevo |
| `mobile/src/LoginScreen.js` | Modificado |
| `mobile/src/screens/PasswordChangeScreen.js` | Modificado |
| `mobile/src/screens/CreateEditUserScreen.js` | Modificado |
| `mobile/src/screens/CreatePsrScreen.js` | Modificado |
| `mobile/src/screens/EquipmentFormScreen.js` | Modificado (KAV + ScrollView, footer sticky fuera) |
| `mobile/src/screens/RegistrarAveriaScreen.js` | Modificado |
| `mobile/src/screens/AtenderAveriaScreen.js` | Modificado |
| `mobile/src/screens/SettingsScreen.js` | Modificado |
| `mobile/src/screens/CampanasScreen.js` | Modificado (KAV en dialog) |
| `mobile/src/screens/CatalogScreen.js` | Modificado (KAV en dialog) |
| `mobile/src/__tests__/KeyboardAwareScrollView.test.js` | Nuevo (3 tests) |
| `mobile/src/__tests__/PasswordChangeScreen.test.js` | Modificado (SafeAreaProvider) |
| `mobile/src/__tests__/AuthContext.test.js` | Modificado (timeout 15s) |

## Validación

- **Mobile lint**: `npm run lint` → exit 0.
- **Mobile tests**: `npm test` → **38/38 pass** (12 suites). Nuevo `KeyboardAwareScrollView.test.js` cubre: renderizado de hijos, respeto de la prop `behavior`, y `keyboardShouldPersistTaps="handled"` por defecto.
- **Dispositivos**: pendiente de verificación manual en celular (el comportamiento `adjustResize` + `KeyboardAvoidingView` ya está probado por tests y config de AndroidManifest).

## Decisiones

- Componente reutilizable en lugar de `KeyboardAvoidingView` por pantalla: evita duplicación y garantiza consistencia.
- Sin `useHeaderHeight` en el componente: mantiene los tests de pantallas aisladas verdes.
- `EquipmentFormScreen` no usa el wrapper por su footer sticky; patrón `KeyboardAvoidingView` + `ScrollView` directo.
- Los diálogos usan `KeyboardAvoidingView` local, porque el `KeyboardAwareScrollView` completo no aplica dentro de `Dialog.ScrollArea`.
