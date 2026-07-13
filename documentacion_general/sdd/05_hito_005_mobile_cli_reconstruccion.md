# HDT-005 — Reconstrucción Mobile React Native CLI

| Campo | Valor |
|---|---|
| Estado | Planificado — pendiente de plan-review del Auditor AI |
| Responsable de desarrollo | Codex |
| Gate keeper | Auditor AI |
| Rama | `refactor/mobile-react-native-cli` |
| Dependencia | ADR-A005 aprobado |

## Objetivo

Construir una nueva aplicación Android con React Native CLI, sin reutilizar el
código Expo existente, que consuma la API actual y recupere los flujos
operativos aprobados del sistema.

## Alcance de reconstrucción

1. Base Android React Native CLI, APK debug y ejecución en dispositivo.
2. Arquitectura modular, tema MD3, navegación y manejo de errores.
3. Autenticación local, cambio de contraseña, sesión JWT y API configurable.
4. Flujos: Home, equipos, averías, campañas, catálogos, usuarios, roles,
   auditoría, PSR/OSR y configuración.
5. Pruebas, CI Android y documentación de operación.

## Secuencia y gates

| Fase | Entregable | Gates del Auditor AI |
|---|---|---|
| A | ADR, alcance, riesgos y criterios de aceptación | G-DOC |
| B | Base CLI y APK debug instalada | G-MOB-BUILD, G-DEVOPS |
| C | Navegación, tema, red, AuthContext y Keychain | G-MOB, G-MOB-NAV, G-MOB-SEC, G-MOB-UI |
| D | Login, cambio de contraseña y configuración API | G-MOB-FORM, G-TEST-FE |
| E | Módulos operativos por prioridad | G-MOB, G-MOB-FORM, G-TEST-FE |
| F | Release candidate, CI, pruebas dispositivo y auditoría | G-MOB-BUILD, G-DEVOPS, G-DOC |

## Criterios de aceptación del hito

- `mobile/` no contiene dependencias ni configuración Expo.
- La app usa React Native CLI, `index.js` y Android versionado.
- `com.apilamiento.mobile` y el deep link `com.apilamiento://callback/` se mantienen.
- JWT se persiste con `react-native-keychain`.
- Jest, lint, Gradle `assembleDebug` y CI finalizan correctamente.
- Se instala `app-debug.apk` en dispositivo Android y se prueban los flujos críticos.
- No existen hallazgos críticos abiertos del Auditor AI.

## Riesgos iniciales

- El bloqueo Windows/Sophos sobre cachés Gradle impide actualmente el primer build.
- La reconstrucción completa puede introducir diferencias funcionales; cada flujo
  requiere evidencia de prueba contra la API.
- El alcance offline permanece excluido por el plan oficial del proyecto.
