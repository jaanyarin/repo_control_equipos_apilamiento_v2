# ADR-A005 — Reconstrucción mobile con React Native CLI

| Campo | Valor |
|---|---|
| Estado | Propuesto para revisión del Auditor AI |
| Fecha | 2026-07-13 |
| Hito | HDT-005 |
| Rama | `refactor/mobile-react-native-cli` |
| Decisión | Sustituir `mobile/` por una aplicación React Native CLI nueva |

## Contexto

La aplicación mobile basada en Expo no se migrará incrementalmente. El
responsable del proyecto autoriza iniciar una nueva aplicación Android desde
cero y tratar los commits y documentos anteriores como referencia histórica.

## Decisión

Se reemplazará el contenido de `mobile/` por una base React Native CLI con
React Native `0.81.5` y React `19.1.0`. La nueva aplicación usará:

- Android nativo con package `com.apilamiento.mobile`.
- Gradle para APK/AAB y React Native CLI para desarrollo.
- React Native Paper (MD3), React Navigation, Axios, React Hook Form y Zod.
- `react-native-keychain` para JWT.
- Arquitectura por features y separación entre UI, navegación, estado y servicios.

No se reutilizará código fuente Expo. `mobile_expo_backup/` se conserva durante
HDT-005 como evidencia y rollback, pero queda fuera de la implementación y de
las validaciones de la nueva app.

## Consecuencias

- Se elimina la dependencia funcional de Expo, Expo Go, EAS y SecureStore.
- Todas las pantallas se reconstruyen y prueban nuevamente contra la API actual.
- El primer gate obligatorio es generar e instalar `app-debug.apk` en Android.
- La app es Android online-only; el gate de offline no aplica al alcance oficial.
- No se declara cierre hasta aprobar G-MOB, G-MOB-NAV, G-MOB-SEC,
  G-MOB-FORM, G-MOB-UI, G-MOB-BUILD, G-TEST-FE, G-DOC y G-DEVOPS.

## Criterio de aprobación

El Auditor AI debe aprobar este ADR y el plan HDT-005 antes de la eliminación
del contenido actual de `mobile/`.
