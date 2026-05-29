# BUILD ANDROID CON EAS

| Campo | Valor |
|---|---|
| Fecha | 2026-05-29 |
| Alcance | APK Android instalable y AAB productivo |
| Carpeta | `mobile/` |

---

## 1. Estado

La aplicacion mobile ya contiene configuracion EAS en `mobile/eas.json`.

Perfiles configurados:

| Perfil | Artefacto | Uso |
|---|---|---|
| `preview` | APK | Instalacion directa en celular para validacion |
| `production` | AAB | Publicacion futura en Play Store |
| `development` | APK dev client | Desarrollo con cliente nativo |

---

## 2. Variables

La URL publica usada por el APK se define con `EXPO_PUBLIC_API_URL`.

Para validacion local, el celular debe estar en la misma red que el backend y la URL debe apuntar a la IP LAN del equipo servidor.

Ejemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.18.229:8080/api/v1
```

No colocar secretos OIDC, contrasenas de base de datos ni claves privadas dentro del APK.

---

## 3. Firma Android

Flujo recomendado para este proyecto:

1. Iniciar sesion en Expo.
2. Ejecutar build APK con perfil `preview`.
3. Cuando EAS pregunte por credenciales Android, seleccionar credenciales gestionadas por Expo.
4. Descargar e instalar el APK generado en el celular.

Comandos:

```bash
cd mobile
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

Comandos equivalentes desde `package.json`:

```bash
npm run build:android:apk
npm run credentials:android
```

---

## 4. Validacion Esperada

1. Instalar APK en el celular.
2. Abrir la aplicacion.
3. Presionar `Iniciar sesion con Microsoft`.
4. Completar autenticacion.
5. Confirmar pantalla: `Ingresaste de forma correcta` con nombre y correo.

Si el login no retorna al APK, revisar que Microsoft Entra ID tenga registrado el redirect URI:

```text
com.apilamiento://callback/
```

---

## 5. Build Local en Windows

El equipo local tiene Java 17, Android SDK, build-tools, platform-tools, NDK y `keytool`, por lo que puede compilar Android localmente.

Limitacion practica:

- `eas build --local` en Windows debe ejecutarse desde WSL.
- En Windows nativo, usar `expo prebuild` + Gradle.

Comandos disponibles:

```bash
cd mobile
npm run build:android:local:debug
```

El APK debug queda normalmente en:

```text
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

Este APK sirve para validar instalacion y login en celular. Para APK/AAB de distribucion con firma formal, usar EAS Build o configurar keystore Android propio.
