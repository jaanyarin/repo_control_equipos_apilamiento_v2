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
