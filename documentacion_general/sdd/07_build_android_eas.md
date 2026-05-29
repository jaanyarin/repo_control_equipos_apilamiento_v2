# BUILD ANDROID — CONFIGURACIÓN VALIDADA Y FUNCIONAL

| Campo | Valor |
|---|---|
| Fecha | 2026-05-29 |
| Alcance | APK Android instalable compilado y probado en dispositivo físico |
| Carpeta | `mobile/` |
| Estado | ✅ FUNCIONAL — NO MODIFICAR configuración sin validación |

---

## 1. Estado Actual

Se logró compilar, instalar y ejecutar exitosamente el APK en un dispositivo físico (realme C21Y, Android 14).

El build se realiza mediante **EAS Cloud** (servidores Expo), no localmente, debido a que Sophos Endpoint Agent (antivirus corporativo) bloquea las operaciones de rename atómico de Gradle en Windows.

---

## 2. Stack Mobile Validado (NO CAMBIAR)

| Componente | Versión | Observación |
|---|---|---|
| Expo SDK | ~54.0.35 | No cambiar versión mayor |
| React | 19.1.0 | No cambiar |
| React Native | 0.81.5 | No cambiar |
| react-native-paper | ^5.12.0 | |
| expo-secure-store | ~15.0.8 | |
| expo-web-browser | ~15.0.11 | |

### Configuración crítica (NO CAMBIAR)

| Archivo | Clave | Valor | Razón |
|---|---|---|---|
| `app.json` | `jsEngine` | `"hermes"` | RN 0.81 con newArch exige Hermes |
| `app.json` | `platforms` | `["android"]` | Solo Android contemplado |
| `package.json` | `main` | `"expo/AppEntry"` | Necesario para registerRootComponent |
| `gradle.properties` | `hermesEnabled` | `true` | Debe coincidir con app.json |
| `gradle.properties` | `newArchEnabled` | `true` | Nueva arquitectura React Native |

---

## 3. Perfiles EAS

| Perfil | Artefacto | Uso |
|---|---|---|
| `preview` | APK | Instalación directa en celular para validación |
| `production` | AAB | Publicación futura en Play Store |

---

## 4. Procedimiento de Build (EAS Cloud) — Recomendado

### 4.1 Requisitos
- Celular en misma red WiFi o conectado por USB Tethering al servidor backend
- Sesión iniciada en Expo: `npx eas-cli login`
- Backend corriendo en `http://IP_DEL_SERVIDOR:8080/api/v1`

### 4.2 Ejecutar build

```bash
cd mobile
npx eas-cli build --platform android --profile preview --non-interactive
```

Desde `package.json`:
```bash
npm run build:android:apk
```

### 4.3 Ver estado del build

```bash
npx eas-cli build:list --platform android --limit 1
```

Cuando aparezca `Status: finished`, descargar el APK desde el `Application Archive URL`.

### 4.4 Instalar en el celular
- Descargar el APK desde la URL de EAS
- Abrir el archivo APK en el celular y confirmar instalación
- Si el celular bloquea la instalación, habilitar "Instalar desde orígenes desconocidos" para este APK

### 4.5 Configurar URL del backend en runtime
Si la IP del servidor cambió, la URL se actualiza desde la app mediante SecureStore:

```js
import { setApiUrl } from './api'
await setApiUrl('http://NUEVA_IP:8080/api/v1')
```

Esto no requiere rebuild del APK.

---

## 5. Validación Esperada

1. Instalar APK en el celular.
2. Abrir la aplicación.
3. Presionar `Iniciar sesión con Microsoft`.
4. Completar autenticación.
5. Confirmar pantalla: **"Ingresaste de forma correcta"** con nombre y correo.

Si el login no retorna al APK, verificar:
- El redirect URI `com.apilamiento://callback/` registrado en Microsoft Entra ID
- El celular alcanza la IP del backend (`http://IP:8080/api/v1/auth/login`)

---

## 6. Build Local en Windows (Alternativo — Puede fallar por antivirus)

El equipo local tiene Java 17, Android SDK y NDK, por lo que puede compilar localmente.

### Limitación conocida
Sophos Endpoint Agent (antivirus corporativo) bloquea las operaciones de rename atómico de directorios temporales de Gradle, causando el error:

```
Could not move temporary workspace (C:\...\.gradle-home\caches\...) to immutable location
```

### Workaround para build local
```bash
cd mobile
npm run clean:gradle
npm run build:android:local:debug
```

El APK debug queda en:
```text
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

**Nota**: Si Sophos bloquea, agregar exclusiones (requiere permisos de administrador TI) para:
- `C:\repos\repo_control_equipos_apilamiento_v2\mobile`
- `C:\Users\jose.anyarin\.gradle`
- `C:\Users\jose.anyarin\AppData\Local\Android\Sdk`

---

## 7. Errores Conocidos y Soluciones

| Error | Causa | Solución |
|---|---|---|
| `SoLoaderDSONotFoundError: libhermestooling.so` | `jsEngine: jsc` + `newArchEnabled=true` | Cambiar a `jsEngine: hermes` en app.json |
| `AppRegistry.registerComponent wasn't called` | `main: App.js` no registra componente | Cambiar a `main: expo/AppEntry` |
| App se cierra sin error visible | Error JS en bundle | Revisar logs con `adb logcat` |
| Could not move temporary workspace | Antivirus bloquea rename Gradle | Usar EAS Cloud en vez de build local |
| Login no retorna al APK | Redirect URI no registrado | Registrar `com.apilamiento://callback/` en Azure |

---

## 8. ADVERTENCIA — Configuración que NO debe cambiarse

| Archivo | Línea | Valor correcto | NO cambiar a |
|---|---|---|---|
| `package.json:4` | `"main"` | `"expo/AppEntry"` | `"App.js"` |
| `app.json:3` | `"jsEngine"` | `"hermes"` | `"jsc"` |
| `android/gradle.properties:42` | `hermesEnabled` | `true` | `false` |
| `android/gradle.properties:38` | `newArchEnabled` | `true` | `false` |

Cualquier cambio en estos valores romperá el APK al abrirlo.
