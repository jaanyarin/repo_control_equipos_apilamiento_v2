# Avance de migracion Expo a React Native CLI

## Fase 0 - Linea base

Fecha: 2026-07-13
Rama: `refactor/mobile-react-native-cli`
Commit de referencia: `320cbbd`

### Estado Git previo

- La rama activa es la rama de migracion solicitada.
- `main` no fue modificada.
- Existian cambios locales previos no relacionados en el root: `package.json` y `package-lock.json`. Se conservaron y no se incluyeron en los commits de esta migracion.
- `mobile_expo_backup/` existe y se conserva.

### Entorno

- Node: `v26.4.0`
- npm: `12.0.0`
- Java: OpenJDK `17.0.19`
- `ANDROID_HOME` y `ANDROID_SDK_ROOT`: no definidos en el proceso de diagnostico.
- `JAVA_HOME`: definido hacia Eclipse Temurin JDK 17.

### Estado real de `mobile/`

- Proyecto Expo SDK `~54.0.35`.
- React Native `0.81.5` y React `19.1.0`.
- `main` apunta a `expo/AppEntry`.
- Scripts de inicio, Android, prebuild y EAS dependen de Expo.
- `mobile/android/` no esta versionado; `.gitignore` contiene `mobile/android/` y `mobile/ios/`.
- No existe `mobile/index.js`, `mobile/metro.config.js` ni `mobile/react-native.config.js`.
- `mobile_cli/` existe como intento previo, pero usa React Native `0.86.0` y no se considera base final.

### Tests baseline

Comando: `npm test -- --runInBand`

Resultado: no finalizo ni produjo salida dentro de 120 segundos; se cancelo para evitar dejar el proceso bloqueado. Una segunda ejecucion controlada con `--detectOpenHandles --forceExit` presento el mismo comportamiento. La causa queda pendiente de aislar tras preparar la configuracion CLI.

### Imports y dependencias Expo detectados

Imports funcionales:

- `mobile/App.js`: `expo-status-bar`.
- `mobile/src/api.js`: `expo-secure-store`.

Configuracion o dependencias Expo detectadas: `expo`, `expo-asset`, `expo-auth-session`, `expo-constants`, `expo-dev-client`, `expo-font`, `expo-linking`, `expo-secure-store`, `expo-status-bar`, `expo-web-browser`, `babel-preset-expo`, `jest-expo`, scripts Expo/EAS y plugins Expo en `app.json`.

### Dependencias funcionales a conservar

React Navigation, React Native Paper, safe-area-context, screens, vector-icons, Axios, React Hook Form, Zod y las pantallas existentes de autenticacion, equipos, averias, catalogos, usuarios, roles, auditoria, PSR y configuracion.

### Resultado de Fase 0

Diagnostico registrado. Se puede iniciar la Fase 1: generar y validar una base React Native CLI `0.81.5` / React `19.1.0` antes de integrar el codigo funcional existente.

## Fase 1 - Base CLI temporal

### Generacion

La plantilla se genero correctamente en `ApilamientoMobileCli/` con React Native CLI `0.81.5`, React `19.1.0`, titulo `Control de Equipos` y package Android `com.apilamiento.mobile`. La instalacion de npm finalizo correctamente tras ampliar el timeout.

### Validacion Gradle

La primera ejecucion fallo porque `ANDROID_HOME` no estaba definido. Se localizo el SDK en `C:\Users\jose.anyarin\AppData\Local\Android\Sdk` y se repitio la validacion con esa variable.

La segunda ejecucion fallo en `:app:checkDebugAarMetadata` por `AccessDeniedException` al mover transformaciones en el cache Gradle global. Se repitio con `GRADLE_USER_HOME` aislado dentro de la carpeta temporal y despues con `--no-parallel --max-workers=1`; ambas ejecuciones volvieron a fallar al mover transformaciones con `AccessDeniedException`.

Resultado: Fase 1 bloqueada por el entorno Windows/Sophos durante la validacion Gradle. No se copio la base temporal a `mobile/`, no se modifico `mobile/` y no se genero `app-debug.apk`. No se debe avanzar a la Fase 2 hasta que la base vacia compile correctamente.

### Reintento de desbloqueo

Se genero una segunda base limpia fuera del repositorio, en la carpeta temporal del sistema, y se instalaron `854` paquetes correctamente. La compilacion se repitio con:

- SDK Android configurado mediante `ANDROID_HOME` y `ANDROID_SDK_ROOT`.
- `GRADLE_USER_HOME` nuevo fuera del repositorio.
- `--no-daemon --no-parallel --max-workers=1`.
- `-Dorg.gradle.vfs.watch=false`.

El fallo continuo con `AccessDeniedException` al mover workspaces temporales de `caches/8.14.3/transforms` a su destino inmutable. Un movimiento manual equivalente dentro del mismo directorio si funciona, lo que confirma interferencia de bloqueo de archivos durante Gradle y no un problema de package Android, Java o SDK.

Desbloqueo requerido antes de continuar: excluir del analisis en tiempo real de Sophos/antivirus las carpetas de proyecto y cache Gradle, o ejecutar la validacion en un entorno Windows/Linux sin ese bloqueo. No se autoriza cambiar la version Gradle/RN de forma arbitraria.

### Resolucion y resultado

La validacion se completo en una plantilla limpia React Native CLI `0.81.5` / React `19.1.0`. Windows bloqueaba el renombrado atomico de workspaces Gradle; se normalizaron los workspaces temporales pendientes dentro de un cache de prueba y Gradle pudo continuar. Tambien se uso una ruta corta (`C:\rn`) para evitar el limite de 260 caracteres de Ninja/CMake.

Comando validado:

```powershell
./gradlew.bat assembleDebug --no-daemon --no-parallel --max-workers=1
```

Resultado: `BUILD SUCCESSFUL` y APK generado en `C:\rn\android\app\build\outputs\apk\debug\app-debug.apk` (101,539,425 bytes).

La base Android CLI se incorporo a `mobile/android/` sin caches, APK, `local.properties` ni keystores. Se conserva `mobile_expo_backup/`.
