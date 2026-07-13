# Migración de Expo a React Native CLI

## 1. Propósito

Este documento es la instrucción operativa oficial para migrar la aplicación móvil del repositorio `jaanyarin/repo_control_equipos_apilamiento_v2` desde Expo SDK 54 a React Native CLI, conservando la funcionalidad existente y habilitando la generación de APK y AAB directamente con Gradle.

La migración debe ejecutarse exclusivamente en la rama:

```text
refactor/mobile-react-native-cli
```

No se debe modificar `main` durante la ejecución.

---

## 2. Resultado esperado

Al finalizar, el proyecto móvil activo ubicado en `mobile/` debe cumplir lo siguiente:

- Usar React Native CLI.
- Mantener React Native `0.81.5` y React `19.1.0`, salvo incompatibilidad técnica demostrada y documentada.
- Contener y versionar `mobile/android/`.
- Usar Gradle para generar APK y AAB.
- No depender de Expo, Expo Go, EAS Build ni `expo prebuild`.
- Conservar las pantallas, navegación, estilos y lógica funcional existentes.
- Mantener React Native Paper como sistema UI.
- Mantener el package Android `com.apilamiento.mobile`.
- Mantener el esquema de deep linking `com.apilamiento://callback/` mientras se valida su uso.
- Mantener almacenamiento seguro para JWT mediante una librería nativa.
- Generar correctamente un APK debug.
- Incorporar validación Android en GitHub Actions.

---

## 3. Estado inicial confirmado

Actualmente el repositorio presenta este estado:

- `mobile/` continúa siendo un proyecto Expo SDK 54.
- `mobile/package.json` usa `expo/AppEntry`.
- Los scripts de build utilizan Expo y EAS.
- `mobile/app.json` contiene configuración Expo.
- `mobile/android/` está excluido en `.gitignore`.
- Existe `mobile_expo_backup/` como respaldo.
- `AGENTS.md` todavía define Expo como stack oficial.
- El workflow móvil solo ejecuta instalación, lint y Jest; no compila Gradle.

La migración fue iniciada, pero no quedó consolidada como React Native CLI.

---

## 4. Reglas obligatorias

### 4.1 Git

- Trabajar exclusivamente en `refactor/mobile-react-native-cli`.
- No hacer commits directos en `main`.
- No usar `git add -A` sin revisar antes `git status` y `git diff`.
- No incluir archivos generados, cachés, secretos, APK, AAB ni keystores.
- Mantener commits pequeños y verificables.
- Usar Conventional Commits.

### 4.2 Protección de funcionalidad

- No eliminar `mobile_expo_backup/` hasta que la migración haya sido validada completamente.
- No reescribir pantallas funcionales sin necesidad.
- No cambiar flujos de negocio.
- No cambiar rutas de API existentes sin documentarlo.
- No cambiar nombres de pantallas ni rutas de navegación salvo incompatibilidad técnica.
- No reemplazar React Native Paper.
- No introducir Redux si no es necesario para la migración.
- No implementar iOS.
- No implementar modo offline.

### 4.3 Android

- No cambiar `applicationId` de `com.apilamiento.mobile`.
- No cambiar el esquema `com.apilamiento` sin validación.
- No guardar secretos ni contraseñas en archivos versionados.
- No versionar `local.properties`.
- No versionar archivos `.jks` o `.keystore`.
- No declarar la migración terminada sin generar un APK debug.

### 4.4 Seguridad

- No usar AsyncStorage para almacenar JWT.
- Reemplazar `expo-secure-store` por una alternativa nativa segura, preferentemente `react-native-keychain`.
- Mantener la lógica actual de expiración, lectura y eliminación del token.
- No hardcodear credenciales ni tokens.

---

## 5. Archivos y funcionalidad que deben conservarse

Conservar y adaptar:

```text
mobile/src/
mobile/assets/
mobile/App.js
mobile/__tests__/
mobile_expo_backup/
```

Conservar especialmente:

- AuthContext.
- Configuración centralizada de Axios.
- Configuración dinámica de URL del backend.
- Login local.
- Cambio de contraseña.
- React Navigation.
- Bottom tabs.
- Pantallas de equipos.
- Pantallas de averías.
- Pantallas de campañas.
- Pantallas de catálogos.
- Pantallas de usuarios y roles.
- Pantalla de auditoría.
- Pantalla de configuración.
- Pantallas PSR y motivos PSR.
- React Hook Form y Zod donde ya se utilicen.

---

## 6. Dependencias Expo a revisar

Analizar todos los imports del proyecto antes de eliminar dependencias.

Buscar al menos:

```text
expo
expo-secure-store
expo-status-bar
expo-asset
expo-font
expo-web-browser
expo-auth-session
expo-constants
expo-linking
expo-dev-client
```

Comando recomendado:

```powershell
Get-ChildItem -Recurse mobile\src,mobile\App.js -Include *.js,*.jsx | Select-String -Pattern "expo"
```

No instalar reemplazos para una dependencia que no tenga uso real.

---

## 7. Sustituciones recomendadas

### 7.1 Almacenamiento seguro

Reemplazar:

```text
expo-secure-store
```

Por:

```text
react-native-keychain
```

La implementación debe conservar funciones equivalentes a:

```text
setToken(token)
getToken()
removeToken()
```

El resto de la aplicación no debe depender directamente de Keychain. La integración debe permanecer encapsulada en `src/api.js` o en un servicio específico.

### 7.2 StatusBar

Reemplazar:

```javascript
import { StatusBar } from 'expo-status-bar'
```

Por:

```javascript
import { StatusBar } from 'react-native'
```

Adaptar propiedades Expo como:

```jsx
<StatusBar style="light" />
```

A propiedades nativas como:

```jsx
<StatusBar barStyle="light-content" />
```

### 7.3 Assets

Usar `require()` para imágenes locales cuando aplique.

Ejemplo:

```javascript
require('./assets/fondo_login.png')
```

Solo configurar `react-native.config.js` para fuentes si existen fuentes personalizadas reales.

### 7.4 Linking y navegación web

Para funcionalidades activas de linking o apertura de navegador, evaluar primero APIs nativas de React Native:

```javascript
import { Linking } from 'react-native'
```

Instalar otra librería únicamente cuando la API nativa no cubra el caso.

---

## 8. Estructura final esperada

La carpeta móvil debe quedar como mínimo así:

```text
mobile/
├── android/
├── src/
├── assets/
├── __tests__/
├── App.js
├── index.js
├── app.json
├── package.json
├── package-lock.json
├── babel.config.js
├── metro.config.js
├── react-native.config.js
└── jest.config.js o configuración Jest equivalente
```

La carpeta `ios/` no es requerida para este proyecto Android-only.

---

## 9. Fases de ejecución

## Fase 0 — Diagnóstico y línea base

Antes de cambiar archivos:

1. Confirmar rama actual.
2. Ejecutar `git status`.
3. Registrar versión de Node, Java y Android SDK.
4. Ejecutar tests JavaScript actuales.
5. Buscar imports Expo.
6. Registrar todas las dependencias móviles.
7. Identificar archivos modificados previamente y evitar sobrescribir trabajo ajeno.

Comandos:

```powershell
git branch --show-current
git status --short
node --version
npm --version
java --version
cd mobile
npm ci
npm test -- --runInBand
```

Crear un reporte breve dentro de este mismo documento o en:

```text
documentacion_general/migraciones/MIGRACION_EXPO_A_REACT_NATIVE_CLI_AVANCE.md
```

Commit sugerido:

```text
chore(mobile): registrar linea base de migracion CLI
```

---

## Fase 1 — Crear base React Native CLI limpia

Crear una base temporal fuera de `mobile/` usando React Native CLI.

Versión objetivo:

```text
react-native 0.81.5
react 19.1.0
```

Ejemplo:

```powershell
cd ..
npx @react-native-community/cli init ApilamientoMobileCli --version 0.81.5 --package-name com.apilamiento.mobile
```

Validar primero la aplicación vacía:

```powershell
cd ApilamientoMobileCli
npm install
npx react-native start
npx react-native run-android
```

No copiar todavía el código funcional si la base vacía no compila.

Cuando la base funcione, incorporar a `mobile/`:

```text
android/
index.js
metro.config.js
babel.config.js
react-native.config.js
configuración Jest necesaria
```

Commit sugerido:

```text
feat(mobile): incorporar estructura base React Native CLI
```

---

## Fase 2 — Corregir `.gitignore`

Eliminar estas reglas:

```gitignore
mobile/android/
mobile/ios/
```

Agregar exclusiones internas:

```gitignore
# React Native Android
mobile/android/.gradle/
mobile/android/app/build/
mobile/android/build/
mobile/android/local.properties
mobile/android/.cxx/
mobile/android/captures/

# React Native iOS, si existiera localmente
mobile/ios/Pods/
mobile/ios/build/

# Gradle
mobile/.gradle-home/
*.jks
*.keystore
```

Confirmar:

```powershell
git status --short
```

La carpeta `mobile/android/` debe aparecer como versionable.

Commit sugerido:

```text
chore(mobile): versionar proyecto Android nativo
```

---

## Fase 3 — Migrar package.json

Eliminar configuración Expo:

```text
main: expo/AppEntry
expo start
expo run:android
expo prebuild
EAS build
jest-expo
babel-preset-expo
```

Usar scripts CLI equivalentes:

```json
{
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "android:debug": "cd android && gradlew.bat assembleDebug",
    "android:release": "cd android && gradlew.bat assembleRelease",
    "android:clean": "cd android && gradlew.bat clean",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint ."
  }
}
```

El entry point debe ser:

```json
"main": "index.js"
```

No copiar ciegamente versiones de la plantilla. Comparar cada dependencia con la versión compatible con React Native `0.81.5`.

Commit sugerido:

```text
refactor(mobile): reemplazar scripts Expo por React Native CLI
```

---

## Fase 4 — Migrar configuración de aplicación

Reemplazar el `app.json` Expo por uno compatible con React Native CLI:

```json
{
  "name": "ApilamientoMobile",
  "displayName": "Control de Equipos"
}
```

Crear o validar `index.js`:

```javascript
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

Configurar en Android:

```text
applicationId = com.apilamiento.mobile
```

Mantener el nombre visible:

```text
Control de Equipos
```

Trasladar el deep link al `AndroidManifest.xml` si sigue siendo requerido:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.apilamiento" android:host="callback" />
</intent-filter>
```

Commit sugerido:

```text
refactor(mobile): migrar entry point y configuracion Android
```

---

## Fase 5 — Reintegrar código funcional

Integrar el código existente:

```text
mobile/src/
mobile/assets/
mobile/App.js
mobile/__tests__/
```

Resolver imports y errores progresivamente.

Orden de validación recomendado:

1. `App.js` inicia.
2. React Native Paper carga.
3. SafeAreaProvider carga.
4. AuthProvider carga.
5. Login abre.
6. Navegación funciona.
7. Token se guarda y recupera.
8. API responde.
9. Pantallas operativas abren.

No modificar diseño o reglas de negocio salvo que una incompatibilidad impida compilar.

Commit sugerido:

```text
refactor(mobile): integrar aplicacion existente en base CLI
```

---

## Fase 6 — Sustituir almacenamiento seguro

Instalar y configurar `react-native-keychain`.

Reemplazar todas las llamadas a `expo-secure-store`.

Validar:

- Guardado del token.
- Lectura al reiniciar la aplicación.
- Eliminación al cerrar sesión.
- Manejo cuando no existe token.
- Manejo de errores nativos.

El API interno recomendado debe mantener:

```javascript
export async function setToken(token) {}
export async function getToken() {}
export async function removeToken() {}
```

Commit sugerido:

```text
refactor(mobile): reemplazar SecureStore por Keychain
```

---

## Fase 7 — Eliminar Expo completamente

Eliminar solo después de resolver todos los imports:

```text
expo
expo-asset
expo-auth-session
expo-constants
expo-dev-client
expo-font
expo-linking
expo-secure-store
expo-status-bar
expo-web-browser
babel-preset-expo
jest-expo
```

Eliminar si ya no son necesarios:

```text
eas.json
configuración EAS
plugins Expo
projectId Expo
owner Expo
```

Comprobar que no existan imports Expo:

```powershell
Get-ChildItem -Recurse mobile -Include *.js,*.jsx,*.json | Select-String -Pattern "expo"
```

No considerar coincidencias dentro de `mobile_expo_backup/` como error.

Commit sugerido:

```text
chore(mobile): eliminar dependencias y configuracion Expo
```

---

## Fase 8 — Build Android debug

Ejecutar desde `mobile/`:

```powershell
npm ci
npm test -- --runInBand
npx react-native start
```

En otra terminal:

```powershell
cd mobile\android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

Debe generarse:

```text
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

No versionar el APK.

Instalar en dispositivo o emulador:

```powershell
adb install -r mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

Commit sugerido:

```text
build(mobile): habilitar generacion de APK con Gradle
```

---

## Fase 9 — Validación funcional

Validar manualmente en Android:

- Inicio de la aplicación.
- Pantalla de login.
- Carga de roles y usuarios.
- Login exitoso.
- Cambio obligatorio de contraseña.
- Persistencia de sesión.
- Cierre de sesión.
- Configuración de URL del backend.
- Home.
- Equipos.
- Detalle de equipo.
- Registro de avería.
- Atención de avería.
- Campañas.
- Catálogos.
- Usuarios.
- Roles.
- Auditoría.
- PSR.
- Motivos PSR.
- Manejo de errores de red.
- Botón físico Atrás.
- Reinicio de la aplicación.

Registrar resultados en:

```text
documentacion_general/migraciones/MIGRACION_EXPO_A_REACT_NATIVE_CLI_AVANCE.md
```

---

## Fase 10 — Actualizar documentación

Actualizar al menos:

```text
AGENTS.md
README.md
documentacion_general/sdd/
```

Eliminar reglas que obliguen a usar:

```text
Expo SDK
expo/AppEntry
EAS Cloud
expo prebuild
expo-secure-store
```

Declarar como stack oficial:

```text
Mobile Frontend: React Native CLI 0.81.5
UI Mobile: React Native Paper
Android Build: Gradle
Secure Storage: react-native-keychain
Target: Android
```

Commit sugerido:

```text
docs(mobile): actualizar arquitectura oficial a React Native CLI
```

---

## Fase 11 — Actualizar CI/CD

Modificar el job móvil de GitHub Actions para:

1. Instalar Node.
2. Instalar Java compatible con la plantilla React Native.
3. Ejecutar `npm ci`.
4. Ejecutar Jest.
5. Dar permiso a `gradlew` en Linux.
6. Ejecutar `./gradlew assembleDebug`.
7. Opcionalmente publicar el APK debug como artifact.

Ejemplo base:

```yaml
mobile:
  name: Mobile Android - Build & Test
  runs-on: ubuntu-latest
  defaults:
    run:
      working-directory: mobile

  steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: npm
        cache-dependency-path: mobile/package-lock.json

    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        distribution: temurin
        java-version: '17'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test -- --runInBand

    - name: Grant Gradle permission
      run: chmod +x android/gradlew

    - name: Build debug APK
      run: cd android && ./gradlew assembleDebug
```

La versión final de Java debe corresponder con la plantilla generada por React Native `0.81.5`; no asumir una versión sin validar Gradle y Android Gradle Plugin.

Commit sugerido:

```text
ci(mobile): validar build Android CLI con Gradle
```

---

## 10. Manejo de errores

Codex no debe:

- Ignorar fallos de Gradle.
- Añadir `|| true` a pruebas o builds.
- Desactivar tests para obtener un build verde.
- Bajar arbitrariamente versiones sin documentarlo.
- Eliminar funcionalidades para resolver incompatibilidades.
- Cambiar el package Android.
- Reemplazar almacenamiento seguro por AsyncStorage.
- Marcar una fase como completada cuando solo se crearon archivos.

Ante un bloqueo:

1. Registrar el error exacto.
2. Identificar archivo, comando y versión involucrados.
3. Proponer la corrección mínima.
4. Aplicar una sola corrección por vez.
5. Repetir la validación fallida.
6. Documentar el resultado.

---

## 11. Criterios de aceptación

La migración solo puede considerarse completada cuando todos estos puntos estén cumplidos:

```text
[ ] La rama activa es refactor/mobile-react-native-cli.
[ ] mobile/package.json no depende de Expo.
[ ] mobile/package.json usa index.js como entry point.
[ ] mobile/android/ está versionado.
[ ] mobile/android/local.properties no está versionado.
[ ] No hay secretos ni keystores versionados.
[ ] Existe mobile/index.js.
[ ] Existe configuración Metro compatible con React Native CLI.
[ ] AppRegistry registra correctamente la aplicación.
[ ] applicationId es com.apilamiento.mobile.
[ ] React Native Paper funciona.
[ ] React Navigation funciona.
[ ] El login funciona.
[ ] El cambio de contraseña funciona.
[ ] El JWT se almacena con almacenamiento seguro nativo.
[ ] El cierre de sesión elimina el token.
[ ] La URL de API configurable funciona.
[ ] Jest finaliza sin errores.
[ ] Metro inicia sin errores.
[ ] Gradle clean finaliza correctamente.
[ ] Gradle assembleDebug finaliza correctamente.
[ ] Se genera app-debug.apk.
[ ] El APK se instala en Android.
[ ] Las pantallas críticas fueron probadas.
[ ] AGENTS.md ya no obliga a usar Expo.
[ ] GitHub Actions compila el proyecto Android.
[ ] mobile_expo_backup/ sigue disponible durante la validación.
[ ] El avance y los problemas encontrados están documentados.
```

---

## 12. Criterios de rollback

Si la migración no puede completarse:

- No eliminar `mobile_expo_backup/`.
- No mezclar cambios incompletos con `main`.
- Mantener commits separados por fase.
- Revertir únicamente el commit de la fase defectuosa.
- Registrar el bloqueo técnico en el documento de avance.
- No reemplazar la aplicación Expo estable hasta que el APK CLI esté validado.

---

## 13. Entrega final esperada

Codex debe entregar:

1. Resumen de cambios.
2. Lista de dependencias eliminadas.
3. Lista de dependencias agregadas.
4. Archivos Android incorporados.
5. Comandos de validación ejecutados.
6. Resultado de Jest.
7. Resultado de Gradle.
8. Ruta del APK generado.
9. Pruebas funcionales realizadas.
10. Riesgos pendientes.
11. Commits creados.
12. Pull request en borrador hacia `main`.

El PR debe permanecer en estado draft hasta que el APK sea probado en un dispositivo Android y las funciones críticas sean aprobadas.

---

## 14. Instrucción directa para Codex

Ejecuta esta migración por fases en la rama `refactor/mobile-react-native-cli`.

Antes de modificar archivos, inspecciona el estado real del repositorio y registra la línea base. No sustituyas funcionalidad existente. No elimines el respaldo Expo. No avances a la siguiente fase si la validación de la fase actual falla.

La tarea no está completada hasta que `mobile/android/gradlew assembleDebug` genere un APK instalable y GitHub Actions valide el build Android.